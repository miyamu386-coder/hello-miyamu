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

export default function ConditioningRoom({
  onClick,
  onOpenTraining,
  onOpenWeight,
}: Props) {
  const [
    action,
    setAction,
  ] = useState<ConditioningAction>(
    "idle"
  );

  const [
    crunchFrameIndex,
    setCrunchFrameIndex,
  ] = useState(0);

  useEffect(() => {
    if (action !== "training") {
      return;
    }

    const crunchSequence = [
      0,
      1,
      2,
      1,
    ];

    let sequenceIndex = 0;

    const timer =
      window.setInterval(() => {
        sequenceIndex =
          (sequenceIndex + 1) %
          crunchSequence.length;

        setCrunchFrameIndex(
          crunchSequence[
          sequenceIndex
          ]
        );
      }, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, [action]);
  useEffect(() => {
    const updateStretchAction = () => {
      const now = new Date();
      const hour = now.getHours();

      const isStretchTime =
        hour === 7 ||
        hour === 12 ||
        hour === 20;

      setAction((current) => {
        if (current === "training") {
          return current;
        }

        return isStretchTime
          ? "stretch"
          : "idle";
      });
    };

    updateStretchAction();

    const timer =
      window.setInterval(
        updateStretchAction,
        60 * 1000
      );

    return () => {
      window.clearInterval(timer);
    };
  }, []);
  const isTraining =
    action === "training";


  const isStretching =
    action === "stretch";

  const currentHour =
    new Date().getHours();

  const stretchImage =
    currentHour === 7
      ? "/mofu-conditioning-stretch-morning.png"
      : currentHour === 12
        ? "/mofu-conditioning-stretch-noon.png"
        : "/mofu-conditioning-stretch-night.png";

  const handleClick = () => {
    setAction((current) => {
      if (current === "stretch") {
        return current;
      }

      return current === "training"
        ? "idle"
        : "training";
    });

    onClick?.();
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        pointerEvents: "none",
      }}
    >
      <img
        src={
          isStretching
            ? "/room/mohu-ConditioningRoom-stretch.png"
            : "/room/mohu-ConditioningRoom.png"
        }
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
          width: isTraining
            ? 190
            : isStretching
              ? 175
              : 95,

          height: isTraining
            ? 120
            : isStretching
              ? 145
              : 135,

          transform: isTraining
            ? "translateX(calc(-50% + 12px)) translateY(-165px) rotate(-25deg)"
            : isStretching
              ? "translateX(-50%) translateY(-50px)"
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
              : isStretching
                ? stretchImage
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