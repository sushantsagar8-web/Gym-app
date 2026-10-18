# FitPath Project TODO

- [x] Review the supplied Pinterest exercise-reference style
- [x] Capture the user’s product, audience, platform, monetization, content, and nutrition requirements
- [x] Initialize the Android-first Expo mobile project
- [x] Write the mobile interface design specification
- [x] Create the FitPath brand icon and update app configuration branding
- [x] Replace the starter home screen with the FitPath premium coach dashboard
- [ ] Implement account creation and mandatory onboarding flow
- [x] Implement multi-select goal selection for weight loss, muscle gain, endurance, HIIT, general fitness, strength, flexibility, rehabilitation, and maintenance
- [x] Implement onboarding for body metrics, activity, fitness level, sleep, stress, medical limitations, equipment, language, and diet preferences
- [x] Implement Home, Shop, Diet, Progress, Profile, Exercise Library, and Program Detail navigation
- [ ] Implement free exercise library with one exercise per major body part
- [x] Define exercise, media, program, plan, meal, purchase, workout-session, and progress data types
- [x] Implement exercise detail screen with GIF/video reference, target-muscle highlight, reps/time prescription, sets, and rest
- [x] Implement workout preparation flow with warm-up, main workout, and cool-down sections
- [x] Implement rep-based and time-based workout execution modes
- [ ] Implement local work timer, automatic rest timer, pause, skip, repeat, replace, reorder, and next-exercise controls
- [ ] Implement completion sound, optional vibration, screen-awake behavior, and timer persistence across interruptions
- [ ] Implement optional Android active-timer notification or widget surface for music-app switching
- [x] Implement workout completion logging for reps, weight, perceived effort, and consistency
- [ ] Implement future-ready progression rules for reps, weight, and rest intervals
- [x] Implement Shop program catalogue and purchased-program access states
- [ ] Integrate Google Play Billing for paid digital programs before production release
- [x] Implement Diet dashboard with calorie target, macro target, and calorie ledger
- [x] Implement configurable vegetarian/non-vegetarian meal templates, cuisines, allergies, intolerances, medical-condition disclosures, and disliked foods
- [x] Add safety disclaimers and healthy-user eligibility messaging
- [x] Implement progress views for body weight, strength, endurance, and consistency
- [ ] Create admin content-management foundation for users, exercises, media, programs, plans, analytics, publishing, and rights metadata
- [ ] Add multilingual structure for Indian languages
- [ ] Add deterministic tests for onboarding, timer state transitions, rest behavior, and calorie-ledger calculations
- [x] Run TypeScript, lint, and test checks
- [ ] Capture preview screenshots for core screens
- [ ] Review Google Play health-app declaration, privacy policy, data-safety, billing, and testing requirements before publishing

- [x] Implement persisted multi-step onboarding form for goals, body metrics, lifestyle, training context, and dietary preferences
- [x] Implement locally persisted onboarding completion and preference state
- [x] Implement timer state machine with work, rest, paused, completed, skipped, and interrupted states
- [x] Implement automatic rest transition after work completion
- [x] Implement pause, resume, skip, repeat, and next-exercise controls
- [x] Implement screen-awake behavior during active workout and rest intervals
- [x] Add deterministic timer state-machine tests
- [x] Define typed exercise content schema for licensed GIF/video references
- [x] Add exercise media metadata fields for ownership, licensing, target muscles, prescriptions, modifications, and safety notes
- [x] Wire exercise detail UI to the typed content model

- [x] Complete onboarding fields for activity level, sleep, stress, medical limitations, language, workout days, and session duration
- [x] Add healthy-user eligibility messaging and non-diagnostic safety disclaimers
- [x] Persist timer preferences for sound, vibration, and music behavior
- [x] Define program, workout session, exercise set, progression, meal, calorie ledger, and progress-entry models
- [x] Add workout completion logging for reps, weight, perceived effort, and consistency
- [ ] Add progression recommendations for reps, weight, and rest intervals
- [ ] Add program schedule and weekly workout overview
- [x] Add nutrition meal templates and calorie/macro ledger interactions
- [ ] Add progress charts and body-weight, strength, endurance, and consistency entry flows
- [x] Add content-management-ready local fixtures and media placeholder states
- [x] Add profile settings for language, sound, vibration, screen-awake behavior, privacy, and data reset
- [ ] Add Android production-readiness placeholders for billing, notifications, and privacy/data-safety review

