"use client";
import { useState } from "react";
import type { DiaryCard } from "../DiaryHome";

type Props = {
  cards: DiaryCard[];
  currentYm: string;
  storageKeyBase: string;
  onBack: () => void;
};

export default function LivingBook({
  cards,
  currentYm,
  storageKeyBase,
  onBack,
}: Props) {
  const [page, setPage] = useState<
  "summary" | "work" | "health" | "life"
>("summary");
const [bookYm, setBookYm] = useState(currentYm);
const moveBookMonth = (diff: number) => {
  const [year, month] = bookYm
    .split("-")
    .map(Number);

  const nextDate = new Date(
    year,
    month - 1 + diff,
    1
  );

  const nextYear = nextDate.getFullYear();
  const nextMonth = String(
    nextDate.getMonth() + 1
  ).padStart(2, "0");

  setBookYm(`${nextYear}-${nextMonth}`);
};

const getLogsByCard = (cardId: string) => {
  const storageKey =
    `${storageKeyBase}_${cardId}_${bookYm}`;

  try {
    const raw = localStorage.getItem(storageKey);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
};
const workSummaries = cards
  .filter((card) => card.category === "work")
  .map((card) => {
    const logs = getLogsByCard(card.id);

    const total = logs.reduce(
      (sum, log) =>
        sum +
        (
          typeof log === "object" &&
          log !== null &&
          "hours" in log &&
          typeof log.hours === "number"
            ? log.hours
            : 0
        ),
      0
    );

    const hoursTotal =
  card.unit === "分"
    ? total / 60
    : card.unit === "時間"
      ? total
      : 0;

return {
  card,
  total,
  hoursTotal,
};
  })
  .sort((a, b) => b.hoursTotal - a.hoursTotal);
const workHoursTotal = workSummaries.reduce(
  (sum, item) => sum + item.hoursTotal,
  0
);

const healthSummaries = cards
  .filter(
    (card) =>
      card.category === "life" &&
      (
        card.name === "体重表" ||
        card.name === "食事量" ||
        card.name === "筋トレ量" ||
        card.name === "睡眠時間" ||
        card.name === "水分量"
      )
  )
  .map((card) => {
    const logs = getLogsByCard(card.id);

    const total = logs.reduce(
      (sum, log) =>
        sum +
        (
          typeof log === "object" &&
          log !== null &&
          "hours" in log &&
          typeof log.hours === "number"
            ? log.hours
            : 0
        ),
      0
    );

   const value =
  card.name === "体重表" && logs.length > 0
    ? total / logs.length
    : total;

return {
  card,
  value,
  count: logs.length,
};
  });
  const lifeSummaries = cards
  .filter(
    (card) =>
      card.category === "life" &&
      !(
        card.name === "体重表" ||
        card.name === "食事量" ||
        card.name === "筋トレ量" ||
        card.name === "睡眠時間" ||
        card.name === "水分量"
      )
  )
  .map((card) => {
    const logs = getLogsByCard(card.id);

    const total = logs.reduce(
      (sum, log) =>
        sum +
        (
          typeof log === "object" &&
          log !== null &&
          "hours" in log &&
          typeof log.hours === "number"
            ? log.hours
            : 0
        ),
      0
    );

    return {
      card,
      total,
      count: logs.length,
    };
  });
const topWork = workSummaries.reduce<
  (typeof workSummaries)[number] | null
>((top, item) => {
  if (!top || item.hoursTotal > top.hoursTotal) {
    return item;
  }

  return top;
}, null);
if (page === "work") {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "#f5f6f7",
      }}
    >
      <div
        style={{
          width: "min(720px, 100%)",
          margin: "0 auto",
          padding: 28,
          borderRadius: 20,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <button
          type="button"
          onClick={() => setPage("summary")}
        >
          ← 今月のまとめへ
        </button>

        <h1>💼 仕事</h1>
        <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  }}
>
  <button
    type="button"
    onClick={() => moveBookMonth(-1)}
  >
    ◀ 前月
  </button>

  <strong>{bookYm}</strong>

  <button
    type="button"
    onClick={() => moveBookMonth(1)}
  >
    次月 ▶
  </button>
</div>

        <div
  style={{
    display: "grid",
    gap: 12,
  }}
>
  {workSummaries.length === 0 ? (
    <p style={{ color: "#666" }}>
      仕事カードがありません
    </p>
  ) : (
    workSummaries.map(({ card, total }) => (
      <div
        key={card.id}
        style={{
          padding: 16,
          borderRadius: 14,
          border: "1px solid #d8e2dc",
          background: "#f7faf8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <strong>{card.name}</strong>

        <span>
          {card.unit === "時間"
            ? total.toFixed(1)
            : Number.isInteger(total)
              ? total
              : total.toFixed(1)}{" "}
          {card.unit}
        </span>
      </div>
    ))
    )}
</div>

<div
  style={{
    marginTop: 20,
    paddingTop: 16,
    borderTop: "1px solid #d8e2dc",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    fontSize: 20,
    fontWeight: 800,
  }}
>
  <span>合計</span>
  <span>{workHoursTotal.toFixed(1)} 時間</span>
</div>
{topWork && topWork.hoursTotal > 0 && (
  <div
    style={{
      marginTop: 20,
      padding: 18,
      borderRadius: 16,
      border: "1px solid #ead9a7",
      background: "#fffaf0",
    }}
  >
    <div
      style={{
        fontSize: 17,
        fontWeight: 800,
      }}
    >
      🏆 今月一番頑張った仕事
    </div>

    <div
      style={{
        marginTop: 10,
        fontSize: 22,
        fontWeight: 800,
      }}
    >
      🥇 {topWork.card.name}
    </div>

    <div
      style={{
        marginTop: 4,
        color: "#555",
        fontSize: 18,
      }}
    >
      {topWork.hoursTotal.toFixed(1)} 時間
    </div>
  </div>
)}
<div
  style={{
    marginTop: 24,
  }}
>
  <div
    style={{
      fontWeight: 800,
      marginBottom: 12,
      fontSize: 18,
    }}
  >
    📊 割合
  </div>

  {workSummaries.map((item) => {
    const percent =
      workHoursTotal === 0
        ? 0
        : Math.round(
            (item.hoursTotal / workHoursTotal) * 100
          );

    return (
      <div
        key={item.card.id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: 90,
            fontWeight: 700,
          }}
        >
          {item.card.name}
        </div>

        <div
          style={{
            flex: 1,
            fontFamily: "monospace",
          }}
        >
          {"█".repeat(
            percent === 0
  ? 0
  : Math.max(1, Math.round(percent / 6))
          )}
        </div>

        <div
          style={{
            width: 45,
            textAlign: "right",
            fontWeight: 700,
          }}
        >
          {percent}%
        </div>
      </div>
    );
  })}
</div>
      </div>
    </main>
  );
}
if (page === "health") {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "#f5f6f7",
      }}
    >
      <div
        style={{
          width: "min(720px, 100%)",
          margin: "0 auto",
          padding: 28,
          borderRadius: 20,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <button
          type="button"
          onClick={() => setPage("summary")}
        >
          ← 今月のまとめへ
        </button>

        <h1>🌿 健康</h1>

<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  }}
>
  <button
    type="button"
    onClick={() => moveBookMonth(-1)}
  >
    ◀ 前月
  </button>

  <strong>{bookYm}</strong>

  <button
    type="button"
    onClick={() => moveBookMonth(1)}
  >
    次月 ▶
  </button>
