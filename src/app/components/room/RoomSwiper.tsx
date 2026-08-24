"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type RepeatType =
  | "none"
  | "weekly"
  | "monthly"
  | "yearly";

type ScheduleItem = {
  id: string;
  date: string;
  title: string;
  memo: string;
  repeat: RepeatType;
  weekdays?: number[];
};

type RoomId =
  | "living-kitchen"
  | "workroom"
  | "conditioning-room";

type MofuAction =
  | "idle"
  | "living"
  | "living-walk"
  | "work-walk"
  | "work-pc"
  | "work-book"
  | "training"
  | "stretch";

type Room = {
  id: RoomId;
  name: string;
  image: string;
  mofuActions: MofuAction[];
};

type MofuRoomState = {
  tapCount: number;
  isJumping: boolean;
  action: MofuAction;
  x: number;
  y: number;
};

type Props = {
  onOpenKitchen: () => void;
  onOpenFridge: () => void;
  onOpenWork: () => void;
  onOpenPuzzle: () => void;
  onOpenBook: () => void;
  onOpenCalendar: () => void;
  onOpenConditioning: () => void;
  onOpenTraining: () => void;
  onOpenWeight: () => void;
};

const STORAGE_KEY =
  "miyamu_diary_schedules_v1";

const pad2 = (value: number) =>
  String(value).padStart(2, "0");

const toDateISO = (date: Date) =>
  `${date.getFullYear()}-${pad2(
    date.getMonth() + 1
  )}-${pad2(date.getDate())}`;

const getWeekdayFromISO = (
  dateISO: string
) => {
  const [year, month, day] = dateISO
    .split("-")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day
  ).getDay();
};

const scheduleMatchesDate = (
  schedule: ScheduleItem,
  dateISO: string
) => {
  // 登録日より前には表示しない
  if (dateISO < schedule.date) {
    return false;
  }

  const [
    scheduleYear,
    scheduleMonth,
    scheduleDay,
  ] = schedule.date
    .split("-")
    .map(Number);

  const [
    targetYear,
    targetMonth,
    targetDay,
  ] = dateISO
    .split("-")
    .map(Number);

  if (schedule.repeat === "weekly") {
    const weekday =
      getWeekdayFromISO(dateISO);

    return (
      schedule.weekdays?.includes(
        weekday
      ) ?? false
    );
  }

  if (schedule.repeat === "monthly") {
    return targetDay === scheduleDay;
  }

  if (schedule.repeat === "yearly") {
    return (
      targetMonth === scheduleMonth &&
      targetDay === scheduleDay
    );
  }

  return (
    targetYear === scheduleYear &&
    targetMonth === scheduleMonth &&
    targetDay === scheduleDay
  );
};

const rooms: Room[] = [
  {
    id: "living-kitchen",
    name: "リビングキッチン",
    image: "/room/mofu-room.png",
   mofuActions: [
  "idle",
  "living",
  "living-walk",
],
  },
  {
  id: "workroom",
  name: "仕事部屋",
  image: "/room/mofu-workroom.png",
  mofuActions: [
    "idle",
    "work-walk",
    "work-pc",
    "work-book",
  ],
},
  {
    id: "conditioning-room",
    name: "コンディショニングルーム",
    image:
      "/room/mohu-ConditioningRoom.png",
    mofuActions: [
      "idle",
      "training",
      "stretch",
    ],
  },
];

const mofuWalkFrames = [
  "/mofu-walk-1.png",
  "/mofu-walk-2.png",
  "/mofu-walk-3.png",
];
const mofuWorkWalkFrames = [
  "/mofu-work-walk-1.png",
  "/mofu-work-walk-2.png",
  "/mofu-work-walk-3.png",
  "/mofu-work-walk-4.png",
];
const WORK_PC_POSITION = {
  x: -120,
  y: -220,
};