- [x] Inventory the 11 uploaded men’s abs workout videos
- [x] Analyze each abs clip and assign an exercise identity or review-needed status
- [x] Add men’s abs video metadata to the typed exercise content bundle
- [x] Preserve a separate content-batch boundary for future women’s abs videos
- [ ] Confirm media rights metadata and production hosting status before publishing videos

- [x] Normalize and match the 11 supplied Cloudinary URLs to the analyzed men’s abs clips
- [x] Replace men’s abs local asset placeholders with Cloudinary delivery URLs
- [x] Verify Cloudinary URL reachability and media mapping
- [x] Update the men’s abs media handoff document with production URLs

- [x] Integrate Cloudinary video player into exercise detail
- [x] Integrate Cloudinary video player into workout execution
- [x] Add Cloudinary thumbnail URL generation and preview states
- [x] Add fullscreen playback controls and orientation-safe presentation
- [x] Add loading, playback-error, retry, and unavailable-media states

- [x] Add dedicated fullscreen exercise-video player route
- [x] Add landscape orientation handling for fullscreen playback
- [x] Add richer player controls for play/pause, seek, progress, mute, fullscreen, and repeat
- [x] Add bandwidth-aware quality options and Cloudinary transformation helpers
- [x] Add playback analytics events for view, play, pause, completion, seek, and quality selection
- [x] Persist local playback analytics for later aggregation
- [x] Add exercise-library browsing surface
- [x] Add exercise-library filters for abs, target muscle, audience, and equipment
- [x] Add filtered exercise-card navigation to exercise detail and fullscreen playback

- [x] Add exercise-level completion event model with workout, exercise, set, duration, and completion metadata
- [x] Persist exercise completion events locally for progress history
- [x] Wire completion events into work-to-rest, skip, repeat, and workout-finished transitions
- [x] Build end-of-workout progress summary route
- [x] Display completed exercises, completed sets, elapsed time, and completion percentage
- [x] Add restart, return-home, and review-progress actions from the workout summary
- [x] Add deterministic tests for completion-event recording and summary calculations

- [x] Normalize and verify the eight women’s abs Cloudinary URLs
- [x] Map women’s abs clips to separate exercise records with audience metadata
- [x] Add women’s abs records to the app-ready content bundle
- [x] Add women’s audience filtering to the exercise library
- [x] Document the women’s abs media batch and rights status

- [x] Add saved sex/audience preference as the default curation context
- [x] Filter Home recommendations, Shop programs, and workout entry by the selected audience
- [x] Keep Exercise Library manual audience filters available as an explicit override
- [x] Add audience-curation tests for men, women, and missing-preference states

- [x] Add Profile toggle to switch Men/Women workout curation
- [x] Persist the active curation audience and refresh curated surfaces after switching
- [x] Create sex-aware weekly program schedules for men and women
- [x] Update progress summaries with audience, curated sessions, and audience-specific completion metrics
- [x] Track onboarding started, step completion, completed, and abandoned events
- [x] Track curated-workout impressions, starts, exercise completions, skips, and finishes by audience
- [x] Add local analytics aggregation helpers and deterministic tests

- [x] Restart the FitPath development server after the reported outage
- [x] Verify the restarted preview service is responsive

- [x] Make workout launch open the selected exercise in a dominant full-screen-style video view
- [x] Show repetitions or duration, sets, work interval, and rest interval directly below the workout video
- [x] Preserve timer, pause, skip, repeat, completion, and progress-summary controls in the video-first layout
- [ ] Verify the revised workout layout on mobile and web preview

- [x] Loop each exercise reference video continuously until the user completes the current set
- [x] Add a white workout control panel beneath the video for timer or repetition targets
- [x] Require an explicit Done/Next Set button after each timer or repetition target completes
- [x] Prevent automatic advancement to the next set or exercise until the user confirms completion
- [x] Add deterministic tests for explicit set and exercise advancement behavior
- [ ] Verify looping playback and the white control panel on mobile and web preview

- [x] Add timer-finished audio cues for work and rest transitions
- [x] Implement explicit rest-period timers between sets and exercises
- [x] Keep rest timers paused until the user confirms moving forward
- [x] Respect persisted sound and vibration preferences for timer cues
- [x] Add deterministic tests for rest transitions and cue-trigger conditions
- [x] Verify timer audio and rest-period UI on mobile and web preview

