"use client";

import { useState, type CSSProperties } from "react";

type Props = {
  onBack: () => void;
  onSelectTraining: (trainingId: string) => void;
};

type TrainingMenu = {
  id: string;
  name: string;
  target: string;
  description: string;
  image: string;
};
type TrainingDetail = TrainingMenu & {
  steps: string[];
  point: string;
};

const trainingMenus: TrainingDetail[] = [
  {
  id: "squat",
  name: "スクワット",
  target: "脚・お尻",
  description: "下半身を中心に鍛える基本メニュー。",
  image: "/mofu-training-squat.png",
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
  steps: [
    "まっすぐ立った状態から片脚を前へ踏み出す",
    "前後の膝を曲げながら腰を真下へ落とす",
    "前脚の膝がつま先と同じ方向を向くようにする",
    "前脚で床を押して元の姿勢へ戻る",
  ],
  point: "前に突っ込むんじゃなくて真下に沈めよ🐾",
},
];

export default function TrainingPage({
  onBack,
  onSelectTraining,
}: Props) {
    const [selectedTraining, setSelectedTraining] =
  useState<TrainingDetail | null>(null);
    if (selectedTraining) {
    return (
      <section style={pageStyle}>
        <button
          type="button"
          onClick={() => setSelectedTraining(null)}
          style={backButtonStyle}
        >
          ← メニューへ戻る
        </button>

        <div style={detailHeaderStyle}>
          <img
            src={selectedTraining.image}
            alt={`${selectedTraining.name}モフ`}
            draggable={false}
            style={detailImageStyle}
          />

          <h2 style={detailTitleStyle}>
            {selectedTraining.name}
          </h2>

          <span style={targetStyle}>
            {selectedTraining.target}
          </span>
        </div>

        <div style={detailBoxStyle}>
          <h3 style={detailHeadingStyle}>
            やり方
          </h3>

          <ol style={stepsStyle}>
            {selectedTraining.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div style={pointBoxStyle}>
          <strong>モフのポイント🐾</strong>

          <div style={pointTextStyle}>
            {selectedTraining.point}
          </div>
        </div>

        <button
          type="button"
          style={recordButtonStyle}
          onClick={() =>
            onSelectTraining(selectedTraining.id)
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

        <h2 style={titleStyle}>筋トレメニュー</h2>
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
            今日はどこ鍛えるんだ？
          </strong>

          <div style={mofuTextStyle}>
            無理せず続けろよ🐾
          </div>
        </div>
      </div>

      <div style={gridStyle}>
        {trainingMenus.map((training) => (
          <button
            key={training.id}
            type="button"
            style={cardStyle}
            onClick={() => setSelectedTraining(training)}
          >
<img
  src={training.image}
  alt={`${training.name}モフ`}
  draggable={false}
  style={trainingImageStyle}
/>

            <strong style={nameStyle}>
              {training.name}
            </strong>

            <span style={targetStyle}>
              {training.target}
            </span>

            <span style={descriptionStyle}>
              {training.description}
            </span>

            <span style={openTextStyle}>
              メニューを見る →
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

const pageStyle: CSSProperties = {
  width: "100%",
  maxWidth: 720,
  margin: "0 auto",
  padding: "20px 16px 40px",
  boxSizing: "border-box",
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

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
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