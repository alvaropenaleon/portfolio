"use client";
import { Project } from "@/lib/definitions";
import styles from '@/styles/project/projectCard.module.css';
import Image from 'next/image';


type ProjectOverlayProps = {
    project: Project;
    onClose: () => void;
};

export default function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
    return (
        <div className={styles.slideover}>
            <div className={styles.overlayContent}>
                <button onClick={onClose}>Close</button>
                <br /><br />
                <h1>{project.title}</h1>
                <br /><br />
                <h2>{project.description}</h2>
                <br /><br />
                <p>{project.text}</p>
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
