"use client";

import {
  useRef,
  useState,
  type CSSProperties,
} from "react";

type Props = {
  onBack: () => void;
  onSelectExercise: (exerciseId: string) => void;
};

type ExerciseMenu = {
  id: string;
  name: string;
  target: string;
  description: string;
  image: string;
  recommended: string;
};

type ExerciseDetail = ExerciseMenu & {
  steps: string[];
  point: string;
};

const trainingMenus: ExerciseDetail[] = [
  {
    id: "squat",
    name: "スクワット",
    target: "脚・お尻",
    description: "下半身を中心に鍛える基本メニュー。",
    image: "/mofu-training-squat.png",
    recommended: "10〜15回 × 2〜3セット",
    steps: [
      "足を肩幅くらいに開く",
      "背中を丸めずに腰をゆっくり落とす",
      "太ももが床と平行になるくらいまでしゃがむ",
      "かかとで床を押すように元の姿勢へ戻る",
    ],
    point: "膝とつま先は同じ方向を意識しろよ🐾",
  },
  {
    id: "push-up",
    name: "腕立て伏せ",
    target: "胸・腕",
    description: "胸や腕を中心に鍛える基本メニュー。",
    image: "/mofu-training-pushup.png",
    recommended: "8〜12回 × 2〜3セット",
    steps: [
      "手を肩幅より少し広めについて体を一直線にする",
      "肘を曲げながら胸をゆっくり床へ近づける",
      "腰が落ちたり上がったりしないように姿勢を保つ",
      "床を押して元の姿勢へ戻る",
    ],
    point: "頭からかかとまで一直線を意識しろよ🐾",
  },
  {
    id: "crunch",
    name: "腹筋",
    target: "お腹",
    description: "腹部を中心に鍛えるメニュー。",
    image: "/mofu-training-crunch.png",
    recommended: "10〜15回 × 2〜3セット",
    steps: [
      "仰向けになって膝を曲げる",
      "手は頭の後ろか胸の前に置く",
      "お腹を縮めるように上半身をゆっくり起こす",
      "反動を使わずゆっくり元へ戻る",
    ],
    point: "首で起き上がるんじゃなくて腹で丸まれよ🐾",
  },
  {
    id: "plank",
    name: "プランク",
    target: "体幹",
    description: "姿勢を維持しながら体幹を鍛えるメニュー。",
    image: "/mofu-training-plank.png",
    recommended: "20〜30秒 × 2〜3セット",
    steps: [
      "肘を肩の真下について前腕を床につける",
      "つま先を立てて体を持ち上げる",
      "頭からかかとまで一直線を意識する",
      "お腹に力を入れたまま姿勢を維持する",
    ],
    point: "腰を上げすぎても落としすぎてもダメだぞ🐾",
  },
  {
    id: "lunge",
    name: "ランジ",
    target: "脚・お尻",
    description: "左右の脚を使って下半身を鍛えるメニュー。",
    image: "/mofu-training-lunge.png",
    recommended: "左右8〜12回 × 2〜3セット",
    steps: [
      "まっすぐ立った状態から片脚を前へ踏み出す",
      "前後の膝を曲げながら腰を真下へ落とす",
      "前脚の膝がつま先と同じ方向を向くようにする",
      "前脚で床を押して元の姿勢へ戻る",
    ],
    point: "前に突っ込むんじゃなくて真下に沈めよ🐾",
  },
];

