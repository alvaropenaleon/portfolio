"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/about/clock.module.css";

function getMelbourneTime() {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Australia/Melbourne" })
  );

  const dayOfWeek = now.toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne",
    weekday: "long",
  });

  const month = now.toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne",
    month: "long",
  });

  const day = now.getDate();

  // Compute UTC offset for Melbourne
  const totalOffsetMinutes = -now.getTimezoneOffset();
  const offsetHours = Math.floor(totalOffsetMinutes / 60);
  const offsetMinutes = Math.abs(totalOffsetMinutes % 60);

  const sign = offsetHours >= 0 ? "+" : "-";
  const absHours = Math.abs(offsetHours);
  const offsetStr =
    offsetMinutes === 0
      ? `${absHours}`
      : `${absHours}:${String(offsetMinutes).padStart(2, "0")}`;

  const formattedOffset = `UTC${sign}${offsetStr}`;
  const formattedDate = `${dayOfWeek}, ${month} ${day}, ${formattedOffset}`;

  const formattedTime = now.toLocaleTimeString("en-AU", {
    timeZone: "Australia/Melbourne",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return { formattedDate, formattedTime };
}

export default function Clock() {
  const [dateTime, setDateTime] = useState(getMelbourneTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(getMelbourneTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.clockContainer}>
      <div className={styles.topRow}>
        <div className={styles.location}>Melbourne, AU</div>
        <div className={styles.time}>{dateTime.formattedTime}</div>
      </div>
      <div className={styles.date}>{dateTime.formattedDate}</div>
    </div>
  );
}
