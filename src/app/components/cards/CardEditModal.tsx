"use client";

import { useEffect, useState } from "react";
import type { DiaryCard } from "../DiaryHome";

type Props = {
  card: DiaryCard | null;
  onClose: () => void;
  onSave: (cardId: string, name: string) => void;
  onDelete: (card: DiaryCard) => void;
};

export default function CardEditModal({
  card,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (card) {
      setName(card.name);
    }
  }, [card]);

  if (!card) {
    return null;
  }

  const handleSave = () => {
    const trimmed = name.trim();

    if (!trimmed) {
      return;
    }

    onSave(card.id, trimmed);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: "min(420px, calc(100% - 40px))",
          padding: 24,
          borderRadius: 18,
          background: "#fff",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          カードを編集
        </h2>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button
  type="button"
  onClick={() => onDelete(card)}
  style={{
    marginRight: "auto",
    color: "#d32f2f",
  }}
>
  削除
</button>

<button
  type="button"
  onClick={onClose}
>
  キャンセル
</button>

<button
  type="button"
  onClick={handleSave}
>
  保存
</button>
        </div>
      </div>
    </div>
  );
}