export default function RoomSwiper({
  onOpenKitchen,
  onOpenFridge,
  onOpenWork,
  onOpenPuzzle,
  onOpenBook,
  onOpenCalendar,
  onOpenConditioning,
  onOpenTraining,
  onOpenWeight,
}: Props) {
  const scrollRef =
    useRef<HTMLDivElement>(null);

  const mofuMessageTimerRef =
    useRef<number | null>(null);

  const mofuJumpTimerRef =
    useRef<number | null>(null);
  const mofuNpcTimerRef =
    useRef<number | null>(null);
  const workMofuNpcTimerRef =
    useRef<number | null>(null);

  const [
    currentRoomIndex,
    setCurrentRoomIndex,
  ] = useState(0);

  const [
  mofuWalkFrameIndex,
  setMofuWalkFrameIndex,
] = useState(0);

  const [
    schedules,
    setSchedules,
  ] = useState<ScheduleItem[]>([]);

  const [
  showMofuMessageRoom,
  setShowMofuMessageRoom,
] = useState<RoomId | null>(null);

const [
  showMofuFun,
  setShowMofuFun,
] = useState(false);

const [
  mofuStates,
  setMofuStates,
] = useState<
  Record<RoomId, MofuRoomState>
>({

  "living-kitchen": {
  tapCount: 0,
  isJumping: false,
  action: "idle",
  x: 0,
  y: 0,
},
workroom: {
  tapCount: 0,
  isJumping: false,
  action: "idle",
  x: 0,
  y: 0,
},
"conditioning-room": {
  tapCount: 0,
  isJumping: false,
  action: "idle",
  x: 0,
  y: 0,
},
});

  const showMessageForFourSeconds = (
  roomId: RoomId
) => {
  setShowMofuMessageRoom(roomId);

  if (
    mofuMessageTimerRef.current !==
    null
  ) {
    window.clearTimeout(
      mofuMessageTimerRef.current
    );
  }

  mofuMessageTimerRef.current =
    window.setTimeout(() => {
      setShowMofuMessageRoom(null);
      mofuMessageTimerRef.current =
        null;
    }, 4000);
};

  useEffect(() => {
  const currentRoom =
    rooms[currentRoomIndex];

  showMessageForFourSeconds(
    currentRoom.id
  );

  return () => {
    if (
      mofuMessageTimerRef.current !==
      null
    ) {
      window.clearTimeout(
        mofuMessageTimerRef.current
      );

      mofuMessageTimerRef.current =
        null;
    }
  };
}, [currentRoomIndex]);
useEffect(() => {
  const timer = window.setInterval(() => {
    setMofuWalkFrameIndex((index) =>
      (index + 1) % mofuWalkFrames.length
    );
  }, 180);

  return () => {
    window.clearInterval(timer);
  };
}, []);
useEffect(() => {
  const roomId: RoomId =
    "living-kitchen";

  const scheduleNextMove = () => {
    const waitTime =
      3000 + Math.random() * 4000;

    mofuNpcTimerRef.current =
      window.setTimeout(() => {
        setMofuStates((prev) => {
          const current =
            prev[roomId];

          // タップ逃走モード中は
          // NPC自律移動をしない
          if (current.tapCount >= 12) {
            return prev;
          }

          // 左右どちらかへ移動
          const nextX =
           current.x >= 0
           ? -120
           : 120;

          return {
            ...prev,
            [roomId]: {
              ...current,
              action: "living-walk",
              x: nextX,
              y: 0,
            },
          };
        });

        // 歩行時間
        mofuNpcTimerRef.current =
          window.setTimeout(() => {
            setMofuStates((prev) => {
              const current =
                prev[roomId];

              if (
                current.tapCount >= 12
              ) {
                return prev;
              }

              return {
                ...prev,
                [roomId]: {
                  ...current,
                  action: "idle",
                },
              };
            });

            scheduleNextMove();
          }, 1800);
      }, waitTime);
  };

  scheduleNextMove();

  return () => {
    if (
      mofuNpcTimerRef.current !==
      null
    ) {
      window.clearTimeout(
        mofuNpcTimerRef.current
      );
    }
  };
}, []);

useEffect(() => {
  const roomId: RoomId =
    "workroom";

  const scheduleNextMove = () => {
    const waitTime =
      3000 + Math.random() * 4000;

    workMofuNpcTimerRef.current =
      window.setTimeout(() => {
        setMofuStates((prev) => {
          const current =
            prev[roomId];

          return {
            ...prev,
            [roomId]: {
              ...current,
              action: "work-walk",
              x: WORK_PC_POSITION.x,
              y: WORK_PC_POSITION.y,
            },
          };
        });

        workMofuNpcTimerRef.current =
  window.setTimeout(() => {
    setMofuStates((prev) => {
      const current =
        prev[roomId];

      return {
        ...prev,
        [roomId]: {
          ...current,
          action: "work-pc",
        },
      };
    });
  }, 1800);
      }, waitTime);
  };

  scheduleNextMove();

  return () => {
    if (
      workMofuNpcTimerRef.current !==
      null
    ) {
      window.clearTimeout(
        workMofuNpcTimerRef.current
      );
    }
  };
}, []);


  useEffect(() => {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {
      return;
    }

    try {
      const parsed =
        JSON.parse(saved);

      if (Array.isArray(parsed)) {
        const normalized:
          ScheduleItem[] =
          parsed.map(
            (schedule) => ({
              ...schedule,
              repeat:
                schedule.repeat ??
                "none",
              weekdays:
                Array.isArray(
                  schedule.weekdays
                )
                  ? schedule.weekdays
                  : [],
            })
          );

        setSchedules(normalized);
      }
    } catch {
      // 読み込み失敗時は予定なし扱い
    }
  }, []);

  useEffect(() => {
    return () => {
      if (
        mofuMessageTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          mofuMessageTimerRef.current
        );
      }

      if (
        mofuJumpTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          mofuJumpTimerRef.current
        );
      }
    };
  }, []);

