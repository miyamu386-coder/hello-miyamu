import { useState, type CSSProperties } from "react";
import RoomSwiper from "./room/RoomSwiper";
import LivingBook from "./book/LivingBook";
import CalendarPage from "./calendar/CalendarPage";

export type DiaryCategory = "work" | "life";
export type DiaryUnit =
  | "時間"
  | "分"
  | "回数"
  | "kcal"
  | "kg";

export type DiaryCard = {
  id: string;
  name: string;
  category: DiaryCategory;
  unit: DiaryUnit;
};

type Props = {
  cards: DiaryCard[];
  currentYm: string;
  storageKeyBase: string;
  onSelect: (card: DiaryCard) => void;
  onAddCard: (
    category: DiaryCategory,
    name: string,
    unit: DiaryUnit
  ) => void;
  onEditCard: (card: DiaryCard) => void;
};
export default function DiaryHome({
  cards,
  currentYm,
  storageKeyBase,
  onSelect,
  onAddCard,
  onEditCard,
}: Props) {
  const [openCategory, setOpenCategory] =
    useState<DiaryCategory | null>(null);

  const workCards = cards.filter((card) => card.category === "work");
  const lifeCards = cards.filter((card) => card.category === "life");
  const [isPuzzleOpen, setIsPuzzleOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const openCardByName = (cardName: string) => {
  const targetCard = cards.find((card) => card.name === cardName);

  if (!targetCard) {
    window.alert(`「${cardName}」カードが見つかりません`);
    return;
  }

  onSelect(targetCard);
};
if (isBookOpen) {
  return (
    <LivingBook
      cards={cards}
      currentYm={currentYm}
      storageKeyBase={storageKeyBase}
      onBack={() => setIsBookOpen(false)}
    />
  );
}

if (isCalendarOpen) {
  return (
    <CalendarPage
      onBack={() => setIsCalendarOpen(false)}
    />
  );
}


  return (
  <section>
    <div style={houseStageStyle}>
      <div style={houseTitleStyle}>
        みやむDiary
      </div>

 <RoomSwiper
  onOpenKitchen={() => {
    setIsPuzzleOpen(false);
    setOpenCategory("life");
  }}
  onOpenFridge={() => {
    setIsPuzzleOpen(false);
    setOpenCategory(null);
    openCardByName("食事量");
  }}
  onOpenWork={() => {
    setIsPuzzleOpen(false);
    setOpenCategory("work");
  }}
  onOpenPuzzle={() => {
    setOpenCategory(null);
    setIsPuzzleOpen(true);
  }}
  onOpenBook={() => {
    setOpenCategory(null);
    setIsPuzzleOpen(false);
    setIsBookOpen(true);
  }}
  onOpenCalendar={() => {
    setOpenCategory(null);
    setIsPuzzleOpen(false);
    setIsBookOpen(false);
    setIsCalendarOpen(true);
  }}
  onOpenConditioning={() => {
    setIsPuzzleOpen(false);
    setOpenCategory("life");
  }}
/>
    </div>

    {openCategory === "work" && (
  <div style={modalOverlayStyle}>
    <div style={modalContentStyle}>
      <button
        type="button"
        aria-label="仕事カード一覧を閉じる"
        style={modalCloseButtonStyle}
        onClick={() => setOpenCategory(null)}
      >
        ×
      </button>

      <DiaryCardSection
        title="仕事"
        category="work"
        cards={workCards}
        onSelect={onSelect}
        onAddCard={onAddCard}
        onEditCard={onEditCard}
      />
    </div>
  </div>
)}

   {openCategory === "life" && (
  <DiaryCardSection
    title="生活"
    category="life"
    cards={lifeCards}
    onSelect={onSelect}
    onAddCard={onAddCard}
    onEditCard={onEditCard}
  />
)}
      {isPuzzleOpen && (
  <section style={puzzleSectionStyle}>
    <h2 style={puzzleTitleStyle}>モフのナンプレ</h2>

    <p style={puzzleTextStyle}>
      今日の問題を準備中です🐾
    </p>

    <button
      type="button"
      style={puzzleCloseButtonStyle}
      onClick={() => setIsPuzzleOpen(false)}
    >
      部屋へ戻る
    </button>
  </section>
)}

  </section>
);
}

type DiaryCardSectionProps = {
  title: string;
  category: DiaryCategory;
  cards: DiaryCard[];
  onSelect: (card: DiaryCard) => void;
  onAddCard: (
    category: DiaryCategory,
    name: string,
    unit: DiaryUnit
  ) => void;
  onEditCard: (card: DiaryCard) => void;
};

function DiaryCardSection({
  title,
  category,
  cards,
  onSelect,
  onAddCard,
  onEditCard,
}: DiaryCardSectionProps) {

  return (
    <section style={sectionStyle}>
      <div style={sectionHeaderStyle}>
        <h3 style={sectionTitleStyle}>{title}</h3>

        <button
  type="button"
  style={addButtonStyle}
  onClick={() => {
    const name = window.prompt("カード名を入力してください");

    if (name === null || !name.trim()) {
      return;
    }

    const unitInput = window.prompt(
  "単位を入力してください（時間・分・回数・kcal・kg）",
  category === "work" ? "時間" : "kcal"
);

if (
  unitInput !== "時間" &&
  unitInput !== "分" &&
  unitInput !== "回数" &&
  unitInput !== "kcal" &&
  unitInput !== "kg"
) {
  window.alert(
    "単位は「時間」「分」「回数」「kcal」「kg」から入力してください"
  );
  return;
}

    onAddCard(category, name.trim(), unitInput);
  }}
>
  ＋ カード追加
</button>
      </div>

      {cards.length > 0 ? (
        <div style={gridStyle}>
          {cards.map((card) => (
           <div
  key={card.id}
  style={cardStyle}
  onClick={() => onSelect(card)}
>
  <button
    type="button"
    style={menuButtonStyle}
    aria-label={`${card.name}のメニューを開く`}
    onClick={(e) => {
      e.stopPropagation();
      onEditCard(card);
    }}
  >
    ⋮
  </button>

  <strong style={cardNameStyle}>{card.name}</strong>


  <span style={cardUnitStyle}>
    記録単位：{card.unit}
  </span>
</div>
          ))}
        </div>
      ) : (
        <div style={emptyStyle}>
          まだカードがありません
        </div>
      )}
    </section>
  );
}

const sectionStyle: CSSProperties = {
  marginTop: 28,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 12,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
};

const cardStyle: CSSProperties = {
  position: "relative",
  minHeight: 110,
  padding: 20,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  textAlign: "center",
};

const cardNameStyle: CSSProperties = {
  fontSize: 18,
};
const menuButtonStyle: CSSProperties = {
  position: "absolute",
  top: 6,
  right: 6,
  width: 32,
  height: 32,
  padding: 0,
  border: "none",
  borderRadius: 8,
  background: "transparent",
  cursor: "pointer",
  fontSize: 24,
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardUnitStyle: CSSProperties = {
  color: "#666",
  fontSize: 13,
};

const addButtonStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const emptyStyle: CSSProperties = {
  padding: 24,
  borderRadius: 12,
  border: "1px dashed #ccc",
  color: "#777",
  textAlign: "center",
};
const houseStageStyle: CSSProperties = {
  width: "100%",
  padding: 0,
  border: "none",
  borderRadius: 0,
  background: "transparent",
};

const houseTitleStyle: CSSProperties = {
  marginBottom: 16,
  fontSize: 22,
  fontWeight: 800,
  textAlign: "center",
};

const roomStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  aspectRatio: "9 / 16",
  margin: "0 auto",
  overflow: "hidden",
  backgroundImage: 'url("/room/mofu-room.png")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};


const mofuStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: 12,
  width: 120,
  height: 170,
  transform: "translateX(-50%)",
  zIndex: 5,
  pointerEvents: "none",
};

const mofuImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  display: "block",
};
const deskHotspotStyle: CSSProperties = {
  position: "absolute",
  left: "4%",
  bottom: "24%",
  width: "28%",
  height: "42%",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  zIndex: 4,
};
const bedHotspotStyle: CSSProperties = {
  position: "absolute",
  right: "4%",
  bottom: "20%",
  width: "30%",
  height: "38%",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  zIndex: 4,
};
const puzzleSectionStyle: CSSProperties = {
  marginTop: 28,
  padding: 24,
  borderRadius: 20,
  border: "1px solid #ddd",
  background: "#fff",
  textAlign: "center",
};

const puzzleTitleStyle: CSSProperties = {
  margin: "0 0 12px",
};

const puzzleTextStyle: CSSProperties = {
  margin: "0 0 20px",
  color: "#666",
};

const puzzleCloseButtonStyle: CSSProperties = {
  padding: "10px 18px",
  border: "none",
  borderRadius: 999,
  background: "#4f7c5b",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
const modalOverlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  background: "rgba(0, 0, 0, 0.45)",
  zIndex: 1000,
};

const modalContentStyle: CSSProperties = {
  position: "relative",
  width: "min(680px, 100%)",
  maxHeight: "85vh",
  overflowY: "auto",
  padding: 24,
  borderRadius: 20,
  background: "#fff",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
};

const modalCloseButtonStyle: CSSProperties = {
  position: "absolute",
  top: 10,
  right: 10,
  width: 36,
  height: 36,
  padding: 0,
  border: "none",
  borderRadius: 999,
  background: "#f0f0f0",
  cursor: "pointer",
  fontSize: 24,
  lineHeight: 1,
};