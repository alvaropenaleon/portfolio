"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/about/clock.module.css";

const getMelbourneTime = () => {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Australia/Melbourne" })
  );

  return {
    formattedTime: now.toLocaleTimeString("en-AU", {
      timeZone: "Australia/Melbourne",
      hour: "2-digit",
      minute: "2-digit",
      /*second: "2-digit",*/
      hour12: false, // 12h format am/pm: true
    }),
  };
};

export default function Clock() {
  const [time, setTime] = useState(getMelbourneTime());
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getMelbourneTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={styles.clockContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={styles.digitalTime}>
        {time.formattedTime}
      </span>
      {isHovered && (
        <p className={styles.timezone}>Melb, AU</p>
      )}
    </div>
  );
}