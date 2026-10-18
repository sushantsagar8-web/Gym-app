# FitPath Mobile Interface Design

## Product direction

FitPath is an Android-first, portrait-oriented fitness and nutrition companion for Indian beginners and intermediate users. The experience should feel like a calm, premium personal coach: focused, encouraging, and structured without looking like a social network. The first release supports internet-connected use only and uses a program-commerce model: a small free exercise library introduces the product, while complete goal-based programs are purchased from the Shop.

The interface follows mainstream iOS-style interaction principles adapted for Android: clear hierarchy, large touch targets, predictable navigation, restrained motion, strong contrast, accessible labels, and one-handed reachability. The app should use a minimal premium visual system with warm off-white backgrounds, charcoal text, deep forest-green primary actions, muted sage surfaces, and a restrained copper accent for progress and purchase emphasis.

## Screen list

| Screen | Primary content and functionality |
|---|---|
| Welcome and account creation | Brand introduction, sign up, login, language selection, and a clear statement that an account is required before seeing workouts. |
| Safety acknowledgement | Healthy-user eligibility notice, exclusion of pregnancy and chronic disease use cases, medical-limitation acknowledgement, and consent to general wellness guidance. |
| Onboarding: goals | Multi-select goals including weight loss, muscle gain, cardiovascular endurance, HIIT, general fitness, strength, flexibility, rehabilitation, and maintenance. |
| Onboarding: body and lifestyle | Age, sex, height, weight, activity level, fitness level, sleep, stress, medical limitations, allergies, intolerances, disliked foods, diet preference, and available training context. |
| Onboarding: preferences | Home, gym, or cardio emphasis; available equipment; workout days; session duration; preferred language; vegetarian or non-vegetarian meal preference. |
| Home dashboard | Today’s program action, purchased-program status, workout progress, consistency indicator, body-weight trend, and quick links to Start Workout, Shop, Diet, and Progress. |
| Exercise library | Free exercises grouped by body part, movement category, and difficulty. The free tier exposes one exercise for each major body part. |
| Exercise detail | GIF or short video, highlighted target muscle, movement-only reference, rep or time prescription, sets, rest, safety cue, and Add to Workout action. |
| Shop | Purchased and available programs. Program cards show goal, duration, level, workout frequency, equipment, language availability, and price. |
| Program detail | Program overview, expected weekly rhythm, warm-up and cool-down inclusion, sample exercises, diet component, price, purchase CTA, and access status. |
| Workout preparation | Selected program day, exercise order, warm-up, main workout, cool-down, estimated duration, and editable work/rest settings. |
| Workout execution | Current GIF/video, highlighted target muscle, current set, reps or countdown, pause, skip, repeat, replace, reorder, timer controls, and next-exercise CTA. The rest timer starts automatically after the set or exercise. |
| Rest timer | Large countdown, next exercise preview, add-time control, skip-rest control, sound/vibration completion cue, and pause/resume. |
| Workout completion | Completed sets, time, perceived difficulty, optional weight and rep logging, progress update, and next recommended session. |
| Diet dashboard | Daily calorie target, macro target, calorie ledger, meals, remaining budget, and meal-plan access. |
| Meal-plan detail | Plan-specific meal templates for calorie deficit or surplus, cuisine filters, vegetarian/non-vegetarian switch, allergies and exclusions, recipes, and shopping list. |
| Progress | Body-weight trend, strength records, endurance records, sessions completed, consistency, and program progress. |
| Profile and settings | Account, language, notification sound, timer defaults, music behavior, personal information, privacy, safety information, purchased programs, and support. |
| Admin dashboard | User overview, content library, programs, media metadata, purchases, analytics, publish/unpublish controls, and rights records. This is an operational surface and may initially be web-based rather than inside the mobile app. |

## Key user flows

### First-time onboarding

