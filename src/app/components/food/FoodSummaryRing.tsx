type Props = {
  todayTotal: number;
  recommendedKcal: number;
  onClick: () => void;
};

export default function FoodSummaryRing({
  todayTotal,
  recommendedKcal,
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
    </div>
  );
}