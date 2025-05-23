"use client";
import { Project } from "@/lib/definitions";
import styles from '@/styles/project/projectCard.module.css';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';



type ProjectOverlayProps = {
    project: Project;
};

export default function ProjectOverlay({ project }: ProjectOverlayProps) {
    return (
        <div className={styles.slideover}>
            <div className={styles.overlayContent}>
                <br /><br />
                <h1>{project.title}</h1>
                <br /><br />
                <h2>{project.description}</h2>
                <br /><br />
                <div className={styles.markdown}>
                <ReactMarkdown>{project.text}</ReactMarkdown>
                </div>
                <br /><br /><br />
                <Image
                    src={project.heroImage}
                    alt={project.title}
                    layout="responsive"
                    width={1280}
                    height={720}
                    objectFit="contain"
                    quality={100}
                />
            </div>
        </div>
    );
}
