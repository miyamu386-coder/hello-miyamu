"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

type MofuAction =
  | "idle"
  | "living"
  | "living-walk"
  | "work-walk"
  | "work-pc"
  | "work-book";

type LivingBehavior =
  | "idle"
  | "walk"
  | "long-idle"
  | "sleep";

type MofuRoomState = {
  tapCount: number;
  isJumping: boolean;
  action: MofuAction;
  x: number;
  y: number;
};

type Props = {
  state: MofuRoomState;
  showMessage: boolean;
  message: string;
  isShortMessage: boolean;
  walkFrame: string;

  onMofuClick: (
  wasSleeping?: boolean
) => void;
  onOpenKitchen: () => void;
  onOpenFridge: () => void;
  onOpenBook: () => void;
  onOpenCalendar: () => void;

  onStateChange: (
    updater: (
      current: MofuRoomState
    ) => MofuRoomState
  ) => void;
};

const livingMovePoints = [
  { x: 0, y: 0 },        // 手前
  { x: -120, y: -180 },  // 本棚前
  { x: 0, y: -260 },     // キッチン前
  { x: 120, y: -230 },   // 冷蔵庫方向
];

export default function LivingRoom({
  state,
  showMessage,
  message,
  isShortMessage,
  walkFrame,
  onMofuClick,
  onOpenKitchen,
  onOpenFridge,
  onOpenBook,
  onOpenCalendar,
  onStateChange,
}: Props) {
  const mofuNpcTimerRef =
    useRef<number | null>(null);

  const mofuMoveIndexRef =
    useRef(0);

  const lapStepRef =
    useRef(0);

  const mofuFacingRef =
    useRef<"left" | "right">("left");

  const [
    livingBehavior,
    setLivingBehavior,
  ] = useState<LivingBehavior>("idle");

  const [
    wakeCount,
    setWakeCount,
  ] = useState(0);

  const isThreatening =
    state.tapCount >= 50;

  const isTapReacting =
    state.tapCount >= 12;

  useEffect(() => {
    const startWalk = () => {
      onStateChange((current) => {
        if (current.tapCount >= 12) {
          return current;
        }

        const nextIndex =
          (mofuMoveIndexRef.current + 1) %
          livingMovePoints.length;

        const nextPoint =
          livingMovePoints[nextIndex];

        if (nextPoint.x > current.x) {
          mofuFacingRef.current = "right";
        } else if (
          nextPoint.x < current.x
        ) {
          mofuFacingRef.current = "left";
        }

        mofuMoveIndexRef.current =
          nextIndex;

        return {
          ...current,
          action: "living-walk",
          x: nextPoint.x,
          y: nextPoint.y,
        };
      });

      setLivingBehavior("walk");

      mofuNpcTimerRef.current =
        window.setTimeout(() => {
          lapStepRef.current += 1;

          // 4地点を一周したら昼寝
          if (
            lapStepRef.current >=
            livingMovePoints.length
          ) {
            setLivingBehavior("sleep");

            onStateChange((current) => ({
              ...current,
              action: "idle",
            }));

            // 昼寝中は次のタイマーを作らない
            return;
          }

          // 一周途中の静止
          const isLongIdle =
            lapStepRef.current === 2;

          setLivingBehavior(
            isLongIdle
              ? "long-idle"
              : "idle"
          );

          onStateChange((current) => ({
            ...current,
            action: "idle",
          }));

          const idleTime =
            isLongIdle
              ? 10000
              : 3000;

          mofuNpcTimerRef.current =
            window.setTimeout(() => {
              startWalk();
            }, idleTime);
        }, 1800);
    };

    // 起床後は少し止まってから散歩開始
    mofuNpcTimerRef.current =
      window.setTimeout(() => {
        startWalk();
      }, 3000);

    return () => {
      if (
        mofuNpcTimerRef.current !== null
      ) {
        window.clearTimeout(
          mofuNpcTimerRef.current
        );
      }
    };
  }, [onStateChange, wakeCount]);

  useEffect(() => {
    if (!isTapReacting) {
      return;
    }

    if (mofuNpcTimerRef.current !== null) {
      window.clearTimeout(
        mofuNpcTimerRef.current
      );

      mofuNpcTimerRef.current = null;
    }

    setLivingBehavior("idle");
  }, [isTapReacting]);

  const handleLivingMofuClick = () => {
  const wasSleeping =
    livingBehavior === "sleep";

  if (wasSleeping) {
      lapStepRef.current = 0;
      mofuMoveIndexRef.current = 0;

      setLivingBehavior("idle");

      onStateChange((current) => ({
        ...current,
        action: "idle",
        x: livingMovePoints[0].x,
        y: livingMovePoints[0].y,
      }));

      setWakeCount(
        (current) => current + 1
      );
    }

    onMofuClick(wasSleeping);
  };

  return (
    <>
      <img
        src="/room/mofu-room.png"
        alt="リビングキッチン"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
          userSelect: "none",
        }}
      />

      <button
        type="button"
        aria-label="キッチンを開く"
        onClick={onOpenKitchen}
        style={{
          position: "absolute",
          left: "32%",
          top: "22%",
          width: "38%",
          height: "40%",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          zIndex: 4,
        }}
      />

      <button
        type="button"
        aria-label="冷蔵庫を開く"
        onClick={onOpenFridge}
        style={{
          position: "absolute",
          right: "0%",
          top: "20%",
          width: "22%",
          height: "43%",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          zIndex: 4,
        }}
      />

      <button
        type="button"
        aria-label="リビングの本を開く"
        onClick={onOpenBook}
        style={{
          position: "absolute",
          left: "61%",
          top: "64%",
          width: "18%",
          height: "10%",
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          zIndex: 10,
        }}
      />

      <button
        type="button"
        aria-label="予定表を開く"
        onClick={onOpenCalendar}
        style={{
          position: "absolute",
          left: "5%",
          top: "13%",
          width: "31%",
          height: "31%",
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          zIndex: 6,
        }}
      />

      {isThreatening && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "rgba(0,0,0,0.15)",
            pointerEvents: "none",
          }}
        >
          <img
            src="/mofu-whiteeye.png"
            alt="威嚇モフ"
            draggable={false}
            style={{
              width: "95%",
              height: "95%",
              objectFit: "contain",
              userSelect: "none",
            }}
          />
        </div>
      )}

      {!isThreatening && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "4%",
            width: 90,
            height: 100,

            marginLeft: state.x,

            transform: `
              translateX(-50%)
              translateY(${state.y}px)
            `,

            transition:
              livingBehavior === "walk"
                ? "margin-left 1.8s linear, transform 1.8s linear"
                : "margin-left 0.6s ease, transform 0.6s ease",

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
                transform:
                  "translateX(-50%)",
                width: "max-content",
                minWidth: 90,
                maxWidth:
                  "min(210px, 80vw)",
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
                overflowWrap:
                  "break-word",
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
                mofuFacingRef.current ===
                  "right"
                  ? "scaleX(-1)"
                  : "scaleX(1)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",

                animation:
                  isTapReacting
                    ? "none"
                    : livingBehavior === "sleep"
                      ? "mofuSleepBreath 3.2s ease-in-out infinite"
                      : "mofuFloat 3s ease-in-out infinite",

                scale:
                  isTapReacting ||
                    livingBehavior === "walk"
                    ? "1.65"
                    : livingBehavior === "sleep"
                      ? "1.3"
                      : "1",

                transformOrigin: "center bottom",
              }}
            >
              <img
                src={
                  state.tapCount >= 30
                    ? "/mofu-sulking.png"
                    : state.tapCount >= 20
                      ? "/mofu-running.png"
                      : state.tapCount >= 12
                        ? walkFrame
                        : livingBehavior ===
                          "walk"
                          ? walkFrame
                          : livingBehavior ===
                            "sleep"
                            ? "/mofu-sleep.png"
                            : "/mofu-normal.png"
                }
                alt="モフ"
                draggable={false}
                onClick={
                  handleLivingMofuClick
                }
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
                      : state.tapCount >= 12 ||
                        livingBehavior ===
                        "walk"
                        ? "mofuWalk 0.35s linear infinite"
                        : "none",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}