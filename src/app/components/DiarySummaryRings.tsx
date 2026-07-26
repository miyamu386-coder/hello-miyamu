type Props = {
  todayTotal: number;
  monthlyTotal: number;
  unit: string;
  onTodayClick: () => void;
};

function formatValue(value: number, unit: string) {
  if (unit === "時間") {
    return value.toFixed(1);
  }

  return Math.round(value).toLocaleString("ja-JP");
}

export default function DiarySummaryRings({
  todayTotal,
  monthlyTotal,
  unit,
  onTodayClick,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 20,
        marginTop: 20,
        marginBottom: 24,
        flexWrap: "wrap",
      }}
    >
      <SummaryRing
  label="本日"
  value={todayTotal}
  unit={unit}
  onClick={onTodayClick}
/>

      <SummaryRing
        label="今月"
        value={monthlyTotal}
        unit={unit}
      />
    </div>
  );
}

type SummaryRingProps = {
  label: string;
  value: number;
  unit: string;
  onClick?: () => void;
};

function SummaryRing({
  label,
  value,
  unit,
  onClick,
}: SummaryRingProps) {
  return (
    <button
  type="button"
  onClick={onClick}
  disabled={!onClick}
  style={{
  width: 120,
  height: 120,
  borderRadius: "50%",
  padding: 8,
  border: "none",
  background: "#dce9e1",
  boxShadow: "0 8px 18px rgba(0,0,0,0.07)",
  cursor: onClick ? "pointer" : "default",
}}
>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#78817c",
            fontSize: 15,
            fontWeight: 700,
            marginBottom: 5,
          }}
        >
          {label}
        </div>

        <div
          style={{
            color: "#333",
            fontSize: 27,
            fontWeight: 900,
            lineHeight: 1.1,
          }}
        >
          {formatValue(value, unit)}
        </div>

        <div
          style={{
            marginTop: 4,
            color: "#666",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {unit}
        </div>
      </div>
    </button>
  );
}