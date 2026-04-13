export interface GlossaryTerm {
  term: string;
  short: string;
  long: string;
  category: string;
  related?: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  // Lifts and movements
  {
    term: "1RM",
    short: "One-rep max — the heaviest weight you can lift for a single rep with good form",
    long: "Your 1RM is the benchmark for strength programming. Most programs prescribe work as a percentage of 1RM (e.g., 5x5 at 80% 1RM). Testing your 1RM is risky and optional — calculated estimates from rep-max formulas (Epley, Brzycki) work fine for most lifters.",
    category: "Programming",
  },
  {
    term: "AMRAP",
    short: "As Many Reps (or Rounds) As Possible in a given time",
    long: "Common in CrossFit workouts. 'AMRAP 20' means you do as many rounds of the prescribed exercises as you can in 20 minutes. Also used in strength training for an uncapped final set (e.g., 3x5 then 1x AMRAP).",
    category: "Programming",
  },
  {
    term: "EMOM",
    short: "Every Minute On the Minute",
    long: "A conditioning format where you start a new set or exercise at the top of every minute, resting with the remainder of the minute. Example: 'EMOM 10: 5 deadlifts at 225' means you do 5 deadlifts at the start of each minute for 10 minutes.",
    category: "Programming",
  },
  {
    term: "RPE",
    short: "Rate of Perceived Exertion — how hard a set felt on a 1-10 scale",
    long: "RPE 10 is a true max with no reps left in the tank. RPE 9 leaves 1 rep. RPE 8 leaves 2-3 reps. Modern strength programs (Renaissance Periodization, Mike Israetel) use RPE instead of percentage-based loading for more accurate programming.",
    category: "Programming",
    related: ["RIR"],
  },
  {
    term: "RIR",
    short: "Reps In Reserve — how many more reps you could have done",
    long: "Closely related to RPE. RIR 0 means true failure (no reps left). RIR 1-2 is the hypertrophy sweet spot. RIR 3+ is submaximal training. Better than percentages because strength varies day to day.",
    category: "Programming",
    related: ["RPE"],
  },
  {
    term: "PR",
    short: "Personal Record — your best lift at any rep range",
    long: "A 5RM PR is your best 5-rep max. A 1RM PR is your best single. PRs are the currency of strength training motivation. Track them.",
    category: "Programming",
  },
  // Equipment
  {
    term: "Power Rack",
    short: "A four-post steel cage for squatting, benching, and pressing safely",
    long: "The centerpiece of most home gyms. Fully enclosed with vertical uprights and horizontal safety bars that catch a failed lift. Superior to squat stands for solo training because the safeties prevent injury when you fail a rep.",
    category: "Equipment",
    related: ["Squat Stand", "Safety Bars"],
  },
  {
    term: "Squat Stand",
    short: "Two vertical posts for holding a barbell — a minimal power rack alternative",
    long: "Cheaper and smaller than a full rack but less safe. Some squat stands have built-in spotter arms, others don't. If you lift alone, prioritize a power rack with safety bars over a squat stand.",
    category: "Equipment",
    related: ["Power Rack"],
  },
  {
    term: "Olympic Barbell",
    short: "A 7-foot barbell with 2-inch rotating sleeves, weighing 20kg (44 lbs) for men",
    long: "The standard lifting bar. Olympic refers to the 2-inch sleeve diameter (not the sport). Women's Olympic bars are 25mm shaft diameter and 15kg. Powerlifting bars are stiffer and often 29mm. Olympic lifting bars have more whip and aggressive knurling.",
    category: "Equipment",
    related: ["Knurling", "Whip"],
  },
  {
    term: "Bumper Plates",
    short: "Rubber-coated weight plates designed to be dropped safely",
    long: "Required for Olympic lifting (cleans, snatches) because you drop the bar from overhead. More expensive than cast iron and thicker. Most home gym owners only need a pair of 45 lb bumpers for deadlifts, using cast iron for the rest.",
    category: "Equipment",
  },
  {
    term: "Cast Iron Plates",
    short: "Traditional weight plates made of painted or machined cast iron",
    long: "Cheaper and thinner than bumper plates. The standard for powerlifting training. Not safe to drop on bare concrete. Most affordable path to building a plate collection.",
    category: "Equipment",
  },
  {
    term: "Kettlebell",
    short: "A cast iron or steel weight with a handle attached to a ball-shaped body",
    long: "The offset center of mass makes kettlebells ideal for ballistic movements — swings, snatches, cleans, Turkish get-ups. One kettlebell unlocks dozens of exercises. Cast iron is budget-friendly, competition kettlebells have uniform sizing across all weights.",
    category: "Equipment",
  },
  {
    term: "Trap Bar",
    short: "A hexagonal bar you stand inside, used for deadlifts and farmer's walks",
    long: "Also called a hex bar. Reduces lower back stress on deadlifts by keeping the load centered around your body instead of in front of you. Open trap bars (Rogue TB-2, Yes4All) allow walking motions like farmer's walks.",
    category: "Equipment",
  },
  {
    term: "Knurling",
    short: "The cross-hatched pattern etched into a barbell for grip",
    long: "Deep aggressive knurling = better grip but rougher on hands. Light knurling = gentler but slippery under heavy loads. Powerlifting bars have the most aggressive knurling. Olympic bars have smoother knurling for high-rep work.",
    category: "Equipment",
  },
  {
    term: "Whip",
    short: "The flex or bounce of a barbell under heavy load",
    long: "More whip = more elastic energy stored in the bar. Olympic bars have significant whip (helps with explosive lifts). Powerlifting bars are stiffer with less whip (more stable for heavy singles). Cheap bars have uncontrolled whip which is dangerous.",
    category: "Equipment",
  },
  {
    term: "Bushings vs Bearings",
    short: "How the barbell sleeve rotates around the shaft",
    long: "Bushings: plastic/bronze rings — cheaper, good enough for most. Bearings: sealed needle bearings — smoother rotation, essential for Olympic lifts (cleans, snatches). For powerlifting only, bushings are fine. For Olympic lifting, get bearings.",
    category: "Equipment",
  },
  {
    term: "Safety Bars",
    short: "Horizontal steel pins inside a power rack that catch a failed lift",
    long: "The single most important rack feature for solo lifters. Set them just below your working range — if you fail a squat or bench, the bar rests on the safeties instead of crushing you. Never train alone without them.",
    category: "Equipment",
  },
  {
    term: "Adjustable Dumbbells",
    short: "Dumbbells that change weight via a dial or selector",
    long: "Bowflex SelectTech, PowerBlock, and similar. One pair replaces 10-15 pairs of fixed dumbbells in a compact footprint. Trade-off: most adjustables can't be dropped. Best for apartments and small spaces.",
    category: "Equipment",
  },
  // Lifts
  {
    term: "Back Squat",
    short: "The king of leg exercises — barbell on your upper back, squat down",
    long: "High bar: bar on traps, more quad-dominant, more vertical torso. Low bar: bar on rear delts, more hip-dominant, more horizontal torso (powerlifting standard). Both are effective — pick based on body mechanics and goals.",
    category: "Lifts",
  },
  {
    term: "Front Squat",
    short: "Squat with the bar resting on your front shoulders",
    long: "Forces upright torso, heavy quad emphasis, easier on lower back. Uses less weight than back squat (~80%) but often considered harder. Mobility demand: good wrist flexibility for the front rack position.",
    category: "Lifts",
  },
  {
    term: "Deadlift",
    short: "Pick up a loaded barbell from the floor to standing position",
    long: "The ultimate full-body strength lift. Conventional: narrow stance, arms outside knees. Sumo: wide stance, arms inside knees. Trap bar: using a hex bar. Romanian (RDL): don't touch the floor, hip hinge focus. All build serious strength.",
    category: "Lifts",
  },
  {
    term: "Bench Press",
    short: "Lying on a bench, press a loaded barbell from chest to lockout",
    long: "The flat bench press is the measure of upper body strength. Variations include incline (upper chest), decline (lower chest), close-grip (triceps), and wide-grip (chest). Always use a spotter or safety bars for max effort sets.",
    category: "Lifts",
  },
  {
    term: "Overhead Press",
    short: "Pressing a barbell from shoulders to locked-out overhead",
    long: "The standard for shoulder strength. Standing is harder than seated due to core stability demand. Military press is strict form with feet together. Push press uses a leg drive to start the bar moving.",
    category: "Lifts",
  },
  {
    term: "Pull-Up vs Chin-Up",
    short: "Pull-up: palms forward. Chin-up: palms toward you",
    long: "Both train the back and biceps. Chin-ups involve more bicep activity (most people can do more reps). Pull-ups are slightly more lat-dominant. Train both for balanced back development.",
    category: "Lifts",
  },
  {
    term: "Turkish Get-Up",
    short: "Lie on your back holding a weight overhead, stand up while keeping it overhead",
    long: "A full-body stability exercise. One of the best moves for shoulder health and movement quality. Start with a shoe on your hand to learn the pattern, then progress to a light dumbbell, then kettlebell.",
    category: "Lifts",
  },
  // Training concepts
  {
    term: "Hypertrophy",
    short: "Training for muscle size (not strength)",
    long: "Hypertrophy rep range is typically 6-20 reps per set, with RIR 0-3. Volume (sets x reps x weight) is the primary driver. You can gain strength without much hypertrophy, and hypertrophy without maximal strength, but they overlap significantly.",
    category: "Training",
  },
  {
    term: "Progressive Overload",
    short: "Gradually increasing training demand over time — the foundation of all strength training",
    long: "Add weight, add reps, add sets, shorten rest, increase tempo, or improve form. You don't need to add weight every session — any of these metrics progressing counts. Without progressive overload, you won't get stronger.",
    category: "Training",
  },
  {
    term: "Deload Week",
    short: "A lighter training week to recover from accumulated fatigue",
    long: "Every 4-8 weeks, reduce training volume or intensity by 30-50% for a week. Lets your joints, CNS, and muscles recover. You come back stronger. Not optional for serious lifters — mandatory for long-term progress.",
    category: "Training",
  },
  {
    term: "DOMS",
    short: "Delayed-Onset Muscle Soreness — the pain 24-72 hours after a hard workout",
    long: "Caused by microscopic muscle damage from training. Worst 24-48 hours after a novel or heavy workout. Being sore doesn't mean you had a good workout — and NOT being sore doesn't mean you didn't. Soreness is a poor indicator of training quality.",
    category: "Training",
  },
  {
    term: "Compound Lift",
    short: "An exercise that works multiple muscle groups across multiple joints",
    long: "Squats, deadlifts, bench press, overhead press, rows, pull-ups. The core of any strength program. Produce more strength and muscle per unit of time than isolation exercises. Always prioritize compound lifts before accessory work.",
    category: "Training",
    related: ["Isolation"],
  },
  {
    term: "Isolation",
    short: "An exercise that targets a single muscle through a single joint",
    long: "Bicep curls, tricep pushdowns, lateral raises, leg extensions. Useful for hypertrophy and addressing weak points. Not a substitute for compound lifts. A balanced program has 2-3 compounds plus 3-5 isolation exercises per session.",
    category: "Training",
    related: ["Compound Lift"],
  },
  {
    term: "Cutting",
    short: "Eating in a calorie deficit to lose body fat while maintaining muscle",
    long: "Typically a 300-500 calorie deficit, high protein (1g per lb bodyweight), moderate to high carbs around training. Lose 0.5-1% of bodyweight per week for best muscle retention. Too aggressive = muscle loss.",
    category: "Nutrition",
  },
  {
    term: "Bulking",
    short: "Eating in a calorie surplus to gain muscle with some fat gain",
    long: "A 200-500 calorie surplus, high protein, carbs to fuel training. Gain 0.25-0.5% of bodyweight per week for lean bulking. Faster gains = more fat. Running a controlled bulk is the most efficient way to build muscle.",
    category: "Nutrition",
  },
  {
    term: "Macros",
    short: "Macronutrients: protein, carbs, and fat — the calorie-containing nutrients",
    long: "Tracking macros is more effective than tracking calories alone. Protein: 0.7-1g per lb bodyweight (muscle). Fat: 0.3-0.5g per lb (hormones). Carbs: fill the rest (energy). 1g protein = 4 cal, 1g carb = 4 cal, 1g fat = 9 cal.",
    category: "Nutrition",
  },
  // Setup and space
  {
    term: "Footprint",
    short: "The floor area an equipment piece occupies",
    long: "Critical for home gym planning. A power rack is typically 50\" x 50\" (17 sq ft). A treadmill is 75\" x 35\" (18 sq ft). Add 3 feet of clearance on all sides for safe use. Measure your space twice before buying.",
    category: "Setup",
  },
  {
    term: "Horse Stall Mats",
    short: "Heavy rubber mats sold at Tractor Supply — the cheapest gym flooring",
    long: "4' x 6' rubber mats from Tractor Supply cost about $55 each. Three of them cover a typical gym area for less than $200. Beats specialty 'gym flooring' at 1/3 the price. They smell for a week but work perfectly.",
    category: "Setup",
  },
  {
    term: "Anchor Bolts",
    short: "Concrete or wood anchors used to bolt a power rack to the floor",
    long: "Wedge anchors are the standard for concrete floors. Lag bolts into joists for wood subfloors. Anchor a rack if you squat 300+ lbs, do kipping pull-ups, or have kids nearby. Prevents wobble and walk.",
    category: "Setup",
  },
  {
    term: "Lifting Platform",
    short: "A raised wooden platform for Olympic lifting and deadlifts",
    long: "Typically 8' x 8' plywood with rubber at the impact zones. Protects the floor from dropped weights and creates a consistent surface. Essential for Olympic lifting. Optional for most powerlifters.",
    category: "Setup",
  },
  // Accessories
  {
    term: "Knee Sleeves",
    short: "Neoprene tubes worn over the knees for warmth and compression",
    long: "5mm: warmth, casual use. 7mm: powerlifting standard, noticeable rebound. 9mm: competition stiffness. Provide warmth to joints, mild compression for stability, and a small elastic rebound at the bottom of squats. Not a cure for knee injuries.",
    category: "Accessories",
  },
  {
    term: "Wrist Wraps",
    short: "Stiff cloth wraps that stabilize the wrist during heavy pressing",
    long: "Support the wrist joint during bench press, overhead press, and push press. Different from wrist straps (which help grip on pulling lifts). Use for heavy pressing only, not every set.",
    category: "Accessories",
    related: ["Lifting Straps"],
  },
  {
    term: "Lifting Straps",
    short: "Cotton or leather straps that secure your hands to the barbell",
    long: "Grip aids for heavy pulling — deadlifts, rows, shrugs, rack pulls. Allow you to train past grip failure on high-volume back work. Don't use for every set — train grip strength with some straps-free work.",
    category: "Accessories",
    related: ["Wrist Wraps"],
  },
  {
    term: "Lifting Belt",
    short: "A wide leather belt worn around the waist for heavy compound lifts",
    long: "Provides something to brace against — increases intra-abdominal pressure, stabilizes spine, allows heavier lifts. Not a substitute for core strength. Use for sets above 80% 1RM on squat, deadlift, and overhead press.",
    category: "Accessories",
  },
  {
    term: "Chalk",
    short: "Magnesium carbonate powder applied to hands for grip",
    long: "Absorbs sweat and improves friction on the bar. Essential for heavy deadlifts, pull-ups, and Olympic lifts. Liquid chalk (less mess) vs block chalk (cheaper). Don't overdo it — a light coating is enough.",
    category: "Accessories",
  },
  // Conditioning
  {
    term: "HIIT",
    short: "High-Intensity Interval Training — short bursts of max effort with rest",
    long: "Proven as effective as longer steady-state cardio for conditioning, with less time. Example: 8 rounds of 20 seconds all-out / 10 seconds rest (Tabata). Works for air bikes, rowers, sprints, burpees, anything.",
    category: "Conditioning",
  },
  {
    term: "LISS",
    short: "Low-Intensity Steady State — easy cardio for long durations",
    long: "Walking, slow rowing, easy cycling at 60-70% max heart rate. Builds aerobic base, burns fat, aids recovery. Essential alongside high-intensity work. Most people should do both.",
    category: "Conditioning",
  },
  {
    term: "Zone 2",
    short: "Cardio at a conversational pace — 65-75% max heart rate",
    long: "The most underused cardio intensity. Builds mitochondrial density and aerobic base. You should be able to have a full conversation. 30-60 minutes, 2-3 times per week. Uncomfortable but sustainable.",
    category: "Conditioning",
  },
  // Form and technique
  {
    term: "Hip Hinge",
    short: "The movement pattern behind deadlifts, Romanian deadlifts, and swings",
    long: "Pushing your hips back while keeping your chest up and back flat. Different from squatting (which bends the knees more). The foundation of all posterior chain training. Master the hinge before loading it.",
    category: "Form",
  },
  {
    term: "Valsalva Maneuver",
    short: "Holding your breath against a closed glottis to stabilize the spine",
    long: "Take a big breath, brace hard against your belt, hold through the rep, exhale at the top. Dramatically increases intra-abdominal pressure. Standard technique for heavy squats, deadlifts, and overhead press. Can spike blood pressure briefly — not recommended for uncontrolled hypertension.",
    category: "Form",
  },
  {
    term: "Tempo",
    short: "The speed of each phase of a lift — eccentric, pause, concentric, pause",
    long: "Written as four numbers (e.g., 3-1-X-0): 3 seconds lowering, 1 second pause at bottom, X (explosive) lifting, 0 pause at top. Slower eccentrics build muscle and control. Pauses build strength out of the weakest position.",
    category: "Form",
  },
  {
    term: "Eccentric",
    short: "The lowering phase of a lift — when the muscle lengthens under load",
    long: "The eccentric portion causes more muscle damage (and hypertrophy) than the concentric. You're also stronger eccentrically than concentrically. Slowing down the eccentric is one of the simplest ways to increase training stimulus.",
    category: "Form",
  },
  {
    term: "Concentric",
    short: "The lifting phase of a lift — when the muscle shortens under load",
    long: "The 'working' phase in most people's minds. Usually faster than the eccentric. Explosive concentric effort builds power. Slow concentrics are sometimes programmed for time under tension.",
    category: "Form",
  },
];
