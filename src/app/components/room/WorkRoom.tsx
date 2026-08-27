"use client";

import {
  useEffect,
  useRef,
} from "react";

type MofuAction =
  | "idle"
  | "living"
  | "living-walk"
  | "work-walk"
  | "work-pc"
  | "work-book";

type MofuRoomState = {
  tapCount: number;
  isJumping: boolean;
  action: MofuAction;
  x: number;
  y: number;
};

type Props = {
  onOpenWork: () => void;
  onOpenMofuFun: () => void;
  showMofuFun: boolean;

  state: MofuRoomState;
  showMessage: boolean;
  message: string;
  isShortMessage: boolean;
  walkFrame: string;
  onMofuClick: () => void;

  onStateChange: (
    updater: (
      current: MofuRoomState
    ) => MofuRoomState
  ) => void;
};

export default function WorkRoom({
  onOpenWork,
  onOpenMofuFun,
  showMofuFun,
  state,
  showMessage,
  message,
  isShortMessage,
  walkFrame,
  onMofuClick,
  onStateChange,
}: Props) {
   const workMofuNpcTimerRef =
  useRef<number | null>(null);

const WORK_PC_POSITION = {
  x: -80,
  y: -220,
};

useEffect(() => {
  const scheduleNextMove = () => {
    const waitTime =
      3000 + Math.random() * 4000;

    workMofuNpcTimerRef.current =
      window.setTimeout(() => {
        onStateChange((current) => ({
          ...current,
          action: "work-walk",
          x: WORK_PC_POSITION.x,
          y: WORK_PC_POSITION.y,
        }));

        workMofuNpcTimerRef.current =
          window.setTimeout(() => {
            onStateChange((current) => ({
              ...current,
              action: "work-pc",
            }));
          }, 1800);
      }, waitTime);
  };

  scheduleNextMove();

  return () => {
    if (
      workMofuNpcTimerRef.current !== null
    ) {
      window.clearTimeout(
        workMofuNpcTimerRef.current
      );
    }
  };
}, [onStateChange]); 
  return (
    <>
      <img
        src="/room/mofu-workroom.png"
        alt="仕事部屋"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
          userSelect: "none",
          cursor: "pointer",
          background: "#2b1c12",
        }}
      />
      <button
        type="button"
        aria-label="パソコンを開く"
        onClick={onOpenWork}
        style={{
          position: "absolute",
          left: "4%",
          top: "35%",
          width: "33%",
          height: "27%",
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          zIndex: 4,
        }}
      />
      <button
  type="button"
  aria-label="モフのお楽しみコーナー"
  onClick={onOpenMofuFun}
  style={{
    position: "absolute",
    left: "43%",
    top: "29%",
    width: "5%",
    height: "5%",
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    zIndex: 4,
  }}
/>
{showMofuFun && (
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.25)",
      padding: 24,
    }}
  >
    <div
      style={{
        width: "min(320px, 88%)",
        padding: "24px 20px",
        borderRadius: 20,
        background: "white",
        textAlign: "center",
        color: "#333",
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        🐾 モフのお楽しみコーナー
      </div>

      <div
        style={{
          fontSize: 15,
          lineHeight: 1.8,
        }}
      >
        モフの暇つぶしコンテンツを
        <br />
        順次公開予定！
        <br />
        お楽しみに🐾
      </div>
    </div>
  </div>
)}
<div
  style={{
    position: "absolute",
    left: "50%",
    bottom: "4%",
    transform: `
      translateX(calc(-50% + ${state.x}px))
      translateY(${state.y}px)
    `,
    transition:
      state.action === "work-walk"
        ? "transform 1.8s linear"
        : "transform 0.6s ease",
    zIndex: 5,
    pointerEvents: "auto",
  }}
>
  {showMessage && (
    <div
      style={{
        position: "absolute",
        bottom: "105%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "max-content",
        minWidth: 90,
        maxWidth: "min(210px, 80vw)",
        padding: "8px 12px",
        borderRadius: 12,
        background: "white",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.15)",
        fontSize: 12,
        lineHeight: 1.5,
        textAlign: "center",
        color: "#333",
        whiteSpace:
          isShortMessage
            ? "nowrap"
            : "normal",
        overflowWrap: "break-word",
        boxSizing: "border-box",
        pointerEvents: "none",
      }}
    >
      {message}
    </div>
  )}

  <div
    style={{
      width: "100%",
      height: "100%",
      transform:
        state.action === "work-walk" &&
        state.x > 0
          ? "scaleX(-1)"
          : "scaleX(1)",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        animation:
          "mofuFloat 3s ease-in-out infinite",
        scale:
          state.action === "work-walk"
            ? "1.35"
            : "1",
      }}
    >
      <img
        src={
          state.action === "work-walk"
            ? walkFrame
            : state.action === "work-pc"
              ? "/mofu-work-pc.png"
              : "/mofu-normal.png"
        }
        alt="モフ"
        draggable={false}
        onClick={onMofuClick}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
          userSelect: "none",
          cursor: "pointer",
          animation:
            state.isJumping
              ? "mofuJump 0.6s ease"
              : state.action === "work-walk"
                ? "mofuWalk 0.35s linear infinite"
                : "none",
        }}
      />
    </div>
  </div>
</div>
    </>
  );
}