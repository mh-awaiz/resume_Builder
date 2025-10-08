"use client";

import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "../../../../lib/supabase/browser";
import { useRouter } from "next/navigation";
import { categorizeSkills } from "../../../utils/categorizeSkills";

export default function ResumeForm({ user }: { user: any }) {
  const router = useRouter();
  const supabase = createClient();
  const [limitReached, setLimitReached] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  // Personal Info
  const [fullname, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [number, setNumber] = useState("");
  const [link, setLink] = useState("");

  // Job Description
  const [jobTitle, setJobTitle] = useState("");
  const [objective, setObjective] = useState("");

  // Options
  const [isFresher, setIsFresher] = useState(false);
  const [isNonTech, setIsNonTech] = useState(false);

  const isTechJob = !isNonTech;

  // Data Interfaces
  interface Skill {
    name: string;
    level: string;
    years: string;
  }

  interface Education {
    degree: string;
    field: string;
    institution: string;
    year: string;
  }

  interface Certification {
    name: string;
    issuer: string;
    date: string;
  }

  interface Project {
    title: string;
    description: string;
    tech: string;
    date: string;
  }

  interface Experience {
    company: string;
    role: string;
    duration: string;
    description: string;
    link?: string;
  }

  // State Hooks
  const [skills, setSkills] = useState<Skill[]>([
    { name: "", level: "Beginner", years: "" },
  ]);
  const [softSkills, setSoftSkills] = useState([{ name: "", description: "" }]);
  const [education, setEducation] = useState<Education[]>([
    { degree: "", field: "", institution: "", year: "" },
  ]);
  const [certifications, setCertifications] = useState<Certification[]>([
    { name: "", issuer: "", date: "" },
  ]);
  const [experience, setExperience] = useState<Experience[]>([
    { company: "", role: "", duration: "", description: "", link: "" },
  ]);

  const [languages, setLanguages] = useState<string[]>([""]);

  const [projects, setProjects] = useState([
    { name: "", techStack: "", description: "" },
  ]);
  const [achievements, setAchievements] = useState([
    { title: "", description: "" },
  ]);

  // Handlers
  const handleEducationChange = (
    idx: number,
    field: keyof Education,
    value: string
  ) => {
    const updated = [...education];
    updated[idx][field] = value;
    setEducation(updated);
  };

  const handleCertificationChange = (
    idx: number,
    field: "name" | "issuer" | "date",
    value: string
  ) => {
    const updated = [...certifications];
    updated[idx][field] = value;
    setCertifications(updated);
  };

  const handleExperienceChange = (
    idx: number,
    field: keyof Experience,
    value: string
  ) => {
    const updated = [...experience];
    updated[idx][field] = value;
    setExperience(updated);
  };

  const handleProjectChange = (
    idx: number,
    field: "name" | "techStack" | "description",
    value: string
  ) => {
    const updated = [...projects];
    updated[idx][field] = value;
    setProjects(updated);
  };

  const handleAchievementChange = (
    idx: number,
    field: "title" | "description",
    value: string
  ) => {
    const updated = [...achievements];
    updated[idx][field] = value;
    setAchievements(updated);
  };

  // Categorized Skills
  const categorizedSkills = isNonTech
    ? {}
    : categorizeSkills(skills.map((skill) => skill.name));

  // Input helper
  const inputClass = (hasValue: boolean) =>
    `outline-none bg-transparent border-2 p-2 rounded-md w-full text-text transition-colors duration-200 focus:border-primary ${
      hasValue ? "border-primary" : "border-primary/60"
    }`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login to create a resume.");
        router.push("/login");
        return;
      }

      // Check existing resumes
      const { data: existingFiles, error: listError } = await supabase.storage
        .from("markdown")
        .list(user.id, { limit: 100 });

      if (listError) console.error("Error listing resumes:", listError.message);

      // Check if user is premium
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      if (profileError)
        console.error("Error fetching profile:", profileError.message);

      const isPremium = profile?.is_premium;

      // Restrict creation for free users
      if (!isPremium && existingFiles && existingFiles.length >= 3) {
        alert(
          "⚠️ Free users can create only 3 resumes. Upgrade to Lifetime to create more."
        );
        router.push("/pricing");
        setLoading(false);
        return;
      }

      // Prepare resume data
      const resumeData = {
        personalInfo: { fullname, location, number, link },
        jobDescription: { jobTitle, objective },
        skills: isTechJob ? categorizedSkills : [],
        softSkills: !isTechJob ? softSkills || [] : [],
        education,
        certifications: isFresher ? [] : certifications,
        experience: isFresher || isNonTech ? [] : experience,
        projects: isTechJob && !isFresher ? projects : [],
        achievements: !isTechJob ? achievements : [],
        languages,
        isFresher,
        isNonTech,
      };

      console.log("Generated Before Api call", resumeData);

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
      const genAI = new GoogleGenerativeAI(apiKey);

      const queryString = `
SYSTEM / DNA PROMPT:

You are a professional resume generator and enhancement model.
Produce ONLY one valid, self-contained HTML document (<!doctype html> ... </html>) representing a clean, modern, ATS-optimized resume.
Follow the rules below and maintain EXACT formatting and section order.

=========================================
DATA ENRICHMENT LOGIC
=========================================
If any input field from resumeData is missing, incomplete, or too short (< 50–100 words), intelligently generate realistic and industry-relevant content based on:
- The user's job title, field, and skill set.
- Professional tone suitable for top-tier companies.
- Avoid placeholders or generic filler text.

- For jobDescription / objective:
  - Generate a concise, powerful 2–3 sentence summary aligned with the job title and skills.
  - Emphasize achievements, measurable results, and motivation.

- For missing experience:
  - Generate realistic and role-appropriate bullet points (avoid fake company names).
  - Include only if user is experienced and the role is tech-related.

- For missing projects:
  - Generate concise, realistic project descriptions only for tech jobs.
  - Include technologies used, measurable results, and role-specific achievements.
  - Omit projects for non-tech roles; use Achievements instead.

- For missing achievements:
  - Generate role-appropriate achievements for non-tech jobs.
  - Include awards, recognitions, or measurable contributions.
  - Omit achievements for tech jobs if projects exist.

- For missing certifications or education details:
  - Generate reasonable placeholders (e.g., “Google Certified – Digital Marketing Fundamentals”).

- Skills handling:
  - Use the categorizedSkills object from input data directly. Do not re-categorize unless missing.
  - If any category is empty, optionally enrich it with relevant skills based on jobTitle.
  - For freshers, include only the categories provided in categorizedSkills; hide Experience if applicable.
  - For non-tech roles, display Soft Skills, Management, and Tools exactly as provided in categorizedSkills.

- Always prefer real-world professional language aligned with the resume’s domain.
-Based on given data identify whether the user is fresher and based on that generate resume may this same goes for tech and non-tech jobs.
-MOST IMPORTANT: Sometime what happen is the content is to much and we need to create resume in one page itself sometime certifications and education section are cut which dont want it to happen at that time we can change the layout little bit we can remove unwanted spacing and we make text 2% smaller that default size.but make sure what details are given should in in one page exactly.
-Also added simple margin inside the sub section as well. 

=========================================
SMART SKILL SEGMENTATION LOGIC
=========================================
When displaying skills, automatically group and label them based on their relevance:
- For technical resumes:
  - Categorize into **Frontend**, **Backend**, **Database**, **DevOps**, **Design/UI**, **Tools/Other**.
  - Example:
    Frontend: React, Next.js, Tailwind CSS, GSAP
    Backend: Node.js, Express.js
    Database: MongoDB, PostgreSQL
    Tools: Git, VS Code, Postman
- For freshers:
  - Still segment based on recognized technologies, even if few skills are listed.
  - Add one or two additional relevant beginner-level tools (e.g., Git, VS Code) if needed.
- For non-technical roles:
  - Segment into **Soft Skills**, **Management Skills**, and **Tools** (e.g., Communication, Team Leadership, MS Office, Canva).
- Always display segmented skills under clear headings.
- Maintain a clean, ATS-safe text-only format without bullets — just bold category labels and comma-separated skills.
- If skill data is insufficient or too general, enrich it with typical skills for that field inferred from jobTitle and jobDescription.
- Use the categorizedSkills object from resumeData directly.
- Maintain category headings exactly as provided (bold) and list skills comma-separated.
- If a category is empty, optionally enrich it with typical skills inferred from jobTitle and jobDescription.
- Do not re-categorize or reorder skills beyond the provided categories.
- Always display segmented skills under clear headings.
- Maintain ATS-safe text-only format.

=========================================
OUTPUT RULES
=========================================
- Output ONLY valid HTML. No Markdown, no backticks, no explanations, no comments.
- Use semantic HTML5 tags (<header>, <main>, <section>, <h1>-<h3>, <ul>, <li>, <p>).
- Keep structure minimal and ATS-safe: text-only layout, no icons or graphics.
- Include <style> in <head> for CSS.
- Use font stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif.
- Colors:
  - Headings / accent color: #155dfc
  - Body text: #222
- Layout: left-aligned text except contact info (centered) and right-aligned dates.
- Use consistent vertical spacing between sections (12–20px).
- Dates format: DD/MM/YYYY or YYYY (if only year provided).
- All important dates should appear on the RIGHT side of the section (use flexbox for alignment).
- Skills should be formatted by category (as per segmentation logic).
- Important keywords should be bolded (<strong>keyword</strong>).
- If a section has no data, omit it.
- For freshers → Hide Experience section.
- For experienced → Include Experience section if provided.
- For non-tech roles → Prefer soft skills; hide technical projects unless provided.
-Any link add should be converted in hypertext link example in project section.

=========================================
EXPECTED VISUAL ORDER
=========================================
1. Name + Title
2. Contact Info
3. Objective
4. Skills (segmented)
5. Experience (optional for freshers)
6. Projects
7. Education
8. Certifications (optional)
9. Languages (optional)

=========================================
INPUT FORMAT
=========================================
You will receive resume data in JSON format:
${JSON.stringify(resumeData)}

=========================================
HTML OUTPUT STRUCTURE
=========================================
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Resume - [name]</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #222;
      margin: 8px;
      line-height: 1.4;
    }
    header {
      text-align: center;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 2px;
      font-weight: 700;
      color: #155dfc;
    }
    h1, p {
      font-size: 24px;
      margin-bottom: 2px;
      font-weight: 500;
    }
    h2 {
      color: #155dfc;
      font-size: 15px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 2px;
      margin-top: 14px;
      text-transform: uppercase;
    }
    h3 {
      font-size: 13px;
      margin: 4px 0 2px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
    }
    p, ul {
      margin: 2px 0 6px;
      font-size: 12.5px;
    }
    ul {
      padding-left: 16px;
    }
    .contact {
      color: #444;
      font-size: 12px;
      margin: 4px 0 6px;
    }
    .contact span {
      margin: 0 4px;
    }
    .meta {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin: 0;
      font-size: 12.5px;
    }
    .date {
      font-size: 12px;
      color: #555;
      white-space: nowrap;
      min-width: 50px;
      text-align: right;
      margin-left: 6px;
    }
    .section {
      padding: 0 3px; 
    }
    .experience-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .experience-item .date {
      min-width: 50px;
      margin-right: 5px;
    }
  </style>
</head>
<body>
  <header>
    <h1>[Full Name]</h1>
    <p>[Job Title]</p>
    <p class="contact">
      | [Phone] <span>|</span> [Location] <span>|</span> <a href="[Portfolio]">[Portfolio]</a>
    </p>
  </header>

  <main>
    <section id="objective">
      <h2>Objective</h2>
      <p>[Auto-generated or provided summary text]</p>
    </section>

    <section id="skills">
      <h2>Skills</h2>
      <p>
        <strong>Frontend:</strong> React, Next.js, Tailwind CSS, GSAP<br>
        <strong>Backend:</strong> Node.js, Express.js<br>
        <strong>Database:</strong> MongoDB<br>
        <strong>Tools:</strong> Git, VS Code, Postman
      </p>
    </section>

    <section id="experience">
      <h2>Experience</h2>
      <article>
        <h3>[Role / Position] <span class="date">[Start – End]</span></h3>
        <p class="meta">[Company Name]</p>
        <ul>
          <li>[Generated or provided bullet point]</li>
          <li>[Generated or provided bullet point]</li>
        </ul>
      </article>
    </section>

    <section id="projects">
      <h2>Projects</h2>
      <article>
        <h3>[Project Name] <span class="date">[Year]</span></h3>
        <ul>
          <li>[Generated or provided project description]</li>
        </ul>
      </article>
    </section>

    <section id="education">
      <h2>Education</h2>
      <article>
        <h3>[Institute Name] <span class="date">[Year]</span></h3>
        <p>[Degree or Program]</p>
      </article>
    </section>
  </main>
</body>
</html>
=========================================
END OF PROMPT.
Generate the HTML resume using the input data, enriching and segmenting content automatically for professional, industry-aligned output.
`;

      console.log(resumeData);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(queryString);
      const text = result.response.text();
      console.log("Gemini output:", text);

      // Upload to Supabase storage
      const file = new Blob([text], { type: "text/html" });
      const fileName = `resume-${Date.now()}.html`;
      const filePath = `${user.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("markdown")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (error) console.error("Upload failed:", error.message);
      else console.log("Uploaded successfully:", data);

      // Redirect after success
      router.push("/dashboard/collections");
    } catch (err) {
      console.error("Resume generation/upload failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);

      // Reset form fields
      setFullName("");
      setLocation("");
      setNumber("");
      setLink("");
      setJobTitle("");
      setObjective("");
      setSkills([{ name: "", level: "Beginner", years: "" }]);
      setEducation([{ degree: "", field: "", institution: "", year: "" }]);
      setCertifications([{ name: "", issuer: "", date: "" }]);
      setCertifications([{ name: "", issuer: "", date: "" }]);
      setProjects([{ name: "", techStack: "", description: "" }]);
      setExperience([
        { company: "", role: "", duration: "", description: "", link: "" },
      ]);
      setAchievements([{ title: "", description: "" }]);
      setLanguages([""]);
      setIsFresher(false);
      setIsNonTech(false);
    }
  };

  //Plan restriction logic
  //PLEASE DO NOT DELETE THIS BLOCK OF CODE - IT HANDLES THE FREE USER LIMIT RESTRICTION

  useEffect(() => {
    const checkLimit = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: files } = await supabase.storage
        .from("markdown")
        .list(user.id, { limit: 100 });

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      const premium = profile?.is_premium;
      setIsPremium(premium);

      if (!premium && files && files.length >= 3) {
        setLimitReached(true);
      }
    };

    checkLimit();
  }, []);
  if (limitReached && !isPremium) {
    return (
      <main className="min-h-screen flex justify-center items-center bg-white p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-primary">
          <h1 className="text-2xl font-bold text-primary mb-3">
            Free Limit Reached 🚫
          </h1>
          <p className="text-gray-600 mb-6">
            You’ve reached your limit of <strong>3 free resumes</strong>.
            Upgrade to our{" "}
            <span className="text-primary font-semibold">Lifetime Plan </span>
            and unlock unlimited resume generations.
          </p>

          <div className="bg-blue-50 p-4 rounded-xl mb-6 flex justify-center items-center flex-col">
            <h2 className="text-lg font-semibold text-primary mb-2">
              Lifetime Plan
            </h2>
            <div className="flex justify-center items-start flex-col">
              <p className="text-gray-700">✅ Unlimited Resume Creations</p>
              <p className="text-gray-700">✅ Access to All Templates</p>
              <p className="text-gray-700">✅ Instant Resume Generation</p>
              <p className="text-gray-700">✅ Premium Support</p>
            </div>

            <h3 className="text-3xl font-bold text-primary mt-3">
              ₹99 <span className="text-sm text-gray-500">one-time</span>
            </h3>
          </div>

          <button
            onClick={() => router.push("/pricing")}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Upgrade to Lifetime
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Already upgraded? Refresh the page to continue.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-primary font-semibold flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-10 p-6 sm:p-8 md:p-10 max-w-5xl mx-auto py-20 bg-background"
      >
        {/* PERSONAL INFORMATION */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullname}
              className={inputClass(!!fullname)}
              placeholder="Full Name"
              required
            />
            <input
              onChange={(e) => setLocation(e.target.value)}
              value={location}
              className={inputClass(!!location)}
              placeholder="Location (City, Country)"
              required
            />
            <input
              onChange={(e) => setNumber(e.target.value)}
              value={number}
              className={inputClass(!!number)}
              placeholder="Phone Number"
              required
            />
            <input
              onChange={(e) => setLink(e.target.value)}
              value={link}
              className={inputClass(!!link)}
              placeholder="Professional Link (LinkedIn / Portfolio)"
            />
          </div>
        </section>

        {/* JOB DESCRIPTION */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Job Description
          </h2>
          <input
            onChange={(e) => setJobTitle(e.target.value)}
            value={jobTitle}
            className={inputClass(!!jobTitle)}
            placeholder="Job Title Applied For"
            required
          />
          <textarea
            onChange={(e) => setObjective(e.target.value)}
            value={objective}
            className={`${inputClass(!!objective)} mt-3`}
            placeholder="Career Objective / Job Description"
            rows={4}
            required
          />
        </section>

        {/* OPTIONS */}
        <section className="flex flex-wrap gap-6 mt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFresher}
              onChange={() => setIsFresher(!isFresher)}
            />
            Fresher
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isNonTech}
              onChange={() => setIsNonTech(!isNonTech)}
            />
            Non-Tech Job
          </label>
        </section>

        {/* SKILLS */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            {isTechJob
              ? isFresher
                ? "Technical Skills (Optional)"
                : "Technical Skills (Required)"
              : isFresher
              ? "Soft Skills (Optional)"
              : "Soft Skills (Required)"}
          </h2>

          {(isTechJob ? skills : softSkills).map((skill, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 relative"
            >
              {/* Skill or Soft Skill Name */}
              <input
                value={skill.name}
                onChange={(e) => {
                  const updated = isTechJob ? [...skills] : [...softSkills];
                  updated[idx].name = e.target.value;
                  if (isTechJob) {
                    setSkills(updated as Skill[]);
                  } else {
                    setSoftSkills(
                      updated as { name: string; description: string }[]
                    );
                  }
                }}
                className={inputClass(!!skill.name)}
                placeholder={isTechJob ? "Skill Name" : "Soft Skill Name"}
                required={!isFresher}
              />

              {isTechJob ? (
                <>
                  {/* Skill Level Dropdown */}
                  <select
                    value={(skill as Skill).level}
                    onChange={(e) => {
                      const updated = [...skills];
                      updated[idx].level = e.target.value;
                      setSkills(updated);
                    }}
                    className={inputClass(!!(skill as Skill).level)}
                    required={!isFresher}
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>

                  {/* Years of Experience Input */}
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={(skill as Skill).years}
                    onChange={(e) => {
                      const updated = [...skills];
                      updated[idx].years = e.target.value;
                      setSkills(updated);
                    }}
                    className={inputClass(!!(skill as Skill).years)}
                    placeholder="Years of Experience"
                    required={!isFresher}
                  />
                </>
              ) : (
                <>
                  {/* Soft Skill Description */}
                  <textarea
                    value={
                      (skill as { name: string; description: string })
                        .description
                    }
                    onChange={(e) => {
                      const updated = [...softSkills];
                      updated[idx].description = e.target.value;
                      setSoftSkills(updated);
                    }}
                    className={`${inputClass(
                      !!(skill as { name: string; description: string })
                        .description
                    )} md:col-span-2 resize-none`}
                    placeholder="Describe this soft skill briefly"
                    rows={2}
                    required={!isFresher}
                  />
                </>
              )}

              {/* Remove Button */}
              {(isTechJob ? skills : softSkills).length > 1 && (
                <button
                  type="button"
                  className="absolute top-0 right-0 text-red-500 font-bold"
                  onClick={() =>
                    isTechJob
                      ? setSkills(skills.filter((_, i) => i !== idx))
                      : setSoftSkills(softSkills.filter((_, i) => i !== idx))
                  }
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {/* Add Another Button */}
          <button
            type="button"
            className="font-semibold text-primary hover:underline"
            onClick={() =>
              isTechJob
                ? setSkills([
                    ...skills,
                    { name: "", level: "Beginner", years: "" },
                  ])
                : setSoftSkills([...softSkills, { name: "", description: "" }])
            }
          >
            + Add Another {isTechJob ? "Skill" : "Soft Skill"}
          </button>
        </section>

        {/* CERTIFICATIONS*/}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            {isFresher
              ? "Certifications (Optional)"
              : "Certifications (Required)"}
          </h2>

          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 relative"
            >
              <input
                value={cert.name}
                onChange={(e) =>
                  handleCertificationChange(idx, "name", e.target.value)
                }
                className={inputClass(!!cert.name)}
                placeholder="Certificate Name"
                required={!isFresher}
              />

              <input
                value={cert.issuer}
                onChange={(e) =>
                  handleCertificationChange(idx, "issuer", e.target.value)
                }
                className={inputClass(!!cert.issuer)}
                placeholder="Issued By"
                required={!isFresher}
              />

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 md:hidden">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={cert.date}
                  onChange={(e) =>
                    handleCertificationChange(idx, "date", e.target.value)
                  }
                  className={`${inputClass(!!cert.date)} w-full`}
                  required={!isFresher}
                />
              </div>

              {certifications.length > 1 && (
                <button
                  type="button"
                  className="absolute top-0 right-0 text-red-500 font-bold"
                  onClick={() =>
                    setCertifications(
                      certifications.filter((_, i) => i !== idx)
                    )
                  }
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="font-semibold text-primary hover:underline"
            onClick={() =>
              setCertifications([
                ...certifications,
                { name: "", issuer: "", date: "" },
              ])
            }
          >
            + Add Another Certification
          </button>
        </section>

        {/* PROJECTS / ACHIEVEMENTS */}
        {isTechJob ? (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {isFresher ? "Projects (Optional)" : "Projects (Required)"}
            </h2>

            {projects.map((proj, idx) => (
              <div key={idx} className="space-y-3 mb-4 relative">
                <input
                  value={proj.name}
                  onChange={(e) =>
                    handleProjectChange(idx, "name", e.target.value)
                  }
                  className={inputClass(!!proj.name)}
                  placeholder="Project Name"
                  required={!isFresher}
                />
                <input
                  value={proj.techStack}
                  onChange={(e) =>
                    handleProjectChange(idx, "techStack", e.target.value)
                  }
                  className={inputClass(!!proj.techStack)}
                  placeholder="Technologies Used"
                  required={!isFresher}
                />
                <textarea
                  value={proj.description}
                  onChange={(e) =>
                    handleProjectChange(idx, "description", e.target.value)
                  }
                  className={inputClass(!!proj.description)}
                  placeholder="Project Description / Achievements"
                  rows={3}
                  required={!isFresher}
                />
                {projects.length > 1 && (
                  <button
                    type="button"
                    className="absolute top-0 right-0 text-red-500 font-bold"
                    onClick={() =>
                      setProjects(projects.filter((_, i) => i !== idx))
                    }
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="font-semibold text-primary hover:underline"
              onClick={() =>
                setProjects([
                  ...projects,
                  { name: "", techStack: "", description: "" },
                ])
              }
            >
              + Add Another Project
            </button>
          </section>
        ) : (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Achievements (Optional)
            </h2>

            {achievements.map((ach, idx) => (
              <div key={idx} className="space-y-3 mb-4 relative">
                <input
                  value={ach.title}
                  onChange={(e) =>
                    handleAchievementChange(idx, "title", e.target.value)
                  }
                  className={inputClass(!!ach.title)}
                  placeholder="Achievement Title"
                />
                <textarea
                  value={ach.description}
                  onChange={(e) =>
                    handleAchievementChange(idx, "description", e.target.value)
                  }
                  className={inputClass(!!ach.description)}
                  placeholder="Brief Description"
                  rows={3}
                />
                {achievements.length > 1 && (
                  <button
                    type="button"
                    className="absolute top-0 right-0 text-red-500 font-bold"
                    onClick={() =>
                      setAchievements(achievements.filter((_, i) => i !== idx))
                    }
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="font-semibold text-primary hover:underline"
              onClick={() =>
                setAchievements([
                  ...achievements,
                  { title: "", description: "" },
                ])
              }
            >
              + Add Another Achievement
            </button>
          </section>
        )}

        {/* EDUCATION */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 relative"
            >
              <input
                value={edu.degree}
                onChange={(e) =>
                  handleEducationChange(idx, "degree", e.target.value)
                }
                className={inputClass(!!edu.degree)}
                placeholder="Degree Type"
              />
              <input
                value={edu.field}
                onChange={(e) =>
                  handleEducationChange(idx, "field", e.target.value)
                }
                className={inputClass(!!edu.field)}
                placeholder="Field of Study"
              />
              <input
                value={edu.institution}
                onChange={(e) =>
                  handleEducationChange(idx, "institution", e.target.value)
                }
                className={inputClass(!!edu.institution)}
                placeholder="Institution Name"
              />
              <input
                type="number"
                value={edu.year}
                onChange={(e) =>
                  handleEducationChange(idx, "year", e.target.value)
                }
                className={inputClass(!!edu.year)}
                placeholder="Graduation Year"
              />
              {education.length > 1 && (
                <button
                  type="button"
                  className="absolute top-0 right-0 text-red-500 font-bold"
                  onClick={() =>
                    setEducation(education.filter((_, i) => i !== idx))
                  }
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="font-semibold text-primary hover:underline"
            onClick={() =>
              setEducation([
                ...education,
                { degree: "", field: "", institution: "", year: "" },
              ])
            }
          >
            + Add Another Education
          </button>
        </section>

        {/* EXPERIENCE */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            {isFresher
              ? "Work Experience (Optional)"
              : "Work Experience (Required)"}
          </h2>

          {experience.map((exp, idx) => (
            <div key={idx} className="space-y-3 mb-4 relative">
              <input
                value={exp.company}
                onChange={(e) =>
                  handleExperienceChange(idx, "company", e.target.value)
                }
                className={inputClass(!!exp.company)}
                placeholder="Company Name"
                required={!isFresher} // 🔸 Required only if not fresher
              />
              <input
                value={exp.role}
                onChange={(e) =>
                  handleExperienceChange(idx, "role", e.target.value)
                }
                className={inputClass(!!exp.role)}
                placeholder="Job Role"
                required={!isFresher}
              />
              <input
                value={exp.duration}
                onChange={(e) =>
                  handleExperienceChange(idx, "duration", e.target.value)
                }
                className={inputClass(!!exp.duration)}
                placeholder="Duration"
                required={!isFresher}
              />
              <textarea
                value={exp.description}
                onChange={(e) =>
                  handleExperienceChange(idx, "description", e.target.value)
                }
                className={inputClass(!!exp.description)}
                placeholder="Job Responsibilities / Achievements"
                rows={3}
                required={!isFresher}
              />
              {experience.length > 1 && (
                <button
                  type="button"
                  className="absolute top-0 right-0 text-red-500 font-bold"
                  onClick={() =>
                    setExperience(experience.filter((_, i) => i !== idx))
                  }
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="font-semibold text-primary hover:underline"
            onClick={() =>
              setExperience([
                ...experience,
                { company: "", role: "", duration: "", description: "" },
              ])
            }
          >
            + Add Another Experience
          </button>
        </section>

        {/* SUBMIT */}
        <div className="text-center mt-10">
          <button
            type="submit"
            className="px-8 py-3 bg-primary text-white rounded-md shadow hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Resume"}
          </button>
        </div>
      </form>
    </main>
  );
}
