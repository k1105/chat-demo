"use client";

import {useState} from "react";
import styles from "./ChatSettings.module.scss";

interface ChatSettingsProps {
  onOptionChange: (option: string) => void;
  onDebugChange: (settings: {
    blockedHiragana: string[];
    freezeProbability: number;
    bugHiragana: string[];
    bugProbability: number;
  }) => void;
}

export default function ChatSettings({
  onOptionChange,
  onDebugChange,
}: ChatSettingsProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [showDebugger, setShowDebugger] = useState(false);
  const [debugSettings, setDebugSettings] = useState({
    blockedHiragana: "あ、い、う、え、お",
    freezeProbability: 0.3,
    bugHiragana: "か、き、く、け、こ",
    bugProbability: 0.7,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    onOptionChange(value);
  };

  const handleDebugChange = (field: string, value: string | number) => {
    const newSettings = {...debugSettings, [field]: value};
    setDebugSettings(newSettings);

    // 設定を親コンポーネントに通知
    onDebugChange({
      blockedHiragana: newSettings.blockedHiragana.split("、").filter(Boolean),
      freezeProbability: Number(newSettings.freezeProbability),
      bugHiragana: newSettings.bugHiragana.split("、").filter(Boolean),
      bugProbability: Number(newSettings.bugProbability),
    });
  };

  const options = [
    {id: "option1", label: "バグ・フリーズ"},
    {id: "option2", label: "選択肢２"},
    {id: "option3", label: "選択肢３"},
  ];

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.mainSettings}>
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
        <button
          className={styles.debugToggle}
          onClick={() => setShowDebugger(!showDebugger)}
        >
          {showDebugger ? "デバッガーを隠す" : "デバッガーを表示"}
        </button>
      </div>

      {showDebugger && (
        <div className={styles.debugger}>
          <h3>デバッガー設定</h3>
          <div className={styles.debugSection}>
            <label>
              フリーズ対象:
              <input
                type="text"
                value={debugSettings.blockedHiragana}
                onChange={(e) =>
                  handleDebugChange("blockedHiragana", e.target.value)
                }
                placeholder="あ、い、う、え、お"
              />
            </label>
            <label>
              フリーズ確率:
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={debugSettings.freezeProbability}
                onChange={(e) =>
                  handleDebugChange("freezeProbability", Number(e.target.value))
                }
              />
            </label>
          </div>
          <div className={styles.debugSection}>
            <label>
              バグ対象:
              <input
                type="text"
                value={debugSettings.bugHiragana}
                onChange={(e) =>
                  handleDebugChange("bugHiragana", e.target.value)
                }
                placeholder="か、き、く、け、こ"
              />
            </label>
            <label>
              バグ確率:
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={debugSettings.bugProbability}
                onChange={(e) =>
                  handleDebugChange("bugProbability", Number(e.target.value))
                }
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
