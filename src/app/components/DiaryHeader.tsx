import { monthLabel } from "../lib/dateUtils";

type Props = {
  title: string;
  unit: string;
  ym: string;
  total: number;
};

export default function DiaryHeader({
  title,
  unit,
  ym,
  total,
}: Props) {
  return (
    <>

      <div
  style={{
    textAlign: "center",
    fontSize: 26,
    fontWeight: 900,
  }}
>
  {title}
</div>

<div
  style={{
    marginTop: 4,
    textAlign: "center",
    color: "#555",
    fontWeight: 700,
  }}
>
  {monthLabel(ym)}
</div>

      <div
        style={{
          marginTop: 18,
          padding: 18,
          borderRadius: 14,
          background: "#f5f6f7",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 14, color: "#666", fontWeight: 700 }}>
          今月の合計
        </div>

        <div style={{ marginTop: 4, fontSize: 34, fontWeight: 900 }}>
          {total.toFixed(1)}
          {unit}
        </div>
      </div>
    </>
  );
}