</div>

<div
  style={{
    display: "grid",
    gap: 12,
  }}
>
  {healthSummaries.length === 0 ? (
  <p style={{ color: "#666" }}>
    健康カードがありません
  </p>
) : (
  healthSummaries.map(({ card, value }) => (
    <div
      key={card.id}
      style={{
        padding: 16,
        borderRadius: 14,
        border: "1px solid #d8e2dc",
        background: "#f7faf8",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <strong>{card.name}</strong>

      <span>
  {Number.isInteger(value)
    ? value
    : value.toFixed(1)}{" "}
  {card.unit}
</span>
    </div>
  ))
)}
</div>
      </div>
    </main>
  );
}
if (page === "life") {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "#f5f6f7",
      }}
    >
      <div
        style={{
          width: "min(720px, 100%)",
          margin: "0 auto",
          padding: 28,
          borderRadius: 20,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <button
          type="button"
          onClick={() => setPage("summary")}
        >
          ← 今月のまとめへ
        </button>

        <h1>🏠 生活</h1>

<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  }}
>
  <button
    type="button"
    onClick={() => moveBookMonth(-1)}
  >
    ◀ 前月
  </button>

  <strong>{bookYm}</strong>

  <button
    type="button"
    onClick={() => moveBookMonth(1)}
  >
    次月 ▶
  </button>
</div>

<div
  style={{
    display: "grid",
    gap: 12,
  }}
>
  {lifeSummaries.length === 0 ? (
    <p style={{ color: "#666" }}>
      生活カードがありません
    </p>
  ) : (
    lifeSummaries.map(({ card, total }) => (
      <div
        key={card.id}
        style={{
          padding: 16,
          borderRadius: 14,
          border: "1px solid #d8e2dc",
          background: "#f7faf8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <strong>{card.name}</strong>

        <span>
          {card.unit === "時間"
            ? total.toFixed(1)
            : Number.isInteger(total)
              ? total
              : total.toFixed(1)}{" "}
          {card.unit}
        </span>
      </div>
    ))
  )}
</div>
      </div>
    </main>
  );
}
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "#f5f6f7",
      }}
    >
      <div
        style={{
          width: "min(720px, 100%)",
          margin: "0 auto",
          padding: 28,
          borderRadius: 20,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            marginBottom: 20,
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          ← リビングへ戻る
        </button>

        <h1
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: 32,
          }}
        >
          モフ手帳
        </h1>

        <div
  style={{
    marginTop: 24,
  }}
>
  <h2
    style={{
      margin: "0 0 16px",
      textAlign: "center",
      fontSize: 24,
    }}
  >
    今月のまとめ
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12,
    }}
  >
   <button
  type="button"
  onClick={() => setPage("work")}
  style={{
    padding: "18px 10px",
    borderRadius: 16,
    border: "1px solid #d8e2dc",
    background: "#f7faf8",
    cursor: "pointer",
    fontWeight: 700,
  }}
>
  💼 仕事
</button>

    <button
      type="button"
      onClick={() => setPage("health")}
      style={{
        padding: "18px 10px",
        borderRadius: 16,
        border: "1px solid #d8e2dc",
        background: "#f7faf8",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      🌿 健康
    </button>

    <button
      type="button"
      onClick={() => setPage("life")}
      style={{
        padding: "18px 10px",
        borderRadius: 16,
        border: "1px solid #d8e2dc",
        background: "#f7faf8",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      🏠 生活
    </button>
  </div>
</div>
      </div>
    </main>
  );
}