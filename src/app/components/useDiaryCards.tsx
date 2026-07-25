import { useEffect, useState } from "react";
import type { DiaryCard, DiaryCategory } from "./DiaryHome";

const STORAGE_KEY = "miyamu-diary-cards";

const createDefaultCards = (): DiaryCard[] => [
  {
    id: crypto.randomUUID(),
    name: "仕事",
    category: "work",
    unit: "時間",
  },
  {
    id: crypto.randomUUID(),
    name: "生活",
    category: "life",
    unit: "回",
  },
];

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
    if (cards.length === 0) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const addCard = (
    category: DiaryCategory,
    name = "新しいカード",
    unit = "回"
  ) => {
    setCards((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        category,
        unit,
      },
    ]);
  };

  return {
    cards,
    addCard,
  };
}