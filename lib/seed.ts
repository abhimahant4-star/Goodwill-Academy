import type { Category, Course, Database, IconName } from "./types";
import { localKeywords } from "./seo";

/**
 * Initial content used to create data/db.json on first run.
 * After that, everything here can be edited from the admin panel.
 * Durations and fees are placeholders — confirm them with the academy.
 */

const CERTS_BEAUTY = ["International Certificate", "Salon Certificate"];
const CERTS_DEFAULT = ["International Certificate", "Goodwill Academy Certificate"];

export const seedCategories: Category[] = [
  {
    slug: "beauty-makeup-courses",
    name: "Beauty, Makeup & Salon Courses",
    shortName: "Beauty & Makeup",
    tagline: "Makeup, hair, skin and nail art — become a certified beauty professional.",
    description:
      "Goodwill Academy offers the best makeup and beauty courses in Chandigarh with an International Certificate and Salon Certificate. Learn professional makeup, hair styling, skin care and nail art from experienced trainers through hands-on practice on real models, and start your career as a makeup artist, hair stylist, beautician or nail technician.",
    icon: "sparkles",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-600",
    keywords: localKeywords("beauty and makeup", [
      "best makeup academy in Chandigarh",
      "beautician course in Chandigarh",
      "salon course with international certificate",
      "professional makeup artist course in Chandigarh",
      "beauty parlour course in Chandigarh",
      "cosmetology course in Chandigarh",
    ]),
    order: 1,
  },
  {
    slug: "fashion-designing-courses",
    name: "Fashion Designing Courses",
    shortName: "Fashion Designing",
    tagline: "From sketch to stitched outfit — design suits, kurtis, lehengas and bridal wear.",
    description:
      "Join the best fashion designing course in Chandigarh at Goodwill Academy. Learn fashion sketching, pattern making, cutting, stitching, embroidery, fabric knowledge and advanced bridal and lehenga designing with practical training and an International Certificate.",
    icon: "palette",
    gradient: "from-violet-600 via-purple-500 to-indigo-500",
    keywords: localKeywords("fashion designing", [
      "best fashion designing institute in Chandigarh",
      "fashion designing classes for girls in Chandigarh",
      "boutique course in Chandigarh",
      "dress designing course in Chandigarh",
      "short term fashion designing course in Chandigarh",
    ]),
    order: 2,
  },
  {
    slug: "computer-courses",
    name: "Computer Courses",
    shortName: "Computer",
    tagline: "Basic computer, MS Office, Tally with GST, typing and advanced Excel.",
    description:
      "Goodwill Academy is a trusted computer institute in Chandigarh offering basic computer courses, MS Office, Tally with GST, English, Hindi and Punjabi typing and advanced Excel. Practical, job-oriented computer training with certificate for students, job seekers and working professionals.",
    icon: "monitor",
    gradient: "from-sky-500 via-cyan-500 to-teal-500",
    keywords: localKeywords("computer", [
      "best computer institute in Chandigarh",
      "computer classes in Chandigarh",
      "job oriented computer course in Chandigarh",
      "short term computer course with certificate",
      "computer centre near me",
    ]),
    order: 3,
  },
  {
    slug: "sewing-courses",
    name: "Sewing & Tailoring Courses",
    shortName: "Sewing",
    tagline: "Learn stitching from basics to finished garments — suits, kurtis, blouses and more.",
    description:
      "Learn sewing and tailoring at Goodwill Academy, the best sewing institute in Chandigarh. Our step-by-step sewing course covers hand and machine stitching, body measurements, fabric cutting and stitching of salwar suits, kurtis, blouses, pants and pajamas with professional finishing.",
    icon: "needle",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    keywords: localKeywords("sewing", [
      "best sewing classes in Chandigarh",
      "tailoring course in Chandigarh",
      "stitching classes for ladies in Chandigarh",
      "silai course in Chandigarh",
      "cutting and tailoring course near me",
    ]),
    order: 4,
  },
];

