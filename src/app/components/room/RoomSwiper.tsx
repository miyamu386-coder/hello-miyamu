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
import { Geolocation } from "@capacitor/geolocation";
import { getMofuMessage } from "../mofu/mofuMessages";
import {
  fetchWeather,
  type WeatherData,
} from "./useWeather";
import {
  fetchWeatherWarnings,
  type WeatherWarningResult,
} from "./useWeatherWarning";
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
  excludedDates?: string[];
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
  initialRoomIndex: number;
  onRoomChange: (index: number) => void;
  isBgmEnabled: boolean;
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

const WEATHER_STORAGE_KEY =
  "miyamu_diary_weather_v1";
const WEATHER_WARNING_STORAGE_KEY =
  "miyamu_diary_weather_warnings_v1";

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
  // 個別削除された日は表示しない
  if (
    schedule.excludedDates?.includes(
      dateISO
    )
  ) {
    return false;
  }

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
  initialRoomIndex,
  onRoomChange,
  isBgmEnabled,
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

  const bgmRef =
    useRef<HTMLAudioElement | null>(null);

  const mofuMessageTimerRef =
    useRef<number | null>(null);

  const mofuJumpTimerRef =
    useRef<number | null>(null);

  const [
    currentRoomIndex,
    setCurrentRoomIndex,
  ] = useState(initialRoomIndex);

  const [
    currentTime,
    setCurrentTime,
  ] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);


  const [
    mofuWalkFrameIndex,
    setMofuWalkFrameIndex,
  ] = useState(0);

  const [
    schedules,
    setSchedules,
  ] = useState<ScheduleItem[]>([]);

  const [
    weather,
    setWeather,
  ] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const permission =
          await Geolocation.requestPermissions();

        if (
          permission.location !== "granted" &&
          permission.coarseLocation !== "granted"
        ) {
          console.warn(
            "位置情報の利用が許可されていません"
          );
          return;
        }

        const position =
          await Geolocation.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 30 * 60 * 1000,
          });

        const {
          latitude,
          longitude,
        } = position.coords;

        const [
          nextWeather,
          nextWeatherWarnings,
        ] = await Promise.all([
          fetchWeather(
            latitude,
            longitude
          ),
          fetchWeatherWarnings(
            latitude,
            longitude
          ),
        ]);

        setWeather(nextWeather);
        setWeatherWarnings(
          nextWeatherWarnings
        );

        localStorage.setItem(
          WEATHER_STORAGE_KEY,
          JSON.stringify(nextWeather)
        );

        if (nextWeatherWarnings) {
          localStorage.setItem(
            WEATHER_WARNING_STORAGE_KEY,
            JSON.stringify(
              nextWeatherWarnings
            )
          );
        } else {
          localStorage.removeItem(
            WEATHER_WARNING_STORAGE_KEY
          );
        }

        console.log(
          "現在地の天気",
          {
            latitude,
            longitude,
            weather: nextWeather,
          }
        );
      } catch (error) {
        console.error(
          "位置情報または天気データの取得に失敗しました",
          error
        );
      }
    };

    void loadWeather();
  }, []);


  const [
    showMofuMessageRoom,
    setShowMofuMessageRoom,
  ] = useState<RoomId | null>(null);
  const [
    weatherWarnings,
    setWeatherWarnings,
  ] =
    useState<WeatherWarningResult | null>(
      null
    );

  const [
    wasLivingMofuSleeping,
    setWasLivingMofuSleeping,
  ] = useState(false);

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
        setWasLivingMofuSleeping(false);

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
              excludedDates:
                Array.isArray(
                  schedule.excludedDates
                )
                  ? schedule.excludedDates
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

  useEffect(() => {
    const bgmMap: Record<RoomId, string> = {
      "living-kitchen":
        "/audio/living/living.mp3",
      workroom:
        "/audio/work/work.mp3",
      "conditioning-room":
        "/audio/conditioning/conditioning.mp3",
    };

    // BGMがOFFなら停止して終了
    if (!isBgmEnabled) {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
      }

      return;
    }

    const nextSrc =
      bgmMap[currentRoom.id];

    // 前の部屋のBGMを停止
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }

    // 今いる部屋のBGMを作成
    const audio = new Audio(nextSrc);

    audio.loop = true;
    audio.volume = 0.25;

    bgmRef.current = audio;

    audio.play().catch((error) => {
      console.log(
        "BGM再生待ち:",
        error
      );
    });

    return () => {
      audio.pause();
    };
  }, [
    currentRoom.id,
    isBgmEnabled,
  ]);

  const mofuTapCount =
    currentRoom.id === "living-kitchen" ||
      currentRoom.id === "workroom"
      ? mofuStates[
        currentRoom.id as MofuManagedRoomId
      ].tapCount
      : 0;

  const mofuMessage = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);

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

    return getMofuMessage({
      roomId: currentRoom.id,
      tapCount: mofuTapCount,
      todaySchedules,
      tomorrowSchedules,
      wasSleeping:
        currentRoom.id ===
        "living-kitchen" &&
        wasLivingMofuSleeping,
    });
  }, [
    schedules,
    currentRoom.id,
    mofuTapCount,
    wasLivingMofuSleeping,
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
    onRoomChange(nextIndex);
  };

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      left:
        container.clientWidth *
        initialRoomIndex,
      behavior: "auto",
    });

    setCurrentRoomIndex(
      initialRoomIndex
    );
  }, [initialRoomIndex]);

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
    roomId: MofuManagedRoomId,
    wasSleeping = false
  ) => {
    setWasLivingMofuSleeping(
      roomId === "living-kitchen" &&
      wasSleeping
    );

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
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          overscrollBehaviorX: "contain",
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
              <div
                style={{
                  position: "absolute",
                  top: "60%",
                  left: "68%",
                  right: "auto",
                  transform: "translateX(-50%)",
                  zIndex: 50,

                  padding: "4px 7px 5px",
                  borderRadius: 5,
                  background: "rgba(20, 22, 20, 0.92)",
                  minWidth: 76,
                  border: "1.5px solid rgba(90, 75, 60, 0.9)",
                  color: "#ffffff",
                  textAlign: "center",
                  fontVariantNumeric: "tabular-nums",
                  boxShadow:
                    "0 3px 10px rgba(0, 0, 0, 0.25)",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    lineHeight: 1,
                  }}
                >
                  {pad2(currentTime.getHours())}:
                  {pad2(currentTime.getMinutes())}
                </div>

                <div
                  style={{
                    marginTop: 4,
                    fontSize: 7,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {weather
                    ? `${weather.temperature}℃ ・ ☔ ${weather.precipitationProbability}%`
                    : "天気取得中"}
                </div>
              </div>
            )}
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
                onMofuClick={(wasSleeping) =>
                  handleMofuClick(
                    "living-kitchen",
                    wasSleeping
                  )
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