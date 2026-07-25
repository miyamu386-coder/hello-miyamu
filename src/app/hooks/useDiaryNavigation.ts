"use client";

import { useState } from "react";
import type { DiaryCard } from "../components/DiaryHome";

type DiaryView = "home" | "log";

export function useDiaryNavigation() {
  const [currentView, setCurrentView] = useState<DiaryView>("home");
  const [selectedCard, setSelectedCard] = useState<DiaryCard | null>(null);

  const openHome = () => {
    setCurrentView("home");
    setSelectedCard(null);
  };

  const selectCard = (card: DiaryCard) => {
    setSelectedCard(card);
    setCurrentView("log");
  };

  return {
    currentView,
    selectedCard,
    openHome,
    selectCard,
  };
}