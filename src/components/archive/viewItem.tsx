"use client";
import { useState, useEffect, useRef } from "react";
import styles from "@/styles/archive/archiveItem.module.css";

export default function ViewItem() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const circleRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLElement | null>(null);
    // We'll hold the timeout ID in a ref so it persists between renders.
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const parent = circleRef.current?.parentElement;
        if (!parent) return;
        parentRef.current = parent;

        // This function calculates position relative to the parent
        const updatePosition = (e: MouseEvent) => {
            if (!parentRef.current) return;
            const rect = parentRef.current.getBoundingClientRect();
            // Calculate coordinates relative to the parent
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setPosition({ x, y });
        };

        // When the pointer enters the row
        const handleMouseEnter = () => {
            // Cancel any pending hide timeout
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
                hideTimeoutRef.current = null;
            }
            setHovered(true);
            // Listen for mouse movements on the parent
            parent.addEventListener("mousemove", updatePosition);
            // Also remove any global listener that might have been attached
            window.removeEventListener("mousemove", updatePosition);
        };

        // When the pointer leaves the row
        const handleMouseLeave = () => {
            // Attach a window-level mousemove so the circle keeps tracking even outside the row
            window.addEventListener("mousemove", updatePosition);
            // Start a timeout: after 300ms, remove tracking and shrink the circle
            hideTimeoutRef.current = setTimeout(() => {
                setHovered(false);
                window.removeEventListener("mousemove", updatePosition);
            }, 300);
            // Remove the parent's mousemove listener since the pointer left the row
            parent.removeEventListener("mousemove", updatePosition);
        };

        parent.addEventListener("mouseenter", handleMouseEnter);
        parent.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            parent.removeEventListener("mouseenter", handleMouseEnter);
            parent.removeEventListener("mouseleave", handleMouseLeave);
            parent.removeEventListener("mousemove", updatePosition);
            window.removeEventListener("mousemove", updatePosition);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, []);

    // When hovered is true, the circle scales to 1; otherwise, it remains at scale 0.
    const circleClass = hovered ? styles.viewCircleActive : "";

    return (
        <div
            ref={circleRef}
            data-view
            className={`${styles.viewCircle} ${circleClass}`}
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
            View
        </div>
    );
}
