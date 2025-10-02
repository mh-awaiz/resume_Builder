"use client";

import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "../../../../lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function ResumeForm({ user }: { user: any }) {
  const router = useRouter();
  const supabase = createClient();

  const [skills, setSkills] = useState([
    { name: "", level: "Beginner", years: "" },
  ]);
  const [education, setEducation] = useState([
    { degree: "", field: "", institution: "", year: "" },
  ]);
  const [certifications, setCertifications] = useState([
    { name: "", issuer: "", date: "" },
  ]);
  const [projects, setProjects] = useState([
    { title: "", description: "", tech: "", date: "" },
  ]);

  //Requirements for Gemini API response
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Personal Info
  const [fullname, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [number, setNumber] = useState("");
  const [link, setLink] = useState("");

  // Job Description
  const [jobTitle, setJobTitle] = useState("");
  const [objective, setObjective] = useState("");

  // Education
  type EducationItem = {
    degree: string;
    field: string;
    institution: string;
    year: string;
  };

  const handleEducationChange = (
    idx: number,
    field: keyof EducationItem,
    value: string
  ) => {
    const updatedEducation = [...education];
    updatedEducation[idx][field] = value;
    setEducation(updatedEducation);
  };

  // Certification
  type Certification = {
    name: string;
    issuer: string;
    date: string;
  };

  const handleCertChange = (
    idx: number,
    field: keyof Certification,
    value: string
  ) => {
    const updatedCerts = [...certifications];
    updatedCerts[idx][field] = value;
    setCertifications(updatedCerts);
  };

  // Project
  const handleProjectChange = (
    idx: number,
    field: "title" | "description" | "tech" | "date",
    value: string
  ) => {
    const updated = [...projects];
    updated[idx][field] = value;
    setProjects(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    const resumeData = {
      personalInfo: { fullname, location, number, link },
      jobDescription: { jobTitle, objective },
      skills,
      education,
      certifications,
      projects,
    };

    console.log("Generated Before Api call", resumeData);

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
    const genAI = new GoogleGenerativeAI(apiKey);

    const queryString = `
      SYSTEM / DNA PROMPT:

      You are a professional resume generator. 
      Produce ONLY one valid, self-contained HTML document (<!doctype html> ... </html>) representing a clean, ATS-optimized resume. 
      Follow these rules exactly:

      OUTPUT RULES:
      - Output ONLY valid HTML. No Markdown, no backticks, no explanations, no comments.
      - Use semantic HTML5 (<header>, <main>, <section>, <h1>-<h3>, <ul>, <li>, <p>, <footer>).
      - Avoid tables, images, icons, or graphics unless explicitly provided.
      - Use <style> in <head> for CSS. Keep CSS minimal and ATS-safe (font, spacing, colors).
      - Font: system stack (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif).
      - Use #155dfc for section headings. Body text: #222.
      - Keep the structure linear and scannable: header (name + contact), summary, skills, experience, education, certifications, projects, languages.
      - Experience: use <h3> for job titles, <p> for company + dates, and <ul><li> for bullet achievements.
      - Ensure dates are plain text (e.g., "Jan 2020 – Present").
      - Do not use text inside images. All content must be text for ATS parsing.
      - No hidden elements, no complex layouts, no unnecessary div nesting.

      CONTENT RULES:
      - Tone: professional, concise, strong action verbs.
      - Skills: always plain text (comma separated or bulleted).
      - Experience: reverse-chronological, each job with measurable achievements if possible.
      - Education: include degree, school, and years.
      - Omit any section if no data is provided.
      - If input bullets are vague, rewrite them into results-driven achievements.
      - If target_role or keywords are provided, prioritize them in summary and skills.

      INPUT:
      You will receive resume data in JSON format:
      ${JSON.stringify(resumeData)}

      EXPECTED STRUCTURE:
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Resume - [name]</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #222; margin: 40px; line-height: 1.4; }
          header { text-align: center; margin-bottom: 20px; }
          h1 { font-size: 28px; margin: 0; }
          h2 { color: #155dfc; font-size: 18px; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
          h3 { font-size: 16px; margin: 10px 0 4px; }
          ul { margin: 0; padding-left: 20px; }
          p { margin: 4px 0; }
        </style>
      </head>
      <body>
        <header>...</header>
        <main>
          <section id="summary">...</section>
          <section id="skills">...</section>
          <section id="experience">...</section>
          <section id="education">...</section>
          <section id="certifications">...</section>
          <section id="projects">...</section>
          <section id="languages">...</section>
        </main>
      </body>
      </html>

      END OF PROMPT. Generate the HTML resume now using the input data.
`;

    try {
      //Gemini Api Response
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(queryString);
      const text = result.response.text();

      console.log(text);

      setResponse(text);

      // File upload to the Supabase Bucket - markdown
      const file = new Blob([text], { type: "text/resume" });
      const fileName = `resume-${Date.now()}.html`;
      const filePath = `${user.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("markdown")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Upload failed:", error.message);
      } else {
        console.log("Uploaded successfully:", data);
      }
    } catch (err) {
      console.log("file cant be uploaded", err);
    } finally {
      setLoading(false);
      router.push("/dashboard/collections");
    }
    setFullName("");
    setLocation("");
    setNumber("");
    setLink("");
    setJobTitle("");
    setObjective("");
    setSkills([{ name: "", level: "Beginner", years: "" }]);
    setEducation([{ institution: "", degree: "", field: "", year: "" }]);
    setCertifications([{ name: "", issuer: "", date: "" }]);
    setProjects([{ title: "", description: "", tech: "", date: "" }]);
  };

  return (
    <main className="min-h-screen bg-background text-primary font-semibold flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-8 p-6 max-w-4xl mx-auto py-20 bg-background"
      >
        {/* Personal Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullname}
              className={`outline-none bg-transparent border-2 p-2 rounded-md text-text ${
                fullname ? "border-green-500" : "border-blue-500"
              }`}
              placeholder="Full Name"
              required
            />
            <input
              onChange={(e) => setLocation(e.target.value)}
              value={location}
              className={`outline-none bg-transparent border-2 p-2 rounded-md text-text ${
                location ? "border-green-500" : "border-blue-500"
              }`}
              placeholder="Location (City, Country)"
              required
            />
            <input
              onChange={(e) => setNumber(e.target.value)}
              value={number}
              className={`outline-none bg-transparent border-2 p-2 rounded-md text-text ${
                number ? "border-green-500" : "border-blue-500"
              }`}
              placeholder="Phone Number"
              required
            />
            <input
              onChange={(e) => setLink(e.target.value)}
              value={link}
              className={`outline-none bg-transparent border-2 p-2 rounded-md text-text ${
                link ? "border-green-500" : "border-blue-500"
              }`}
              placeholder="Professional Link (e.g. LinkedIn)"
            />
          </div>
        </div>

        {/* Job Description */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Job Description
          </h2>
          <input
            onChange={(e) => setJobTitle(e.target.value)}
            value={jobTitle}
            className={`w-full outline-none bg-transparent border-2 p-2 rounded-md text-text ${
              jobTitle ? "border-green-500" : "border-blue-500"
            }`}
            placeholder="Job Title Applied For"
            required
          />
          <textarea
            onChange={(e) => setObjective(e.target.value)}
            value={objective}
            className={`w-full mt-2 outline-none bg-transparent border-2 p-2 rounded-md text-text ${
              objective ? "border-green-500" : "border-blue-500"
            }`}
            placeholder="Career Objective / Job Description"
            rows={4}
            required
          />
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-primary">Skills</h2>
          {skills.map((skill, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 items-center relative"
            >
              <input
                value={skill.name}
                onChange={(e) => {
                  const updatedSkills = [...skills];
                  updatedSkills[idx].name = e.target.value;
                  setSkills(updatedSkills);
                }}
                className={`outline-none bg-transparent border-2 p-2 rounded-md text-text ${
                  skill.name ? "border-green-500" : "border-blue-500"
                }`}
                placeholder="Skill Name"
                required
              />
              <select
                value={skill.level}
                onChange={(e) => {
                  const updatedSkills = [...skills];
                  updatedSkills[idx].level = e.target.value;
                  setSkills(updatedSkills);
                }}
                className={`outline-none bg-transparent border-2 p-2 rounded-md text-primary ${
                  skill.level ? "border-green-500" : "border-blue-500"
                }`}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
              <input
                value={skill.years}
                onChange={(e) => {
                  const updatedSkills = [...skills];
                  updatedSkills[idx].years = e.target.value;
                  setSkills(updatedSkills);
                }}
                className={`outline-none bg-transparent border-2 p-2 rounded-md text-text ${
                  skill.years ? "border-green-500" : "border-blue-500"
                }`}
                placeholder="Years of Experience"
                type="number"
                required
              />
              {skills.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setSkills(skills.filter((_, sidx) => sidx !== idx))
                  }
                  className="absolute -right-6 text-red-500 hover:underline text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn font-semibold text-text hover:text-primary transition-all duration-200"
            onClick={() =>
              setSkills([...skills, { name: "", level: "Beginner", years: "" }])
            }
          >
            + Add Another Skill
          </button>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-primary">Education</h2>
          {education.map((edu, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2 items-center relative"
            >
              <input
                value={edu.degree}
                onChange={(e) =>
                  handleEducationChange(idx, "degree", e.target.value)
                }
                className={`input outline-none bg-transparent border-2 p-2 rounded-md text-text ${
                  edu.degree ? "border-green-500" : "border-blue-500"
                }`}
                placeholder="Degree Type"
                required
              />
              <input
                value={edu.field}
                onChange={(e) =>
                  handleEducationChange(idx, "field", e.target.value)
                }
                className={`input outline-none bg-transparent border-2 p-2 rounded-md text-text ${
                  edu.field ? "border-green-500" : "border-blue-500"
                }`}
                placeholder="Field of Study"
                required
              />
              <input
                value={edu.institution}
                onChange={(e) =>
                  handleEducationChange(idx, "institution", e.target.value)
                }
                className={`input outline-none bg-transparent border-2 p-2 rounded-md text-text ${
                  edu.institution ? "border-green-500" : "border-blue-500"
                }`}
                placeholder="Institution Name"
                required
              />
              <input
                type="number"
                value={edu.year}
                onChange={(e) =>
                  handleEducationChange(idx, "year", e.target.value)
                }
                className={`input outline-none bg-transparent border-2 p-2 rounded-md text-text ${
                  edu.year ? "border-green-500" : "border-blue-500"
                }`}
                placeholder="Graduation Year"
                required
              />
              {education.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setEducation(education.filter((_, eidx) => eidx !== idx))
                  }
                  className="absolute -right-6 text-red-500 hover:underline text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn font-semibold text-text hover:text-primary transition-all duration-200"
            onClick={() =>
              setEducation([
                ...education,
                { degree: "", field: "", institution: "", year: "" },
              ])
            }
          >
            + Add Another Education
          </button>
        </div>

        {/* Certifications */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Certifications
          </h2>
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 items-center relative"
            >
              <input
                value={cert.name}
                onChange={(e) => handleCertChange(idx, "name", e.target.value)}
                className={`input outline-none bg-transparent border-2 p-2 rounded-md text-text ${
                  cert.name ? "border-green-500" : "border-secondary"
                }`}
                placeholder="Certification Name"
                required
              />
              <input
                value={cert.issuer}
                onChange={(e) =>
                  handleCertChange(idx, "issuer", e.target.value)
                }
                className={`input outline-none bg-transparent border-2 p-2 rounded-md text-text ${
                  cert.issuer ? "border-green-500" : "border-secondary"
                }`}
                placeholder="Issuing Organization"
                required
              />

              <input
                value={cert.date}
                onChange={(e) => handleCertChange(idx, "date", e.target.value)}
                className={`input outline-none bg-transparent border-2 p-2 rounded-md text-text ${
                  cert.date ? "border-green-500" : "border-secondary"
                }`}
                placeholder="Date Obtained"
                type="date"
                required
              />
              {certifications.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setCertifications(
                      certifications.filter((_, cidx) => cidx !== idx)
                    )
                  }
                  className="absolute -right-6 text-red-500 hover:underline text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn font-semibold text-text hover:text-primary transition-all duration-200"
            onClick={() =>
              setCertifications([
                ...certifications,
                { name: "", issuer: "", date: "" },
              ])
            }
          >
            + Add Another Certification
          </button>
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-primary">Projects</h2>
          {projects.map((proj, idx) => (
            <div key={idx} className="space-y-2 mb-4 relative">
              <input
                value={proj.title}
                onChange={(e) =>
                  handleProjectChange(idx, "title", e.target.value)
                }
                className={`input w-full outline-none bg-transparent border-2 p-2 rounded-md ${
                  proj.title.trim() ? "border-green-500" : "border-blue-500"
                } text-text`}
                placeholder="Project Title"
                required
              />
              <textarea
                value={proj.description}
                onChange={(e) =>
                  handleProjectChange(idx, "description", e.target.value)
                }
                className={`input w-full outline-none bg-transparent border-2 p-2 rounded-md ${
                  proj.description.trim()
                    ? "border-green-500"
                    : "border-blue-500"
                } text-text`}
                placeholder="Description"
                rows={3}
                required
              />
              <input
                value={proj.tech}
                onChange={(e) =>
                  handleProjectChange(idx, "tech", e.target.value)
                }
                className={`input w-full outline-none bg-transparent border-2 p-2 rounded-md ${
                  proj.tech.trim() ? "border-green-500" : "border-blue-500"
                } text-text`}
                placeholder="Technologies Used"
                required
              />
              <input
                value={proj.date}
                onChange={(e) =>
                  handleProjectChange(idx, "date", e.target.value)
                }
                className={`input w-full outline-none bg-transparent border-2 p-2 rounded-md ${
                  proj.date.trim() ? "border-green-500" : "border-blue-500"
                } text-text`}
                placeholder="Date Completed"
                type="date"
                required
              />
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setProjects(projects.filter((_, pidx) => pidx !== idx))
                  }
                  className="absolute top-0 right-0 text-red-500 hover:underline text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn font-semibold text-text hover:text-primary transition-all duration-200"
            onClick={() =>
              setProjects([
                ...projects,
                { title: "", description: "", tech: "", date: "" },
              ])
            }
          >
            + Add Another Project
          </button>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            // onClick={handleGenerate}
            type="submit"
            className="btn px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Resume"}
          </button>
          {/* <p>{response}</p> */}
        </div>
      </form>
    </main>
  );
}
