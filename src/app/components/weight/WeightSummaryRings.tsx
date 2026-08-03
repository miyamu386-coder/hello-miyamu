type Props = {
  todayWeight: number | null;
  previousWeight: number | null;
  monthlyAverageWeight: number | null;
  onTodayClick: () => void;
};

function formatWeight(value: number | null): string {
  if (value === null) {
    return "—";
  }

  return value.toFixed(1);
}

function formatDifference(
  todayWeight: number | null,
  previousWeight: number | null
): string {
  if (todayWeight === null || previousWeight === null) {
    return "—";
  }

  const difference = todayWeight - previousWeight;
  const sign = difference > 0 ? "+" : "";

  return `${sign}${difference.toFixed(1)}`;
}

export default function WeightSummaryRings({
  todayWeight,
  previousWeight,
  monthlyAverageWeight,
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
      <WeightRing
        label="今日"
        value={formatWeight(todayWeight)}
        unit="kg"
        onClick={onTodayClick}
      />

     <WeightRing
       label="前回比"
        value={formatDifference(todayWeight, previousWeight)}
        unit="kg"
      />
      <WeightRing
  label="月平均"
  value={formatWeight(monthlyAverageWeight)}
  unit="kg"
/>
    </div>
  );
}

type WeightRingProps = {
  label: string;
  value: string;
  unit: string;
  onClick?: () => void;
};

function WeightRing({
  label,
  value,
  unit,
  onClick,
}: WeightRingProps) {
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
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 5,
          }}
        >
          {label}
        </div>

        <div
          style={{
            color: "#333",
            fontSize: 24,
            fontWeight: 900,
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>

        <div
          style={{
            marginTop: 4,
            color: "#666",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {unit}
        </div>
      </div>
    </button>
  );
}