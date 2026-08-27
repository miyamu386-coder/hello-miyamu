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
  state: MofuRoomState;
  showMessage: boolean;
  message: string;
  isShortMessage: boolean;
  walkFrame: string;

  onMofuClick: () => void;
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

  const isThreatening =
    state.tapCount >= 50;

      useEffect(() => {
    const scheduleNextMove = () => {
      const waitTime =
        3000 + Math.random() * 4000;

      mofuNpcTimerRef.current =
        window.setTimeout(() => {
          onStateChange((current) => {
            if (current.tapCount >= 12) {
              return current;
            }

            const nextX =
              current.x >= 0
                ? -120
                : 120;

            return {
              ...current,
              action: "living-walk",
              x: nextX,
              y: 0,
            };
          });

          mofuNpcTimerRef.current =
            window.setTimeout(() => {
              onStateChange((current) => {
                if (current.tapCount >= 12) {
                  return current;
                }

                return {
                  ...current,
                  action: "idle",
                };
              });

              scheduleNextMove();
            }, 1800);
        }, waitTime);
    };

    scheduleNextMove();

    return () => {
      if (
        mofuNpcTimerRef.current !== null
      ) {
        window.clearTimeout(
          mofuNpcTimerRef.current
        );
      }
    };
  }, [onStateChange]);
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
            transform: `
              translateX(calc(-50% + ${state.x}px))
              translateY(${state.y}px)
            `,
            transition:
              state.action === "living-walk"
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
                state.action ===
                  "living-walk" &&
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
                  state.action ===
                  "living-walk"
                    ? "1.65"
                    : "1",
              }}
            >
              <img
                src={
                  state.tapCount >= 30
                    ? "/mofu-sulking.png"
                    : state.tapCount >= 20
                      ? "/mofu-running.png"
                      : state.tapCount >= 12 ||
                          state.action ===
                            "living-walk"
                        ? walkFrame
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
                      : state.tapCount >=
                            12 ||
                          state.action ===
                            "living-walk"
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