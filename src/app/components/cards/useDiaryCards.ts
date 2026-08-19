import { useEffect, useState } from "react";
import type {
  DiaryCard,
  DiaryCategory,
  DiaryUnit,
} from "../DiaryHome";

const STORAGE_KEY = "miyamu-diary-cards";

const createDefaultCards = (): DiaryCard[] => [
  {
    id: "default-food",
    name: "食事量",
    category: "life",
    unit: "kcal",
  },
  {
    id: "default-weight",
    name: "体重表",
    category: "life",
    unit: "kg",
  },
  {
    id: "default-training",
    name: "筋トレ",
    category: "life",
    unit: "回数",
  },
  {
    id: "default-stretch",
    name: "ストレッチ",
    category: "life",
    unit: "回数",
  },
];

export function useDiaryCards() {
  const [cards, setCards] = useState<DiaryCard[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

   if (saved) {
  try {
    const parsed = (JSON.parse(saved) as DiaryCard[]).filter(
  (card) =>
    card.id !== "default-sleep" &&
    card.id !== "default-water"
);
    const defaults = createDefaultCards();

    const merged = [
      ...parsed,
      ...defaults.filter(
        (defaultCard) =>
          !parsed.some(
            (card) =>
              card.name === defaultCard.name
          )
      ),
    ];

    setCards(merged);
    return;
  } catch {
    // 保存データが壊れていた場合は初期カードを使用
  }
}

    setCards(createDefaultCards());
  }, []);

  useEffect(() => {
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
const deleteCard = (cardId: string) => {
  setCards((currentCards) =>
    currentCards.filter((card) => card.id !== cardId)
  );
};

  return {
  cards,
  addCard,
  renameCard,
  deleteCard,
};
}