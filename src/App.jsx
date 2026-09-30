import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Flame, Target, Timer, CheckCircle2, Circle, ChevronRight, ChevronLeft,
  TrendingUp, Award, Play, Pause, RotateCcw, X, Dumbbell, BarChart3,
  Home as HomeIcon, Utensils, User, Info, ArrowRight, ArrowLeft, Globe,
  Sparkles, ChefHat, RefreshCw, Droplet, Gauge, Gamepad2, PlusCircle, PartyPopper, Wrench, ThumbsDown, Sun, Moon, BookOpen, ExternalLink, Lock, Unlock, Camera, ScanLine, Trophy, Star, Zap, ShieldCheck,
} from "lucide-react";

const STORAGE_KEY = "forgefit-state";

async function forgeStoreGet(key) {
  try {
    if (window.storage && window.storage.get) return await window.storage.get(key, false);
  } catch (_) {}
  const value = localStorage.getItem(key);
  return value == null ? null : { value };
}
async function forgeStoreSet(key, value) {
  try {
    if (window.storage && window.storage.set) return await window.storage.set(key, value, false);
  } catch (_) {}
  localStorage.setItem(key, value);
  return { value };
}

/* ---------------------------------- THEME ---------------------------------- */
const C_DARK = {
  bg: "#030405",
  glass: "rgba(255,255,255,0.045)",
  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(124,166,255,0.45)",
  blue: "#4C8DFF",
  blueBright: "#8FB8FF",
  blueDim: "rgba(76,141,255,0.16)",
  text: "#EAF0FF",
  steel: "#8792AC",
  card: "rgba(11,12,14,0.82)",
  // Secondary "progress" accent — 2026 dark-mode UI research consistently points to pairing
  // one calm base accent (our blue) with a single high-energy secondary reserved specifically
  // for achievement/progress moments (PRs, XP, challenges) rather than tinting everything blue.
  success: "#34D399",
  successDim: "rgba(52,211,153,0.16)",
  successBorder: "rgba(52,211,153,0.45)",
  warning: "#F5A524",
  warningDim: "rgba(245,165,36,0.14)",
  danger: "#F87171",
  dangerDim: "rgba(248,113,113,0.14)",
};
const C_LIGHT = {
  bg: "#F2F4FA",
  glass: "rgba(20,30,60,0.045)",
  border: "rgba(20,30,60,0.12)",
  borderStrong: "rgba(61,124,251,0.5)",
  blue: "#3D7CFB",
  blueBright: "#2957C9",
  blueDim: "rgba(61,124,251,0.12)",
  text: "#12172A",
  steel: "#5B6478",
  card: "rgba(255,255,255,0.9)",
  success: "#0F9D68",
  successDim: "rgba(15,157,104,0.12)",
  successBorder: "rgba(15,157,104,0.4)",
  warning: "#B7791E",
  warningDim: "rgba(183,121,30,0.12)",
  danger: "#DC2626",
  dangerDim: "rgba(220,38,38,0.12)",
};
// Mutable on purpose: reassigned once per App render from profile.theme, before any
// child component reads it. All components read C.xxx directly rather than via props,
// so this avoids threading theme through ~15 components individually.
let C = C_DARK;

/* ---------------------------------- STRINGS ---------------------------------- */
const STR = {
  en: {
    appName: "ForgeFit", tagline: "Your program. Your pace. Every rep tracked.",
    navTrain: "Train", navNutrition: "Nutrition", navProgress: "Progress", navProfile: "Profile",
    onboardTitle: "Let's build your program",
    step: "Step", of: "of", basics: "Basics", goalActivity: "Goal & activity", training: "Training",
    name: "Name", sex: "Sex", male: "Male", female: "Female", age: "Age",
    height: "Height", weight: "Weight", units: "Units",
    activity: "Activity level", sedentary: "Sedentary (desk job, little exercise)",
    light: "Light (1-3 workouts/week)", moderate: "Moderate (3-5 workouts/week)",
    active: "Active (6-7 workouts/week)", veryActive: "Very active (physical job + training)",
    goal: "Goal", lose: "Lose fat", maintain: "Maintain", gain: "Build muscle",
    split: "Training split", daysPerWeek: "Days per week", emphasis: "Muscle emphasis (optional)",
    none: "None", back: "Back", next: "Next", finish: "Build my program",
    today: "Today", thisWeek: "This week", restDay: "Rest day", restDayNote: "Recovery is part of the program. Take it.",
    startWorkout: "Start workout", setupGuide: "How to set up a workout", muscleLibrary: "Muscle library",
    tapToOpen: "Tap to open", complete: "Complete", todayPct: "% today",
    markComplete: "Mark day complete", logsToward: "Logs today toward your streak, whether or not every set is checked.",
    resting: "Resting", goalMeter: "Goal meter", best: "Best", targetGoal: "Goal",
    goalHit: "Goal hit — time to raise it", ofGoal: "% of goal weight",
    warmup: "Warm-up", homeAlt: "No-gym alternative", setup: "Setup", womenFocus: "Women-focused",
    currentStreak: "Current streak", longestStreak: "Longest streak", last14: "Last 14 days", goalsSet: "Goals set",
    noGoals: "No goals yet. Open any exercise and set a target weight to start tracking it here.",
    calorieTarget: "Calorie target", protein: "Protein", carbs: "Carbs", fat: "Fat",
    dairy: "Dairy & Cheese", vegetables: "Vegetables", fats: "Fats & Oils", georgianDishes: "Georgian Dishes", fruits: "Fruits",
    kitchenList: "What's in your kitchen", kitchenNote: "Tap what you have on hand. The more you check, the better your meal plan.",
    generatePlan: "Generate today's meal plan", regenerate: "Shuffle meals",
    breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack",
    mealTotals: "Today's totals", addMoreFood: "Check off ingredients above to build this meal.",
    swapParty: "🎉 Swap for a Georgian dish", partyHint: "At a party? Swap any meal for a Georgian dish from your kitchen list and still land close to today's targets.",
    editProfile: "Edit profile", language: "Language", save: "Save changes",
    guideTitle: "Setting up a workout", guide1: "Warm up 5-10 minutes — light cardio plus the warm-up sets built into each session.",
    guide2: "Ramp into your working weight. The last 2 reps of your target range should be genuinely hard with clean form.",
    guide3: "Rest the prescribed time between sets — it's tuned to the exercise, not arbitrary.",
    guide4: "Progressive overload: once you hit the top of the rep range on every set with good form, add weight next session.",
    guide5: "Log every set. The goal meter only works if you're honest about what you lifted.",
    guide6: "Respect rest days. Muscle grows during recovery, not just under the bar.",
    gotIt: "Got it", noAnimation: "Original motion diagram — not footage of any real athlete or trainer.",
    programBuilt: "Program built", logged: "Logged",
    navCardio: "Cardio", chooseMachine: "Choose your machine",
    incline: "Incline (%)", speed: "Speed (km/h)", level: "Resistance level",
    startCardio: "Start", pauseCardio: "Pause", resumeCardio: "Resume", resetCardio: "Reset", finishCardio: "Finish session",
    elapsed: "Elapsed", caloriesBurned: "Calories burned",
    hydrationTitle: "Hydration", hydrationGoalLabel: "Daily goal", hydrationReminder: "💧 Time to hydrate — take a sip.",
    logWater: "Log water",
    gameTitle: "Squat Rush", gameIntro: "Tap fast to stand the bar up before time runs out. Heavier bar = more taps needed.",
    repComplete: "Rep complete!", squished: "Squished! Try again.", nextRep: "Next rep", tryAgainGame: "Try again",
    bestLift: "Best lift", playGame: "Play while you rest", tapToLift: "TAP!", getReady: "Get ready…", currentWeight: "Bar weight",
    physique: "Physique", physiqueNote: "Training consistency, XP and milestones shape your Forge identity.",
    rank: "Rank", badges: "Badges", nextRank: "Next rank", unlocked: "Unlocked", locked: "Locked", milestones: "Milestones",
    programOverview: "Program Overview", programPurpose: "Built around your goal, schedule and available equipment.", programTargets: "Target muscles", weeklyStructure: "Weekly structure", trainingDays: "Training days", includedExercises: "Included exercises", expectedProgression: "Expected progression", recoveryStructure: "Recovery", suitableFor: "Best suited for", whatToExpect: "What to expect", enterProgram: "Enter workout", progressionText: "Add reps or load when you reach the top of the prescribed range with clean form.", recoveryText: "Rest days are distributed around your selected training frequency; each exercise also has a prescribed set-rest timer.", suitableText: "Your current goal, training split, equipment selection and preferred weekly frequency.", expectText: "Consistent sessions, progressive overload, logged performance and recovery-aware scheduling.",
    scannerTab: "Scanner", foodScanner: "Food Scanner", scanBarcode: "Scan barcode", photoFood: "Food photo", scannerHint: "Scan a package barcode or photograph a meal, then review the nutrition before logging it.", barcodeLookup: "Identify product", barcodePlaceholder: "Barcode number", cameraEstimate: "Camera nutrition is an estimate", cameraEstimateNote: "Portion and macro estimates from a photo can be wrong. Review and adjust the serving before logging.", chooseMatch: "Food match", portionEstimate: "Estimated portion", scanFailed: "No barcode was detected. You can enter the number manually.", productNotFound: "Product nutrition was not found.", recognitionUnavailable: "Automatic visual food recognition needs a vision service. ForgeFit keeps the photo workflow usable by letting you confirm the closest food and portion.", logScan: "Add to nutrition log",
    tier0: "Just Getting Started", tier1: "Warming Up", tier2: "Building", tier3: "Getting Jacked", tier4: "Strong", tier5: "Beast Mode", tier6: "Legendary",
    mealPlanTab: "Meal Plan", logFoodTab: "Calculator", selectFood: "Food", amountLabel: "Amount",
    addToLog: "Add to today's log", todayLog: "Today's log", noEntries: "No food logged yet today.",
    loggedTotals: "Logged so far", ofTarget: "of target",
    myEquipment: "My Gym Equipment", equipmentIntro: "Select what's available at your gym — your program will only use matching exercises.",
    generateWorkout: "Generate my workout", selectAll: "Select all", equipUpdated: "Workout updated for your equipment",
    noEquipMatch: "No exercises match your current equipment for this day. Add more equipment in your profile.",
    shoppingList: "Shopping List", shopHint: "I can't add items to a real basket — tap a store to open it, and I'll copy the item name so you can paste it into the search bar.",
    copyList: "Copy full list", copied: "Copied",
    notForMe: "Not for me", swap: "Swap", swappedNote: "Won't suggest this again. Undo anytime in Profile.",
    dislikedTitle: "Skipped Exercises", noDisliked: "You haven't skipped anything yet.", restore: "Restore",
    theme: "Theme", themeDark: "Dark", themeLight: "Light",
    viewRecipe: "🍳 View recipe", recipeSteps: "How to make it", chefsNote: "Chef's note",
    georgianDishNote: "Traditional Georgian dish — best made fresh the traditional way, not reheated.",
    workoutCelebrate: "Workout complete!", waterCelebrate: "Hydration goal reached!",
    saucesTab: "Sauces", bestWith: "Great with", ingredients: "Ingredients", instructions: "Instructions",
    supplementsTab: "Supplements", supplementBenefits: "Benefits", typicalDose: "Typical dose", supplementCautions: "Cautions", goalLabel: "Goal",
    supplementsDisclaimer: "Educational information only, not medical advice. Effects vary by person. Check with a doctor or pharmacist before starting any supplement — especially if pregnant, under 18, or taking medication.",
    shopVitamini: "Shop on vitamini.ge",
    forgeScore: "Forge Score", forgeScoreNote: "A consistency score, not a medical measurement.",
    forgeLevel: "Forge Level", xpLabel: "XP",
    forgeCoach: "Forge Coach", whyThis: "Why this?",
    chatWithCoach: "Ask Forge Coach", coachGreeting: "Hey! I'm Forge Coach — ask me about your training, recovery, or nutrition. I can see your real ForgeFit data, so my answers are based on what you've actually logged, not guesses.",
    coachPlaceholder: "Ask about your training…", coachThinking: "Thinking…", coachError: "Couldn't reach the coach right now — try again in a moment.", coachTimeout: "That took too long, so I stopped waiting. The connection may be slow — try again.", coachRateLimit: "You've hit the usage limit for this session — the coach will be back in a bit{when}. The rest of ForgeFit still works fine.", send: "Send",
    overateNotice: "You're {n} kcal over today's target.", overateAction: "Balance it over the next 7 days",
    correctionActive: "Diet adjusted: -{n} kcal/day through {date}, balancing {date2}'s overage.", cancelCorrection: "Cancel adjustment",
    correctionApplied: "Next 7 days adjusted", correctionNote: "Kept within a safe daily minimum — this is about averaging out over the week, not restriction.",
    scheduleChanged: "Today's session updated: {focus}.", scheduleSwitchOption: "Switch today to {focus}", scheduleRestOption: "Take a rest day",
    coachDisclaimer: "Forge Coach uses your logged data but isn't a medical professional. For injuries or health concerns, see a doctor.",
    forgeRecovery: "Forge Recovery", forgeChallenges: "Forge Challenges",
    notEnoughData: "Not enough data yet — keep using ForgeFit and this will fill in.",
    training: "Training", consistency: "Consistency", activityScore: "Activity", nutritionScore: "Nutrition", recoveryScore: "Recovery",
    logRecoveryBtn: "Log today's recovery", recoveryLogged: "Recovery logged", cardioLogged: "Session logged",
    sleepHours: "Sleep (hours)", sleepQuality: "Sleep quality", fatigueLevel: "Fatigue", stressLevel: "Stress",
    sorenessLevel: "Soreness (optional, by muscle)", logSession: "Finish & log session",
    low: "Low", high: "High",
    challengeConsistency: "Consistency Forge", challengeConsistencyDesc: "Complete every planned workout for 2 weeks.",
    challenge30day: "30-Day Forge", challenge30dayDesc: "Complete 20 workouts in 30 days.",
    challengeStrength: "Strength Forge", challengeStrengthDesc: "Set 3 new personal records.",
    challengeHydration: "Hydration Forge", challengeHydrationDesc: "Hit your water goal 7 days running.",
    coachNoData: "Log a few workouts and I'll start giving you real recommendations based on your own numbers.",
    coachStayWeight: "Stay at {w}{u} on {ex} — aim for every set at the top of your rep range before adding weight.",
    coachIncreaseWeight: "You've been hitting every set on {ex} — try {w}{u} next session.",
    coachRestSuggestion: "Your logged fatigue/soreness is high today — consider an easier session or a rest day.",
    coachStreakPraise: "Solid consistency lately — {n} sessions logged recently. Keep the streak alive.",
  },
  ka: {
    appName: "ForgeFit", tagline: "შენი პროგრამა. შენი ტემპი. ყოველი გამეორება აღრიცხულია.",
    navTrain: "ვარჯიში", navNutrition: "კვება", navProgress: "პროგრესი", navProfile: "პროფილი",
    onboardTitle: "ავაშენოთ შენი პროგრამა",
    step: "ნაბიჯი", of: "დან", basics: "ძირითადი", goalActivity: "მიზანი და აქტივობა", training: "ვარჯიში",
    name: "სახელი", sex: "სქესი", male: "მამრობითი", female: "მდედრობითი", age: "ასაკი",
    height: "სიმაღლე", weight: "წონა", units: "ერთეულები",
    activity: "აქტივობის დონე", sedentary: "მჯდომარე (მცირე ფიზიკური აქტივობა)",
    light: "მსუბუქი (კვირაში 1-3 ვარჯიში)", moderate: "საშუალო (კვირაში 3-5 ვარჯიში)",
    active: "აქტიური (კვირაში 6-7 ვარჯიში)", veryActive: "ძალიან აქტიური (ფიზიკური სამუშაო + ვარჯიში)",
    goal: "მიზანი", lose: "ცხიმის დაკლება", maintain: "შენარჩუნება", gain: "კუნთის მატება",
    split: "ვარჯიშის სქემა", daysPerWeek: "დღეები კვირაში", emphasis: "აქცენტი კუნთზე (არასავალდებულო)",
    none: "არცერთი", back: "უკან", next: "შემდეგი", finish: "ავაშენოთ პროგრამა",
    today: "დღეს", thisWeek: "ეს კვირა", restDay: "დასვენების დღე", restDayNote: "აღდგენა პროგრამის ნაწილია. დაისვენე.",
    startWorkout: "ვარჯიშის დაწყება", setupGuide: "როგორ დავიწყო ვარჯიში", muscleLibrary: "კუნთების ბიბლიოთეკა",
    tapToOpen: "დააჭირე გასახსნელად", complete: "დასრულებულია", todayPct: "% დღეს",
    markComplete: "დღის დასრულების მონიშვნა", logsToward: "აღრიცხავს დღევანდელ დღეს სერიების სტატუსის მიუხედავად.",
    resting: "დასვენება", goalMeter: "მიზნის მრიცხველი", best: "საუკეთესო", targetGoal: "მიზანი",
    goalHit: "მიზანი მიღწეულია — ახალი აწონე", ofGoal: "% მიზნის წონიდან",
    warmup: "გახურება", homeAlt: "სახლის ალტერნატივა", setup: "მომზადება", womenFocus: "ქალებისთვის",
    currentStreak: "მიმდინარე სერია", longestStreak: "საუკეთესო სერია", last14: "ბოლო 14 დღე", goalsSet: "დაყენებული მიზნები",
    noGoals: "ჯერ არ გაქვს მიზნები. გახსენი ნებისმიერი სავარჯიშო და დააყენე სამიზნე წონა.",
    calorieTarget: "კალორიების სამიზნე", protein: "ცილა", carbs: "ნახშირწყლები", fat: "ცხიმი",
    dairy: "რძის ნაწარმი და ყველი", vegetables: "ბოსტნეული", fats: "ცხიმები და ზეთები", georgianDishes: "ქართული კერძები", fruits: "ხილი",
    kitchenList: "რა გაქვს სამზარეულოში", kitchenNote: "მონიშნე რაც გაქვს ხელთან. რაც მეტს მონიშნავ, მით უკეთესი გეგმა გექნება.",
    generatePlan: "დღევანდელი კვების გეგმის შექმნა", regenerate: "კერძების შეცვლა",
    breakfast: "საუზმე", lunch: "სადილი", dinner: "ვახშამი", snack: "საჭმელი",
    mealTotals: "დღევანდელი ჯამი", addMoreFood: "მონიშნე ინგრედიენტები ზემოთ ამ კერძის ასაშენებლად.",
    swapParty: "🎉 შეცვალე ქართული კერძით", partyHint: "წვეულებაზე ხარ? შეცვალე ნებისმიერი კერძი შენი სამზარეულოს სიიდან ქართული კერძით და მაინც მიუახლოვდი დღევანდელ მიზნებს.",
    editProfile: "პროფილის რედაქტირება", language: "ენა", save: "ცვლილებების შენახვა",
    guideTitle: "ვარჯიშის დაწყება", guide1: "გაიხურე 5-10 წუთი — მსუბუქი კარდიო და გახურების სერიები.",
    guide2: "ნელ-ნელა მიდი სამუშაო წონამდე. სამიზნე დიაპაზონის ბოლო 2 გამეორება რეალურად რთული უნდა იყოს სწორი ტექნიკით.",
    guide3: "დაისვენე დანიშნული დრო სერიებს შორის — ეს მორგებულია თითოეულ სავარჯიშოზე.",
    guide4: "პროგრესული დატვირთვა: როცა ყველა სერიაზე მაქსიმალურ გამეორებებს სწორი ტექნიკით აღწევ, შემდეგ ჯერზე დაამატე წონა.",
    guide5: "ჩაწერე ყოველი სერია. მიზნის მრიცხველი მუშაობს მხოლოდ სწორი მონაცემებით.",
    guide6: "პატივი ეცი დასვენების დღეებს. კუნთი იზრდება აღდგენისას, არა მხოლოდ ვარჯიშისას.",
    gotIt: "გასაგებია", noAnimation: "ორიგინალური მოძრაობის სქემა — არა რეალური სპორტსმენის ვიდეო.",
    programBuilt: "პროგრამა შექმნილია", logged: "აღრიცხულია",
    navCardio: "კარდიო", chooseMachine: "აირჩიე ტრენაჟორი",
    incline: "დახრილობა (%)", speed: "სიჩქარე (კმ/სთ)", level: "წინააღმდეგობის დონე",
    startCardio: "დაწყება", pauseCardio: "პაუზა", resumeCardio: "გაგრძელება", resetCardio: "განულება", finishCardio: "სესიის დასრულება",
    elapsed: "გასული დრო", caloriesBurned: "დაწვილი კალორია",
    hydrationTitle: "წყლის მიღება", hydrationGoalLabel: "დღიური მიზანი", hydrationReminder: "💧 დროა დალიო წყალი — გადაჰკარი ყლუპი.",
    logWater: "წყლის დამატება",
    gameTitle: "სკვოტის რბოლა", gameIntro: "აჭერე სწრაფად, რომ შტანგით ადექი ვადის ამოწურვამდე. რაც მძიმეა შტანგა, მით მეტი შეხებაა საჭირო.",
    repComplete: "გამეორება დასრულდა!", squished: "გაგილეწა! სცადე თავიდან.", nextRep: "შემდეგი გამეორება", tryAgainGame: "თავიდან ცდა",
    bestLift: "საუკეთესო აწევა", playGame: "ითამაშე დასვენებისას", tapToLift: "აჭერე!", getReady: "მზად იყავი…", currentWeight: "შტანგის წონა",
    physique: "აღნაგობა", physiqueNote: "ვარჯიშის სტაბილურობა, XP და მიღწევები აყალიბებს შენს Forge იდენტობას.",
    rank: "რანგი", badges: "ნიშნები", nextRank: "შემდეგი რანგი", unlocked: "გახსნილია", locked: "დაბლოკილია", milestones: "მიღწევები",
    programOverview: "პროგრამის მიმოხილვა", programPurpose: "შედგენილია შენი მიზნის, გრაფიკისა და ხელმისაწვდომი ინვენტარის მიხედვით.", programTargets: "სამიზნე კუნთები", weeklyStructure: "კვირის სტრუქტურა", trainingDays: "სავარჯიშო დღეები", includedExercises: "სავარჯიშოები", expectedProgression: "პროგრესის პრინციპი", recoveryStructure: "აღდგენა", suitableFor: "ვისთვისაა", whatToExpect: "რას უნდა ელოდო", enterProgram: "ვარჯიშზე გადასვლა", progressionText: "როცა ყველა სეტში სუფთა ტექნიკით მიაღწევ გამეორებების ზედა ზღვარს, შემდეგ ვარჯიშზე გაზარდე წონა ან დატვირთვა.", recoveryText: "დასვენების დღეები განაწილებულია არჩეული სიხშირის მიხედვით; თითოეულ ვარჯიშს თავისი სეტებს შორის დასვენების დროც აქვს.", suitableText: "შენს მიზანს, არჩეულ სპლიტს, ინვენტარსა და კვირაში ვარჯიშის სასურველ სიხშირეს.", expectText: "თანმიმდევრულ ვარჯიშს, დატვირთვის ეტაპობრივ ზრდას, შედეგების აღრიცხვასა და აღდგენაზე მორგებულ გრაფიკს.",
    scannerTab: "სკანერი", foodScanner: "საკვების სკანერი", scanBarcode: "ბარკოდის სკანირება", photoFood: "კერძის ფოტო", scannerHint: "დაასკანერე შეფუთვის ბარკოდი ან გადაიღე კერძი, შემდეგ გადაამოწმე მონაცემები და დაამატე დღიურ კვებაში.", barcodeLookup: "პროდუქტის ამოცნობა", barcodePlaceholder: "ბარკოდის ნომერი", cameraEstimate: "ფოტოდან მიღებული მონაცემები სავარაუდოა", cameraEstimateNote: "ფოტოდან პორციისა და მაკროების შეფასება შეიძლება არაზუსტი იყოს. ჩაწერამდე გადაამოწმე და შეცვალე პორცია.", chooseMatch: "რომელი საკვებია", portionEstimate: "სავარაუდო პორცია", scanFailed: "ბარკოდი ვერ ამოვიცანი. ნომერი შეგიძლია ხელით შეიყვანო.", productNotFound: "პროდუქტის კვებითი მონაცემები ვერ მოიძებნა.", recognitionUnavailable: "ფოტოდან ავტომატური ამოცნობისთვის საჭიროა ვიზუალური ამოცნობის სერვისი. მანამდე შეგიძლია თავად დაადასტურო ყველაზე ახლო საკვები და პორცია.", logScan: "კვების დღიურში დამატება",
    tier0: "ახლა იწყებ", tier1: "თბება", tier2: "შენდება", tier3: "მაგრდება", tier4: "ძლიერი", tier5: "საოცარი ფორმა", tier6: "ლეგენდარული",
    mealPlanTab: "კვების გეგმა", logFoodTab: "კალკულატორი", selectFood: "საკვები", amountLabel: "რაოდენობა",
    addToLog: "დღევანდელ ჩანაწერში დამატება", todayLog: "დღევანდელი ჩანაწერი", noEntries: "დღეს ჯერ არაფერია ჩაწერილი.",
    loggedTotals: "ჩაწერილია ჯერჯერობით", ofTarget: "მიზნიდან",
    myEquipment: "ჩემი სავარჯიშო აღჭურვილობა", equipmentIntro: "მონიშნე რა გაქვს დარბაზში — პროგრამა მხოლოდ შესაბამის სავარჯიშოებს გამოიყენებს.",
    generateWorkout: "ვარჯიშის გენერირება", selectAll: "ყველას მონიშვნა", equipUpdated: "ვარჯიში განახლდა შენი აღჭურვილობის მიხედვით",
    noEquipMatch: "დღევანდელი დღისთვის შესაბამისი სავარჯიშო ვერ მოიძებნა. დაამატე მეტი აღჭურვილობა პროფილში.",
    shoppingList: "სავაჭრო სია", shopHint: "რეალურ კალათაში ნივთების დამატება არ შემიძლია — დააჭირე მაღაზიას გასახსნელად და დაგიკოპირებ სახელს, რომ ჩასვა საძიებო ველში.",
    copyList: "სრული სიის კოპირება", copied: "დაკოპირდა",
    notForMe: "არ მომწონს", swap: "შეცვლა", swappedNote: "აღარ შემოგთავაზებ. გააუქმე ნებისმიერ დროს პროფილში.",
    dislikedTitle: "გამოტოვებული სავარჯიშოები", noDisliked: "ჯერ არაფერი გამოგიტოვებია.", restore: "დაბრუნება",
    theme: "თემა", themeDark: "მუქი", themeLight: "ღია",
    viewRecipe: "🍳 რეცეპტის ნახვა", recipeSteps: "როგორ მოვამზადოთ", chefsNote: "შეფის რჩევა",
    georgianDishNote: "ტრადიციული ქართული კერძი — საუკეთესოა ტრადიციული მეთოდით ახლად მომზადებული, არა გახურებული.",
    workoutCelebrate: "ვარჯიში დასრულებულია!", waterCelebrate: "წყლის მიზანი მიღწეულია!",
    saucesTab: "სოუსები", bestWith: "საუკეთესოა", ingredients: "ინგრედიენტები", instructions: "ინსტრუქცია",
    supplementsTab: "დანამატები", supplementBenefits: "სარგებელი", typicalDose: "სტანდარტული დოზა", supplementCautions: "გასათვალისწინებელი", goalLabel: "მიზანი",
    supplementsDisclaimer: "მხოლოდ საგანმანათლებლო ინფორმაციაა, არა სამედიცინო რჩევა. ეფექტი ინდივიდუალურია. მიღებამდე უკონსულტირდი ექიმს ან ფარმაცევტს — განსაკუთრებით ორსულობის, 18 წლამდე ასაკის ან მედიკამენტების მიღების შემთხვევაში.",
    shopVitamini: "შეიძინე vitamini.ge-ზე",
    forgeScore: "Forge ქულა", forgeScoreNote: "სტაბილურობის ქულაა, არა სამედიცინო გაზომვა.",
    forgeLevel: "Forge დონე", xpLabel: "XP",
    forgeCoach: "Forge მწვრთნელი", whyThis: "რატომ?",
    chatWithCoach: "ჰკითხე Forge მწვრთნელს", coachGreeting: "გამარჯობა! მე ვარ Forge მწვრთნელი — მკითხე შენი ვარჯიშის, აღდგენის ან კვების შესახებ. ვხედავ შენს რეალურ ForgeFit მონაცემებს, ასე რომ ჩემი პასუხები დაფუძნებულია იმაზე, რაც რეალურად ჩაწერე, არა ვარაუდებზე.",
    coachPlaceholder: "მკითხე ვარჯიშის შესახებ…", coachThinking: "ვფიქრობ…", coachError: "ვერ დავუკავშირდი მწვრთნელს ახლა — სცადე ცოტა ხანში.", coachTimeout: "ძალიან დიდხანს გაგრძელდა, ამიტომ შეწყვიტა ლოდინი. კავშირი შესაძლოა ნელია — სცადე ისევ.", coachRateLimit: "ამ სესიის გამოყენების ლიმიტს მიაღწიე — მწვრთნელი მალე დაბრუნდება{when}. ForgeFit-ის დანარჩენი ნაწილები ნორმალურად მუშაობს.", send: "გაგზავნა",
    overateNotice: "დღეს მიზანს გადააჭარბე {n} კკალ-ით.", overateAction: "დააბალანსე მომდევნო 7 დღეში",
    correctionActive: "დიეტა კორექტირებულია: -{n} კკალ/დღეში {date}-მდე, {date2}-ის გადაჭარბების დასაბალანსებლად.", cancelCorrection: "კორექტირების გაუქმება",
    correctionApplied: "მომდევნო 7 დღე კორექტირებულია", correctionNote: "დაცულია უსაფრთხო დღიური მინიმუმი — ეს კვირის განმავლობაში გასაშუალოებაა, არა შეზღუდვა.",
    scheduleChanged: "დღევანდელი სესია განახლდა: {focus}.", scheduleSwitchOption: "შეცვალე დღეს {focus}-ზე", scheduleRestOption: "დღეს დაისვენე",
    coachDisclaimer: "Forge მწვრთნელი იყენებს შენს ჩაწერილ მონაცემებს, მაგრამ არ არის სამედიცინო პროფესიონალი. ტრავმის ან ჯანმრთელობის პრობლემის შემთხვევაში მიმართე ექიმს.",
    forgeRecovery: "Forge აღდგენა", forgeChallenges: "Forge გამოწვევები",
    notEnoughData: "ჯერ საკმარისი მონაცემი არ არის — განაგრძე ForgeFit-ის გამოყენება და ეს ავსებულ იქნება.",
    training: "ვარჯიში", consistency: "სტაბილურობა", activityScore: "აქტივობა", nutritionScore: "კვება", recoveryScore: "აღდგენა",
    logRecoveryBtn: "დღევანდელი აღდგენის ჩაწერა", recoveryLogged: "აღდგენა ჩაწერილია", cardioLogged: "სესია ჩაწერილია",
    sleepHours: "ძილი (საათი)", sleepQuality: "ძილის ხარისხი", fatigueLevel: "დაღლილობა", stressLevel: "სტრესი",
    sorenessLevel: "ტკივილი (არასავალდებულო, კუნთის მიხედვით)", logSession: "სესიის დასრულება და ჩაწერა",
    low: "დაბალი", high: "მაღალი",
    challengeConsistency: "სტაბილურობის Forge", challengeConsistencyDesc: "დაასრულე ყველა დაგეგმილი ვარჯიში 2 კვირის განმავლობაში.",
    challenge30day: "30-დღიანი Forge", challenge30dayDesc: "დაასრულე 20 ვარჯიში 30 დღეში.",
    challengeStrength: "ძალის Forge", challengeStrengthDesc: "დააფიქსირე 3 ახალი პირადი რეკორდი.",
    challengeHydration: "წყლის Forge", challengeHydrationDesc: "მიაღწიე წყლის მიზანს ზედიზედ 7 დღე.",
    coachNoData: "ჩაწერე რამდენიმე ვარჯიში და დაგიწყებ რეალურ რეკომენდაციებს შენივე მონაცემებზე დაყრდნობით.",
    coachStayWeight: "დარჩი {w}{u}-ზე {ex}-ში — მიზნად დაისახე ყველა სეტის მაქსიმალური გამეორება წონის დამატებამდე.",
    coachIncreaseWeight: "ყველა სეტს ასრულებ {ex}-ში — სცადე {w}{u} შემდეგ ჯერზე.",
    coachRestSuggestion: "დღეს დაღლილობა/ტკივილი მაღალია — განიხილე მსუბუქი სესია ან დასვენების დღე.",
    coachStreakPraise: "კარგი სტაბილურობა ბოლო დროს — {n} სესია ბოლო პერიოდში. შეინარჩუნე სერია.",
  },
};
function L(obj, lang) { if (!obj) return ""; if (typeof obj === "string") return obj; return obj[lang] || obj.en || ""; }

/* ---------------------------------- LOOKUP TABLES ---------------------------------- */
const MUSCLE_LABEL = {
  chest: { en: "Chest", ka: "მკერდი" },
  back: { en: "Back", ka: "ზურგი" },
  biceps: { en: "Biceps", ka: "ბიცეფსი" },
  triceps: { en: "Triceps", ka: "ტრიცეფსი" },
  quads: { en: "Quads", ka: "კვადრიცეფსი" },
  hamstrings: { en: "Hamstrings & Glutes", ka: "ბარძაყის უკანა კუნთები და დუნდულები" },
  shoulders: { en: "Shoulders", ka: "მხრები" },
  calves: { en: "Calves", ka: "წვივის კუნთები" },
};
const FOCUS_LABEL = {
  push: { en: "Push", ka: "პუში" }, pull: { en: "Pull", ka: "პული" }, legs: { en: "Legs", ka: "ფეხები" },
  upper: { en: "Upper Body", ka: "სხეულის ზედა ნაწილი" }, lower: { en: "Lower Body", ka: "სხეულის ქვედა ნაწილი" }, full: { en: "Full Body", ka: "მთელი სხეული" },
  chest: MUSCLE_LABEL.chest, back: MUSCLE_LABEL.back, shoulders: MUSCLE_LABEL.shoulders,
  arms: { en: "Arms", ka: "მკლავები" }, rest: { en: "Rest", ka: "დასვენება" },
};
const SPLIT_LABEL = {
  ppl: { en: "Push / Pull / Legs", ka: "პუში / პული / ფეხები" },
  upperLower: { en: "Upper / Lower", ka: "ზედა / ქვედა" },
  bro: { en: "Bro Split", ka: "კუნთების მიხედვით სპლიტი" },
  full: { en: "Full Body", ka: "მთელი სხეული" },
};
const DOW = { en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ka: ["კვ", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"] };
const TIER_LABEL_KEYS = ["tier0", "tier1", "tier2", "tier3", "tier4", "tier5", "tier6"];

/* ---------------------------------- EXERCISE DATA ---------------------------------- */
const RAW = {
  chest: [
    { id: "chest-warmup", warmup: true, rest: 30, sets: 2, reps: "15", pattern: "raise", equip: ["dumbbell", "bench"],
      name: { en: "Incline DB Y-Raise", ka: "დახრილ სკამზე Y-აწევა ჰანტელებით" },
      note: { en: "Warm-up · light weight, shoulder activation", ka: "გახურება · მსუბუქი წონა, მხრის აქტივაცია" },
      setup: { en: "Lie prone on an incline bench set to 30°. Hold light dumbbells, arms hanging straight down.", ka: "დაწექი მუცელზე დახრილ სკამზე 30°-ზე. აიღე მსუბუქი ჰანტელები, ხელები პირდაპირ ჩამოშვებული." },
      alt: { en: "Band Pull-Apart", ka: "რეზინის გაწელვა" },
      altNote: { en: "Anchor a light band at chest height and pull it apart, squeezing shoulder blades.", ka: "დაამაგრე მსუბუქი რეზინი მკერდის სიმაღლეზე და გაწიე გვერდებზე, დაძაბე მხრის ბეჭები." } },
    { id: "chest-1", rest: 120, sets: 4, reps: "8-10", pattern: "press", equip: ["dumbbell", "bench"],
      name: { en: "Incline Dumbbell Press", ka: "დახრილი პრესი ჰანტელებით" },
      note: { en: "Slow eccentric, squeeze at the top", ka: "ნელი დაშვება, სრული დაძაბვა ზემოთ" },
      setup: { en: "Bench at 30-45°. Dumbbells rest on thighs, kick them up to shoulder height to start.", ka: "სკამი 30-45°-ზე. ჰანტელები ბარძაყებზეა, აწიე მხრების სიმაღლემდე დასაწყებად." },
      alt: { en: "Incline Push-Up (feet elevated)", ka: "დახრილი დაწოლა (ფეხები ამაღლებული)" },
      altNote: { en: "Elevate feet on a chair to bias the upper chest without a bench.", ka: "დადგი ფეხები სკამზე, რომ ზედა მკერდი დატვირთო სკამის გარეშე." } },
    { id: "chest-2", rest: 75, sets: 3, reps: "12-15", pattern: "flye", equip: ["cable", "bench"],
      name: { en: "Incline Cable Flyes", ka: "დახრილი ტროსის განზიდვა" },
      note: { en: "Full stretch, constant tension", ka: "სრული გაწელვა, მუდმივი დაძაბულობა" },
      setup: { en: "Set both cable pulleys low, incline bench between them. Start with a deep stretch across the chest.", ka: "დაასწორე ორივე ტროსი დაბლა, დახრილი სკამი მათ შორის. დაიწყე მკერდის ღრმა გაწელვით." },
      alt: { en: "Floor Flye with Bands", ka: "იატაკზე განზიდვა რეზინით" },
      altNote: { en: "Loop a band behind your back, lie on the floor, and mimic the flye path.", ka: "გაატარე რეზინი ზურგს უკან, დაწექი იატაკზე და გაიმეორე განზიდვის მოძრაობა." } },
    { id: "chest-3", rest: 90, sets: 3, reps: "8-10", pattern: "press", equip: ["machine"],
      name: { en: "Hammer Strength Incline Press", ka: "Hammer Strength დახრილი პრესი" },
      note: { en: "Drop set on the final set", ka: "დროფ-სეტი ბოლო სეტზე" },
      setup: { en: "Adjust seat so handles sit at mid-chest level.", ka: "დაარეგულირე სავარძელი, რომ სახელურები მკერდის შუა ნაწილთან იყოს." },
      alt: { en: "Pike Push-Up", ka: "Pike დაწოლა" },
      altNote: { en: "Hips high, hands under shoulders — presses more of the load into the upper chest and delts.", ka: "თეძოები მაღლა, ხელები მხრების ქვეშ — მეტი დატვირთვა ზედა მკერდსა და დელტებზე." } },
    { id: "chest-4", rest: 60, sets: 3, reps: "12-15", pattern: "flye", equip: ["machine"],
      name: { en: "Pec Deck Machine", ka: "Pec Deck მანქანა" },
      note: { en: "Deep stretch, hard contraction", ka: "ღრმა გაწელვა, ძლიერი შეკუმშვა" },
      setup: { en: "Seat height so handles are at chest level, elbows softly bent.", ka: "სავარძლის სიმაღლე ისეთი, რომ სახელურები მკერდის დონეზე იყოს, იდაყვები ოდნავ მოხრილი." },
      alt: { en: "Standing Chest Squeeze", ka: "დგომში მკერდის შეკუმშვა" },
      altNote: { en: "Press palms together at chest height and squeeze hard for the target reps.", ka: "მიაჭირე ხელისგულები ერთმანეთს მკერდის დონეზე და მაგრად შეკუმშე." } },
    { id: "chest-5", rest: 90, sets: 3, reps: "10-12", pattern: "dip", equip: ["pullupbar"],
      name: { en: "Machine / Parallel Bar Dips", ka: "მანქანით ან ბარებზე დაწევა (დიპსი)" },
      note: { en: "Superset to failure", ka: "სუპერსეტი უკუგდებამდე" },
      setup: { en: "Grip bars shoulder-width, lean torso forward slightly to bias chest over triceps.", ka: "დაიჭირე ბარები მხრების სიგანეზე, ოდნავ დახარე ტორსი წინ მკერდის დასატვირთად." },
      alt: { en: "Bodyweight Dip on Chairs", ka: "დიპსი ორ სკამზე" },
      altNote: { en: "Two sturdy chairs back to back, dip between them with control.", ka: "ორი მდგრადი სკამი ერთმანეთის პირისპირ, დაეშვი კონტროლით მათ შორის." } },
    { id: "chest-6", rest: 45, sets: 2, reps: "Failure", pattern: "pushup", equip: [],
      name: { en: "Push-Ups", ka: "დაწოლები" },
      note: { en: "Finisher burnout", ka: "დამამთავრებელი, უკუგდებამდე" },
      setup: { en: "Hands just outside shoulders, straight line from head to heels.", ka: "ხელები მხრებზე ოდნავ გარეთ, სხეული სწორ ხაზზე თავიდან ქუსლებამდე." },
      alt: { en: "Push-Ups", ka: "დაწოლები" },
      altNote: { en: "Already bodyweight — the home version and gym version are the same.", ka: "უკვე საკუთარი წონით — სახლის ვერსია იგივეა, რაც სავარჯიშო დარბაზში." } },
  ],
  triceps: [
    { id: "tri-1", rest: 30, sets: 4, reps: "12-15", pattern: "extension", equip: ["cable"],
      name: { en: "Rope Press Down", ka: "თოკით ტროსის დაწოლა ქვემოთ" },
      note: { en: "Tri-set · minimal rest", ka: "ტრი-სეტი · მინიმალური დასვენება" },
      setup: { en: "Rope attachment high on the cable stack, elbows pinned to your sides.", ka: "თოკის სახელური მაღლა ტროსზე, იდაყვები მიჭერილი გვერდებზე." },
      alt: { en: "Band Press Down", ka: "რეზინით დაწოლა ქვემოთ" },
      altNote: { en: "Anchor a band overhead and press down the same way.", ka: "დაამაგრე რეზინი თავს ზემოთ და დაწექი იმავე მოძრაობით." } },
    { id: "tri-2", rest: 30, sets: 4, reps: "10-12", pattern: "extension", equip: ["dumbbell", "bench"],
      name: { en: "Incline DB Skull Crusher", ka: "დახრილი 'თავის მტვრევა' ჰანტელით" },
      note: { en: "Tri-set · control the stretch", ka: "ტრი-სეტი · აკონტროლე გაწელვა" },
      setup: { en: "Lie on an incline bench, dumbbells over your forehead, elbows fixed.", ka: "დაწექი დახრილ სკამზე, ჰანტელები შუბლის ზემოთ, იდაყვები ფიქსირებული." },
      alt: { en: "Diamond Push-Up", ka: "ბრილიანტისებრი დაწოლა" },
      altNote: { en: "Hands together under your chest, elbows tucked tight to the ribs.", ka: "ხელები ერთმანეთთან მკერდის ქვეშ, იდაყვები მჭიდროდ ნეკნებთან." } },
    { id: "tri-3", rest: 60, sets: 4, reps: "12-15", pattern: "extension", equip: ["cable"],
      name: { en: "Overhead Cable Extension", ka: "ტროსით გაშლა თავს ზემოთ" },
      note: { en: "Completes the tri-set", ka: "ასრულებს ტრი-სეტს" },
      setup: { en: "Face away from the low pulley, rope overhead, elbows pointed forward.", ka: "დაუზურგდი დაბალ ბლოკს, თოკი თავს ზემოთ, იდაყვები წინ." },
      alt: { en: "Overhead DB Extension", ka: "თავს ზემოთ გაშლა ჰანტელით" },
      altNote: { en: "One dumbbell held with both hands behind your head, elbows tucked.", ka: "ერთი ჰანტელი ორივე ხელით თავს უკან, იდაყვები მჭიდროდ." } },
  ],
  back: [
    { id: "back-warmup", warmup: true, rest: 30, sets: 3, reps: "12-15", pattern: "pulldown", equip: ["cable"],
      name: { en: "Lat Pulldown", ka: "ვერტიკალური ბერკეტი (ლატი)" },
      note: { en: "Warm-up · full range of motion", ka: "გახურება · სრული ამპლიტუდა" },
      setup: { en: "Knees locked under the pad, grip just outside shoulder width.", ka: "მუხლები ფიქსირებული საყრდენის ქვეშ, ხელის დაჭერა მხრებზე ოდნავ გარეთ." },
      alt: { en: "Doorway Band Pulldown", ka: "რეზინით ჩამოწევა კარის ღიობში" },
      altNote: { en: "Anchor a band above a door, pull down mimicking the same path.", ka: "დაამაგრე რეზინი კარის ზემოთ და ჩამოწიე იმავე ტრაექტორიით." } },
    { id: "back-1", rest: 120, sets: 4, reps: "8-10", pattern: "row", equip: ["barbell"],
      name: { en: "Barbell Bent-Over Row", ka: "შტანგის მიწევა დახრილში" },
      note: { en: "Controlled eccentric, chest to bar", ka: "კონტროლირებადი დაშვება, მკერდი შტანგამდე" },
      setup: { en: "Hinge to ~45°, flat back, bar starts just below the knees.", ka: "დაიხარე ~45°-ზე, ზურგი სწორი, შტანგა მუხლების ქვემოთ იწყება." },
      alt: { en: "Single-Arm Backpack Row", ka: "ერთი ხელით ჩანთის მიწევა" },
      altNote: { en: "A loaded backpack or duffel bag rowed one arm at a time, braced on a chair.", ka: "დატვირთული ჩანთა, მიწიე ერთი ხელით სკამზე დაყრდნობით." } },
    { id: "back-2", rest: 90, sets: 3, reps: "10-12", pattern: "row", equip: ["machine"],
      name: { en: "T-Bar Row", ka: "T-ბარის მიწევა" },
      note: { en: "Chest-supported, isolates lats & rhomboids", ka: "მკერდზე დაყრდნობით, გამოყოფს ზურგის ფართო კუნთებს" },
      setup: { en: "Chest against the pad, handles at arm's length to start.", ka: "მკერდი საყრდენზე, სახელურები ხელის სიგრძეზე დასაწყისში." },
      alt: { en: "Bent-Over Backpack Row", ka: "ჩანთის მიწევა დახრილში" },
      altNote: { en: "Same bent-over hinge, rowing a loaded bag with both hands.", ka: "იგივე დახრილი პოზა, ორივე ხელით ჩანთის მიწევა." } },
    { id: "back-3", rest: 90, sets: 3, reps: "10-12", pattern: "row", equip: ["dumbbell", "bench"],
      name: { en: "Dumbbell Row", ka: "ჰანტელის მიწევა" },
      note: { en: "Neutral grip, elbows close to body", ka: "ნეიტრალური დაჭერა, იდაყვი სხეულთან ახლოს" },
      setup: { en: "One knee and hand on a bench, flat back, free arm hanging straight down.", ka: "ერთი მუხლი და ხელი სკამზე, ზურგი სწორი, თავისუფალი ხელი ჩამოშვებული." },
      alt: { en: "Towel Row on a Table", ka: "პირსახოცით მიწევა მაგიდაზე" },
      altNote: { en: "Loop a towel under a sturdy table edge and row your bodyweight back.", ka: "გაატარე პირსახოცი მაგიდის კიდეზე და მიიწიე საკუთარი წონით." } },
    { id: "back-4", rest: 75, sets: 3, reps: "12-15", pattern: "row", equip: ["cable"],
      name: { en: "Seated Cable Row", ka: "ტროსის მიწევა ჯდომში" },
      note: { en: "Full stretch at extension", ka: "სრული გაწელვა გაშლისას" },
      setup: { en: "Feet on the platform, slight knee bend, sit tall.", ka: "ფეხები პლატფორმაზე, მუხლი ოდნავ მოხრილი, ზურგი სწორი." },
      alt: { en: "Resistance Band Row", ka: "მიწევა რეზინით" },
      altNote: { en: "Anchor a band around a pole, sit and row toward your torso.", ka: "დაამაგრე რეზინი ბოძზე, დაჯექი და მიიწიე ტორსისკენ." } },
    { id: "back-5", rest: 75, sets: 4, reps: "12-15", pattern: "pulldown", equip: ["cable"],
      name: { en: "Wide-Grip Lat Pulldown", ka: "ფართო ხელით ლატ ჩამოწევა" },
      note: { en: "Volume day", ka: "მოცულობის დღე" },
      setup: { en: "Grip wide, lean back slightly, pull to upper chest.", ka: "დაიჭირე ფართოდ, ოდნავ გადაიხარე უკან, ჩამოწიე ზედა მკერდამდე." },
      alt: { en: "Wide-Grip Doorway Pulldown", ka: "ფართო ჩამოწევა კარის ღიობში" },
      altNote: { en: "Same band-in-doorway setup with a wider hand position.", ka: "იგივე რეზინის სქემა კარში, ხელები უფრო ფართოდ." } },
    { id: "back-6", rest: 60, sets: 3, reps: "15-20", pattern: "pulldown", equip: ["cable"],
      name: { en: "Straight-Arm Cable Pulldown", ka: "სწორი ხელით ტროსის ჩამოწევა" },
      note: { en: "Volume day · lat isolation", ka: "მოცულობის დღე · ლატის იზოლაცია" },
      setup: { en: "Rope or bar high on the cable, arms straight, hinge slightly at the hips.", ka: "თოკი ან ბარი მაღლა ტროსზე, ხელები სწორი, ოდნავ დაიხარე თეძოებში." },
      alt: { en: "Standing Band Pulldown", ka: "ჩამოწევა რეზინით დგომში" },
      altNote: { en: "Anchor a band overhead, arms straight, pull down and back.", ka: "დაამაგრე რეზინი თავს ზემოთ, ხელები სწორი, ჩამოწიე უკან და ქვემოთ." } },
  ],
  biceps: [
    { id: "bi-1", rest: 30, sets: 4, reps: "10-12", pattern: "curl", equip: ["barbell", "bench"],
      name: { en: "EZ Bar Preacher Curl", ka: "EZ ბარით მოხრა 'მქადაგებლის' სკამზე" },
      note: { en: "Tri-set · minimal rest", ka: "ტრი-სეტი · მინიმალური დასვენება" },
      setup: { en: "Armpits over the top of the preacher pad, full arm extension at the bottom.", ka: "იღლიები საყრდენის თავზე, ხელი სრულად გაშლილი ქვემოთ." },
      alt: { en: "Chair Preacher Curl", ka: "მოხრა სკამზე დაყრდნობით" },
      altNote: { en: "Rest the back of your arm on a chair back, curl a filled bag or dumbbell.", ka: "დააყრდენი ხელი სკამის საზურგეზე, მოხარე დატვირთული ჩანთა ან ჰანტელი." } },
    { id: "bi-2", rest: 30, sets: 4, reps: "10-12", pattern: "curl", equip: ["barbell"],
      name: { en: "Standing Reverse-Grip EZ Curl", ka: "საპირისპირო დაჭერით მოხრა დგომში" },
      note: { en: "Tri-set", ka: "ტრი-სეტი" },
      setup: { en: "Overhand grip, elbows pinned to your sides.", ka: "ზემოდან დაჭერა, იდაყვები მიჭერილი გვერდებზე." },
      alt: { en: "Reverse-Grip Towel Curl", ka: "საპირისპირო დაჭერით მოხრა პირსახოცით" },
      altNote: { en: "Overhand grip on a loaded bag, same strict curling motion.", ka: "ზემოდან დაჭერა დატვირთულ ჩანთაზე, იგივე მკაცრი მოძრაობა." } },
    { id: "bi-3", rest: 45, sets: 4, reps: "12-15", pattern: "curl", equip: ["cable"],
      name: { en: "Low Pulley Cable Curl", ka: "დაბალი ბლოკით მოხრა" },
      note: { en: "Peak contraction", ka: "მაქსიმალური შეკუმშვა" },
      setup: { en: "Stand facing the low pulley, elbows locked at your sides.", ka: "დადექი დაბალი ბლოკის პირისპირ, იდაყვები ფიქსირებული გვერდებზე." },
      alt: { en: "Standing Band Curl", ka: "მოხრა რეზინით დგომში" },
      altNote: { en: "Step on a band, curl the handles up with strict elbow position.", ka: "დადექი რეზინზე, მოხარე სახელურები იდაყვის მკაცრი პოზიციით." } },
    { id: "bi-4", rest: 60, sets: 3, reps: "12-15", pattern: "curl", equip: ["dumbbell"],
      name: { en: "Standing DB Hammer Curl", ka: "'უროს' მოხრა ჰანტელით დგომში" },
      note: { en: "Finisher · brachialis focus", ka: "დამამთავრებელი · ბრაქიალისზე აქცენტით" },
      setup: { en: "Neutral grip (palms facing in), elbows fixed at your sides.", ka: "ნეიტრალური დაჭერა (ხელისგულები შიგნით), იდაყვები ფიქსირებული." },
      alt: { en: "Water Jug Hammer Curl", ka: "'უროს' მოხრა წყლის დოქით" },
      altNote: { en: "A filled jug or bottle, neutral grip, same curling path.", ka: "სავსე დოქი ან ბოთლი, ნეიტრალური დაჭერა, იგივე მოძრაობა." } },
  ],
  quads: [
    { id: "quad-warmup", warmup: true, rest: 30, sets: 2, reps: "15-20", pattern: "legext", equip: ["machine"],
      name: { en: "Leg Extension", ka: "ფეხის გაშლა (მანქანა)" },
      note: { en: "Warm-up · 2nd set as a drop set", ka: "გახურება · მე-2 სეტი დროფ-სეტად" },
      setup: { en: "Ankle pad just above the feet, back flat against the seat.", ka: "საყრდენი კოჭების ზემოთ, ზურგი მჭიდროდ სავარძელზე." },
      alt: { en: "Bodyweight Leg Extension", ka: "ფეხის გაშლა საკუთარი წონით" },
      altNote: { en: "Seated on a chair, extend each leg slowly and hold at the top.", ka: "დაჯექი სკამზე, ნელა გაშალე თითოეული ფეხი და დააკავე ზემოთ." } },
    { id: "quad-1", rest: 150, sets: 4, reps: "6-10", pattern: "squat", equip: ["smith"],
      name: { en: "Smith Machine Squat", ka: "სმიტის მანქანით ჯდომა" },
      note: { en: "Ramp up to your top set", ka: "ეტაპობრივად მიდი მთავარ სეტამდე" },
      setup: { en: "Feet slightly forward of the bar path, bar on the upper traps.", ka: "ფეხები ოდნავ წინ შტანგის ტრაექტორიიდან, შტანგა ზედა ტრაპეციებზე." },
      alt: { en: "Bodyweight / Backpack Squat", ka: "ჯდომა საკუთარი წონით ან ჩანთით" },
      altNote: { en: "Add a loaded backpack for extra resistance, squat to full depth.", ka: "დაამატე დატვირთული ჩანთა დამატებითი წინააღმდეგობისთვის, დაჯექი სრულ სიღრმეზე." } },
    { id: "quad-2", rest: 120, sets: 3, reps: "10-20", pattern: "squat", equip: ["machine"],
      name: { en: "Leg Press", ka: "ფეხის პრესი" },
      note: { en: "Top set heavy + 2 drop sets", ka: "მთავარი სეტი მძიმედ + 2 დროფ-სეტი" },
      setup: { en: "Feet shoulder-width on the platform, lower back stays flat against the pad.", ka: "ფეხები მხრების სიგანეზე პლატფორმაზე, წელი მჭიდროდ საყრდენზე." },
      alt: { en: "Bulgarian Split Squat", ka: "ბულგარული სპლიტ-ჯდომა" },
      altNote: { en: "Rear foot elevated on a chair, front leg does the work.", ka: "უკანა ფეხი სკამზეა ამაღლებული, წინა ფეხი მუშაობს." } },
    { id: "quad-3", rest: 90, sets: 3, reps: "10-12", pattern: "squat", equip: ["dumbbell", "bench"],
      name: { en: "Bulgarian Split Squat", ka: "ბულგარული სპლიტ-ჯდომა" },
      note: { en: "Each leg · quad & glute focus", ka: "თითოეული ფეხი · კვადრიცეფსსა და დუნდულებზე აქცენტით" },
      setup: { en: "Rear foot on a bench, front foot far enough forward for a 90° front knee.", ka: "უკანა ფეხი სკამზე, წინა ფეხი საკმარისად წინ 90° მუხლისთვის." },
      alt: { en: "Bulgarian Split Squat", ka: "ბულგარული სპლიტ-ჯდომა" },
      altNote: { en: "Already bodyweight-friendly — add a backpack for more load at home.", ka: "უკვე შესაფერისია სახლისთვის — დაამატე ჩანთა მეტი დატვირთვისთვის." } },
    { id: "quad-4", rest: 60, sets: 3, reps: "15-20", pattern: "legext", equip: ["machine"],
      name: { en: "Leg Extension (Finisher)", ka: "ფეხის გაშლა (დამამთავრებელი)" },
      note: { en: "High-rep burnout", ka: "მაღალი გამეორებები, უკუგდებამდე" },
      setup: { en: "Same setup as the warm-up, lighter and focused on full lockout.", ka: "იგივე სქემა, რაც გახურებაზე, უფრო მსუბუქი, სრულ გაშლაზე აქცენტით." },
      alt: { en: "Wall Sit", ka: "კედელზე ჯდომა" },
      altNote: { en: "Back flat against a wall, thighs parallel to the floor, hold to burnout.", ka: "ზურგი მჭიდროდ კედელზე, ბარძაყები იატაკის პარალელურად, დააკავე უკუგდებამდე." } },
    { id: "quad-5", sex: "female", rest: 120, sets: 4, reps: "10-12", pattern: "squat", equip: ["dumbbell"],
      name: { en: "Sumo Squat", ka: "სუმო-ჯდომა" },
      note: { en: "Wide stance, toes out · inner thigh & glute emphasis", ka: "ფართო პოზა, ტერფები გარეთ · შიდა ბარძაყზე და დუნდულებზე აქცენტით" },
      setup: { en: "Feet wider than shoulders, toes turned out, hold a dumbbell or kettlebell at your chest.", ka: "ფეხები მხრებზე უფრო ფართოდ, ტერფები გარეთ, დაიჭირე ჰანტელი ან გირი მკერდთან." },
      alt: { en: "Bodyweight Sumo Squat", ka: "სუმო-ჯდომა საკუთარი წონით" },
      altNote: { en: "Same wide stance, hold a heavy bag or book at your chest for extra load.", ka: "იგივე ფართო პოზა, დაიჭირე მძიმე ჩანთა ან წიგნი მკერდთან დამატებითი დატვირთვისთვის." } },
    { id: "quad-6", sex: "female", rest: 90, sets: 3, reps: "12 each leg", pattern: "squat", equip: ["dumbbell"],
      name: { en: "Walking Lunge", ka: "სიარული გამოვარდნით (Lunge)" },
      note: { en: "Continuous steps · quads, glutes & balance", ka: "უწყვეტი ნაბიჯები · კვადრიცეფსი, დუნდულები და წონასწორობა" },
      setup: { en: "Dumbbells at your sides, step forward into a lunge and drive up into the next step.", ka: "ჰანტელები გვერდებზე, გადადგი წინ გამოვარდნით და აეწიე შემდეგ ნაბიჯზე." },
      alt: { en: "Bodyweight Walking Lunge", ka: "სიარული გამოვარდნით საკუთარი წონით" },
      altNote: { en: "Same movement anywhere with space — add a backpack for more load.", ka: "იგივე მოძრაობა ნებისმიერ ადგილას — დაამატე ჩანთა მეტი დატვირთვისთვის." } },
    { id: "quad-7", sex: "female", rest: 75, sets: 3, reps: "10-12 each leg", pattern: "squat", equip: [],
      name: { en: "Curtsy Lunge", ka: "'რევერანსის' გამოვარდნა (Curtsy Lunge)" },
      note: { en: "Cross-behind step · glute medius & outer glute focus", ka: "ჯვარედინი ნაბიჯი უკან · გვერდითი დუნდულების აქცენტით" },
      setup: { en: "Step one leg diagonally behind the other, bend both knees, drive back up through the front heel.", ka: "გადადგი ერთი ფეხი დიაგონალურად მეორის უკან, მოხარე ორივე მუხლი, აეწიე წინა ქუსლზე." },
      alt: { en: "Curtsy Lunge", ka: "'რევერანსის' გამოვარდნა" },
      altNote: { en: "Already bodyweight-friendly — hold a light bag in each hand for more challenge.", ka: "უკვე შესაფერისია საკუთარი წონისთვის — დაიჭირე მსუბუქი ჩანთა თითოეულ ხელში მეტი დატვირთვისთვის." } },
  ],
  hamstrings: [
    { id: "ham-warmup", warmup: true, rest: 30, sets: 2, reps: "15-20", pattern: "legcurl", equip: ["machine"],
      name: { en: "Seated Leg Curl", ka: "ფეხის მოხრა ჯდომში" },
      note: { en: "Warm-up · activate the hamstrings", ka: "გახურება · ბარძაყის უკანა კუნთების გააქტიურება" },
      setup: { en: "Back against the pad, ankle pad above the heels.", ka: "ზურგი საყრდენზე, საყრდენი ქუსლების ზემოთ." },
      alt: { en: "Standing Band Leg Curl", ka: "ფეხის მოხრა რეზინით დგომში" },
      altNote: { en: "Anchor a band low, curl your heel toward your glute.", ka: "დაამაგრე რეზინი დაბლა, მოხარე ქუსლი დუნდულისკენ." } },
    { id: "ham-1", rest: 120, sets: 4, reps: "8-10", pattern: "hinge", equip: ["barbell"],
      name: { en: "Romanian Deadlift", ka: "რუმინული სავარჯიშო (RDL)" },
      note: { en: "Full hip hinge, stretch at the bottom", ka: "სრული თეძოს მოხრა, გაწელვა ქვემოთ" },
      setup: { en: "Soft knee bend, hinge at the hips keeping the bar close to your legs.", ka: "მუხლი ოდნავ მოხრილი, დაიხარე თეძოებში, შტანგა ფეხებთან ახლოს." },
      alt: { en: "Single-Leg Hinge (bodyweight)", ka: "ერთფეხა დახრა (საკუთარი წონით)" },
      altNote: { en: "Hinge on one leg, reaching toward the floor, opposite leg extends back.", ka: "დაიხარე ერთ ფეხზე იატაკისკენ, მეორე ფეხი უკან იშლება." } },
    { id: "ham-2", rest: 90, sets: 4, reps: "10-12", pattern: "legcurl", equip: ["machine"],
      name: { en: "Seated Leg Curl", ka: "ფეხის მოხრა ჯდომში" },
      note: { en: "Pad firm on thighs, full ROM", ka: "საყრდენი მჭიდროდ ბარძაყებზე, სრული ამპლიტუდა" },
      setup: { en: "Thigh pad locked down, curl through the full range.", ka: "ბარძაყის საყრდენი ფიქსირებული, მოხარე სრულ ამპლიტუდაზე." },
      alt: { en: "Sliding Leg Curl (towel/socks)", ka: "ცოცვადი მოხრა (პირსახოცით/წინდით)" },
      altNote: { en: "Lie on your back, heels on a towel on a smooth floor, curl heels toward glutes.", ka: "დაწექი ზურგზე, ქუსლები პირსახოცზე სუფთა იატაკზე, მოხარე დუნდულებისკენ." } },
    { id: "ham-3", rest: 90, sets: 3, reps: "10-12", pattern: "squat", equip: ["dumbbell", "bench"],
      name: { en: "Bulgarian Split Squat", ka: "ბულგარული სპლიტ-ჯდომა" },
      note: { en: "Each leg · glute emphasis", ka: "თითოეული ფეხი · დუნდულებზე აქცენტით" },
      setup: { en: "Same setup as quad day, shift weight into the heel to bias glutes.", ka: "იგივე სქემა, რაც კვადრიცეფსის დღეს, წონა გადაიტანე ქუსლზე დუნდულების დასატვირთად." },
      alt: { en: "Bulgarian Split Squat", ka: "ბულგარული სპლიტ-ჯდომა" },
      altNote: { en: "Bodyweight version works well — add a backpack for load.", ka: "საკუთარი წონით ვერსია კარგად მუშაობს — დაამატე ჩანთა დატვირთვისთვის." } },
    { id: "ham-4", rest: 60, sets: 3, reps: "12-15", pattern: "legcurl", equip: ["machine"],
      name: { en: "Lying Leg Curl", ka: "ფეხის მოხრა წოლაში" },
      note: { en: "Drop set on the final set", ka: "დროფ-სეტი ბოლო სეტზე" },
      setup: { en: "Face down, ankle pad above the heels, hips pressed into the bench.", ka: "დაწექი მუცელზე, საყრდენი ქუსლების ზემოთ, თეძოები მჭიდროდ სკამზე." },
      alt: { en: "Glute Bridge Leg Curl", ka: "მოხრა ხიდის პოზაში" },
      altNote: { en: "Heels on a towel, bridge hips up and curl heels in.", ka: "ქუსლები პირსახოცზე, აწიე თეძოები და მოხარე ქუსლები შიგნით." } },
    { id: "ham-5", sex: "female", rest: 120, sets: 4, reps: "8-12", pattern: "thrust", equip: ["barbell", "bench"],
      name: { en: "Barbell Hip Thrust", ka: "შტანგით თეძოს აწევა (Hip Thrust)" },
      note: { en: "Top glute builder · full lockout at top", ka: "საუკეთესო სავარჯიშო დუნდულებისთვის · სრული გაშლა ზემოთ" },
      setup: { en: "Upper back on a bench, barbell over hips with a pad, drive through heels to full hip extension.", ka: "ზედა ზურგი სკამზე, შტანგა თეძოებზე ბალიშით, აწიე ქუსლებზე თეძოს სრულ გაშლამდე." },
      alt: { en: "Bodyweight Hip Thrust", ka: "თეძოს აწევა საკუთარი წონით" },
      altNote: { en: "Same setup without the bar — add a loaded backpack across the hips for more resistance.", ka: "იგივე პოზა შტანგის გარეშე — დაამატე დატვირთული ჩანთა თეძოებზე მეტი წინააღმდეგობისთვის." } },
    { id: "ham-6", sex: "female", rest: 60, sets: 3, reps: "12-15", pattern: "kickback", equip: ["cable"],
      name: { en: "Cable Glute Kickback", ka: "ტროსით დუნდულის კიკბექი" },
      note: { en: "Squeeze at the top, controlled return", ka: "შეკუმშე ზემოთ, ნელა დაბრუნდი" },
      setup: { en: "Ankle cuff on the low cable, kick the leg straight back and up, torso braced.", ka: "ტროსის მაჯისარი კოჭზე, გაიშალე ფეხი პირდაპირ უკან და ზემოთ, ტორსი ფიქსირებული." },
      alt: { en: "Standing Band Kickback", ka: "რეზინით კიკბექი დგომში" },
      altNote: { en: "Loop a band around your ankles, kick one leg back and up with control.", ka: "შემოახვიე რეზინი კოჭებზე, გაიშალე ერთი ფეხი უკან და ზემოთ კონტროლით." } },
    { id: "ham-7", sex: "female", rest: 45, sets: 3, reps: "20", pattern: "thrust", equip: [],
      name: { en: "Frog Pump", ka: "'ბაყაყის' აწევა (Frog Pump)" },
      note: { en: "Soles together, pulse through the glutes", ka: "ტერფები ერთმანეთთან, პულსირება დუნდულებით" },
      setup: { en: "Lie on your back, soles of feet together, knees wide, pulse hips up.", ka: "დაწექი ზურგზე, ტერფები ერთმანეთთან, მუხლები გვერდებზე, აწიე თეძოები პულსირებით." },
      alt: { en: "Frog Pump", ka: "'ბაყაყის' აწევა" },
      altNote: { en: "Already bodyweight — add a light plate across the hips for more challenge.", ka: "უკვე საკუთარი წონით — დაამატე მსუბუქი წონა თეძოებზე მეტი დატვირთვისთვის." } },
    { id: "ham-8", sex: "female", warmup: true, rest: 30, sets: 3, reps: "20 steps", pattern: "lateral", equip: ["bands"],
      name: { en: "Banded Lateral Walk", ka: "გვერდითი სიარული რეზინით" },
      note: { en: "Warm-up · fires up the glutes before the main lifts", ka: "გახურება · აქტიურებს დუნდულებს მთავარი სავარჯიშოების წინ" },
      setup: { en: "Loop a mini band above the knees, half-squat stance, step sideways keeping tension on the band.", ka: "შემოახვიე მინი რეზინი მუხლების ზემოთ, ნახევრად მოხრილი პოზა, გადადგი გვერდზე რეზინის დაჭიმულობის შენარჩუნებით." },
      alt: { en: "Bodyweight Lateral Walk", ka: "გვერდითი სიარული საკუთარი წონით" },
      altNote: { en: "No band? Sink into a quarter-squat and side-step slowly, keeping constant tension in the glutes.", ka: "რეზინი არ გაქვს? ჩაჯექი მსუბუქად და გადადექი ნელა გვერდზე, დუნდულების დაძაბულობის შენარჩუნებით." } },
    { id: "ham-9", sex: "female", rest: 75, sets: 3, reps: "12-15", pattern: "hinge", equip: ["cable"],
      name: { en: "Cable Pull-Through", ka: "ტროსით გამოწევა (Pull-Through)" },
      note: { en: "Hinge-dominant · teaches the hip hinge while loading the glutes", ka: "თეძოზე დაფუძნებული · ასწავლის თეძოს მოხრას დუნდულების დატვირთვით" },
      setup: { en: "Rope between your legs, face away from the low pulley, hinge and pull through to full hip extension.", ka: "თოკი ფეხებს შორის, დაუზურგდი დაბალ ბლოკს, დაიხარე და გამოწიე თეძოს სრულ გაშლამდე." },
      alt: { en: "Band Pull-Through", ka: "რეზინით გამოწევა" },
      altNote: { en: "Anchor a band low behind you, same hinge-and-pull pattern.", ka: "დაამაგრე რეზინი დაბლა უკან, იგივე მოხრა-გამოწევის მოძრაობა." } },
    { id: "ham-10", sex: "female", rest: 75, sets: 3, reps: "10-12", pattern: "hinge", equip: ["dumbbell"],
      name: { en: "Single-Leg Romanian Deadlift", ka: "ერთფეხა რუმინული სავარჯიშო" },
      note: { en: "Each leg · balance and unilateral glute strength", ka: "თითოეული ფეხი · წონასწორობა და ცალმხრივი დუნდულის ძალა" },
      setup: { en: "Dumbbell in the opposite hand, hinge forward on one leg as the other extends back for balance.", ka: "ჰანტელი საწინააღმდეგო ხელში, დაიხარე წინ ერთ ფეხზე, მეორე უკან იშლება წონასწორობისთვის." },
      alt: { en: "Bodyweight Single-Leg Hinge", ka: "ერთფეხა დახრა საკუთარი წონით" },
      altNote: { en: "Same balance drill without weight — hold a wall or chair for support if needed.", ka: "იგივე წონასწორობის სავარჯიშო წონის გარეშე — საჭიროებისას დაეყრდენი კედელს ან სკამს." } },
  ],
  shoulders: [
    { id: "sh-warmup", warmup: true, rest: 20, sets: 3, reps: "15", pattern: "raise", equip: ["bands"],
      name: { en: "Band Dislocations + Rotations", ka: "რეზინით მხრის როტაცია" },
      note: { en: "Warm-up · non-negotiable prehab", ka: "გახურება · სავალდებულო პრევენცია" },
      setup: { en: "Hold a light band wide, pass it overhead and behind without bending elbows.", ka: "დაიჭირე მსუბუქი რეზინი ფართოდ, გაატარე თავს ზემოთ და უკან იდაყვების მოხრის გარეშე." },
      alt: { en: "Arm Circles", ka: "ხელების ტრიალი" },
      altNote: { en: "Slow, controlled circles forward and backward, building in size.", ka: "ნელი, კონტროლირებადი წრეები წინ და უკან, თანდათან გაზრდილი." } },
    { id: "sh-1", rest: 75, sets: 4, reps: "12-15", pattern: "raise", equip: ["dumbbell"],
      name: { en: "Dumbbell Lateral Raise", ka: "გვერდითი აწევა ჰანტელით" },
      note: { en: "Slow, controlled, pause at the top", ka: "ნელა, კონტროლით, პაუზა ზემოთ" },
      setup: { en: "Slight elbow bend, raise to shoulder height, lead with the elbows.", ka: "იდაყვი ოდნავ მოხრილი, აწიე მხრის სიმაღლემდე, იდაყვები წინ." },
      alt: { en: "Water Bottle Lateral Raise", ka: "გვერდითი აწევა წყლის ბოთლით" },
      altNote: { en: "Same motion with filled bottles or light bags.", ka: "იგივე მოძრაობა სავსე ბოთლებით ან მსუბუქი ჩანთებით." } },
    { id: "sh-2", rest: 120, sets: 4, reps: "8-10", pattern: "press", equip: ["machine"],
      name: { en: "Machine Shoulder Press", ka: "მხრის პრესი მანქანით" },
      note: { en: "Heavy, controlled descent", ka: "მძიმედ, კონტროლირებადი დაშვება" },
      setup: { en: "Seat height so handles start level with your shoulders.", ka: "სავარძლის სიმაღლე ისეთი, რომ სახელურები მხრების დონეზე იწყებოდეს." },
      alt: { en: "Pike Push-Up", ka: "Pike დაწოლა" },
      altNote: { en: "Hips high, hands under shoulders, press through the shoulders.", ka: "თეძოები მაღლა, ხელები მხრების ქვეშ, დაწექი მხრებით." } },
    { id: "sh-3", rest: 60, sets: 4, reps: "12-15", pattern: "row", equip: ["machine"],
      name: { en: "Reverse Pec Deck", ka: "საპირისპირო Pec Deck" },
      note: { en: "Superset with lateral raises", ka: "სუპერსეტი გვერდით აწევასთან" },
      setup: { en: "Chest against the pad, handles set to shoulder height.", ka: "მკერდი საყრდენზე, სახელურები მხრების დონეზე." },
      alt: { en: "Band Face Pull", ka: "რეზინით სახისკენ მიწევა" },
      altNote: { en: "Anchor a band chest-height, pull toward your face, elbows high.", ka: "დაამაგრე რეზინი მკერდის დონეზე, მიიწიე სახისკენ, იდაყვები მაღლა." } },
    { id: "sh-4", rest: 60, sets: 4, reps: "15-20", pattern: "raise", equip: ["dumbbell", "bench"],
      name: { en: "Seated DB Lateral Raise", ka: "გვერდითი აწევა ჯდომში ჰანტელით" },
      note: { en: "Superset with reverse pec deck", ka: "სუპერსეტი საპირისპირო Pec Deck-თან" },
      setup: { en: "Seated to remove momentum from the legs and torso.", ka: "ჯდომში, რომ გამოირიცხოს ინერცია ფეხებიდან და ტორსიდან." },
      alt: { en: "Seated Bottle Lateral Raise", ka: "გვერდითი აწევა ჯდომში ბოთლით" },
      altNote: { en: "Sit on a chair, same raise pattern with filled bottles.", ka: "დაჯექი სკამზე, იგივე მოძრაობა სავსე ბოთლებით." } },
    { id: "sh-5", rest: 60, sets: 3, reps: "15-20", pattern: "facepull", equip: ["cable"],
      name: { en: "Cable Face Pull", ka: "ტროსით სახისკენ მიწევა" },
      note: { en: "Rear delt & rotator cuff health", ka: "უკანა დელტა და მხრის სახსრის ჯანმრთელობა" },
      setup: { en: "Rope at upper-chest height, pull toward your face, elbows flare high.", ka: "თოკი ზედა მკერდის დონეზე, მიიწიე სახისკენ, იდაყვები მაღლა გაშლილი." },
      alt: { en: "Band Face Pull", ka: "რეზინით სახისკენ მიწევა" },
      altNote: { en: "Anchor a band at chest height and pull the same way.", ka: "დაამაგრე რეზინი მკერდის დონეზე და მიიწიე იმავე გზით." } },
  ],
  calves: [
    { id: "calf-1", rest: 60, sets: 4, reps: "15-20", pattern: "calf", equip: ["machine"],
      name: { en: "Standing Calf Raise", ka: "წვივის აწევა დგომში" },
      note: { en: "Full ROM, slow tempo", ka: "სრული ამპლიტუდა, ნელი ტემპი" },
      setup: { en: "Balls of feet on the platform, deep stretch at the bottom.", ka: "ტერფის წინა ნაწილი პლატფორმაზე, ღრმა გაწელვა ქვემოთ." },
      alt: { en: "Single-Leg Calf Raise (stairs)", ka: "ერთფეხა წვივის აწევა კიბეზე" },
      altNote: { en: "On a stair edge, rise up on one leg at a time, full stretch at the bottom.", ka: "კიბის კიდეზე, აწიე ერთი ფეხით, სრული გაწელვა ქვემოთ." } },
    { id: "calf-2", rest: 60, sets: 4, reps: "15-20", pattern: "calf", equip: ["machine"],
      name: { en: "Seated Calf Raise", ka: "წვივის აწევა ჯდომში" },
      note: { en: "Full stretch", ka: "სრული გაწელვა" },
      setup: { en: "Pad across the lower thighs, balls of feet on the platform.", ka: "საყრდენი ბარძაყების ქვედა ნაწილზე, ტერფის წინა ნაწილი პლატფორმაზე." },
      alt: { en: "Seated Calf Raise (book on knee)", ka: "წვივის აწევა ჯდომში (წიგნით მუხლზე)" },
      altNote: { en: "Sit on a chair, weight across your knees, raise heels off the floor.", ka: "დაჯექი სკამზე, დატვირთვა მუხლებზე, აწიე ქუსლები იატაკიდან." } },
  ],
};

const MUSCLES = Object.keys(RAW);
const EXDB = MUSCLES.flatMap((m) => RAW[m].map((e) => ({ ...e, muscle: m })));
const byMuscle = (m) => EXDB.filter((e) => e.muscle === m);
const nonWarm = (arr) => arr.filter((e) => !e.warmup);
const warm = (arr) => arr.filter((e) => e.warmup);
const EQUIPMENT = [
  { id: "barbell", label: { en: "Barbell", ka: "შტანგა" } },
  { id: "dumbbell", label: { en: "Dumbbells", ka: "ჰანტელები" } },
  { id: "bench", label: { en: "Bench", ka: "სკამი" } },
  { id: "cable", label: { en: "Cable Machine", ka: "ტროსული მანქანა" } },
  { id: "machine", label: { en: "Resistance Machines", ka: "ტრენაჟორები" } },
  { id: "smith", label: { en: "Smith Machine", ka: "სმიტის მანქანა" } },
  { id: "pullupbar", label: { en: "Pull-Up Bar / Dip Station", ka: "ჯოხი / დიპის სადგომი" } },
  { id: "bands", label: { en: "Resistance Bands", ka: "რეზინები" } },
];
function equipOk(ex, equipment) {
  if (!equipment) return true; // null = unrestricted, assume a fully equipped gym
  const req = ex.equip || [];
  return req.every((e) => equipment.includes(e));
}
function pick(muscle, n, includeWarmup, sex, equipment, disliked) {
  const g = byMuscle(muscle).filter((e) => (!e.sex || e.sex === sex || (!sex)) && equipOk(e, equipment) && !(disliked && disliked.includes(e.id)));
  let w = [];
  if (includeWarmup) {
    const warmups = warm(g);
    const sexWarm = warmups.filter((e) => e.sex === sex);
    w = sexWarm.length ? sexWarm : warmups;
  }
  const rest = nonWarm(g).slice().sort((a, b) => (b.sex === sex ? 1 : 0) - (a.sex === sex ? 1 : 0));
  return [...w, ...rest.slice(0, n)];
}
function dedupe(list) {
  const seen = new Set(); const out = [];
  for (const e of list) { if (!seen.has(e.id)) { seen.add(e.id); out.push(e); } }
  return out;
}
const DAY_BUILDERS = {
  push: (sex, eq, dis) => dedupe([...pick("chest", 4, true, sex, eq, dis), ...pick("shoulders", 2, false, sex, eq, dis), ...pick("triceps", 2, false, sex, eq, dis)]),
  pull: (sex, eq, dis) => dedupe([...pick("back", 4, true, sex, eq, dis), ...pick("biceps", 3, false, sex, eq, dis)]),
  legs: (sex, eq, dis) => dedupe([...pick("quads", 2, true, sex, eq, dis), ...pick("hamstrings", 4, true, sex, eq, dis), ...pick("calves", 1, false, sex, eq, dis)]),
  upper: (sex, eq, dis) => dedupe([...pick("chest", 2, false, sex, eq, dis), ...pick("back", 2, false, sex, eq, dis), ...pick("shoulders", 1, false, sex, eq, dis), ...pick("biceps", 1, false, sex, eq, dis), ...pick("triceps", 1, false, sex, eq, dis)]),
  lower: (sex, eq, dis) => dedupe([...pick("quads", 2, true, sex, eq, dis), ...pick("hamstrings", 3, true, sex, eq, dis), ...pick("calves", 1, false, sex, eq, dis)]),
  full: (sex, eq, dis) => dedupe([...pick("chest", 1, false, sex, eq, dis), ...pick("back", 1, false, sex, eq, dis), ...pick("shoulders", 1, false, sex, eq, dis), ...pick("quads", 1, true, sex, eq, dis), ...pick("hamstrings", 1, false, sex, eq, dis), ...pick("biceps", 1, false, sex, eq, dis)]),
  chest: (sex, eq, dis) => pick("chest", 6, true, sex, eq, dis),
  back: (sex, eq, dis) => pick("back", 6, true, sex, eq, dis),
  shoulders: (sex, eq, dis) => pick("shoulders", 5, true, sex, eq, dis),
  arms: (sex, eq, dis) => dedupe([...pick("triceps", 3, false, sex, eq, dis), ...pick("biceps", 4, false, sex, eq, dis)]),
  rest: () => [],
};
const PATTERNS = { ppl: ["push", "pull", "legs"], upperLower: ["upper", "lower"], bro: ["chest", "back", "legs", "shoulders", "arms"], full: ["full"] };
const PLACEMENT = { 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 4, 5], 6: [1, 2, 3, 4, 5, 6] };

function buildWeekFocus(split, daysPerWeek) {
  const pattern = PATTERNS[split] || PATTERNS.ppl;
  const placement = PLACEMENT[daysPerWeek] || PLACEMENT[4];
  const week = Array(7).fill("rest");
  placement.forEach((dayIdx, i) => { week[dayIdx] = pattern[i % pattern.length]; });
  return week;
}
function getDayExercises(focus, emphasis, sex, equipment, disliked) {
  const builder = DAY_BUILDERS[focus];
  let list = builder ? builder(sex, equipment, disliked) : [];
  if (emphasis && focus !== "rest") {
    const already = list.filter((e) => e.muscle === emphasis).length;
    if (already < 2) {
      const extra = pick(emphasis, 1, false, sex, equipment, disliked).find((e) => !list.some((l) => l.id === e.id));
      if (extra) list = [...list, extra];
    }
  }
  return list;
}

/* ---------------------------------- FOOD DATA (amount + unit, no more "×N servings") ---------------------------------- */
const U_G = { en: "g", ka: "გ" };
const FOODS = [
  { id: "chicken", cat: "protein", kcal: 165, p: 31, c: 0, f: 3.6, amount: 100, unit: U_G, name: { en: "Chicken Breast", ka: "ქათმის მკერდი" } },
  { id: "beef", cat: "protein", kcal: 217, p: 26, c: 0, f: 12, amount: 100, unit: U_G, name: { en: "Lean Beef", ka: "მჭლე საქონლის ხორცი" } },
  { id: "salmon", cat: "protein", kcal: 208, p: 20, c: 0, f: 13, amount: 100, unit: U_G, name: { en: "Salmon", ka: "ორაგული" } },
  { id: "eggs", cat: "protein", kcal: 78, p: 6, c: 0.6, f: 5, amount: 1, unit: { en: "egg", ka: "კვერცხი" }, name: { en: "Eggs", ka: "კვერცხი" } },
  { id: "tofu", cat: "protein", kcal: 144, p: 15, c: 3, f: 8, amount: 100, unit: U_G, name: { en: "Tofu", ka: "ტოფუ" } },
  { id: "greekyogurt", cat: "dairy", kcal: 100, p: 17, c: 6, f: 0.5, amount: 170, unit: U_G, name: { en: "Greek Yogurt", ka: "ბერძნული იოგურტი" } },
  { id: "cottage", cat: "dairy", kcal: 98, p: 11, c: 3.4, f: 4.3, amount: 100, unit: U_G, name: { en: "Cottage Cheese", ka: "ხაჭო" } },
  { id: "cheddar", cat: "dairy", kcal: 113, p: 7, c: 0.4, f: 9.3, amount: 28, unit: U_G, name: { en: "Cheddar Cheese", ka: "ჩედერის ყველი" } },
  { id: "feta", cat: "dairy", kcal: 75, p: 4, c: 1.2, f: 6, amount: 30, unit: U_G, name: { en: "Feta Cheese", ka: "ფეტა ყველი" } },
  { id: "mozzarella", cat: "dairy", kcal: 85, p: 6.3, c: 0.6, f: 6.3, amount: 30, unit: U_G, name: { en: "Mozzarella", ka: "მოცარელა" } },
  { id: "parmesan", cat: "dairy", kcal: 110, p: 10, c: 0.9, f: 7.3, amount: 28, unit: U_G, name: { en: "Parmesan", ka: "პარმეზანი" } },
  { id: "rice", cat: "carb", kcal: 205, p: 4.3, c: 45, f: 0.4, amount: 160, unit: U_G, name: { en: "White Rice (cooked)", ka: "თეთრი ბრინჯი (მოხარშული)" } },
  { id: "oats", cat: "carb", kcal: 150, p: 5, c: 27, f: 3, amount: 40, unit: U_G, name: { en: "Oats", ka: "შვრია" } },
  { id: "potato", cat: "carb", kcal: 161, p: 4.3, c: 37, f: 0.2, amount: 170, unit: U_G, name: { en: "Potato", ka: "კარტოფილი" } },
  { id: "bread", cat: "carb", kcal: 80, p: 4, c: 14, f: 1, amount: 28, unit: U_G, name: { en: "Whole Wheat Bread", ka: "მთლიანი მარცვლის პური" } },
  { id: "pasta", cat: "carb", kcal: 220, p: 8, c: 43, f: 1.3, amount: 140, unit: U_G, name: { en: "Pasta (cooked)", ka: "მაკარონი (მოხარშული)" } },
  { id: "broccoli", cat: "veg", kcal: 55, p: 3.7, c: 11, f: 0.6, amount: 90, unit: U_G, name: { en: "Broccoli", ka: "ბროკოლი" } },
  { id: "spinach", cat: "veg", kcal: 23, p: 2.9, c: 3.6, f: 0.4, amount: 100, unit: U_G, name: { en: "Spinach", ka: "ისპანახი" } },
  { id: "mixedveg", cat: "veg", kcal: 65, p: 2.6, c: 13, f: 0.3, amount: 150, unit: U_G, name: { en: "Mixed Vegetables", ka: "შერეული ბოსტნეული" } },
  { id: "carrot", cat: "veg", kcal: 41, p: 0.9, c: 10, f: 0.2, amount: 60, unit: U_G, name: { en: "Carrot", ka: "სტაფილო" } },
  { id: "bellpepper", cat: "veg", kcal: 31, p: 1, c: 7, f: 0.3, amount: 120, unit: U_G, name: { en: "Bell Pepper", ka: "ბულგარული წიწაკა" } },
  { id: "cucumber", cat: "veg", kcal: 16, p: 0.7, c: 3.6, f: 0.1, amount: 120, unit: U_G, name: { en: "Cucumber", ka: "კიტრი" } },
  { id: "tomato", cat: "veg", kcal: 22, p: 1.1, c: 4.8, f: 0.2, amount: 125, unit: U_G, name: { en: "Tomato", ka: "პომიდორი" } },
  { id: "onion", cat: "veg", kcal: 44, p: 1.2, c: 10, f: 0.1, amount: 110, unit: U_G, name: { en: "Onion", ka: "ხახვი" } },
  { id: "avocado", cat: "fat", kcal: 240, p: 3, c: 13, f: 22, amount: 150, unit: U_G, name: { en: "Avocado", ka: "ავოკადო" } },
  { id: "oliveoil", cat: "fat", kcal: 40, p: 0, c: 0, f: 4.5, amount: 1, unit: { en: "tsp", ka: "ჩ/კ" }, name: { en: "Olive Oil (for cooking)", ka: "ზეითუნის ზეთი (საჭმლის მოსამზადებლად)" } },
  { id: "sunfloweroil", cat: "fat", kcal: 40, p: 0, c: 0, f: 4.5, amount: 1, unit: { en: "tsp", ka: "ჩ/კ" }, name: { en: "Sunflower Oil (for cooking)", ka: "მზესუმზირის ზეთი (საჭმლის მოსამზადებლად)" } },
  { id: "almonds", cat: "fat", kcal: 164, p: 6, c: 6, f: 14, amount: 28, unit: U_G, name: { en: "Almonds", ka: "ნუში" } },
  { id: "peanutbutter", cat: "fat", kcal: 190, p: 8, c: 6, f: 16, amount: 2, unit: { en: "tbsp", ka: "სუფრის კოვზი" }, name: { en: "Peanut Butter", ka: "არაქისის კარაქი" } },
  // Georgian national dishes — for swapping a meal at a party while still tracking macros.
  { id: "khachapuri", cat: "georgian", kcal: 330, p: 12, c: 35, f: 16, amount: 150, unit: U_G, name: { en: "Khachapuri (Imeruli)", ka: "ხაჭაპური (იმერული)" } },
  { id: "khinkali", cat: "georgian", kcal: 270, p: 12, c: 30, f: 12, amount: 180, unit: U_G, name: { en: "Khinkali (meat)", ka: "ხინკალი (ხორცის)" } },
  { id: "mtsvadi", cat: "georgian", kcal: 375, p: 33, c: 0, f: 25.5, amount: 150, unit: U_G, name: { en: "Mtsvadi (grilled skewer)", ka: "მწვადი" } },
  { id: "lobio", cat: "georgian", kcal: 220, p: 11, c: 30, f: 6, amount: 200, unit: U_G, name: { en: "Lobio (bean stew)", ka: "ლობიო" } },
  { id: "badrijani", cat: "georgian", kcal: 160, p: 4, c: 8, f: 13, amount: 80, unit: U_G, name: { en: "Badrijani Nigvzit", ka: "ბადრიჯანი ნიგვზით" } },
  { id: "satsivi", cat: "georgian", kcal: 320, p: 20, c: 6, f: 24, amount: 150, unit: U_G, name: { en: "Satsivi", ka: "საცივი" } },
  { id: "pkhali", cat: "georgian", kcal: 150, p: 5, c: 10, f: 10, amount: 100, unit: U_G, name: { en: "Pkhali", ka: "ფხალი" } },
  { id: "ojakhuri", cat: "georgian", kcal: 420, p: 18, c: 30, f: 25, amount: 250, unit: U_G, name: { en: "Ojakhuri", ka: "ოჯახური" } },
  { id: "churchkhela", cat: "georgian", kcal: 140, p: 2, c: 20, f: 6, amount: 40, unit: U_G, name: { en: "Churchkhela", ka: "ჩურჩხელა" } },
  { id: "lobiani", cat: "georgian", kcal: 300, p: 10, c: 48, f: 8, amount: 150, unit: U_G, name: { en: "Lobiani", ka: "ლობიანი" } },
  { id: "chvishtari", cat: "georgian", kcal: 260, p: 8, c: 31, f: 11, amount: 100, unit: U_G, name: { en: "Chvishtari", ka: "ჭვიშტარი" } },
  { id: "elarji", cat: "georgian", kcal: 330, p: 12, c: 34, f: 17, amount: 200, unit: U_G, name: { en: "Elarji", ka: "ელარჯი" } },
  { id: "gebzhalia", cat: "georgian", kcal: 240, p: 16, c: 5, f: 18, amount: 150, unit: U_G, name: { en: "Gebzhalia", ka: "გებჟალია" } },
  { id: "nadughi", cat: "dairy", kcal: 160, p: 20, c: 7, f: 6, amount: 150, unit: U_G, name: { en: "Nadughi", ka: "ნადუღი" } },
  { id: "chakhokhbili", cat: "georgian", kcal: 300, p: 35, c: 9, f: 13, amount: 250, unit: U_G, name: { en: "Chakhokhbili", ka: "ჩახოხბილი" } },
  { id: "chakapuli", cat: "georgian", kcal: 320, p: 32, c: 12, f: 16, amount: 250, unit: U_G, name: { en: "Chakapuli", ka: "ჩაქაფული" } },
  { id: "dolma", cat: "georgian", kcal: 280, p: 18, c: 24, f: 12, amount: 220, unit: U_G, name: { en: "Tolma / Dolma", ka: "ტოლმა" } },
  // Expanded protein
  { id: "turkey", cat: "protein", kcal: 135, p: 30, c: 0, f: 1, amount: 100, unit: U_G, name: { en: "Turkey Breast", ka: "ინდაურის მკერდი" } },
  { id: "pork", cat: "protein", kcal: 242, p: 27, c: 0, f: 14, amount: 100, unit: U_G, name: { en: "Pork Loin", ka: "ღორის ხორცი" } },
  { id: "lamb", cat: "protein", kcal: 294, p: 25, c: 0, f: 21, amount: 100, unit: U_G, name: { en: "Lamb", ka: "ცხვრის ხორცი" } },
  { id: "trout", cat: "protein", kcal: 148, p: 21, c: 0, f: 6.6, amount: 100, unit: U_G, name: { en: "Trout", ka: "კალმახი" } },
  { id: "tuna", cat: "protein", kcal: 132, p: 28, c: 0, f: 1.3, amount: 100, unit: U_G, name: { en: "Tuna (canned)", ka: "ტუნა (კონსერვი)" } },
  { id: "shrimp", cat: "protein", kcal: 99, p: 24, c: 0.2, f: 0.3, amount: 100, unit: U_G, name: { en: "Shrimp", ka: "კრევეტი" } },
  { id: "kidneybeans", cat: "protein", kcal: 127, p: 8.7, c: 22.8, f: 0.5, amount: 150, unit: U_G, name: { en: "Kidney Beans (cooked)", ka: "წითელი ლობიო (მოხარშული)" } },
  { id: "lentils", cat: "protein", kcal: 116, p: 9, c: 20, f: 0.4, amount: 150, unit: U_G, name: { en: "Red Lentils (cooked)", ka: "წითელი ოსპი (მოხარშული)" } },
  { id: "chickpeas", cat: "protein", kcal: 164, p: 8.9, c: 27.4, f: 2.6, amount: 150, unit: U_G, name: { en: "Chickpeas (cooked)", ka: "ნიგოზა (მოხარშული)" } },
  // Expanded dairy — Georgian staples
  { id: "matsoni", cat: "dairy", kcal: 60, p: 3.5, c: 4.5, f: 3.2, amount: 200, unit: U_G, name: { en: "Matsoni", ka: "მაწონი" } },
  { id: "sulguni", cat: "dairy", kcal: 285, p: 20, c: 1.5, f: 22, amount: 40, unit: U_G, name: { en: "Sulguni Cheese", ka: "სულგუნი" } },
  { id: "imeruli", cat: "dairy", kcal: 240, p: 18, c: 2, f: 18, amount: 40, unit: U_G, name: { en: "Imeruli Cheese", ka: "იმერული ყველი" } },
  // Expanded grains
  { id: "buckwheat", cat: "carb", kcal: 155, p: 5.7, c: 33, f: 1, amount: 150, unit: U_G, name: { en: "Buckwheat (cooked)", ka: "წიწიბურა (მოხარშული)" } },
  { id: "bulgur", cat: "carb", kcal: 151, p: 5.6, c: 34, f: 0.4, amount: 150, unit: U_G, name: { en: "Bulgur (cooked)", ka: "ბულგური (მოხარშული)" } },
  { id: "quinoa", cat: "carb", kcal: 172, p: 6.1, c: 30, f: 2.8, amount: 150, unit: U_G, name: { en: "Quinoa (cooked)", ka: "კინოა (მოხარშული)" } },
  { id: "shotipuri", cat: "carb", kcal: 90, p: 3, c: 18, f: 0.6, amount: 40, unit: U_G, name: { en: "Shoti Puri", ka: "შოთის პური" } },
  // Expanded vegetables
  { id: "eggplant", cat: "veg", kcal: 25, p: 1, c: 6, f: 0.2, amount: 120, unit: U_G, name: { en: "Eggplant", ka: "ბადრიჯანი" } },
  { id: "zucchini", cat: "veg", kcal: 17, p: 1.2, c: 3.1, f: 0.3, amount: 120, unit: U_G, name: { en: "Zucchini", ka: "ყაბაყი" } },
  { id: "cauliflower", cat: "veg", kcal: 25, p: 1.9, c: 5, f: 0.3, amount: 100, unit: U_G, name: { en: "Cauliflower", ka: "ყვავილოვანი კომბოსტო" } },
  { id: "cabbage", cat: "veg", kcal: 25, p: 1.3, c: 5.8, f: 0.1, amount: 100, unit: U_G, name: { en: "Cabbage", ka: "კომბოსტო" } },
  { id: "beetroot", cat: "veg", kcal: 43, p: 1.6, c: 10, f: 0.2, amount: 100, unit: U_G, name: { en: "Beetroot", ka: "ჭარხალი" } },
  { id: "garlic", cat: "veg", kcal: 149, p: 6.4, c: 33, f: 0.5, amount: 6, unit: U_G, name: { en: "Garlic", ka: "ნიორი" } },
  // Fruits — new category
  { id: "apple", cat: "fruit", kcal: 52, p: 0.3, c: 14, f: 0.2, amount: 180, unit: U_G, name: { en: "Apple", ka: "ვაშლი" } },
  { id: "pear", cat: "fruit", kcal: 57, p: 0.4, c: 15, f: 0.1, amount: 180, unit: U_G, name: { en: "Pear", ka: "მსხალი" } },
  { id: "banana", cat: "fruit", kcal: 89, p: 1.1, c: 23, f: 0.3, amount: 120, unit: U_G, name: { en: "Banana", ka: "ბანანი" } },
  { id: "orange", cat: "fruit", kcal: 47, p: 0.9, c: 12, f: 0.1, amount: 180, unit: U_G, name: { en: "Orange", ka: "ფორთოხალი" } },
  { id: "grape", cat: "fruit", kcal: 69, p: 0.7, c: 18, f: 0.2, amount: 100, unit: U_G, name: { en: "Grapes", ka: "ყურძენი" } },
  { id: "watermelon", cat: "fruit", kcal: 30, p: 0.6, c: 8, f: 0.2, amount: 200, unit: U_G, name: { en: "Watermelon", ka: "საზამთრო" } },
  { id: "persimmon", cat: "fruit", kcal: 70, p: 0.6, c: 18.6, f: 0.2, amount: 170, unit: U_G, name: { en: "Persimmon", ka: "ხურმა" } },
  { id: "pomegranate", cat: "fruit", kcal: 83, p: 1.7, c: 19, f: 1.2, amount: 150, unit: U_G, name: { en: "Pomegranate", ka: "ბროწეული" } },
  { id: "fig", cat: "fruit", kcal: 74, p: 0.8, c: 19, f: 0.3, amount: 100, unit: U_G, name: { en: "Fig", ka: "ლეღვი" } },
  // Expanded nuts/fats
  { id: "walnut", cat: "fat", kcal: 654, p: 15, c: 14, f: 65, amount: 28, unit: U_G, name: { en: "Georgian Walnuts", ka: "ნიგოზი" } },
  { id: "hazelnut", cat: "fat", kcal: 628, p: 15, c: 17, f: 61, amount: 28, unit: U_G, name: { en: "Hazelnuts", ka: "თხილი" } },
  { id: "sunflowerseeds", cat: "fat", kcal: 584, p: 21, c: 20, f: 51, amount: 28, unit: U_G, name: { en: "Sunflower Seeds", ka: "მზესუმზირის მარცვალი" } },
  // More Georgian dishes
  { id: "mchadi", cat: "georgian", kcal: 130, p: 3, c: 22, f: 3.5, amount: 60, unit: U_G, name: { en: "Mchadi (cornbread)", ka: "მჭადი" } },
  { id: "tkemali", cat: "georgian", kcal: 35, p: 0.5, c: 8, f: 0.2, amount: 30, unit: U_G, name: { en: "Tkemali Sauce", ka: "ტყემალი" } },
  { id: "adjika", cat: "georgian", kcal: 45, p: 1.5, c: 8, f: 1, amount: 20, unit: U_G, name: { en: "Adjika", ka: "აჯიკა" } },
];
const FOOD_CATS = ["protein", "dairy", "carb", "veg", "fruit", "fat", "georgian"];
const CAT_LABEL_KEY = { protein: "protein", dairy: "dairy", carb: "carbs", veg: "vegetables", fruit: "fruits", fat: "fats", georgian: "georgianDishes" };
const MEAL_PCT = { breakfast: 0.25, lunch: 0.35, dinner: 0.30, snack: 0.10 };
// No public product-search API exists for any of these — links open the storefront, not a real basket.
const STORES = [
  { id: "wolt", label: "Wolt", color: "#00C2E8", url: "https://wolt.com" },
  { id: "bolt", label: "Bolt Food", color: "#34D186", url: "https://food.bolt.eu" },
  { id: "glovo", label: "Glovo", color: "#FFC244", url: "https://glovoapp.com" },
];

function fmtAmount(food, mult, lang) {
  const amt = food.amount * mult;
  if (food.unit.en === "g") return Math.round(amt) + L(U_G, lang);
  const rounded = Math.round(amt * 2) / 2;
  return rounded + " " + L(food.unit, lang);
}

/* ---------------------------------- RECIPES ---------------------------------- */
// Turns the plain ingredients a meal was assembled from into an actual cooking method + spices,
// so "chicken + rice + broccoli" reads as a real recipe instead of a bland grocery list.
const RECIPE_PROFILE = {
  chicken: { method: { en: "Pan-seared", ka: "შემწვარი ტაფაზე" }, detail: { en: "seasoned with smoked paprika, garlic powder, and cracked black pepper, seared 5-6 min per side until golden.", ka: "შეაზილე შებოლილი პაპრიკით, ნიორის ფხვნილითა და დაფქული პილპილით, შეწვი 5-6 წუთი თითოეულ მხარეს ოქროსფრამდე." } },
  beef: { method: { en: "Seared", ka: "შემწვარი" }, detail: { en: "rubbed with smoked paprika, rosemary, and cumin, seared hot for a deep crust, rested 5 minutes before slicing.", ka: "დაიფქვე შებოლილი პაპრიკით, როზმარინითა და ჯავზით, შეწვი მაღალ ცეცხლზე ქერქისთვის, დაასვენე 5 წუთი." } },
  salmon: { method: { en: "Gently poached", ka: "ნაზად მოხარშული" }, detail: { en: "in a shallow bath of water, lemon slices, dill, and a bay leaf — 8-10 minutes until just opaque.", ka: "წყლის, ლიმონის ნაჭრების, კამისა და დაფნის ფოთლის ხსნარში — 8-10 წუთი." } },
  eggs: { method: { en: "Softly scrambled", ka: "რბილად ამოხვეული" }, detail: { en: "over low heat with a pinch of smoked paprika and chives, folded slowly for a creamy curd.", ka: "დაბალ ცეცხლზე შებოლილი პაპრიკისა და ხახვის ბოლქვის ნატამალით, ნელა ურიე." } },
  tofu: { method: { en: "Crisped", ka: "ხრაშუნა" }, detail: { en: "pressed and pan-fried with soy sauce, ginger, and a pinch of chili flakes until the edges crackle.", ka: "დაწნეხილი და შემწვარი სოიოს სოუსით, კოჭითა და წიწაკის ფანტელებით." } },
  greekyogurt: { method: { en: "Whipped", ka: "აქერცლილი" }, detail: { en: "with a drizzle of honey, a pinch of cinnamon, and a touch of sea salt.", ka: "თაფლის წვეთით, დარიჩინის ნატამალითა და ზღვის მარილის შეხებით." } },
  cottage: { method: { en: "Simply spooned", ka: "უბრალოდ დაყრილი" }, detail: { en: "topped with cracked black pepper and a squeeze of lemon.", ka: "დაფქული პილპილითა და ლიმონის წვეთით." } },
  cheddar: { method: { en: "Melted", ka: "დადნობილი" }, detail: { en: "over the warm dish for a sharp, savory finish.", ka: "თბილ კერძზე მკვეთრი დასასრულისთვის." } },
  feta: { method: { en: "Crumbled", ka: "დაფშვნილი" }, detail: { en: "on top with a drizzle of olive oil and a pinch of oregano.", ka: "ზემოდან ზეითუნის ზეთითა და ორეგანოს ნატამალით." } },
  mozzarella: { method: { en: "Torn", ka: "დაგლეჯილი" }, detail: { en: "and scattered on top, letting it soften into the warm dish.", ka: "და მიმოფანტული ზემოდან, თბილ კერძში დასარბილებლად." } },
  parmesan: { method: { en: "Shaved", ka: "გახეხილი" }, detail: { en: "over the top just before serving for a salty, nutty finish.", ka: "გახეხილი მიტანამდე მარილიან დასასრულისთვის." } },
  rice: { method: { en: "Steamed", ka: "ორთქლზე მოხარშული" }, detail: { en: "with a bay leaf and a strip of lemon zest for fragrance.", ka: "დაფნის ფოთლითა და ლიმონის ქერქის ზოლით არომატისთვის." } },
  oats: { method: { en: "Simmered", ka: "ადუღებული" }, detail: { en: "with a cinnamon stick and a pinch of salt until creamy.", ka: "დარიჩინის ჯოხითა და მარილის ნატამალით." } },
  potato: { method: { en: "Roasted", ka: "შემწვარი ღუმელში" }, detail: { en: "with rosemary, garlic, and sea salt until crisp outside, fluffy inside.", ka: "როზმარინით, ნიორითა და ზღვის მარილით." } },
  bread: { method: { en: "Lightly toasted", ka: "მსუბუქად შემწვარი" }, detail: { en: "and rubbed with a cut garlic clove for a subtle bite.", ka: "და გახეხილი გაჭრილი ნიორით." } },
  pasta: { method: { en: "Tossed", ka: "არეული" }, detail: { en: "with olive oil, cracked pepper, and a pinch of chili flakes right off the heat.", ka: "ზეითუნის ზეთით, დაფქული პილპილითა და წიწაკის ფანტელებით." } },
  broccoli: { method: { en: "Roasted", ka: "შემწვარი ღუმელში" }, detail: { en: "at high heat with chili flakes and lemon zest until the edges char.", ka: "მაღალ ცეცხლზე წიწაკის ფანტელებითა და ლიმონის ქერქით." } },
  spinach: { method: { en: "Wilted", ka: "დაჭკნარი" }, detail: { en: "in a hot pan with garlic, a grate of nutmeg, and a squeeze of lemon.", ka: "ცხელ ტაფაზე ნიორით, მუსკატის კაკლითა და ლიმონის წვეთით." } },
  mixedveg: { method: { en: "Stir-fried", ka: "სწრაფად შემწვარი" }, detail: { en: "hot and fast with garlic, ginger, and a dash of soy sauce.", ka: "ცხელ ტაფაზე სწრაფად ნიორით, კოჭითა და სოიოს სოუსის წვეთით." } },
  carrot: { method: { en: "Glazed", ka: "დაფარული" }, detail: { en: "in a little butter with cumin and a touch of honey.", ka: "კარაქში ჯავზითა და თაფლის შეხებით." } },
  bellpepper: { method: { en: "Charred", ka: "შემწვარი" }, detail: { en: "over high heat with smoked paprika until blistered.", ka: "მაღალ ცეცხლზე შებოლილი პაპრიკით." } },
  cucumber: { method: { en: "Quick-pickled", ka: "სწრაფად დამარინადებული" }, detail: { en: "in rice vinegar, dill, and a pinch of sugar for a bright side.", ka: "ბრინჯის ძმარში, კამითა და შაქრის ნატამალით." } },
  tomato: { method: { en: "Blistered", ka: "შემწვარი" }, detail: { en: "in a hot pan with basil and a drizzle of olive oil until they burst.", ka: "ცხელ ტაფაზე ბაზილიკითა და ზეითუნის ზეთის წვეთით." } },
  onion: { method: { en: "Caramelized", ka: "კარამელიზებული" }, detail: { en: "low and slow with thyme until deep golden and sweet.", ka: "დაბალ ცეცხლზე ნელა ტიმიანით ღრმა ოქროსფრამდე." } },
  avocado: { method: { en: "Sliced", ka: "დაჭრილი" }, detail: { en: "and fanned on top with a squeeze of lime and flaky salt.", ka: "და დაწყობილი ზემოდან ლაიმის წვეთითა და მსხვილმარცვლოვანი მარილით." } },
  oliveoil: { method: { en: "Finished", ka: "დასრულებული" }, detail: { en: "with a generous drizzle just before serving.", ka: "გულუხვი წვეთით მიტანის წინ." } },
  sunfloweroil: { method: { en: "Used to cook", ka: "გამოყენებული საწვავად" }, detail: { en: "everything in the pan — neutral enough to let the spices lead.", ka: "ტაფაზე ყველაფრის მოსამზადებლად." } },
  almonds: { method: { en: "Toasted", ka: "შემწვარი" }, detail: { en: "and scattered on top for crunch.", ka: "და მიმოფანტული ზემოდან ხრაშუნისთვის." } },
  peanutbutter: { method: { en: "Swirled", ka: "არეული" }, detail: { en: "in with a splash of soy sauce and chili for a nutty, spicy edge.", ka: "სოიოს სოუსისა და წიწაკის შესხურებით." } },
  turkey: { method: { en: "Pan-seared", ka: "შემწვარი ტაფაზე" }, detail: { en: "with sage, garlic, and a pinch of black pepper until golden.", ka: "სალბიით, ნიორითა და პილპილის ნატამალით ოქროსფრამდე." } },
  pork: { method: { en: "Seared", ka: "შემწვარი" }, detail: { en: "with garlic, coriander seed, and a touch of honey glaze.", ka: "ნიორით, ქინძის მარცვლითა და თაფლის მსუბუქი გლაზურით." } },
  lamb: { method: { en: "Grilled", ka: "შემწვარი (Grill)" }, detail: { en: "with rosemary, garlic, and cracked black pepper until charred at the edges.", ka: "როზმარინით, ნიორითა და დაფქული პილპილით." } },
  trout: { method: { en: "Pan-fried", ka: "შემწვარი ტაფაზე" }, detail: { en: "with lemon, dill, and a knob of butter until the skin crisps.", ka: "ლიმონით, კამითა და კარაქით კანის ხრაშუნამდე." } },
  tuna: { method: { en: "Flaked", ka: "დაშლილი" }, detail: { en: "with lemon, olive oil, and cracked pepper straight from the tin.", ka: "ლიმონით, ზეითუნის ზეთითა და დაფქული პილპილით." } },
  shrimp: { method: { en: "Quick-seared", ka: "სწრაფად შემწვარი" }, detail: { en: "with garlic, chili flakes, and a squeeze of lemon, 2 minutes per side.", ka: "ნიორით, წიწაკის ფანტელებითა და ლიმონის წვეთით." } },
  kidneybeans: { method: { en: "Simmered", ka: "ადუღებული" }, detail: { en: "with onion, garlic, and a pinch of khmeli suneli for a Georgian-style lobio flavor.", ka: "ხახვით, ნიორითა და ხმელი სუნელით — ლობიოს არომატით." } },
  lentils: { method: { en: "Simmered", ka: "ადუღებული" }, detail: { en: "with cumin, garlic, and a bay leaf until tender.", ka: "ჯავზით, ნიორითა და დაფნის ფოთლით." } },
  chickpeas: { method: { en: "Tossed", ka: "არეული" }, detail: { en: "with olive oil, cumin, and smoked paprika, warmed through.", ka: "ზეითუნის ზეთით, ჯავზითა და შებოლილი პაპრიკით." } },
  matsoni: { method: { en: "Whisked", ka: "აქერცლილი" }, detail: { en: "smooth with a pinch of salt and fresh dill.", ka: "მარილისა და ახალი კამის ნატამალით." } },
  sulguni: { method: { en: "Sliced", ka: "დაჭრილი" }, detail: { en: "and warmed until soft and slightly melty.", ka: "და გახურებული რბილობამდე." } },
  imeruli: { method: { en: "Crumbled", ka: "დაფშვნილი" }, detail: { en: "over the top for a mild, milky finish.", ka: "ზემოდან რბილი, რძიანი დასასრულისთვის." } },
  buckwheat: { method: { en: "Toasted then simmered", ka: "შემწვარი და ადუღებული" }, detail: { en: "with a bay leaf for a nutty aroma.", ka: "დაფნის ფოთლით კაკლისებრი არომატისთვის." } },
  bulgur: { method: { en: "Simmered", ka: "ადუღებული" }, detail: { en: "with a pinch of cumin and parsley stirred through.", ka: "ჯავზის ნატამალითა და ოხრახუშით." } },
  quinoa: { method: { en: "Simmered", ka: "ადუღებული" }, detail: { en: "then fluffed with lemon zest and parsley.", ka: "და შემდეგ არეული ლიმონის ქერქითა და ოხრახუშით." } },
  eggplant: { method: { en: "Roasted", ka: "შემწვარი ღუმელში" }, detail: { en: "until soft, then dressed with garlic and a little walnut for a badrijani-style flavor.", ka: "რბილობამდე, შემდეგ ნიორითა და ნიგოზით — ბადრიჯნის სტილში." } },
  zucchini: { method: { en: "Sautéed", ka: "შემწვარი" }, detail: { en: "with garlic and a pinch of dried mint.", ka: "ნიორითა და გამხმარი პიტნის ნატამალით." } },
  cauliflower: { method: { en: "Roasted", ka: "შემწვარი ღუმელში" }, detail: { en: "with turmeric and cumin until the edges caramelize.", ka: "მანანათლისა და ჯავზით ბრტყელ ოქროსფრამდე." } },
  cabbage: { method: { en: "Braised", ka: "დაშუშული" }, detail: { en: "with garlic and a splash of vinegar until silky.", ka: "ნიორითა და ძმრის წვეთით." } },
  beetroot: { method: { en: "Roasted", ka: "შემწვარი ღუმელში" }, detail: { en: "until tender, then tossed with walnut and a little garlic.", ka: "რბილობამდე, შემდეგ ნიგოზითა და ნიორით." } },
  garlic: { method: { en: "Minced", ka: "დაქუცმაცებული" }, detail: { en: "and bloomed in warm oil to build the base flavor.", ka: "და გახურებულ ზეთში დამატებული საბაზისო არომატისთვის." } },
  apple: { method: { en: "Sliced", ka: "დაჭრილი" }, detail: { en: "fresh, with a dust of cinnamon if you like.", ka: "ახალი, სურვილისამებრ დარიჩინის ფხვნილით." } },
  pear: { method: { en: "Sliced", ka: "დაჭრილი" }, detail: { en: "fresh, pairs well with the cheese here.", ka: "ახალი, კარგად ეთანხმება ყველს." } },
  banana: { method: { en: "Sliced", ka: "დაჭრილი" }, detail: { en: "fresh over the top just before eating.", ka: "ახალი, ჭამამდე ზემოდან." } },
  orange: { method: { en: "Segmented", ka: "დაჭრილი" }, detail: { en: "fresh, or juiced over the dish for brightness.", ka: "ახალი, ან გამოწურული კერძზე სიცხადისთვის." } },
  grape: { method: { en: "Served", ka: "მიტანილი" }, detail: { en: "fresh and whole alongside.", ka: "ახალი და მთლიანი გვერდით." } },
  watermelon: { method: { en: "Cubed", ka: "დაჭრილი" }, detail: { en: "fresh and chilled.", ka: "ახალი და გაცივებული." } },
  persimmon: { method: { en: "Sliced", ka: "დაჭრილი" }, detail: { en: "fresh, ripe and sweet.", ka: "ახალი, დამწიფებული და ტკბილი." } },
  pomegranate: { method: { en: "Seeded", ka: "დაცლილი" }, detail: { en: "and scattered on top for a tart, juicy pop.", ka: "და მიმოფანტული ზემოდან მჟავე-წვნიანი აქცენტისთვის." } },
  fig: { method: { en: "Halved", ka: "გაჭრილი" }, detail: { en: "fresh, or lightly grilled for a caramelized edge.", ka: "ახალი, ან მსუბუქად შემწვარი კარამელიზებული კიდისთვის." } },
  walnut: { method: { en: "Toasted", ka: "შემწვარი" }, detail: { en: "and crushed over the top, classic Georgian style.", ka: "და დაქუცმაცებული ზემოდან, ქართული სტილით." } },
  hazelnut: { method: { en: "Toasted", ka: "შემწვარი" }, detail: { en: "and roughly chopped for crunch.", ka: "და უხეშად დაჭრილი ხრაშუნისთვის." } },
};
const PROTEIN_IDS = ["chicken", "beef", "salmon", "eggs", "tofu", "greekyogurt", "cottage", "turkey", "pork", "lamb", "trout", "tuna", "shrimp", "kidneybeans", "lentils", "chickpeas"];
const VEG_IDS = ["broccoli", "spinach", "mixedveg", "carrot", "bellpepper", "cucumber", "tomato", "onion", "eggplant", "zucchini", "cauliflower", "cabbage", "beetroot"];
const CARB_IDS = ["rice", "oats", "potato", "bread", "pasta", "buckwheat", "bulgur", "quinoa", "shotipuri"];
function generateRecipe(items, lang) {
  const withProfile = items.filter((i) => RECIPE_PROFILE[i.id]);
  if (!withProfile.length) return null;
  const protein = items.find((i) => PROTEIN_IDS.includes(i.id));
  const veg = items.find((i) => VEG_IDS.includes(i.id));
  const carbItem = items.find((i) => CARB_IDS.includes(i.id));
  const joiner = lang === "ka" ? " და " : " with ";
  const titleParts = [];
  if (protein) titleParts.push(`${L(RECIPE_PROFILE[protein.id].method, lang)} ${L(protein.name, lang)}`);
  if (veg) titleParts.push(L(veg.name, lang));
  if (carbItem) titleParts.push(L(carbItem.name, lang));
  const title = titleParts.length ? titleParts.join(joiner) : withProfile.map((i) => L(i.name, lang)).join(joiner);
  const steps = withProfile.map((i) => {
    const prof = RECIPE_PROFILE[i.id];
    return `${fmtAmount(i, i.mult, lang)} ${L(i.name, lang)} — ${L(prof.method, lang)} ${L(prof.detail, lang)}`;
  });
  return { title, steps };
}

/* ---------------------------------- CARDIO DATA ---------------------------------- */
const MACHINE_LABEL = {
  treadmill: { en: "Treadmill", ka: "ტრედმილი" },
  bike: { en: "Bike", ka: "ველოტრენაჟორი" },
  stairmaster: { en: "Stair Climber", ka: "კიბის ტრენაჟორი" },
  elliptical: { en: "Elliptical", ka: "ელიფსური ტრენაჟორი" },
  rowing: { en: "Rowing Machine", ka: "ნიჩბოსნობის ტრენაჟორი" },
};
const MACHINES = [
  { id: "treadmill", params: ["incline", "speed"] },
  { id: "bike", params: ["level"] },
  { id: "stairmaster", params: ["level"] },
  { id: "elliptical", params: ["level"] },
  { id: "rowing", params: ["level"] },
];
function metFor(machineId, p) {
  if (machineId === "treadmill") return Math.max(2, 2 + (p.speed || 0) * 1.1 + (p.incline || 0) * 0.35);
  const mult = { bike: 0.6, stairmaster: 0.5, elliptical: 0.55, rowing: 0.6 }[machineId] || 0.5;
  return 3 + (p.level || 1) * mult;
}

/* ---------------------------------- HELPERS ---------------------------------- */
function pad(n) { return n < 10 ? "0" + n : "" + n; }
function vibrate(pattern) {
  // Android Chrome supports this; iOS Safari never shipped the Vibration API, so this
  // just silently no-ops there instead of throwing.
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(pattern);
  } catch (e) { /* not supported, ignore */ }
}
function fmtDate(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
function todayStr() { return fmtDate(new Date()); }
function daysAgo(dateStr) { if (!dateStr) return 9999; return Math.floor((new Date(todayStr()) - new Date(dateStr)) / 86400000); }
function pruneOldDates(obj, maxDays) { const out = {}; for (const k in obj) if (daysAgo(k) <= maxDays) out[k] = obj[k]; return out; }
function fmtClock(sec) { const m = Math.floor(sec / 60), s = sec % 60; return pad(m) + ":" + pad(s); }
function currentStreak(history) {
  const set = new Set(history); let cursor = new Date();
  if (!set.has(fmtDate(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(fmtDate(cursor))) { count++; cursor.setDate(cursor.getDate() - 1); }
  return count;
}
function longestStreak(history) {
  const days = [...new Set(history)].sort();
  let best = 0, run = 0, prev = null;
  for (const d of days) {
    run = prev && (new Date(d) - new Date(prev)) / 86400000 === 1 ? run + 1 : 1;
    best = Math.max(best, run); prev = d;
  }
  return best;
}

/* ---------------------------------- FORGE SCORE / LEVEL / CHALLENGES / COACH ---------------------------------- */
// Everything here reads only from data the app actually recorded. If a category has zero
// real entries, it's excluded from the average rather than guessed at.
function countInWindow(dates, days) { return dates.filter((d) => daysAgo(d) < days).length; }

function computeForgeScore(state, profile) {
  const parts = {};
  const expectedPerWeek = profile.daysPerWeek || 4;

  const trainedThisWk = countInWindow(state.history, 7);
  const expectedThisWk = expectedPerWeek;
  parts.consistency = Math.min(100, Math.round((trainedThisWk / Math.max(1, expectedThisWk)) * 100));

  if (state.prLog.length) {
    const recentPRs = countInWindow(state.prLog.map((p) => p.date), 30);
    parts.training = Math.min(100, 55 + recentPRs * 12);
  }

  if (state.cardioLog.length || state.history.length) {
    const recentCardio = countInWindow(state.cardioLog.map((c) => c.date), 14);
    const recentTraining = countInWindow(state.history, 14);
    parts.activityScore = Math.min(100, recentTraining * 8 + recentCardio * 10);
  }

  if (state.nutritionDays.length) {
    parts.nutritionScore = Math.min(100, Math.round((countInWindow(state.nutritionDays, 14) / 14) * 100));
  }

  const recoveryDates = Object.keys(state.recoveryLog);
  if (recoveryDates.length) {
    parts.recoveryScore = Math.min(100, Math.round((countInWindow(recoveryDates, 14) / 14) * 100));
  }

  const vals = Object.values(parts);
  const overall = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;

  // Week-over-week delta: compare last-7-days consistency-only proxy against the prior 7 days (both from real history).
  const last7 = countInWindow(state.history, 7);
  const prior7 = state.history.filter((d) => daysAgo(d) >= 7 && daysAgo(d) < 14).length;
  const delta = last7 - prior7;

  return { overall, parts, delta };
}

function xpForLevel(level) { return level * 200; }
function computeLevel(xp) {
  const level = Math.max(1, Math.floor((xp || 0) / 200) + 1);
  const xpInLevel = (xp || 0) - (level - 1) * 200;
  return { level, xpInLevel, xpForNext: 200, pct: Math.min(100, Math.round((xpInLevel / 200) * 100)) };
}

function computeChallenges(state) {
  const workouts30 = countInWindow(state.history, 30);
  const prs30 = countInWindow(state.prLog.map((p) => p.date), 30);
  const consistency14 = countInWindow(state.history, 14);
  // Hydration streak: how many of the last 7 days met a reasonable goal — we only durably
  // track *today's* hydration total, so this challenge counts today only until more history exists.
  const hydrationToday = state.hydrationDate === todayStr() ? state.hydrationMl : 0;
  const hydrationGoal = Math.round((state.profile.weightKg || 70) * 33);
  return [
    { id: "consistency", titleKey: "challengeConsistency", descKey: "challengeConsistencyDesc", progress: consistency14, target: 10, xp: 60 },
    { id: "thirtyday", titleKey: "challenge30day", descKey: "challenge30dayDesc", progress: workouts30, target: 20, xp: 100 },
    { id: "strength", titleKey: "challengeStrength", descKey: "challengeStrengthDesc", progress: prs30, target: 3, xp: 60 },
    { id: "hydration", titleKey: "challengeHydration", descKey: "challengeHydrationDesc", progress: hydrationToday >= hydrationGoal ? 1 : 0, target: 7, xp: 40 },
  ];
}

// Rule-based recommendation engine — reads actual goal/best weights, PR history, recovery
// logs, and streak. No external AI call; every recommendation traces back to real numbers.
function computeCoachRecommendation(state, profile, todayExercises, t, lang, weightUnit) {
  const today = todayStr();
  const recov = state.recoveryLog[today];
  if (recov && (recov.fatigue >= 4 || recov.stress >= 4)) {
    return { text: t.coachRestSuggestion, why: recov };
  }
  const withGoals = todayExercises.filter((ex) => state.goals[ex.id] && state.best[ex.id]);
  if (withGoals.length) {
    const ex = withGoals[0];
    const goalKg = parseFloat(state.goals[ex.id]);
    const bestKg = parseFloat(state.best[ex.id]);
    const toDisp = (kg) => Math.round((weightUnit === "kg" ? kg : kgToLb(kg)) * 10) / 10;
    if (!isNaN(bestKg) && bestKg >= goalKg) {
      const nextKg = bestKg * 1.025;
      return { text: t.coachIncreaseWeight.replace("{ex}", L(ex.name, lang)).replace("{w}", toDisp(nextKg)).replace("{u}", weightUnit), why: { bestKg, goalKg } };
    }
    if (!isNaN(bestKg)) {
      return { text: t.coachStayWeight.replace("{ex}", L(ex.name, lang)).replace("{w}", toDisp(bestKg)).replace("{u}", weightUnit), why: { bestKg, goalKg } };
    }
  }
  const recent = countInWindow(state.history, 14);
  if (recent >= 3) return { text: t.coachStreakPraise.replace("{n}", recent), why: { recentSessions: recent } };
  return { text: t.coachNoData, why: null };
}
// Builds a compact, factual summary of the user's real ForgeFit data for the chat coach's
// system prompt. Nothing here is invented — every line traces back to a stored field.
function buildCoachContext(state, profile, todayExercises, lang) {
  const today = todayStr();
  const lines = [];
  lines.push(`Sex: ${profile.sex}, age: ${profile.age}, weight: ${Math.round(profile.weightKg)}kg, height: ${Math.round(profile.heightCm)}cm.`);
  lines.push(`Goal: ${profile.goal}. Split: ${profile.split}, ${profile.daysPerWeek} days/week. Activity level: ${profile.activity}.`);
  lines.push(`Current streak: ${currentStreak(state.history)} days. Longest streak: ${longestStreak(state.history)} days.`);
  lines.push(`Workouts logged in last 30 days: ${countInWindow(state.history, 30)}.`);
  const recentPRs = state.prLog.filter((p) => daysAgo(p.date) <= 30);
  if (recentPRs.length) {
    lines.push(`Recent PRs (last 30 days): ${recentPRs.map((p) => { const ex = EXDB.find((e) => e.id === p.exId); return `${ex ? L(ex.name, "en") : p.exId} ${p.weight}kg`; }).join(", ")}.`);
  }
  const goalEntries = Object.keys(state.goals).filter((k) => state.goals[k] && state.best[k]);
  if (goalEntries.length) {
    lines.push("Tracked lifts (best/goal, kg): " + goalEntries.slice(0, 8).map((id) => {
      const ex = EXDB.find((e) => e.id === id);
      return `${ex ? L(ex.name, "en") : id} ${state.best[id]}/${state.goals[id]}`;
    }).join(", ") + ".");
  }
  const recov = state.recoveryLog[today];
  if (recov) lines.push(`Today's self-reported recovery: sleep ${recov.sleep}h, sleep quality ${recov.sleepQuality}/5, fatigue ${recov.fatigue}/5, stress ${recov.stress}/5.`);
  else lines.push("No recovery data logged today.");
  const score = computeForgeScore(state, profile);
  if (score.overall != null) lines.push(`Forge Score: ${score.overall}/100.`);
  if (todayExercises && todayExercises.length) lines.push(`Today's planned exercises: ${todayExercises.map((e) => L(e.name, "en")).join(", ")}.`);
  const equip = profile.equipment ? profile.equipment.join(", ") : "full gym (unrestricted)";
  lines.push(`Available equipment: ${equip}.`);
  return lines.join("\n");
}

async function askForgeCoach(userMessages, context, lang) {
  const system = `You are Forge Coach, the adaptive fitness and nutrition coach built into the ForgeFit app. You have access to this user's real, actual logged data below — use it to give specific, grounded answers rather than generic advice. Be concise (2-5 short sentences unless they ask for a detailed plan), practical, and encouraging but honest — don't sugarcoat lack of progress, and don't invent data you weren't given. You are not a doctor; for injuries, pain, or medical symptoms, tell them to see a professional rather than diagnosing, but you CAN still suggest adjusting today's workout around it (e.g. training a different muscle group or resting) — that's not medical advice, it's scheduling. Stay focused on fitness, training, recovery, and nutrition topics. Respond in ${lang === "ka" ? "Georgian" : "English"}.

If — and only if — you are recommending the user change what they train TODAY (because of pain, injury, fatigue, soreness, or a scheduling conflict they mention), end your reply with one machine-readable tag per option you're offering, each alone on its own line, in exactly this format: [[SUGGEST:KEY]] where KEY is one of: chest, back, shoulders, arms, legs, rest. For example, if shoulder pain means today's push session should move to legs or become a rest day, end with:
[[SUGGEST:legs]]
[[SUGGEST:rest]]
Put nothing else on those lines. Never include these tags for general advice, only when you are actively proposing to change today's plan. Never invent a KEY outside that list.

USER'S ACTUAL DATA:
${context}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);
  let response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 500, system, messages: userMessages }),
      signal: controller.signal,
    });
  } catch (e) {
    if (e.name === "AbortError") throw new Error("TIMEOUT");
    console.error("Forge Coach network error:", e);
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
  if (!response.ok) {
    let detail = "";
    let parsed = null;
    try { parsed = await response.json(); detail = JSON.stringify(parsed); } catch (e) { /* ignore */ }
    console.error("Forge Coach request failed:", response.status, detail);
    if (response.status === 429) {
      let resetsAt = null;
      try { resetsAt = parsed?.error?.message && JSON.parse(parsed.error.message)?.resolved?.limit?.resets_at; } catch (e) { /* ignore */ }
      const err = new Error("RATE_LIMIT");
      err.resetsAt = resetsAt;
      throw err;
    }
    throw new Error("Coach request failed: " + response.status + " " + detail);
  }
  const data = await response.json();
  return (data.content || []).map((b) => b.text || "").join("\n").trim();
}
const kgToLb = (kg) => kg * 2.20462;
const lbToKg = (lb) => lb / 2.20462;
const cmToFtIn = (cm) => { const ti = cm / 2.54; const ft = Math.floor(ti / 12); const inch = Math.round(ti % 12); return { ft, inch }; };
const ftInToCm = (ft, inch) => (Number(ft || 0) * 12 + Number(inch || 0)) * 2.54;

function calcTargets(profile, correctionKcal) {
  const { sex, age, heightCm, weightKg, activity, goal } = profile;
  const bmr = sex === "male" ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5 : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 }[activity] || 1.375;
  let kcal = bmr * mult;
  if (goal === "lose") kcal -= 500; else if (goal === "gain") kcal += 300;
  kcal = Math.round(kcal);
  const proteinPerKg = goal === "lose" ? 2.2 : goal === "gain" ? 2.0 : 1.8;
  const protein = Math.round(weightKg * proteinPerKg);
  const safeFloor = Math.max(1200, Math.round(kcal * 0.85));
  const adjustedKcal = correctionKcal ? Math.max(safeFloor, kcal - correctionKcal) : kcal;
  const fat = Math.round((adjustedKcal * 0.25) / 9);
  const carbs = Math.max(0, Math.round((adjustedKcal - protein * 4 - fat * 9) / 4));
  return { kcal: adjustedKcal, baseKcal: kcal, protein, fat, carbs, corrected: !!correctionKcal && adjustedKcal < kcal };
}
function activeDietCorrectionKcal(state) {
  const c = state.dietCorrection;
  if (!c) return 0;
  const today = todayStr();
  if (today >= c.startDate && today < c.endDate) return c.perDayReduction;
  return 0;
}

const DEFAULT_PROFILE = {
  onboarded: false, name: "", sex: "male", age: 25,
  heightCm: 178, weightKg: 78, weightUnit: "kg", heightUnit: "cm",
  activity: "moderate", goal: "maintain",
  split: "ppl", daysPerWeek: 4, emphasis: "",
  lang: "en", equipment: null, theme: "dark",
};
const DEFAULT_STATE = { profile: DEFAULT_PROFILE, history: [], checklist: {}, goals: {}, best: {}, haveFoods: {}, mealPlan: null, mealPlanDate: "", hydrationMl: 0, hydrationDate: "", foodLog: {}, dislikedIds: [], xp: 0, recoveryLog: {}, prLog: [], nutritionDays: [], cardioLog: [], calorieHistory: {}, dietCorrection: null, scheduleOverrides: {} };

/* ---------------------------------- NUMBER INPUT (FIXED) ---------------------------------- */
function NumEditor({ value, onChange, style, placeholder, width }) {
  const [text, setText] = useState(value === undefined || value === null ? "" : String(value));
  const focusedRef = useRef(false);
  useEffect(() => { if (!focusedRef.current) setText(value === undefined || value === null ? "" : String(value)); }, [value]);
  return (
    <input
      type="number" inputMode="decimal" placeholder={placeholder}
      value={text}
      onFocus={() => { focusedRef.current = true; }}
      onChange={(e) => { setText(e.target.value); const n = parseFloat(e.target.value); if (!isNaN(n)) onChange(n); }}
      onBlur={() => { focusedRef.current = false; const n = parseFloat(text); setText(isNaN(n) ? String(value) : String(n)); }}
      style={{ ...style, width: width || style.width }}
    />
  );
}

/* ---------------------------------- MOTION DEMO ---------------------------------- */
const PATTERN_META = {
  press: { axis: "vert", a: { en: "Start", ka: "დაწყება" }, b: { en: "Lockout", ka: "სრული გაშლა" } },
  flye: { axis: "arc", a: { en: "Arms wide", ka: "ხელები გვერდებზე" }, b: { en: "Arms meet", ka: "ხელები ერთმანეთს ხვდება" } },
  dip: { axis: "vert", a: { en: "Elbows bent", ka: "იდაყვები მოხრილი" }, b: { en: "Arms locked", ka: "ხელები გამართული" } },
  pushup: { axis: "vert", a: { en: "Chest low", ka: "მკერდი დაბლა" }, b: { en: "Arms extended", ka: "ხელები გაშლილი" } },
  extension: { axis: "vert", a: { en: "Elbow bent", ka: "იდაყვი მოხრილი" }, b: { en: "Arm straight", ka: "ხელი სწორი" } },
  row: { axis: "horz", a: { en: "Arms extended", ka: "ხელები გაშლილი" }, b: { en: "Elbow past torso", ka: "იდაყვი ტორსს მიღმა" } },
  pulldown: { axis: "vert", a: { en: "Arms overhead", ka: "ხელები თავს ზემოთ" }, b: { en: "Bar to chest", ka: "შტანგა მკერდთან" } },
  curl: { axis: "vert", a: { en: "Arm straight", ka: "ხელი სწორი" }, b: { en: "Full curl", ka: "სრული მოხრა" } },
  squat: { axis: "vert", a: { en: "Hips down", ka: "თეძოები დაბლა" }, b: { en: "Standing tall", ka: "სრულად გამართული" } },
  legext: { axis: "vert", a: { en: "Knees bent", ka: "მუხლები მოხრილი" }, b: { en: "Legs extended", ka: "ფეხები გაშლილი" } },
  hinge: { axis: "vert", a: { en: "Hips back", ka: "თეძოები უკან" }, b: { en: "Standing tall", ka: "სრულად გამართული" } },
  legcurl: { axis: "vert", a: { en: "Legs straight", ka: "ფეხები სწორი" }, b: { en: "Heels to glutes", ka: "ქუსლები დუნდულებთან" } },
  raise: { axis: "arc", a: { en: "Arms down", ka: "ხელები დაბლა" }, b: { en: "Shoulder height", ka: "მხრის სიმაღლეზე" } },
  facepull: { axis: "horz", a: { en: "Arms extended", ka: "ხელები გაშლილი" }, b: { en: "Rope to face", ka: "თოკი სახესთან" } },
  calf: { axis: "vert", a: { en: "Heels down", ka: "ქუსლები დაბლა" }, b: { en: "Full raise", ka: "სრული აწევა" } },
  thrust: { axis: "vert", a: { en: "Hips down", ka: "თეძოები დაბლა" }, b: { en: "Full hip extension", ka: "თეძოს სრული გაშლა" } },
  kickback: { axis: "horz", a: { en: "Leg forward", ka: "ფეხი წინ" }, b: { en: "Leg extended back", ka: "ფეხი გაშლილი უკან" } },
  lateral: { axis: "horz", a: { en: "Feet together", ka: "ფეხები ერთად" }, b: { en: "Step wide", ka: "ფართო ნაბიჯი" } },
};
function MoveDemo({ pattern, lang }) {
  const meta = PATTERN_META[pattern] || PATTERN_META.press;
  const trackStyle = meta.axis === "horz" ? { width: 70, height: 4 } : { width: 4, height: 60 };
  const dotAnim = meta.axis === "horz" ? "ffMoveHorz" : meta.axis === "arc" ? "ffMoveArc" : "ffMoveVert";
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(76,141,255,0.07)", border: `1.5px solid ${C.border}` }}>
      <div className="relative flex items-center justify-center shrink-0" style={{ width: 56, height: 70 }}>
        <div style={{ ...trackStyle, background: "rgba(143,184,255,0.25)", borderRadius: 4, position: "relative" }}>
          <div style={{
            width: 12, height: 12, borderRadius: "50%", background: C.blueBright,
            position: "absolute", left: meta.axis === "horz" ? 0 : -4, top: meta.axis === "horz" ? -4 : 0,
            animation: `${dotAnim} 1.6s ease-in-out infinite`, boxShadow: `0 0 8px ${C.blue}`,
          }} />
        </div>
      </div>
      <div className="text-[11px] leading-snug" style={{ color: C.steel }}>
        <div style={{ color: C.blueBright, fontWeight: 600 }}>{L(meta.a, lang)} <ArrowRight size={10} style={{ display: "inline", verticalAlign: "middle" }} /> {L(meta.b, lang)}</div>
      </div>
    </div>
  );
}

/* ---------------------------------- PIXEL PHYSIQUE AVATAR ---------------------------------- */
function tierFromStreak(streak) { return Math.max(0, Math.min(6, Math.floor(streak / 3))); }
function EmptyStateArt() {
  // Original flat-vector illustration (not sourced from any external library) using the
  // app's own blue + success palette — a simple target-and-flag motif for "no goal yet" states.
  return (
    <svg width="120" height="90" viewBox="0 0 120 90" style={{ margin: "0 auto" }}>
      <ellipse cx="60" cy="78" rx="38" ry="6" fill={C.border} />
      <circle cx="46" cy="42" r="26" fill="none" stroke={C.border} strokeWidth="6" />
      <circle cx="46" cy="42" r="17" fill="none" stroke={C.blueDim} strokeWidth="6" />
      <circle cx="46" cy="42" r="8" fill={C.blue} opacity="0.85" />
      <line x1="86" y1="20" x2="86" y2="66" stroke={C.border} strokeWidth="4" strokeLinecap="round" />
      <path d="M86 20 L110 27 L86 34 Z" fill={C.success} opacity="0.9" />
    </svg>
  );
}
function PixelAvatar({ sex, tier, size = 140 }) {
  const skin = "#F2B280", skinShadow = "#D9955C", hair = "#2B1B12", top = "#4C8DFF", bottom = sex === "female" ? "#EF476F" : "#2B3A55", gold = "#FBBF24";
  // Base measurements (viewBox 100 x 130), scaled by tier per sex.
  const shoulderW = sex === "male" ? 46 + tier * 3.2 : 40 + tier * 0.6;
  const armW = sex === "male" ? 9 + tier * 1.4 : 8 + tier * 0.4;
  const waistW = sex === "female" ? Math.max(24, 34 - tier * 1.6) : 32 + tier * 0.8;
  const hipW = sex === "female" ? 40 + tier * 3.4 : 34 + tier * 1.2;
  const thighW = sex === "female" ? 15 + tier * 1.5 : 13 + tier * 0.8;
  const trapH = sex === "male" ? 6 + tier * 1.1 : 5;
  const cx = 50;
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 100 130">
      {/* legend colors kept close to app palette; gold accent only at max tier as a small flourish */}
      <ellipse cx={cx} cy="126" rx="26" ry="3" fill="rgba(0,0,0,0.25)" />
      {/* legs */}
      <rect x={cx - thighW - 3} y="92" width={thighW} height="30" rx="4" fill={skin} />
      <rect x={cx + 3} y="92" width={thighW} height="30" rx="4" fill={skin} />
      <rect x={cx - thighW - 3} y="118" width={thighW} height="8" rx="2" fill={hair} />
      <rect x={cx + 3} y="118" width={thighW} height="8" rx="2" fill={hair} />
      {/* hips/shorts */}
      <rect x={cx - hipW / 2} y="76" width={hipW} height="22" rx="8" fill={bottom} />
      {/* waist */}
      <rect x={cx - waistW / 2} y="60" width={waistW} height="20" rx="6" fill={skinShadow} />
      {/* traps */}
      {sex === "male" && <rect x={cx - shoulderW / 2 - 2} y={40 - trapH} width={shoulderW + 4} height={trapH + 6} rx="6" fill={skin} />}
      {/* shoulders/torso */}
      <rect x={cx - shoulderW / 2} y="42" width={shoulderW} height="22" rx="8" fill={top} />
      {/* arms */}
      <rect x={cx - shoulderW / 2 - armW + 2} y="44" width={armW} height="34" rx={armW / 2} fill={skin} />
      <rect x={cx + shoulderW / 2 - 2} y="44" width={armW} height="34" rx={armW / 2} fill={skin} />
      {/* neck + head */}
      <rect x={cx - 6} y="30" width="12" height="12" fill={skin} />
      <circle cx={cx} cy="20" r="14" fill={skin} />
      <path d={`M ${cx - 14} 18 A 14 14 0 0 1 ${cx + 14} 18 L ${cx + 14} 10 L ${cx - 14} 10 Z`} fill={hair} />
      {tier >= 6 && <path d={`M ${cx - 3} 2 l 3 8 l 3 -8 l -1.5 6 l 3 -3 l -4 6 l -4 -6 l 3 3 Z`} fill={gold} />}
    </svg>
  );
}

/* ---------------------------------- PREMIUM PROGRESSION ---------------------------------- */
const PHYSIQUE_RANKS = [
  { min:0, key:"Ember" }, { min:300, key:"Iron" }, { min:700, key:"Steel" }, { min:1200, key:"Titan" }, { min:2000, key:"Mythic" }, { min:3200, key:"Legend" }
];
function physiqueProgress(state, streak) {
  const xp = state.xp || 0;
  let idx = 0; PHYSIQUE_RANKS.forEach((r,i)=>{ if(xp >= r.min) idx=i; });
  const current=PHYSIQUE_RANKS[idx], next=PHYSIQUE_RANKS[idx+1];
  const pct = next ? Math.min(100, Math.round(((xp-current.min)/(next.min-current.min))*100)) : 100;
  const badges = [
    { icon:"🔥", en:"7-Day Flame", ka:"7-დღიანი ცეცხლი", on:streak>=7 },
    { icon:"⚒️", en:"First Forge", ka:"პირველი Forge", on:(state.history||[]).length>=1 },
    { icon:"🏆", en:"10 Sessions", ka:"10 ვარჯიში", on:(state.history||[]).length>=10 },
    { icon:"⚡", en:"PR Hunter", ka:"PR მონადირე", on:(state.prLog||[]).length>=3 },
    { icon:"💧", en:"Hydrated", ka:"ჰიდრატაცია", on:(state.hydrationMl||0)>=2000 },
    { icon:"🥗", en:"Fuelled", ka:"კვების რეჟიმი", on:(state.nutritionDays||[]).length>=7 },
  ];
  return { current, next, pct, badges, idx };
}
function musclesForExercises(list){ return [...new Set(list.filter(e=>!e.warmup).map(e=>e.muscle))]; }

function ProgramOverview({ t, lang, profile, focus, exercises, weekFocus, onStart }) {
  const muscles=musclesForExercises(exercises);
  return <div className="rise">
    <div className="liquidHero p-5 mb-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] mb-2" style={{color:C.blueBright}}><Sparkles size={13}/>{t.programOverview}</div>
      <div className="disp text-3xl font-bold mb-2" style={{color:C.text}}>{L(FOCUS_LABEL[focus],lang)}</div>
      <div className="text-sm leading-relaxed" style={{color:C.steel}}>{t.programPurpose}</div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <GlassStat label={t.trainingDays} value={`${profile.daysPerWeek}×`} />
        <GlassStat label={t.includedExercises} value={exercises.length} />
      </div>
    </div>
    <OverviewBlock icon={<Target size={15}/>} title={t.programTargets}><div className="flex flex-wrap gap-2">{muscles.map(m=><span key={m} className="glassPill">{L(MUSCLE_LABEL[m],lang)}</span>)}</div></OverviewBlock>
    <OverviewBlock icon={<BarChart3 size={15}/>} title={t.weeklyStructure}><div className="flex gap-1.5 overflow-x-auto">{weekFocus.map((f,i)=><div key={i} className="glassPill shrink-0">{DOW[lang][i]} · {L(FOCUS_LABEL[f],lang)}</div>)}</div></OverviewBlock>
    <OverviewBlock icon={<Dumbbell size={15}/>} title={t.includedExercises}>{exercises.map(e=><div key={e.id} className="flex justify-between text-xs py-1.5" style={{borderBottom:`1px solid ${C.border}`}}><span style={{color:C.text}}>{L(e.name,lang)}</span><span style={{color:C.steel}}>{e.sets}×{e.reps}</span></div>)}</OverviewBlock>
    <div className="grid gap-3 mb-5"><OverviewBlock icon={<TrendingUp size={15}/>} title={t.expectedProgression}>{t.progressionText}</OverviewBlock><OverviewBlock icon={<RefreshCw size={15}/>} title={t.recoveryStructure}>{t.recoveryText}</OverviewBlock><OverviewBlock icon={<ShieldCheck size={15}/>} title={t.suitableFor}>{t.suitableText}</OverviewBlock><OverviewBlock icon={<Sparkles size={15}/>} title={t.whatToExpect}>{t.expectText}</OverviewBlock></div>
    <button onClick={onStart} className="liquidPrimary w-full py-4 rounded-2xl disp font-semibold flex items-center justify-center gap-2">{t.enterProgram}<ArrowRight size={17}/></button>
  </div>;
}
function GlassStat({label,value}){return <div className="glassInset p-3"><div className="disp text-2xl font-bold" style={{color:C.text}}>{value}</div><div className="text-[10px] uppercase tracking-wider" style={{color:C.steel}}>{label}</div></div>}
function OverviewBlock({icon,title,children}){return <div className="liquidCard p-4 mb-3"><div className="flex items-center gap-2 mb-2 text-sm font-semibold" style={{color:C.blueBright}}>{icon}{title}</div><div className="text-xs leading-relaxed" style={{color:C.steel}}>{children}</div></div>}


const EXERCISE_MEDIA_MALE = {
  raise: { file: "male-shoulder.jpg", source: "Pexels 7289370", credit: "Alesia Kozik / Pexels", license: "Pexels License" },
  press: { file: "male-shoulder.jpg", source: "Pexels 7289370", credit: "Alesia Kozik / Pexels", license: "Pexels License" },
  flye: { file: "male-cable.jpg", source: "Pexels 32695897", credit: "Asso Myron / Pexels", license: "Pexels License" },
  dip: { file: "male-dip.jpg", source: "Dubai workout (Unsplash).jpg", credit: "Keit Trysh / Wikimedia Commons", license: "CC0/Unsplash archive" },
  pushup: { file: "male-pushup.jpg", source: "Airman doing pushup.JPG", credit: "U.S. Air Force", license: "Public domain" },
  extension: { file: "male-triceps.jpg", source: "Pexels 5327510", credit: "Tima Miroshnichenko / Pexels", license: "Pexels License" },
  pulldown: { file: "male-pulldown.jpg", source: "Common Lat Pulldown Mistakes.webm reference", credit: "Andrew Kwong / Wikimedia Commons", license: "CC" },
  row: { file: "male-row.jpg", source: "Pexels 10551491", credit: "Alexa Popovich / Pexels", license: "Pexels License" },
  curl: { file: "male-curl.jpg", source: "Pexels 4162480", credit: "Ivan S / Pexels", license: "Pexels License" },
  legext: { file: "male-legpress.jpg", source: "Pexels 19254709", credit: "Jean-Daniel Francoeur / Pexels", license: "Pexels License" },
  squat: { file: "male-squat.jpg", source: "Pexels 5327530", credit: "Tima Miroshnichenko / Pexels", license: "Pexels License" },
  legcurl: { file: "male-legpress.jpg", source: "Pexels 19254709", credit: "Jean-Daniel Francoeur / Pexels", license: "Pexels License" },
  hinge: { file: "male-squat.jpg", source: "Pexels 5327530", credit: "Tima Miroshnichenko / Pexels", license: "Pexels License" },
  thrust: { file: "male-legpress.jpg", source: "Pexels 19254709", credit: "Jean-Daniel Francoeur / Pexels", license: "Pexels License" },
  kickback: { file: "male-squat.jpg", source: "Pexels 5327530", credit: "Tima Miroshnichenko / Pexels", license: "Pexels License" },
  lateral: { file: "male-shoulder.jpg", source: "Pexels 7289370", credit: "Alesia Kozik / Pexels", license: "Pexels License" },
  facepull: { file: "male-row.jpg", source: "Pexels 10551491", credit: "Alexa Popovich / Pexels", license: "Pexels License" },
  calf: { file: "male-legpress.jpg", source: "Pexels 19254709", credit: "Jean-Daniel Francoeur / Pexels", license: "Pexels License" },
};

const EXERCISE_MEDIA_FEMALE = {
  raise: { file: "female-shoulder.jpg", source: "Strong woman performs shoulder press exercise in fitness gym during afternoon workout session.jpg", credit: "Shixart1985 / Wikimedia Commons", license: "CC" },
  press: { file: "female-shoulder.jpg", source: "Strong woman performs shoulder press exercise in fitness gym during afternoon workout session.jpg", credit: "Shixart1985 / Wikimedia Commons", license: "CC" },
  flye: { file: "female-row.jpg", source: "Woman using a seated cable row machine at the gym.jpg", credit: "Miguel Angel Omaña Rojas / Wikimedia Commons", license: "Wikimedia Commons" },
  dip: { file: "female-gym.jpg", source: "Woman exercising in the gym.jpg", credit: "Nenad Stojkovic / Wikimedia Commons", license: "CC BY 2.0" },
  pushup: { file: "female-gym.jpg", source: "Woman exercising in the gym.jpg", credit: "Nenad Stojkovic / Wikimedia Commons", license: "CC BY 2.0" },
  extension: { file: "female-row.jpg", source: "Woman using a seated cable row machine at the gym.jpg", credit: "Miguel Angel Omaña Rojas / Wikimedia Commons", license: "Wikimedia Commons" },
  pulldown: { file: "female-row.jpg", source: "Woman using a seated cable row machine at the gym.jpg", credit: "Miguel Angel Omaña Rojas / Wikimedia Commons", license: "Wikimedia Commons" },
  row: { file: "female-row.jpg", source: "Woman using a seated cable row machine at the gym.jpg", credit: "Miguel Angel Omaña Rojas / Wikimedia Commons", license: "Wikimedia Commons" },
  curl: { file: "female-gym.jpg", source: "Woman exercising in the gym.jpg", credit: "Nenad Stojkovic / Wikimedia Commons", license: "CC BY 2.0" },
  legext: { file: "female-leg.jpg", source: "Woman playing weights with legs on the exercise machine in the gym.jpg", credit: "Nenad Stojkovic / Wikimedia Commons", license: "CC BY 2.0" },
  squat: { file: "female-squat.jpg", source: "Woman doing squat workout in gym with barbell.jpg", credit: "Nenad Stojkovic / Wikimedia Commons", license: "CC BY 2.0" },
  legcurl: { file: "female-leg.jpg", source: "Woman playing weights with legs on the exercise machine in the gym.jpg", credit: "Nenad Stojkovic / Wikimedia Commons", license: "CC BY 2.0" },
  hinge: { file: "female-squat.jpg", source: "Woman doing squat workout in gym with barbell.jpg", credit: "Nenad Stojkovic / Wikimedia Commons", license: "CC BY 2.0" },
  thrust: { file: "female-leg.jpg", source: "Woman playing weights with legs on the exercise machine in the gym.jpg", credit: "Nenad Stojkovic / Wikimedia Commons", license: "CC BY 2.0" },
  kickback: { file: "female-leg.jpg", source: "Woman playing weights with legs on the exercise machine in the gym.jpg", credit: "Nenad Stojkovic / Wikimedia Commons", license: "CC BY 2.0" },
  lateral: { file: "female-shoulder.jpg", source: "Strong woman performs shoulder press exercise in fitness gym during afternoon workout session.jpg", credit: "Shixart1985 / Wikimedia Commons", license: "CC" },
  facepull: { file: "female-row.jpg", source: "Woman using a seated cable row machine at the gym.jpg", credit: "Miguel Angel Omaña Rojas / Wikimedia Commons", license: "Wikimedia Commons" },
  calf: { file: "female-leg.jpg", source: "Woman playing weights with legs on the exercise machine in the gym.jpg", credit: "Nenad Stojkovic / Wikimedia Commons", license: "CC BY 2.0" },
};

const EXERCISE_MEDIA_ID_MALE = {
  "chest-1": { file: "male-bench.jpg", source: "Pexels 14598861", credit: "Viridiana Rivera / Pexels", license: "Pexels License" },
  "chest-2": { file: "male-cable.jpg", source: "Pexels 32695897", credit: "Asso Myron / Pexels", license: "Pexels License" },
  "quad-2": { file: "male-legpress.jpg", source: "Pexels 19254709", credit: "Jean-Daniel Francoeur / Pexels", license: "Pexels License" },
  "quad-6": { file: "male-squat.jpg", source: "Pexels 5327530", credit: "Tima Miroshnichenko / Pexels", license: "Pexels License" },
  "bi-1": { file: "male-curl.jpg", source: "Pexels 4162480", credit: "Ivan S / Pexels", license: "Pexels License" },
};
const EXERCISE_MEDIA_ID_FEMALE = {};

function localExerciseMediaUrl(file) {
  return `./exercise-media/${file}`;
}
function commonsPageUrl(file) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;
}

function ForgeExerciseVisual({ ex, lang, sex }) {
  const female = sex === "female";
  const idMap = female ? EXERCISE_MEDIA_ID_FEMALE : EXERCISE_MEDIA_ID_MALE;
  const patternMap = female ? EXERCISE_MEDIA_FEMALE : EXERCISE_MEDIA_MALE;
  const media = idMap[ex.id] || patternMap[ex.pattern] || patternMap.press;
  const [mediaFailed, setMediaFailed] = useState(false);
  useEffect(() => setMediaFailed(false), [media.file]);
  const realLabel = lang === "ka" ? "რეალური საცნობარო მასალა" : "Real exercise reference";
  const sourceLabel = lang === "ka" ? "წყარო" : "Source";

  return (
    <div className="exerciseVisual mt-3 mb-1 overflow-hidden" style={{ borderRadius: 20, border: `1px solid ${C.border}`, background: "rgba(4,8,18,.78)" }}>
      <div className="relative overflow-hidden" style={{ minHeight: 176, background: "linear-gradient(135deg,rgba(76,141,255,.16),rgba(5,7,13,.92))" }}>
        {!mediaFailed && media.kind === "video" && (
          <video
            key={media.file}
            src={localExerciseMediaUrl(media.file)}
            autoPlay loop muted playsInline preload="metadata"
            onError={() => setMediaFailed(true)}
            style={{ width: "100%", height: 190, objectFit: "cover", display: "block" }}
          />
        )}
        {!mediaFailed && media.kind !== "video" && (
          <img
            key={media.file}
            src={localExerciseMediaUrl(media.file)}
            alt={L(ex.name, lang)}
            loading="lazy"
            onError={() => setMediaFailed(true)}
            style={{ width: "100%", height: 190, objectFit: "cover", display: "block", filter: "saturate(.88) contrast(1.03)" }}
          />
        )}
        {mediaFailed && (
          <div className="flex flex-col items-center justify-center gap-2" style={{ height: 176 }}>
            <Dumbbell size={28} color={C.blueBright} />
            <div className="text-xs" style={{ color: C.steel }}>{lang === "ka" ? "ფოტო ვერ ჩაიტვირთა — მოძრაობის გიდი ხელმისაწვდომია." : "Photo unavailable — movement guide is still available."}</div>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg,transparent 38%,rgba(3,5,10,.88) 100%)" }} />
        <div className="absolute left-3 bottom-3 px-2.5 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[.13em]" style={{ color: "#DDEBFF", background: "rgba(5,10,20,.66)", border: "1px solid rgba(143,184,255,.28)", backdropFilter: "blur(10px)" }}>
          <Camera size={11} style={{ display: "inline", marginRight: 5, verticalAlign: "-2px" }} />{realLabel}
        </div>
      </div>
      <div className="p-3">
        <MoveDemo pattern={ex.pattern} lang={lang} />
        <a
          href={commonsPageUrl(media.source)}
          className="block mt-2 text-[9px] leading-relaxed"
          style={{ color: C.steel, opacity: .82, textDecoration: "none" }}
        >
          {sourceLabel}: Wikimedia Commons · {media.credit} · {media.license}
        </a>
      </div>
    </div>
  );
}

function FoodScanner({t,lang,addFoodLogEntry}){
 const [mode,setMode]=useState("barcode"),[barcode,setBarcode]=useState(""),[result,setResult]=useState(null),[busy,setBusy]=useState(false),[msg,setMsg]=useState("");
 const [foodId,setFoodId]=useState(FOODS[0].id),[amount,setAmount]=useState(FOODS[0].amount),[photo,setPhoto]=useState(null);
 const food=FOODS.find(f=>f.id===foodId)||FOODS[0]; const mult=amount/(food.amount||1);
 async function lookup(code=barcode){ if(!code)return; setBusy(true);setMsg("");try{const r=await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json`);const d=await r.json();if(!d.product){setResult(null);setMsg(t.productNotFound);return;}const n=d.product.nutriments||{};setResult({name:d.product.product_name||code,amount:100,kcal:n["energy-kcal_100g"]||0,p:n.proteins_100g||0,c:n.carbohydrates_100g||0,f:n.fat_100g||0});}catch(e){setMsg(t.productNotFound)}finally{setBusy(false)}}
 async function photoChosen(e){const file=e.target.files&&e.target.files[0];if(!file)return;setPhoto(URL.createObjectURL(file));setMsg(t.recognitionUnavailable); if("BarcodeDetector" in window){try{const bmp=await createImageBitmap(file);const det=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e"]});const codes=await det.detect(bmp);if(codes[0]){setBarcode(codes[0].rawValue);setMode("barcode");lookup(codes[0].rawValue)}}catch(_){}}}
 function addEstimated(){addFoodLogEntry({id:Date.now()+Math.random(),foodId:food.id,amount,kcal:food.kcal*mult,p:food.p*mult,c:food.c*mult,f:food.f*mult});}
 function addProduct(){if(!result)return;addFoodLogEntry({id:Date.now()+Math.random(),foodId:result.name,amount:result.amount,kcal:result.kcal,p:result.p,c:result.c,f:result.f});}
 return <div><div className="liquidCard p-4 mb-3"><div className="disp text-xl font-semibold mb-1" style={{color:C.text}}>{t.foodScanner}</div><div className="text-xs mb-4" style={{color:C.steel}}>{t.scannerHint}</div><SegButton options={[{v:"barcode",l:t.scanBarcode},{v:"photo",l:t.photoFood}]} value={mode} onChange={setMode}/></div>
 {mode==="barcode"?<div className="liquidCard p-4"><div className="flex gap-2"><input value={barcode} onChange={e=>setBarcode(e.target.value)} inputMode="numeric" placeholder={t.barcodePlaceholder} style={{...inputStyle,flex:1,background:C.glass,border:`1px solid ${C.border}`,color:C.text}}/><button onClick={()=>lookup()} className="liquidPrimary px-4 rounded-xl"><ScanLine size={18}/></button></div>{busy&&<div className="text-xs mt-3" style={{color:C.steel}}>…</div>}{msg&&<div className="text-xs mt-3" style={{color:C.steel}}>{msg}</div>}{result&&<ScanNutrition result={result} t={t} onAdd={addProduct}/>}<label className="mt-3 w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm cursor-pointer" style={{border:`1px solid ${C.border}`,color:C.blueBright}}><Camera size={16}/>{t.scanBarcode}<input type="file" accept="image/*" capture="environment" className="hidden" onChange={photoChosen}/></label></div>:
 <div className="liquidCard p-4"><label className="w-full h-40 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden" style={{border:`1px dashed ${C.borderStrong}`,background:C.blueDim}}>{photo?<img src={photo} className="w-full h-full object-cover"/>:<div className="text-center"><Camera size={28} color={C.blueBright} className="mx-auto mb-2"/><div className="text-sm" style={{color:C.blueBright}}>{t.photoFood}</div></div>}<input type="file" accept="image/*" capture="environment" className="hidden" onChange={photoChosen}/></label><div className="mt-3 text-[11px] p-3 rounded-xl" style={{background:C.warningDim,color:C.steel}}><b style={{color:C.warning}}>{t.cameraEstimate}.</b> {t.cameraEstimateNote}</div>{msg&&<div className="text-xs mt-3" style={{color:C.steel}}>{msg}</div>}<div className="mt-3"><Field label={t.chooseMatch}><select value={foodId} onChange={e=>{setFoodId(e.target.value);const f=FOODS.find(x=>x.id===e.target.value);setAmount(f.amount)}} style={{...inputStyle,width:"100%"}}>{FOODS.map(f=><option key={f.id} value={f.id}>{L(f.name,lang)}</option>)}</select></Field><div className="mt-3"><Field label={`${t.portionEstimate} (${L(food.unit,lang)})`}><NumEditor value={amount} onChange={setAmount} style={inputStyle} width="100%"/></Field></div><ScanNutrition result={{name:L(food.name,lang),amount,kcal:food.kcal*mult,p:food.p*mult,c:food.c*mult,f:food.f*mult}} t={t} onAdd={addEstimated}/></div></div>}</div>
}
function ScanNutrition({result,t,onAdd}){return <div className="glassInset p-3 mt-3"><div className="font-semibold text-sm mb-2" style={{color:C.text}}>{result.name}</div><div className="grid grid-cols-4 gap-1 text-center">{[["kcal",result.kcal],[t.protein,result.p],[t.carbs,result.c],[t.fat,result.f]].map(([l,v])=><div key={l}><div className="disp font-semibold" style={{color:C.blueBright}}>{Math.round(v||0)}</div><div className="text-[9px]" style={{color:C.steel}}>{l}</div></div>)}</div><button onClick={onAdd} className="liquidPrimary w-full py-2.5 rounded-xl mt-3 text-sm font-semibold">{t.logScan}</button></div>}

/* ================================================================================ */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const mountTimeRef = useRef(Date.now());
  const [state, setState] = useState(DEFAULT_STATE);
  const [tab, setTab] = useState("dashboard");
  const [view, setView] = useState("home");
  const [activeDayFocus, setActiveDayFocus] = useState(null);
  const [activeMuscle, setActiveMuscle] = useState(null);
  const [programPreview, setProgramPreview] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showEquipment, setShowEquipment] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [onboardStep, setOnboardStep] = useState(0);
  const [draftProfile, setDraftProfile] = useState(DEFAULT_PROFILE);
  const [timer, setTimer] = useState({ active: false, running: false, remaining: 0, total: 0, label: "" });
  const [toast, setToast] = useState(null);
  const [celebration, setCelebration] = useState(null); // null | "workout" | "water"
  const dirty = useRef(false);

  const lang = state.profile.lang;
  const t = STR[lang] || STR.en;
  C = state.profile.theme === "light" ? C_LIGHT : C_DARK;

  useEffect(() => {
    (async () => {
      try {
        const res = await forgeStoreGet(STORAGE_KEY);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          const today = todayStr();
          const prunedChecklist = {};
          if (parsed.checklist && parsed.checklist[today]) prunedChecklist[today] = parsed.checklist[today];
          const profile = { ...DEFAULT_PROFILE, ...(parsed.profile || {}) };
          setState({
            profile, history: parsed.history || [], checklist: prunedChecklist,
            goals: parsed.goals || {}, best: parsed.best || {},
            haveFoods: parsed.haveFoods || {},
            mealPlan: parsed.mealPlanDate === today ? parsed.mealPlan : null,
            mealPlanDate: parsed.mealPlanDate === today ? parsed.mealPlanDate : "",
            hydrationMl: parsed.hydrationDate === today ? (parsed.hydrationMl || 0) : 0,
            hydrationDate: parsed.hydrationDate === today ? parsed.hydrationDate : "",
            foodLog: parsed.foodLog && parsed.foodLog[today] ? { [today]: parsed.foodLog[today] } : {},
            dislikedIds: parsed.dislikedIds || [],
            xp: parsed.xp || 0,
            recoveryLog: pruneOldDates(parsed.recoveryLog || {}, 30),
            prLog: (parsed.prLog || []).filter((p) => daysAgo(p.date) <= 90),
            nutritionDays: (parsed.nutritionDays || []).filter((d) => daysAgo(d) <= 60),
            cardioLog: (parsed.cardioLog || []).filter((c) => daysAgo(c.date) <= 60),
            calorieHistory: pruneOldDates(parsed.calorieHistory || {}, 30),
            dietCorrection: parsed.dietCorrection && parsed.dietCorrection.endDate > todayStr() ? parsed.dietCorrection : null,
            scheduleOverrides: pruneOldDates(parsed.scheduleOverrides || {}, 14),
          });
          setDraftProfile(profile);
        }
      } catch (e) { console.error("No saved state yet, starting fresh.", e); }
      finally { setLoaded(true); }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const elapsed = Date.now() - mountTimeRef.current;
    const remain = Math.max(0, 1400 - elapsed);
    const id = setTimeout(() => setSplashDone(true), remain);
    return () => clearTimeout(id);
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    if (!dirty.current) { dirty.current = true; return; }
    (async () => {
      try { await forgeStoreSet(STORAGE_KEY, JSON.stringify(state)); }
      catch (e) { console.error("Couldn't save your progress.", e); }
    })();
  }, [state, loaded]);

  useEffect(() => {
    if (!(timer.active && timer.running)) return;
    const id = setInterval(() => {
      setTimer((tm) => {
        if (tm.remaining <= 1) { vibrate([50, 80, 50, 80, 90]); return { ...tm, remaining: 0, running: false }; }
        return { ...tm, remaining: tm.remaining - 1 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timer.active, timer.running]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!loaded) return;
    const id = setInterval(() => setToast(STR[state.profile.lang].hydrationReminder), 15 * 60 * 1000);
    return () => clearInterval(id);
  }, [loaded, state.profile.lang]);

  function startTimer(seconds, label) { setTimer({ active: true, running: true, remaining: seconds, total: seconds, label }); }

  function getSetArray(exId, count) {
    const today = todayStr();
    const arr = state.checklist[today] && state.checklist[today][exId];
    if (arr && arr.length === count) return arr;
    return Array(count).fill(false);
  }
  function toggleSet(ex) {
    return (idx) => {
      const today = todayStr();
      const arr = getSetArray(ex.id, ex.sets).slice();
      const goingOn = !arr[idx]; arr[idx] = goingOn;
      setState((prev) => ({ ...prev, checklist: { ...prev.checklist, [today]: { ...(prev.checklist[today] || {}), [ex.id]: arr } } }));
      if (goingOn) {
        vibrate(15);
        if (!ex.warmup) startTimer(ex.rest, L(ex.name, lang));
      }
    };
  }
  function awardXp(amount) { setState((prev) => ({ ...prev, xp: (prev.xp || 0) + amount })); }
  function setBest(exId, value) {
    const num = parseFloat(value);
    setState((prev) => {
      const prevBest = parseFloat(prev.best[exId]);
      const isPR = !isNaN(num) && num > 0 && (isNaN(prevBest) || num > prevBest);
      return {
        ...prev,
        best: { ...prev.best, [exId]: value },
        prLog: isPR ? [...prev.prLog, { id: Date.now(), exId, weight: num, date: todayStr() }].slice(-200) : prev.prLog,
        xp: isPR ? (prev.xp || 0) + 15 : prev.xp,
      };
    });
  }
  function setGoal(exId, value) { setState((prev) => ({ ...prev, goals: { ...prev.goals, [exId]: value } })); }
  function progressOf(exList) {
    let done = 0, total = 0;
    for (const ex of exList) { const arr = getSetArray(ex.id, ex.sets); total += ex.sets; done += arr.filter(Boolean).length; }
    return total === 0 ? 0 : done / total;
  }
  function finishWorkout() {
    const today = todayStr();
    const alreadyDone = state.history.includes(today);
    setState((prev) => ({ ...prev, history: prev.history.includes(today) ? prev.history : [...prev.history, today].slice(-90), xp: alreadyDone ? prev.xp : (prev.xp || 0) + 20 }));
    setToast("✓ " + t.logged);
    if (!alreadyDone) { setCelebration("workout"); vibrate([25, 50, 25, 50, 70]); }
  }
  function addWater(ml) {
    const today = todayStr();
    const current = state.hydrationDate === today ? state.hydrationMl : 0;
    const next = current + ml;
    const goal = Math.round((state.profile.weightKg || 70) * 33);
    setState((prev) => ({ ...prev, hydrationMl: (prev.hydrationDate === today ? prev.hydrationMl : 0) + ml, hydrationDate: today }));
    if (current < goal && next >= goal) { setCelebration("water"); vibrate([25, 50, 25, 50, 70]); awardXp(10); }
    else vibrate(10);
  }
  function logRecovery(entry) {
    const today = todayStr();
    setState((prev) => {
      const hadToday = !!prev.recoveryLog[today];
      return { ...prev, recoveryLog: { ...prev.recoveryLog, [today]: entry }, xp: hadToday ? prev.xp : (prev.xp || 0) + 5 };
    });
    setToast(t.recoveryLogged);
  }
  function logCardioSession(entry) {
    setState((prev) => ({ ...prev, cardioLog: [...prev.cardioLog, entry].slice(-60), xp: (prev.xp || 0) + 10 }));
    setToast(t.cardioLogged);
  }
  function markNutritionDay() {
    const today = todayStr();
    setState((prev) => {
      if (prev.nutritionDays.includes(today)) return prev;
      return { ...prev, nutritionDays: [...prev.nutritionDays, today].slice(-60), xp: (prev.xp || 0) + 5 };
    });
  }
  function toggleHaveFood(id) { setState((prev) => ({ ...prev, haveFoods: { ...prev.haveFoods, [id]: !prev.haveFoods[id] } })); }
  function addFoodLogEntry(entry) {
    const today = todayStr();
    setState((prev) => {
      const todayEntries = [...((prev.foodLog && prev.foodLog[today]) || []), entry];
      const todayKcal = Math.round(todayEntries.reduce((s, e) => s + e.kcal, 0));
      return { ...prev, foodLog: { [today]: todayEntries }, calorieHistory: { ...prev.calorieHistory, [today]: todayKcal } };
    });
    markNutritionDay();
  }
  function removeFoodLogEntry(id) {
    const today = todayStr();
    setState((prev) => {
      const todayEntries = ((prev.foodLog && prev.foodLog[today]) || []).filter((e) => e.id !== id);
      const todayKcal = Math.round(todayEntries.reduce((s, e) => s + e.kcal, 0));
      return { ...prev, foodLog: { [today]: todayEntries }, calorieHistory: { ...prev.calorieHistory, [today]: todayKcal } };
    });
  }
  function applyDietCorrection() {
    const today = todayStr();
    const todayKcal = state.calorieHistory[today] || 0;
    const baseline = calcTargets(state.profile, 0).kcal;
    const overage = Math.round(todayKcal - baseline);
    if (overage <= 0) return;
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const endD = new Date(); endD.setDate(endD.getDate() + 8);
    const maxDailyCut = Math.round(baseline * 0.15); // never cut more than 15% of a normal day
    const perDayReduction = Math.min(Math.round(overage / 7), maxDailyCut);
    setState((prev) => ({ ...prev, dietCorrection: { startDate: fmtDate(tomorrow), endDate: fmtDate(endD), perDayReduction, totalOverage: overage, sourceDate: today } }));
    setToast(t.correctionApplied);
  }
  function cancelDietCorrection() { setState((prev) => ({ ...prev, dietCorrection: null })); }
  function applyScheduleOverride(key) {
    const today = todayStr();
    setState((prev) => ({ ...prev, scheduleOverrides: { ...prev.scheduleOverrides, [today]: key } }));
    vibrate(15);
  }
  function generateMealPlan(seed) {
    const have = FOOD_CATS.reduce((acc, cat) => { acc[cat] = FOODS.filter((f) => f.cat === cat && state.haveFoods[f.id]); return acc; }, {});
    const targets = calcTargets(state.profile, activeDietCorrectionKcal(state));
    const existingMeals = (state.mealPlan && state.mealPlan.meals) || [];
    const meals = [{ key: "breakfast", pct: MEAL_PCT.breakfast, offset: seed }, { key: "lunch", pct: MEAL_PCT.lunch, offset: seed + 1 }, { key: "dinner", pct: MEAL_PCT.dinner, offset: seed + 2 }, { key: "snack", pct: MEAL_PCT.snack, offset: seed + 3 }];
    const built = meals.map((m) => {
      const existing = existingMeals.find((em) => em.key === m.key);
      if (existing && existing.locked) return existing; // locked meals are left exactly as they are
      const slots = m.key === "snack" ? ["protein", "fruit"] : m.key === "breakfast" ? ["protein", "carb", "fruit", "fat"] : ["protein", "carb", "veg", "fat"];
      const items = [];
      slots.forEach((cat) => {
        const pool = cat === "protein" ? [...(have.protein || []), ...(have.dairy || [])] : (have[cat] || []);
        if (pool.length) items.push(pool[m.offset % pool.length]);
      });
      const baseKcal = items.reduce((s, i) => s + i.kcal, 0);
      const targetKcal = targets.kcal * m.pct;
      let mult = baseKcal > 0 ? targetKcal / baseKcal : 0;
      mult = Math.max(0.5, Math.min(3, Math.round(mult * 2) / 2));
      const scaled = items.map((i) => ({ ...i, mult }));
      const totals = scaled.reduce((acc, i) => ({ kcal: acc.kcal + i.kcal * i.mult, p: acc.p + i.p * i.mult, c: acc.c + i.c * i.mult, f: acc.f + i.f * i.mult }), { kcal: 0, p: 0, c: 0, f: 0 });
      return { key: m.key, items: scaled, totals, locked: false };
    });
    const dayTotals = built.reduce((acc, m) => ({ kcal: acc.kcal + m.totals.kcal, p: acc.p + m.totals.p, c: acc.c + m.totals.c, f: acc.f + m.totals.f }), { kcal: 0, p: 0, c: 0, f: 0 });
    const today = todayStr();
    setState((prev) => ({ ...prev, mealPlan: { meals: built, totals: dayTotals, seed }, mealPlanDate: today }));
  }
  function toggleMealLock(key) {
    setState((prev) => {
      if (!prev.mealPlan) return prev;
      const meals = prev.mealPlan.meals.map((m) => (m.key === key ? { ...m, locked: !m.locked } : m));
      return { ...prev, mealPlan: { ...prev.mealPlan, meals } };
    });
  }
  function logMealToFoodLog(items) {
    items.forEach((i, idx) => {
      addFoodLogEntry({ id: Date.now() + idx + Math.random(), foodId: i.id, amount: i.amount * i.mult, kcal: i.kcal * i.mult, p: i.p * i.mult, c: i.c * i.mult, f: i.f * i.mult });
    });
    setToast(t.mealLogged);
  }
  function swapMealForGeorgianDish(mealKey) {
    const options = FOODS.filter((f) => f.cat === "georgian" && state.haveFoods[f.id]);
    if (!options.length) return;
    const dish = options[Math.floor(Math.random() * options.length)];
    const targets = calcTargets(state.profile, activeDietCorrectionKcal(state));
    const targetKcal = targets.kcal * (MEAL_PCT[mealKey] || 0.3);
    let mult = dish.kcal > 0 ? targetKcal / dish.kcal : 1;
    mult = Math.max(0.5, Math.min(3, Math.round(mult * 2) / 2));
    const scaledItem = { ...dish, mult };
    const mealTotals = { kcal: dish.kcal * mult, p: dish.p * mult, c: dish.c * mult, f: dish.f * mult };
    setState((prev) => {
      if (!prev.mealPlan) return prev;
      const meals = prev.mealPlan.meals.map((m) => (m.key === mealKey ? { key: mealKey, items: [scaledItem], totals: mealTotals } : m));
      const totals = meals.reduce((acc, m) => ({ kcal: acc.kcal + m.totals.kcal, p: acc.p + m.totals.p, c: acc.c + m.totals.c, f: acc.f + m.totals.f }), { kcal: 0, p: 0, c: 0, f: 0 });
      return { ...prev, mealPlan: { ...prev.mealPlan, meals, totals } };
    });
  }
  function finishOnboarding() { setState((prev) => ({ ...prev, profile: { ...draftProfile, onboarded: true } })); setToast(STR[draftProfile.lang].programBuilt); }
  function saveEquipment(list) {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, equipment: list } }));
    setDraftProfile((prev) => ({ ...prev, equipment: list }));
    setToast(t.equipUpdated);
  }
  function saveProfile() { setState((prev) => ({ ...prev, profile: { ...draftProfile } })); setToast(STR[draftProfile.lang].save); }
  function setLang(newLang) { setDraftProfile((p) => ({ ...p, lang: newLang })); setState((prev) => ({ ...prev, profile: { ...prev.profile, lang: newLang } })); }
  function setTheme(newTheme) { setDraftProfile((p) => ({ ...p, theme: newTheme })); setState((prev) => ({ ...prev, profile: { ...prev.profile, theme: newTheme } })); }
  function dislikeExercise(exId) {
    setState((prev) => (prev.dislikedIds.includes(exId) ? prev : { ...prev, dislikedIds: [...prev.dislikedIds, exId] }));
    setToast(t.swappedNote);
  }
  function restoreExercise(exId) {
    setState((prev) => ({ ...prev, dislikedIds: prev.dislikedIds.filter((id) => id !== exId) }));
  }

  const GlobalStyle = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { display: none; }
      .disp { font-family: 'Space Grotesk', sans-serif; }
      .tabular { font-variant-numeric: tabular-nums; }
      @keyframes riseIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      .rise { animation: riseIn 0.25s ease-out; }
      @keyframes ffMoveVert { 0%,100% { transform: translateY(0); } 50% { transform: translateY(48px); } }
      @keyframes ffMoveHorz { 0%,100% { transform: translateX(0); } 50% { transform: translateX(58px); } }
      @keyframes ffMoveArc { 0% { transform: translate(-20px,44px); } 50% { transform: translate(20px,-2px); } 100% { transform: translate(-20px,44px); } }
      @keyframes ffLogoPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
      @keyframes ffTextFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes ffSpin { to { transform: rotate(360deg); } }
      @keyframes ffBurst { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: 1; } 100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1); opacity: 0; } }
      @keyframes ffPop { 0% { transform: scale(0.7); opacity: 0; } 55% { transform: scale(1.06); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
      button { transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1); }
      button:active { transform: scale(0.97); }
      :root {
        --bg-primary: #05070D; --accent-blue: #4C8DFF; --accent-blue-light: #8FB8FF;
        --text-primary: #EAF0FF; --text-secondary: #8792AC;
        --glass-bg: rgba(255,255,255,0.055); --glass-border: rgba(255,255,255,0.12); --glass-highlight: rgba(255,255,255,0.18);
      }

      .liquidCard,.liquidHero,.glassInset { position:relative; overflow:hidden; border:1px solid rgba(255,255,255,.14); backdrop-filter:blur(38px) saturate(165%); -webkit-backdrop-filter:blur(38px) saturate(165%); box-shadow:inset 0 1.5px 0 rgba(255,255,255,.22),inset 0 -1px 0 rgba(255,255,255,.035),inset 1px 0 0 rgba(255,255,255,.06),0 22px 60px rgba(0,0,0,.34); }
      .liquidCard { border-radius:24px; background:radial-gradient(circle at 18% -15%,rgba(255,255,255,.16),transparent 35%),linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.018) 58%,rgba(76,141,255,.025)); }
      .liquidHero { border-radius:28px; background:radial-gradient(circle at 14% 0%,rgba(76,141,255,.13),transparent 38%),linear-gradient(155deg,rgba(255,255,255,.06),rgba(255,255,255,.018)); }
      .liquidCard:before,.liquidHero:before { content:"";position:absolute;left:9%;right:9%;top:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.30),transparent);pointer-events:none; }
      .glassInset { border-radius:17px; background:linear-gradient(145deg,rgba(255,255,255,.065),rgba(255,255,255,.022)); box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 -1px 0 rgba(255,255,255,.03),0 10px 28px rgba(0,0,0,.16); }
      .glassPill { padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.075);color:inherit; }
      .ffDock { position:relative; isolation:isolate; overflow:hidden; background:linear-gradient(180deg,rgba(31,34,40,.78),rgba(10,12,16,.88)); border:1.5px solid rgba(255,255,255,.22); backdrop-filter:blur(42px) saturate(180%); -webkit-backdrop-filter:blur(42px) saturate(180%); box-shadow:inset 0 2px 0 rgba(255,255,255,.24),inset 0 -1px 0 rgba(255,255,255,.055),0 22px 65px rgba(0,0,0,.55),0 0 0 .5px rgba(76,141,255,.15); }
      .ffDock:before { content:"";position:absolute;left:6%;right:6%;top:0;height:1.5px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.72),transparent);opacity:.65;z-index:3;pointer-events:none; }
      .ffDockSlider { position:absolute;z-index:0;top:6px;bottom:6px;width:calc((100% - 12px)/5);border-radius:23px;background:radial-gradient(circle at 50% 0%,rgba(255,255,255,.40),transparent 38%),linear-gradient(155deg,rgba(143,184,255,.34),rgba(76,141,255,.18) 48%,rgba(255,255,255,.08));border:1px solid rgba(177,211,255,.58);box-shadow:inset 0 2px 1px rgba(255,255,255,.42),inset 0 -2px 6px rgba(36,90,190,.20),0 0 26px rgba(76,141,255,.42),0 12px 26px rgba(0,0,0,.34);transition:transform .42s cubic-bezier(.22,1,.36,1);pointer-events:none; }
      .ffDockBtn { position:relative;z-index:1; }
      .ffDockActive { text-shadow:0 0 16px rgba(143,184,255,.7); }
      .ffSectionTitle { font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:700;letter-spacing:-.035em; }
      .liquidPrimary { background:linear-gradient(135deg,#8FB8FF,#4C8DFF 58%,#6F9FFF); color:#05070D; box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 8px 24px rgba(76,141,255,.22); }
      .exerciseVisual { border-radius:20px; overflow:hidden; }
      .forgeGlow { box-shadow:0 0 18px rgba(76,141,255,.65); transition:width .5s ease; }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
      }
      input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      input, select { font-family: 'Inter', sans-serif; }
    `}</style>
  );

  if (!loaded || !splashDone) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh" }} className="flex flex-col items-center justify-center">
        {GlobalStyle}
        <div style={{ position: "fixed", inset: 0, background: `radial-gradient(circle at 50% 40%, rgba(76,141,255,0.18), transparent 55%)`, pointerEvents: "none" }} />
        <div className="relative flex flex-col items-center">
          <div style={{ width: 76, height: 76, borderRadius: 22, background: C.blueDim, border: `1.5px solid ${C.borderStrong}`, display: "flex", alignItems: "center", justifyContent: "center", animation: "ffLogoPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <Dumbbell size={34} color={C.blue} />
          </div>
          <div className="disp text-2xl font-bold mt-4" style={{ color: C.text, animation: "ffTextFade 0.5s ease-out 0.3s both" }}>FORGEFIT</div>
          <div style={{ width: 22, height: 22, marginTop: 22, border: `2.5px solid ${C.border}`, borderTopColor: C.blue, borderRadius: "50%", animation: "ffSpin 0.8s linear infinite" }} />
        </div>
      </div>
    );
  }

  if (!state.profile.onboarded) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: C.text }}>
        {GlobalStyle}
        <Onboarding t={t} lang={draftProfile.lang} draftProfile={draftProfile} setDraftProfile={setDraftProfile} step={onboardStep} setStep={setOnboardStep} onFinish={finishOnboarding} setLang={setLang} />
      </div>
    );
  }

  const profile = state.profile;
  const weekFocus = buildWeekFocus(profile.split, profile.daysPerWeek);
  const todayIdx = new Date().getDay();
  const today = todayStr();
  const scheduleOverride = state.scheduleOverrides[today];
  const todayFocus = scheduleOverride || weekFocus[todayIdx];
  const todayExercises = getDayExercises(todayFocus, profile.emphasis, profile.sex, profile.equipment, state.dislikedIds);
  const coach = computeCoachRecommendation(state, profile, todayExercises, t, lang, profile.weightUnit);
  const doneToday = state.history.includes(today);
  const streak = currentStreak(state.history);
  const longest = Math.max(longestStreak(state.history), streak);
  const targets = calcTargets(profile, activeDietCorrectionKcal(state));

  const activeExList = view === "muscle" && activeMuscle ? byMuscle(activeMuscle)
    : view === "day" && activeDayFocus ? getDayExercises(activeDayFocus, profile.emphasis, profile.sex, profile.equipment, state.dislikedIds) : [];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: C.text }} className="flex flex-col">
      {GlobalStyle}
      <div style={{ position: "fixed", inset: 0, background: `radial-gradient(circle at 20% -10%, rgba(76,141,255,0.14), transparent 45%), radial-gradient(circle at 90% 10%, rgba(76,141,255,0.08), transparent 40%)`, pointerEvents: "none" }} />
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", opacity: C === C_LIGHT ? 0.025 : 0.05, mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }} />

      <div className="relative flex items-center justify-between px-5 pt-5 pb-3" style={{ borderBottom: `1.5px solid ${C.border}` }}>
        <div className="flex items-center gap-2">
          {(view === "day" || view === "muscle" || programPreview) ? (
            <button onClick={() => { setProgramPreview(false); setView("home"); }} className="p-1 -ml-1"><ChevronLeft size={22} color={C.blue} /></button>
          ) : (<div style={{width:28,height:28,borderRadius:10,display:"grid",placeItems:"center",background:"radial-gradient(circle at 35% 20%,#8FE7FF,#1595FF 42%,#275CFF 78%)",boxShadow:"inset 0 1px 0 rgba(255,255,255,.55),0 0 20px rgba(76,141,255,.38)"}}><Flame size={18} color="#fff" fill="rgba(255,255,255,.22)" /></div>)}
          <div>
            <div className="disp text-lg leading-none font-semibold" style={{ color: C.text }}>
              {view === "day" ? L(FOCUS_LABEL[activeDayFocus], lang) : view === "muscle" ? L(MUSCLE_LABEL[activeMuscle], lang) : t.appName}
            </div>
            {view === "home" && <div className="text-[11px]" style={{ color: C.steel }}>{tab==="train" ? `${L(SPLIT_LABEL[profile.split], lang)} · ${profile.daysPerWeek}x` : tab==="dashboard" ? (lang==="ka"?"შენი ყოველდღიური ცენტრი":"Your daily command center") : tab==="nutrition" ? (lang==="ka"?"კვება და მაკროები":"Meals & macros") : tab==="progress" ? (lang==="ka"?"ფორმა და პროგრესი":"Physique & progress") : tab==="cardio" ? t.navCardio : (lang==="ka"?"პარამეტრები და მეტი":"Settings & more")}</div>}
          </div>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: C.glass, border: `1.5px solid ${C.border}`, backdropFilter: "blur(20px) saturate(180%)" }}>
          <Flame size={16} color={streak > 0 ? C.blue : C.steel} fill={streak > 0 ? C.blue : "none"} />
          <span className="disp text-base leading-none tabular font-semibold" style={{ color: streak > 0 ? C.blueBright : C.steel }}>{streak}</span>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-5 pb-36 pt-4">
        {view === "home" && tab === "dashboard" && (
          <DashboardView t={t} lang={lang} profile={profile} state={state} targets={targets} todayFocus={todayFocus} todayExercises={todayExercises} doneToday={doneToday} progressOf={progressOf}
            onWorkout={() => { setTab("train"); setView("home"); if (todayFocus !== "rest") { setActiveDayFocus(todayFocus); setProgramPreview(true); } }}
            onNutrition={() => { setTab("nutrition"); setView("home"); }}
            onPhysique={() => { setTab("progress"); setView("home"); }} />
        )}
        {view === "home" && tab === "train" && !programPreview && (
          <TrainHome
            t={t} lang={lang} profile={profile} weekFocus={weekFocus} todayIdx={todayIdx} todayFocus={todayFocus}
            todayExercises={todayExercises} doneToday={doneToday} streak={streak} progressOf={progressOf}
            onOpenDay={(focus) => { setActiveDayFocus(focus); setProgramPreview(true); }}
            onOpenMuscle={(m) => { setActiveMuscle(m); setView("muscle"); }}
            onShowGuide={() => setShowGuide(true)}
            onShowEquipment={() => setShowEquipment(true)}
            onShowChat={() => setShowChat(true)}
            coach={coach}
          />
        )}
        {programPreview && activeDayFocus && tab === "train" && view === "home" && (
          <ProgramOverview t={t} lang={lang} profile={profile} focus={activeDayFocus} exercises={getDayExercises(activeDayFocus, profile.emphasis, profile.sex, profile.equipment, state.dislikedIds)} weekFocus={weekFocus} onStart={() => { setProgramPreview(false); setView("day"); }} />
        )}
        {(view === "day" || view === "muscle") && (
          <ExerciseListView
            t={t} lang={lang} sex={profile.sex} weightUnit={profile.weightUnit} exList={activeExList}
            getSetArray={getSetArray} toggleSet={toggleSet} state={state} setBest={setBest} setGoal={setGoal}
            progressOf={progressOf} finishWorkout={finishWorkout}
            onDislike={view === "day" ? dislikeExercise : null}
          />
        )}
        {tab === "nutrition" && view === "home" && (
          <NutritionView t={t} lang={lang} state={state} targets={targets} toggleHaveFood={toggleHaveFood} generateMealPlan={generateMealPlan} swapMealForGeorgianDish={swapMealForGeorgianDish}
            todayLog={state.foodLog[today] || []} addFoodLogEntry={addFoodLogEntry} removeFoodLogEntry={removeFoodLogEntry} onToast={setToast}
            todayCalories={state.calorieHistory[today] || 0} applyDietCorrection={applyDietCorrection} cancelDietCorrection={cancelDietCorrection} />
        )}
        {tab === "cardio" && view === "home" && (
          <CardioView t={t} lang={lang} profile={profile} hydrationMl={state.hydrationDate === today ? state.hydrationMl : 0} addWater={addWater} onToast={setToast} logCardioSession={logCardioSession} />
        )}
        {tab === "progress" && view === "home" && (
          <ProgressView t={t} lang={lang} weightUnit={profile.weightUnit} sex={profile.sex} profile={profile} state={state} streak={streak} longest={longest} logRecovery={logRecovery} />
        )}
        {tab === "profile" && view === "home" && (
          <ProfileView t={t} lang={lang} draftProfile={draftProfile} setDraftProfile={setDraftProfile} onSave={saveProfile} setLang={setLang} setTheme={setTheme} onShowEquipment={() => setShowEquipment(true)} onOpenCardio={() => { setTab("cardio"); setView("home"); }}
            dislikedIds={state.dislikedIds} onRestore={restoreExercise} />
        )}
      </div>

      {timer.active && (
        <div className="fixed left-0 right-0 flex justify-center px-4 rise" style={{ bottom: 78 }}>
          <div className="w-full max-w-md flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: C.card, border: `1px solid ${C.blue}`, backdropFilter: "blur(24px) saturate(180%)" }}>
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke={C.border} strokeWidth="4" />
              <circle cx="22" cy="22" r="18" fill="none" stroke={C.blue} strokeWidth="4"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - (timer.total ? timer.remaining / timer.total : 0))}
                strokeLinecap="round" transform="rotate(-90 22 22)" />
            </svg>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest truncate" style={{ color: C.steel }}>{t.resting} · {timer.label}</div>
              <div className="disp text-2xl leading-none tabular font-semibold" style={{ color: C.text }}>{fmtClock(timer.remaining)}</div>
            </div>
            <button onClick={() => setTimer((tm) => ({ ...tm, running: !tm.running }))} className="p-2 rounded-full" style={{ background: C.glass }}>
              {timer.running ? <Pause size={16} color={C.blue} /> : <Play size={16} color={C.blue} />}
            </button>
            <button onClick={() => setTimer((tm) => ({ ...tm, remaining: tm.total }))} className="p-2 rounded-full" style={{ background: C.glass }}>
              <RotateCcw size={16} color={C.steel} />
            </button>
            <button onClick={() => setTimer({ active: false, running: false, remaining: 0, total: 0, label: "" })} className="p-2 rounded-full" style={{ background: C.glass }}>
              <X size={16} color={C.steel} />
            </button>
          </div>
        </div>
      )}
      {timer.active && (
        <div className="fixed left-0 right-0 flex justify-center px-4" style={{ bottom: 138 }}>
          <button onClick={() => setShowGame(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold rise" style={{ background: C.blueDim, border: `1.5px solid ${C.borderStrong}`, color: C.blueBright }}>
            <Gamepad2 size={13} /> {t.playGame}
          </button>
        </div>
      )}
      {showGame && <SquatGame t={t} lang={lang} onClose={() => setShowGame(false)} />}
      {celebration && <CelebrationOverlay type={celebration} t={t} onDone={() => setCelebration(null)} />}

      {toast && (
        <div className="fixed left-0 right-0 flex justify-center px-4 rise" style={{ bottom: timer.active ? 156 : 78 }}>
          <div className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: C.blue, color: "#04070E" }}>{toast}</div>
        </div>
      )}

      {showGuide && <SetupGuide t={t} onClose={() => setShowGuide(false)} />}
      {showEquipment && <EquipmentModal t={t} lang={lang} profile={profile} onSave={(list) => { saveEquipment(list); setShowEquipment(false); }} onClose={() => setShowEquipment(false)} />}
      {showChat && <ChatModal t={t} lang={lang} contextText={buildCoachContext(state, profile, todayExercises, lang)} onClose={() => setShowChat(false)} onApplySchedule={applyScheduleOverride} />}

      <div className="fixed left-0 right-0 z-40 flex justify-center px-4" style={{bottom:12,pointerEvents:"none"}}>
        <div className="ffDock w-full max-w-md flex items-stretch p-1.5 rounded-[30px]" style={{pointerEvents:"auto"}}>
          {(() => {
            const nav=[
              { key:"train", icon:Dumbbell, label:lang==="ka"?"ვარჯიში":"Workout" },
              { key:"nutrition", icon:Utensils, label:lang==="ka"?"კვება":"Nutrition" },
              { key:"dashboard", icon:HomeIcon, label:lang==="ka"?"მთავარი":"Dashboard" },
              { key:"progress", icon:Award, label:lang==="ka"?"ფორმა":"Physique" },
              { key:"profile", icon:User, label:lang==="ka"?"მეტი":"More" },
            ];
            const effectiveKey = tab==="cardio" ? "profile" : tab;
            const activeIndex=Math.max(0,nav.findIndex(n=>n.key===effectiveKey));
            return <>
              <div className="ffDockSlider" style={{transform:`translateX(${activeIndex*100}%)`}} />
              {nav.map(({key,icon:Icon,label},idx)=>{
                const active=effectiveKey===key;
                const center=idx===2;
                return <button key={key} onClick={()=>{setTab(key);setView("home");setProgramPreview(false);}} className={`${active?"ffDockActive":""} ffDockBtn flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-[23px] min-w-0`} style={center?{transform:"translateY(-1px)"}:undefined}>
                  <Icon size={center?21:19} strokeWidth={active?2.8:2.05} color={active?"#F8FBFF":C.steel}/>
                  <span className="text-[9px] font-semibold truncate max-w-full px-1" style={{color:active?"#F8FBFF":C.steel}}>{label}</span>
                </button>
              })}
            </>;
          })()}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- CELEBRATION ---------------------------------- */
function CelebrationOverlay({ type, t, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 1900);
    return () => clearTimeout(id);
  }, [onDone]);
  const pieces = useMemo(() => {
    const palette = [C.blue, C.blueBright, "#FBBF24", "#34D186"];
    return Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * 360 + Math.random() * 18;
      const dist = 70 + Math.random() * 100;
      return {
        dx: Math.cos((angle * Math.PI) / 180) * dist,
        dy: Math.sin((angle * Math.PI) / 180) * dist,
        delay: Math.random() * 0.2,
        size: 5 + Math.random() * 6,
        color: palette[i % palette.length],
        rotate: Math.random() * 360,
      };
    });
  }, []);
  const icon = type === "workout" ? "💪" : "💧";
  const title = type === "workout" ? t.workoutCelebrate : t.waterCelebrate;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ pointerEvents: "none" }}>
      <div className="relative flex items-center justify-center" style={{ width: 1, height: 1 }}>
        {pieces.map((p, i) => (
          <span key={i} style={{
            position: "absolute", left: "50%", top: "50%", width: p.size, height: p.size, borderRadius: 2,
            background: p.color, "--dx": `${p.dx}px`, "--dy": `${p.dy}px`,
            transform: `translate(-50%,-50%) rotate(${p.rotate}deg)`,
            animation: `ffBurst 1.15s ease-out ${p.delay}s forwards`,
          }} />
        ))}
        <div style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          background: C.card, border: `1.5px solid ${C.borderStrong}`, borderRadius: 24, padding: "22px 30px",
          textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.35)", animation: "ffPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
          <div style={{ fontSize: 40, lineHeight: 1 }}>{icon}</div>
          <div className="disp text-lg font-bold mt-2" style={{ color: C.text, whiteSpace: "nowrap" }}>{title}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- ONBOARDING ---------------------------------- */
function Onboarding({ t, lang, draftProfile, setDraftProfile, step, setStep, onFinish, setLang }) {
  const p = draftProfile;
  const set = (k, v) => setDraftProfile((d) => ({ ...d, [k]: v }));
  const steps = [t.basics, t.goalActivity, t.training];
  const ftin = cmToFtIn(p.heightCm);

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 max-w-md mx-auto">
      <div style={{ position: "fixed", inset: 0, background: `radial-gradient(circle at 30% 0%, rgba(76,141,255,0.18), transparent 50%)`, pointerEvents: "none" }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Sparkles size={18} color={C.blue} />
            <span className="disp text-2xl font-bold" style={{ color: C.text }}>{t.appName}</span>
          </div>
          <button onClick={() => setLang(lang === "en" ? "ka" : "en")} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: C.glass, border: `1.5px solid ${C.border}`, color: C.blueBright }}>
            <Globe size={12} /> {lang === "en" ? "EN" : "KA"}
          </button>
        </div>
        <div className="text-sm mb-6" style={{ color: C.steel }}>{t.tagline}</div>

        <div className="disp text-xl font-semibold mb-1" style={{ color: C.text }}>{t.onboardTitle}</div>
        <div className="text-xs mb-5" style={{ color: C.steel }}>{t.step} {step + 1} {t.of} 3 · {steps[step]}</div>

        <div className="flex gap-1.5 mb-6">
          {[0, 1, 2].map((i) => <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? C.blue : C.border }} />)}
        </div>

        <div className="rounded-3xl p-5 rise shadow-xl" style={{ background: C.glass, border: `1.5px solid ${C.border}`, backdropFilter: "blur(28px) saturate(180%)" }}>
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <Field label={t.name}><input value={p.name} onChange={(e) => set("name", e.target.value)} style={inputStyle} placeholder="—" /></Field>
              <Field label={t.sex}><SegButton options={[{ v: "male", l: t.male }, { v: "female", l: t.female }]} value={p.sex} onChange={(v) => set("sex", v)} /></Field>
              <Field label={t.age}><NumEditor value={p.age} onChange={(n) => set("age", n)} style={inputStyle} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`${t.weight} (${p.weightUnit})`}>
                  <div className="flex gap-1">
                    <NumEditor value={p.weightUnit === "kg" ? Math.round(p.weightKg * 10) / 10 : Math.round(kgToLb(p.weightKg) * 10) / 10}
                      onChange={(n) => set("weightKg", p.weightUnit === "kg" ? n : lbToKg(n))} style={inputStyle} width="100%" />
                    <button onClick={() => set("weightUnit", p.weightUnit === "kg" ? "lb" : "kg")} className="px-2 rounded-lg text-xs font-semibold shrink-0" style={{ background: C.blueDim, color: C.blueBright }}>{p.weightUnit}</button>
                  </div>
                </Field>
                <Field label={t.height}>
                  {p.heightUnit === "cm" ? (
                    <div className="flex gap-1">
                      <NumEditor value={Math.round(p.heightCm)} onChange={(n) => set("heightCm", n)} style={inputStyle} width="100%" />
                      <button onClick={() => set("heightUnit", "ftin")} className="px-2 rounded-lg text-xs font-semibold shrink-0" style={{ background: C.blueDim, color: C.blueBright }}>cm</button>
                    </div>
                  ) : (
                    <div className="flex gap-1 items-center">
                      <NumEditor value={ftin.ft} onChange={(n) => set("heightCm", ftInToCm(n, ftin.inch))} style={inputStyle} width={44} />
                      <span className="text-xs" style={{ color: C.steel }}>ft</span>
                      <NumEditor value={ftin.inch} onChange={(n) => set("heightCm", ftInToCm(ftin.ft, n))} style={inputStyle} width={44} />
                      <span className="text-xs" style={{ color: C.steel }}>in</span>
                      <button onClick={() => set("heightUnit", "cm")} className="px-2 py-1.5 rounded-lg text-xs font-semibold ml-auto shrink-0" style={{ background: C.blueDim, color: C.blueBright }}>cm</button>
                    </div>
                  )}
                </Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <Field label={t.goal}><SegButton options={[{ v: "lose", l: t.lose }, { v: "maintain", l: t.maintain }, { v: "gain", l: t.gain }]} value={p.goal} onChange={(v) => set("goal", v)} vertical /></Field>
              <Field label={t.activity}>
                <select value={p.activity} onChange={(e) => set("activity", e.target.value)} style={{ ...inputStyle, width: "100%" }}>
                  <option value="sedentary">{t.sedentary}</option><option value="light">{t.light}</option><option value="moderate">{t.moderate}</option><option value="active">{t.active}</option><option value="veryActive">{t.veryActive}</option>
                </select>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <Field label={t.split}>
                <SegButton options={Object.keys(SPLIT_LABEL).map((v) => ({ v, l: L(SPLIT_LABEL[v], lang) }))} value={p.split} onChange={(v) => set("split", v)} vertical />
              </Field>
              <Field label={t.daysPerWeek}><SegButton options={[3, 4, 5, 6].map((n) => ({ v: n, l: String(n) }))} value={p.daysPerWeek} onChange={(v) => set("daysPerWeek", Number(v))} /></Field>
              <Field label={t.emphasis}>
                <select value={p.emphasis} onChange={(e) => set("emphasis", e.target.value)} style={{ ...inputStyle, width: "100%" }}>
                  <option value="">{t.none}</option>
                  {MUSCLES.map((m) => <option key={m} value={m}>{L(MUSCLE_LABEL[m], lang)}</option>)}
                </select>
              </Field>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-5">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 px-4 py-3 rounded-2xl text-sm font-semibold" style={{ background: C.glass, border: `1.5px solid ${C.border}`, color: C.text }}>
              <ArrowLeft size={14} /> {t.back}
            </button>
          )}
          <button onClick={() => (step < 2 ? setStep(step + 1) : onFinish())} className="flex-1 flex items-center justify-center gap-1 py-3 rounded-2xl disp text-base font-semibold" style={{ background: C.blue, color: "#04070E" }}>
            {step < 2 ? t.next : t.finish} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
const inputStyle = { borderRadius: 10, padding: "8px 10px", fontSize: 14, outline: "none" };
Object.defineProperty(inputStyle, "background", { get: () => (C === C_LIGHT ? "rgba(20,30,60,0.04)" : "rgba(255,255,255,0.06)"), enumerable: true });
Object.defineProperty(inputStyle, "border", { get: () => `1.5px solid ${C.border}`, enumerable: true });
Object.defineProperty(inputStyle, "color", { get: () => C.text, enumerable: true });
function Field({ label, children }) { return <div><div className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: C.steel }}>{label}</div>{children}</div>; }
function SegButton({ options, value, onChange, vertical }) {
  if (vertical) {
    return (
      <div className="flex flex-col gap-2">
        {options.map((o) => {
          const active = value === o.v;
          return (
            <button key={o.v} onClick={() => onChange(o.v)} className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm text-left font-medium"
              style={{ background: active ? C.blueDim : "rgba(255,255,255,0.03)", border: `1px solid ${active ? C.borderStrong : C.border}`, color: active ? C.blueBright : C.text }}>
              <span style={{ flex: 1, minWidth: 0, wordBreak: "break-word", lineHeight: 1.3 }}>{o.l}</span>
              {active && <CheckCircle2 size={16} color={C.blueBright} style={{ flexShrink: 0, marginLeft: 8 }} />}
            </button>
          );
        })}
      </div>
    );
  }
  const idx = Math.max(0, options.findIndex((o) => o.v === value));
  const pct = 100 / options.length;
  return (
    <div className="relative flex p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: `1.5px solid ${C.border}` }}>
      <div className="absolute top-1 bottom-1 rounded-lg" style={{ left: `calc(${idx * pct}% + 4px)`, width: `calc(${pct}% - 8px)`, background: C.blueDim, border: `1.5px solid ${C.borderStrong}`, transition: "left 0.28s cubic-bezier(0.34,1.56,0.64,1)" }} />
      {options.map((o) => {
        const active = value === o.v;
        return (
          <button key={o.v} onClick={() => onChange(o.v)} className="relative z-10 flex-1 px-1.5 py-2 text-center"
            style={{ minWidth: 0, color: active ? C.blueBright : C.steel, wordBreak: "break-word", lineHeight: 1.2, fontSize: 12, fontWeight: 600 }}>
            {o.l}
          </button>
        );
      })}
    </div>
  );
}

function DashboardView({ t, lang, profile, state, targets, todayFocus, todayExercises, doneToday, progressOf, onWorkout, onNutrition, onPhysique }) {
  const hour = new Date().getHours();
  const greeting = lang === "ka"
    ? (hour < 12 ? "დილა მშვიდობისა" : hour < 18 ? "შუადღე მშვიდობისა" : "საღამო მშვიდობისა")
    : (hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening");
  const name = profile.name || (lang === "ka" ? "სპორტსმენო" : "Athlete");
  const pct = Math.round(progressOf(todayExercises) * 100);
  const today = todayStr();
  const logged = (state.foodLog[today] || []).reduce((s,e)=>s+(e.kcal||0),0);
  const nutritionPct = Math.min(100, Math.round((logged / Math.max(1, targets.kcal))*100));
  const water = state.hydrationDate === today ? state.hydrationMl : 0;
  const waterGoal = Math.max(1800, Math.round((profile.weightKg || 70)*33));
  const waterPct = Math.min(100, Math.round((water/waterGoal)*100));
  const level = computeLevel(state.xp || 0);
  const hero = profile.sex === "female" ? "./profile-media/female-front.jpg" : "./profile-media/male-front.jpg";
  const Ring = ({value,label,sub}) => <div className="text-center">
    <div className="mx-auto grid place-items-center" style={{width:72,height:72,borderRadius:"50%",background:`conic-gradient(${C.blue} ${value*3.6}deg,rgba(255,255,255,.08) 0)`,boxShadow:"0 0 24px rgba(76,141,255,.12)"}}>
      <div className="grid place-items-center" style={{width:58,height:58,borderRadius:"50%",background:C.card,color:C.text}}><span className="disp text-sm font-bold">{value}%</span></div>
    </div>
    <div className="text-[11px] font-semibold mt-2" style={{color:C.text}}>{label}</div>
    <div className="text-[9px]" style={{color:C.steel}}>{sub}</div>
  </div>;
  return <div>
    <div className="relative overflow-hidden rounded-[30px] mb-5" style={{minHeight:260,background:"linear-gradient(135deg,#060A12,#071428 58%,#06101D)",border:`1px solid ${C.border}`,boxShadow:"inset 0 1px 0 rgba(255,255,255,.12),0 22px 55px rgba(0,0,0,.32)"}}>
      <img src={hero} alt="" style={{position:"absolute",right:-22,bottom:0,width:"58%",height:"100%",objectFit:"cover",objectPosition:"center top",filter:"saturate(.8) contrast(1.08)"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(4,7,13,.98) 0%,rgba(4,7,13,.86) 48%,rgba(4,7,13,.10) 78%)"}}/>
      <div className="relative p-5" style={{width:"68%"}}>
        <div className="text-sm" style={{color:C.steel}}>{greeting},</div>
        <div className="disp text-3xl font-bold mt-1" style={{color:C.text}}>{name} 👋</div>
        <div className="text-sm leading-relaxed mt-4" style={{color:C.steel}}>{lang==="ka"?"დღევანდელი დისციპლინა ქმნის ხვალინდელ ძალას.":"Discipline today builds the stronger you tomorrow."}</div>
        <button onClick={onWorkout} className="liquidPrimary mt-5 px-4 py-2.5 rounded-xl text-sm font-bold">{lang==="ka"?"ვარჯიშზე გადასვლა":"Start today's workout"}</button>
      </div>
    </div>

    <button onClick={onWorkout} className="w-full flex items-center gap-3 p-3 rounded-2xl mb-5 text-left" style={{background:C.glass,border:`1px solid ${C.border}`}}>
      <img src={profile.sex==="female"?"./exercise-media/female-shoulder.jpg":"./exercise-media/male-bench.jpg"} style={{width:74,height:64,objectFit:"cover",borderRadius:14}}/>
      <div className="flex-1"><div className="text-[10px] uppercase tracking-widest" style={{color:C.blueBright}}>{lang==="ka"?"მიმდინარე პროგრამა":"Current Program"}</div><div className="font-semibold" style={{color:C.text}}>{L(SPLIT_LABEL[profile.split],lang)}</div><div className="text-[11px]" style={{color:C.steel}}>{todayFocus==="rest"?t.restDay:L(FOCUS_LABEL[todayFocus],lang)} · {todayExercises.length} {lang==="ka"?"ვარჯიში":"exercises"}</div></div>
      <ChevronRight size={18} color={C.steel}/>
    </button>

    <div className="disp text-lg font-semibold mb-3" style={{color:C.text}}>{lang==="ka"?"დღევანდელი პროგრესი":"Today's Progress"}</div>
    <div className="grid grid-cols-3 gap-3 p-4 rounded-[26px] mb-5" style={{background:C.glass,border:`1px solid ${C.border}`}}>
      <Ring value={doneToday?100:pct} label={lang==="ka"?"ვარჯიში":"Workout"} sub={doneToday?"1/1":`${pct}%`} />
      <Ring value={nutritionPct} label={lang==="ka"?"კვება":"Nutrition"} sub={`${Math.round(logged)} kcal`} />
      <Ring value={waterPct} label={lang==="ka"?"წყალი":"Water"} sub={`${(water/1000).toFixed(1)} / ${(waterGoal/1000).toFixed(1)} L`} />
    </div>

    <button onClick={onPhysique} className="w-full p-4 rounded-[26px] text-left overflow-hidden relative" style={{background:"linear-gradient(135deg,rgba(76,141,255,.15),rgba(255,255,255,.035))",border:`1px solid ${C.borderStrong}`}}>
      <div className="flex items-center justify-between mb-2"><div><div className="text-[10px] uppercase tracking-widest" style={{color:C.blueBright}}>{lang==="ka"?"ფიზიკური დონე":"Physique Level"}</div><div className="disp text-2xl font-bold" style={{color:C.text}}>Level {level.level}</div></div><Award size={28} color="#FFD166"/></div>
      <div className="h-2 rounded-full" style={{background:"rgba(255,255,255,.08)"}}><div className="h-2 rounded-full forgeGlow" style={{width:level.pct+"%",background:C.blue}}/></div>
      <div className="text-[10px] mt-1" style={{color:C.steel}}>{level.xpInLevel} / {level.xpForNext} XP</div>
    </button>
  </div>;
}

/* ---------------------------------- TRAIN HOME ---------------------------------- */
function TrainHome({ t, lang, profile, weekFocus, todayIdx, todayFocus, todayExercises, doneToday, streak, progressOf, onOpenDay, onOpenMuscle, onShowGuide, onShowEquipment, onShowChat, coach }) {  const pct = Math.round(progressOf(todayExercises) * 100);
  const [showCoachWhy, setShowCoachWhy] = useState(false);
  return (
    <div>
      {!doneToday && streak > 0 && (
        <div className="mb-4 px-4 py-2.5 rounded-xl text-sm rise" style={{ background: "rgba(76,141,255,0.10)", border: `1px solid ${C.blue}`, color: C.text }}>
          {streak}-{lang === "ka" ? "დღიანი სერია — დღეს ჩაწერე სერია, რომ არ დაკარგო." : "day streak — log a set today to keep it alive."}
        </div>
      )}

      {coach && (
        <div className="mb-4 p-4 rounded-2xl rise" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
          <button onClick={() => setShowCoachWhy((s) => !s)} className="w-full text-left">
            <div className="flex items-start gap-2.5">
              <div className="shrink-0 mt-0.5" style={{ width: 26, height: 26, borderRadius: 8, background: C.blueDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={13} color={C.blueBright} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: C.blueBright }}>{t.forgeCoach}</div>
                <div className="text-[13px]" style={{ color: C.text }}>{coach.text}</div>
                {coach.why && showCoachWhy && (
                  <div className="text-[11px] mt-2 pt-2 tabular" style={{ color: C.steel, borderTop: `1px solid ${C.border}` }}>{JSON.stringify(coach.why)}</div>
                )}
                {coach.why && <div className="text-[10px] mt-1.5 font-semibold" style={{ color: C.steel }}>{t.whyThis}</div>}
              </div>
            </div>
          </button>
          <button onClick={onShowChat} className="w-full mt-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5" style={{ background: C.blueDim, color: C.blueBright }}>
            <Sparkles size={12} /> {t.chatWithCoach}
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button onClick={onShowGuide} className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm" style={{ background: C.glass, border: `1.5px solid ${C.border}`, color: C.blueBright }}>
          <Info size={14} /> {t.setupGuide}
        </button>
        <button onClick={onShowEquipment} className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm" style={{ background: C.glass, border: `1.5px solid ${C.border}`, color: C.blueBright }}>
          <Wrench size={14} /> {t.myEquipment}
        </button>
      </div>

      <div className="disp text-sm uppercase tracking-widest mb-2" style={{ color: C.steel }}>{t.thisWeek}</div>
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {weekFocus.map((f, i) => (
          <button key={i} onClick={() => f !== "rest" && onOpenDay(f)} className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl shrink-0" style={{ background: i === todayIdx ? C.blueDim : C.glass, border: `1px solid ${i === todayIdx ? C.borderStrong : C.border}`, minWidth: 56 }}>
            <span className="text-[10px] font-semibold" style={{ color: i === todayIdx ? C.blueBright : C.steel }}>{DOW[lang][i]}</span>
            <span className="text-[9px] text-center leading-tight" style={{ color: f === "rest" ? C.steel : C.text }}>{L(FOCUS_LABEL[f], lang)}</span>
          </button>
        ))}
      </div>

      <div className="rounded-3xl p-5 mb-6 rise shadow-xl" style={{ background: "radial-gradient(circle at 15% 0%, rgba(76,141,255,0.12), transparent 42%), linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))", border: `1px solid ${C.border}`, backdropFilter: "blur(28px) saturate(180%)", borderRadius: 30, boxShadow: `inset 0 1.5px 0 rgba(255,255,255,${C === C_LIGHT ? 0.5 : 0.18}), inset 0 -1px 0 rgba(0,0,0,0.08)` }}>
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: C.blueBright }}>{t.today}</div>
        {todayFocus === "rest" ? (
          <div>
            <div className="disp text-2xl font-semibold mb-1" style={{ color: C.text }}>{t.restDay}</div>
            <div className="text-sm" style={{ color: C.steel }}>{t.restDayNote}</div>
          </div>
        ) : (
          <div>
            <div className="disp text-2xl font-semibold mb-2" style={{ color: C.text }}>{L(FOCUS_LABEL[todayFocus], lang)}</div>
            <div className="h-1.5 rounded-full w-full mb-1" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-1.5 rounded-full" style={{ width: pct + "%", background: C.blue }} />
            </div>
            <div className="text-xs mb-3" style={{ color: C.steel }}>{pct}{t.todayPct}</div>
            <button onClick={() => onOpenDay(todayFocus)} className="w-full py-3 rounded-2xl disp text-base font-semibold" style={{ background: C.blue, color: "#04070E" }}>{t.startWorkout}</button>
          </div>
        )}
      </div>

      <div className="mb-3 disp text-lg font-semibold" style={{ color: C.text }}>{t.muscleLibrary}</div>
      <div className="grid grid-cols-2 gap-3">
        {MUSCLES.map((m) => (
          <button key={m} onClick={() => onOpenMuscle(m)} className="text-left p-4 rounded-2xl" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
            <div className="disp text-lg font-semibold" style={{ color: C.text }}>{L(MUSCLE_LABEL[m], lang)}</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.steel }}>{byMuscle(m).length} {lang === "ka" ? "სავარჯიშო" : "exercises"}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- EXERCISE LIST / DETAIL ---------------------------------- */
function ExerciseListView({ t, lang, sex, weightUnit, exList, getSetArray, toggleSet, state, setBest, setGoal, progressOf, finishWorkout, onDislike }) {
  const pct = Math.round(progressOf(exList) * 100);
  if (exList.length === 0) return <div className="text-sm p-4 rounded-2xl" style={{ background: C.glass, color: C.steel, border: `1.5px solid ${C.border}` }}>{t.noEquipMatch}</div>;
  return (
    <div>
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1"><div className="text-xs" style={{ color: C.steel }}>{pct}{t.todayPct}</div></div>
        <div className="h-2 rounded-full w-full" style={{ background: C.glass }}><div className="h-2 rounded-full" style={{ width: pct + "%", background: C.blue }} /></div>
      </div>
      <div className="flex flex-col gap-4">
        {exList.map((ex) => (
          <ExerciseCard key={ex.id} t={t} lang={lang} sex={sex} weightUnit={weightUnit} ex={ex} checks={getSetArray(ex.id, ex.sets)} onToggle={toggleSet(ex)}
            best={state.best[ex.id]} goal={state.goals[ex.id]} setBest={(v) => setBest(ex.id, v)} setGoal={(v) => setGoal(ex.id, v)}
            onDislike={onDislike} />
        ))}
      </div>
      <button onClick={finishWorkout} className="w-full mt-6 py-3.5 rounded-2xl disp text-base font-semibold" style={{ background: C.blue, color: "#04070E" }}>{t.markComplete}</button>
      <div className="text-center text-[11px] mt-2 mb-2" style={{ color: C.steel }}>{t.logsToward}</div>
    </div>
  );
}

function ExerciseCard({ t, lang, sex, weightUnit, ex, checks, onToggle, best, goal, setBest, setGoal, onDislike }) {
  const [showAlt, setShowAlt] = useState(false);
  const goalKg = parseFloat(goal), bestKg = parseFloat(best);
  const hasGoal = !isNaN(goalKg) && goalKg > 0;
  const meterPct = hasGoal && !isNaN(bestKg) ? Math.min(100, Math.round((bestKg / goalKg) * 100)) : 0;
  const toDisplay = (kg) => (weightUnit === "kg" ? kg : kgToLb(kg));
  const toKg = (n) => (weightUnit === "kg" ? n : lbToKg(n));
  const displayBest = !isNaN(bestKg) ? Math.round(toDisplay(bestKg) * 10) / 10 : undefined;
  const displayGoal = !isNaN(goalKg) ? Math.round(toDisplay(goalKg) * 10) / 10 : undefined;
  const allDone = checks.every(Boolean);

  return (
    <div className="p-4 rounded-2xl" style={{ background: C.glass, border: `1px solid ${allDone ? C.blue : C.border}`, backdropFilter: "blur(14px)" }}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-semibold text-[15px]" style={{ color: C.text }}>{L(ex.name, lang)}</div>
            {ex.warmup && <span className="text-[10px] uppercase px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: C.steel }}>{t.warmup}</span>}
            {ex.sex === "female" && <span className="text-[10px] uppercase px-1.5 py-0.5 rounded" style={{ background: "rgba(239,71,111,0.12)", color: "#F0839C" }}>{t.womenFocus}</span>}
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: C.steel }}>{L(ex.note, lang)}</div>
        </div>
        <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
          <div className="disp text-lg leading-none font-semibold" style={{ color: C.blueBright }}>{ex.sets}×{ex.reps}</div>
          <div className="text-[10px] flex items-center gap-1 justify-end" style={{ color: C.steel }}><Timer size={10} /> {ex.rest}s</div>
          {onDislike && (
            <button onClick={() => { vibrate(15); onDislike(ex.id); }} className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold" style={{ background: "rgba(255,255,255,0.05)", border: `1.5px solid ${C.border}`, color: C.steel }} title={t.notForMe}>
              <ThumbsDown size={10} /> {t.swap}
            </button>
          )}
        </div>
      </div>

      <ForgeExerciseVisual ex={ex} lang={lang} sex={sex} />
      <div className="text-[10px] mt-1 italic" style={{ color: C.steel, opacity: 0.7 }}>{lang === "ka" ? "ფოტო/ვიდეო არის საცნობარო ვიზუალი; ზუსტი მოძრაობის მიმართულება ნაჩვენებია ქვემოთ." : "Photo/video is a visual reference; the exact movement path is shown below."}</div>

      {ex.setup && (
        <div className="mt-2 text-[12px]" style={{ color: C.steel }}>
          <span className="font-semibold" style={{ color: C.blueBright }}>{t.setup}: </span>{L(ex.setup, lang)}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        {checks.map((done, idx) => (
          <button key={idx} onClick={() => onToggle(idx)} className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl" style={{ background: done ? "rgba(76,141,255,0.16)" : "rgba(255,255,255,0.04)", border: `1px solid ${done ? C.blue : C.border}` }}>
            {done ? <CheckCircle2 size={16} color={C.blue} /> : <Circle size={16} color={C.steel} />}
            <span className="text-[10px]" style={{ color: done ? C.blueBright : C.steel }}>{idx + 1}</span>
          </button>
        ))}
      </div>

      {!ex.warmup && (
        <div className="mt-3 pt-3" style={{ borderTop: `1.5px solid ${C.border}` }}>
          <div className="flex items-center gap-2 mb-2"><Target size={12} color={C.blue} /><span className="text-[11px] uppercase tracking-wide" style={{ color: C.steel }}>{t.goalMeter}</span></div>
          <div className="flex items-center gap-3">
            <label className="flex-1 flex items-center gap-1.5 text-[12px]" style={{ color: C.steel }}>
              {t.best} ({weightUnit})
              <NumEditor value={displayBest} onChange={(n) => setBest(toKg(n))} placeholder={weightUnit}
                style={{ background: "rgba(255,255,255,0.06)", border: `1.5px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "4px 6px", fontSize: 12 }} width={56} />
            </label>
            <label className="flex-1 flex items-center gap-1.5 text-[12px]" style={{ color: C.steel }}>
              {t.targetGoal} ({weightUnit})
              <NumEditor value={displayGoal} onChange={(n) => setGoal(toKg(n))} placeholder={weightUnit}
                style={{ background: "rgba(255,255,255,0.06)", border: `1.5px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "4px 6px", fontSize: 12 }} width={56} />
            </label>
          </div>
          {hasGoal && (
            <div className="mt-2">
              <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.06)" }}><div className="h-1.5 rounded-full" style={{ width: meterPct + "%", background: C.blue }} /></div>
              <div className="text-[11px] mt-1" style={{ color: meterPct >= 100 ? C.blueBright : C.steel }}>{meterPct >= 100 ? t.goalHit : meterPct + t.ofGoal}</div>
            </div>
          )}
        </div>
      )}

      {ex.alt && (
        <div className="mt-3 pt-3" style={{ borderTop: `1.5px solid ${C.border}` }}>
          <button onClick={() => setShowAlt((s) => !s)} className="text-[11px] uppercase tracking-wide flex items-center gap-1" style={{ color: C.blueBright }}><RefreshCw size={11} /> {t.homeAlt}</button>
          {showAlt && (
            <div className="mt-2 text-[12px]" style={{ color: C.steel }}>
              <span className="font-semibold" style={{ color: C.text }}>{L(ex.alt, lang)}</span> — {L(ex.altNote, lang)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- SETUP GUIDE ---------------------------------- */
function SetupGuide({ t, onClose }) {
  const items = [t.guide1, t.guide2, t.guide3, t.guide4, t.guide5, t.guide6];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl p-6 rise" style={{ background: C.card, border: `1.5px solid ${C.border}`, borderBottom: "none", backdropFilter: "blur(28px) saturate(180%)", borderTopLeftRadius: 32, borderTopRightRadius: 32, boxShadow: `inset 0 1.5px 0 rgba(255,255,255,${C === C_LIGHT ? 0.6 : 0.12}), 0 -20px 50px rgba(0,0,0,0.25)` }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="disp text-xl font-semibold" style={{ color: C.text }}>{t.guideTitle}</div>
          <button onClick={onClose}><X size={20} color={C.steel} /></button>
        </div>
        <div className="flex flex-col gap-3 mb-5">
          {items.map((it, i) => (
            <div key={i} className="flex gap-3">
              <div className="disp text-sm font-bold shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: C.blueDim, color: C.blueBright }}>{i + 1}</div>
              <div className="text-sm" style={{ color: C.steel }}>{it}</div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-2xl disp font-semibold" style={{ background: C.blue, color: "#04070E" }}>{t.gotIt}</button>
      </div>
    </div>
  );
}

const MEAL_VISUALS = {
  breakfast: "./meal-media/oatmeal.jpg",
  lunch: "./meal-media/chicken-rice.jpg",
  snack: "./meal-media/yogurt.jpg",
  dinner: "./meal-media/salmon.jpg",
};
function NutritionTimeline({ t, lang, plan }) {
  const order = ["breakfast","lunch","snack","dinner"];
  const times = { breakfast:"08:00", lunch:"12:30", snack:"17:00", dinner:"20:00" };
  return (
    <div className="mb-6">
      <div className="disp text-lg font-semibold mb-3" style={{color:C.text}}>{lang==="ka"?"დღის კვება":"Today's meals"}</div>
      <div className="flex flex-col gap-2">
        {order.map((key) => {
          const meal = plan && plan.meals ? plan.meals.find(m=>m.key===key) : null;
          return <div key={key} className="flex items-center gap-3 p-2.5 rounded-2xl" style={{background:C.glass,border:`1px solid ${C.border}`}}>
            <img src={MEAL_VISUALS[key]} alt={t[key]} style={{width:74,height:64,objectFit:"cover",borderRadius:14,border:`1px solid ${C.border}`}}/>
            <div className="flex-1 min-w-0">
              <div className="text-[10px]" style={{color:C.blueBright}}>{times[key]}</div>
              <div className="font-semibold text-sm" style={{color:C.text}}>{t[key]}</div>
              <div className="text-[11px] truncate" style={{color:C.steel}}>{meal ? `${Math.round(meal.totals.kcal)} kcal · ${Math.round(meal.totals.p)}g P` : (lang==="ka"?"შექმენი დღიური გეგმა":"Generate today's plan")}</div>
            </div>
            <ChevronRight size={16} color={C.steel}/>
          </div>
        })}
      </div>
    </div>
  );
}

/* ---------------------------------- NUTRITION ---------------------------------- */
function NutritionView({ t, lang, state, targets, toggleHaveFood, generateMealPlan, swapMealForGeorgianDish, todayLog, addFoodLogEntry, removeFoodLogEntry, onToast, todayCalories, applyDietCorrection, cancelDietCorrection, toggleMealLock, logMealToFoodLog }) {
  const [subTab, setSubTab] = useState("plan");
  const correction = state.dietCorrection;
  const baseKcal = targets.baseKcal || targets.kcal;
  const overage = Math.round((todayCalories ?? 0) - baseKcal);
  return (
    <div>
      <div className="rounded-3xl p-5 mb-6 shadow-xl" style={{ background: "radial-gradient(circle at 15% 0%, rgba(76,141,255,0.12), transparent 42%), linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))", border: `1px solid ${C.border}`, backdropFilter: "blur(28px) saturate(180%)", borderRadius: 30, boxShadow: `inset 0 1.5px 0 rgba(255,255,255,${C === C_LIGHT ? 0.5 : 0.18}), inset 0 -1px 0 rgba(0,0,0,0.08)` }}>
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: C.blueBright }}>{t.calorieTarget}</div>
        <div className="disp text-4xl font-bold mb-3 tabular" style={{ color: C.text }}>{targets.kcal} <span className="text-base font-normal" style={{ color: C.steel }}>kcal</span></div>
        <div className="grid grid-cols-3 gap-2">
          {[{ l: t.protein, v: targets.protein }, { l: t.carbs, v: targets.carbs }, { l: t.fat, v: targets.fat }].map((m) => (
            <div key={m.l} className="text-center p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="disp text-lg font-semibold tabular" style={{ color: C.blueBright }}>{m.v}g</div>
              <div className="text-[10px]" style={{ color: C.steel }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      <NutritionTimeline t={t} lang={lang} plan={state.mealPlan} />

      {correction ? (
        <div className="mb-5 px-4 py-3 rounded-xl text-xs" style={{ background: C.warningDim, border: `1px solid ${C.warning}`, color: C.text }}>
          <div className="mb-1">{t.correctionActive.replace("{n}", correction.perDayReduction).replace("{date}", correction.endDate.slice(5)).replace("{date2}", correction.sourceDate.slice(5))}</div>
          <div className="mb-2" style={{ color: C.steel }}>{t.correctionNote}</div>
          <button onClick={cancelDietCorrection} className="text-[11px] font-semibold" style={{ color: C.warning }}>{t.cancelCorrection}</button>
        </div>
      ) : overage > 100 ? (
        <div className="mb-5 px-4 py-3 rounded-xl text-xs" style={{ background: C.warningDim, border: `1px solid ${C.warning}`, color: C.text }}>
          <div className="mb-2">{t.overateNotice.replace("{n}", overage)}</div>
          <button onClick={applyDietCorrection} className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: C.warning }}>{t.overateAction}</button>
        </div>
      ) : null}

      <div className="mb-5"><SegButton options={[{ v: "plan", l: t.mealPlanTab }, { v: "log", l: t.logFoodTab }, { v: "sauces", l: t.saucesTab }, { v: "supplements", l: t.supplementsTab }, { v: "scanner", l: t.scannerTab }]} value={subTab} onChange={setSubTab} /></div>

      {subTab === "plan"
        ? <MealPlanView t={t} lang={lang} state={state} targets={targets} toggleHaveFood={toggleHaveFood} generateMealPlan={generateMealPlan} swapMealForGeorgianDish={swapMealForGeorgianDish} onToast={onToast} />
        : subTab === "log"
        ? <LogFoodView t={t} lang={lang} targets={targets} todayLog={todayLog} addFoodLogEntry={addFoodLogEntry} removeFoodLogEntry={removeFoodLogEntry} />
        : subTab === "sauces"
        ? <SaucesView t={t} lang={lang} />
        : subTab === "scanner"
        ? <FoodScanner t={t} lang={lang} addFoodLogEntry={addFoodLogEntry} />
        : <SupplementsView t={t} lang={lang} />}
    </div>
  );
}

function MealPlanView({ t, lang, state, targets, toggleHaveFood, generateMealPlan, swapMealForGeorgianDish, onToast }) {
  const plan = state.mealPlan;
  const hasGeorgianOnHand = FOODS.some((f) => f.cat === "georgian" && state.haveFoods[f.id]);
  return (
    <div>
      <div className="mb-3 flex items-center gap-2"><ChefHat size={16} color={C.blue} /><div className="disp text-lg font-semibold" style={{ color: C.text }}>{t.kitchenList}</div></div>
      <div className="text-xs mb-3" style={{ color: C.steel }}>{t.kitchenNote}</div>

      {FOOD_CATS.map((cat) => (
        <div key={cat} className="mb-4">
          <div className="text-[11px] uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: C.steel }}>
            {cat === "georgian" && <PartyPopper size={11} />} {t[CAT_LABEL_KEY[cat]]}
          </div>
          <div className="flex flex-wrap gap-2">
            {FOODS.filter((f) => f.cat === cat).map((f) => {
              const on = !!state.haveFoods[f.id];
              return (
                <button key={f.id} onClick={() => toggleHaveFood(f.id)} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: on ? C.blueDim : "rgba(255,255,255,0.04)", border: `1px solid ${on ? C.borderStrong : C.border}`, color: on ? C.blueBright : C.steel }}>
                  {L(f.name, lang)}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {hasGeorgianOnHand && <div className="text-xs mb-3 px-3 py-2 rounded-xl" style={{ background: "rgba(76,141,255,0.08)", color: C.blueBright }}>{t.partyHint}</div>}

      <button onClick={() => generateMealPlan(Math.floor(Math.random() * 4))} className="w-full mt-2 mb-6 py-3.5 rounded-2xl disp text-base font-semibold flex items-center justify-center gap-2" style={{ background: C.blue, color: "#04070E" }}>
        <Sparkles size={16} /> {plan ? t.regenerate : t.generatePlan}
      </button>

      {plan && (
        <div className="flex flex-col gap-3 rise">
          {plan.meals.map((m) => (
            <MealCard key={m.key} t={t} lang={lang} m={m} hasGeorgianOnHand={hasGeorgianOnHand} onSwap={() => swapMealForGeorgianDish(m.key)} />
          ))}
          <div className="p-4 rounded-2xl" style={{ background: C.blueDim, border: `1.5px solid ${C.borderStrong}` }}>
            <div className="text-[11px] uppercase tracking-wide mb-2" style={{ color: C.blueBright }}>{t.mealTotals}</div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div><div className="disp text-base font-semibold tabular" style={{ color: C.text }}>{Math.round(plan.totals.kcal)}</div><div className="text-[9px]" style={{ color: C.steel }}>kcal</div></div>
              <div><div className="disp text-base font-semibold tabular" style={{ color: C.text }}>{Math.round(plan.totals.p)}g</div><div className="text-[9px]" style={{ color: C.steel }}>{t.protein}</div></div>
              <div><div className="disp text-base font-semibold tabular" style={{ color: C.text }}>{Math.round(plan.totals.c)}g</div><div className="text-[9px]" style={{ color: C.steel }}>{t.carbs}</div></div>
              <div><div className="disp text-base font-semibold tabular" style={{ color: C.text }}>{Math.round(plan.totals.f)}g</div><div className="text-[9px]" style={{ color: C.steel }}>{t.fat}</div></div>
            </div>
          </div>
          <ShoppingListSection t={t} lang={lang} plan={plan} onToast={onToast} />
        </div>
      )}
    </div>
  );
}

function MealCard({ t, lang, m, hasGeorgianOnHand, onSwap }) {
  const [showRecipe, setShowRecipe] = useState(false);
  const isGeorgianDish = m.items.some((i) => i.cat === "georgian");
  const recipe = !isGeorgianDish ? generateRecipe(m.items, lang) : null;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
      <img src={MEAL_VISUALS[m.key] || MEAL_VISUALS.lunch} alt={t[m.key]} style={{width:"100%",height:150,objectFit:"cover",display:"block"}} />
      <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="disp text-base font-semibold" style={{ color: C.text }}>{t[m.key]}</div>
        <div className="text-xs tabular" style={{ color: C.blueBright }}>{Math.round(m.totals.kcal)} kcal</div>
      </div>
      {m.items.length === 0 ? (
        <div className="text-xs" style={{ color: C.steel }}>{t.addMoreFood}</div>
      ) : (
        <div className="flex flex-col gap-1 mb-2">
          {m.items.map((i, idx) => (
            <div key={idx} className="flex items-center justify-between text-[12px]">
              <span style={{ color: C.text }}>{L(i.name, lang)}</span>
              <span style={{ color: C.steel }}>{fmtAmount(i, i.mult, lang)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {(recipe || isGeorgianDish) && m.items.length > 0 && (
          <button onClick={() => setShowRecipe((s) => !s)} className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full" style={{ background: C.blueDim, color: C.blueBright }}>{t.viewRecipe}</button>
        )}
        {hasGeorgianOnHand && (
          <button onClick={onSwap} className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full" style={{ background: "rgba(76,141,255,0.1)", color: C.blueBright }}>{t.swapParty}</button>
        )}
      </div>

      {showRecipe && (
        <div className="mt-3 pt-3 rise" style={{ borderTop: `1.5px solid ${C.border}` }}>
          {isGeorgianDish ? (
            <div className="text-xs" style={{ color: C.steel }}>{t.georgianDishNote}</div>
          ) : recipe ? (
            <div>
              <div className="disp text-sm font-semibold mb-2" style={{ color: C.blueBright }}>{recipe.title}</div>
              <div className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: C.steel }}>{t.recipeSteps}</div>
              <ol className="flex flex-col gap-2">
                {recipe.steps.map((step, idx) => (
                  <li key={idx} className="text-[12px] flex gap-2" style={{ color: C.text }}>
                    <span className="disp font-bold shrink-0" style={{ color: C.blueBright }}>{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      )}
      </div>
    </div>
  );
}

function copyText(text) {
  // Clipboard API is often blocked silently inside sandboxed iframes (artifacts).
  // Fire it anyway in case it's permitted, but always also run the legacy
  // execCommand fallback synchronously, since that works in more sandboxes.
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch (e) {
    return false;
  }
}

function ShoppingListSection({ t, lang, plan, onToast }) {
  const map = {};
  plan.meals.forEach((m) => m.items.forEach((i) => {
    if (!map[i.id]) map[i.id] = { food: i, mult: 0 };
    map[i.id].mult += i.mult;
  }));
  const items = Object.values(map);

  function handleBuy(food, mult, store) {
    const name = L(food.name, lang);
    copyText(name);
    onToast(`${t.copied}: "${name}" → ${store.label}`);
    window.open(store.url, "_blank", "noopener,noreferrer");
  }
  function copyFullList() {
    const text = items.map((it) => `${fmtAmount(it.food, it.mult, lang)} — ${L(it.food.name, lang)}`).join("\n");
    copyText(text);
    onToast(t.copied);
  }

  return (
    <div className="mt-3 rise">
      <div className="disp text-lg font-semibold mb-1" style={{ color: C.text }}>🛒 {t.shoppingList}</div>
      <div className="text-[11px] mb-3" style={{ color: C.steel }}>{t.shopHint}</div>
      <div className="flex flex-col gap-2 mb-3">
        {items.map((it) => (
          <div key={it.food.id} className="p-3 rounded-xl" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: C.text }}>{L(it.food.name, lang)}</span>
              <span className="text-xs tabular" style={{ color: C.steel }}>{fmtAmount(it.food, it.mult, lang)}</span>
            </div>
            <div className="flex gap-2">
              {STORES.map((store) => (
                <button key={store.id} onClick={() => handleBuy(it.food, it.mult, store)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-[11px] font-semibold" style={{ background: "rgba(255,255,255,0.05)", border: `1.5px solid ${C.border}` }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: store.color, display: "inline-block" }} />
                  <span style={{ color: C.text }}>{store.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={copyFullList} className="w-full py-2.5 rounded-xl text-xs font-semibold" style={{ background: C.glass, border: `1.5px solid ${C.border}`, color: C.blueBright }}>{t.copyList}</button>
    </div>
  );
}

function LogFoodView({ t, lang, targets, todayLog, addFoodLogEntry, removeFoodLogEntry }) {
  const [foodId, setFoodId] = useState(FOODS[0].id);
  const food = FOODS.find((f) => f.id === foodId) || FOODS[0];
  const [amount, setAmount] = useState(food.amount);
  useEffect(() => { setAmount(food.amount); }, [foodId]);

  const mult = food.amount > 0 ? amount / food.amount : 0;
  const preview = { kcal: food.kcal * mult, p: food.p * mult, c: food.c * mult, f: food.f * mult };

  function handleAdd() {
    addFoodLogEntry({ id: Date.now() + Math.random(), foodId: food.id, amount, kcal: preview.kcal, p: preview.p, c: preview.c, f: preview.f });
  }

  const totals = todayLog.reduce((acc, e) => ({ kcal: acc.kcal + e.kcal, p: acc.p + e.p, c: acc.c + e.c, f: acc.f + e.f }), { kcal: 0, p: 0, c: 0, f: 0 });
  const bar = (val, target) => Math.min(100, target > 0 ? Math.round((val / target) * 100) : 0);

  return (
    <div>
      <div className="p-4 rounded-2xl mb-4 flex flex-col gap-3" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
        <Field label={t.selectFood}>
          <select value={foodId} onChange={(e) => setFoodId(e.target.value)} style={{ ...inputStyle, width: "100%" }}>
            {FOOD_CATS.map((cat) => (
              <optgroup key={cat} label={t[CAT_LABEL_KEY[cat]]}>
                {FOODS.filter((f) => f.cat === cat).map((f) => <option key={f.id} value={f.id}>{L(f.name, lang)}</option>)}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label={`${t.amountLabel} (${L(food.unit, lang)})`}>
          <NumEditor value={amount} onChange={setAmount} style={inputStyle} width="100%" />
        </Field>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div><div className="disp text-base font-semibold tabular" style={{ color: C.blueBright }}>{Math.round(preview.kcal)}</div><div className="text-[9px]" style={{ color: C.steel }}>kcal</div></div>
          <div><div className="disp text-base font-semibold tabular" style={{ color: C.blueBright }}>{Math.round(preview.p)}g</div><div className="text-[9px]" style={{ color: C.steel }}>{t.protein}</div></div>
          <div><div className="disp text-base font-semibold tabular" style={{ color: C.blueBright }}>{Math.round(preview.c)}g</div><div className="text-[9px]" style={{ color: C.steel }}>{t.carbs}</div></div>
          <div><div className="disp text-base font-semibold tabular" style={{ color: C.blueBright }}>{Math.round(preview.f)}g</div><div className="text-[9px]" style={{ color: C.steel }}>{t.fat}</div></div>
        </div>
        <button onClick={handleAdd} className="w-full py-3 rounded-2xl disp text-sm font-semibold" style={{ background: C.blue, color: "#04070E" }}>{t.addToLog}</button>
      </div>

      <div className="disp text-lg font-semibold mb-3" style={{ color: C.text }}>{t.todayLog}</div>
      {todayLog.length === 0 ? (
        <div className="text-sm p-4 rounded-2xl mb-4" style={{ background: C.glass, color: C.steel, border: `1.5px solid ${C.border}` }}>{t.noEntries}</div>
      ) : (
        <div className="flex flex-col gap-2 mb-4">
          {todayLog.map((e) => {
            const f = FOODS.find((ff) => ff.id === e.foodId);
            return (
              <div key={e.id} className="p-3 rounded-xl flex items-center justify-between" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: C.text }}>{f ? L(f.name, lang) : e.foodId}</div>
                  <div className="text-[11px]" style={{ color: C.steel }}>{Math.round(e.amount)}{f ? L(f.unit, lang) : ""} · {Math.round(e.kcal)} kcal</div>
                </div>
                <button onClick={() => removeFoodLogEntry(e.id)}><X size={16} color={C.steel} /></button>
              </div>
            );
          })}
        </div>
      )}

      <div className="p-4 rounded-2xl" style={{ background: C.blueDim, border: `1.5px solid ${C.borderStrong}` }}>
        <div className="text-[11px] uppercase tracking-wide mb-2" style={{ color: C.blueBright }}>{t.loggedTotals}</div>
        <div className="grid grid-cols-4 gap-2 text-center mb-3">
          <div><div className="disp text-base font-semibold tabular" style={{ color: C.text }}>{Math.round(totals.kcal)}</div><div className="text-[9px]" style={{ color: C.steel }}>kcal</div></div>
          <div><div className="disp text-base font-semibold tabular" style={{ color: C.text }}>{Math.round(totals.p)}g</div><div className="text-[9px]" style={{ color: C.steel }}>{t.protein}</div></div>
          <div><div className="disp text-base font-semibold tabular" style={{ color: C.text }}>{Math.round(totals.c)}g</div><div className="text-[9px]" style={{ color: C.steel }}>{t.carbs}</div></div>
          <div><div className="disp text-base font-semibold tabular" style={{ color: C.text }}>{Math.round(totals.f)}g</div><div className="text-[9px]" style={{ color: C.steel }}>{t.fat}</div></div>
        </div>
        {[{ l: "kcal", v: totals.kcal, g: targets.kcal }, { l: t.protein, v: totals.p, g: targets.protein }, { l: t.carbs, v: totals.c, g: targets.carbs }, { l: t.fat, v: totals.f, g: targets.fat }].map((row) => (
          <div key={row.l} className="mb-1.5">
            <div className="flex justify-between text-[10px] mb-0.5" style={{ color: C.steel }}><span>{row.l}</span><span>{Math.round(row.v)} / {row.g} ({bar(row.v, row.g)}% {t.ofTarget})</span></div>
            <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.08)" }}><div className="h-1.5 rounded-full" style={{ width: bar(row.v, row.g) + "%", background: C.blue }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- EQUIPMENT PICKER ---------------------------------- */
function EquipmentModal({ t, lang, profile, onSave, onClose }) {
  const [selected, setSelected] = useState(profile.equipment || EQUIPMENT.map((e) => e.id));
  function toggle(id) { setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])); }
  function selectAll() { setSelected(EQUIPMENT.map((e) => e.id)); }
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl p-6 rise" style={{ background: C.card, border: `1.5px solid ${C.border}`, borderBottom: "none", backdropFilter: "blur(28px) saturate(180%)", borderTopLeftRadius: 32, borderTopRightRadius: 32, boxShadow: `inset 0 1.5px 0 rgba(255,255,255,${C === C_LIGHT ? 0.6 : 0.12}), 0 -20px 50px rgba(0,0,0,0.25)` }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <div className="disp text-xl font-semibold flex items-center gap-2" style={{ color: C.text }}><Wrench size={18} color={C.blue} /> {t.myEquipment}</div>
          <button onClick={onClose}><X size={20} color={C.steel} /></button>
        </div>
        <div className="text-xs mb-4" style={{ color: C.steel }}>{t.equipmentIntro}</div>

        <div className="flex flex-wrap gap-2 mb-3">
          {EQUIPMENT.map((eq) => {
            const on = selected.includes(eq.id);
            return (
              <button key={eq.id} onClick={() => toggle(eq.id)} className="px-3 py-2 rounded-xl text-xs font-medium" style={{ background: on ? C.blueDim : "rgba(255,255,255,0.04)", border: `1px solid ${on ? C.borderStrong : C.border}`, color: on ? C.blueBright : C.steel }}>
                {L(eq.label, lang)}
              </button>
            );
          })}
        </div>
        <button onClick={selectAll} className="text-[11px] font-semibold mb-5" style={{ color: C.blueBright }}>{t.selectAll}</button>

        <button onClick={() => { vibrate(20); onSave(selected); }} className="w-full py-3.5 rounded-2xl disp text-base font-semibold flex items-center justify-center gap-2" style={{ background: C.blue, color: "#04070E" }}>
          <Sparkles size={16} /> {t.generateWorkout}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- FORGE COACH CHAT ---------------------------------- */
function ChatModal({ t, lang, contextText, onClose, onApplySchedule }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: t.coachGreeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const VALID_SUGGEST_KEYS = ["chest", "back", "shoulders", "arms", "legs", "rest"];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  function parseSuggestions(text) {
    const found = [];
    const cleaned = text.replace(/\[\[SUGGEST:(\w+)\]\]/g, (_, key) => {
      const k = key.toLowerCase();
      if (VALID_SUGGEST_KEYS.includes(k) && !found.includes(k)) found.push(k);
      return "";
    }).trim();
    return { cleaned, suggestions: found };
  }

  function handleApply(msgIdx, key) {
    onApplySchedule(key);
    setMessages((prev) => {
      const next = [...prev];
      next[msgIdx] = { ...next[msgIdx], suggestions: [] }; // remove buttons once used
      return [...next, { role: "assistant", content: "✓ " + t.scheduleChanged.replace("{focus}", L(FOCUS_LABEL[key], lang)) }];
    });
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    vibrate(10);
    try {
      // The API requires the message list to start with a "user" turn — the UI-only
      // greeting bubble is role "assistant", so it must be stripped before sending.
      const firstUserIdx = nextMessages.findIndex((m) => m.role === "user");
      const apiMessages = nextMessages.slice(firstUserIdx).map((m) => ({ role: m.role, content: m.content }));
      const reply = await askForgeCoach(apiMessages, contextText, lang);
      const { cleaned, suggestions } = parseSuggestions(reply || t.coachError);
      setMessages((prev) => [...prev, { role: "assistant", content: cleaned, suggestions }]);
    } catch (e) {
      console.error("Forge Coach chat error:", e);
      let msg = t.coachError;
      if (e && e.message === "TIMEOUT") {
        msg = t.coachTimeout;
      } else if (e && e.message === "RATE_LIMIT") {
        let when = "";
        if (e.resetsAt) {
          try { when = " (" + new Date(e.resetsAt).toLocaleTimeString(lang === "ka" ? "ka-GE" : "en-US", { hour: "2-digit", minute: "2-digit" }) + ")"; } catch (err) { /* ignore */ }
        }
        msg = t.coachRateLimit.replace("{when}", when);
      } else if (e && e.message) {
        msg = t.coachError + "\n\n[debug] " + e.message;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: msg, tone: "warning" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-md rise flex flex-col" style={{ height: "82vh", background: C.card, border: `1.5px solid ${C.border}`, borderBottom: "none", backdropFilter: "blur(28px) saturate(180%)", borderTopLeftRadius: 32, borderTopRightRadius: 32, boxShadow: `inset 0 1.5px 0 rgba(255,255,255,${C === C_LIGHT ? 0.6 : 0.12}), 0 -20px 50px rgba(0,0,0,0.25)` }}>
        <div className="flex items-center justify-between px-6 pt-6 pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2">
            <div style={{ width: 28, height: 28, borderRadius: 9, background: C.blueDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={14} color={C.blueBright} />
            </div>
            <div className="disp text-lg font-semibold" style={{ color: C.text }}>{t.forgeCoach}</div>
          </div>
          <button onClick={onClose}><X size={20} color={C.steel} /></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "self-end max-w-[80%]" : "self-start max-w-[85%]"}>
              <div className="px-3.5 py-2.5 rounded-2xl text-[13px] leading-snug" style={{
                background: m.role === "user" ? C.blue : m.tone === "warning" ? C.warningDim : C.glass,
                color: m.role === "user" ? "#04070E" : C.text,
                border: m.role === "user" ? "none" : `1px solid ${m.tone === "warning" ? C.warning : C.border}`,
                borderBottomRightRadius: m.role === "user" ? 4 : 18,
                borderBottomLeftRadius: m.role === "user" ? 18 : 4,
              }}>
                {m.content}
              </div>
              {m.tone === "warning" && <div className="text-[10px] mt-1 ml-1" style={{ color: C.warning }}>⚠</div>}
              {m.suggestions && m.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {m.suggestions.map((key) => (
                    <button key={key} onClick={() => handleApply(i, key)} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: C.blueDim, border: `1px solid ${C.borderStrong}`, color: C.blueBright }}>
                      {key === "rest" ? t.scheduleRestOption : t.scheduleSwitchOption.replace("{focus}", L(FOCUS_LABEL[key], lang))}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="self-start px-3.5 py-2.5 rounded-2xl text-[13px]" style={{ background: C.glass, border: `1px solid ${C.border}`, color: C.steel }}>{t.coachThinking}</div>
          )}
        </div>

        <div className="px-4 pb-2 text-[10px] text-center" style={{ color: C.steel }}>{t.coachDisclaimer}</div>
        <div className="flex items-center gap-2 px-4 pb-5 pt-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder={t.coachPlaceholder}
            style={{ ...inputStyle, flex: 1, padding: "10px 14px", fontSize: 14 }}
          />
          <button onClick={send} disabled={loading || !input.trim()} className="p-3 rounded-full" style={{ background: C.blue, opacity: loading || !input.trim() ? 0.5 : 1 }}>
            <ArrowRight size={16} color="#04070E" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- PROGRESS ---------------------------------- */
function ProgressView({ t, lang, weightUnit, sex, profile, state, streak, longest, logRecovery }) {
  const days = [];
  for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(fmtDate(d)); }
  const historySet = new Set(state.history);
  const goalEntries = Object.keys(state.goals).filter((k) => state.goals[k] !== "" && state.goals[k] !== undefined);
  const tier = tierFromStreak(streak);
  const [showRecovery, setShowRecovery] = useState(false);
  const [showScoreWhy, setShowScoreWhy] = useState(false);

  const score = computeForgeScore(state, profile);
  const level = computeLevel(state.xp);
  const challenges = computeChallenges(state);
  const today = todayStr();
  const todayRecovery = state.recoveryLog[today];

  return (
    <div>
      {/* Forge Score */}
      <button onClick={() => setShowScoreWhy((s) => !s)} className="w-full text-left rounded-3xl p-5 mb-4" style={{ background: "radial-gradient(circle at 15% 0%, rgba(76,141,255,0.12), transparent 42%), linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))", border: `1px solid ${C.border}`, backdropFilter: "blur(28px) saturate(180%)", borderRadius: 30, boxShadow: `inset 0 1.5px 0 rgba(255,255,255,${C === C_LIGHT ? 0.5 : 0.18}), inset 0 -1px 0 rgba(0,0,0,0.08)` }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: C.blueBright }}>{t.forgeScore}</div>
            <div className="disp text-5xl font-bold tabular" style={{ color: C.text }}>{score.overall == null ? "—" : score.overall}</div>
            {score.overall != null && score.delta !== 0 && (
              <div className="text-[11px] mt-1" style={{ color: score.delta > 0 ? C.blueBright : C.steel }}>{score.delta > 0 ? "+" : ""}{score.delta} {lang === "ka" ? "ამ კვირაში" : "this week"}</div>
            )}
          </div>
          <ChevronRight size={18} color={C.steel} style={{ transform: showScoreWhy ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
        </div>
        {score.overall == null && <div className="text-[11px] mt-2" style={{ color: C.steel }}>{t.notEnoughData}</div>}
        {showScoreWhy && (
          <div className="mt-4 pt-4 rise flex flex-col gap-2" style={{ borderTop: `1px solid ${C.border}` }}>
            {[["training", score.parts.training], ["consistency", score.parts.consistency], ["activityScore", score.parts.activityScore], ["nutritionScore", score.parts.nutritionScore], ["recoveryScore", score.parts.recoveryScore]].map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-[11px] mb-1" style={{ color: C.steel }}>
                  <span>{t[key]}</span><span>{val == null ? "—" : val}</span>
                </div>
                <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-1.5 rounded-full" style={{ width: (val || 0) + "%", background: val == null ? "transparent" : C.blue }} />
                </div>
              </div>
            ))}
            <div className="text-[10px] mt-1" style={{ color: C.steel }}>{t.forgeScoreNote}</div>
          </div>
        )}
      </button>

      {/* Forge Level */}
      <div className="rounded-2xl p-4 mb-6" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><Award size={16} color={C.blue} /><span className="disp text-base font-semibold" style={{ color: C.text }}>{t.forgeLevel} {level.level}</span></div>
          <span className="text-[11px] tabular" style={{ color: C.steel }}>{level.xpInLevel} / {level.xpForNext} {t.xpLabel}</span>
        </div>
        <div className="h-2 rounded-full w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-2 rounded-full" style={{ width: level.pct + "%", background: C.blue }} />
        </div>
      </div>

      {/* Physique avatar + ranks */}
      {(() => { const pp = physiqueProgress(state, streak); return <div className="mb-6"><div className="liquidHero p-5 flex items-center gap-4" style={{ background: "radial-gradient(circle at 15% 0%, rgba(76,141,255,0.12), transparent 42%), linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))", border: `1px solid ${C.border}`, backdropFilter: "blur(28px) saturate(180%)", borderRadius: 30, boxShadow: `inset 0 1.5px 0 rgba(255,255,255,${C === C_LIGHT ? 0.5 : 0.18}), inset 0 -1px 0 rgba(0,0,0,0.08)` }}>
        <div className="shrink-0 overflow-hidden rounded-2xl" style={{width:104,height:138,border:`1px solid ${C.borderStrong}`,background:C.card}}>
          <img src={sex==="female"?"./profile-media/female-front.jpg":"./profile-media/male-front.jpg"} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: C.blueBright }}>{t.physique}</div>
          <div className="disp text-xl font-bold mb-1" style={{ color: C.text }}>{t[TIER_LABEL_KEYS[tier]]}</div>
          <div className="text-[11px]" style={{ color: C.steel }}>{t.physiqueNote}</div>
        </div>
      </div><div className="liquidCard p-4 mt-3"><div className="flex justify-between items-end mb-2"><div><div className="text-[10px] uppercase tracking-widest" style={{color:C.steel}}>{t.rank}</div><div className="disp text-xl font-bold" style={{color:C.text}}>{pp.current.key}</div></div><div className="text-xs" style={{color:C.blueBright}}>{pp.next ? `${pp.next.min-(state.xp||0)} XP → ${pp.next.key}` : "MAX"}</div></div><div className="h-2 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,.07)"}}><div className="h-full rounded-full forgeGlow" style={{width:pp.pct+"%",background:C.blue}}/></div><div className="text-[10px] uppercase tracking-widest mt-4 mb-2" style={{color:C.steel}}>{t.badges}</div><div className="grid grid-cols-3 gap-2">{pp.badges.map((b,i)=><div key={i} className="glassInset p-2 text-center" style={{opacity:b.on?1:.35,filter:b.on?"none":"grayscale(1)"}}><div className="text-xl">{b.icon}</div><div className="text-[9px] mt-1" style={{color:b.on?C.text:C.steel}}>{lang==="ka"?b.ka:b.en}</div></div>)}</div></div></div> })()}

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-2xl" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
          <Flame size={18} color={C.blue} fill={C.blue} />
          <div className="disp text-3xl mt-1 font-bold tabular" style={{ color: C.blueBright }}>{streak}</div>
          <div className="text-[11px] uppercase tracking-wide" style={{ color: C.steel }}>{t.currentStreak}</div>
        </div>
        <div className="p-4 rounded-2xl" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
          <Award size={18} color={C.blue} />
          <div className="disp text-3xl mt-1 font-bold tabular" style={{ color: C.blueBright }}>{longest}</div>
          <div className="text-[11px] uppercase tracking-wide" style={{ color: C.steel }}>{t.longestStreak}</div>
        </div>
      </div>

      {/* Forge Challenges */}
      <div className="disp text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: C.text }}><Award size={16} color={C.blue} /> {t.forgeChallenges}</div>
      <div className="flex flex-col gap-2 mb-6">
        {challenges.map((c) => {
          const pct = Math.min(100, Math.round((c.progress / c.target) * 100));
          const done = c.progress >= c.target;
          return (
            <div key={c.id} className="p-3 rounded-xl" style={{ background: done ? C.successDim : C.glass, border: `1.5px solid ${done ? C.successBorder : C.border}` }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold" style={{ color: C.text }}>{t[c.titleKey]}</span>
                <span className="text-[11px] tabular" style={{ color: done ? C.success : C.steel }}>{done && "✓ "}{c.progress}/{c.target}</span>
              </div>
              <div className="text-[11px] mb-2" style={{ color: C.steel }}>{t[c.descKey]}</div>
              <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-1.5 rounded-full" style={{ width: pct + "%", background: done ? C.success : C.blue }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Forge Recovery */}
      <div className="disp text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: C.text }}><Droplet size={16} color={C.blue} /> {t.forgeRecovery}</div>
      <button onClick={() => setShowRecovery((s) => !s)} className="w-full text-left p-4 rounded-2xl mb-6" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
        {todayRecovery ? (
          <div className="flex items-center justify-between">
            <div className="text-sm" style={{ color: C.text }}>{lang === "ka" ? "დღეს ჩაწერილია" : "Logged for today"}</div>
            <ChevronRight size={16} color={C.steel} style={{ transform: showRecovery ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold" style={{ color: C.blueBright }}>{t.logRecoveryBtn}</div>
            <ChevronRight size={16} color={C.steel} style={{ transform: showRecovery ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
          </div>
        )}
      </button>
      {showRecovery && <RecoveryForm t={t} lang={lang} existing={todayRecovery} onSubmit={(entry) => { logRecovery(entry); setShowRecovery(false); }} />}

      <div className="disp text-lg font-semibold mb-3" style={{ color: C.text }}>{t.last14}</div>
      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((d) => (
          <div key={d} className="aspect-square rounded-lg flex items-center justify-center" style={{ background: historySet.has(d) ? C.blue : "rgba(255,255,255,0.04)", border: `1px solid ${historySet.has(d) ? C.blue : C.border}` }}>
            <span className="text-[10px] font-semibold" style={{ color: historySet.has(d) ? "#04070E" : C.steel }}>{parseInt(d.slice(8), 10)}</span>
          </div>
        ))}
      </div>

      <div className="disp text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: C.text }}><TrendingUp size={16} color={C.blue} /> {t.goalsSet}</div>
      {goalEntries.length === 0 ? (
        <div className="text-center p-6 rounded-2xl" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
          <EmptyStateArt />
          <div className="text-sm mt-3" style={{ color: C.steel }}>{t.noGoals}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {EXDB.filter((ex) => goalEntries.includes(ex.id)).map((ex) => {
            const goalKg = parseFloat(state.goals[ex.id]); const bestKg = parseFloat(state.best[ex.id]);
            const pct = !isNaN(bestKg) && goalKg > 0 ? Math.min(100, Math.round((bestKg / goalKg) * 100)) : 0;
            const toDisp = (kg) => Math.round((weightUnit === "kg" ? kg : kgToLb(kg)) * 10) / 10;
            return (
              <div key={ex.id} className="p-3 rounded-xl flex items-center justify-between" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: C.text }}>{L(ex.name, lang)}</div>
                  <div className="text-[11px]" style={{ color: C.steel }}>{isNaN(bestKg) ? "—" : toDisp(bestKg)} / {toDisp(goalKg)} {weightUnit}</div>
                </div>
                <div className="disp text-xl font-semibold" style={{ color: C.blueBright }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecoveryForm({ t, lang, existing, onSubmit }) {
  const [sleep, setSleep] = useState(existing?.sleep ?? 7);
  const [sleepQuality, setSleepQuality] = useState(existing?.sleepQuality ?? 3);
  const [fatigue, setFatigue] = useState(existing?.fatigue ?? 2);
  const [stress, setStress] = useState(existing?.stress ?? 2);
  const scale = [1, 2, 3, 4, 5];
  const ScaleRow = ({ label, value, onChange }) => (
    <div className="mb-3">
      <div className="flex justify-between text-[12px] mb-1.5" style={{ color: C.steel }}><span>{label}</span><span>{t.low} → {t.high}</span></div>
      <div className="flex gap-1.5">
        {scale.map((n) => (
          <button key={n} onClick={() => onChange(n)} className="flex-1 py-2 rounded-lg text-xs font-semibold" style={{ background: value === n ? C.blueDim : "rgba(255,255,255,0.04)", border: `1px solid ${value === n ? C.borderStrong : C.border}`, color: value === n ? C.blueBright : C.steel }}>{n}</button>
        ))}
      </div>
    </div>
  );
  return (
    <div className="p-4 rounded-2xl mb-6 rise" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
      <Field label={t.sleepHours}><NumEditor value={sleep} onChange={setSleep} style={inputStyle} width="100%" /></Field>
      <div className="h-3" />
      <ScaleRow label={t.sleepQuality} value={sleepQuality} onChange={setSleepQuality} />
      <ScaleRow label={t.fatigueLevel} value={fatigue} onChange={setFatigue} />
      <ScaleRow label={t.stressLevel} value={stress} onChange={setStress} />
      <button onClick={() => onSubmit({ sleep, sleepQuality, fatigue, stress })} className="w-full py-3 rounded-2xl disp text-sm font-semibold mt-1" style={{ background: C.blue, color: "#04070E" }}>{t.logRecoveryBtn}</button>
    </div>
  );
}

/* ---------------------------------- PROFILE ---------------------------------- */
function ProfileView({ t, lang, draftProfile, setDraftProfile, onSave, setLang, setTheme, onShowEquipment, onOpenCardio, dislikedIds, onRestore }) {
  const p = draftProfile;
  const set = (k, v) => setDraftProfile((d) => ({ ...d, [k]: v }));
  const ftin = cmToFtIn(p.heightCm);
  return (
    <div className="flex flex-col gap-4">
      {onOpenCardio && <button onClick={onOpenCardio} className="p-4 rounded-2xl flex items-center justify-between" style={{background:"linear-gradient(135deg,rgba(76,141,255,.14),rgba(255,255,255,.035))",border:`1px solid ${C.borderStrong}`}}><div className="flex items-center gap-3"><Gauge size={20} color={C.blueBright}/><div className="text-left"><div className="font-semibold" style={{color:C.text}}>{t.navCardio}</div><div className="text-[11px]" style={{color:C.steel}}>{lang==="ka"?"კარდიო, წყალი და სესიის ჟურნალი":"Cardio, hydration and session log"}</div></div></div><ChevronRight size={16} color={C.steel}/></button>}
      <div className="p-4 rounded-2xl flex items-center justify-between" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
        <div className="flex items-center gap-2"><Globe size={16} color={C.blue} /><span className="text-sm font-semibold" style={{ color: C.text }}>{t.language}</span></div>
        <SegButton options={[{ v: "en", l: "English" }, { v: "ka", l: "ქართული" }]} value={p.lang} onChange={setLang} />
      </div>

      <div className="p-4 rounded-2xl flex items-center justify-between" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
        <div className="flex items-center gap-2">
          {p.theme === "light" ? <Sun size={16} color={C.blue} /> : <Moon size={16} color={C.blue} />}
          <span className="text-sm font-semibold" style={{ color: C.text }}>{t.theme}</span>
        </div>
        <SegButton options={[{ v: "dark", l: t.themeDark }, { v: "light", l: t.themeLight }]} value={p.theme} onChange={setTheme} />
      </div>

      <button onClick={onShowEquipment} className="p-4 rounded-2xl flex items-center justify-between" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
        <div className="flex items-center gap-2"><Wrench size={16} color={C.blue} /><span className="text-sm font-semibold" style={{ color: C.text }}>{t.myEquipment}</span></div>
        <ChevronRight size={16} color={C.steel} />
      </button>

      {dislikedIds && dislikedIds.length > 0 && (
        <div className="p-4 rounded-2xl" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
          <div className="flex items-center gap-2 mb-3"><ThumbsDown size={16} color={C.blue} /><span className="text-sm font-semibold" style={{ color: C.text }}>{t.dislikedTitle}</span></div>
          <div className="flex flex-col gap-2">
            {EXDB.filter((ex) => dislikedIds.includes(ex.id)).map((ex) => (
              <div key={ex.id} className="flex items-center justify-between text-xs">
                <span style={{ color: C.text }}>{L(ex.name, lang)}</span>
                <button onClick={() => onRestore(ex.id)} className="font-semibold px-2 py-1 rounded-full" style={{ background: C.blueDim, color: C.blueBright }}>{t.restore}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-5 rounded-2xl flex flex-col gap-4" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
        <div className="disp text-lg font-semibold" style={{ color: C.text }}>{t.editProfile}</div>
        <Field label={t.name}><input value={p.name} onChange={(e) => set("name", e.target.value)} style={{ ...inputStyle, width: "100%" }} /></Field>
        <Field label={t.sex}><SegButton options={[{ v: "male", l: t.male }, { v: "female", l: t.female }]} value={p.sex} onChange={(v) => set("sex", v)} /></Field>
        <Field label={t.age}><NumEditor value={p.age} onChange={(n) => set("age", n)} style={{ ...inputStyle, width: 100 }} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={`${t.weight} (${p.weightUnit})`}>
            <div className="flex gap-1">
              <NumEditor value={p.weightUnit === "kg" ? Math.round(p.weightKg * 10) / 10 : Math.round(kgToLb(p.weightKg) * 10) / 10} onChange={(n) => set("weightKg", p.weightUnit === "kg" ? n : lbToKg(n))} style={inputStyle} width="100%" />
              <button onClick={() => set("weightUnit", p.weightUnit === "kg" ? "lb" : "kg")} className="px-2 rounded-lg text-xs font-semibold shrink-0" style={{ background: C.blueDim, color: C.blueBright }}>{p.weightUnit}</button>
            </div>
          </Field>
          <Field label={t.height}>
            {p.heightUnit === "cm" ? (
              <div className="flex gap-1">
                <NumEditor value={Math.round(p.heightCm)} onChange={(n) => set("heightCm", n)} style={inputStyle} width="100%" />
                <button onClick={() => set("heightUnit", "ftin")} className="px-2 rounded-lg text-xs font-semibold shrink-0" style={{ background: C.blueDim, color: C.blueBright }}>cm</button>
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <NumEditor value={ftin.ft} onChange={(n) => set("heightCm", ftInToCm(n, ftin.inch))} style={inputStyle} width={40} />
                <span className="text-xs" style={{ color: C.steel }}>ft</span>
                <NumEditor value={ftin.inch} onChange={(n) => set("heightCm", ftInToCm(ftin.ft, n))} style={inputStyle} width={40} />
                <span className="text-xs" style={{ color: C.steel }}>in</span>
                <button onClick={() => set("heightUnit", "cm")} className="px-2 py-1.5 rounded-lg text-xs font-semibold ml-auto shrink-0" style={{ background: C.blueDim, color: C.blueBright }}>cm</button>
              </div>
            )}
          </Field>
        </div>
        <Field label={t.goal}><SegButton options={[{ v: "lose", l: t.lose }, { v: "maintain", l: t.maintain }, { v: "gain", l: t.gain }]} value={p.goal} onChange={(v) => set("goal", v)} vertical /></Field>
        <Field label={t.activity}>
          <select value={p.activity} onChange={(e) => set("activity", e.target.value)} style={{ ...inputStyle, width: "100%" }}>
            <option value="sedentary">{t.sedentary}</option><option value="light">{t.light}</option><option value="moderate">{t.moderate}</option><option value="active">{t.active}</option><option value="veryActive">{t.veryActive}</option>
          </select>
        </Field>
        <Field label={t.split}><SegButton options={Object.keys(SPLIT_LABEL).map((v) => ({ v, l: L(SPLIT_LABEL[v], lang) }))} value={p.split} onChange={(v) => set("split", v)} vertical /></Field>
        <Field label={t.daysPerWeek}><SegButton options={[3, 4, 5, 6].map((n) => ({ v: n, l: String(n) }))} value={p.daysPerWeek} onChange={(v) => set("daysPerWeek", Number(v))} /></Field>
        <Field label={t.emphasis}>
          <select value={p.emphasis} onChange={(e) => set("emphasis", e.target.value)} style={{ ...inputStyle, width: "100%" }}>
            <option value="">{t.none}</option>
            {MUSCLES.map((m) => <option key={m} value={m}>{L(MUSCLE_LABEL[m], lang)}</option>)}
          </select>
        </Field>
        <button onClick={onSave} className="w-full py-3 rounded-2xl disp font-semibold mt-1" style={{ background: C.blue, color: "#04070E" }}>{t.save}</button>
      </div>
    </div>
  );
}

/* ---------------------------------- SAUCES & EXTRAS ---------------------------------- */
const SAUCES = [
  {
    id: "yogurt-garlic",
    title: { en: "Garlic-Herb Yogurt Sauce", ka: "ნიორ-მწვანილის სოუსი მაწონისგან" },
    bestWith: { en: "Air fryer fries, roasted veg, grilled chicken", ka: "საჰაერო ფრიტიურის კარტოფილი, შემწვარი ბოსტნეული, შემწვარი ქათამი" },
    ingredients: [
      { en: "200g Greek yogurt", ka: "200გ ბერძნული იოგურტი" },
      { en: "1 clove garlic, grated", ka: "1 კბილი ნიორი, გახეხილი" },
      { en: "1 tbsp olive oil", ka: "1 სუფრის კოვზი ზეითუნის ზეთი" },
      { en: "1 tsp lemon juice", ka: "1 ჩაის კოვზი ლიმონის წვენი" },
      { en: "1 tsp fresh dill, chopped", ka: "1 ჩაის კოვზი ახალი კამა, დაკეპილი" },
      { en: "1/2 tsp smoked paprika", ka: "1/2 ჩაის კოვზი შებოლილი პაპრიკა" },
      { en: "Salt & cracked black pepper", ka: "მარილი და დაფქული პილპილი" },
    ],
    steps: [
      { en: "Whisk the yogurt with olive oil and lemon juice until smooth.", ka: "აქერცლე იოგურტი ზეითუნის ზეთსა და ლიმონის წვენთან ერთად გლუვ მასამდე." },
      { en: "Stir in the grated garlic, dill, and smoked paprika.", ka: "ჩაურიე გახეხილი ნიორი, კამა და შებოლილი პაპრიკა." },
      { en: "Season with salt and pepper, rest 10 minutes so the garlic mellows before serving.", ka: "დაამარილე და დაპილპილე, დატოვე 10 წუთი, რომ ნიორმა გემო დაიდოს, სანამ მიართმევ." },
    ],
  },
  {
    id: "adjika-yogurt",
    title: { en: "Spicy Adjika Yogurt Dip", ka: "ცხარე აჯიკა-იოგურტის სოუსი" },
    bestWith: { en: "Khinkali, grilled meat, roasted potatoes", ka: "ხინკალი, შემწვარი ხორცი, შემწვარი კარტოფილი" },
    ingredients: [
      { en: "150g Greek yogurt", ka: "150გ ბერძნული იოგურტი" },
      { en: "1 tsp adjika", ka: "1 ჩაის კოვზი აჯიკა" },
      { en: "1/2 clove garlic, grated", ka: "1/2 კბილი ნიორი, გახეხილი" },
      { en: "1 tsp fresh cilantro, chopped", ka: "1 ჩაის კოვზი ახალი ქინძი, დაკეპილი" },
      { en: "A pinch of salt", ka: "მარილის ნატამალი" },
    ],
    steps: [
      { en: "Stir the adjika into the yogurt a little at a time, tasting as you go — adjika varies a lot in heat.", ka: "ჩაურიე აჯიკა იოგურტში ცოტ-ცოტად, გაასინჯე გზაში — აჯიკის სიცხარე ძალიან განსხვავდება." },
      { en: "Add the garlic and cilantro, mix well.", ka: "დაამატე ნიორი და ქინძი, კარგად აურიე." },
      { en: "Season with salt and chill 10 minutes before serving.", ka: "დაამარილე და გააგრილე 10 წუთი მიტანამდე." },    ],
  },
  {
    id: "tkemali-drizzle",
    title: { en: "Tkemali Herb Drizzle", ka: "ტყემლის მწვანილის სოუსი" },
    bestWith: { en: "Grilled meat, mtsvadi, roasted vegetables", ka: "შემწვარი ხორცი, მწვადი, შემწვარი ბოსტნეული" },
    ingredients: [
      { en: "3 tbsp tkemali sauce", ka: "3 სუფრის კოვზი ტყემალი" },
      { en: "1 tbsp olive oil", ka: "1 სუფრის კოვზი ზეითუნის ზეთი" },
      { en: "1 tsp fresh coriander, chopped", ka: "1 ჩაის კოვზი ახალი ქინძი, დაკეპილი" },
      { en: "1 small clove garlic, grated", ka: "1 პატარა კბილი ნიორი, გახეხილი" },
      { en: "A splash of water to thin", ka: "ცოტა წყალი გასათხელებლად" },
    ],
    steps: [
      { en: "Whisk the tkemali with olive oil and a splash of water until pourable.", ka: "აქერცლე ტყემალი ზეითუნის ზეთსა და ცოტა წყალთან ერთად ჩამოსასხმელ კონსისტენციამდე." },
      { en: "Stir in the garlic and coriander.", ka: "ჩაურიე ნიორი და ქინძი." },
      { en: "Drizzle warm over grilled meat right before serving.", ka: "ასხურე თბილ, შემწვარ ხორცს მიტანის წინ." },
    ],
  },
  {
    id: "honey-mustard-yogurt",
    title: { en: "Honey-Mustard Yogurt Dip", ka: "თაფლ-მდოგვის სოუსი იოგურტისგან" },
    bestWith: { en: "Chicken tenders, roasted veg, pretzels", ka: "შემწვარი ქათმის ზოლები, შემწვარი ბოსტნეული, პრეცელი" },
    ingredients: [
      { en: "150g Greek yogurt", ka: "150გ ბერძნული იოგურტი" },
      { en: "1 tsp honey", ka: "1 ჩაის კოვზი თაფლი" },
      { en: "1 tsp Dijon mustard", ka: "1 ჩაის კოვზი დიჟონის მდოგვი" },
      { en: "1/2 tsp lemon juice", ka: "1/2 ჩაის კოვზი ლიმონის წვენი" },
      { en: "Cracked black pepper", ka: "დაფქული პილპილი" },
    ],
    steps: [
      { en: "Whisk everything together until smooth.", ka: "ყველაფერი ერთად აქერცლე გლუვ მასამდე." },
      { en: "Taste and adjust — more honey for sweeter, more mustard for sharper.", ka: "გაასინჯე და მოარგე — მეტი თაფლი ტკბილისთვის, მეტი მდოგვი სიმკვეთრისთვის." },
      { en: "Chill 15 minutes before serving for the flavors to settle.", ka: "გააგრილე 15 წუთი მიტანამდე, რომ გემო დაილექოს." },
    ],
  },
  {
    id: "walnut-garlic-bazhe",
    title: { en: "Georgian Walnut-Garlic Sauce (Bazhe-Style)", ka: "ნიგოზ-ნიორის სოუსი (ბაჟისებრი)" },
    bestWith: { en: "Chicken, fish, steamed vegetables", ka: "ქათამი, თევზი, ორთქლზე მოხარშული ბოსტნეული" },
    ingredients: [
      { en: "60g walnuts, finely ground", ka: "60გ ნიგოზი, წვრილად დაფქული" },
      { en: "1 clove garlic", ka: "1 კბილი ნიორი" },
      { en: "1 tsp white wine vinegar", ka: "1 ჩაის კოვზი თეთრი ღვინის ძმარი" },
      { en: "1/4 tsp ground coriander", ka: "1/4 ჩაის კოვზი დაფქული ქინძი" },
      { en: "Warm water to loosen", ka: "თბილი წყალი გასათხელებლად" },
      { en: "Salt to taste", ka: "მარილი გემოვნებით" },
    ],
    steps: [
      { en: "Grind the walnuts and garlic together into a rough paste.", ka: "დაფქვი ნიგოზი და ნიორი ერთად უხეშ პასტამდე." },
      { en: "Whisk in the vinegar and coriander, then add warm water a little at a time until it's a pourable sauce.", ka: "ჩაურიე ძმარი და ქინძი, შემდეგ ცოტ-ცოტად დაამატე თბილი წყალი ჩამოსასხმელ კონსისტენციამდე." },
      { en: "Season with salt, spoon generously over warm chicken or vegetables.", ka: "დაამარილე და გულუხვად დაასხი თბილ ქათამს ან ბოსტნეულს." },
    ],
  },
];
function SaucesView({ t, lang }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="flex flex-col gap-3">
      {SAUCES.map((s) => {
        const isOpen = open === s.id;
        return (
          <div key={s.id} className="rounded-2xl overflow-hidden" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
            <button onClick={() => setOpen(isOpen ? null : s.id)} className="w-full text-left p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[15px]" style={{ color: C.text }}>{L(s.title, lang)}</div>
                <div className="text-[11px] mt-0.5" style={{ color: C.steel }}>{t.bestWith}: {L(s.bestWith, lang)}</div>
              </div>
              <ChevronRight size={16} color={C.steel} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 rise" style={{ borderTop: `1.5px solid ${C.border}` }}>
                <div className="text-[11px] uppercase tracking-wide mt-3 mb-1.5" style={{ color: C.steel }}>{t.ingredients}</div>
                <ul className="flex flex-col gap-1 mb-3">
                  {s.ingredients.map((ing, idx) => (
                    <li key={idx} className="text-[12px] flex gap-2" style={{ color: C.text }}>
                      <span style={{ color: C.blueBright }}>•</span>{L(ing, lang)}
                    </li>
                  ))}
                </ul>
                <div className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: C.steel }}>{t.instructions}</div>
                <ol className="flex flex-col gap-2">
                  {s.steps.map((step, idx) => (
                    <li key={idx} className="text-[12px] flex gap-2" style={{ color: C.text }}>
                      <span className="disp font-bold shrink-0" style={{ color: C.blueBright }}>{idx + 1}.</span>
                      <span>{L(step, lang)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------- SUPPLEMENTS ---------------------------------- */
// General educational info, grounded in the same goal categories Georgian retailers like
// vitamini.ge organize by (strength, lean muscle, energy, weight loss/gain, heart health, etc).
// Not brand/product-specific — dosing follows common label guidance, not any one SKU.
const SUPPLEMENTS = [
  {
    id: "creatine",
    url: "https://vitamini.ge/ge/product-category/37-kreatin-monohidrati",
    name: { en: "Creatine Monohydrate", ka: "კრეატინ მონოჰიდრატი" },
    goal: { en: "Strength & Muscle Growth", ka: "ძალა და კუნთის მასა" },
    benefits: [
      { en: "Increases strength and power output over time", ka: "ზრდის ძალასა და სიმძლავრეს დროთა განმავლობაში" },
      { en: "Helps build lean muscle mass when combined with training", ka: "ხელს უწყობს მშრალი კუნთოვანი მასის ზრდას ვარჯიშთან ერთად" },
      { en: "Speeds up recovery between sets and sessions", ka: "აჩქარებს აღდგენას სეტებსა და ვარჯიშებს შორის" },
      { en: "One of the most researched, safest supplements available", ka: "ერთ-ერთი ყველაზე შესწავლილი და უსაფრთხო დანამატია" },
    ],
    dose: { en: "3-5g daily, any time of day — no need to \"load,\" consistency matters more than timing.", ka: "3-5გ დღეში, დღის ნებისმიერ დროს — \"დატვირთვა\" საჭირო არ არის, მთავარია რეგულარულობა." },
    cautions: { en: "Drink plenty of water while using it. Skip if you have kidney issues, and check with a doctor if pregnant, breastfeeding, or under 18.", ka: "მიღების პერიოდში დალიე ბევრი წყალი. თავი აარიდე თირკმლის პრობლემების შემთხვევაში, უკონსულტირდი ექიმს ორსულობის, ლაქტაციის ან 18 წლამდე ასაკის დროს." },
  },
  {
    id: "whey",
    url: "https://vitamini.ge/ge/product-category/7-proteini",
    name: { en: "Whey Protein", ka: "ვეი პროტეინი" },
    goal: { en: "Muscle Recovery & Growth", ka: "კუნთის აღდგენა და ზრდა" },
    benefits: [
      { en: "Convenient way to hit daily protein targets", ka: "მარტივი გზა დღიური ცილის მიზნის მისაღწევად" },
      { en: "Fast-digesting, ideal right after training", ka: "სწრაფად შეისრობა, იდეალურია ვარჯიშის შემდეგ" },
      { en: "Complete amino acid profile supports muscle repair", ka: "სრული ამინომჟავური შემადგენლობა ხელს უწყობს კუნთის აღდგენას" },
    ],
    dose: { en: "20-40g per serving, 1-2 times daily depending on your protein needs.", ka: "20-40გ ერთ ულუფაზე, დღეში 1-2-ჯერ, ცილის საჭიროებიდან გამომდინარე." },
    cautions: { en: "Choose an isolate if lactose sensitive. It's a top-up, not a substitute for whole-food protein.", ka: "ლაქტოზასთან მგრძნობელობის შემთხვევაში აირჩიე იზოლატი. ეს დანამატია, არა სრულფასოვანი საკვების შემცვლელი." },
  },
  {
    id: "casein",
    url: "https://vitamini.ge/ge/product-category/43-kazeini",
    name: { en: "Casein Protein", ka: "კაზეინის პროტეინი" },
    goal: { en: "Overnight Recovery", ka: "ღამის აღდგენა" },
    benefits: [
      { en: "Slow-digesting, feeds muscles steadily over hours", ka: "ნელა შეისრობა, კუნთებს საათების განმავლობაში კვებავს" },
      { en: "Good before bed to support overnight recovery", ka: "კარგი არჩევანია ძილის წინ ღამის აღდგენისთვის" },
      { en: "Helps curb late-night hunger", ka: "ხელს უწყობს გვიან საღამოს შიმშილის შემცირებას" },
    ],
    dose: { en: "20-30g before bed.", ka: "20-30გ ძილის წინ." },
    cautions: { en: "Contains dairy — skip if lactose intolerant or dairy-allergic.", ka: "შეიცავს რძის პროდუქტს — თავი აარიდე ლაქტოზასთან შეუწყნარებლობის ან რძის ალერგიის შემთხვევაში." },
  },
  {
    id: "arginine",
    url: "https://vitamini.ge/ge/product-category/3-l-arginine-l-citrulline",
    name: { en: "L-Arginine", ka: "L-არგინინი" },
    goal: { en: "Blood Flow & Pump", ka: "სისხლის მიმოქცევა და პამპი" },
    benefits: [
      { en: "Precursor to nitric oxide, may support blood flow to muscles", ka: "აზოტის ოქსიდის წინამორბედია, შესაძლოა ხელი შეუწყოს კუნთებში სისხლის მიმოქცევას" },
      { en: "Some users notice a stronger \"pump\" during training", ka: "ზოგი მომხმარებელი გრძნობს უფრო გამოხატულ \"პამპს\" ვარჯიშისას" },
      { en: "Evidence for direct strength/muscle gains is weaker than for creatine", ka: "პირდაპირი ძალის/კუნთის ზრდის მტკიცებულება უფრო სუსტია, ვიდრე კრეატინთან" },
    ],
    dose: { en: "3-6g, 30-45 minutes before training.", ka: "3-6გ, ვარჯიშამდე 30-45 წუთით ადრე." },
    cautions: { en: "Can interact with blood pressure medication and nitrate drugs — don't combine without medical advice. High doses may upset the stomach.", ka: "შესაძლოა ურთიერთქმედება ჰქონდეს წნევის საწინააღმდეგო წამლებთან და ნიტრატებთან — არ გამოიყენო ერთად ექიმის რჩევის გარეშე. მაღალმა დოზამ შესაძლოა გამოიწვიოს კუჭის დისკომფორტი." },
  },
  {
    id: "citrulline",
    url: "https://vitamini.ge/ge/product-category/3-l-arginine-l-citrulline",
    name: { en: "Citrulline Malate", ka: "ციტრულინ მალატი" },
    goal: { en: "Endurance & Pump", ka: "გამძლეობა და პამპი" },
    benefits: [
      { en: "Often more effective than L-arginine at raising nitric oxide (better absorbed)", ka: "ხშირად უფრო ეფექტურია L-არგინინზე აზოტის ოქსიდის გაზრდაში (უკეთ შეისრობა)" },
      { en: "May reduce muscle soreness after training", ka: "შესაძლოა შეამციროს კუნთის ტკივილი ვარჯიშის შემდეგ" },
      { en: "Can help push a few extra reps in higher-rep sets", ka: "შეუძლია დაეხმაროს რამდენიმე დამატებითი გამეორების გაკეთებაში" },
    ],
    dose: { en: "6-8g, 30-40 minutes pre-workout.", ka: "6-8გ, ვარჯიშამდე 30-40 წუთით ადრე." },
    cautions: { en: "Generally well tolerated; high doses can cause mild stomach discomfort.", ka: "ჩვეულებრივ კარგად აიტანება; მაღალმა დოზამ შესაძლოა გამოიწვიოს მსუბუქი კუჭის დისკომფორტი." },
  },
  {
    id: "bcaa",
    url: "https://vitamini.ge/ge/product-category/2-bcaa",
    name: { en: "BCAAs", ka: "BCAA ამინომჟავები" },
    goal: { en: "Muscle Recovery", ka: "კუნთის აღდგენა" },
    benefits: [
      { en: "May reduce muscle soreness and fatigue during training", ka: "შესაძლოა შეამციროს კუნთის ტკივილი და დაღლილობა ვარჯიშისას" },
      { en: "Useful for fasted training to limit muscle breakdown", ka: "სასარგებლოა უზმოზე ვარჯიშისას კუნთის დაშლის შესაზღუდად" },
      { en: "Largely redundant if you already get enough protein from food or whey", ka: "დიდწილად ზედმეტია, თუ საკმარის ცილას საკვებით ან ვეით იღებ" },
    ],
    dose: { en: "5-10g during or after training.", ka: "5-10გ ვარჯიშის დროს ან შემდეგ." },
    cautions: { en: "Money may be better spent on whole protein or whey if your total daily protein is already adequate.", ka: "ფული შესაძლოა უფრო გონივრულად დაიხარჯოს სრულფასოვან ცილაზე ან ვეიზე, თუ დღიური ცილის მიღება უკვე საკმარისია." },
  },
  {
    id: "betaalanine",
    url: "https://vitamini.ge/ge/product-category/138-skhva-aminomdjavebi",
    name: { en: "Beta-Alanine", ka: "ბეტა-ალანინი" },
    goal: { en: "Endurance", ka: "გამძლეობა" },
    benefits: [
      { en: "Buffers muscle acid buildup, helpful for high-rep sets (10-25 reps)", ka: "ბუფერავს კუნთში მჟავის დაგროვებას, სასარგებლოა მაღალგანმეორებადი სეტებისთვის (10-25)" },
      { en: "Can improve performance in short, intense efforts", ka: "შესაძლოა გააუმჯობესოს შედეგი მოკლე, ინტენსიურ დატვირთვაში" },
    ],
    dose: { en: "3-5g daily, split into smaller doses.", ka: "3-5გ დღეში, გაყოფილი მცირე დოზებად." },
    cautions: { en: "Causes a harmless tingling sensation in some people — splitting doses reduces it.", ka: "ზოგს ქმნის უვნებელ დაჟუჟუნებას — დოზების გაყოფა ამცირებს მას." },
  },
  {
    id: "glutamine",
    url: "https://vitamini.ge/ge/product-category/9-l-glutamine",
    name: { en: "L-Glutamine", ka: "L-გლუტამინი" },
    goal: { en: "Recovery & Immune Support", ka: "აღდგენა და იმუნიტეტი" },
    benefits: [
      { en: "May support gut and immune health during heavy training blocks", ka: "შესაძლოა დაეხმაროს ნაწლავისა და იმუნური სისტემის ჯანმრთელობას მძიმე ვარჯიშის პერიოდში" },
      { en: "Some evidence for reduced muscle soreness", ka: "გარკვეული მტკიცებულება კუნთის ტკივილის შემცირებაზე" },
      { en: "Evidence for direct muscle growth is weak on its own", ka: "პირდაპირი კუნთის ზრდის მტკიცებულება სუსტია" },
    ],
    dose: { en: "5g daily, post-workout or before bed.", ka: "5გ დღეში, ვარჯიშის შემდეგ ან ძილის წინ." },
    cautions: { en: "Considered safe at normal doses; limited added benefit if your diet already has enough protein.", ka: "ჩვეულებრივი დოზებით უსაფრთხოდ ითვლება; მცირე დამატებითი სარგებელი აქვს, თუ საკვები რაციონი უკვე საკმარისია ცილით." },
  },
  {
    id: "omega3",
    url: "https://vitamini.ge/ge/product-category/255-omega-3-tevzis-qoni",
    name: { en: "Omega-3 Fish Oil", ka: "ომეგა-3 თევზის ცხიმი" },
    goal: { en: "Heart & Joint Health", ka: "გულის და სახსრების ჯანმრთელობა" },
    benefits: [
      { en: "Supports heart health and healthy triglyceride levels", ka: "ხელს უწყობს გულის ჯანმრთელობასა და ტრიგლიცერიდების ნორმალურ დონეს" },
      { en: "May reduce exercise-induced joint stiffness and inflammation", ka: "შესაძლოა შეამციროს ვარჯიშით გამოწვეული სახსრების სიმტკიცე და ანთება" },
      { en: "Supports brain health", ka: "ხელს უწყობს ტვინის ჯანმრთელობას" },
    ],
    dose: { en: "1-2g combined EPA/DHA daily, with food.", ka: "1-2გ EPA/DHA ჯამში დღეში, საკვებთან ერთად." },
    cautions: { en: "Can thin the blood slightly — talk to a doctor if you're on blood thinners or before surgery.", ka: "შესაძლოა ოდნავ გაათხელოს სისხლი — უკონსულტირდი ექიმს სისხლის გამათხელებელი წამლების მიღებისას ან ოპერაციის წინ." },
  },
  {
    id: "vitamind",
    url: "https://vitamini.ge/ge/product-category/237-d-vitamini",
    name: { en: "Vitamin D3", ka: "D3 ვიტამინი" },
    goal: { en: "Bone & Immune Health", ka: "ძვლის და იმუნური სისტემის ჯანმრთელობა" },
    benefits: [
      { en: "Supports bone density and calcium absorption", ka: "ხელს უწყობს ძვლის სიმკვრივესა და კალციუმის შეთვისებას" },
      { en: "Especially relevant in Georgia's darker winter months with less sun exposure", ka: "განსაკუთრებით მნიშვნელოვანია საქართველოში ზამთრის მუქ თვეებში, როცა მზის სინათლე ცოტაა" },
      { en: "Supports immune function and mood", ka: "ხელს უწყობს იმუნურ სისტემასა და განწყობას" },
    ],
    dose: { en: "1000-2000 IU daily (a blood test gives the most precise dose).", ka: "1000-2000 IU დღეში (ზუსტი დოზისთვის გაიკეთე სისხლის ანალიზი)." },
    cautions: { en: "Very high doses over long periods can cause toxicity — don't exceed label guidance without medical supervision.", ka: "ხანგრძლივად ძალიან მაღალმა დოზამ შეიძლება ტოქსიკურობა გამოიწვიოს — არ გადააჭარბო ეტიკეტზე მითითებულს ექიმის ზედამხედველობის გარეშე." },
  },
  {
    id: "magnesium",
    url: "https://vitamini.ge/ge/product-category/242-magniumi",
    name: { en: "Magnesium", ka: "მაგნიუმი" },
    goal: { en: "Sleep & Muscle Function", ka: "ძილი და კუნთის ფუნქცია" },
    benefits: [
      { en: "Supports muscle relaxation and may reduce cramping", ka: "ხელს უწყობს კუნთის მოდუნებას და შესაძლოა შეამციროს კრუნჩხვები" },
      { en: "Can improve sleep quality for people who are deficient", ka: "შესაძლოა გააუმჯობესოს ძილის ხარისხი დეფიციტის მქონე ადამიანებში" },
      { en: "Involved in hundreds of enzyme reactions, including energy production", ka: "მონაწილეობს ასობით ფერმენტულ რეაქციაში, მათ შორის ენერგიის წარმოებაში" },
    ],
    dose: { en: "200-400mg in the evening — glycinate or citrate forms are gentler on digestion.", ka: "200-400მგ საღამოს — გლიცინატის ან ციტრატის ფორმა უფრო მსუბუქია საჭმლის მონელებისთვის." },
    cautions: { en: "High doses can cause loose stools — reduce the dose if this happens.", ka: "მაღალმა დოზამ შეიძლება გამოიწვიოს ფაღარათი — შეამცირე დოზა ამ შემთხვევაში." },
  },
  {
    id: "multivitamin",
    url: "https://vitamini.ge/ge/product-category/50-multivitaminebi",
    name: { en: "Multivitamin", ka: "მულტივიტამინი" },
    goal: { en: "General Health", ka: "ზოგადი ჯანმრთელობა" },
    benefits: [
      { en: "Fills small nutritional gaps from an imperfect diet", ka: "ავსებს მცირე ნუტრიციულ ნაკლოვანებებს არასრულყოფილი კვებიდან" },
      { en: "Convenient baseline coverage of common vitamins and minerals", ka: "მოსახერხებელი საბაზისო დაფარვა გავრცელებული ვიტამინებისა და მინერალებისთვის" },
    ],
    dose: { en: "1 serving daily with food, per label.", ka: "1 ულუფა დღეში საკვებთან ერთად, ეტიკეტის მიხედვით." },
    cautions: { en: "More isn't better — avoid stacking multiple products that overlap, especially fat-soluble vitamins (A, D, E, K).", ka: "მეტი არ ნიშნავს უკეთესს — მოერიდე რამდენიმე ვიტამინის ერთდროულ მიღებას, განსაკუთრებით ცხიმში ხსნადი ვიტამინების (A, D, E, K) შემთხვევაში." },
  },
  {
    id: "caffeine",
    url: "https://vitamini.ge/ge/product-category/231-kofeinis-abebi",
    name: { en: "Caffeine / Pre-Workout", ka: "კოფეინი / პრე-ვორქაუთი" },
    goal: { en: "Energy & Focus", ka: "ენერგია და კონცენტრაცია" },
    benefits: [
      { en: "Improves alertness, focus, and perceived energy for training", ka: "აუმჯობესებს ყურადღებას, კონცენტრაციასა და ვარჯიშისთვის აღქმულ ენერგიას" },
      { en: "Can modestly increase strength and endurance output", ka: "შესაძლოა მცირედით გაზარდოს ძალა და გამძლეობა" },
    ],
    dose: { en: "150-300mg, 30-45 minutes before training.", ka: "150-300მგ, ვარჯიშამდე 30-45 წუთით ადრე." },
    cautions: { en: "Can cause anxiety, insomnia, or a racing heart. Avoid late in the day, don't stack multiple caffeinated products, and skip if you have a heart condition.", ka: "შესაძლოა გამოიწვიოს შფოთვა, უძილობა ან გულისცემის აჩქარება. მოერიდე დღის ბოლოს მიღებას და რამდენიმე კოფეინიანი პროდუქტის ერთდროულად გამოყენებას, გამოტოვე გულის დაავადების შემთხვევაში." },
  },
  {
    id: "gainer",
    url: "https://vitamini.ge/ge/product-category/8-geineri",
    name: { en: "Weight Gainer", ka: "გეინერი" },
    goal: { en: "Weight Gain", ka: "წონის მოსამატებლად" },
    benefits: [
      { en: "Convenient way to add calories if you struggle to eat enough to gain weight", ka: "მოსახერხებელი გზა კალორიების დასამატებლად, თუ გიჭირს საკმარისი ჭამა წონის მატებისთვის" },
      { en: "Combines protein and carbs in one shake", ka: "აერთიანებს ცილასა და ნახშირწყლებს ერთ სასმელში" },
    ],
    dose: { en: "1 serving between meals, per label — often 500-1000+ kcal per serving.", ka: "1 ულუფა კვებებს შორის, ეტიკეტის მიხედვით — ხშირად 500-1000+ კკალ ერთ ულუფაზე." },
    cautions: { en: "Easy to gain more fat than muscle if not paired with resistance training. Whole food is usually cheaper and just as effective.", ka: "ადვილია კუნთზე მეტი ცხიმის მომატება, თუ არ არის შერწყმული ვარჯიშთან. სრულფასოვანი საკვები ხშირად უფრო იაფი და თანაბრად ეფექტურია." },
  },
  {
    id: "fatburner",
    url: "https://vitamini.ge/ge/product-category/10-ckhimismwveli",
    name: { en: "Fat Burner", ka: "ცხიმისმწველი" },
    goal: { en: "Weight Loss", ka: "წონის დასაკლებად" },
    benefits: [
      { en: "May give a modest, temporary boost to metabolism or appetite control", ka: "შესაძლოა მცირედით და დროებით გაზარდოს მეტაბოლიზმი ან შეამციროს მადა" },
      { en: "A calorie deficit still does the real work — this is a small add-on at best", ka: "ძირითად საქმეს მაინც კალორიული დეფიციტი აკეთებს — დანამატი მხოლოდ მცირე დამატებაა" },
    ],
    dose: { en: "Follow the label exactly — these are typically stimulant blends and dosing varies a lot by product.", ka: "მკაცრად მიჰყევი ეტიკეტს — ეს პროდუქტები ჩვეულებრივ სტიმულანტების ნაზავია და დოზირება პროდუქტების მიხედვით ძალიან განსხვავდება." },
    cautions: { en: "Often heavily caffeine-based — can raise heart rate and blood pressure. Not recommended if you have heart issues, anxiety, or are pregnant. Evidence for meaningful fat loss beyond diet and training is weak.", ka: "ხშირად ძლიერ კოფეინზეა დაფუძნებული — შესაძლოა გაზარდოს გულისცემა და წნევა. არ არის რეკომენდებული გულის პრობლემების, შფოთვის მქონე ან ორსული ადამიანებისთვის. მტკიცებულება რეალურ ცხიმის დაწვაზე დიეტისა და ვარჯიშის მიღმა სუსტია." },
  },
];
function SupplementsView({ t, lang }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <div className="text-[11px] mb-4 px-3 py-2.5 rounded-xl" style={{ background: "rgba(76,141,255,0.08)", color: C.steel, border: `1.5px solid ${C.border}` }}>{t.supplementsDisclaimer}</div>
      <div className="flex flex-col gap-3">
        {SUPPLEMENTS.map((s) => {
          const isOpen = open === s.id;
          return (
            <div key={s.id} className="rounded-2xl overflow-hidden" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
              <button onClick={() => setOpen(isOpen ? null : s.id)} className="w-full text-left p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[15px]" style={{ color: C.text }}>{L(s.name, lang)}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: C.blueBright }}>{t.goalLabel}: {L(s.goal, lang)}</div>
                </div>
                <ChevronRight size={16} color={C.steel} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginLeft: 8 }} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 rise" style={{ borderTop: `1.5px solid ${C.border}` }}>
                  <div className="text-[11px] uppercase tracking-wide mt-3 mb-1.5" style={{ color: C.steel }}>{t.supplementBenefits}</div>
                  <ul className="flex flex-col gap-1 mb-3">
                    {s.benefits.map((b, idx) => (
                      <li key={idx} className="text-[12px] flex gap-2" style={{ color: C.text }}>
                        <span style={{ color: C.blueBright }}>•</span>{L(b, lang)}
                      </li>
                    ))}
                  </ul>
                  <div className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: C.steel }}>{t.typicalDose}</div>
                  <div className="text-[12px] mb-3" style={{ color: C.text }}>{L(s.dose, lang)}</div>
                  <div className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: C.steel }}>{t.supplementCautions}</div>
                  <div className="text-[12px] mb-3" style={{ color: C.steel }}>{L(s.cautions, lang)}</div>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold active:scale-95" style={{ background: C.blueDim, color: C.blueBright, transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)" }}>
                    {t.shopVitamini} <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------- CARDIO ---------------------------------- */
function CardioView({ t, lang, profile, hydrationMl, addWater, onToast, logCardioSession }) {
  const [machineId, setMachineId] = useState("treadmill");
  const [incline, setIncline] = useState(1);
  const [speed, setSpeed] = useState(5);
  const [level, setLevel] = useState(8);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const lastReminderRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setElapsed((s) => {
        const next = s + 1;
        if (Math.floor(next / 600) > Math.floor(lastReminderRef.current / 600)) onToast(t.hydrationReminder);
        lastReminderRef.current = next;
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, t.hydrationReminder]);

  const machine = MACHINES.find((m) => m.id === machineId);
  const params = { incline, speed, level };
  const met = metFor(machineId, params);
  const calories = (met * 3.5 * (profile.weightKg || 70) / 200) * (elapsed / 60);
  const goalMl = Math.round((profile.weightKg || 70) * 33);
  const hydrationPct = Math.min(100, Math.round((hydrationMl / goalMl) * 100));

  function reset() { setRunning(false); setElapsed(0); lastReminderRef.current = 0; }
  const mm = Math.floor(elapsed / 60), ss = elapsed % 60;

  return (
    <div>
      <div className="rounded-3xl p-5 mb-6 shadow-xl" style={{ background: "radial-gradient(circle at 15% 0%, rgba(76,141,255,0.12), transparent 42%), linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))", border: `1px solid ${C.border}`, backdropFilter: "blur(28px) saturate(180%)", borderRadius: 30, boxShadow: `inset 0 1.5px 0 rgba(255,255,255,${C === C_LIGHT ? 0.5 : 0.18}), inset 0 -1px 0 rgba(0,0,0,0.08)` }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><Droplet size={16} color={C.blue} /><span className="text-[11px] uppercase tracking-widest" style={{ color: C.blueBright }}>{t.hydrationTitle}</span></div>
          <span className="text-xs tabular" style={{ color: C.steel }}>{hydrationMl} / {goalMl} ml</span>
        </div>
        <div className="h-2 rounded-full w-full mb-3" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-2 rounded-full" style={{ width: hydrationPct + "%", background: C.blue }} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => addWater(250)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold" style={{ background: C.blueDim, color: C.blueBright }}><PlusCircle size={12} /> 250ml</button>
          <button onClick={() => addWater(500)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold" style={{ background: C.blueDim, color: C.blueBright }}><PlusCircle size={12} /> 500ml</button>
        </div>
      </div>

      <div className="disp text-lg font-semibold mb-3" style={{ color: C.text }}>{t.chooseMachine}</div>
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {MACHINES.map((m) => (
          <button key={m.id} onClick={() => { setMachineId(m.id); reset(); }} className="px-3 py-2.5 rounded-xl text-xs font-semibold shrink-0" style={{ background: machineId === m.id ? C.blueDim : C.glass, border: `1px solid ${machineId === m.id ? C.borderStrong : C.border}`, color: machineId === m.id ? C.blueBright : C.text }}>
            {L(MACHINE_LABEL[m.id], lang)}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-2xl mb-5 flex flex-col gap-3" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}>
        {machine.params.includes("incline") && (
          <Field label={t.incline}><NumEditor value={incline} onChange={setIncline} style={inputStyle} width="100%" /></Field>
        )}
        {machine.params.includes("speed") && (
          <Field label={t.speed}><NumEditor value={speed} onChange={setSpeed} style={inputStyle} width="100%" /></Field>
        )}
        {machine.params.includes("level") && (
          <Field label={t.level}><NumEditor value={level} onChange={setLevel} style={inputStyle} width="100%" /></Field>
        )}
      </div>

      <div className="rounded-3xl p-6 mb-4 text-center shadow-xl" style={{ background: "radial-gradient(circle at 15% 0%, rgba(76,141,255,0.12), transparent 42%), linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))", border: `1px solid ${C.border}`, backdropFilter: "blur(28px) saturate(180%)", borderRadius: 30, boxShadow: `inset 0 1.5px 0 rgba(255,255,255,${C === C_LIGHT ? 0.5 : 0.18}), inset 0 -1px 0 rgba(0,0,0,0.08)` }}>
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: C.blueBright }}>{t.elapsed}</div>
        <div className="disp text-5xl font-bold tabular mb-3" style={{ color: C.text }}>{pad(mm)}:{pad(ss)}</div>
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: C.steel }}>{t.caloriesBurned}</div>
        <div className="disp text-2xl font-semibold tabular" style={{ color: C.blueBright }}>{Math.round(calories)} kcal</div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setRunning((r) => !r)} className="flex-1 py-3.5 rounded-2xl disp text-base font-semibold flex items-center justify-center gap-2" style={{ background: C.blue, color: "#04070E" }}>
          {running ? <Pause size={16} /> : <Play size={16} />} {running ? t.pauseCardio : elapsed > 0 ? t.resumeCardio : t.startCardio}
        </button>
        <button onClick={reset} className="px-5 rounded-2xl" style={{ background: C.glass, border: `1.5px solid ${C.border}` }}><RotateCcw size={18} color={C.steel} /></button>
      </div>
      {elapsed > 0 && (
        <button
          onClick={() => { logCardioSession({ date: todayStr(), machine: machineId, minutes: Math.round(elapsed / 60), kcal: Math.round(calories) }); reset(); }}
          className="w-full mt-3 py-3 rounded-2xl text-sm font-semibold"
          style={{ background: C.blueDim, color: C.blueBright }}
        >
          {t.logSession}
        </button>
      )}
    </div>
  );
}

/* ---------------------------------- SQUAT GAME (minimalist, front view) ---------------------------------- */
function SquatGame({ t, lang, onClose }) {
  const [phase, setPhase] = useState("down"); // down -> tap -> success -> fail
  const [weight, setWeight] = useState(20);
  const [taps, setTaps] = useState(0);
  const [remainingMs, setRemainingMs] = useState(5000);
  const [best, setBest] = useState(null);
  const tickRef = useRef(null);

  const tapsNeeded = Math.max(3, Math.round(weight / 8));
  const timeLimitMs = 5000;

  useEffect(() => {
    (async () => {
      try { const res = await window.storage.get("forgefit-squat-best", false); if (res && res.value) setBest(JSON.parse(res.value).bestWeight); }
      catch (e) { /* no record yet */ }
    })();
  }, []);

  useEffect(() => {
    if (phase !== "down") return;
    const to = setTimeout(() => setPhase("tap"), 900);
    return () => clearTimeout(to);
  }, [phase, weight]);

  useEffect(() => {
    if (phase !== "tap") return;
    setRemainingMs(timeLimitMs);
    const start = Date.now();
    tickRef.current = setInterval(() => {
      const left = timeLimitMs - (Date.now() - start);
      if (left <= 0) { clearInterval(tickRef.current); setPhase("fail"); vibrate(180); }
      else setRemainingMs(left);
    }, 50);
    return () => clearInterval(tickRef.current);
  }, [phase]);

  function handleTap() {
    if (phase !== "tap") return;
    vibrate(8);
    const next = taps + 1;
    setTaps(next);
    if (next >= tapsNeeded) {
      clearInterval(tickRef.current);
      setPhase("success");
      vibrate([30, 30, 40]);
      if (!best || weight > best) {
        setBest(weight);
        window.storage.set("forgefit-squat-best", JSON.stringify({ bestWeight: weight }), false).catch(() => {});
      }
    }
  }
  function nextRep() { setWeight((w) => w + 10); setTaps(0); setPhase("down"); }
  function restart() { setWeight(20); setTaps(0); setPhase("down"); }

  // squatFactor: 1 = bottom of squat, 0 = standing tall
  const squatFactor = phase === "down" ? 1 : phase === "fail" ? 1.15 : phase === "success" ? 0 : Math.max(0, 1 - taps / tapsNeeded);
  const transitionTiming = phase === "down" ? "all 0.9s ease-in" : "all 0.15s ease-out";
  const standHipY = 92, deepHipY = 138, footY = 168;
  const hipY = standHipY + (deepHipY - standHipY) * Math.min(1, squatFactor);
  const legWidth = 22 + Math.min(1, squatFactor) * 10;
  const shoulderY = hipY - 46;
  const flexed = phase === "success";
  const failed = phase === "fail";

  // Minimalist palette — just three flat tones plus the app's blue.
  const body = failed ? "#EF4444" : flexed ? "#FBBF24" : C.blue;
  const bodyDim = "rgba(255,255,255,0.14)";
  const bg = "rgba(76,141,255,0.06)";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-md rounded-t-3xl p-6 rise" style={{ background: C.card, border: `1.5px solid ${C.border}`, borderBottom: "none", backdropFilter: "blur(28px) saturate(180%)", borderTopLeftRadius: 32, borderTopRightRadius: 32, boxShadow: `inset 0 1.5px 0 rgba(255,255,255,${C === C_LIGHT ? 0.6 : 0.12}), 0 -20px 50px rgba(0,0,0,0.25)` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="disp text-xl font-semibold" style={{ color: C.text }}>{t.gameTitle}</div>
          <button onClick={onClose}><X size={20} color={C.steel} /></button>
        </div>
        <div className="text-xs mb-4" style={{ color: C.steel }}>{t.gameIntro}</div>

        <div className="flex items-center justify-between mb-3 text-xs">
          <span style={{ color: C.steel }}>{t.currentWeight}: <b style={{ color: C.blueBright }}>{weight}kg</b></span>
          {best != null && <span style={{ color: C.steel }}>{t.bestLift}: <b style={{ color: C.blueBright }}>{best}kg</b></span>}
        </div>

        <div className="relative rounded-2xl mb-4 overflow-hidden flex items-end justify-center" style={{ height: 190, background: bg, border: `1.5px solid ${C.border}` }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            {/* floor line — minimalist ground reference */}
            <line x1="20" y1={footY + 2} x2="160" y2={footY + 2} stroke={C.border} strokeWidth="2" />
            {/* legs (front view): simple trapezoids from current hip line down to fixed feet */}
            <g style={{ transition: transitionTiming }}>
              <polygon points={`${90 - legWidth},${hipY} ${90 - 9},${hipY} ${90 - 13},${footY} ${90 - legWidth - 6},${footY}`} fill={bodyDim} />
              <polygon points={`${90 + legWidth},${hipY} ${90 + 9},${hipY} ${90 + 13},${footY} ${90 + legWidth + 6},${footY}`} fill={bodyDim} />
              {/* feet */}
              <rect x={90 - legWidth - 12} y={footY} width="26" height="8" rx="3" fill={C.steel} />
              <rect x={90 + legWidth - 14} y={footY} width="26" height="8" rx="3" fill={C.steel} />
            </g>
            {/* torso + head + bar, all riding on the hip line */}
            <g style={{ transition: transitionTiming }}>
              <rect x="66" y={shoulderY} width="48" height={hipY - shoulderY} rx="14" fill={body} />
              <circle cx="90" cy={shoulderY - 16} r="15" fill={body} />
              {/* bar across shoulders, front view */}
              <rect x="34" y={shoulderY - 6} width="112" height="7" rx="3.5" fill={C.text} opacity="0.85" />
              <circle cx="34" cy={shoulderY - 2.5} r="9" fill={C.steel} />
              <circle cx="146" cy={shoulderY - 2.5} r="9" fill={C.steel} />
              {flexed && (
                <>
                  <line x1="90" y1={shoulderY - 34} x2="90" y2={shoulderY - 46} stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                  <line x1="78" y1={shoulderY - 30} x2="70" y2={shoulderY - 42} stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                  <line x1="102" y1={shoulderY - 30} x2="110" y2={shoulderY - 42} stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                </>
              )}
            </g>
          </svg>
          {phase === "tap" && (
            <div className="absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full tabular" style={{ background: "rgba(0,0,0,0.5)", color: C.blueBright }}>
              {(remainingMs / 1000).toFixed(1)}s
            </div>
          )}
        </div>

        {phase === "down" && <div className="text-center text-sm mb-4" style={{ color: C.steel }}>{t.getReady}</div>}

        {phase === "tap" && (
          <button onClick={handleTap} className="w-full py-8 rounded-2xl disp text-3xl font-bold mb-2 active:scale-95" style={{ background: C.blue, color: "#04070E", transition: "transform 0.05s" }}>
            {t.tapToLift} ({taps}/{tapsNeeded})
          </button>
        )}

        {phase === "success" && (
          <div className="text-center rise">
            <div className="disp text-2xl font-bold mb-3" style={{ color: C.blueBright }}>{t.repComplete}</div>
            <button onClick={nextRep} className="w-full py-3.5 rounded-2xl disp text-base font-semibold" style={{ background: C.blue, color: "#04070E" }}>{t.nextRep} ({weight + 10}kg)</button>
          </div>
        )}

        {phase === "fail" && (
          <div className="text-center rise">
            <div className="disp text-2xl font-bold mb-3" style={{ color: C.blue }}>{t.squished}</div>
            <button onClick={restart} className="w-full py-3.5 rounded-2xl disp text-base font-semibold" style={{ background: C.blue, color: "#04070E" }}>{t.tryAgainGame}</button>
          </div>
        )}
      </div>
    </div>
  );
}