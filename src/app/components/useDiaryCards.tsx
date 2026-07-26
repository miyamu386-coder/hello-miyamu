import { useEffect, useState } from "react";
import type {
  DiaryCard,
  DiaryCategory,
  DiaryUnit,
} from "./DiaryHome";

const STORAGE_KEY = "miyamu-diary-cards";

const createDefaultCards = (): DiaryCard[] => [];

export function useDiaryCards() {
  const [cards, setCards] = useState<DiaryCard[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DiaryCard[];
        setCards(parsed);
        return;
      } catch {
        // 保存データが壊れていた場合は初期カードを使用
      }
    }

    setCards(createDefaultCards());
  }, []);

  useEffect(() => {
    if (cards.length === 0) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const addCard = (
    category: DiaryCategory,
    name: string,
    unit: DiaryUnit
  ) => {
    const trimmed = name.trim();

    if (!trimmed) {
      return;
    }

    setCards((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: trimmed,
        category,
        unit,
      },
    ]);
  };

  const renameCard = (cardId: string, name: string) => {
    const trimmed = name.trim();

    if (!trimmed) {
      return;
    }

    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              name: trimmed,
            }
          : card
      )
    );
  };

  return {
    cards,
    addCard,
    renameCard,
  };
}