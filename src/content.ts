export const site = {
  name: "Mike Gecawicz",
  role: "Software Engineer & Creative Technologist",
  location: "Cary, NC",
  metaDescription:
    "Mike Gecawicz, software engineer & creative technologist in Cary, NC.",
  coords: "35.7915° N / 78.7811° W",
  email: "mike@mkgz.me",
};

export const about = {
  intro: [
    "I studied New Media and Computer Science at the University of Maine, which turned out to be a great excuse to never pick a lane. Since school I've built backend services for TV advertising, shipped an iOS app with a startup I co-founded, and spent two years in a research lab that ended with my name on a patent application for a device that simulates flavor. I'm still not entirely sure how that last one happened.",
    "These days I lead an engineering team and spend most of my working hours somewhere in AWS. Nights are for Blender physics sims, tiny WebAssembly experiments, and whatever algorithm is currently stuck in my head.",
    "Mostly I just like making things that work well and are fun to touch. This site is my attempt at doing both at once.",
  ],
  currently: [
    { label: "Role", value: "Director of Software Engineering" },
    { label: "Company", value: "AmbientSkye" },
    { label: "Base", value: "Cary, North Carolina" },
    { label: "Learning", value: "Rust · x86 assembly · Svelte" },
    { label: "Certified", value: "AWS Cloud Practitioner" },
  ],
};

export type Job = {
  company: string;
  role: string;
  span: string;
  where: string;
  notes: string[];
  artifacts?: { label: string; detail: string; href?: string }[];
};

export const jobs: Job[] = [
  {
    company: "AmbientSkye",
    role: "Director of Software Engineering",
    span: "Now",
    where: "Cary, NC",
    notes: [
      "I run engineering for a commercial intelligence platform built for pharma and life sciences teams. Architecture, delivery, hiring, and a lot of learning on the job.",
    ],
  },
  {
    company: "INVIDI Technologies",
    role: "Software Developer",
    span: "2021 – 2025",
    where: "Princeton, NJ",
    notes: [
      "Built and ran services for targeted ad decisioning on live and streamed TV. The kind of system where milliseconds and correctness both matter.",
    ],
  },
  {
    company: "Bridge Networking",
    role: "CTO / Co-founder",
    span: "2020 – 2021",
    where: "San Diego, CA",
    notes: [
      "Co-founded a small social startup. Designed the React Native iOS app and led our dev team through launch.",
    ],
  },
  {
    company: "MIM Laboratories",
    role: "Product Designer / Electrical Engineer",
    span: "2019 – 2021",
    where: "University of Maine",
    notes: [
      "Built research prototypes for sensory technology: application-specific microcontrollers, 3D CAD, and SLA print pipelines. In short, hardware that lets you taste a virtual coffee.",
    ],
    artifacts: [
      {
        label: "US Patent App 63/056,202",
        detail:
          "Methods and Systems for Augmenting and/or Stimulating Flavor (co-creator)",
      },
      {
        label: "ICMI '20, published",
        detail:
          "Influence of Electric Taste, Smell, Color, and Thermal Sensory Modalities on Virtual Flavor Perception (co-author)",
        href: "https://dl.acm.org/doi/10.1145/3382507.3418862",
      },
    ],
  },
  {
    company: "ASAP Media Services",
    role: "Project Manager / UX / Developer",
    span: "2018 – 2019",
    where: "University of Maine",
    notes: [
      "Led research and client projects: mobile apps, VR, physical computing, and an NSF-funded climate visualization platform called iSWOOP.",
    ],
  },
  {
    company: "Trident Communication Technology",
    role: "Mechanical Designer",
    span: "2013 – 2021",
    where: "Acton, MA",
    notes: [
      "Designed prototype concepts for headsets and communication badges, plus the logo the company later trademarked.",
    ],
  },
];

export const education = [
  {
    school: "University of Maine",
    detail: "B.S. New Media + Computer Science · Magna cum Laude · 2017–2021",
  },
  {
    school: "ELISAVA · Barcelona",
    detail: "Advanced Principles of Design · study abroad · 2020",
  },
];

