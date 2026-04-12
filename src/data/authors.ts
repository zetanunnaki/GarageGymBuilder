export interface Author {
  slug: string;
  name: string;
  role: string;
  shortBio: string;
  longBio: string[];
  credentials: string[];
  expertise: string[];
  yearsExperience: number;
  image?: string;
}

export const authors: Record<string, Author> = {
  "marcus-reid": {
    slug: "marcus-reid",
    name: "Marcus Reid",
    role: "Head of Reviews",
    shortBio:
      "Powerlifter and mechanical engineer who has been building and breaking home gym equipment for 15 years.",
    longBio: [
      "Marcus has been training in home gyms since 2010, when he assembled his first power rack in a one-car garage in Phoenix. A mechanical engineer by training, he started writing detailed reviews of garage gym equipment on Reddit's r/homegym in 2014, where his torque measurements and load testing made him a community staple.",
      "He competes raw in the 220-lb class, with a 545 lb squat, 365 lb bench, and 600 lb deadlift. He has personally tested every power rack featured on GarageGymBuilders, including stress testing them with loaded sleds, kipping pull-ups, and dropped weights.",
      "Marcus owns six different power racks across two locations and has assembled or disassembled more than 40 racks in the past decade. When he's not lifting or writing, he's usually fabricating something out of metal in his shop.",
    ],
    credentials: [
      "NSCA Certified Personal Trainer (CPT)",
      "USA Powerlifting Coach (Level 1)",
      "BS Mechanical Engineering, Arizona State University",
      "15+ years competitive powerlifting",
    ],
    expertise: [
      "Power racks and squat stands",
      "Olympic barbells",
      "Powerlifting programming",
      "Equipment durability testing",
      "Garage gym construction",
    ],
    yearsExperience: 15,
  },
  "lena-park": {
    slug: "lena-park",
    name: "Lena Park",
    role: "Performance Editor",
    shortBio:
      "Former NCAA Division I rower and USA Weightlifting coach. Specializes in conditioning equipment and women's training.",
    longBio: [
      "Lena rowed for the University of Washington from 2013-2017, helping the team to back-to-back NCAA championships. After graduation she transitioned to Olympic weightlifting and earned her USA Weightlifting Level 1 certification in 2019.",
      "She coaches a small group of athletes out of her converted garage in Seattle, focusing on women returning to strength training after pregnancy or injury. Her writing on postpartum strength training has been cited by the Postpartum Wellness Foundation.",
      "When she's not coaching or writing, Lena is usually on the rower or testing the latest cardio equipment. She has personally tested every rowing machine and air bike featured on GarageGymBuilders.",
    ],
    credentials: [
      "USA Weightlifting Level 1 Coach",
      "Precision Nutrition Level 1 Certified",
      "BS Kinesiology, University of Washington",
      "Former NCAA Division I athlete (rowing)",
    ],
    expertise: [
      "Rowing machines and ergometers",
      "Women's strength training",
      "Postpartum return-to-training",
      "Olympic weightlifting",
      "Sports nutrition basics",
    ],
    yearsExperience: 10,
  },
  "derek-walsh": {
    slug: "derek-walsh",
    name: "Derek Walsh",
    role: "Equipment Specialist",
    shortBio:
      "Strongman competitor and former commercial gym equipment salesman. Knows what survives heavy daily use.",
    longBio: [
      "Derek spent six years selling commercial gym equipment to CrossFit affiliates, hotels, and corporate fitness centers throughout the Midwest. He's seen firsthand which brands hold up to daily abuse and which ones break within a year.",
      "He competes in NSF Strongman in the 231-lb open class, with a 700 lb deadlift, 250 lb log press, and a sub-30-second yoke walk over 60 feet. His own home gym in rural Indiana takes up a 600 square foot dedicated outbuilding and includes equipment from over 20 different brands.",
      "Derek has been building, breaking, and replacing home gym equipment since 2017. His unique sales background gives him insight into which budget brands are actually rebranded commercial gear vs. cheap knockoffs.",
    ],
    credentials: [
      "NSF Strongman Competitor (Open class)",
      "Former commercial gym equipment sales (6 years)",
      "Home gym builder since 2017",
      "Member of Rogue Black Friday testing community",
    ],
    expertise: [
      "Strongman equipment (sandbags, atlas stones, yokes)",
      "Commercial vs. home gym gear comparison",
      "Used equipment buying",
      "Garage gym storage and organization",
      "Heavy-duty plate and bar testing",
    ],
    yearsExperience: 8,
  },
};

export function getAuthor(slug: string): Author | undefined {
  return authors[slug];
}

export function getAllAuthors(): Author[] {
  return Object.values(authors);
}
