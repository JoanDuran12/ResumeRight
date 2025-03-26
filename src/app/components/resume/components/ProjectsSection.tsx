import React from 'react';
import styles from '@/app/resume.module.css';
import EditableText from './EditableText';
import EditableBulletItem from './EditableBulletItem';
import AddBulletButton from './AddBulletButton';
import SectionHeader from './SectionHeader';

interface Project {
  name: string;
  tech: string;
  dates: string;
  bullets: string[];
}

interface ProjectsSectionProps {
  projects: Project[];
  updateProject: (index: number, field: string, value: string) => void;
  updateProjectBullet: (projIndex: number, bulletIndex: number, value: string) => void;
  deleteProjectBullet: (projIndex: number, bulletIndex: number) => void;
  addProjectBullet: (projIndex: number) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ 
  projects, 
  updateProject, 
  updateProjectBullet, 
  deleteProjectBullet, 
  addProjectBullet 
}) => {
  return (
    <section className={styles.resumeSection}>
      <SectionHeader title="Projects" />
      {projects.map((project, projIndex) => (
        <div key={projIndex} className={styles.resumeItem}>
          <div className={styles.resumeProjectHeader}>
            <div className={styles.resumeProjectTitle}>
              <strong>
                <EditableText 
                  value={project.name} 
                  onChange={(value) => updateProject(projIndex, 'name', value)} 
                  inline={true}
                />
              </strong> | <span className={styles.resumeProjectTech}>
                <EditableText 
                  value={project.tech} 
                  onChange={(value) => updateProject(projIndex, 'tech', value)} 
                  className={styles.resumeProjectTech}
                  inline={true}
                />
              </span>
            </div>
            <div className={styles.resumeItemDate}>
              <EditableText 
                value={project.dates} 
                onChange={(value) => updateProject(projIndex, 'dates', value)} 
                className={styles.resumeItemDate}
                inline={true}
              />
            </div>
          </div>
          <ul className={styles.resumeBullets}>
            {project.bullets.map((bullet, bulletIndex) => (
              <EditableBulletItem 
                key={bulletIndex}
                value={bullet}
                onChange={(value) => updateProjectBullet(projIndex, bulletIndex, value)}
                onDelete={() => deleteProjectBullet(projIndex, bulletIndex)}
              />
            ))}
            <AddBulletButton onClick={() => addProjectBullet(projIndex)} />
          </ul>
        </div>
      ))}
    </section>
  );
};

export default ProjectsSection; 