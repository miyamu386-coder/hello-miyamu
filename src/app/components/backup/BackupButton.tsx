"use client";

type Props = {
  storageKeyBase: string;
};

export default function BackupButton({
  storageKeyBase,
}: Props) {
  const handleBackup = () => {
    const backupData: Record<string, unknown> = {};

    for (
      let index = 0;
      index < localStorage.length;
      index += 1
    ) {
      const key = localStorage.key(index);

      if (!key) continue;

      const isDiaryLog =
        key.startsWith(storageKeyBase);

      const isDiaryCard =
        key.toLowerCase().includes("diary") &&
        key.toLowerCase().includes("card");

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

    const backup = {
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

  return (
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
  );
}