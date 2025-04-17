"use client";

import {useState} from "react";
import styles from "./ChatSettings.module.scss";

interface ChatSettingsProps {
  onOptionChange: (option: string) => void;
}

export default function ChatSettings({onOptionChange}: ChatSettingsProps) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    onOptionChange(value);
  };

  return (
    <div className={styles.settingsContainer}>
      <select
        value={selectedOption}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="">選択してください</option>
        <option value="option1">選択肢１</option>
        <option value="option2">選択肢２</option>
        <option value="option3">選択肢３</option>
      </select>
    </div>
  );
}
