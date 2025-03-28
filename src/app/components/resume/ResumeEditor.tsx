"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useResume } from "@/app/contexts/ResumeContext";
import styles from "@/app/resume.module.css";

interface Bullet {
  id: string;
  text: string;
}

interface Section {
  id: string;
  bullets: Bullet[];
}

interface Skill {
  id: string;
  category: string;
  skills: string;
}

interface Sections {
  education: Section[];
  experience: Section[];
  projects: Section[];
  skills: Skill[];
}

interface HistoryState {
  past: Sections[];
  present: Sections;
  future: Sections[];
}

const ResumeEditor: React.FC = () => {
  const { currentResume, updateContent } = useResume();
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: {
      education: [
        {
          id: "1",
          bullets: [
            { id: crypto.randomUUID(), text: "" },
            { id: crypto.randomUUID(), text: "" },
            { id: crypto.randomUUID(), text: "" },
          ],
        },
      ],
      experience: [
        {
          id: "1",
          bullets: [
            { id: crypto.randomUUID(), text: "" },
            { id: crypto.randomUUID(), text: "" },
            { id: crypto.randomUUID(), text: "" },
          ],
        },
      ],
      projects: [
        {
          id: "1",
          bullets: [
            { id: crypto.randomUUID(), text: "" },
            { id: crypto.randomUUID(), text: "" },
            { id: crypto.randomUUID(), text: "" },
          ],
        },
      ],
      skills: [
        { id: crypto.randomUUID(), category: "Category", skills: "" },
        { id: crypto.randomUUID(), category: "Category", skills: "" },
        { id: crypto.randomUUID(), category: "Category", skills: "" },
      ],
    },
    future: [],
  });

  const sections = history.present;

  const updateHistory = useCallback((newPresent: any) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: newPresent,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const deleteSection = (
    sectionType: "education" | "experience" | "projects" | "skills",
    id: string
  ) => {
    const newSections = {
      ...sections,
      [sectionType]: sections[sectionType].filter((item) => item.id !== id),
    };
    updateHistory(newSections);
  };

  const deleteBullet = (
    sectionType: "education" | "experience" | "projects",
    sectionId: string,
    bulletId: string
  ) => {
    const newSections = {
      ...sections,
      [sectionType]: sections[sectionType].map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            bullets: section.bullets.filter((bullet) => bullet.id !== bulletId),
          };
        }
        return section;
      }),
    };
    updateHistory(newSections);
  };

  const addBullet = (
    sectionType: "education" | "experience" | "projects",
    sectionId: string
  ) => {
    const newSections = {
      ...sections,
      [sectionType]: sections[sectionType].map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            bullets: [
              ...section.bullets,
              { id: crypto.randomUUID(), text: "" },
            ],
          };
        }
        return section;
      }),
    };
    updateHistory(newSections);
  };

  const addSkillCategory = () => {
    const newSections = {
      ...sections,
      skills: [
        ...sections.skills,
        { id: crypto.randomUUID(), category: "New Category", skills: "" },
      ],
    };
    updateHistory(newSections);
  };

  const addSection = (sectionType: "education" | "experience" | "projects") => {
    const newSection = {
      id: crypto.randomUUID(),
      bullets: [
        { id: crypto.randomUUID(), text: "" },
        { id: crypto.randomUUID(), text: "" },
        { id: crypto.randomUUID(), text: "" },
      ],
    };

    const newSections = {
      ...sections,
      [sectionType]: [...sections[sectionType], newSection],
    };
    updateHistory(newSections);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    // Set initial empty state for all contentEditable elements
    const contentEditableElements =
      document.querySelectorAll("[contenteditable]");
    contentEditableElements.forEach((element) => {
      if (!element.textContent?.trim()) {
        element.setAttribute("data-empty", "true");
      }
    });

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.hasAttribute("contenteditable") &&
        !target.textContent?.trim()
      ) {
        target.setAttribute("data-empty", "true");
      } else {
        target.removeAttribute("data-empty");
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute("contenteditable")) {
        target.removeAttribute("data-empty");
      }
    };

    document.addEventListener("blur", handleBlur, true);
    document.addEventListener("input", handleInput, true);
    return () => {
      document.removeEventListener("blur", handleBlur, true);
      document.removeEventListener("input", handleInput, true);
    };
  }, []);

  return (
    <div
      id="convertPDF"
      className={`${styles.resumePage} min-h-[1140px] w-[1000px]`}
    >
      {/* Header Section */}
      <div className={styles.resumeHeader}>
        <h1
          className={`${styles.resumeName} ${styles.editableField} ${styles.titleField}`}
          contentEditable
          aria-label="Your Name"
          data-placeholder="Your Name"
        ></h1>
        <div
          className={`${styles.resumeContact} flex justify-center items-center gap-2`}
        >
          <span
            className={styles.editableField}
            contentEditable
            aria-label="Phone number"
            data-placeholder="123-456-7890"
          ></span>
          {" | "}
          <div className={styles.contactItem}>
            <span
              className={styles.editableField}
              contentEditable
              aria-label="Email address"
              data-placeholder="youremail@gmail.com"
            ></span>
          </div>
          {" | "}
          <div className={styles.contactItem}>
            <span
              className={styles.editableField}
              contentEditable
              aria-label="Website"
              data-placeholder="yourwebsite.com"
            ></span>
          </div>
          {" | "}
          <div className={styles.contactItem}>
            <span className={styles.contactPrefix}>linkedin.com/in/</span>
            <span
              className={`${styles.contactValue} ${styles.editableField}`}
              contentEditable
              aria-label="LinkedIn username"
              data-placeholder="username"
            ></span>
          </div>
          {" | "}
          <div className={styles.contactItem}>
            <span className={styles.contactPrefix}>github.com/</span>
            <span
              className={`${styles.contactValue} ${styles.editableField}`}
              contentEditable
              aria-label="GitHub username"
              data-placeholder="username"
            ></span>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className={styles.resumeSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.resumeSectionTitle}>Education</h2>
          <button
            className={styles.addNewButton}
            onClick={() => addSection("education")}
            aria-label="Add new education entry"
          >
            + Add New
          </button>
        </div>
        {sections.education.map((item) => (
          <div key={item.id} className={styles.resumeItem}>
            <button
              className={styles.deleteButton}
              onClick={() => deleteSection("education", item.id)}
              aria-label="Delete education entry"
            >
              ×
            </button>
            <div className={styles.resumeItemHeader}>
              <div>
                <span
                  className={`${styles.resumeItemTitle} ${styles.editableField} ${styles.titleField}`}
                  contentEditable
                  aria-label="Institution name"
                  data-placeholder="Name of institution"
                ></span>
                <button
                  className={styles.addBulletButton}
                  onClick={() => addBullet("education", item.id)}
                  aria-label="Add new bullet point"
                >
                  +
                </button>
              </div>
              <span
                className={`${styles.resumeItemLocation} ${styles.editableField}`}
                contentEditable
                aria-label="Location"
                data-placeholder="Location"
              ></span>
            </div>
            <div className={styles.resumeItemSubheader}>
              <span
                className={`${styles.resumeItemOrg} ${styles.editableField} ${styles.italicField}`}
                contentEditable
                aria-label="Degree"
                data-placeholder="Degree"
              ></span>
              <span
                className={`${styles.resumeItemDate} ${styles.editableField} ${styles.dateField}`}
                contentEditable
                aria-label="Date range"
                data-placeholder="Select a date range"
              ></span>
            </div>
            <ul className={styles.resumeBullets}>
              {item.bullets.map((bullet) => (
                <li key={bullet.id}>
                  <button
                    className={styles.bulletDeleteButton}
                    onClick={() =>
                      deleteBullet("education", item.id, bullet.id)
                    }
                    aria-label="Delete bullet point"
                  >
                    ×
                  </button>
                  <span
                    className={styles.editableField}
                    contentEditable
                    aria-label="Achievement"
                    data-placeholder="Write an achievement"
                  ></span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Experience Section */}
      <div className={styles.resumeSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.resumeSectionTitle}>Experience</h2>
          <button
            className={styles.addNewButton}
            onClick={() => addSection("experience")}
            aria-label="Add new experience entry"
          >
            + Add New
          </button>
        </div>
        {sections.experience.map((item) => (
          <div key={item.id} className={styles.resumeItem}>
            <button
              className={styles.deleteButton}
              onClick={() => deleteSection("experience", item.id)}
              aria-label="Delete experience entry"
            >
              ×
            </button>
            <div className={styles.resumeItemHeader}>
              <div>
                <span
                  className={`${styles.resumeItemTitle} ${styles.editableField} ${styles.titleField}`}
                  contentEditable
                  aria-label="Job position"
                  data-placeholder="Job Position"
                ></span>
                <button
                  className={styles.addBulletButton}
                  onClick={() => addBullet("experience", item.id)}
                  aria-label="Add new bullet point"
                >
                  +
                </button>
              </div>
              <span
                className={`${styles.resumeItemLocation} ${styles.editableField}`}
                contentEditable
                aria-label="Location"
                data-placeholder="Location"
              ></span>
            </div>
            <div className={styles.resumeItemSubheader}>
              <span
                className={`${styles.resumeItemOrg} ${styles.editableField} ${styles.italicField}`}
                contentEditable
                aria-label="Company name"
                data-placeholder="Company Name"
              ></span>
              <span
                className={`${styles.resumeItemDate} ${styles.editableField} ${styles.dateField}`}
                contentEditable
                aria-label="Date range"
                data-placeholder="Select a date range"
              ></span>
            </div>
            <ul className={styles.resumeBullets}>
              {item.bullets.map((bullet) => (
                <li key={bullet.id}>
                  <button
                    className={styles.bulletDeleteButton}
                    onClick={() =>
                      deleteBullet("experience", item.id, bullet.id)
                    }
                    aria-label="Delete bullet point"
                  >
                    ×
                  </button>
                  <span
                    className={styles.editableField}
                    contentEditable
                    aria-label="Accomplishment"
                    data-placeholder="Write an accomplishment"
                  ></span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <div className={styles.resumeSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.resumeSectionTitle}>Projects</h2>
          <button
            className={styles.addNewButton}
            onClick={() => addSection("projects")}
            aria-label="Add new project entry"
          >
            + Add New
          </button>
        </div>
        {sections.projects.map((item) => (
          <div key={item.id} className={styles.resumeItem}>
            <button
              className={styles.deleteButton}
              onClick={() => deleteSection("projects", item.id)}
              aria-label="Delete project entry"
            >
              ×
            </button>
            <div className={styles.resumeProjectHeader}>
              <div>
                <span
                  className={`${styles.resumeProjectTitle} ${styles.editableField} ${styles.titleField}`}
                  contentEditable
                  aria-label="Project title"
                  data-placeholder="Project title"
                ></span>
                <span> | </span>
                <span
                  className={`${styles.resumeProjectTech} ${styles.editableField}`}
                  contentEditable
                  aria-label="Technologies used"
                  data-placeholder="Skills used"
                ></span>
                <button
                  className={styles.addBulletButton}
                  onClick={() => addBullet("projects", item.id)}
                  aria-label="Add new bullet point"
                >
                  +
                </button>
              </div>
              <span
                className={`${styles.resumeItemDate} ${styles.editableField} ${styles.dateField}`}
                contentEditable
                aria-label="Date range"
                data-placeholder="Select a date range"
              ></span>
            </div>
            <ul className={styles.resumeBullets}>
              {item.bullets.map((bullet) => (
                <li key={bullet.id}>
                  <button
                    className={styles.bulletDeleteButton}
                    onClick={() => deleteBullet("projects", item.id, bullet.id)}
                    aria-label="Delete bullet point"
                  >
                    ×
                  </button>
                  <span
                    className={styles.editableField}
                    contentEditable
                    aria-label="Accomplishment"
                    data-placeholder="Write an accomplishment"
                  ></span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Additional Section */}
      <div className={styles.resumeSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.resumeSectionTitle}>Additional</h2>
          <button
            className={styles.addNewButton}
            onClick={addSkillCategory}
            aria-label="Add new skill category"
          >
            + Add New
          </button>
        </div>
        <div className={styles.resumeItem}>
          {sections.skills.map((skill) => (
            <div key={skill.id} className={styles.skillRow}>
              <button
                className={styles.deleteButton}
                onClick={() => deleteSection("skills", skill.id)}
                aria-label="Delete skill category"
              >
                ×
              </button>
              <div>
                <span
                  className={`${styles.resumeSkillsCategory} ${styles.editableField}`}
                  contentEditable
                  aria-label="Skill category"
                  data-placeholder="Category"
                ></span>
                <span>: </span>
                <span
                  className={`${styles.resumeSkillsList} ${styles.editableField}`}
                  contentEditable
                  aria-label="Skills list"
                  data-placeholder="Key skills"
                ></span>
              </div>
            </div>
          ))}
        </div>
        {/* Don't think we need 2 buttons to add the same section to the resume template */}
        {/* <button
          onClick={addSkillCategory}
          className=${styles.addButton}
          aria-label="Add new skill category"
        >
          + Add Category
        </button> */}
      </div>
    </div>
  );
};

export default ResumeEditor;
