"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/ui/typography.module.css";

const firstTexts = ["scalable", "human-centred", "data-driven"];
const secondTexts = ["code", "design", "problem-solving", "innovation"];

export default function DualDynamicText() {
  const [index, setIndex] = useState(0);
  const [firstText, setFirstText] = useState("");
  const [secondText, setSecondText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const typingSpeed = 100;
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const fullFirstText = firstTexts[index];
    const fullSecondText = secondTexts[index % secondTexts.length];

    if (!isDeleting) {
      if (firstText.length < fullFirstText.length) {
        timeout = setTimeout(() => {
          setFirstText(fullFirstText.substring(0, firstText.length + 1));
        }, typingSpeed);
      } else if (secondText.length < fullSecondText.length) {
        timeout = setTimeout(() => {
          setSecondText(fullSecondText.substring(0, secondText.length + 1));
        }, typingSpeed);
      } else {
        setIsResting(true);
        timeout = setTimeout(() => {
          setIsDeleting(true);
          setIsResting(false);
        }, 3000);
      }
    } else {
      if (secondText.length > 0) {
        timeout = setTimeout(() => {
          setSecondText(secondText.substring(0, secondText.length - 1));
        }, typingSpeed / 2);
      } else if (firstText.length > 0) {
        timeout = setTimeout(() => {
          setFirstText(firstText.substring(0, firstText.length - 1));
        }, typingSpeed / 2);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setIndex((prevIndex) => (prevIndex + 1) % firstTexts.length);
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [firstText, secondText, isDeleting, index]);

  return (
    <h1 className={styles.text3xl}>
      A software engineer building{" "}
      <span>
        {firstText}
        <span className={isResting ? styles.blinkingCursor : ""}>|</span>
      </span>{" "}
      products through{" "}
      <span>
        {secondText}
        <span className={isResting ? styles.blinkingCursor : ""}>|</span>
      </span>
      .
    </h1>
  );
}
