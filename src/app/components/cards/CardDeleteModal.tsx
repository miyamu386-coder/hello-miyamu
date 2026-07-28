"use client";

import { useEffect, useState } from "react";
import type { DiaryCard } from "../DiaryHome";

export type CardDeleteMode = "cardOnly" | "cardAndLogs";

type Props = {
  card: DiaryCard | null;
  onClose: () => void;
  onDelete: (cardId: string, mode: CardDeleteMode) => void;
};

export default function CardDeleteModal({
  card,
  onClose,
  onDelete,
}: Props) {
  const [mode, setMode] = useState<CardDeleteMode>("cardOnly");

  useEffect(() => {
    if (card) {
      setMode("cardOnly");
    }
  }, [card]);

  if (!card) {
    return null;
  }

  const handleDelete = () => {
    onDelete(card.id, mode);
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
        zIndex: 110,
      }}
    >
      <div
        style={{
          width: "min(440px, calc(100% - 40px))",
          padding: 24,
          borderRadius: 18,
          background: "#fff",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          カードを削除
        </h2>

        <p>
          「{card.name}」を削除します。
        </p>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: 12,
            cursor: "pointer",
          }}
        >
          <input
            type="radio"
            name="deleteMode"
            value="cardOnly"
            checked={mode === "cardOnly"}
            onChange={() => setMode("cardOnly")}
          />

          <span>
            <strong>カードだけ削除</strong>
            <br />
            記録データは残します。
          </span>
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: 12,
            cursor: "pointer",
          }}
        >
          <input
            type="radio"
            name="deleteMode"
            value="cardAndLogs"
            checked={mode === "cardAndLogs"}
            onChange={() => setMode("cardAndLogs")}
          />

          <span>
            <strong>カードと記録を削除</strong>
            <br />
            このカードに関連する記録も完全に削除します。
          </span>
        </label>

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
            onClick={onClose}
          >
            キャンセル
          </button>

          <button
            type="button"
            onClick={handleDelete}
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
}