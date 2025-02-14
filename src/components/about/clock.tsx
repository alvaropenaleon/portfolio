"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/about/clock.module.css";

const getMelbourneTime = () => {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Australia/Melbourne" })
  );

  return {
    hours: now.getHours(), // Convert 24 to 12 h format: % 12 || 12
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    formattedTime: now.toLocaleTimeString("en-AU", {
      timeZone: "Australia/Melbourne",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, //12 h format am/pm: true
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

  // Calculate rotation angles for each hand
  const secondDeg = (time.seconds / 60) * 360;
  const minuteDeg = (time.minutes / 60) * 360 + (time.seconds / 60) * 6;
  const hourDeg = (time.hours / 12) * 360 + (time.minutes / 60) * 30;

  return (
    <div
      className={styles.clockContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Analog when not hover */}
      {!isHovered && (
        <svg viewBox="0 0 100 100" className={styles.clock}>
          <circle cx="50" cy="50" r="45" className={styles.clockOutline} />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="30"
            className={styles.hourHand}
            style={{
              transform: `rotate(${hourDeg}deg)`,
              transformOrigin: "50% 50%",
            }}
          />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="20"
            className={styles.minuteHand}
            style={{
              transform: `rotate(${minuteDeg}deg)`,
              transformOrigin: "50% 50%",
            }}
          />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="15"
            className={styles.secondHand}
            style={{
              transform: `rotate(${secondDeg}deg)`,
              transformOrigin: "50% 50%",
            }}
          />
          <circle cx="50" cy="50" r="1" className={styles.centerDot} />
        </svg>
      )}

      {/* Digital when hover */}
      {isHovered && (
        <span className={styles.digitalTime}>
          <p className={styles.timezone}>
            AEDT
            <br />
            UTC+11
            <br />
            Melbourne
          </p>
          {time.formattedTime}
        </span>
      )}
    </div>
  );
}