The user opens FitPath, selects a language, creates an account, accepts the healthy-user safety acknowledgement, chooses one or more goals, enters body and lifestyle information, chooses fitness level and training context, selects dietary preferences and exclusions, and reaches the Home dashboard. No workout content is shown before account creation and onboarding completion.

### Discover and buy a program

The user opens Shop, filters by goal such as weight loss, muscle gain, endurance, or HIIT, opens a program detail page, reviews the duration, weekly schedule, equipment, sample content, and diet inclusion, then purchases the program through Google Play Billing. The program becomes available in My Programs and supplies the Home dashboard with the next scheduled action.

### Complete a workout

The user taps Start Workout from Home or a purchased program. The preparation screen shows warm-up, exercises, cool-down, estimated duration, and adjustable work/rest defaults. During the exercise, the user sees the movement reference and either a rep target or time countdown. After completion, the rest timer begins automatically. The user can pause, skip, repeat, replace, reorder, or move to the next exercise manually. Completion sound and optional vibration provide feedback. The user records optional weight, actual repetitions, and perceived effort before the session is saved.

### Add a free exercise

The user opens the free Exercise Library, selects a body part, opens an exercise detail screen, views the GIF or video and target-muscle highlight, chooses Add to Workout, and configures repetitions, sets, work duration, and rest duration. This flow does not unlock paid programs.

### Use the diet plan

The user opens Diet, views the daily calorie and macro target, checks the calorie ledger, opens the current meal template, and adjusts cuisine, vegetarian/non-vegetarian preference, allergies, intolerances, and disliked foods. Weight-loss plans use a clearly labelled estimated calorie deficit, while muscle-gain plans use a clearly labelled estimated calorie surplus. The app provides general wellness guidance and safety messaging rather than medical nutrition therapy.

## Interaction rules

The bottom navigation should use four primary destinations: Home, Shop, Diet, and Progress. Profile and settings are accessible from the Home header. The primary action on each screen should be visually dominant and reachable with one hand. Workout controls should remain available without requiring precise small taps. Timers should keep the screen awake during active workout sessions, calculate elapsed time from timestamps to avoid drift, and preserve state when the app is backgrounded or interrupted.

The app should continue the workout timer when the user changes to a music app, subject to Android background-execution limitations and permission behavior. A persistent notification or media-style control surface should expose the active timer state. Music playback itself should remain the responsibility of the user’s music app unless a later phase adds licensed in-app audio.

## Color choices

| Token | Color | Usage |
|---|---|---|
| Background | `#F7F6F2` | Main app canvas and calm premium backdrop |
| Surface | `#FFFFFF` | Cards, sheets, exercise panels, and program sections |
| Foreground | `#202522` | Primary text and headings |
| Muted | `#6E756F` | Supporting text, metadata, and secondary labels |
| Primary | `#174A3B` | Main CTA, active navigation, timer emphasis, and progress actions |
| Primary soft | `#DCEBE3` | Selected filters, plan highlights, and subtle status surfaces |
| Accent | `#C9824A` | Purchase emphasis, milestones, and selective progress highlights |
| Border | `#E6E7E2` | Dividers and card boundaries |
| Success | `#3F8A63` | Completed sets and successful actions |
| Warning | `#B87A24` | Safety notices and incomplete setup |
| Error | `#B84A43` | Validation and destructive actions |

The color system should remain readable for users with color-vision differences; color must never be the only signal for state. Typography should use a highly legible sans-serif with generous line height, medium-weight labels, and restrained all-caps only for small metadata.

## Content and safety principles

Exercise media must be supplied, commissioned, or licensed for use in FitPath. Pinterest URLs are references only and must not be embedded as unlicensed content. Every exercise record must include the media owner, permission status, target muscle, level, prescription, rest, modifications, and safety notes.

The app is for generally healthy people. It should not present itself as suitable for pregnancy or chronic disease management. The content should avoid diagnosis, guaranteed weight-loss claims, unsafe restriction, and medical treatment advice. Before publishing diet and rehabilitation content, obtain qualified professional review.