- [x] Keep workout reference videos embedded inside the workout screen
- [x] Remove native video controls that may expose download or external-save actions
- [x] Preserve looping playback and app-controlled play/pause behavior without download controls
- [x] Verify the embedded player on mobile and web preview

- [x] Diagnose why the workout countdown is not progressing
- [x] Fix workout countdown progression without breaking rest and confirmation states
- [x] Add a regression test that verifies elapsed time decreases the displayed timer
- [x] Verify the timer in the workout preview on mobile and web

- [x] Mute audio from all embedded exercise reference videos
- [x] Preserve separate timer completion audio cues
- [ ] Verify muted video playback in the workout preview

- [x] Add a Stop timer button to the active workout controls
- [x] Stop the active work or rest countdown without closing the workout screen
- [x] Allow the stopped timer to be started again from the current workout state
- [ ] Verify Stop timer behavior in the workout preview

- [x] Audit core FitPath screens for fixed dimensions, clipping, and horizontal overflow
- [x] Make core screens responsive across small, standard, and large phone widths
- [x] Add safe-area and bottom-tab spacing so content is not hidden
- [x] Make workout controls and media scale without clipping on short phones
- [ ] Verify responsive layouts at small-phone, standard-phone, and web viewport sizes
- [ ] Run multi-viewport layout tests for home and workout screens at compact, standard, and large phone sizes
- [x] Fix weekly schedule subtitle truncation on narrow phone widths

- [x] Remove the in-video play/pause control so exercise references play continuously
- [x] Ensure videos remain muted and loop without user playback controls
- [x] Remove sound playback when a work set finishes
- [x] Start the break timer silently after set completion
- [x] Verify continuous playback and silent break transition

- [x] Show only sets and time below the workout video
- [x] Place the timer directly below the sets and time metadata
- [x] Remove instructional directions from the workout metadata and timer section
- [ ] Verify the simplified workout panel in preview

- [x] Audit every FitPath route and component that renders exercise videos
- [x] Apply muted looping playback to all exercise video surfaces
- [x] Remove native play, stop, download, fullscreen, and picture-in-picture controls from all exercise video surfaces
- [x] Keep all exercise videos embedded and responsive across the app
- [ ] Verify global video behavior on exercise detail, workout, library, and player routes

- [x] Remove loading, status, caption, and error text overlays from embedded exercise videos
- [x] Remove text overlays from the standalone player video surface
- [x] Keep the video area visually clean while preserving retry behavior without overlaid text
- [x] Verify all exercise video surfaces contain no visible text

- [x] Verify no text overlays appear on exercise detail, workout, library, and player video surfaces
- [x] Verify Home and Workout layouts at compact, standard, and large mobile sizes
- [x] Verify exercise video looping and continuous playback behavior
- [x] Verify set completion transitions silently into the break timer
- [x] Record any preview or device-testing limitations

- [x] Add a custom workout settings page for work-set duration and break interval
- [x] Persist workout duration preferences locally and restore them on launch
- [x] Apply saved durations to new workout timer sessions
- [x] Validate duration bounds, reset defaults, and timer integration
- [ ] Verify the settings page and configured timer on mobile preview

- [x] Place the Sets label above the specific set count in the workout metadata panel
- [ ] Verify the reordered set metadata on the workout screen
- [x] Show the current set number alongside the total set count

- [x] Corrected the mismatch between prescribed and displayed work duration

- [x] Replace the generic exercise browser with a body-part icon exercise hub
- [x] Add body-part categories such as Abs, Chest, Shoulders, Back, Legs, and Arms
- [x] Curate body-part exercise lists by the selected Men/Women audience
- [x] Update exercise navigation and labels to use the body-part hub
- [x] Add deterministic tests for body-part filtering and audience curation
- [ ] Verify the new exercise hub on a mobile viewport

- [x] Add Exercises as a dedicated navbar section
- [x] Route the Exercises navbar item to the body-part exercise hub
- [x] Add a dedicated exercise icon and active navigation state
- [ ] Verify the navbar and Exercises section on mobile preview
- [x] Diagnose the mismatch between prescribed and displayed rest duration
- [x] Make work and rest labels derive from the same active timer configuration
- [x] Add regression tests for custom and default work/rest duration consistency
- [ ] Verify prescribed and displayed durations on the workout screen

