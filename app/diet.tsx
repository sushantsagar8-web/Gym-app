import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { loadCalorieLedger, saveCalorieLedger, loadCalorieProfile, saveCalorieProfile, loadMacroPreferences, saveMacroPreferences, loadCustomMeals, saveCustomMeals, loadRecentFoodIds, saveRecentFoodIds, loadFavoriteFoodIds, saveFavoriteFoodIds } from "@/lib/local-data";
import { calculateCalories, DEFAULT_CALORIE_PROFILE, DEFAULT_MACRO_PREFERENCES, type ActivityLevel, type CalorieProfile, type MacroPreferences } from "@/shared/calorie-calculator";
import type { CalorieLedgerEntry, CustomMeal, CustomMealItem } from "@/shared/fitpath-models";
import { estimateFoodMacros, estimateNaturalLanguageFoodLocally } from "@/shared/food-macro-estimator";
import { findFoodReference, getFoodClarification, isPreparedFoodReference, searchFoodReferences, type SearchableFoodReference } from "@/shared/food-reference-search";
import { trpc } from "@/lib/trpc";

type Unit = "serving" | "grams";
type DietSection = "diet" | "supplements";

type NaturalLanguageFoodResult = {
  items: Array<{
    name: string;
    portionText: string;
    grams: number;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    confidence: number;
    notes: string;
    clarificationQuestions?: string[];
  }>;
  totals: { calories: number; proteinGrams: number; carbsGrams: number; fatGrams: number };
  warnings: string[];
};

const GRAMS_PER_SERVING = 150;
const numberOr = (value: string, fallback: number) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

const supplements = [
  {
    name: "Protein powder",
    purpose: "A convenient way to increase daily protein when meals do not cover your target.",
    scope: "Use the serving size and protein amount printed on the product label.",
    notes: "Prefer third-party tested products. Count it as part of total daily protein rather than as a replacement for a varied diet.",
  },
  {
    name: "Creatine monohydrate",
    purpose: "Supports repeated high-intensity efforts and strength training over time.",
    scope: "Common maintenance range: 3–5 g per day; consistency matters more than timing.",
    notes: "Choose plain creatine monohydrate and drink enough fluids. Ask a clinician before use if you have kidney disease or a relevant medical condition.",
  },
  {
    name: "Fish oil",
    purpose: "Provides omega-3 fatty acids, mainly EPA and DHA.",
    scope: "Check the label for EPA + DHA rather than total fish-oil weight; stay within the product label unless a clinician advises otherwise.",
    notes: "Use caution with blood-thinning medicines, bleeding disorders, or upcoming surgery. Algae-based omega-3 is a vegetarian alternative.",
  },
  {
    name: "L-carnitine",
    purpose: "Involved in fatty-acid transport; performance and body-composition effects vary by person.",
    scope: "Common studied ranges are approximately 1–2 g per day, but there is no universal personal dose.",
    notes: "It is not a substitute for calorie control, resistance training, or sleep. Discuss use with a clinician if you take thyroid or blood-thinning medicines.",
  },
  {
    name: "Citrulline malate",
    purpose: "Often used before training to support blood flow and training-volume perception.",
    scope: "Common pre-workout study ranges are approximately 6–8 g, taken according to the product directions.",
    notes: "Check for interactions if you use blood-pressure or nitrate medicines, and stop if it causes significant stomach discomfort or dizziness.",
  },
  {
    name: "Electrolytes",
    purpose: "May help replace sodium and other minerals during prolonged, hot, or very sweaty sessions.",
    scope: "Use the label serving and match intake to sweat loss, session length, and climate rather than taking extra by default.",
    notes: "Most everyday workouts do not require a high-sugar electrolyte drink. People with blood-pressure, kidney, or heart conditions should seek individual advice.",
  },
] as const;

