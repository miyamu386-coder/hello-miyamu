"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

type Room = {
  id: string;
  name: string;
  image: string;
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
  },
  {
    id: "workroom",
    name: "仕事部屋",
    image: "/room/mofu-workroom.png",
  },
  {
    id: "conditioning-room",
    name: "コンディショニングルーム",
    image:
      "/room/mohu-ConditioningRoom.png",
  },
];

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

  const [
    currentRoomIndex,
    setCurrentRoomIndex,
  ] = useState(0);

  const [
    schedules,
    setSchedules,
  ] = useState<ScheduleItem[]>([]);

  const [
    showMofuMessage,
    setShowMofuMessage,
  ] = useState(false);

  const [
    isMofuJumping,
    setIsMofuJumping,
  ] = useState(false);

  const showMessageForFourSeconds =
    () => {
      setShowMofuMessage(true);

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
          setShowMofuMessage(false);
          mofuMessageTimerRef.current =
            null;
        }, 4000);
    };

  useEffect(() => {
    showMessageForFourSeconds();

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

  const mofuMessage = useMemo(() => {
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
  ]);

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

  const handleMofuClick = () => {
    showMessageForFourSeconds();

    setIsMofuJumping(false);

    if (
      mofuJumpTimerRef.current !==
      null
    ) {
      window.clearTimeout(
        mofuJumpTimerRef.current
      );
    }

    // 一度 false を挟んで、
    // 連続タップでもジャンプを再発火させる
    requestAnimationFrame(() => {
      setIsMofuJumping(true);

      mofuJumpTimerRef.current =
        window.setTimeout(() => {
          setIsMofuJumping(false);
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
                display: "block",
                objectFit:
                  room.id ===
                    "workroom" ||
                  room.id ===
                    "conditioning-room"
                    ? "contain"
                    : "cover",
                objectPosition:
                  "center",
                userSelect: "none",
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
                  aria-label="本棚を開く"
                  onClick={
                    onOpenPuzzle
                  }
                  style={{
                    position:
                      "absolute",
                    left: "42%",
                    top: "13%",
                    width: "32%",
                    height: "46%",
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

            <div
              style={{
                position:
                  "absolute",
                left: "50%",
                bottom: "4%",
                width: 95,
                height: 135,
                transform:
                  "translateX(-50%)",
                zIndex: 5,
                pointerEvents:
                  "auto",
              }}
            >
              {showMofuMessage && (
                <div
                  style={{
                    position:
                      "absolute",
                    bottom: "105%",
                    left: "50%",
                    transform:
                      "translateX(-50%)",
                    width: 220,
                    padding:
                      "8px 10px",
                    borderRadius:
                      12,
                    background:
                      "white",
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.15)",
                    fontSize: 13,
                    lineHeight: 1.5,
                    textAlign:
                      "center",
                    color: "#333",
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
                  animation:
                    "mofuFloat 3s ease-in-out infinite",
                }}
              >
                <img
                  src="/mofu-normal.png"
                  alt="モフ"
                  draggable={false}
                  onClick={
                    handleMofuClick
                  }
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit:
                      "contain",
                    display: "block",
                    userSelect:
                      "none",
                    cursor:
                      "pointer",
                    animation:
                      isMofuJumping
                        ? "mofuJump 0.6s ease"
                        : "none",
                  }}
                />
              </div>
            </div>
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