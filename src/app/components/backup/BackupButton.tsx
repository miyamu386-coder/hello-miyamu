"use client";

import { useRef } from "react";

type Props = {
  storageKeyBase: string;
};

type BackupFile = {
  app: string;
  version: number;
  createdAt: string;
  data: Record<string, unknown>;
};

export default function BackupButton({
  storageKeyBase,
}: Props) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const handleBackup = () => {
    const backupData: Record<string, unknown> = {};

    for (
      let index = 0;
      index < localStorage.length;
      index += 1
    ) {
      const key = localStorage.key(index);

      if (!key) continue;

      const lowerKey = key.toLowerCase();

      const isDiaryLog =
        key.startsWith(storageKeyBase);

      const isDiaryCard =
        lowerKey.includes("diary") &&
        lowerKey.includes("card");

      if (!isDiaryLog && !isDiaryCard) {
        continue;
      }

      const raw = localStorage.getItem(key);

      if (raw === null) continue;

      try {
        backupData[key] = JSON.parse(raw);
      } catch {
        backupData[key] = raw;
      }
    }

    const backup: BackupFile = {
      app: "みやむDiary",
      version: 1,
      createdAt: new Date().toISOString(),
      data: backupData,
    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const date = new Date()
      .toISOString()
      .slice(0, 10);

    link.href = url;
    link.download =
      `miyamu-diary-backup-${date}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const handleRestore = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("app" in parsed) ||
        !("version" in parsed) ||
        !("data" in parsed)
      ) {
        window.alert(
          "みやむDiaryのバックアップファイルではありません"
        );
        return;
      }

      const backup = parsed as BackupFile;

      if (
        backup.app !== "みやむDiary" ||
        backup.version !== 1 ||
        typeof backup.data !== "object" ||
        backup.data === null
      ) {
        window.alert(
          "対応していないバックアップファイルです"
        );
        return;
      }

      const shouldRestore = window.confirm(
        "現在のデータにバックアップ内容を上書きします。\n復元してよろしいですか？"
      );

      if (!shouldRestore) {
        return;
      }

      Object.entries(backup.data).forEach(
        ([key, value]) => {
          localStorage.setItem(
            key,
            typeof value === "string"
              ? value
              : JSON.stringify(value)
          );
        }
      );

      window.alert(
        "バックアップを復元しました。画面を再読み込みします。"
      );

      window.location.reload();
    } catch {
      window.alert(
        "バックアップファイルを読み込めませんでした"
      );
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <button
        type="button"
        onClick={handleBackup}
        style={{
          padding: "10px 16px",
          borderRadius: 12,
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        📦 バックアップを作成
      </button>

      <button
        type="button"
        onClick={() =>
          fileInputRef.current?.click()
        }
        style={{
          padding: "10px 16px",
          borderRadius: 12,
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        ♻️ バックアップを復元
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleRestore}
        style={{
          display: "none",
        }}
      />
    </div>
  );
}