export default function DietScreen() {
  const { width } = useWindowDimensions();
  const isCompactPhone = width < 360;
  const [section, setSection] = useState<DietSection>("diet");
  const [ledger, setLedger] = useState<CalorieLedgerEntry[]>([]);
  const [calorieProfile, setCalorieProfile] = useState<CalorieProfile>(DEFAULT_CALORIE_PROFILE);
  const [macroPreferences, setMacroPreferences] = useState<MacroPreferences>(DEFAULT_MACRO_PREFERENCES);
  const [customMeals, setCustomMeals] = useState<CustomMeal[]>([]);
  const [customMealItems, setCustomMealItems] = useState<CustomMealItem[]>([]);
  const [customMealName, setCustomMealName] = useState("");
  const [recentFoodNames, setRecentFoodNames] = useState<string[]>([]);
  const [favoriteFoodNames, setFavoriteFoodNames] = useState<string[]>([]);
  const [clarificationQuestions, setClarificationQuestions] = useState<string[]>([]);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [referenceQuery, setReferenceQuery] = useState("");
  const [referenceRegion, setReferenceRegion] = useState("All");
  const referenceResults = useMemo(() => {
    const results = searchFoodReferences(referenceQuery, referenceQuery.trim() ? 18 : 12);
    return referenceRegion === "All" ? results : results.filter((food) => food.region === referenceRegion);
  }, [referenceQuery, referenceRegion]);
  const [naturalLanguageResult, setNaturalLanguageResult] = useState<NaturalLanguageFoodResult | null>(null);
  const parseFoodMutation = trpc.food.parseNaturalLanguage.useMutation();
  const [editing, setEditing] = useState<{
    id?: string;
    name: string;
    description: string;
    portion: string;
    unit: Unit;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    source: "manual" | "estimate";
  } | null>(null);

  useEffect(() => {
    loadCalorieLedger().then(setLedger);
    loadCalorieProfile().then(setCalorieProfile);
    loadMacroPreferences().then(setMacroPreferences);
    loadCustomMeals().then(setCustomMeals);
    loadRecentFoodIds().then(setRecentFoodNames);
    loadFavoriteFoodIds().then(setFavoriteFoodNames);
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todaysEntries = useMemo(
    () => ledger.filter((entry) => entry.date === today),
    [ledger, today],
  );
  const calorieResult = calculateCalories(calorieProfile, macroPreferences);
  const consumed = todaysEntries
    .filter((entry) => entry.completed)
    .reduce((sum, entry) => sum + entry.calories, 0);
  const consumedProtein = todaysEntries.reduce((sum, item) => sum + (item.completed ? item.proteinGrams ?? 0 : 0), 0);
  const consumedCarbs = todaysEntries.reduce((sum, item) => sum + (item.completed ? item.carbsGrams ?? 0 : 0), 0);
  const consumedFat = todaysEntries.reduce((sum, item) => sum + (item.completed ? item.fatGrams ?? 0 : 0), 0);

  const rememberFood = async (name: string) => {
    const next = [name, ...recentFoodNames.filter((item) => item !== name)].slice(0, 8);
    setRecentFoodNames(next);
    await saveRecentFoodIds(next);
  };

  const toggleFavoriteFood = async (name: string) => {
    const next = favoriteFoodNames.includes(name) ? favoriteFoodNames.filter((item) => item !== name) : [name, ...favoriteFoodNames].slice(0, 20);
    setFavoriteFoodNames(next);
    await saveFavoriteFoodIds(next);
  };

  const openEditor = (existing?: CalorieLedgerEntry) => {
    setClarificationQuestions([]);
    const unit = existing?.portionUnit ?? "grams";
    setEditing({
      id: existing?.id,
      name: existing?.mealName ?? "",
      description: existing?.foodDescription ?? "",
      portion: String(existing?.portionValue ?? 100),
      unit,
      calories: String(existing?.calories ?? ""),
      protein: String(existing?.proteinGrams ?? ""),
      carbs: String(existing?.carbsGrams ?? ""),
      fat: String(existing?.fatGrams ?? ""),
      source: existing?.source === "estimate" ? "estimate" : "manual",
    });
  };

  const changeUnit = (unit: Unit) => {
    if (!editing || editing.unit === unit) return;
    setEditing({ ...editing, unit, portion: unit === "grams" ? String(Math.round(numberOr(editing.portion, 1) * GRAMS_PER_SERVING)) : "1" });
  };

  const applyQuantityPreset = (amount: number, unit: Unit) => {
    if (!editing) return;
    const grams = unit === "grams" ? amount : amount * GRAMS_PER_SERVING;
    const estimate = estimateFoodMacros(editing.description || editing.name, grams);
    setEditing({ ...editing, description: editing.description || editing.name, portion: String(amount), unit, ...(estimate ? { calories: String(estimate.calories), protein: String(estimate.proteinGrams), carbs: String(estimate.carbsGrams), fat: String(estimate.fatGrams), source: "estimate" as const } : {}) });
  };

  const addReferenceToCustomMeal = (food: SearchableFoodReference) => {
    const item: CustomMealItem = { id: `${food.id}-${Date.now()}`, name: food.name, portionValue: isPreparedFoodReference(food) ? food.servingCount : 100, portionUnit: isPreparedFoodReference(food) ? "serving" : "grams", calories: food.calories, proteinGrams: food.protein, carbsGrams: food.carbs, fatGrams: food.fat, sourceFoodId: food.id };
    setCustomMealItems((items) => items.some((existing) => existing.sourceFoodId === food.id) ? items : [...items, item]);
  };

  const saveCustomMealTemplate = async () => {
    const name = customMealName.trim();
    if (!name || customMealItems.length === 0) return;
    const now = new Date().toISOString();
    const meal: CustomMeal = { id: `custom-meal-${Date.now()}`, name, items: customMealItems, calories: customMealItems.reduce((sum, item) => sum + item.calories, 0), proteinGrams: customMealItems.reduce((sum, item) => sum + item.proteinGrams, 0), carbsGrams: customMealItems.reduce((sum, item) => sum + item.carbsGrams, 0), fatGrams: customMealItems.reduce((sum, item) => sum + item.fatGrams, 0), createdAt: now, updatedAt: now };
    const next = [meal, ...customMeals];
    setCustomMeals(next);
    await saveCustomMeals(next);
    setCustomMealName("");
    setCustomMealItems([]);
  };

  const logCustomMeal = async (meal: CustomMeal) => {
    const entry: CalorieLedgerEntry = { id: `macro-${Date.now()}`, date: today, mealName: meal.name, calories: meal.calories, proteinGrams: meal.proteinGrams, carbsGrams: meal.carbsGrams, fatGrams: meal.fatGrams, portionValue: 1, portionUnit: "serving", source: "template", foodDescription: meal.items.map((item) => item.name).join(", "), completed: true };
    const next = [...ledger, entry];
    setLedger(next);
    await saveCalorieLedger(next);
  };

  const estimateEntry = () => {
    if (!editing) return;
    const grams = editing.unit === "grams" ? numberOr(editing.portion, 100) : numberOr(editing.portion, 1) * GRAMS_PER_SERVING;
    const description = editing.description || editing.name;
    const estimate = estimateFoodMacros(description, grams);
    const clarification = getFoodClarification(findFoodReference(description), description, `${editing.portion} ${editing.unit}`);
    setClarificationQuestions(clarification.questions);
    if (!estimate) return;
    void rememberFood(editing.name || editing.description);
    setEditing({ ...editing, name: editing.name || editing.description, unit: "grams", portion: String(Math.round(grams)), calories: String(estimate.calories), protein: String(estimate.proteinGrams), carbs: String(estimate.carbsGrams), fat: String(estimate.fatGrams), source: "estimate" });
  };

  const parseNaturalLanguageFood = async () => {
    const sentence = naturalLanguageInput.trim();
    if (sentence.length < 3) return;
    try {
      const result = await parseFoodMutation.mutateAsync({ sentence });
      const normalizedResult = result as NaturalLanguageFoodResult;
      if (normalizedResult.items.length > 0) {
        setNaturalLanguageResult(normalizedResult);
        return;
      }
      throw new Error("The AI returned no food items.");
    } catch {
      const localResult = estimateNaturalLanguageFoodLocally(sentence);
      parseFoodMutation.reset();
      setNaturalLanguageResult(localResult as NaturalLanguageFoodResult | null);
    }
  };

  const reviewNaturalLanguageResult = () => {
    if (!naturalLanguageResult) return;
    setEditing({
      name: naturalLanguageResult.items.map((item) => item.name).join(", ") || "Natural-language food entry",
      description: naturalLanguageInput.trim(),
      portion: String(naturalLanguageResult.items.reduce((sum, item) => sum + item.grams, 0) || 100),
      unit: "grams",
      calories: String(naturalLanguageResult.totals.calories),
      protein: String(naturalLanguageResult.totals.proteinGrams),
      carbs: String(naturalLanguageResult.totals.carbsGrams),
      fat: String(naturalLanguageResult.totals.fatGrams),
      source: "estimate",
    });
  };

  const saveMeal = async () => {
    if (!editing || !editing.name.trim()) return;
    const entry: CalorieLedgerEntry = {
      id: editing.id ?? `macro-${Date.now()}`,
      date: today,
      mealName: editing.name.trim(),
      calories: numberOr(editing.calories, 0),
      proteinGrams: numberOr(editing.protein, 0),
      carbsGrams: numberOr(editing.carbs, 0),
      fatGrams: numberOr(editing.fat, 0),
      portionValue: numberOr(editing.portion, 1),
      portionUnit: editing.unit,
      source: editing.source,
      foodDescription: editing.description.trim() || undefined,
      completed: true,
    };
    const next = editing.id
      ? ledger.map((item) => (item.id === editing.id ? entry : item))
      : [...ledger, entry];
    setLedger(next);
    await saveCalorieLedger(next);
    setEditing(null);
  };

  const removeMeal = async (id: string) => {
    const next = ledger.filter((item) => item.id !== id);
    setLedger(next);
    await saveCalorieLedger(next);
  };

  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="gap-7 pt-3">
          <View className="gap-2">
            <Text className="text-sm font-medium text-muted">YOUR NUTRITION</Text>
            <Text className="text-3xl font-semibold text-foreground">Fuel your rhythm</Text>
            <Text className="text-base leading-6 text-muted">
              Plan meals, track portions, and learn how common supplements fit into a balanced routine.
            </Text>
          </View>

          <View className="flex-row rounded-2xl border border-border bg-surface p-1">
            <DietSwitch label="Diet" active={section === "diet"} onPress={() => setSection("diet")} />
            <DietSwitch label="Supplementation" active={section === "supplements"} onPress={() => setSection("supplements")} />
          </View>

          {section === "supplements" ? (
            <SupplementationSection />
          ) : (
            <>
              <CalorieCalculatorSection profile={calorieProfile} onChange={setCalorieProfile} macroPreferences={macroPreferences} onMacroChange={setMacroPreferences} />

              <View className="gap-4 rounded-[26px] bg-primary p-6">
                <Text className="text-sm font-semibold text-white/75">TODAY’S LEDGER</Text>
                <Text className="text-4xl font-semibold text-white">
                  {consumed} <Text className="text-base font-normal text-white/75">/ {calorieResult.targetCalories} kcal</Text>
                </Text>
                <View className="h-2 overflow-hidden rounded-full bg-white/25">
                  <View style={{ width: `${Math.min(100, calorieResult.targetCalories > 0 ? (consumed / calorieResult.targetCalories) * 100 : 0)}%`, height: 8, backgroundColor: "#FFFFFF", borderRadius: 999 }} />
                </View>
                <Text className="text-sm leading-5 text-white/75">
                  A starting estimate only—not medical or dietetic advice.
                </Text>
              </View>

              <View style={{ flexDirection: isCompactPhone ? "column" : "row", gap: 12 }}>
                <Metric compact={isCompactPhone} label={`Protein / ${calorieResult.macros.proteinGrams}g`} value={`${consumedProtein}g`} />
                <Metric compact={isCompactPhone} label={`Carbs / ${calorieResult.macros.carbsGrams}g`} value={`${consumedCarbs}g`} />
                <Metric compact={isCompactPhone} label={`Fat / ${calorieResult.macros.fatGrams}g`} value={`${consumedFat}g`} />
              </View>
              <View className="gap-3 rounded-2xl border border-border bg-surface p-4"><Text className="text-sm font-semibold text-foreground">Macro progress</Text><MacroProgress label="Protein" consumed={consumedProtein} target={calorieResult.macros.proteinGrams} color="#F59E0B" /><MacroProgress label="Carbs" consumed={consumedCarbs} target={calorieResult.macros.carbsGrams} color="#0A7EA4" /><MacroProgress label="Fats" consumed={consumedFat} target={calorieResult.macros.fatGrams} color="#8B5CF6" /></View>

              <View className="gap-3 rounded-[26px] border border-border bg-surface p-5">
                <View className="gap-1"><Text className="text-xs font-bold uppercase tracking-wide text-primary">Daily macro ledger</Text><Text className="text-xl font-semibold text-foreground">Record what you ate</Text><Text className="text-sm leading-5 text-muted">Enter the calories and macros from your food label or estimate a common food by description and portion.</Text></View>
                <Pressable onPress={() => openEditor()} style={{ backgroundColor: "#174A3B", borderRadius: 999, paddingVertical: 14, alignItems: "center" }}><Text className="font-semibold text-white">Add macro entry</Text></Pressable>
              </View>

              <View className="gap-3 rounded-[26px] border border-primary/30 bg-primary-soft p-5">
                <View className="gap-1">
                  <Text className="text-xs font-bold uppercase tracking-wide text-primary">AI food logger</Text>
                  <Text className="text-xl font-semibold text-foreground">Describe what you ate</Text>
                  <Text className="text-sm leading-5 text-muted">Example: “2 eggs, one bowl of rice, and 150 g grilled chicken.” Review the estimate before saving.</Text>
                </View>
                <TextInput
                  value={naturalLanguageInput}
                  onChangeText={(value) => { setNaturalLanguageInput(value); setNaturalLanguageResult(null); }}
                  placeholder="Write one sentence about your food"
                  placeholderTextColor="#687076"
                  multiline
                  maxLength={500}
                  className="min-h-[84px] rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground"
                  textAlignVertical="top"
                />
                <Pressable onPress={parseNaturalLanguageFood} disabled={parseFoodMutation.isPending || naturalLanguageInput.trim().length < 3} style={{ backgroundColor: parseFoodMutation.isPending ? "#8AA99D" : "#174A3B", borderRadius: 999, paddingVertical: 14, alignItems: "center" }}>
                  <Text className="font-semibold text-white">{parseFoodMutation.isPending ? "Estimating…" : "Estimate with AI"}</Text>
                </Pressable>
                {parseFoodMutation.isError ? <Text className="text-sm leading-5 text-error">The estimate could not be loaded. You can enter the macros manually below.</Text> : null}
                {naturalLanguageResult ? (
                  <View className="gap-3 rounded-2xl border border-border bg-surface p-4">
                    <Text className="text-base font-semibold text-foreground">Review estimate</Text>
                    {naturalLanguageResult.items.map((item, index) => (
                      <View key={`${item.name}-${index}`} className="gap-1 border-b border-border pb-2">
                        <Text className="font-semibold text-foreground">{item.name} · {item.portionText}</Text>
                        <Text className="text-sm text-muted">{item.calories} kcal · {item.proteinGrams}g protein · {item.carbsGrams}g carbs · {item.fatGrams}g fat · {Math.round(item.confidence * 100)}% confidence</Text>
                        {item.notes ? <Text className="text-xs text-muted">{item.notes}</Text> : null}
                        {item.clarificationQuestions?.map((question) => <Text key={question} className="text-xs font-semibold leading-5 text-warning">Clarify: {question}</Text>)}
                      </View>
                    ))}
                    <Text className="text-sm font-semibold text-foreground">Total: {naturalLanguageResult.totals.calories} kcal · {naturalLanguageResult.totals.proteinGrams}g protein · {naturalLanguageResult.totals.carbsGrams}g carbs · {naturalLanguageResult.totals.fatGrams}g fat</Text>
                    {naturalLanguageResult.warnings.map((warning, index) => <Text key={`${warning}-${index}`} className="text-xs leading-5 text-muted">{warning}</Text>)}
                    <Pressable onPress={reviewNaturalLanguageResult} style={{ borderColor: "#174A3B", borderWidth: 1, borderRadius: 999, paddingVertical: 12, alignItems: "center" }}>
                      <Text className="font-semibold text-primary">Review in ledger form</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>

              <View className="gap-3 rounded-[26px] border border-primary/30 bg-primary-soft p-5">
                <View className="gap-1"><Text className="text-xs font-bold uppercase tracking-wide text-primary">Custom meals</Text><Text className="text-xl font-semibold text-foreground">Build once, log in one tap</Text><Text className="text-sm leading-5 text-muted">Add foods from the reference list, save the combination, and reuse its verified serving totals.</Text></View>
                <TextInput value={customMealName} onChangeText={setCustomMealName} placeholder="Name this meal, e.g. Post-workout bowl" placeholderTextColor="#687076" className="rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground" />
                {customMealItems.length > 0 ? <View className="gap-1 rounded-2xl border border-border bg-surface p-3">{customMealItems.map((item) => <Text key={item.id} className="text-sm text-foreground">{item.name} · {item.portionValue} {item.portionUnit}</Text>)}<Text className="mt-1 text-sm font-semibold text-primary">Total · {Math.round(customMealItems.reduce((sum, item) => sum + item.calories, 0))} kcal</Text></View> : <Text className="text-sm text-muted">No foods selected yet. Use “Add to custom meal” below.</Text>}
                <Pressable onPress={saveCustomMealTemplate} disabled={!customMealName.trim() || customMealItems.length === 0} style={{ backgroundColor: !customMealName.trim() || customMealItems.length === 0 ? "#AABAB2" : "#174A3B", borderRadius: 999, paddingVertical: 14, alignItems: "center" }}><Text className="font-semibold text-white">Save custom meal</Text></Pressable>
                {customMeals.map((meal) => <View key={meal.id} className="gap-2 rounded-2xl border border-border bg-background p-3"><View className="flex-row items-center justify-between gap-2"><Text className="flex-1 font-semibold text-foreground">{meal.name}</Text><Text className="text-sm font-semibold text-primary">{Math.round(meal.calories)} kcal</Text></View><Text className="text-xs text-muted">{meal.items.map((item) => item.name).join(" · ")}</Text><Pressable onPress={() => logCustomMeal(meal)} style={{ borderColor: "#174A3B", borderWidth: 1, borderRadius: 999, paddingVertical: 10, alignItems: "center" }}><Text className="font-semibold text-primary">Log this meal today</Text></Pressable></View>)}
              </View>

              <View className="gap-3 rounded-[26px] border border-border bg-surface p-5">
                <View className="gap-1">
                  <Text className="text-xs font-bold uppercase tracking-wide text-primary">Food reference</Text>
                  <Text className="text-xl font-semibold text-foreground">Search foods and prepared dishes</Text>
                  <Text className="text-sm leading-5 text-muted">Browse sourced values before logging. Prepared dishes use the stated household serving and can vary with recipe, oil, and cooking method.</Text>
                </View>
                {favoriteFoodNames.length > 0 ? <View className="gap-2"><Text className="text-xs font-bold uppercase tracking-wide text-muted">Favorites</Text><View className="flex-row flex-wrap gap-2">{favoriteFoodNames.map((name) => <Pressable key={`favorite-${name}`} onPress={() => { setReferenceQuery(name); setNaturalLanguageInput(name); void rememberFood(name); }} style={{ borderRadius: 999, borderWidth: 1, borderColor: "#174A3B", backgroundColor: "#DCEBE3", paddingHorizontal: 10, paddingVertical: 8 }}><Text className="text-xs font-semibold text-primary">★ {name}</Text></Pressable>)}</View></View> : null}
                {recentFoodNames.length > 0 ? <View className="gap-2"><Text className="text-xs font-bold uppercase tracking-wide text-muted">Recent foods</Text><View className="flex-row flex-wrap gap-2">{recentFoodNames.map((name) => <Pressable key={`recent-${name}`} onPress={() => { setReferenceQuery(name); setNaturalLanguageInput(name); }} style={{ borderRadius: 999, borderWidth: 1, borderColor: "#E6E7E2", backgroundColor: "#FFFFFF", paddingHorizontal: 10, paddingVertical: 8 }}><Text className="text-xs font-semibold text-foreground">{name}</Text></Pressable>)}</View></View> : null}
                <TextInput value={referenceQuery} onChangeText={setReferenceQuery} placeholder="Search rice, paneer, dosa, pasta…" placeholderTextColor="#687076" className="rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground" />
                <View className="flex-row flex-wrap gap-2">
                  {["All", "India", "Asia", "Americas", "Europe"].map((region) => <Pressable key={region} onPress={() => setReferenceRegion(region)} style={{ borderRadius: 999, borderWidth: 1, borderColor: referenceRegion === region ? "#174A3B" : "#E6E7E2", backgroundColor: referenceRegion === region ? "#DCEBE3" : "#FFFFFF", paddingHorizontal: 12, paddingVertical: 8 }}><Text className={referenceRegion === region ? "text-xs font-semibold text-primary" : "text-xs font-semibold text-foreground"}>{region}</Text></Pressable>)}
                </View>
                {referenceResults.map((food) => (
                  <Pressable key={food.id} onPress={() => { setNaturalLanguageInput(food.name); setReferenceQuery(food.name); }} style={({ pressed }) => [{ borderRadius: 16, borderWidth: 1, borderColor: "#E6E7E2", padding: 12, backgroundColor: "#FFFFFF" }, pressed && { opacity: 0.78 }]}>
                    <View className="gap-1">
                      <View className="flex-row items-center justify-between gap-2"><Text className="flex-1 font-semibold text-foreground">{food.name}</Text><Text className="text-xs font-semibold text-primary">{food.region}</Text></View>
                      <Text className="text-xs text-muted">{isPreparedFoodReference(food) ? `${food.basis} · prepared dish` : `${food.basis} · ${food.state}`}</Text>
                      <Text className="text-sm text-muted">{Math.round(food.calories)} kcal · {Math.round(food.protein)}g protein · {Math.round(food.carbs)}g carbs · {Math.round(food.fat)}g fat</Text>
                      {isPreparedFoodReference(food) ? <Text className="text-xs leading-5 text-warning">Serving guide: {food.servingCount} {food.servingUnit}. Tap to use this name in the logger.</Text> : null}
                      <View className="flex-row flex-wrap gap-2"><Pressable onPress={() => addReferenceToCustomMeal(food)} style={{ alignSelf: "flex-start", borderColor: "#174A3B", borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 }}><Text className="text-xs font-semibold text-primary">Add to custom meal</Text></Pressable><Pressable onPress={() => toggleFavoriteFood(food.name)} style={{ alignSelf: "flex-start", borderColor: "#E6E7E2", borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 }}><Text className="text-xs font-semibold text-foreground">{favoriteFoodNames.includes(food.name) ? "★ Favorited" : "☆ Favorite"}</Text></Pressable></View>
                    </View>
                  </Pressable>
                ))}
                {referenceResults.length === 0 ? <Text className="text-sm text-muted">No matching reference foods. Try a broader search or enter the macros manually.</Text> : null}
              </View>

              {editing && (
                <View className="gap-3 rounded-[26px] bg-primary-soft p-5">
                  <View className="flex-row items-center justify-between"><Text className="text-lg font-semibold text-primary">{editing.id ? "Edit macro entry" : "Add macro entry"}</Text><Pressable onPress={() => setEditing(null)}><Text className="font-semibold text-muted">Cancel</Text></Pressable></View>
                  <Field label="Food or entry name" value={editing.name} onChangeText={(value) => setEditing({ ...editing, name: value })} />
                  <Field label="What did you eat? (optional estimate input)" value={editing.description} onChangeText={(value) => setEditing({ ...editing, description: value })} />
                  <View className="flex-row gap-2"><Choice label="Serving" active={editing.unit === "serving"} onPress={() => changeUnit("serving")} /><Choice label="Grams" active={editing.unit === "grams"} onPress={() => changeUnit("grams")} /></View>
                  <View className="gap-2"><Text className="text-xs font-semibold uppercase tracking-wide text-muted">Quick quantity</Text><View className="flex-row flex-wrap gap-2"><Pressable onPress={() => applyQuantityPreset(1, "serving")} style={{ borderColor: "#174A3B", borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}><Text className="text-xs font-semibold text-primary">1 serving</Text></Pressable><Pressable onPress={() => applyQuantityPreset(1, "grams")} style={{ borderColor: "#174A3B", borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}><Text className="text-xs font-semibold text-primary">1 roti / piece</Text></Pressable><Pressable onPress={() => applyQuantityPreset(150, "grams")} style={{ borderColor: "#174A3B", borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}><Text className="text-xs font-semibold text-primary">1 bowl</Text></Pressable><Pressable onPress={() => applyQuantityPreset(30, "grams")} style={{ borderColor: "#174A3B", borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}><Text className="text-xs font-semibold text-primary">1 slice</Text></Pressable></View></View>
                  <Field label={editing.unit === "grams" ? "Portion (g)" : "Portion (servings)"} value={editing.portion} onChangeText={(value) => setEditing({ ...editing, portion: value })} />
                  <Pressable onPress={estimateEntry} style={{ borderColor: "#174A3B", borderWidth: 1, borderRadius: 999, paddingVertical: 12, alignItems: "center" }}><Text className="font-semibold text-primary">Estimate from description</Text></Pressable>
                  {clarificationQuestions.length > 0 ? <View className="gap-1 rounded-2xl border border-warning/40 bg-warning/10 p-3"><Text className="text-sm font-semibold text-warning">Check your portion</Text>{clarificationQuestions.map((question) => <Text key={question} className="text-xs leading-5 text-warning">{question}</Text>)}</View> : null}
                  <Text className="text-xs leading-5 text-muted">Estimates use the sourced food reference when a specific match is available. Review values and portion guidance before saving.</Text>
                  <View style={{ flexDirection: isCompactPhone ? "column" : "row", gap: 8 }}><Field label="Calories" value={editing.calories} onChangeText={(value) => setEditing({ ...editing, calories: value })} /><Field label="Protein (g)" value={editing.protein} onChangeText={(value) => setEditing({ ...editing, protein: value })} /></View>
                  <View style={{ flexDirection: isCompactPhone ? "column" : "row", gap: 8 }}><Field label="Carbs (g)" value={editing.carbs} onChangeText={(value) => setEditing({ ...editing, carbs: value })} /><Field label="Fat (g)" value={editing.fat} onChangeText={(value) => setEditing({ ...editing, fat: value })} /></View>
                  <Pressable onPress={saveMeal} style={{ backgroundColor: "#174A3B", borderRadius: 999, paddingVertical: 14, alignItems: "center" }}><Text className="font-semibold text-white">Save to today’s ledger</Text></Pressable>
                </View>
              )}

              <View className="gap-3">
                <Text className="text-xl font-semibold text-foreground">Today’s logged meals</Text>
                {todaysEntries.length === 0 ? <Text className="text-sm text-muted">No meals logged yet.</Text> : todaysEntries.map((entry) => {
                  return (
                    <View key={entry.id} className="rounded-2xl border border-border bg-surface p-4">
                      <View style={{ flexDirection: isCompactPhone ? "column" : "row", gap: 10 }}>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-foreground">{entry.mealName}</Text>
                          <Text className="mt-1 text-sm text-muted">{entry.portionValue ?? 1} {entry.portionUnit ?? "serving"} · {entry.calories} kcal · {entry.proteinGrams ?? 0}g protein · {entry.carbsGrams ?? 0}g carbs · {entry.fatGrams ?? 0}g fat</Text>
                          {entry.foodDescription ? <Text className="mt-1 text-xs text-muted">{entry.source === "estimate" ? "Approximate estimate · " : ""}{entry.foodDescription}</Text> : null}
                        </View>
                        <View className="flex-row gap-3">
                          <Pressable onPress={() => openEditor(entry)} hitSlop={8}><Text className="text-sm font-semibold text-primary">Edit</Text></Pressable>
                          <Pressable onPress={() => removeMeal(entry.id)}><Text className="text-sm font-semibold text-error">Delete</Text></Pressable>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function CalorieCalculatorSection({ profile, onChange, macroPreferences, onMacroChange }: { profile: CalorieProfile; onChange: (profile: CalorieProfile) => void; macroPreferences: MacroPreferences; onMacroChange: (preferences: MacroPreferences) => void }) {
  const colors = useColors();
  const [saved, setSaved] = useState(false);
  const result = calculateCalories(profile, macroPreferences);
  const update = <K extends keyof CalorieProfile>(key: K, value: CalorieProfile[K]) => { setSaved(false); onChange({ ...profile, [key]: value }); };
  const updatePercent = (key: "proteinPercent" | "carbsPercent" | "fatPercent", raw: string) => { const value = Math.min(90, Math.max(5, Number(raw) || 5)); const others = (["proteinPercent", "carbsPercent", "fatPercent"] as const).filter((item) => item !== key); const oldTotal = others.reduce((sum, item) => sum + macroPreferences[item], 0) || 1; const next = { ...macroPreferences, [key]: value }; next[others[0]] = Math.round((100 - value) * macroPreferences[others[0]] / oldTotal); next[others[1]] = Math.max(0, 100 - next[key] - next[others[0]]); onMacroChange(next); setSaved(false); };
  const updateProteinGrams = (raw: string) => { onMacroChange({ ...macroPreferences, proteinGrams: Math.max(0, Number(raw) || 0) || null }); setSaved(false); };
  const save = async () => { await saveCalorieProfile(profile); await saveMacroPreferences(macroPreferences); setSaved(true); };
  return <View className="gap-4 rounded-[26px] border-2 border-primary bg-primary-soft p-5"><View className="gap-1"><Text className="text-xs font-bold uppercase tracking-wide text-primary">Calorie calculator</Text><Text className="text-xl font-semibold text-foreground">Set your daily calorie target</Text><Text className="text-sm leading-5 text-muted">Uses the Mifflin–St Jeor estimate and your activity level. Treat this as a starting estimate, not medical or dietetic advice.</Text></View><View className="flex-row gap-2"><Choice label="Men" active={profile.sex === "male"} onPress={() => update("sex", "male")} /><Choice label="Women" active={profile.sex === "female"} onPress={() => update("sex", "female")} /></View><View className="flex-row gap-2"><CalorieField label="Age" value={String(profile.age)} onChange={(value) => update("age", Math.max(13, Number(value) || 13))} colors={colors} /><CalorieField label="Height (cm)" value={String(profile.heightCm)} onChange={(value) => update("heightCm", Math.max(100, Number(value) || 100))} colors={colors} /><CalorieField label="Weight (kg)" value={String(profile.weightKg)} onChange={(value) => update("weightKg", Math.max(30, Number(value) || 30))} colors={colors} /></View><Text className="text-sm font-semibold text-foreground">Activity level</Text><View className="flex-row flex-wrap gap-2">{(["sedentary", "light", "moderate", "very-active"] as ActivityLevel[]).map((level) => <Choice key={level} label={level === "very-active" ? "Very active" : level === "moderate" ? "Moderate" : level === "light" ? "Light" : "Sedentary"} active={profile.activity === level} onPress={() => update("activity", level)} />)}</View><Text className="text-sm font-semibold text-foreground">Goal</Text><View className="flex-row gap-2"><Choice label="Lose weight" active={profile.goal === "loss"} onPress={() => update("goal", "loss")} /><Choice label="Maintain" active={profile.goal === "maintain"} onPress={() => update("goal", "maintain")} /><Choice label="Build muscle" active={profile.goal === "gain"} onPress={() => update("goal", "gain")} /></View><View className="flex-row gap-2"><ResultCard label="Maintenance" value={`${result.maintenanceCalories} kcal`} /><ResultCard label="Daily target" value={`${result.targetCalories} kcal`} /></View><Text className="text-sm font-semibold text-foreground">Customize macros</Text><View className="flex-row gap-2"><MacroField label="Protein %" value={String(macroPreferences.proteinPercent)} onChange={(value) => updatePercent("proteinPercent", value)} colors={colors} /><MacroField label="Carbs %" value={String(macroPreferences.carbsPercent)} onChange={(value) => updatePercent("carbsPercent", value)} colors={colors} /><MacroField label="Fats %" value={String(macroPreferences.fatPercent)} onChange={(value) => updatePercent("fatPercent", value)} colors={colors} /></View><MacroField label="Protein target (g, optional)" value={macroPreferences.proteinGrams === null ? "" : String(macroPreferences.proteinGrams)} onChange={updateProteinGrams} colors={colors} /><Text className="text-xs text-muted">Percentages are kept at 100%. A protein gram target overrides the protein percentage.</Text><Text className="text-sm font-semibold text-foreground">Macro breakdown</Text><View className="flex-row gap-2"><ResultCard label="Protein" value={`${result.macros.proteinGrams}g`} /><ResultCard label="Carbs" value={`${result.macros.carbsGrams}g`} /><ResultCard label="Fats" value={`${result.macros.fatGrams}g`} /></View><Text className="text-xs leading-5 text-muted">{profile.goal === "loss" ? "This target uses a moderate deficit." : profile.goal === "gain" ? "This target uses a modest surplus." : "This target matches your estimated maintenance."} Weekly estimate: {result.weeklyChangeKgEstimate > 0 ? "+" : ""}{result.weeklyChangeKgEstimate} kg.</Text><Pressable onPress={() => void save()} style={{ backgroundColor: colors.primary, borderRadius: 999, paddingVertical: 13, alignItems: "center" }}><Text className="font-semibold text-white">{saved ? "Saved calorie target" : "Save calorie target"}</Text></Pressable></View>;
}

function CalorieField({ label, value, onChange, colors }: { label: string; value: string; onChange: (value: string) => void; colors: ReturnType<typeof useColors> }) { return <View className="flex-1 gap-1"><Text className="text-xs font-semibold text-muted">{label}</Text><TextInput value={value} onChangeText={onChange} keyboardType="decimal-pad" className="rounded-xl border border-border bg-background px-2 py-2 text-center text-foreground" placeholderTextColor={colors.muted} /></View>; }
function MacroField({ label, value, onChange, colors }: { label: string; value: string; onChange: (value: string) => void; colors: ReturnType<typeof useColors> }) { return <View className="flex-1 gap-1"><Text className="text-xs font-semibold text-muted">{label}</Text><TextInput value={value} onChangeText={onChange} keyboardType="decimal-pad" className="rounded-xl border border-border bg-background px-2 py-2 text-center text-foreground" placeholderTextColor={colors.muted} /></View>; }
function MacroProgress({ label, consumed, target, color }: { label: string; consumed: number; target: number; color: string }) { const percent = target > 0 ? Math.min(100, (consumed / target) * 100) : 0; return <View className="gap-1"><View className="flex-row justify-between"><Text className="text-sm font-medium text-foreground">{label}</Text><Text className="text-xs text-muted">{Math.round(consumed)}g / {Math.round(target)}g</Text></View><View className="h-2 overflow-hidden rounded-full bg-border"><View style={{ width: `${percent}%`, height: 8, backgroundColor: color, borderRadius: 999 }} /></View></View>; }
function ResultCard({ label, value }: { label: string; value: string }) { return <View className="flex-1 rounded-2xl bg-background p-3"><Text className="text-xs text-muted">{label}</Text><Text className="mt-1 text-lg font-bold text-foreground">{value}</Text></View>; }

function DietSwitch({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [{ flex: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center", backgroundColor: active ? "#174A3B" : "transparent" }, pressed && { opacity: 0.78 }]}
    >
      <Text className={active ? "text-sm font-semibold text-white" : "text-sm font-semibold text-foreground"}>{label}</Text>
    </Pressable>
  );
}

function SupplementationSection() {
  return (
    <View className="gap-4">
      <View className="gap-2 rounded-[26px] bg-primary-soft p-5">
        <Text className="text-xl font-semibold text-primary">Supplementation guide</Text>
        <Text className="text-sm leading-5 text-muted">
          Educational reference for common supplements—not a prescription or a replacement for food, training, or sleep.
        </Text>
      </View>
      {supplements.map((supplement) => (
        <View key={supplement.name} className="gap-3 rounded-2xl border border-border bg-surface p-5">
          <Text className="text-lg font-semibold text-foreground">{supplement.name}</Text>
          <Text className="text-sm leading-5 text-muted">{supplement.purpose}</Text>
          <View className="gap-1 rounded-xl bg-primary-soft p-3">
            <Text className="text-xs font-semibold uppercase tracking-wide text-primary">Typical scope</Text>
            <Text className="text-sm leading-5 text-foreground">{supplement.scope}</Text>
          </View>
          <Text className="text-xs leading-5 text-muted">Important: {supplement.notes}</Text>
        </View>
      ))}
    </View>
  );
}

function Field({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  return <View className="flex-1 gap-1"><Text className="text-xs font-semibold text-muted">{label}</Text><TextInput value={value} onChangeText={onChangeText} keyboardType="decimal-pad" className="rounded-xl border border-border bg-white px-3 py-3 text-sm text-foreground" /></View>;
}

function Choice({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={{ flex: 1, borderColor: active ? "#174A3B" : "#E6E7E2", borderWidth: 1, borderRadius: 999, paddingVertical: 10, alignItems: "center", backgroundColor: active ? "#DCEBE3" : "#FFFFFF" }}><Text className={active ? "text-xs font-semibold text-primary" : "text-xs font-semibold text-foreground"}>{label}</Text></Pressable>;
}

function Metric({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return <View style={{ flex: compact ? 0 : 1, width: compact ? "100%" : undefined }} className="rounded-2xl border border-border bg-surface p-4"><Text className="text-xs font-medium text-muted">{label.toUpperCase()}</Text><Text className="mt-2 text-lg font-semibold text-foreground">{value}</Text></View>;
}
