type Props = {
  todayTotal: number;
  recommendedKcal: number;
  automaticRecommendedKcal: number;
  customRecommendedKcal: number | null;
  onRecommendedKcalChange: (value: number | null) => void;
  onClick: () => void;
};

export default function FoodSummaryRing({
  todayTotal,
  recommendedKcal,
  automaticRecommendedKcal,
  customRecommendedKcal,
  onRecommendedKcalChange,
  onClick,
}: Props) {
  const progress = Math.min(todayTotal / recommendedKcal, 1);

  const radius = 54;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const remaining = recommendedKcal - todayTotal;

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        marginTop: 20,
        marginBottom: 24,
      }}
    >
      <svg width={140} height={140}>
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#dce7df"
          strokeWidth={stroke}
          fill="none"
        />

        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#4f7c5b"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
        />

        <text
          x="70"
          y="64"
          textAnchor="middle"
          fontSize="14"
          fill="#78817c"
        >
          今日
        </text>

        <text
          x="70"
          y="88"
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill="#35453b"
        >
          {Math.round(todayTotal)}
        </text>

        <text
          x="70"
          y="108"
          textAnchor="middle"
          fontSize="14"
          fill="#78817c"
        >
          kcal
        </text>
      </svg>

      
            <div
        style={{
          marginTop: 8,
          fontWeight: 700,
          color: remaining >= 0 ? "#4f7c5b" : "#a64b4b",
        }}
      >
        {remaining >= 0
          ? `あと ${remaining} kcal`
          : `${Math.abs(remaining)} kcal 超過`}
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();

          const input = window.prompt(
            `目標摂取カロリーを入力してください\n自動計算値：${automaticRecommendedKcal} kcal`,
            String(customRecommendedKcal ?? recommendedKcal)
          );

          if (input === null) {
            return;
          }

          const parsed = Number(input);

          if (!Number.isFinite(parsed) || parsed <= 0) {
            window.alert("1以上の数値を入力してください");
            return;
          }

          onRecommendedKcalChange(Math.round(parsed));
        }}
        style={{
          marginTop: 10,
          padding: "6px 12px",
          borderRadius: 999,
          border: "1px solid #cad8cf",
          background: "#fff",
          color: "#4f7c5b",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        目標を変更
      </button>
      {customRecommendedKcal !== null && (
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();
      onRecommendedKcalChange(null);
    }}
    style={{
      marginTop: 8,
      border: "none",
      background: "transparent",
      color: "#78817c",
      cursor: "pointer",
      textDecoration: "underline",
      fontSize: 13,
    }}
  >
    自動計算に戻す
  </button>
)}
    </div>
  );
}