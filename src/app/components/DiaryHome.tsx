import { useState, type CSSProperties } from "react";

export type DiaryCategory = "work" | "life";
export type DiaryUnit = "時間" | "分" | "回数";

export type DiaryCard = {
  id: string;
  name: string;
  category: DiaryCategory;
  unit: DiaryUnit;
};

type Props = {
  cards: DiaryCard[];
  onSelect: (card: DiaryCard) => void;
  onAddCard: (
    category: DiaryCategory,
    name: string,
    unit: DiaryUnit
  ) => void;
  onRenameCard: (cardId: string, name: string) => void;
};

export default function DiaryHome({
  cards,
  onSelect,
  onAddCard,
  onRenameCard,
}: Props) {
  const [openCategory, setOpenCategory] =
    useState<DiaryCategory | null>(null);

  const workCards = cards.filter((card) => card.category === "work");
  const lifeCards = cards.filter((card) => card.category === "life");

  return (
  <section>
    <div style={houseStageStyle}>
      <div style={houseTitleStyle}>
        モフのいる家
      </div>

      <div style={roomStyle}>
  <button
    type="button"
    aria-label="仕事"
    style={deskHotspotStyle}
    onClick={() => setOpenCategory("work")}
  />

  <button
    type="button"
    aria-label="生活"
    style={bedHotspotStyle}
    onClick={() => setOpenCategory("life")}
  />

  <div style={mofuStyle}>
    <img
      src="/mofu-normal.png"
      alt="モフ"
      style={mofuImageStyle}
    />
  </div>
</div>
    </div>

    {openCategory === "work" && (
      <DiaryCardSection
        title="仕事"
        category="work"
        cards={workCards}
        onSelect={onSelect}
        onAddCard={onAddCard}
        onRenameCard={onRenameCard}
      />
    )}

    {openCategory === "life" && (
      <DiaryCardSection
        title="生活"
        category="life"
        cards={lifeCards}
        onSelect={onSelect}
        onAddCard={onAddCard}
        onRenameCard={onRenameCard}
      />
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
  onRenameCard: (cardId: string, name: string) => void;
};

function DiaryCardSection({
  title,
  category,
  cards,
  onSelect,
  onAddCard,
  onRenameCard,
}: DiaryCardSectionProps) {
    const handleRenameCard = (card: DiaryCard) => {
     const newName = window.prompt(
      "新しいカード名を入力してください",
       card.name
  );

  if (newName === null) {
    return;
  }

  onRenameCard(card.id, newName);
};

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
      "単位を入力してください（時間・分・回数）",
      category === "work" ? "時間" : "回数"
    );

    if (
      unitInput !== "時間" &&
      unitInput !== "分" &&
      unitInput !== "回数"
    ) {
      window.alert("単位は「時間」「分」「回数」から入力してください");
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
  <strong style={cardNameStyle}>{card.name}</strong>

  <button
    type="button"
    style={renameButtonStyle}
    onClick={(e) => {
      e.stopPropagation();
      handleRenameCard(card);
    }}
  >
    ✏️ 名前変更
  </button>

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

const cardUnitStyle: CSSProperties = {
  color: "#666",
  fontSize: 13,
};

const renameButtonStyle: CSSProperties = {
  padding: "4px 8px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
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
  padding: 20,
  borderRadius: 20,
  border: "2px solid #d8c7ad",
  background: "#f6ead8",
};

const houseTitleStyle: CSSProperties = {
  marginBottom: 16,
  fontSize: 22,
  fontWeight: 800,
  textAlign: "center",
};

const roomStyle: CSSProperties = {
  position: "relative",
  minHeight: 420,
  overflow: "hidden",
  borderRadius: 16,
  border: "2px solid #c7aa83",
  backgroundImage: 'url("/room/mofu-room.png")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

const furnitureButtonStyle: CSSProperties = {
  position: "absolute",
  minWidth: 120,
  minHeight: 110,
  padding: 12,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  borderRadius: 14,
  border: "2px solid #b89a74",
  background: "rgba(255, 255, 255, 0.9)",
  cursor: "pointer",
  fontSize: 44,
  zIndex: 2,
};

const furnitureLabelStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
};

const mofuStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: 12,
  width: 150,
  height: 210,
  transform: "translateX(-50%)",
  zIndex: 5,
  pointerEvents: "none",
};

const windowStyle: CSSProperties = {
  position: "absolute",
  top: 28,
  left: "50%",
  width: 150,
  height: 110,
  padding: 8,
  border: "8px solid #9b7653",
  background: "#dff3ff",
  transform: "translateX(-50%)",
  zIndex: 1,
};

const windowGlassStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid #b8d8e8",
  background: "linear-gradient(#bfe8ff, #f8fdff)",
  fontSize: 36,
};

const tableStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: 48,
  width: 110,
  minHeight: 72,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  borderRadius: "50%",
  border: "2px solid #9a7048",
  background: "#d3a36f",
  transform: "translateX(-50%)",
  fontSize: 34,
  zIndex: 3,
};

const shelfStyle: CSSProperties = {
  position: "absolute",
  right: 16,
  top: 24,
  width: 90,
  minHeight: 120,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  border: "3px solid #7f5b3b",
  background: "#b8875b",
  fontSize: 34,
  zIndex: 2,
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