- [x] Add a persisted rest-alert mode setting for sound, vibration, or silent visual alerts
- [x] Add an interactive calendar widget for Progress date-range selection
- [x] Add gram and serving unit conversions to the meal editor
- [ ] Add deterministic tests for alert modes, calendar ranges, and unit conversions
- [ ] Verify the updated settings, Progress, and Diet flows across mobile layouts

- [x] Add a persisted dark-mode toggle to Profile settings
- [x] Connect the dark-mode preference to the app theme provider
- [x] Test rest-timer sound, vibration, and visual-only alert modes
- [ ] Preview the updated workout interface in light and dark modes

- [x] Add a quick dark-mode toggle to the main navigation bar
- [x] Update Progress chart colors for high contrast in light and dark modes
- [x] Validate toggle persistence and chart readability across themes

- [x] Investigate why the Exercises-section changes are missing
- [x] Restore the latest valid Exercises modality and anatomy-image implementation
- [x] Validate Exercises navigation, audience curation, and category rendering

- [x] Make light-mode home-card text black
- [x] Make light-mode card icons white while preserving dark-mode icon styling
- [x] Validate light and dark theme contrast on home and navigation surfaces

- [x] Make all affected light-mode icons light/white instead of dark
- [x] Verify light-mode icon contrast across Home cards and navigation

- [x] Make light-mode Home cards use light surfaces with readable black text and light icons
- [x] Preserve the existing dark-mode Home card appearance
- [x] Validate the corrected Home card contrast in preview

- [x] Change Light Mode tab-bar icons to black like the tab labels
- [x] Preserve Dark Mode tab-bar icon tint
- [ ] Validate tab-bar icon contrast in preview

- [x] Change Weight loss, Build muscle, and HIIT & cardio focus-card icons to black in Light Mode
- [x] Preserve Dark Mode focus-card icon styling
- [ ] Validate focus-card icon contrast in preview

- [x] Audit all primary FitPath screens for Android and iPhone responsive layout issues
- [x] Fix safe-area, tab-bar, width, spacing, and text-overflow issues across phone sizes
- [x] Validate compact, standard, and large phone layouts with TypeScript and tests

- [x] Restart FitPath development services after the reported outage
- [x] Confirm Expo and API service health after restart

- [x] Restart FitPath development services after the repeated outage
- [x] Confirm Expo and API service health after the repeated restart

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Restart FitPath development services after the current outage
- [x] Confirm Expo and API service health after the current restart

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Change Browse exercises, Explore programs, Plan your meals, and See your progress card icons to black in Light Mode
- [x] Preserve Dark Mode Keep your rhythm card icon styling
- [ ] Validate Keep your rhythm card icon contrast

- [x] Replace FitPath launcher, splash, favicon, and Android foreground logo assets with the user-provided image
- [x] Update app branding configuration with the uploaded logo URL
- [x] Validate matching asset copies and TypeScript configuration

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Ensure repeating an exercise resets its timer without starting it
- [x] Ensure all exercise timers start only after the user presses Start timer
- [x] Add or update deterministic coverage for repeat and explicit-start behavior

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Run the automated test suite after the latest restart
- [x] Inspect Git status for local files modified during the crash
- [x] Review current API server logs for runtime errors

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Add the attached male and female images as local Home-page assets
- [x] Show the male or female image in the Weight loss card based on the selected audience
- [x] Validate the updated Home card with TypeScript and mobile preview checks

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Replace the Weight loss card’s male and female local images with the newly attached transparent assets
- [x] Preserve Men/Women audience-aware image selection on the Home page
- [x] Validate the replacement assets with TypeScript, tests, and preview checks

- [x] Replace local Weight loss image requires with the provided Cloudinary female and male URLs
- [x] Preserve female-for-Women and male-for-Men selection on the Home card
- [x] Validate the Cloudinary images and save a checkpoint

- [x] Fit the selected Weight loss image fully inside the Home card icon area without cropping
- [x] Preserve audience-aware male/female image selection and responsive card sizing
- [x] Validate the full-image layout and save a checkpoint

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Diagnose why the FitPath preview is not opening
- [x] Recover the Expo preview service if it is stalled
- [x] Verify the preview endpoint responds after recovery

- [x] Prevent the Expo web process exiting normally from terminating the API process
- [x] Keep the Expo preview server alive after web bundling
- [x] Validate that port 8081 remains reachable after startup

- [x] Add the supplied muscle illustration to the Home Build muscle card
- [x] Fit the full Build muscle illustration inside the icon area without cropping
- [x] Validate the Build muscle card responsively and save a checkpoint

