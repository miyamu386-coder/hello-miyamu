import { monthLabel } from "../lib/dateUtils";

type Props = {
  ym: string;
  total: number;
};

export default function DiaryHeader({ ym, total }: Props) {
  return (
    <>
      <h1
        style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 900,
          textAlign: "center",
        }}
      >
        みやむログ
      </h1>

      <div
        style={{
          marginTop: 8,
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
          {total.toFixed(1)}時間
        </div>
      </div>
    </>
  );
}