// Adds 35 new products to the existing catalog
import fs from "fs";

const existing = JSON.parse(fs.readFileSync("src/data/products.json", "utf8"));
const TAG = "garagegymbu0e-20";

const newProducts = {
  "balancefrom-puzzle-mat": {
    name: "BalanceFrom Puzzle Exercise Mat (24 sq ft)",
    brand: "BalanceFrom",
    price: "$25.99",
    image: "/images/products/balancefrom-puzzle-mat.webp",
    specs: { weightCapacity: "N/A — flooring", footprint: "24 sq ft (6 tiles)", material: "High-Density EVA Foam (1/2\" thick)" },
    amazonLink: `https://amazon.com/dp/B074DSQF13?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=BalanceFrom+Puzzle+Exercise+Mat&irgwc=1",
    pros: ["4.5+ star rating on Amazon with 40,000+ reviews", "24 sq ft covers a full lifting platform area", "1/2 inch thick EVA foam absorbs impact and noise", "Interlocking design — no adhesive needed", "Easy to cut for custom fit around racks", "Best budget gym flooring on Amazon"],
    cons: ["Puzzle seams can separate under heavy racks", "Not as durable as horse stall mats for deadlifts", "Slight chemical smell for first few days"]
  },
  "yes4all-dumbbell-rack": {
    name: "Yes4All 5-Tier A-Frame Dumbbell Rack",
    brand: "Yes4All",
    price: "$39.99",
    image: "/images/products/yes4all-dumbbell-rack.webp",
    specs: { weightCapacity: "500 lbs total", footprint: "25\" L x 13\" W x 30\" H", material: "Powder-Coated Steel" },
    amazonLink: `https://amazon.com/dp/B0DCP4TPW5?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Yes4All+Dumbbell+Rack&irgwc=1",
    pros: ["4.6+ star rating on Amazon", "Holds up to 5 pairs of dumbbells", "Compact A-frame design saves floor space", "500 lb total weight capacity", "Powder-coated steel resists rust", "Easy 20-minute assembly"],
    cons: ["Only fits hex dumbbells (not adjustable)", "Wobbles slightly when fully loaded", "Rubber feet can mark garage floors"]
  },
  "valor-fitness-cable-station": {
    name: "Valor Fitness BD-62 Wall Mount Cable Station",
    brand: "Valor Fitness",
    price: "$249.99",
    image: "/images/products/valor-fitness-cable-station.webp",
    specs: { weightCapacity: "150 lbs stack", footprint: "Wall-mounted, minimal footprint", material: "Steel Frame / Nylon Cables" },
    amazonLink: `https://amazon.com/dp/B01LOX2PPO?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Valor+Fitness+BD-62+Cable+Station&irgwc=1",
    pros: ["4.5+ star rating on Amazon with 1,500+ reviews", "Wall-mounted — saves floor space", "150 lb weight stack included", "Lat pulldown, tricep, curl, row capability", "Adjustable pulley height positions", "Best budget cable machine for home gyms"],
    cons: ["Requires wall stud mounting (concrete anchors for garage)", "150 lb stack limits advanced lifters", "Cable can fray after years of heavy use"]
  },
  "titan-safety-squat-bar": {
    name: "Titan Fitness Safety Squat Bar V2",
    brand: "Titan Fitness",
    price: "$179.99",
    image: "/images/products/titan-safety-squat-bar.webp",
    specs: { weightCapacity: "1,500 lbs", footprint: "7ft bar with padded yoke", material: "Heavy-Duty Steel / Foam Padding" },
    amazonLink: `https://amazon.com/dp/B09D12QXYM?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Titan+Fitness+Safety+Squat+Bar&irgwc=1",
    pros: ["4.6+ star rating on Amazon", "1,500 lb weight capacity", "Padded yoke reduces shoulder and wrist strain", "Cambered handles for natural hand position", "Standard Olympic 2\" sleeves fit any rack", "Best budget safety squat bar available"],
    cons: ["Heavier than standard barbell (~65 lbs)", "Yoke padding can wear with heavy use", "Not ideal for bench press or deadlifts"]
  },
  "cap-ez-curl-bar": {
    name: "CAP Barbell Olympic EZ Curl Bar",
    brand: "CAP Barbell",
    price: "$54.99",
    image: "/images/products/cap-ez-curl-bar.webp",
    specs: { weightCapacity: "200 lbs", footprint: "47\" total length", material: "Chrome-Plated Steel" },
    amazonLink: `https://amazon.com/dp/B001A4F3SG?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=CAP+Barbell+Olympic+EZ+Curl+Bar&irgwc=1",
    pros: ["4.6+ star rating on Amazon with 5,000+ reviews", "Angled grips reduce wrist strain on curls", "Standard Olympic 2\" sleeves", "Chrome-plated for durability", "Affordable entry-level curl bar", "Works with all Olympic plates"],
    cons: ["200 lb capacity limits heavy preacher curls", "Bushing sleeves — no spin like needle bearings", "Light knurling may need chalk"]
  },
  "yes4all-landmine": {
    name: "Yes4All T-Bar Row Landmine Attachment",
    brand: "Yes4All",
    price: "$19.99",
    image: "/images/products/yes4all-landmine.webp",
    specs: { weightCapacity: "Fits any Olympic barbell", footprint: "Compact floor mount", material: "Heavy-Duty Steel / 360° Swivel" },
    amazonLink: `https://amazon.com/dp/B096FTVBL2?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Yes4All+Landmine+Attachment&irgwc=1",
    pros: ["4.6+ star rating on Amazon with 3,000+ reviews", "Universal fit for any Olympic barbell", "360-degree swivel joint", "Floor or rack mountable", "Enables T-bar rows, landmine presses, rotational work", "Best value landmine attachment"],
    cons: ["Floor mount requires drilling", "Swivel joint can loosen over time", "No handle included — sold separately"]
  },
  "sunny-spin-bike": {
    name: "Sunny Health & Fitness Indoor Cycling Bike SF-B1805",
    brand: "Sunny Health & Fitness",
    price: "$369.99",
    image: "/images/products/sunny-spin-bike.webp",
    specs: { weightCapacity: "330 lbs user weight", footprint: "44\" L x 22\" W x 45\" H", material: "Steel Frame / 44 lb Flywheel" },
    amazonLink: `https://amazon.com/dp/B0C96GTZYF?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Sunny+Health+Fitness+SF-B1805&irgwc=1",
    pros: ["4.5+ star rating on Amazon", "Heavy 44 lb chrome flywheel for smooth ride", "Magnetic resistance — whisper quiet", "Adjustable seat and handlebars for all heights", "Supports Bluetooth cadence sensors", "Best mid-range spin bike for home use"],
    cons: ["No built-in screen (use tablet holder)", "Seat can be uncomfortable — upgrade recommended", "Heavy at 115 lbs — hard to move"]
  },
  "xterra-treadmill": {
    name: "XTERRA Fitness TR150 Folding Treadmill",
    brand: "XTERRA Fitness",
    price: "$249.99",
    image: "/images/products/xterra-treadmill.webp",
    specs: { weightCapacity: "250 lbs user weight", footprint: "57\" L x 27\" W (folds vertical)", material: "Steel Frame / 16\" x 50\" Running Surface" },
    amazonLink: `https://amazon.com/dp/B01M0L0D90?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=XTERRA+Fitness+TR150+Treadmill&irgwc=1",
    pros: ["4.4+ star rating on Amazon with 10,000+ reviews", "Folds vertically for compact storage", "12 preset workout programs", "Speed up to 10 MPH with 3 incline levels", "LCD display tracks distance, calories, pulse", "Best budget folding treadmill under $300"],
    cons: ["250 lb user weight limit", "Running surface is narrow (16 inches)", "Motor is entry-level — not for serious runners"]
  },
  "sportsroyals-power-tower": {
    name: "Sportsroyals Power Tower Dip Station",
    brand: "Sportsroyals",
    price: "$149.99",
    image: "/images/products/sportsroyals-power-tower.webp",
    specs: { weightCapacity: "450 lbs", footprint: "40\" L x 35\" W x 87\" H", material: "Heavy-Duty Steel / Foam Pads" },
    amazonLink: `https://amazon.com/dp/B0BFWVXY32?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Sportsroyals+Power+Tower&irgwc=1",
    pros: ["4.5+ star rating on Amazon with 5,000+ reviews", "450 lb weight capacity", "Pull-ups, dips, leg raises, push-ups in one station", "Adjustable height for different users", "Padded arm and back rests for comfort", "Best budget power tower on Amazon"],
    cons: ["Large footprint requires dedicated space", "Can wobble during kipping pull-ups", "Assembly takes 1-2 hours"]
  },
  "prosourcefit-dip-stand": {
    name: "ProsourceFit Dip Stand Station",
    brand: "ProsourceFit",
    price: "$89.99",
    image: "/images/products/prosourcefit-dip-stand.webp",
    specs: { weightCapacity: "400 lbs", footprint: "34\" L x 23\" W x 35\" H", material: "Steel Frame / Foam Grips" },
    amazonLink: `https://amazon.com/dp/B07N8SXFKD?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=ProsourceFit+Dip+Stand&irgwc=1",
    pros: ["4.6+ star rating on Amazon with 3,000+ reviews", "400 lb weight capacity", "Compact — stores in corner when not in use", "Safety connector prevents legs from spreading", "Foam-padded handles for grip comfort", "Best budget dip stand under $100"],
    cons: ["Low height — tall users may need to bend knees a lot", "Only for dips (no pull-up bar)", "Foam grips wear after 2-3 years"]
  },
  "triggerpoint-grid": {
    name: "TriggerPoint GRID Foam Roller",
    brand: "TriggerPoint",
    price: "$36.99",
    image: "/images/products/triggerpoint-grid.webp",
    specs: { weightCapacity: "500 lbs", footprint: "13\" x 5.5\" diameter", material: "EVA Foam / Rigid Hollow Core" },
    amazonLink: `https://amazon.com/dp/B0D9HMBT52?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=TriggerPoint+GRID+Foam+Roller&irgwc=1",
    pros: ["4.7+ star rating on Amazon with 20,000+ reviews", "Multi-density GRID surface targets muscles differently", "Rigid hollow core won't flatten over time", "500 lb weight capacity — built to last", "Compact 13\" size for travel", "The gold standard in foam rollers"],
    cons: ["Pricier than basic smooth rollers", "13 inches too short for full-back rolling", "Firm surface may be intense for beginners"]
  },
  "theragun-mini": {
    name: "Theragun Mini (2nd Gen) Percussive Therapy",
    brand: "Therabody",
    price: "$149.00",
    image: "/images/products/theragun-mini.webp",
    specs: { weightCapacity: "N/A — recovery tool", footprint: "6\" x 4\" — palm-sized", material: "QX35 Motor / 3 Speed Settings" },
    amazonLink: `https://amazon.com/dp/B0B6QDYSG5?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Theragun+Mini+2nd+Gen&irgwc=1",
    pros: ["4.6+ star rating on Amazon with 8,000+ reviews", "Ultra-portable — fits in a gym bag", "3 speed settings (1750-2400 PPM)", "150-minute battery life per charge", "Quiet — usable in shared spaces", "Best compact percussion massager"],
    cons: ["Only 1 attachment head included", "Less powerful than full-size Theragun", "Premium price for mini size"]
  },
  "ironmind-gripper": {
    name: "IronMind Captains of Crush Hand Gripper",
    brand: "IronMind",
    price: "$25.95",
    image: "/images/products/ironmind-gripper.webp",
    specs: { weightCapacity: "Multiple resistance levels (60-365 lbs)", footprint: "Pocket-sized", material: "Aircraft-Grade Aluminum / GR8 Steel Spring" },
    amazonLink: `https://amazon.com/dp/B0002U3CNU?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=IronMind+Captains+of+Crush+Gripper&irgwc=1",
    pros: ["4.7+ star rating on Amazon with 10,000+ reviews", "The original and most respected grip trainer", "11 resistance levels from 60 to 365 lbs", "Aircraft-grade aluminum handles won't bend", "GR8 spring steel lasts a lifetime", "Used by grip sport competitors worldwide"],
    cons: ["Each gripper is one fixed resistance level", "Need to buy multiple for progression", "No rep counter or tracking"]
  },
  "fat-gripz": {
    name: "Fat Gripz Original (2.25\" Diameter)",
    brand: "Fat Gripz",
    price: "$39.95",
    image: "/images/products/fat-gripz.webp",
    specs: { weightCapacity: "Fits any barbell or dumbbell", footprint: "Clip-on, fits in gym bag", material: "Military-Grade Compound Rubber" },
    amazonLink: `https://amazon.com/dp/B005FIS14Y?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Fat+Gripz+Original&irgwc=1",
    pros: ["4.7+ star rating on Amazon with 8,000+ reviews", "Instantly thickens any bar to 2.25\" diameter", "Activates more forearm and grip muscles", "Military-grade rubber won't crack or tear", "Fits barbells, dumbbells, pull-up bars, cable attachments", "Used by NFL, MLB, and military training programs"],
    cons: ["Reduces max weight you can lift by 20-30%", "Can slip on sweaty chrome bars — use chalk", "Only one size per pair (no progression)"]
  },
  "liquid-grip-chalk": {
    name: "Liquid Grip Liquid Chalk (8 oz)",
    brand: "Liquid Grip",
    price: "$15.99",
    image: "/images/products/liquid-grip-chalk.webp",
    specs: { weightCapacity: "N/A — grip enhancer", footprint: "8 oz bottle", material: "Water-Based Chalk Formula" },
    amazonLink: `https://amazon.com/dp/B007WTQIDU?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Liquid+Grip+Chalk&irgwc=1",
    pros: ["4.5+ star rating on Amazon with 5,000+ reviews", "No mess — dries instantly on hands", "Water-based, non-toxic formula", "One application lasts an entire workout", "Gym-friendly — no chalk dust on equipment", "Best liquid chalk for home and commercial gyms"],
    cons: ["More expensive per use than block chalk", "Can dry out hands with daily use", "Bottle can leak if cap isn't sealed"]
  },
  "gymboss-timer": {
    name: "Gymboss Interval Timer and Stopwatch",
    brand: "Gymboss",
    price: "$24.95",
    image: "/images/products/gymboss-timer.webp",
    specs: { weightCapacity: "N/A — timer", footprint: "2\" x 2.5\" — clip-on", material: "Impact-Resistant Polymer / Belt Clip" },
    amazonLink: `https://amazon.com/dp/B00CO8HO6O?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Gymboss+Interval+Timer&irgwc=1",
    pros: ["4.5+ star rating on Amazon with 5,000+ reviews", "Programmable intervals for HIIT, Tabata, EMOM", "Loud beep + vibrate alert modes", "Clips to waistband or sets on floor", "Simple 3-button interface — no app needed", "Best dedicated workout timer on Amazon"],
    cons: ["Small screen can be hard to read mid-workout", "Battery replacement requires tiny screwdriver", "No Bluetooth or app connectivity"]
  },
  "gaiam-yoga-mat": {
    name: "Gaiam Essentials Thick Yoga Mat (10mm)",
    brand: "Gaiam",
    price: "$21.98",
    image: "/images/products/gaiam-yoga-mat.webp",
    specs: { weightCapacity: "N/A — exercise mat", footprint: "72\" x 24\" x 10mm thick", material: "NBR Foam / Non-Slip Surface" },
    amazonLink: `https://amazon.com/dp/B07J9WSQFZ?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Gaiam+Essentials+Thick+Yoga+Mat&irgwc=1",
    pros: ["4.5+ star rating on Amazon with 50,000+ reviews", "Extra thick 10mm cushioning for joint protection", "Non-slip textured surface", "Includes carry strap for portability", "Great for stretching, ab work, and yoga", "Best budget exercise mat on Amazon"],
    cons: ["Not firm enough for standing balance poses", "Absorbs sweat — needs regular cleaning", "10mm thickness makes balance poses harder"]
  },
  "spri-medicine-ball": {
    name: "SPRI Xerball Medicine Ball (12 lb)",
    brand: "SPRI",
    price: "$44.99",
    image: "/images/products/spri-medicine-ball.webp",
    specs: { weightCapacity: "12 lbs", footprint: "11\" diameter", material: "Textured Rubber / Sand Fill" },
    amazonLink: `https://amazon.com/dp/B008YE0FSQ?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=SPRI+Xerball+Medicine+Ball&irgwc=1",
    pros: ["4.6+ star rating on Amazon with 3,000+ reviews", "Textured rubber surface for secure grip", "Slight bounce — great for partner drills", "Dead-weight feel for rotational training", "Available in 2-30 lb sizes", "Best textured medicine ball on Amazon"],
    cons: ["Rubber smell when new", "Bounces more than a slam ball — not for overhead slams", "12 lb may be heavy for beginners"]
  },
  "titan-plate-tree": {
    name: "Titan Fitness Olympic Plate Tree & Barbell Holder",
    brand: "Titan Fitness",
    price: "$89.99",
    image: "/images/products/titan-plate-tree.webp",
    specs: { weightCapacity: "850 lbs plate storage", footprint: "22\" L x 22\" W x 36\" H", material: "Powder-Coated Steel / 6 Pegs" },
    amazonLink: `https://amazon.com/dp/B01L7XWSGC?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Titan+Fitness+Plate+Tree+Storage&irgwc=1",
    pros: ["4.5+ star rating on Amazon", "Holds 850 lbs of Olympic plates", "6 weight pegs + 2 barbell holders", "Compact footprint keeps gym organized", "Powder-coated steel resists rust", "Best value plate storage on Amazon"],
    cons: ["Assembly required (30 minutes)", "Pegs are slightly short for large plate stacks", "Wheels not included — stationary unit"]
  },
  "harbinger-gloves": {
    name: "Harbinger Pro WristWrap Weightlifting Gloves",
    brand: "Harbinger",
    price: "$24.99",
    image: "/images/products/harbinger-gloves.webp",
    specs: { weightCapacity: "N/A — grip accessory", footprint: "Sizes S-XXL", material: "Leather Palm / Wrist Wrap / Ventilated Back" },
    amazonLink: `https://amazon.com/dp/B0BS2XJHX4?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Harbinger+Pro+Wristwrap+Gloves&irgwc=1",
    pros: ["4.5+ star rating on Amazon with 15,000+ reviews", "Integrated wrist wrap adds joint support", "Full leather palm prevents calluses", "Ventilated mesh back keeps hands cool", "Pull tab for easy on/off between sets", "Best lifting gloves under $30"],
    cons: ["Gloves reduce barbell 'feel' vs bare hands", "Leather wears out after 12-18 months of daily use", "Wrist wrap is not as stiff as dedicated wraps"]
  },
  "schwinn-upright-bike": {
    name: "Schwinn Fitness 170 Upright Exercise Bike",
    brand: "Schwinn",
    price: "$349.99",
    image: "/images/products/schwinn-upright-bike.webp",
    specs: { weightCapacity: "300 lbs user weight", footprint: "41\" L x 21\" W x 56\" H", material: "Steel Frame / 25 Resistance Levels" },
    amazonLink: `https://amazon.com/dp/B08PB3SBLR?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Schwinn+170+Upright+Bike&irgwc=1",
    pros: ["4.4+ star rating on Amazon with 5,000+ reviews", "25 levels of magnetic resistance", "29 built-in workout programs", "Bluetooth connectivity for fitness apps", "Dual LCD screens track all metrics", "Best upright bike under $400"],
    cons: ["Seat comfort requires break-in period", "Assembly takes 2+ hours", "Pedals are basic — upgrade for clip-in shoes"]
  },
  "stamina-compact-strider": {
    name: "Stamina InMotion Compact Strider",
    brand: "Stamina",
    price: "$79.99",
    image: "/images/products/stamina-compact-strider.webp",
    specs: { weightCapacity: "250 lbs user weight", footprint: "24\" L x 18\" W x 12\" H", material: "Steel Frame / Non-Slip Pedals" },
    amazonLink: `https://amazon.com/dp/B00O12HE4I?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Stamina+InMotion+Compact+Strider&irgwc=1",
    pros: ["4.3+ star rating on Amazon with 15,000+ reviews", "Ultra-compact — fits under a desk", "Low-impact elliptical motion", "Adjustable resistance dial", "LCD monitor tracks strides, time, calories", "Best compact cardio machine under $100"],
    cons: ["Limited range of motion vs full elliptical", "Can slide on smooth floors without mat", "Resistance maxes out quickly for fit users"]
  },
  "body-solid-leg-press": {
    name: "Body-Solid Powerline Vertical Leg Press",
    brand: "Body-Solid",
    price: "$349.99",
    image: "/images/products/body-solid-leg-press.webp",
    specs: { weightCapacity: "400 lbs plate loaded", footprint: "56\" L x 28\" W x 60\" H", material: "11-Gauge Steel / DuraFirm Pads" },
    amazonLink: `https://amazon.com/dp/B000UZJJMA?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Body-Solid+Powerline+Vertical+Leg+Press&irgwc=1",
    pros: ["4.4+ star rating on Amazon", "Vertical design saves floor space vs 45-degree presses", "400 lb plate-loaded capacity", "DuraFirm back and head pads", "Adjustable safety stops", "Best budget vertical leg press for home gyms"],
    cons: ["Vertical angle is harder than 45-degree presses", "Heavy unit — needs permanent placement", "Assembly requires 2 people and 2+ hours"]
  },
  "xmark-preacher-curl": {
    name: "XMark Seated Preacher Curl Bench",
    brand: "XMark",
    price: "$139.99",
    image: "/images/products/xmark-preacher-curl.webp",
    specs: { weightCapacity: "350 lbs", footprint: "40\" L x 27\" W x 36\" H", material: "11-Gauge Steel / DuraFoam Pads" },
    amazonLink: `https://amazon.com/dp/B004OVJN7W?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=XMark+Preacher+Curl+Bench&irgwc=1",
    pros: ["4.5+ star rating on Amazon with 1,500+ reviews", "11-gauge steel frame — commercial quality", "Adjustable seat height for different users", "Wide DuraFoam arm pad for comfort", "Fits standard and Olympic EZ curl bars", "Best preacher curl bench under $150"],
    cons: ["Single-purpose (curls only)", "Heavy at 50 lbs — not easily moved", "Pad angle is fixed — no adjustment"]
  },
  "synergee-barbell-collars": {
    name: "Synergee Aluminum Barbell Collars (Pair)",
    brand: "Synergee",
    price: "$24.95",
    image: "/images/products/synergee-barbell-collars.webp",
    specs: { weightCapacity: "Fits all Olympic 2\" barbells", footprint: "Pocket-sized clips", material: "CNC Aluminum / Quick-Release Lever" },
    amazonLink: `https://amazon.com/dp/B072FJZRGD?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Synergee+Barbell+Collars&irgwc=1",
    pros: ["4.7+ star rating on Amazon with 5,000+ reviews", "CNC machined aluminum — lightweight and strong", "Quick-release lever locks in under 1 second", "Fits all standard Olympic 2\" barbells", "Won't scratch or damage bar sleeves", "Best upgrade from spring clips"],
    cons: ["Pricier than basic spring clips", "Slightly loose on some thinner-sleeve bars", "Only comes in 1 size (2\" Olympic)"]
  },
  "chirp-wheel": {
    name: "Chirp Wheel+ Back Pain Relief (3-Pack)",
    brand: "Chirp",
    price: "$59.99",
    image: "/images/products/chirp-wheel.webp",
    specs: { weightCapacity: "500 lbs", footprint: "12\", 10\", 6\" diameter wheels", material: "ABS Plastic Core / Foam Padding" },
    amazonLink: `https://amazon.com/dp/B09F5SX783?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Chirp+Wheel+Back+Pain+Relief&irgwc=1",
    pros: ["4.5+ star rating on Amazon with 10,000+ reviews", "3 sizes target different spinal areas", "Ergonomic channel protects your spine", "500 lb weight capacity — won't flex", "Better spinal extension than foam rollers", "Best back relief tool for lifters"],
    cons: ["Takes practice to balance on the wheel", "6-inch wheel is very intense for beginners", "Foam padding can compress after years of use"]
  },
  "titan-wall-pulley": {
    name: "Titan Fitness Wall Mounted Pulley Tower",
    brand: "Titan Fitness",
    price: "$279.99",
    image: "/images/products/titan-wall-pulley.webp",
    specs: { weightCapacity: "350 lbs plate loaded", footprint: "Wall-mounted, 80.5\" tall", material: "Steel Frame / 2:1 Pulley Ratio" },
    amazonLink: `https://amazon.com/dp/B09M4CLBS5?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Titan+Fitness+Wall+Mounted+Pulley&irgwc=1",
    pros: ["4.5+ star rating on Amazon", "Wall-mounted — no floor space needed", "Plate-loaded up to 350 lbs", "High and low pulley positions", "2:1 cable ratio for smooth resistance", "Best space-saving cable machine"],
    cons: ["Requires solid wall or stud mounting", "Plates not included", "Cable routing takes patience during setup"]
  },
  "marcy-smith-machine": {
    name: "Marcy Smith Machine Cage System SM-4033",
    brand: "Marcy",
    price: "$799.99",
    image: "/images/products/marcy-smith-machine.webp",
    specs: { weightCapacity: "600 lbs on smith bar", footprint: "80\" L x 79\" W x 86\" H", material: "14-Gauge Steel / Linear Bearings" },
    amazonLink: `https://amazon.com/dp/B07YVTW8ZF?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Marcy+Smith+Machine+SM-4033&irgwc=1",
    pros: ["4.3+ star rating on Amazon with 2,000+ reviews", "Smith bar + cable crossover + free weight area", "600 lb smith bar capacity", "Includes pec deck, leg developer, preacher curl pad", "Linear bearings for smooth smith motion", "Best all-in-one home gym under $1,000"],
    cons: ["Massive footprint — needs dedicated room", "Assembly takes 4-6 hours with 2 people", "Smith bar fixed path limits some movement patterns"]
  },
  "relife-power-tower": {
    name: "RELIFE REBUILD YOUR LIFE Power Tower",
    brand: "RELIFE",
    price: "$129.99",
    image: "/images/products/relife-power-tower.webp",
    specs: { weightCapacity: "400 lbs", footprint: "37\" L x 27\" W x 85\" H", material: "Steel Frame / Foam Padded" },
    amazonLink: `https://amazon.com/dp/B0CLV59DFF?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=RELIFE+Power+Tower&irgwc=1",
    pros: ["4.4+ star rating on Amazon with 3,000+ reviews", "Pull-ups, dips, leg raises, push-ups", "400 lb weight capacity", "Adjustable height settings", "Compact footprint for home gyms", "Great value under $130"],
    cons: ["Assembly instructions could be clearer", "Slight wobble at full extension", "Foam pads compress over time"]
  },
  "hypervolt-go2": {
    name: "Hypervolt GO 2 Portable Massage Gun",
    brand: "Hyperice",
    price: "$129.00",
    image: "/images/products/hypervolt-go2.webp",
    specs: { weightCapacity: "N/A — recovery tool", footprint: "6.8\" x 4\" — portable", material: "QuietGlide Motor / 3 Speeds" },
    amazonLink: `https://amazon.com/dp/B0CDMX8QBZ?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Hypervolt+GO+2+Massage+Gun&irgwc=1",
    pros: ["4.5+ star rating on Amazon with 2,000+ reviews", "Ultra-lightweight at 1.5 lbs", "QuietGlide technology — barely audible", "3 speed settings up to 3200 RPM", "2.5-hour battery life", "TSA-approved for travel"],
    cons: ["Less powerful than full-size Hypervolt", "Only 2 attachment heads included", "Charge port cover can be stiff"]
  },
  "optp-foam-roller": {
    name: "OPTP PRO-ROLLER Standard Density (36\")",
    brand: "OPTP",
    price: "$27.95",
    image: "/images/products/optp-foam-roller.webp",
    specs: { weightCapacity: "All user weights", footprint: "36\" x 6\" cylinder", material: "Standard Density Foam / Closed Cell" },
    amazonLink: `https://amazon.com/dp/B01F9ADC78?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=OPTP+PRO-ROLLER+Foam+Roller&irgwc=1",
    pros: ["4.7+ star rating on Amazon with 3,000+ reviews", "Standard density — firm but not painful", "36 inch length supports full spine", "Closed-cell foam resists moisture", "Preferred by physical therapists", "Best medium-density roller for recovery"],
    cons: ["Standard density may be too soft for experienced users", "No textured surface for deep tissue work", "Can eventually compress with daily use"]
  },
  "trx-bandit-handles": {
    name: "TRX Bandit Resistance Band Handles",
    brand: "TRX",
    price: "$49.95",
    image: "/images/products/trx-bandit-handles.webp",
    specs: { weightCapacity: "Fits any loop resistance band", footprint: "Pair of handles + carrying bag", material: "Reinforced Webbing / Foam Grips" },
    amazonLink: `https://amazon.com/dp/B09MJP8L8F?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=TRX+Bandit+Resistance+Handles&irgwc=1",
    pros: ["4.6+ star rating on Amazon", "Converts any loop band into a cable-machine feel", "Works with all standard resistance bands", "Comfortable foam grips reduce hand fatigue", "Includes carry bag for travel", "Turns cheap bands into a full gym system"],
    cons: ["Bands sold separately", "Pricey for handles alone", "Webbing can wear with very heavy bands"]
  },
  "gym-wall-mirror": {
    name: "Fab Glass and Mirror Gym Wall Mirror (48\"x24\")",
    brand: "Fab Glass and Mirror",
    price: "$89.99",
    image: "/images/products/gym-wall-mirror.webp",
    specs: { weightCapacity: "N/A — wall-mounted mirror", footprint: "48\" x 24\" (mount 2-3 for full wall)", material: "6mm Tempered Glass / Polished Edges" },
    amazonLink: `https://amazon.com/dp/B0D1QC77FW?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Gym+Wall+Mirror+48x24&irgwc=1",
    pros: ["4.4+ star rating on Amazon", "6mm tempered glass — shatter-resistant", "Polished edges for safe handling", "48x24 size — mount 2-3 for full wall coverage", "Form check on squats, deadlifts, and presses", "Best budget gym mirror on Amazon"],
    cons: ["Mounting hardware not included", "Heavy — need two people to install", "Not truly shatterproof (tempered, not acrylic)"]
  },
  "stamina-power-tower": {
    name: "Stamina 1690 Power Tower",
    brand: "Stamina",
    price: "$119.99",
    image: "/images/products/stamina-power-tower.webp",
    specs: { weightCapacity: "250 lbs", footprint: "41\" L x 39\" W x 81\" H", material: "Steel Frame / Padded Arm Rests" },
    amazonLink: `https://amazon.com/dp/B002Y2SUU4?tag=${TAG}`,
    walmartLink: "https://walmart.com/search?q=Stamina+1690+Power+Tower&irgwc=1",
    pros: ["4.3+ star rating on Amazon with 5,000+ reviews", "Pull-ups, dips, knee raises, push-ups in one station", "Padded arm and back rests", "Affordable entry-level power tower", "Compact enough for apartment gyms", "Best power tower under $120"],
    cons: ["250 lb weight limit — not for heavy users", "Wobbles during intense kipping movements", "Padding compresses after 1-2 years"]
  },
};

const merged = { ...existing, ...newProducts };
fs.writeFileSync("src/data/products.json", JSON.stringify(merged, null, 2));
console.log("Products before:", Object.keys(existing).length);
console.log("New products added:", Object.keys(newProducts).length);
console.log("Total products now:", Object.keys(merged).length);