const stretchMenus: ExerciseDetail[] = [
  {
    id: "stretch-neck",
    name: "首・肩",
    target: "首・肩",
    description: "首から肩まわりをゆっくり伸ばすストレッチ。",
    image: "/mofu-stretch-neck.png",
    recommended: "左右20〜30秒",
    steps: [
      "背筋を伸ばして座るか立つ",
      "片手を頭の横に軽く添える",
      "頭をゆっくり横へ倒す",
      "首の横が伸びた位置で姿勢を保つ",
    ],
    point: "力ずくで引っ張るなよ。重さを乗せるくらいで十分だ🐾",
  },
  {
    id: "stretch-chest",
    name: "胸・肩",
    target: "胸・肩",
    description: "胸を開いて肩まわりを伸ばすストレッチ。",
    image: "/mofu-stretch-chest.png",
    recommended: "20〜30秒 × 2回",
    steps: [
      "背筋を伸ばして立つ",
      "両手を体の後ろで組む",
      "肩甲骨を寄せるように胸を開く",
      "無理のない位置で姿勢を保つ",
    ],
    point: "腰を反らすんじゃなくて胸を開けよ🐾",
  },
  {
    id: "stretch-back",
    name: "背中",
    target: "背中",
    description: "背中全体をゆっくり伸ばすストレッチ。",
    image: "/mofu-stretch-back.png",
    recommended: "20〜30秒 × 2回",
    steps: [
      "両手を体の前で組む",
      "手のひらを前へ押し出す",
      "背中を軽く丸める",
      "肩甲骨の間が伸びる位置で姿勢を保つ",
    ],
    point: "肩に力を入れすぎず、背中を広げる感じだぞ🐾",
  },
  {
    id: "stretch-hip",
    name: "股関節",
    target: "股関節・お尻",
    description: "股関節まわりをほぐして動かしやすくする。",
    image: "/mofu-stretch-hip.png",
    recommended: "左右20〜30秒",
    steps: [
      "床に座って片脚を前に曲げる",
      "反対側の脚を後ろへ伸ばす",
      "背筋を伸ばしたまま上体を前へ倒す",
      "お尻から股関節が伸びる位置で保つ",
    ],
    point: "痛いところまで攻めなくていい。気持ちいい範囲で止めろよ🐾",
  },
  {
    id: "stretch-hamstring",
    name: "もも裏",
    target: "太もも裏",
    description: "太ももの裏側をゆっくり伸ばすストレッチ。",
    image: "/mofu-stretch-hamstring.png",
    recommended: "左右20〜30秒",
    steps: [
      "片脚を前へ伸ばす",
      "反対側の膝を軽く曲げる",
      "背筋を伸ばしたまま股関節から前へ倒れる",
      "太ももの裏が伸びる位置で姿勢を保つ",
    ],
    point: "背中を丸めて無理やり届かせなくていいぞ🐾",
  },
  {
  id: "stretch-calf",
  name: "ふくらはぎ",
  target: "ふくらはぎ",
  description: "ふくらはぎから足首まわりを伸ばす。",
  image: "/mofu-stretch-calf.png",
  recommended: "左右20〜30秒",
  steps: [
    "壁に両手をつき、片脚を後ろへ引く",
    "後ろ脚の膝を伸ばし、かかとを床につける",
    "つま先をまっすぐ前に向ける",
    "前脚の膝をゆっくり曲げる",
    "ふくらはぎの伸びを感じた位置で20〜30秒保つ",
    "反対側も同じように行う",
  ],
  point: "後ろ脚のかかとを浮かせず、つま先をまっすぐ向けろよ🐾",
},
];

