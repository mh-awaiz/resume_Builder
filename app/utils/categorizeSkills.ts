export const categorizeSkills = (skills: string[]) => {
  const categories: { 
    frontend: string[]; 
    backend: string[]; 
    database: string[]; 
    devops: string[]; 
    design: string[]; 
    soft: string[]; 
    tools: string[]; 
    other: string[]; 
  } = {
    frontend: [],
    backend: [],
    database: [],
    devops: [],
    design: [],
    soft: [],
    tools: [],
    other: [],
  };

  const mapping: Record<string, keyof typeof categories> = {
    // Frontend
    react: "frontend",
    "next js": "frontend",
    "next.js": "frontend",
    vue: "frontend",
    angular: "frontend",
    "tailwind css": "frontend",
    gsap: "frontend",
    "html": "frontend",
    "css": "frontend",
    "javascript": "frontend",
    "typescript": "frontend",

    // Backend
    node: "backend",
    "node.js": "backend",
    express: "backend",
    django: "backend",
    flask: "backend",
    "spring boot": "backend",

    // Database
    mysql: "database",
    mongodb: "database",
    postgresql: "database",
    firebase: "database",
    sqlite: "database",

    // DevOps
    docker: "devops",
    kubernetes: "devops",
    aws: "devops",
    azure: "devops",
    "google cloud": "devops",
    git: "devops",

    // Design
    figma: "design",
    "adobe xd": "design",
    canva: "design",

    // Soft skills
    leadership: "soft",
    communication: "soft",
    teamwork: "soft",
    adaptability: "soft",

    // Tools
    vscode: "tools",
    jira: "tools",
    notion: "tools",
  };

  skills.forEach((skill) => {
    const lower = skill.trim().toLowerCase();
    const category = mapping[lower];
    if (category) categories[category].push(skill);
    else categories.other.push(skill);
  });

  return categories;
};