type CourseInput = {
  slug: string;
  categorySlug: string;
  title: string;
  focus: string;
  extraKeywords?: string[];
  shortDescription: string;
  description: string;
  icon: IconName;
  duration: string;
  level?: string;
  topics: string[];
  featured?: boolean;
};

function course(input: CourseInput, order: number): Course {
  const isBeauty = input.categorySlug === "beauty-makeup-courses";
  return {
    id: input.slug,
    slug: input.slug,
    categorySlug: input.categorySlug,
    title: input.title,
    shortDescription: input.shortDescription,
    description: input.description,
    icon: input.icon,
    duration: input.duration,
    fee: "Contact for fees",
    level: input.level ?? "Beginner to Advanced",
    topics: input.topics,
    certificates: isBeauty ? CERTS_BEAUTY : CERTS_DEFAULT,
    keywords: localKeywords(input.focus, input.extraKeywords),
    featured: input.featured ?? false,
    published: true,
    order,
  };
}

const courseInputs: CourseInput[] = [
  // ---------------- Beauty, Makeup & Salon ----------------
  {
    slug: "professional-makeup-course",
    categorySlug: "beauty-makeup-courses",
    title: "Professional Makeup Course",
    focus: "makeup",
    extraKeywords: [
      "best makeup course in Chandigarh",
      "bridal makeup course in Chandigarh",
      "party makeup course in Chandigarh",
      "makeup artist course in Chandigarh",
      "professional makeup artist course with certificate",
    ],
    shortDescription: "Basic, party and bridal makeup — become a certified professional makeup artist.",
    description:
      "Our Professional Makeup Course is designed for anyone who wants to become a makeup artist. Start with skin preparation and basic makeup, move on to party makeup looks, and master HD and traditional bridal makeup. Practice on real models under expert guidance and earn an International Certificate and Salon Certificate.",
    icon: "sparkles",
    duration: "3 Months",
    topics: ["Basic Makeup", "Party Makeup", "Bridal Makeup"],
    featured: true,
  },
  {
    slug: "hair-course",
    categorySlug: "beauty-makeup-courses",
    title: "Professional Hair Course",
    focus: "hair",
    extraKeywords: [
      "hair styling course in Chandigarh",
      "hair cutting course in Chandigarh",
      "hair colouring course in Chandigarh",
      "hair dresser course in Chandigarh",
      "advanced chemical hair treatment course",
    ],
    shortDescription: "Hair styling, cutting, colouring and advanced chemical hair treatments.",
    description:
      "Become a skilled hair stylist with our Professional Hair Course. Learn trendy hair styling, precision hair cutting techniques, global and highlight hair colouring, and advanced chemical treatments like smoothening, rebonding and keratin. Includes salon-floor practice and an International & Salon Certificate.",
    icon: "scissors",
    duration: "3 Months",
    topics: ["Hair Styling", "Hair Cutting", "Hair Colouring", "Advanced Chemical Hair"],
    featured: true,
  },
  {
    slug: "skin-and-beauty-course",
    categorySlug: "beauty-makeup-courses",
    title: "Skin & Beauty Course",
    focus: "skin and beauty",
    extraKeywords: [
      "beautician course in Chandigarh",
      "facial course in Chandigarh",
      "waxing course in Chandigarh",
      "skin care course in Chandigarh",
      "advanced facial course in Chandigarh",
    ],
    shortDescription: "Bleach, facial, waxing, advanced facials and all skin treatments.",
    description:
      "The Skin & Beauty Course covers everything a beautician needs for a successful parlour career — bleach and facial, waxing, advanced facials and a full range of skin treatments. Understand skin types, products and hygiene, and get certified with an International & Salon Certificate.",
    icon: "flower",
    duration: "2 Months",
    topics: ["Bleach & Facial", "Waxing", "All Skin Treatments", "Advanced Facial"],
  },
  {
    slug: "nail-art-course",
    categorySlug: "beauty-makeup-courses",
    title: "Nail Art Course",
    focus: "nail art",
    extraKeywords: [
      "nail extension course in Chandigarh",
      "nail technician course in Chandigarh",
      "gel nail course in Chandigarh",
      "acrylic nail extension course",
    ],
    shortDescription: "Basic nails, nail extensions and creative nail art designs.",
    description:
      "Start your career as a nail technician with our Nail Art Course. Learn basic nail care, gel and acrylic nail extensions and creative nail art designs used in top salons. Build a portfolio during training and receive an International & Salon Certificate.",
    icon: "hand",
    duration: "1 Month",
    topics: ["Basic Nail", "Nail Extensions", "Nail Art"],
    featured: true,
  },

  // ---------------- Fashion Designing ----------------
  {
    slug: "fashion-designing-sketching",
    categorySlug: "fashion-designing-courses",
    title: "Fashion Designing Sketching",
    focus: "fashion sketching",
    extraKeywords: [
      "best fashion designing course in Chandigarh",
      "fashion illustration course in Chandigarh",
      "dress design drawing classes",
      "suit kurti lehenga design drawing course",
    ],
    shortDescription: "Create dress designs and draw suit, kurti and lehenga designs.",
    description:
      "Every great outfit starts with a sketch. In this fashion designing sketching course you will learn to create dress designs, draw suit, kurti and lehenga designs, and develop your own new fashion designs with colour and detailing — the foundation of every fashion designer's portfolio.",
    icon: "palette",
    duration: "1 Month",
    topics: [
      "Creating Dress Design",
      "Drawing Suit, Kurti & Lehenga Design",
      "Creating New Fashion Design",
    ],
    featured: true,
  },
  {
    slug: "cutting-and-pattern-making",
    categorySlug: "fashion-designing-courses",
    title: "Cutting & Pattern Making",
    focus: "cutting and pattern making",
    extraKeywords: [
      "pattern making course in Chandigarh",
      "fabric cutting course in Chandigarh",
      "blouse cutting classes in Chandigarh",
      "fashion designing course in Chandigarh",
    ],
    shortDescription: "Body measurements, fabric cutting and blouse, suit & kurti patterns.",
    description:
      "Learn the technical side of fashion designing with our Cutting & Pattern Making course. Take accurate body measurements, cut fabric with minimum wastage and draft perfect patterns for blouses, suits and kurtis that fit beautifully.",
    icon: "ruler",
    duration: "1 Month",
    topics: ["Taking Body Measurements", "Fabric Cutting", "Making Blouse, Suit & Kurti Patterns"],
  },
  {
    slug: "stitching-and-tailoring",
    categorySlug: "fashion-designing-courses",
    title: "Stitching & Tailoring",
    focus: "stitching and tailoring",
    extraKeywords: [
      "tailoring course in Chandigarh",
      "suit stitching classes in Chandigarh",
      "blouse stitching course in Chandigarh",
      "fashion designing and tailoring course",
    ],
    shortDescription: "Stitch salwar suits, kurtis, shirts, blouses and pants.",
    description:
      "Turn patterns into finished garments in our Stitching & Tailoring course. Learn professional stitching of salwar suits, kurtis and shirts, blouses and pants with neat finishing — ideal for starting your own boutique or tailoring business.",
    icon: "shirt",
    duration: "2 Months",
    topics: ["Salwar Suit Stitching", "Kurti & Shirt Stitching", "Blouse & Pant Stitching"],
  },
  {
    slug: "embroidery-and-suit-designing",
    categorySlug: "fashion-designing-courses",
    title: "Embroidery & Suit Designing",
    focus: "embroidery",
    extraKeywords: [
      "hand embroidery course in Chandigarh",
      "machine embroidery course in Chandigarh",
      "gota patti work classes",
      "suit designing course in Chandigarh",
    ],
    shortDescription: "Hand embroidery, machine embroidery, gota patti and lace work.",
    description:
      "Add value and beauty to every outfit with our Embroidery & Suit Designing course. Master hand embroidery, machine embroidery, traditional gota patti work and lace work to design stunning suits and festive wear.",
    icon: "flower",
    duration: "1 Month",
    topics: ["Hand Embroidery", "Machine Embroidery", "Gota Patti Work", "Lace Work"],
  },
  {
    slug: "fabric-and-colour-knowledge",
    categorySlug: "fashion-designing-courses",
    title: "Fabric & Colour Knowledge",
    focus: "fabric and colour",
    extraKeywords: [
      "textile designing course in Chandigarh",
      "fabric knowledge course",
      "colour combination for fashion designing",
      "fashion designing course in Chandigarh",
    ],
    shortDescription: "Fabric identification, types of fabrics and colour combinations.",
    description:
      "A great designer knows their fabrics. Learn fabric identification, the different types of fabrics and where to use them, and the art of colour combination so every design you create looks professional and market-ready.",
    icon: "layers",
    duration: "15 Days",
    topics: ["Fabric Identification", "Types of Fabrics", "Colour Combination"],
  },
  {
    slug: "advanced-dress-designing",
    categorySlug: "fashion-designing-courses",
    title: "Advanced Dress Designing",
    focus: "advanced dress designing",
    extraKeywords: [
      "lehenga designing course in Chandigarh",
      "bridal dress designing course in Chandigarh",
      "party wear suit designing course",
      "kurti designing course in Chandigarh",
      "best fashion designing course in Chandigarh",
    ],
    shortDescription: "Lehenga, party wear suit, bridal dress and kurti designing.",
    description:
      "Take your skills to the professional level with Advanced Dress Designing. Design lehengas, party wear suits, bridal dresses and designer kurtis from concept to final garment, and build a portfolio that impresses clients and boutiques.",
    icon: "crown",
    duration: "2 Months",
    level: "Advanced",
    topics: [
      "Lehenga Designing",
      "Party Wear Suit Designing",
      "Bridal Dress Designing",
      "Bridal Design Development",
      "Kurti Designing",
    ],
    featured: true,
  },

  // ---------------- Computer ----------------
  {
    slug: "basic-computer-course",
    categorySlug: "computer-courses",
    title: "Basic Computer Course",
    focus: "basic computer",
    extraKeywords: [
      "computer course for beginners in Chandigarh",
      "computer fundamentals course",
      "internet and email course",
      "best computer institute in Chandigarh",
    ],
    shortDescription: "Computer fundamentals, typing, internet, email and file management.",
    description:
      "Our Basic Computer Course is perfect for beginners, students and homemakers. Learn computer fundamentals, typing, using the internet and email, and creating and saving files — everything you need to use a computer confidently at home or work.",
    icon: "monitor",
    duration: "1 Month",
    level: "Beginner",
    topics: ["Computer Fundamentals", "Typing", "Internet & Email", "File Creation & Saving"],
    featured: true,
  },
  {
    slug: "ms-office-course",
    categorySlug: "computer-courses",
    title: "MS Office Course",
    focus: "MS Office",
    extraKeywords: [
      "MS Word course in Chandigarh",
      "MS Excel course in Chandigarh",
      "PowerPoint course in Chandigarh",
      "office automation course",
    ],
    shortDescription: "MS Word, MS Excel, PowerPoint and other MS Office applications.",
    description:
      "Build in-demand office skills with our MS Office course. Learn MS Word for documents, MS Excel for data and calculations, PowerPoint for presentations and other MS Office applications used in every office and business.",
    icon: "file",
    duration: "2 Months",
    topics: ["MS Word", "MS Excel", "PowerPoint", "MS Office Applications"],
  },
  {
    slug: "tally-with-gst-course",
    categorySlug: "computer-courses",
    title: "Tally with GST",
    focus: "Tally with GST",
    extraKeywords: [
      "Tally course in Chandigarh",
      "Tally Prime course in Chandigarh",
      "GST course in Chandigarh",
      "accounting course in Chandigarh",
      "bookkeeping course",
    ],
    shortDescription: "Bill generation, GST knowledge, accounting and bookkeeping.",
    description:
      "Get job-ready for accounts roles with our Tally with GST course. Learn bill generation, GST concepts and returns, accounting and bookkeeping in Tally with practical business examples.",
    icon: "calculator",
    duration: "3 Months",
    topics: ["Bill Generation", "GST Knowledge", "Accounting & Bookkeeping"],
    featured: true,
  },
  {
    slug: "typing-course",
    categorySlug: "computer-courses",
    title: "Typing Course",
    focus: "typing",
    extraKeywords: [
      "English typing course in Chandigarh",
      "Hindi typing course in Chandigarh",
      "Punjabi typing course in Chandigarh",
      "typing speed course",
    ],
    shortDescription: "English, Hindi and Punjabi typing with speed improvement.",
    description:
      "Improve your typing for government exams, data entry and office jobs. Our Typing Course covers English typing, Hindi and Punjabi typing and focused typing speed improvement with regular speed tests.",
    icon: "keyboard",
    duration: "1 Month",
    topics: ["English Typing", "Hindi & Punjabi Typing", "Typing Speed Improvement"],
  },
  {
    slug: "advanced-excel-course",
    categorySlug: "computer-courses",
    title: "Advanced Excel",
    focus: "advanced Excel",
    extraKeywords: [
      "Excel course in Chandigarh",
      "data entry course in Chandigarh",
      "pivot table course",
      "MIS Excel course in Chandigarh",
    ],
    shortDescription: "Excel formulas, data entry, charts, reports and pivot tables.",
    description:
      "Master Excel for office and MIS jobs. Learn powerful Excel formulas, accurate data entry, charts and reports and pivot tables to analyse data and present it professionally.",
    icon: "chart",
    duration: "1 Month",
    level: "Intermediate",
    topics: ["Excel Formulas", "Data Entry", "Charts & Reports", "Pivot Table"],
  },

  // ---------------- Sewing ----------------
  {
    slug: "sewing-course",
    categorySlug: "sewing-courses",
    title: "Complete Sewing Course",
    focus: "sewing",
    extraKeywords: [
      "best sewing course in Chandigarh",
      "stitching course in Chandigarh",
      "silai course in Chandigarh",
      "tailoring classes for ladies",
      "suit stitching course in Chandigarh",
    ],
    shortDescription: "From basic hand and machine stitching to finished suits, kurtis and blouses.",
    description:
      "Our Complete Sewing Course takes you from zero to stitching full garments. Learn hand and machine stitching, body measurements, fabric cutting and finishing, then stitch salwars, suits, kurtis, blouses, pants and pajamas with neck and sleeve designs — perfect for home tailoring or starting a boutique.",
    icon: "needle",
    duration: "3 Months",
    level: "Beginner to Advanced",
    topics: [
      "Basic Sewing",
      "Hand Stitching",
      "Machine Stitching",
      "Taking Body Measurements",
      "Fabric Cutting",
      "Seam & Hem Finishing",
      "Button & Zip Stitching",
      "Salwar Stitching",
      "Suit Stitching",
      "Kurti Stitching",
      "Blouse Stitching",
      "Pant & Pajama Stitching",
      "Neck & Sleeve Designing",
      "Garment Finishing",
    ],
    featured: true,
  },
];

export const seedCourses: Course[] = courseInputs.map((c, i) => course(c, i + 1));

export const seedDatabase: Database = {
  settings: {
    siteName: "Goodwill Academy",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    email: "info@goodwillacademy.in",
    address: "SCO 00, Sector 00, Chandigarh",
    city: "Chandigarh",
    hours: "Mon – Sat: 9:00 AM – 7:00 PM",
    mapEmbedUrl: "",
    instagram: "",
    facebook: "",
    youtube: "",
    signatory1Name: "",
    signatory1Title: "Course Instructor",
    signatory2Name: "",
    signatory2Title: "Director, Goodwill Academy",
  },
  categories: seedCategories,
  courses: seedCourses,
  enquiries: [],
  students: [],
  attendance: {},
  certificates: [],
};
