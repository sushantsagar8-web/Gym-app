import { COOKIE_NAME } from "../shared/const.js";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { estimateFoodMacros, estimateNaturalLanguageFoodLocally } from "../shared/food-macro-estimator";
import { getFoodClarification } from "../shared/food-reference-search";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  food: router({
    parseNaturalLanguage: publicProcedure
      .input(z.object({ sentence: z.string().trim().min(3).max(500) }))
      .mutation(async ({ input }) => {
        try {
        const response = await invokeLLM({
          model: "gpt-5-mini",
          maxTokens: 1400,
          messages: [
            {
              role: "system",
              content: [
                "You extract food logs for a fitness app.",
                "Return JSON only with this shape: {items:[{name,portionText,grams,calories,proteinGrams,carbsGrams,fatGrams,confidence,notes}],totals:{calories,proteinGrams,carbsGrams,fatGrams},warnings:string[]}.",
                "Extract every distinct food and portion mentioned. Convert household portions to approximate grams.",
                "Estimate macros using ordinary cooked food values; do not claim medical precision.",
                "Use confidence from 0 to 1. If portion or food is unclear, use a conservative estimate and explain it in notes or warnings.",
                "All numeric values must be non-negative. Round grams and calories to whole numbers.",
              ].join(" "),
            },
            { role: "user", content: input.sentence },
          ],
          response_format: { type: "json_object" },
        });

        const raw = response.choices?.[0]?.message?.content;
        const text = typeof raw === "string" ? raw : "";
        let parsed: unknown;
        try {
          parsed = JSON.parse(text);
        } catch {
          throw new Error("The food estimate could not be read. Please enter the macros manually.");
        }

        const result = parsed as {
          items?: unknown;
          totals?: unknown;
          warnings?: unknown;
        };
        const items = Array.isArray(result.items) ? result.items : [];
        const normalizedItems = items
          .map((item) => {
            const value = item as Record<string, unknown>;
            const number = (key: string) => Math.max(0, Math.round(Number(value[key]) || 0));
            const confidence = Math.min(1, Math.max(0, Number(value.confidence) || 0));
            const name = String(value.name ?? "Food item").trim().slice(0, 100);
            const grams = number("grams");
            const referenceEstimate = estimateFoodMacros(name, grams);
            return {
              name,
              portionText: String(value.portionText ?? "Approximate portion").trim().slice(0, 120),
              grams,
              calories: referenceEstimate?.calories ?? number("calories"),
              proteinGrams: referenceEstimate?.proteinGrams ?? number("proteinGrams"),
              carbsGrams: referenceEstimate?.carbsGrams ?? number("carbsGrams"),
              fatGrams: referenceEstimate?.fatGrams ?? number("fatGrams"),
              confidence: Math.round(confidence * 100) / 100,
              notes: [
                String(value.notes ?? "").trim(),
                referenceEstimate ? `Matched ${referenceEstimate.matchedFood ?? "reference food"} from ${referenceEstimate.source ?? "nutrition reference"}.` : "",
              ].filter(Boolean).join(" ").slice(0, 240),
              clarificationQuestions: getFoodClarification(referenceEstimate?.reference ?? null, name, String(value.portionText ?? "")).questions,
            };
          })
          .filter((item) => item.name.length > 0);

        const totalsValue = (result.totals ?? {}) as Record<string, unknown>;
        const total = (key: string) => Math.max(0, Math.round(Number(totalsValue[key]) || 0));
        const sum = (key: "calories" | "proteinGrams" | "carbsGrams" | "fatGrams") =>
          normalizedItems.reduce((totalValue, item) => totalValue + item[key], 0);
        return {
          items: normalizedItems,
          totals: {
            calories: normalizedItems.length ? sum("calories") : total("calories"),
            proteinGrams: normalizedItems.length ? sum("proteinGrams") : total("proteinGrams"),
            carbsGrams: normalizedItems.length ? sum("carbsGrams") : total("carbsGrams"),
            fatGrams: normalizedItems.length ? sum("fatGrams") : total("fatGrams"),
          },
          warnings: Array.isArray(result.warnings)
            ? result.warnings.map((warning) => String(warning)).filter(Boolean).slice(0, 5)
            : ["This is an approximate estimate. Review it before saving."],
        };
        } catch {
          return estimateNaturalLanguageFoodLocally(input.sentence) ?? {
            items: [],
            totals: { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 },
            warnings: ["The meal could not be estimated automatically. Enter calories and macros manually."],
          };
        }
      }),
  }),

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
