"use client";

import { useState } from "react";
import { IconFileDescription } from "@tabler/icons-react";
import { IconDownload } from "@tabler/icons-react";
import { IconTrashX } from "@tabler/icons-react";
import Footer from "../components/Footer";

function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState("personal");

  // Define the tabs in order
  const tabs = ["personal", "experience", "projects", "education", "skills"];

  // Function to go to the next tab
  const goToNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  // Function to go to the previous tab
  const goToPreviousTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const [personalInfo, setPersonalInfo] = useState({
    name: "John Doe",
    title: "Software Engineer",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    location: "New York, NY",
    summary:
      "Experienced software engineer with a passion for building scalable web applications.",
    linkedin: "https://linkedin.com/in/johndoe",
    website: "https://johndoe.com",
    github: "https://github.com/johndoe.com",
  });

  const [experience, setExperiences] = useState([
    {
      companyName: "Tech Company",
      location: "New York, NY",
      startDate: "2020-01",
      endDate: "Present",
      position: "Senior Developer",
      descriptions:
        "Led development of key features for the company's main product.",
    },
  ]);

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        companyName: "",
        location: "",
        startDate: "",
        endDate: "",
        position: "",
        descriptions: "",
      },
    ]);
  };

  // Function to update a project
  const updateExperience = (index: number, field: string, value: string) => {
    setExperiences((prev) =>
      prev.map((experience, i) =>
        i === index ? { ...experience, [field]: value } : experience
      )
    );
  };

  // Function to remove a project
  const removeExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const [projects, setProjects] = useState([
    {
      projectName: "Example 1",
      projectLink: "www.example.com",
      startDate: "2014-09",
      endDate: "2018-05",
      achivements:
        "Graduated with honors. Focused on software engineering and data structures.",
      technologies: "JavaScript, React, Node.js, TypeScript, HTML/CSS",
    },
  ]);

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        projectName: "",
        projectLink: "",
        startDate: "",
        endDate: "",
        achivements: "",
        technologies: "",
      },
    ]);
  };

  // Function to update a project
  const updateProject = (index: number, field: string, value: string) => {
    setProjects((prev) =>
      prev.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      )
    );
  };

  // Function to remove a project
  const removeProject = (index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const [education, setEducation] = useState([
    {
      institution: "University of Technology",
      degree: "Bachelor of Science in Computer Science",
      startDate: "2014-09",
      endDate: "2018-05",
      description:
        "Graduated with honors. Focused on software engineering and data structures.",
    },
  ]);

  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  // Function to update a project
  const updateEducation = (index: number, field: string, value: string) => {
    setEducation((prev) =>
      prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
    );
  };

  // Function to remove a project
  const removeEducation = (index: number) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const [skills, setSkills] = useState([
    {
      skillHeader: "Frameworks",
      skills: "React, Angular, Vue",
    },
  ]);

  const addSkills = () => {
    setSkills((prev) => [
      ...prev,
      {
        skillHeader: "",
        skills: "",
      },
    ]);
  };

  // Function to update a project
  const updateSkills = (index: number, field: string, value: string) => {
    setSkills((prev) =>
      prev.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    );
  };

  // Function to remove a project
  const removeSkills = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  // const [skills, setSkills] = useState([
  //   "JavaScript",
  //   "React",
  //   "Node.js",
  //   "TypeScript",
  //   "HTML/CSS",
  // ]);

  // const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  // };

  // const addExperience = () => {
  //   setExperiences((prev) => [
  //     ...prev,
  //     {
  //       company: "",
  //       position: "",
  //       startDate: "",
  //       endDate: "",
  //       description: "",
  //     },
  //   ]);
  // };

  // const updateExperience = (index: number, field: string, value: string) => {
  //   setExperiences((prev) =>
  //     prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
  //   );
  // };

  // const removeExperience = (index: number) => {
  //   setExperiences((prev) => prev.filter((_, i) => i !== index));
  // };

  // const addEducation = () => {
  //   setEducation((prev) => [
  //     ...prev,
  //     {
  //       projectName: "",
  //       startDate: "",
  //       endDate: "",
  //       achivements: "",
  //       tools: [],
  //     },
  //   ]);
  // };

  // const updateEducation = (index: number, field: string, value: string) => {
  //   setEducation((prev) =>
  //     prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
  //   );
  // };

  // const removeEducation = (index: number) => {
  //   setEducation((prev) => prev.filter((_, i) => i !== index));
  // };

  // const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
  //     setSkills((prev) => [
  //       ...prev,
  //       (e.target as HTMLInputElement).value.trim(),
  //     ]);
  //     (e.target as HTMLInputElement).value = "";
  //     e.preventDefault();
  //   }
  // };

  // const removeSkill = (index: number) => {
  //   setSkills((prev) => prev.filter((_, i) => i !== index));
  // };

  return (
    <div>
      <header className="ticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center h-16 justify-between px-24">
        <div className="flex items-center gap-2">
          <IconFileDescription stroke={2} className="size-8" />
          <span className="font-bold text-xl">ResumeRight</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            className="text-sm font-medium hover:underline underline-offset-4 hidden sm:inline-flex"
            href="#login"
          >
            Log In
          </a>
          <a
            className="flex items-center gap-x-2 border bg-white text-black px-3 py-2 rounded-md text-sm hover:bg-gray-300 transition ease-in-out"
            href="#download functionality"
          >
            <IconDownload stroke={2} />
            Download PDF
          </a>
        </div>
      </header>
      <main className="flex-1 flex flex-row py-6 md:py-12 gap-x-8">
        <div className="flex flex-col w-[700px] ml-12">
          <h1 className="text-3xl font-bold mb-6">Build Your Resume</h1>
          <div className="flex flex-row flex-wrap gap-4 justify-center gap-x-18 rounded-md shadow-xs py-4 mb-8">
            <a
              className={` ${activeTab === "personal" ? "underline" : ""}
              text-sm font-medium hover:underline underline-offset-4 hidden sm:inline-flex`}
              onClick={() => setActiveTab("personal")}
            >
              Personal
            </a>
            <a
              className={` ${activeTab === "experience" ? "underline" : ""}
              text-sm font-medium hover:underline underline-offset-4 hidden sm:inline-flex`}
              onClick={() => setActiveTab("experience")}
            >
              Experience
            </a>
            <a
              className={` ${activeTab === "projects" ? "underline" : ""}
              text-sm font-medium hover:underline underline-offset-4 hidden sm:inline-flex`}
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </a>
            <a
              className={` ${activeTab === "education" ? "underline" : ""}
              text-sm font-medium hover:underline underline-offset-4 hidden sm:inline-flex`}
              onClick={() => setActiveTab("education")}
            >
              Education
            </a>
            <a
              className={` ${activeTab === "skills" ? "underline" : ""}
              text-sm font-medium hover:underline underline-offset-4 hidden sm:inline-flex`}
              onClick={() => setActiveTab("skills")}
            >
              Skills
            </a>
          </div>
          <div className="mb-8">
            {/* Personal Tab */}
            {activeTab === "personal" && (
              <div className="rounded-md border bg-white p-8 shadow-xs flex flex-col">
                <label className="mb-1">Full Name</label>
                <input
                  className="mb-4 py-2 rounded-md border pl-4"
                  type="text"
                  value={personalInfo.name}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, name: e.target.value })
                  }
                />
                <label className="mb-1">Email</label>
                <input
                  className="mb-4 py-2 rounded-md border pl-4"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, email: e.target.value })
                  }
                />
                <label className="mb-1">Phone</label>
                <input
                  className="mb-4 py-2 rounded-md border pl-4"
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, phone: e.target.value })
                  }
                />
                <label className="mb-1">Location</label>
                <input
                  className="mb-4 py-2 rounded-md border pl-4"
                  type="text"
                  value={personalInfo.location}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      location: e.target.value,
                    })
                  }
                />
                <label className="mb-1">LinkedIn</label>
                <input
                  className="mb-4 py-2 rounded-md border pl-4"
                  type="url"
                  name="LinkedIn"
                  value={personalInfo.linkedin}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      linkedin: e.target.value,
                    })
                  }
                />
                <label className="mb-1">Website (Optional)</label>
                <input
                  className="mb-4 py-2 rounded-md border pl-4"
                  type="url"
                  value={personalInfo.website}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      website: e.target.value,
                    })
                  }
                />
                <label className="mb-1">Github (Optional)</label>
                <input
                  className="mb-4 py-2 rounded-md border pl-4"
                  type="url"
                  value={personalInfo.github}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, github: e.target.value })
                  }
                />
              </div>
            )}
            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div>
                {experience.map((exp, index) => (
                  <div
                    key={index}
                    className="flex flex-col rounded-md border bg-white p-8 mb-4 shadow-xs"
                  >
                    <div className="flex justify-between flex-wrap">
                      <h1 className="font-semibold text-xl mb-6">
                        Experience {index + 1}
                      </h1>
                      <a
                        className="text-sm text-red-500 hover:scale-120 transition ease-in-out"
                        onClick={() => removeExperience(index)}
                      >
                        <IconTrashX stroke={2} />
                      </a>
                    </div>
                    <label className="mb-1">Company</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={exp.companyName}
                      onChange={(e) =>
                        updateExperience(index, "companyName", e.target.value)
                      }
                    />
                    <label className="mb-1">Location</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={exp.location}
                      onChange={(e) =>
                        updateExperience(index, "location", e.target.value)
                      }
                    />
                    <label className="mb-1">Position</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(index, "position", e.target.value)
                      }
                    />
                    <label className="mb-1">Start Date</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(index, "startDate", e.target.value)
                      }
                    />
                    <label className="mb-1">End Date</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(index, "endDate", e.target.value)
                      }
                    />
                    <label className="mb-1">Description</label>
                    <textarea
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      name="Description"
                      value={exp.descriptions}
                      onChange={(e) =>
                        updateExperience(index, "descriptions", e.target.value)
                      }
                    ></textarea>
                  </div>
                ))}
                <div className="flex justify-between bg-white">
                  <a
                    className="w-full flex items-center justify-center border bg-white text-black px-3 py-2 rounded-md text-sm hover:bg-gray-300 transition ease-in-out"
                    onClick={addExperience}
                  >
                    Add Experience
                  </a>
                </div>
              </div>
            )}
            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div>
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="flex flex-col rounded-md border bg-white p-8 mb-4 shadow-xs"
                  >
                    <div className="flex justify-between flex-wrap">
                      <h1 className="font-semibold text-xl mb-6">
                        Project {index + 1}
                      </h1>
                      <a
                        className="text-sm text-red-500 hover:scale-120 transition ease-in-out"
                        onClick={() => removeProject(index)}
                      >
                        <IconTrashX stroke={2} />
                      </a>
                    </div>
                    <label className="mb-1">Project Name</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={project.projectName}
                      onChange={(e) =>
                        updateProject(index, "projectName", e.target.value)
                      }
                    />
                    <label className="mb-1">Project Link (Optional)</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="url"
                      value={project.projectLink}
                      onChange={(e) =>
                        updateProject(index, "projectLink", e.target.value)
                      }
                    />
                    <label className="mb-1">Start Date</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={project.startDate}
                      onChange={(e) =>
                        updateProject(index, "startDate", e.target.value)
                      }
                    />
                    <label className="mb-1">End Date</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={project.endDate}
                      onChange={(e) =>
                        updateProject(index, "endDate", e.target.value)
                      }
                    />
                    <label className="mb-1">Description</label>
                    <textarea
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      value={project.achivements}
                      onChange={(e) =>
                        updateProject(index, "achivements", e.target.value)
                      }
                    ></textarea>
                    <label className="mb-1">Technologies Used</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={project.technologies}
                      onChange={(e) =>
                        updateProject(index, "technologies", e.target.value)
                      }
                    />
                  </div>
                ))}
                <a
                  className="w-full flex items-center justify-center border bg-white text-black px-3 py-2 rounded-md text-sm hover:bg-gray-300 transition ease-in-out"
                  onClick={addProject}
                >
                  Add Project
                </a>
              </div>
            )}
            {/* Education Tab */}
            {activeTab === "education" && (
              <div>
                {education.map((education, index) => (
                  <div
                    key={index}
                    className="flex flex-col rounded-md border bg-white p-8 mb-4 shadow-xs"
                  >
                    <div className="flex justify-between flex-wrap">
                      <h1 className="font-semibold text-xl mb-6">
                        Education {index + 1}
                      </h1>
                      <a
                        className="text-sm text-red-500 hover:scale-120 transition ease-in-out"
                        onClick={() => removeEducation(index)}
                      >
                        <IconTrashX stroke={2} />
                      </a>
                    </div>
                    <label className="mb-1">Institution</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={education.institution}
                      onChange={(e) =>
                        updateEducation(index, "institution", e.target.value)
                      }
                    />
                    <label className="mb-1">Degree</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={education.degree}
                      onChange={(e) =>
                        updateEducation(index, "degree", e.target.value)
                      }
                    />
                    <label className="mb-1">Start Date</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={education.startDate}
                      onChange={(e) =>
                        updateEducation(index, "startDate", e.target.value)
                      }
                    />
                    <label className="mb-1">End Date</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={education.endDate}
                      onChange={(e) =>
                        updateEducation(index, "endDate", e.target.value)
                      }
                    />
                    <label className="mb-1">Description</label>
                    <textarea
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      name="Description"
                      value={education.description}
                      onChange={(e) =>
                        updateEducation(index, "description", e.target.value)
                      }
                    ></textarea>
                  </div>
                ))}
                <div className="flex justify-between bg-white">
                  <a
                    className="w-full flex items-center justify-center border bg-white text-black px-3 py-2 rounded-md text-sm hover:bg-gray-300 transition ease-in-out"
                    onClick={addEducation}
                  >
                    Add Education
                  </a>
                </div>
              </div>
            )}
            {/* Skills Tab */}
            {activeTab === "skills" && (
              <div>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex flex-col rounded-md border bg-white p-8 mb-4 shadow-xs"
                  >
                    <div className="flex justify-between flex-wrap">
                      <h1 className="font-semibold text-xl mb-6">
                        Skill Header {index + 1}
                      </h1>
                      <a
                        className="text-sm text-red-500 hover:scale-120 transition ease-in-out"
                        onClick={() => removeSkills(index)}
                      >
                        <IconTrashX stroke={2} />
                      </a>
                    </div>
                    <label className="mb-1">Skill Header</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={skill.skillHeader}
                      onChange={(e) =>
                        updateSkills(index, "skillHeader", e.target.value)
                      }
                    />
                    <label className="mb-1">Skills</label>
                    <input
                      className="mb-4 py-2 rounded-md border pl-4 pr-4"
                      type="text"
                      value={skill.skills}
                      onChange={(e) =>
                        updateSkills(index, "skills", e.target.value)
                      }
                    />
                  </div>
                ))}
                <div className="flex justify-between bg-white">
                  <a
                    className="w-full flex items-center justify-center border bg-white text-black px-3 py-2 rounded-md text-sm hover:bg-gray-300 transition ease-in-out"
                    onClick={addSkills}
                  >
                    Add Skill Header
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between bg-white">
            <a
              className="flex items-center gap-x-2 border bg-white text-black px-3 py-2 rounded-md text-sm hover:bg-gray-300 transition ease-in-out"
              onClick={goToPreviousTab}
            >
              Previous
            </a>
            <a
              className="flex items-center gap-x-2 border bg-white text-black px-3 py-2 rounded-md text-sm hover:bg-gray-300 transition ease-in-out"
              onClick={goToNextTab}
            >
              Next
            </a>
          </div>
        </div>
        <div className="">
          <img src="https://fakeimg.pl/700x900" alt="resume builder" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ResumeBuilder;