- [x] Diagnose the 6000ms FontFaceObserver timeout on mobile startup
- [x] Add a resilient font-loading fallback so the app renders if the custom font is delayed or unavailable
- [x] Validate startup with TypeScript, tests, and preview/device checks

- [x] Add the supplied runner illustration to the Home HIIT & cardio card
- [x] Fit the full HIIT and cardio illustration inside the icon area without cropping
- [x] Validate the HIIT and cardio card responsively and save a checkpoint

- [x] Restart FitPath development services after the latest outage
- [x] Confirm Expo and API service health after the latest restart

- [x] Audit local and remote app image assets for dimensions and file sizes
- [x] Optimize oversized local image assets while preserving transparency and full subject visibility
- [x] Validate image references, tests, preview rendering, and reduced asset footprint

- [x] Add the 17 provided Cloudinary videos to the Gym back-exercise catalog
- [x] Map each back video to exercise name, target area, equipment, audience, and Gym category metadata
- [x] Validate Cloudinary URLs, tests, and back-workout rendering

- [x] Resolve or document the 404 rear-delt bench dumbbell Cloudinary URL
- [x] Revalidate the rear-delt reference and complete the Gym back catalog checkpoint

- [x] Exclude the unavailable rear-delt video from the Gym back catalog
- [x] Keep and validate the remaining 16 supplied Gym back videos
- [ ] Save a checkpoint for the completed 16-video Gym back catalog

- [x] Restore the Supplementation tab under Diet with supplement information and working navigation
- [x] Verify the restored Supplementation tab across mobile layouts and run regression checks

## Session note
The user reported that the Supplementation tab previously added under Diet is missing and requested that it be restored.

- [x] Enable landscape orientation for the workout preview and adapt the workout video/control layout
- [x] Verify horizontal workout preview behavior on phone-sized viewports

- [x] Use the first frame of each Cloudinary exercise video as the thumbnail across exercise cards and video previews
- [x] Verify first-frame thumbnails and run regression checks across exercise surfaces

- [x] Change all Cloudinary exercise thumbnails from the first frame to a representative middle frame
- [x] Verify middle-frame thumbnails across exercise cards and video previews and run regression checks

- [x] Add the two supplied men’s transformation images and the supplied women’s transformation image to Home Set up my goals
- [x] Select imagery by saved audience and verify responsive image fitting on Home (visual screenshot unavailable because Expo preview URL was temporarily unavailable)

- [x] Make each supplied goal image cover the full Set up my goals panel background
- [x] Add an automatic carousel for the two Men images and full-panel Women imagery
- [x] Verify audience-specific carousel behavior and responsive contrast on Home

- [x] Remove the dark overlay from the full-background Home goals carousel images
- [x] Verify clean image rendering, content readability, and carousel behavior after overlay removal

- [x] Add a subtle translucent backdrop behind the Home goals carousel text
- [x] Verify text readability and preserve bright image rendering after the backdrop change

- [x] Add the 11 supplied Cloudinary videos to Arms under a Biceps category
- [x] Add Biceps exercise metadata and register the catalog in the global content bundle
- [x] Validate Biceps URLs, Arms filtering, thumbnails, and regression checks (all 11 URLs HTTP 200; TypeScript and 23 active tests pass)

- [x] Add Arms subcategory buttons for Biceps, Triceps, and Brachialis
- [x] Preserve all existing Biceps videos under the Biceps subcategory
- [x] Add the 11 supplied Cloudinary videos under the Triceps subcategory
- [x] Validate Triceps URLs, subcategory filtering, thumbnails, navigation, and regression checks (all 11 URLs HTTP 200; TypeScript and 24 active tests pass; preview capture unavailable)

- [x] Add the 9 supplied Cloudinary videos to the Chest exercise section
- [x] Add Chest exercise metadata and register the catalog in the global content bundle and route lookups
- [x] Validate Chest URLs, filtering, thumbnails, navigation, and regression checks (all 9 URLs HTTP 200; TypeScript and 25 active tests pass)

- [x] Add the 7 supplied Cloudinary videos to the Shoulders exercise section
- [x] Add Shoulders exercise metadata and register the catalog in the global content bundle and route lookups
- [x] Validate Shoulders URLs, filtering, thumbnails, navigation, and regression checks (all 7 URLs HTTP 200; TypeScript and 25 active tests pass; preview URL unavailable)

