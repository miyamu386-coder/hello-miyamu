"use client";

import {
  useEffect,
  useState,
} from "react";

type ConditioningAction =
  | "idle"
  | "training"
  | "stretch";

type Props = {
  onClick?: () => void;
  onOpenTraining: () => void;
  onOpenWeight: () => void;
};

const mofuCrunchFrames = [
  "/mofu-crunch-1.png",
  "/mofu-crunch-2.png",
  "/mofu-crunch-3.png",
];
const conditioningMessages = [
  "ちゃんと自分の体もメンテしてるか？🐾",
  "鍛えるのもいいが、休ませるのも忘れるなよ🐾",
  "体重計から逃げても数字は変わらんぞ🐾",
  "今日の調子くらい、自分で把握しとけよ🐾",
];
export default function ConditioningMofu({
  onClick,
  onOpenTraining,
  onOpenWeight,
}: Props) {
  const [
    action,
    setAction,
  ] = useState<ConditioningAction>("idle");

  const [
    crunchFrameIndex,
    setCrunchFrameIndex,
  ] = useState(0);

  useEffect(() => {
    if (action !== "training") {
      return;
    }

    const crunchSequence = [0, 1, 2, 1];

    let sequenceIndex = 0;

    const timer = window.setInterval(() => {
      sequenceIndex =
        (sequenceIndex + 1) %
        crunchSequence.length;

      setCrunchFrameIndex(
        crunchSequence[sequenceIndex]
      );
    }, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, [action]);

  const isTraining =
    action === "training";

  const handleClick = () => {
  setAction((current) =>
    current === "training"
      ? "idle"
      : "training"
  );

  onClick?.();
};
const conditioningMessage =
  conditioningMessages[
    Math.floor(
      Math.random() *
        conditioningMessages.length
    )
  ];

  return (
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 5,
      pointerEvents: "none",
    }}
  >
  <button
  type="button"
  aria-label="筋トレメニューを開く"
  onClick={onOpenTraining}
  style={{
    position: "absolute",
    left: "36%",
    top: "56%",
    width: "30%",
    height: "20%",
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    zIndex: 4,
    pointerEvents: "auto",
  }}
/>
    <img
      src="/room/mohu-ConditioningRoom.png"
      alt="コンディショニングルーム"
      draggable={false}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "contain",
        display: "block",
        userSelect: "none",
        pointerEvents: "none",
      }}
    />
  <button
  type="button"
  aria-label="体重表を開く"
  onClick={onOpenWeight}
  style={{
    position: "absolute",
    left: "43%",
    top: "31%",
    width: "14%",
    height: "9%",
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    zIndex: 4,
    pointerEvents: "auto",
  }}
/>
           <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "4%",
          width: isTraining ? 190 : 95,
          height: isTraining ? 120 : 135,
          transform: isTraining
            ? "translateX(calc(-50% + 12px)) translateY(-165px) rotate(-25deg)"
            : "translateX(-50%)",
          pointerEvents: "auto",
        }}
      >
        <img
          src={
            isTraining
              ? mofuCrunchFrames[
                  crunchFrameIndex
                ]
              : "/mofu-conditioning-idle.png"
          }
          alt="コンディショニングモフ"
          draggable={false}
          onClick={handleClick}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            userSelect: "none",
            cursor: "pointer",
          }}
        />
            </div>
    </div>
  );
}