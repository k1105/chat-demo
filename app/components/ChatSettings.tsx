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

  const options = [
    {id: "option1", label: "バグ・フリーズ"},
    {id: "option2", label: "選択肢２"},
    {id: "option3", label: "選択肢３"},
  ];

  return (
    <div className={styles.settingsContainer}>
      <select
        value={selectedOption}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="">選択してください</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