- [x] Add Shoulders subcategory buttons for Front delts, Side delts, Rear delts, and Traps
- [x] Categorize all seven shoulder videos under the correct shoulder subcategory
- [x] Add a persisted Save to favorites control to Chest and Shoulders exercise cards
- [x] Validate subcategory filtering, favorite persistence, and regression checks (TypeScript passes; 28 active tests pass; compact Exercise Library preview verified)

- [x] Fix missing Shoulder subcategory controls in the Exercise Library
- [x] Verify Shoulder subcategory visibility, filtering, and regression checks after the fix (TypeScript passes; 28 active tests pass; compact /library preview verified)

- [x] Add the 23 supplied Cloudinary videos to the Legs exercise section
- [x] Add Legs exercise metadata and register the catalog in the global content bundle and route lookups
- [x] Validate Legs URLs, filtering, thumbnails, navigation, and regression checks (all 23 URLs HTTP 200 after targeted recheck; TypeScript and 29 active tests pass; preview capture unavailable)

- [x] Add Legs subcategory buttons for Quads, Hamstrings, Glutes, Inner Thigh, and Calves
- [x] Categorize all 23 Legs videos under the correct Legs subcategory
- [x] Add equipment-type filters for Dumbbells, Machines, Barbell, Cable, and Bodyweight in Legs
- [x] Create a structured Leg Day workout program using the new Legs exercises
- [x] Validate Legs filtering, program navigation, and regression checks (TypeScript passes; 31 active tests pass; compact Exercise Library preview verified)

- [x] Allow multiple selections in the Legs Choose a focus section
- [x] Preserve combined focus filtering with equipment and subcategory controls
- [x] Verify multi-select focus behavior and regression checks (TypeScript passes; 31 active tests pass; compact Exercise Library preview verified)

- [x] Pass selected Legs focus areas from the Exercise Library into Leg Day
- [x] Generate 3 exercises for one focus, 3 per focus for two focuses, and 2 per focus with a six-exercise cap for more than two focuses
- [x] Verify Leg Day changes correctly for one, two, and more-than-two selected focus areas (TypeScript passes; 32 active tests pass)

- [x] Standardize visible focus-area controls for Abs, Chest, Back, Arms, and any remaining body-part sections
- [x] Categorize all remaining body-part exercises with normalized focus tags
- [x] Extend focus-aware routine generation beyond Legs where applicable
- [x] Verify focus controls on compact mobile layouts

- [x] Add multi-select focus behavior for Chest, Back, and Arms filters
- [x] Create focus-aware Chest workout program generation
- [x] Create focus-aware Back workout program generation
- [x] Create focus-aware Arms workout program generation
- [x] Add deterministic tests for upper-body focus selection and program quotas
- [x] Verify upper-body focus controls and program cards on compact mobile layouts

- [x] Add local custom-workout data model and persistence
- [x] Build custom workout creation using only Exercise Library exercises
- [x] Support ordering and sets/reps/rest editing for custom exercises
- [x] Connect saved custom workouts to the existing workout execution flow
- [x] Add deterministic tests and verify compact mobile layout

- [x] Add maintenance calorie and goal-adjusted calorie calculation logic
- [x] Add local persistence for calorie calculator inputs and target
- [x] Build calorie calculator interface under Diet
- [x] Add deterministic calculation tests and verify compact mobile layout

- [x] Sync saved calorie target into Today’s Ledger
- [x] Add goal-aware protein, carbohydrate, and fat calculations
- [x] Display macro targets alongside consumed macros in Diet
- [x] Add deterministic macro tests and verify compact mobile layout

- [x] Add visual protein, carbs, and fats progress bars to Today’s Ledger
- [x] Persist customizable macro percentages and protein target
- [x] Add controls to adjust protein target and macro allocation
- [x] Add deterministic customization tests and verify compact mobile layout

- [x] Add direct daily macro-intake ledger entries independent of meal templates
- [x] Support manual calories, protein, carbs, and fats entry with edit/delete
- [x] Add optional food description and portion-based transparent estimate flow
- [x] Replace meal-template-first presentation with macro ledger actions
- [x] Add deterministic ledger and estimate tests and verify compact mobile layout

- [x] Add reviewed natural-language food input for AI extraction
- [x] Implement structured food and portion extraction with calorie and macro estimates
- [x] Connect reviewed AI results to the direct daily macro ledger
- [x] Add deterministic structured-output and fallback tests
- [x] Verify the AI food logger on compact mobile layout