const currentRoom =
  rooms[currentRoomIndex];

const currentMofuState =
  mofuStates[currentRoom.id];

const mofuTapCount =
  currentMofuState.tapCount;

  const mofuMessage = useMemo(() => {
    if (mofuTapCount >= 50) {
  return "…………💢";
}

if (mofuTapCount >= 30) {
  return "おい…。";
}

if (mofuTapCount >= 20) {
  return "かまいすぎだ…";
}

if (mofuTapCount >= 8) {
  return "触りすぎだ…";
}

if (mofuTapCount >= 4) {
  return "なんだ？";
}

if (mofuTapCount >= 1) {
  return "……ん？";
}

    const today = new Date();

    const tomorrow =
      new Date(today);

    tomorrow.setDate(
      today.getDate() + 1
    );

    const todayISO =
      toDateISO(today);

    const tomorrowISO =
      toDateISO(tomorrow);

    const todaySchedules =
      schedules.filter(
        (schedule) =>
          scheduleMatchesDate(
            schedule,
            todayISO
          )
      );

    const tomorrowSchedules =
      schedules.filter(
        (schedule) =>
          scheduleMatchesDate(
            schedule,
            tomorrowISO
          )
      );

    const todayText =
      todaySchedules
        .map(
          (schedule) =>
            `${schedule.title} ${schedule.memo}`
        )
        .join(" ");

    if (
      currentRoomIndex === 0 &&
      /誕生日|birthday/i.test(
        todayText
      )
    ) {
      return "今日は誕生日だね🎂 おめでとう！";
    }

    const formatScheduleTitles = (
      items: ScheduleItem[]
    ) => {
      const visible =
        items.slice(0, 2);

      const titles = visible
        .map(
          (schedule) =>
            `「${schedule.title}」`
        )
        .join("、");

      const remaining =
        items.length -
        visible.length;

      if (remaining > 0) {
        return `${titles}ほか${remaining}件`;
      }

      return titles;
    };

    if (
      currentRoomIndex === 0 &&
      todaySchedules.length > 0
    ) {
      return `今日は${formatScheduleTitles(
        todaySchedules
      )}の予定があるよ🐾`;
    }

    if (
      currentRoomIndex === 0 &&
      tomorrowSchedules.length > 0
    ) {
      return `明日は${formatScheduleTitles(
        tomorrowSchedules
      )}の予定があるよ🐾`;
    }

    if (
      currentRoomIndex === 0
    ) {
      const messages = [
        "今日は予定なしか。たまにはのんびりするのも悪くないぞ🐾",
        "暇なら冷蔵庫でも覗いてこい。何かあるだろ🐾",
        "予定がない日くらい、好きに過ごせばいいんじゃないか？🐾",
        "何もない日も立派な予定だ。俺は寝るけどな🐾",
      ];

      return messages[
        Math.floor(
          Math.random() *
            messages.length
        )
      ];
    }

    if (
      currentRoomIndex === 1
    ) {
      const messages = [
        "さて、今日はどれだけ積むつもりだ？🐾",
        "また作業か。好きだな、お前も🐾",
        "無理して倒れたら意味ないぞ🐾",
        "積むのはいいが、休むのも仕事だぞ🐾",
      ];

      return messages[
        Math.floor(
          Math.random() *
            messages.length
        )
      ];
    }

    if (
      currentRoomIndex === 2
    ) {
      const messages = [
        "ちゃんと自分の体もメンテしてるか？🐾",
        "鍛えるのもいいが、休ませるのも忘れるなよ🐾",
        "体重計から逃げても数字は変わらんぞ🐾",
        "今日の調子くらい、自分で把握しとけよ🐾",
      ];

      return messages[
        Math.floor(
          Math.random() *
            messages.length
        )
      ];
    }

    return "今日は何しようかな〜🐾";
  }, [
    schedules,
    currentRoomIndex,
    mofuTapCount,
  ]);

  const isShortMofuMessage =
    mofuMessage.length <= 8;

  const handleScroll = () => {
    const container =
      scrollRef.current;

    if (!container) {
      return;
    }

    const roomWidth =
      container.clientWidth;

    if (roomWidth === 0) {
      return;
    }

    const nextIndex =
      Math.round(
        container.scrollLeft /
          roomWidth
      );

    setCurrentRoomIndex(
      nextIndex
    );
  };

  const moveToRoom = (
    index: number
  ) => {
    const container =
      scrollRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      left:
        container.clientWidth *
        index,
      behavior: "smooth",
    });
  };

  const handleMofuClick = (
  roomId: RoomId
) => {
  setMofuStates((prev) => {
  const nextTapCount =
    prev[roomId].tapCount + 1;

  return {
    ...prev,
    [roomId]: {
      ...prev[roomId],
      tapCount: nextTapCount,
      isJumping: false,
      action:
        roomId === "living-kitchen" &&
        nextTapCount >= 12
          ? "living-walk"
          : prev[roomId].action,
     x:
  roomId === "living-kitchen"
    ? nextTapCount >= 30
      ? 170
      : nextTapCount >= 20
        ? 150
        : nextTapCount >= 12
          ? -135
          : prev[roomId].x
    : prev[roomId].x,

y:
  roomId === "living-kitchen"
    ? nextTapCount >= 30
      ? -220
      : nextTapCount >= 20
        ? -70
        : nextTapCount >= 12
          ? 0
          : prev[roomId].y
    : prev[roomId].y,
    },
  };
});

  showMessageForFourSeconds(
    roomId
  );

  if (
    mofuJumpTimerRef.current !==
    null
  ) {
    window.clearTimeout(
      mofuJumpTimerRef.current
    );
  }

  requestAnimationFrame(() => {
    setMofuStates((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        isJumping: true,
      },
    }));

    mofuJumpTimerRef.current =
      window.setTimeout(() => {
        setMofuStates((prev) => ({
          ...prev,
          [roomId]: {
            ...prev[roomId],
            isJumping: false,
          },
        }));

        mofuJumpTimerRef.current =
          null;
      }, 600);
  });
};

  return (
    <section
      style={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: "flex",
          width: "100%",
          overflowX: "auto",
          scrollSnapType:
            "x mandatory",
          WebkitOverflowScrolling:
            "touch",
          scrollbarWidth: "none",
          overscrollBehaviorX:
            "contain",
        }}
      >
        {rooms.map((room) => (
          <div
            key={room.id}
            style={{
              position: "relative",
              flex: "0 0 100%",
              width: "100%",
              aspectRatio: "9 / 16",
              scrollSnapAlign:
                "start",
              scrollSnapStop:
                "always",
              overflow: "hidden",
              borderRadius: 20,
            }}
          >
            <img
              src={room.image}
              alt={room.name}
              draggable={false}
              style={{
  width: "100%",
  height: "100%",
  objectFit: "contain",
  display: "block",
  userSelect: "none",
  cursor: "pointer",

  

                background:
                  room.id ===
                  "workroom"
                    ? "#2b1c12"
                    : room.id ===
                        "conditioning-room"
                      ? "#f3eadc"
                      : "transparent",
              }}
            />

            {room.id ===
              "living-kitchen" && (
              <>
                <button
                  type="button"
                  aria-label="キッチンを開く"
                  onClick={
                    onOpenKitchen
                  }
                  style={{
                    position:
                      "absolute",
                    left: "32%",
                    top: "22%",
                    width: "38%",
                    height: "40%",
                    border: "none",
                    background:
                      "transparent",
                    cursor:
                      "pointer",
                    zIndex: 4,
                  }}
                />

                <button
                  type="button"
                  aria-label="冷蔵庫を開く"
                  onClick={
                    onOpenFridge
                  }
                  style={{
                    position:
                      "absolute",
                    right: "0%",
                    top: "20%",
                    width: "22%",
                    height: "43%",
                    border: "none",
                    background:
                      "transparent",
                    cursor:
                      "pointer",
                    zIndex: 4,
                  }}
                />

                <button
                  type="button"
                  aria-label="リビングの本を開く"
                  onClick={
                    onOpenBook
                  }
                  style={{
                    position:
                      "absolute",
                    left: "61%",
                    top: "64%",
                    width: "18%",
                    height: "10%",
                    padding: 0,
                    border: "none",
                    background:
                      "transparent",
                    cursor:
                      "pointer",
                    zIndex: 10,
                  }}
                />

                <button
                  type="button"
                  aria-label="予定表を開く"
                  onClick={
                    onOpenCalendar
                  }
                  style={{
                    position:
                      "absolute",
                    left: "5%",
                    top: "13%",
                    width: "31%",
                    height: "31%",
                    padding: 0,
                    border: "none",
                    background:
                      "transparent",
                    cursor:
                      "pointer",
                    zIndex: 6,
                  }}
                />
              </>
            )}
            {room.id ===
              "workroom" && (
              <>
                <button
                  type="button"
                  aria-label="パソコンを開く"
                  onClick={
                    onOpenWork
                  }
                  style={{
                    position:
                      "absolute",
                    left: "4%",
                    top: "35%",
                    width: "33%",
                    height: "27%",
                    padding: 0,
                    border: "none",
                    background:
                      "transparent",
                    cursor:
                      "pointer",
                    zIndex: 4,
                  }}
                />

                <button
                 type="button"
                 aria-label="モフのお楽しみコーナー"
                 onClick={() =>
                  setShowMofuFun(true)
                  }
                 style={{
                position: "absolute",
                left: "43%",
                top: "29%",
                width: "5%",
                height: "5%",
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    cursor:
                      "pointer",
                    zIndex: 4,
                  }}
                />
              </>
             )} 
              {room.id === "workroom" &&
  showMofuFun && (
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
            

            {room.id ===
              "conditioning-room" && (
              <>
                <button
                  type="button"
                  aria-label="筋トレメニューを開く"
                  onClick={
                    onOpenTraining
                  }
                  style={{
                    position:
                      "absolute",
                    left: "36%",
                    top: "56%",
                    width: "30%",
                    height: "20%",
                    padding: 0,
                    border: "none",
                    background:
                      "transparent",
                    cursor:
                      "pointer",
                    zIndex: 4,
                  }}
                />

                <button
                  type="button"
                  aria-label="体重表を開く"
                  onClick={
                    onOpenWeight
                  }
                  style={{
                    position:
                      "absolute",
                    left: "43%",
                    top: "31%",
                    width: "14%",
                    height: "9%",
                    padding: 0,
                    border: "none",
                    background:
                      "transparent",
                    cursor:
                      "pointer",
                    zIndex: 4,
                  }}
                />
              </>
            )}
{room.id === "living-kitchen" &&
  mofuStates[room.id].tapCount >= 50 && (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.15)",
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
  {!(
  room.id === "living-kitchen" &&
  mofuStates[room.id].tapCount >= 50
) && (
  <div
    style={{
    position: "absolute",
    left: "50%",
    bottom: "4%",
    width: 95,
    height: 135,
    transform: `
     translateX(calc(-50% + ${mofuStates[room.id].x}px))
     translateY(${mofuStates[room.id].y}px)
     `,
transition:
  (
    room.id === "living-kitchen" &&
    mofuStates[room.id].action ===
      "living-walk"
  ) ||
  (
    room.id === "workroom" &&
    mofuStates[room.id].action ===
      "work-walk"
  )
    ? "transform 1.8s linear"
    : "transform 0.6s ease",
    zIndex: 5,
    pointerEvents: "auto",
  }}
>
              {showMofuMessageRoom === room.id &&
               room.id === currentRoom.id && (
                <div
                  style={{
                    position:
                      "absolute",
                    bottom: "105%",
                    left: "50%",
                    transform:
                      "translateX(-50%)",

                    width:
                      "max-content",
                    minWidth: 90,
                    maxWidth:
                      "min(210px, 80vw)",

                    padding:
                      "8px 12px",
                    borderRadius: 12,
                    background:
                      "white",
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.15)",

                    fontSize: 12,
                    lineHeight: 1.5,
                    textAlign:
                      "center",
                    color: "#333",

                    whiteSpace:
                      isShortMofuMessage
                        ? "nowrap"
                        : "normal",

                    overflowWrap:
                      "break-word",

                    boxSizing:
                      "border-box",

                    pointerEvents:
                      "none",
                  }}
                >
                  {mofuMessage}
                </div>
              )}

             <div
  style={{
    width: "100%",
    height: "100%",
    transform:
  (
    mofuStates[room.id].action ===
      "living-walk" ||
    mofuStates[room.id].action ===
      "work-walk"
  ) &&
  mofuStates[room.id].x > 0
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
      mofuStates[room.id].action ===
        "living-walk"
        ? "1.65"
        : mofuStates[room.id].action ===
            "work-walk"
          ? "1.35"
          : "1",
  }}
>
  <img
    src={
      room.id === "living-kitchen"
        ? mofuStates[room.id].tapCount >= 50
          ? "/mofu-whiteeye.png"
          : mofuStates[room.id].tapCount >= 30
            ? "/mofu-sulking.png"
            : mofuStates[room.id].tapCount >= 20
              ? "/mofu-running.png"
              : mofuStates[room.id].tapCount >= 12 ||
                  mofuStates[room.id].action ===
                    "living-walk"
                ? mofuWalkFrames[
                    mofuWalkFrameIndex
                  ]
                : "/mofu-normal.png"
        : room.id === "workroom"
  ? mofuStates[room.id].action ===
      "work-walk"
    ? mofuWorkWalkFrames[
        mofuWalkFrameIndex %
          mofuWorkWalkFrames.length
      ]
    : mofuStates[room.id].action ===
        "work-pc"
      ? "/mofu-work-pc.png"
      : "/mofu-normal.png"
  : "/mofu-normal.png"
    }
    alt="モフ"
    draggable={false}
    onClick={() =>
      handleMofuClick(room.id)
    }
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
      display: "block",
      userSelect: "none",
      cursor: "pointer",

      animation:
  mofuStates[room.id].isJumping
    ? "mofuJump 0.6s ease"
    : (
        room.id === "living-kitchen" &&
        mofuStates[room.id].tapCount < 50 &&
        (
          mofuStates[room.id].tapCount >= 12 ||
          mofuStates[room.id].action ===
            "living-walk"
        )
      ) ||
      (
        room.id === "workroom" &&
        mofuStates[room.id].action ===
          "work-walk"
      )
      ? "mofuWalk 0.35s linear infinite"
      : "none",
    }}
  />
</div>
</div>
</div>
          )}

          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "center",
          gap: 8,
          marginTop: 12,
        }}
      >
        {rooms.map(
          (room, index) => (
            <button
              key={room.id}
              type="button"
              aria-label={`${room.name}へ移動`}
              onClick={() =>
                moveToRoom(index)
              }
              style={{
                width:
                  currentRoomIndex ===
                  index
                    ? 22
                    : 8,
                height: 8,
                padding: 0,
                border: "none",
                borderRadius: 999,
                background:
                  currentRoomIndex ===
                  index
                    ? "#4f7c5b"
                    : "#c8c8c8",
                transition:
                  "width 0.2s ease",
                cursor:
                  "pointer",
              }}
            />
          )
        )}
      </div>
    </section>
  );
}