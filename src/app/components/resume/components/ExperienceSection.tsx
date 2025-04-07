import React from "react";
import styles from "@/app/resume.module.css";
import EditableText from "./EditableText";
import SectionHeader from "./SectionHeader";
import EditableBulletItem from "./EditableBulletItem";
import DeleteSectionButton from "./DeleteSectionButton";
import AddBulletButton from "./AddBulletButton";
import { RewriteResumeBullet } from "@/app/gemini/BulletPoint";
import ModifyAIButton from "./ModifyAIButton";

interface Experience {
  id: string;
  title: string;
  organization: string;
  location: string;
  dates: string;
  bullets: string[];
}

interface ExperienceSectionProps {
  experiences: Experience[];
  sectionTitle: string;
  updateSectionTitle: (value: string) => void;
  updateExperience: (index: number, field: string, value: string) => void;
  updateExperienceBullet: (
    expIndex: number,
    bulletIndex: number,
    value: string
  ) => void;
  deleteExperienceBullet: (expIndex: number, bulletIndex: number) => void;
  addExperienceBullet: (expIndex: number) => void;
  onAddNew?: () => void;
  deleteSection: (id: string) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  sectionTitle,
  updateSectionTitle,
  updateExperience,
  updateExperienceBullet,
  deleteExperienceBullet,
  addExperienceBullet,
  onAddNew,
  deleteSection,
}) => {
  return (
    <section className={styles.resumeSection}>
      <SectionHeader
        title={sectionTitle}
        onAddNew={onAddNew}
        onTitleChange={updateSectionTitle}
        placeholder="Experience"
      />
      {experiences.map((experience, expIndex) => (
        <div key={expIndex} className={styles.resumeItem}>
          <DeleteSectionButton
            onClick={() => deleteSection(experience.id)}
            label="Delete experience entry"
          />
          <div className={styles.resumeItemHeader}>
            <div className={styles.titleWithButton}>
              <EditableText
                value={experience.title}
                onChange={(value) => updateExperience(expIndex, "title", value)}
                className={styles.resumeItemTitle}
                placeholder="Job Position"
              />
              <AddBulletButton onClick={() => addExperienceBullet(expIndex)} />
            </div>
            <EditableText
              value={experience.location}
              onChange={(value) =>
                updateExperience(expIndex, "location", value)
              }
              className={styles.resumeItemLocation}
              inline={true}
              placeholder="Location"
            />
          </div>
          <div className={styles.resumeItemSubheader}>
            <EditableText
              value={experience.organization}
              onChange={(value) =>
                updateExperience(expIndex, "organization", value)
              }
              className={styles.resumeItemOrg}
              placeholder="Company Name"
            />
            <EditableText
              value={experience.dates}
              onChange={(value) => updateExperience(expIndex, "dates", value)}
              className={styles.resumeItemDate}
              inline={true}
              placeholder="Enter a date"
            />
          </div>
          <ul className={styles.resumeBullets}>
            {experience.bullets.map((bullet, bulletIndex) => (
              <div className="flex translate-x-[-24px]">
                <ModifyAIButton
                  onClick={async () => {
                    try {
                      // Call the rewriteResumeBullet function
                      const result = await RewriteResumeBullet(bullet) as { original: string; bullet: string };

                      // Update the bullet point with the AI-generated result
                      updateExperienceBullet(
                        expIndex,
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
                    updateExperienceBullet(expIndex, bulletIndex, value)
                  }
                  onDelete={() => deleteExperienceBullet(expIndex, bulletIndex)}
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

export default ExperienceSection;
