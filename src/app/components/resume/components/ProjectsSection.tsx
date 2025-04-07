import React from "react";
import styles from "@/app/resume.module.css";
import EditableText from "./EditableText";
import SectionHeader from "./SectionHeader";
import EditableBulletItem from "./EditableBulletItem";
import DeleteSectionButton from "./DeleteSectionButton";
import AddBulletButton from "./AddBulletButton";
import ModifyAIButton from "./ModifyAIButton";
import { RewriteResumeBullet } from "@/app/gemini/BulletPoint";

interface Project {
  name: string;
  tech: string;
  dates: string;
  bullets: string[];
  id: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  sectionTitle: string;
  updateSectionTitle: (value: string) => void;
  updateProject: (index: number, field: string, value: string) => void;
  updateProjectBullet: (
    projIndex: number,
    bulletIndex: number,
    value: string
  ) => void;
  deleteProjectBullet: (projIndex: number, bulletIndex: number) => void;
  addProjectBullet: (projIndex: number) => void;
  onAddNew?: () => void;
  deleteSection: (id: string) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  sectionTitle,
  updateSectionTitle,
  updateProject,
  updateProjectBullet,
  deleteProjectBullet,
  addProjectBullet,
  onAddNew,
  deleteSection,
}) => {
  return (
    <section className={styles.resumeSection}>
      <SectionHeader
        title={sectionTitle}
        onAddNew={onAddNew}
        onTitleChange={updateSectionTitle}
        placeholder="Projects"
      />
      {projects.map((project, projIndex) => (
        <div key={projIndex} className={styles.resumeItem}>
          <DeleteSectionButton
            onClick={() => deleteSection(project.id)}
            label="Delete project entry"
          />
          <div className={styles.resumeItemHeader}>
            <div className={styles.titleWithButton}>
              <strong>
                <EditableText
                  value={project.name}
                  onChange={(value) => updateProject(projIndex, "name", value)}
                  inline={true}
                  placeholder="Project title"
                />
              </strong>{" "}
              <span className={styles.separator}>|</span>{" "}
              <span className={styles.resumeProjectTech}>
                <EditableText
                  value={project.tech}
                  onChange={(value) => updateProject(projIndex, "tech", value)}
                  className={styles.resumeProjectTech}
                  inline={true}
                  placeholder="Skills used"
                />
              </span>
              <AddBulletButton onClick={() => addProjectBullet(projIndex)} />
            </div>
            <div className={styles.resumeItemDate}>
              <EditableText
                value={project.dates}
                onChange={(value) => updateProject(projIndex, "dates", value)}
                className={styles.resumeItemDate}
                inline={true}
                placeholder="Enter a date"
              />
            </div>
          </div>
          <ul className={styles.resumeBullets}>
            {project.bullets.map((bullet, bulletIndex) => (
              <div className="flex translate-x-[-24px]">
                <ModifyAIButton
                  onClick={async () => {
                    try {
                      // Call the rewriteResumeBullet function
                      const result = (await RewriteResumeBullet(bullet)) as {
                        original: string;
                        bullet: string;
                      };

                      // Update the bullet point with the AI-generated result
                      updateProjectBullet(
                        projIndex,
                        bulletIndex,
                        result.bullet
                      );
                    } catch (error) {
                      console.error("Error rewriting bullet point:", error);
                    }
                  }}
                  label="Modify AI"
                />
                <EditableBulletItem
                  key={bulletIndex}
                  value={bullet}
                  onChange={(value) =>
                    updateProjectBullet(projIndex, bulletIndex, value)
                  }
                  onDelete={() => deleteProjectBullet(projIndex, bulletIndex)}
                  placeholder="Write an accomplishment"
                />
              </div>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default ProjectsSection;
