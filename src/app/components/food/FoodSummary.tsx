type Props = {
  todayTotal: number;
};

export default function FoodSummary({
  todayTotal,
}: Props) {
  const recommendedKcal = 2300;
  const remainingKcal = recommendedKcal - todayTotal;

  return (
    <section
      style={{
        marginTop: 20,
        marginBottom: 24,
        padding: 20,
        borderRadius: 20,
        border: "1px solid #e2ebe5",
        background: "#f7faf8",
        textAlign: "center",
      }}
    >
      <div
        style={{
          marginBottom: 8,
          color: "#78817c",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        本日の摂取カロリー
      </div>

      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "#35453b",
        }}
      >
        {Math.round(todayTotal).toLocaleString("ja-JP")} kcal
      </div>

      <div
        style={{
          marginTop: 14,
          color: "#56605a",
          fontSize: 15,
        }}
      >
        推奨摂取カロリー：
        {recommendedKcal.toLocaleString("ja-JP")} kcal
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: 17,
          fontWeight: 700,
          color: remainingKcal >= 0
            ? "#4f7c5b"
            : "#a64b4b",
        }}
      >
        {remainingKcal >= 0
          ? `あと ${remainingKcal.toLocaleString("ja-JP")} kcal`
          : `${Math.abs(remainingKcal).toLocaleString("ja-JP")} kcal 超過`}
      </div>
    </section>
  );
}