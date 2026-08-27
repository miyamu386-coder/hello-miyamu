"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import LivingRoom from "./LivingRoom";
import WorkRoom from "./WorkRoom";
import ConditioningRoom from "./ConditioningRoom";
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
type MofuManagedRoomId =
  | "living-kitchen"
  | "workroom";

type MofuAction =
  | "idle"
  | "living"
  | "living-walk"
  | "work-walk"
  | "work-pc"
  | "work-book";

type Room = {
  id: RoomId;
  name: string;
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
  onOpenBook: () => void;
  onOpenCalendar: () => void;
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
  },
  {
    id: "workroom",
    name: "仕事部屋",
  },
  {
    id: "conditioning-room",
    name: "コンディショニングルーム",
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

export default function RoomSwiper({
  onOpenKitchen,
  onOpenFridge,
  onOpenWork,
  onOpenBook,
  onOpenCalendar,
  onOpenTraining,
  onOpenWeight,
}: Props) {
  const scrollRef =
    useRef<HTMLDivElement>(null);

  const mofuMessageTimerRef =
    useRef<number | null>(null);

  const mofuJumpTimerRef =
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
  Record<MofuManagedRoomId, MofuRoomState>
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

const mofuTapCount =
  currentRoom.id === "living-kitchen" ||
  currentRoom.id === "workroom"
    ? mofuStates[
        currentRoom.id as MofuManagedRoomId
      ].tapCount
    : 0;

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
  const handleLivingRoomStateChange =
  useCallback(
    (
      updater: (
        current: MofuRoomState
      ) => MofuRoomState
    ) => {
      setMofuStates((prev) => ({
        ...prev,
        "living-kitchen": updater(
          prev["living-kitchen"]
        ),
      }));
    },
    []
  );
const handleWorkRoomStateChange =
  useCallback(
    (
      updater: (
        current: MofuRoomState
      ) => MofuRoomState
    ) => {
      setMofuStates((prev) => ({
        ...prev,
        workroom: updater(
          prev.workroom
        ),
      }));
    },
    []
  );

  const handleMofuClick = (
  roomId: MofuManagedRoomId
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
            {room.id === "living-kitchen" && (
  <LivingRoom
    state={mofuStates["living-kitchen"]}
    showMessage={
      showMofuMessageRoom === "living-kitchen" &&
      currentRoom.id === "living-kitchen"
    }
    message={mofuMessage}
    isShortMessage={isShortMofuMessage}
    walkFrame={
      mofuWalkFrames[mofuWalkFrameIndex]
    }
    onMofuClick={() =>
      handleMofuClick("living-kitchen")
    }
    onOpenKitchen={onOpenKitchen}
    onOpenFridge={onOpenFridge}
    onOpenBook={onOpenBook}
    onOpenCalendar={onOpenCalendar}
    onStateChange={handleLivingRoomStateChange}
  />
)}
{room.id === "workroom" && (
 <WorkRoom
  onOpenWork={onOpenWork}
  onOpenMofuFun={() =>
    setShowMofuFun(true)
  }
  showMofuFun={showMofuFun}
  state={mofuStates["workroom"]}
  showMessage={
    showMofuMessageRoom === "workroom" &&
    currentRoom.id === "workroom"
  }
  message={mofuMessage}
  isShortMessage={isShortMofuMessage}
  walkFrame={
    mofuWorkWalkFrames[
      mofuWalkFrameIndex %
        mofuWorkWalkFrames.length
    ]
  }
  onMofuClick={() =>
    handleMofuClick("workroom")
  }
  onStateChange={handleWorkRoomStateChange}
/>
)}
            
 {room.id === "conditioning-room" && (
  <ConditioningRoom
    onOpenTraining={onOpenTraining}
    onOpenWeight={onOpenWeight}
  />
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