export default function TrainingPage({
  onBack,
  onSelectExercise,
}: Props) {
const scrollRef = useRef<HTMLDivElement>(null);

const dragStartXRef = useRef(0);
const dragStartScrollLeftRef = useRef(0);
const isDraggingRef = useRef(false);
const didDragRef = useRef(false);

const [selectedExercise, setSelectedExercise] =
  useState<ExerciseDetail | null>(null);

const [currentPage, setCurrentPage] =
  useState(0);

const handleScroll = () => {
  const container = scrollRef.current;

  if (!container) {
    return;
  }

  const pageWidth = container.clientWidth;

  if (pageWidth === 0) {
    return;
  }

  const nextPage = Math.round(
    container.scrollLeft / pageWidth
  );

  setCurrentPage(
    Math.max(0, Math.min(1, nextPage))
  );
};

const handlePointerDown = (
  event: React.PointerEvent<HTMLDivElement>
) => {
  const container = scrollRef.current;

  if (!container) {
    return;
  }

  isDraggingRef.current = true;
  didDragRef.current = false;

  dragStartXRef.current = event.clientX;
  dragStartScrollLeftRef.current =
    container.scrollLeft;

  container.setPointerCapture(
    event.pointerId
  );
};

const handlePointerMove = (
  event: React.PointerEvent<HTMLDivElement>
) => {
  const container = scrollRef.current;

  if (
    !container ||
    !isDraggingRef.current
  ) {
    return;
  }

  const distance =
    event.clientX -
    dragStartXRef.current;

  if (Math.abs(distance) > 6) {
    didDragRef.current = true;
  }

  container.scrollLeft =
    dragStartScrollLeftRef.current -
    distance;
};

const handlePointerUp = (
  event: React.PointerEvent<HTMLDivElement>
) => {
  const container = scrollRef.current;

  if (!container) {
    return;
  }

  isDraggingRef.current = false;

  if (
    container.hasPointerCapture(
      event.pointerId
    )
  ) {
    container.releasePointerCapture(
      event.pointerId
    );
  }

  const pageWidth = container.clientWidth;

  if (pageWidth === 0) {
    return;
  }

  const nextPage = Math.round(
    container.scrollLeft / pageWidth
  );

  const safePage = Math.max(
    0,
    Math.min(1, nextPage)
  );

  container.scrollTo({
    left: safePage * pageWidth,
    behavior: "smooth",
  });

  setCurrentPage(safePage);
};

  if (selectedExercise) {
    return (
      <section style={pageStyle}>
        <button
          type="button"
          onClick={() => setSelectedExercise(null)}
          style={backButtonStyle}
        >
          ← メニューへ戻る
        </button>

        <div style={detailHeaderStyle}>
          <img
            src={selectedExercise.image}
            alt={`${selectedExercise.name}モフ`}
            draggable={false}
            style={detailImageStyle}
          />

          <h2 style={detailTitleStyle}>
            {selectedExercise.name}
          </h2>

          <span style={targetStyle}>
            {selectedExercise.target}
          </span>

          <div style={detailRecommendedStyle}>
            推奨：{selectedExercise.recommended}
          </div>
        </div>

        <div style={detailBoxStyle}>
          <h3 style={detailHeadingStyle}>
            やり方
          </h3>

          <ol style={stepsStyle}>
            {selectedExercise.steps.map(
              (step) => (
                <li key={step}>
                  {step}
                </li>
              )
            )}
          </ol>
        </div>

        <div style={pointBoxStyle}>
          <strong>
            モフのポイント🐾
          </strong>

          <div style={pointTextStyle}>
            {selectedExercise.point}
          </div>
        </div>

        <button
          type="button"
          style={recordButtonStyle}
          onClick={() =>
            onSelectExercise(
              selectedExercise.id
            )
          }
        >
          記録する
        </button>
      </section>
    );
  }

  return (
    <section style={pageStyle}>
      <div style={headerStyle}>
        <button
          type="button"
          onClick={onBack}
          style={backButtonStyle}
        >
          ← 部屋へ戻る
        </button>

        <h2 style={titleStyle}>
          {currentPage === 0
            ? "筋トレメニュー"
            : "ストレッチ"}
        </h2>
      </div>

      <div style={mofuBoxStyle}>
        <img
          src="/mofu-training.png"
          alt="トレーニングモフ"
          draggable={false}
          style={trainingMofuStyle}
        />

        <div>
          <strong style={mofuTitleStyle}>
            {currentPage === 0
              ? "今日はどこ鍛えるんだ？"
              : "今日はどこ伸ばすんだ？"}
          </strong>

          <div style={mofuTextStyle}>
            {currentPage === 0
              ? "無理せず続けろよ🐾"
              : "痛いところまで伸ばすなよ🐾"}
          </div>
        </div>
      </div>

      
        <div
  ref={scrollRef}
  onScroll={handleScroll}
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
  onPointerCancel={handlePointerUp}
  style={swiperStyle}
>
        <div style={slideStyle}>
          <div style={gridStyle}>
            {trainingMenus.map(
              (exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                 onClick={() => {
  if (didDragRef.current) {
    didDragRef.current = false;
    return;
  }

  setSelectedExercise(exercise);
}}
                />
              )
            )}
          </div>
        </div>

        <div style={slideStyle}>
          <div style={gridStyle}>
            {stretchMenus.map(
              (exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                 onClick={() => {
  if (didDragRef.current) {
    didDragRef.current = false;
    return;
  }

  setSelectedExercise(exercise);
}}
                />
              )
            )}
          </div>
        </div>
      </div>

      <div style={indicatorStyle}>
        {[0, 1].map((index) => (
          <span
            key={index}
            style={{
              width:
                currentPage === index
                  ? 22
                  : 8,
              height: 8,
              borderRadius: 999,
              background:
                currentPage === index
                  ? "#4f7c5b"
                  : "#c8c8c8",
              transition:
                "width 0.2s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}

function ExerciseCard({
  exercise,
  onClick,
}: {
  exercise: ExerciseDetail;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      style={cardStyle}
      onClick={onClick}
    >
      <img
        src={exercise.image}
        alt={`${exercise.name}モフ`}
        draggable={false}
        style={trainingImageStyle}
      />

      <strong style={nameStyle}>
        {exercise.name}
      </strong>

      <span style={targetStyle}>
        {exercise.target}
      </span>

      <span style={descriptionStyle}>
        {exercise.description}
      </span>

      <span style={recommendedStyle}>
        推奨：{exercise.recommended}
      </span>

      <span style={openTextStyle}>
        メニューを見る →
      </span>
    </button>
  );
}

const pageStyle: CSSProperties = {
  width: "100%",
  maxWidth: 720,
  margin: "0 auto",
  padding: "20px 16px 40px",
  boxSizing: "border-box",
  overflow: "hidden",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  marginBottom: 20,
};

const backButtonStyle: CSSProperties = {
  padding: "9px 12px",
  border: "none",
  borderRadius: 12,
  background: "#eeeeee",
  cursor: "pointer",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
};

const mofuBoxStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 22,
  padding: 16,
  borderRadius: 18,
  background: "#f6f3ed",
};

const trainingMofuStyle: CSSProperties = {
  width: 90,
  height: 90,
  objectFit: "contain",
  objectPosition: "center",
  borderRadius: 18,
  flexShrink: 0,
};

const mofuTitleStyle: CSSProperties = {
  display: "block",
  marginBottom: 4,
  fontSize: 16,
};

const mofuTextStyle: CSSProperties = {
  fontSize: 13,
  color: "#666",
};

const swiperStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  maxWidth: "100%",
  overflowX: "auto",
  overflowY: "hidden",
  scrollSnapType: "x mandatory",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "none",
  overscrollBehaviorX: "contain",
  touchAction: "pan-x pan-y",
  cursor: "grab",
  userSelect: "none",
};

const slideStyle: CSSProperties = {
  flex: "0 0 100%",
  width: "100%",
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
  boxSizing: "border-box",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const cardStyle: CSSProperties = {
  minHeight: 205,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  border: "1px solid #dddddd",
  borderRadius: 18,
  background: "#ffffff",
  cursor: "pointer",
  textAlign: "center",
  boxShadow:
    "0 4px 12px rgba(0,0,0,0.05)",
};

const trainingImageStyle: CSSProperties = {
  width: "100%",
  height: 120,
  objectFit: "contain",
  objectPosition: "center",
  marginBottom: 4,
  userSelect: "none",
  pointerEvents: "none",
};

const nameStyle: CSSProperties = {
  fontSize: 17,
};

const targetStyle: CSSProperties = {
  padding: "4px 8px",
  borderRadius: 999,
  background: "#edf4ef",
  color: "#4f7c5b",
  fontSize: 12,
  fontWeight: 700,
};

const descriptionStyle: CSSProperties = {
  minHeight: 36,
  fontSize: 12,
  lineHeight: 1.5,
  color: "#666666",
};

const openTextStyle: CSSProperties = {
  marginTop: 5,
  fontSize: 12,
  fontWeight: 700,
  color: "#4f7c5b",
};

const indicatorStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 8,
  marginTop: 16,
};

const detailHeaderStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
  marginTop: 22,
  marginBottom: 22,
};

const detailImageStyle: CSSProperties = {
  width: "100%",
  maxWidth: 300,
  height: 260,
  objectFit: "contain",
  userSelect: "none",
};

const detailTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 26,
};

const detailBoxStyle: CSSProperties = {
  padding: 18,
  marginBottom: 16,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #dddddd",
};

const detailHeadingStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: 18,
};

const stepsStyle: CSSProperties = {
  margin: 0,
  paddingLeft: 22,
  lineHeight: 1.8,
  color: "#444",
};

const pointBoxStyle: CSSProperties = {
  padding: 16,
  marginBottom: 20,
  borderRadius: 18,
  background: "#f6f3ed",
};

const pointTextStyle: CSSProperties = {
  marginTop: 6,
  fontSize: 14,
  color: "#555",
};

const recordButtonStyle: CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  border: "none",
  borderRadius: 999,
  background: "#4f7c5b",
  color: "#ffffff",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};

const recommendedStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: 10,
  background: "#f6f3ed",
  color: "#555",
  fontSize: 12,
  fontWeight: 700,
};

const detailRecommendedStyle: CSSProperties = {
  padding: "8px 14px",
  borderRadius: 12,
  background: "#f6f3ed",
  color: "#555",
  fontSize: 14,
  fontWeight: 700,
};