- [x] Define sourced nutrition reference schema and regional coverage plan
- [x] Research and normalize common foods and meals across India/Asia, the Americas, and Europe
- [x] Add provenance and serving-size metadata to the nutrition reference data
- [x] Integrate regional food matching into natural-language macro estimation
- [x] Add dataset validation and representative regional matching tests
- [x] Verify nutrition logging behavior and compact Diet layout

- [x] Add sourced prepared regional dishes with verified serving-size metadata
- [x] Add ambiguity-aware portion clarification before saving AI food estimates
- [x] Build a searchable food-reference browser inside Diet
- [x] Add prepared-dish matching, deterministic tests, and compact-layout verification

- [x] Diagnose why Diet AI food estimates fail for natural-language entries
- [x] Fix the AI estimate request/response path and reliable local fallback
- [x] Add regression coverage for paneer, roti, and mixed-meal estimates
- [x] Verify the estimate flow on the compact Diet screen

- [x] Fix prepared-dish priority so chicken biryani is not matched to a chicken-only fallback
- [x] Add carbohydrate-containing biryani and mixed-meal regression coverage
- [x] Verify corrected review output and compact Diet layout

- [x] Hide the visible Diet side scrollbar while preserving touch scrolling
- [x] Verify the Diet screen on compact mobile layout after the scrollbar change

- [x] Expand the repository with officially sourced Indian staple, sabzi, paneer, roti, and rice records
- [x] Add officially sourced European meal records for pasta, macaroni, pizza, and related foods
- [x] Support direct food-name and quantity parsing with unit-aware macro scaling
- [x] Make repository selection the primary Diet logging path
- [x] Add regional record tests and verify the compact Diet layout

- [x] Add one-tap quantity presets for common repository serving units
- [x] Add locally persisted custom meal combinations from repository items
- [x] Add one-click logging for saved custom meals
- [x] Add tests for preset scaling, custom meal persistence, and compact Diet layout
- [x] Add favorite and recent food shortcuts to the Diet reference browser
- [x] Add inline portion clarification prompts for ambiguous estimates

- [x] Audit and fix Shop routing so each program opens its own correct session content
- [x] Research evidence-based bro split and push/pull workout structures from authoritative web and YouTube sources
- [x] Add selectable Bro Split and Push & Pull Days options to the muscle-building program
- [x] Research and define cardio program exercise structures with future video-content placeholders
- [x] Add deterministic tests for program routing and split selection
- [x] Verify Shop program detail layouts on compact mobile screens

- [x] Refine Bro Split into Chest & Triceps, Back & Biceps, Shoulders/Traps/Abs, and Legs/Abs days
- [x] Refine Push & Pull Days so Push contains only pushing movements, Pull only pulling movements, followed by Legs
- [x] Add deterministic coverage for split muscle-group boundaries and day labels
- [x] Verify refined split screens on compact mobile layouts

- [x] Add Monday-Sunday Bro Split schedule with default Monday Chest & Triceps, Tuesday Back & Biceps, Wednesday Shoulders & Abs, and Thursday Legs & Abs sessions
- [x] Repeat the four-session rotation through Sunday with rest-day labels
- [x] Persist editable day-to-body-part assignments for Bro Split
- [x] Add experience-level exercise selection with beginner recommendations and custom intermediate/advanced choices
- [x] Launch a selected Bro Split day as one continuous multi-exercise workout session
- [x] Advance from completed sets of one exercise to the next selected exercise using the existing workout interface
- [x] Add deterministic tests for weekly schedule defaults, edits, recommendations, and day workout sequencing
- [x] Verify the Bro Split scheduler and day workout flow on compact mobile layouts

- [x] Fix Bro Split customization controls so users can change a day’s body-part group
- [x] Fix Bro Split exercise toggles so users can add and remove exercises for editable experience levels
- [x] Add regression coverage for customization state updates and persistence
- [x] Verify Bro Split customization interactions on compact mobile layouts

- [x] Add per-day exercise reordering controls for Bro Split sessions
- [x] Add editable sets, reps, and rest values for each selected Bro Split exercise
- [x] Persist exercise order and prescription overrides locally
- [x] Add beginner Reset to Default action that restores recommended exercises and prescriptions for the selected day
- [x] Add deterministic tests for reorder, prescription editing, persistence, and reset behavior
- [x] Verify the Bro Split editor interactions on compact mobile layouts
