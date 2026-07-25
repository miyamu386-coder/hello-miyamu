import type { CSSProperties } from "react";

export type DiaryCategory = "work" | "life";

export type DiaryCard = {
  id: string;
  name: string;
  category: DiaryCategory;
  unit: string;
};

type Props = {
  cards: DiaryCard[];
  onSelect: (card: DiaryCard) => void;
  onAddCard: (category: DiaryCategory) => void;
  onRenameCard: (cardId: string, name: string) => void;
};

export default function DiaryHome({
  cards,
  onSelect,
  onAddCard,
  onRenameCard,
}: Props) {
  const workCards = cards.filter((card) => card.category === "work");
  const lifeCards = cards.filter((card) => card.category === "life");

  return (
    <section>
      <h2 style={titleStyle}>ホーム</h2>

      <DiaryCardSection
        title="仕事"
        category="work"
        cards={workCards}
        onSelect={onSelect}
        onAddCard={onAddCard}
        onRenameCard={onRenameCard}
      />

      <DiaryCardSection
        title="生活"
        category="life"
        cards={lifeCards}
        onSelect={onSelect}
        onAddCard={onAddCard}
        onRenameCard={onRenameCard}
      />
    </section>
  );
}

type DiaryCardSectionProps = {
  title: string;
  category: DiaryCategory;
  cards: DiaryCard[];
  onSelect: (card: DiaryCard) => void;
  onAddCard: (category: DiaryCategory) => void;
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
          onClick={() => onAddCard(category)}
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

const titleStyle: CSSProperties = {
  margin: "0 0 28px",
  textAlign: "center",
};

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