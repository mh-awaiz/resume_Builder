"use client";
import React, { useState } from "react";
import { redirect } from "next/navigation";
import axios from "axios";
import { clearScreenDown } from "readline";
import { url } from "inspector";
import { GoogleGenAI } from "@google/genai";

export default function ResumeDashboardForm() {
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

  //Loading
  // const [loading, setLoading] = useState(false);
  // const [output, setOutput] = useState("");

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

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyCGFBoYFgTSGBXl4TcOH0S7jc8nzkJqBDE",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resumeData = {
      personalInfo: {
        fullname,
        location,
        number,
        link,
      },
      jobDescription: {
        jobTitle,
        objective,
      },
      skills,
      education,
      certifications,
      projects,
    };

    //Submit
    console.log(resumeData);

    //Generating Resume
    console.log("Generating resume starts....");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate resume based on given json information the heading should be in this color (#155dfc) ${JSON.stringify(
        resumeData
      )} and in code formate the i can use in in my nextjs application and with tailwind css  heading should be in blue`,
    });
    console.log(response.text);

    // console.log("Loading....");

    // axios({
    //    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
    //    method: "post",

    // })

    // setLoading(true);
    // try {
    //   const res = await axios.post("/api/generate-resume", {
    //     prompt: `Generate resume based on given json information the heading should be in this color (#155dfc) ${JSON.stringify(
    //       resumeData
    //     )}`,
    //   });

    //   setOutput(res.data.text); // clean formatted response
    // } catch (err) {
    //   console.error("Error:", err);
    // } finally {
    //   setLoading(false);
    // }

    // setLoading(true);
    // try {
    //   const res = await axios.post("/api/generate-resume", {
    //     prompt: `Generate resume based on given json information the heading should be in this color (#155dfc) ${resumeData}`,
    //   });
    //   console.log("Gemini response:", res.data);
    // } catch (err) {
    //   console.error("Error:", err);
    // } finally {
    //   setLoading(false);
    // }

    // Reset all fields
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

    // redirect("/dashboard");
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
          >
            Submit Resume
          </button>
        </div>
        {/* {loading
          ? "Loading..."
          : "Resume Generated Check in Collections Section"}

        {output && (
          <div className="mt-4 p-3 border rounded bg-gray-50">
            <h2 className="font-semibold mb-2">Gemini Output:</h2>
            <p>{output}</p>
          </div>
        )} */}
      </form>
    </main>
  );
}
