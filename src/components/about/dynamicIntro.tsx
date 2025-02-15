"use client";

import { useState, useEffect } from "react";
import typo from "@/styles/ui/typography.module.css";

const firstTexts = ["scalable", "human-centred", "data-driven"];
const secondTexts = ["code", "design", "problem-solving"];
const colors = ["#ff5733", "#33ff57", "#9922FF"];

export default function DynamicText() {
  const [index, setIndex] = useState(0);
  const [firstText, setFirstText] = useState("");
  const [secondText, setSecondText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [textColor, setTextColor] = useState(0);
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
        }, 2000);
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
          setTextColor((prevColorIndex) => (prevColorIndex + 1) % colors.length);
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [firstText, secondText, isDeleting, index]);

  // Cursor logic:
  const showFirstCursor = firstText.length < firstTexts[index].length && !isResting;
  const showSecondCursor = secondText.length > 0 && (secondText.length < secondTexts[index % secondTexts.length].length || isResting);

  return (
    <h1 className={typo.xxl}>
      A computer scientist building{" "}
      <span>
        <span style={{ color: colors[textColor] }}>{firstText}</span>
        {showFirstCursor && <span className={typo.blinkingCursor}>|</span>}
      </span>{" "}
      products through{" "}
      <span>
        <span style={{ color: colors[textColor] }}>{secondText}</span>
        {showSecondCursor && <span className={typo.blinkingCursor}>|</span>}
      </span>
      .
    </h1>
  );
}