export type Project = {
  title: string;
  kind: string;
  blurb: string;
  href?: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    title: "Virtual Flavor Device",
    kind: "Research / Hardware",
    blurb:
      "A device that simulates the flavor of food and drink by layering electric taste, smell, color, and thermal stimuli over plain water. We filed a provisional patent, and the study behind it was published at ICMI '20.",
    href: "https://dl.acm.org/doi/10.1145/3382507.3418862",
    tags: ["Patent", "ICMI 2020", "Embedded"],
  },
  {
    title: "SilverBuddy",
    kind: "Serverless / IaC",
    blurb:
      "A silver spot price and bullion inventory tracker running on Lambda, API Gateway, DynamoDB, S3, and CloudWatch, with every resource declared in Terraform.",
    href: "https://github.com/mgecawicz/silver-buddy",
    tags: ["AWS", "Terraform", "2025"],
  },
  {
    title: "UNO R4 2-Digit Display",
    kind: "Open Source / C++",
    blurb:
      "An Arduino library that draws 2-digit numbers on the UNO R4's LED matrix. Small, documented, and running in other people's projects, which is the part I like.",
    href: "https://github.com/mgecawicz/Arduino_Uno_R4_2_Digit_Display",
    tags: ["Arduino", "Library", "C++"],
  },
  {
    title: "3D Map of Jersey City",
    kind: "3D Printing",
    blurb:
      "The entire city of Jersey City as a printable 3D model, broken into ten tiles. A few hundred people have downloaded a piece of the skyline.",
    href: "https://www.printables.com/model/952819",
    tags: ["Printables", "GIS", "Blender"],
  },
  {
    title: "A*Maze (C++)",
    kind: "Algorithms",
    blurb:
      "A* pathfinding through recursively backtracked mazes, visualized in raw ANSI escapes in the terminal. The demo above is this idea, reborn on canvas.",
    href: "https://github.com/mgecawicz/AStarMaze",
    tags: ["C++", "Pathfinding"],
  },
  {
    title: "3D Game of Life",
    kind: "Creative Coding",
    blurb:
      "Conway's Game of Life lifted into three dimensions with Processing. Emergence you can orbit around.",
    href: "https://github.com/mgecawicz/3DConwaysGameOfLife",
    tags: ["Processing", "Cellular Automata"],
  },
  {
    title: "Bridge Network",
    kind: "iOS / React Native",
    blurb:
      "One profile for all your socials, shared by link or QR code. We shipped it to the App Store in 2020 and grew it through SDSU's ZIP Launchpad.",
    href: "https://thedailyaztec.com/105353/news/sdsu-students-create-new-app-to-bridge-others-with-networking-opportunities/",
    tags: ["React Native", "CTO", "Startup"],
  },
  {
    title: "Friend Finder",
    kind: "Wearable / Physical Computing",
    blurb:
      "A physical social network: wearable hardware built to connect people face-to-face at very large scale, developed at ASAP Media Services.",
    href: "https://github.com/mgecawicz/FriendFinderMaster",
    tags: ["Hardware", "IoT"],
  },
];

export const gallery = {
  stills: [
    { src: "/media/CITY.jpg", alt: "Procedural city render" },
    { src: "/media/REACH.jpg", alt: "Reach, 3D render" },
    { src: "/media/skull2.jpg", alt: "Skull study render" },
    { src: "/media/tubes.jpg", alt: "Tubes, a geometry study" },
    { src: "/media/dropFinal.jpg", alt: "Fluid drop simulation" },
    { src: "/media/geoWalker.jpg", alt: "Geometric walker" },
    { src: "/media/house2-copy.jpg", alt: "Architectural render" },
    { src: "/media/catch.jpg", alt: "Catch, render" },
    { src: "/media/kayboard.jpg", alt: "Keyboard render" },
    { src: "/media/64_1.jpg", alt: "Abstract render 64" },
    { src: "/media/23_1.jpg", alt: "Abstract render 23" },
    { src: "/media/39_1.jpg", alt: "Abstract render 39" },
  ],
  loops: [
    { src: "/media/cloth.mp4", label: "Cloth sim" },
    { src: "/media/WAVEY.mp4", label: "Wave field" },
    { src: "/media/cuboid.mp4", label: "Cuboid rigid bodies" },
    { src: "/media/moonsystem_00001.mp4", label: "Moon system" },
  ],
};

export type Download = {
  name: string;
  blurb: string;
  version: string;
  requires: string;
  size: string;
  /** file lives in public/downloads/ */
  href: string;
};

// Drop .dmg files into public/downloads/ and list them here.
// The Software section only renders when this array is non-empty.
export const downloads: Download[] = [
  {
    name: "SVG Stencil",
    blurb:
      "A native Mac app that turns any SVG into a 3D printable stencil. Choose a cut-out plate or extruded artwork, let it bridge loose islands so your O's keep their middles, and export a watertight STL or OBJ ready for the slicer. SwiftUI and SceneKit, zero dependencies, and there's a headless CLI hiding in the same binary.",
    version: "v1.0",
    requires: "macOS 13+",
    size: "772 KB",
    href: "/downloads/SVG-Stencil.dmg",
  },
];

export const network = [
  { label: "blog.mkgz.me", href: "https://blog.mkgz.me" },
  { label: "any.mkgz.me", href: "https://any.mkgz.me" },
  { label: "go.mkgz.me", href: "https://go.mkgz.me" },
  { label: "drop.mkgz.me", href: "https://drop.mkgz.me" },
];

export const socials = [
  { label: "GitHub", href: "https://github.com/mgecawicz" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/michael-gecawicz-39a14490",
  },
  { label: "YouTube", href: "https://www.youtube.com/c/MikeGecawicz" },
  { label: "Printables", href: "https://www.printables.com/@MichaelGecaw_1054361" },
  { label: "Instagram", href: "https://www.instagram.com/mgswich/" },
  { label: "TikTok", href: "https://www.tiktok.com/@the_mgec" },
];

export const sections = [
  { id: "top", index: "00", label: "Intro" },
  { id: "about", index: "01", label: "About" },
  { id: "experience", index: "02", label: "Experience" },
  { id: "lab", index: "03", label: "Lab" },
  { id: "work", index: "04", label: "Work" },
  ...(downloads.length > 0
    ? [{ id: "software", index: "05", label: "Software" }]
    : []),
  { id: "contact", index: downloads.length > 0 ? "06" : "05", label: "Contact" },
];
