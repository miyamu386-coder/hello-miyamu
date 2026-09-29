"use client";

import { useRef } from "react";
import {
  Directory,
  Encoding,
  Filesystem,
} from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

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

  const handleBackup = async () => {
    try {
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

        const isCalendarSchedule =
          key === "miyamu_diary_schedules_v1";

        if (
          !isDiaryLog &&
          !isDiaryCard &&
          !isCalendarSchedule
        ) {
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

      const date = new Date()
        .toISOString()
        .slice(0, 10);

      const fileName =
        `miyamu-diary-backup-${date}.json`;

      const result = await Filesystem.writeFile({
        path: fileName,
        data: JSON.stringify(backup, null, 2),
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });

      await Share.share({
        title: "みやむDiary バックアップ",
        text: "みやむDiaryのバックアップファイルです。",
        url: result.uri,
        dialogTitle: "バックアップを保存",
      });
    } catch (error) {
      console.error(
        "バックアップ作成エラー:",
        error
      );

      window.alert(
        "バックアップを作成できませんでした"
      );
    }
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
      marginTop: 28,
    }}
  >
    <div
      style={{
        marginBottom: 8,
        paddingLeft: 4,
        fontSize: 13,
        fontWeight: 700,
        color: "#666",
      }}
    >
      データ管理
    </div>

    <div
      style={{
        overflow: "hidden",
        borderRadius: 16,
        background: "#fff",
        border: "1px solid #e5e5e5",
      }}
    >
      <button
        type="button"
        onClick={handleBackup}
        style={{
          width: "100%",
          minHeight: 56,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontSize: 22,
          }}
        >
          📦
        </span>

        <span
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          バックアップを作成
        </span>

        <span
          style={{
            color: "#aaa",
            fontSize: 22,
          }}
        >
          ›
        </span>
      </button>

      <div
        style={{
          height: 1,
          marginLeft: 50,
          background: "#eee",
        }}
      />

      <button
        type="button"
        onClick={() =>
          fileInputRef.current?.click()
        }
        style={{
          width: "100%",
          minHeight: 56,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontSize: 22,
          }}
        >
          ♻️
        </span>

        <span
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          バックアップを復元
        </span>

        <span
          style={{
            color: "#aaa",
            fontSize: 22,
          }}
        >
          ›
        </span>
      </button>
    </div>

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