"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";

type Props = {
  onBack: () => void;
};

type RepeatType = "none" | "weekly" | "monthly" | "yearly";

type ScheduleItem = {
  id: string;
  date: string;
  title: string;
  memo: string;
  repeat: RepeatType;
  weekdays?: number[];
};

const STORAGE_KEY = "miyamu_diary_schedules_v1";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const pad2 = (value: number) =>
  String(value).padStart(2, "0");

const toDateISO = (
  year: number,
  month: number,
  day: number
) =>
  `${year}-${pad2(month + 1)}-${pad2(day)}`;

const getTodayISO = () => {
  const today = new Date();

  return toDateISO(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
};
type HolidayItem = {
  date: string;
  name: string;
};

const HOLIDAYS: HolidayItem[] = [
  { date: "2026-01-01", name: "元日" },
  { date: "2026-01-12", name: "成人の日" },
  { date: "2026-02-11", name: "建国記念の日" },
  { date: "2026-02-23", name: "天皇誕生日" },
  { date: "2026-03-20", name: "春分の日" },
  { date: "2026-04-29", name: "昭和の日" },
  { date: "2026-05-03", name: "憲法記念日" },
  { date: "2026-05-04", name: "みどりの日" },
  { date: "2026-05-05", name: "こどもの日" },
  { date: "2026-05-06", name: "休日" },
  { date: "2026-07-20", name: "海の日" },
  { date: "2026-08-11", name: "山の日" },
  { date: "2026-09-21", name: "敬老の日" },
  { date: "2026-09-22", name: "休日" },
  { date: "2026-09-23", name: "秋分の日" },
  { date: "2026-10-12", name: "スポーツの日" },
  { date: "2026-11-03", name: "文化の日" },
  { date: "2026-11-23", name: "勤労感謝の日" },
];

const getHolidayByDate = (dateISO: string) =>
  HOLIDAYS.find((holiday) => holiday.date === dateISO);

const getWeekdayFromISO = (dateISO: string) => {
  const [year, month, day] = dateISO
    .split("-")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day
  ).getDay();
};

const getScheduleIcon = (
  schedules: ScheduleItem[]
) => {
  const text = schedules
    .map(
      (schedule) =>
        `${schedule.title} ${schedule.memo}`
    )
    .join(" ");

  if (/誕生日|birthday/i.test(text)) {
    return "🎂";
  }

  if (
    /ボイトレ|歌|歌唱|発声|レッスン/i.test(text)
  ) {
    return "🎤";
  }

  return "🐾";
};

const scheduleMatchesDate = (
  schedule: ScheduleItem,
  dateISO: string
) => {
  // 登録日より前には表示しない
  if (dateISO < schedule.date) {
    return false;
  }

  const [scheduleYear, scheduleMonth, scheduleDay] =
    schedule.date.split("-").map(Number);

  const [targetYear, targetMonth, targetDay] =
    dateISO.split("-").map(Number);

  if (schedule.repeat === "weekly") {
    const weekday = getWeekdayFromISO(dateISO);

    return (
      schedule.weekdays?.includes(weekday) ?? false
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

export default function CalendarPage({
  onBack,
}: Props) {
  const today = useMemo(
    () => new Date(),
    []
  );

  const [displayYear, setDisplayYear] =
    useState(today.getFullYear());

  const [displayMonth, setDisplayMonth] =
    useState(today.getMonth());

  const [selectedDate, setSelectedDate] =
    useState(getTodayISO());

  const [titleInput, setTitleInput] =
    useState("");

  const [memoInput, setMemoInput] =
    useState("");

  const [repeatInput, setRepeatInput] =
    useState<RepeatType>("none");

  const [
    weekdayInputs,
    setWeekdayInputs,
  ] = useState<number[]>([]);

  const [schedules, setSchedules] =
    useState<ScheduleItem[]>([]);

  const [isLoaded, setIsLoaded] =
    useState(false);

  useEffect(() => {
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          const normalized: ScheduleItem[] =
            parsed.map((schedule) => ({
              ...schedule,

              // 旧データにはrepeatがないので
              // 繰り返しなしとして扱う
              repeat:
                schedule.repeat ??
                "none",

              weekdays:
                Array.isArray(
                  schedule.weekdays
                )
                  ? schedule.weekdays
                  : [],
            }));

          setSchedules(normalized);
        }
      } catch {
        window.alert(
          "予定表データの読み込みに失敗しました"
        );
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(schedules)
    );
  }, [schedules, isLoaded]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(
      displayYear,
      displayMonth,
      1
    ).getDay();

    const lastDate = new Date(
      displayYear,
      displayMonth + 1,
      0
    ).getDate();

    const days: Array<
      number | null
    > = [];

    for (
      let index = 0;
      index < firstDay;
      index += 1
    ) {
      days.push(null);
    }

    for (
      let day = 1;
      day <= lastDate;
      day += 1
    ) {
      days.push(day);
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }, [displayYear, displayMonth]);

  const getSchedulesByDate = (
    dateISO: string
  ) =>
    schedules.filter((schedule) =>
      scheduleMatchesDate(
        schedule,
        dateISO
      )
    );

  const selectedSchedules =
    useMemo(
      () =>
        getSchedulesByDate(
          selectedDate
        ).sort((a, b) =>
          a.title.localeCompare(
            b.title,
            "ja"
          )
        ),
      [schedules, selectedDate]
    );

  const changeMonth = (
    diff: number
  ) => {
    const nextDate = new Date(
      displayYear,
      displayMonth + diff,
      1
    );

    setDisplayYear(
      nextDate.getFullYear()
    );

    setDisplayMonth(
      nextDate.getMonth()
    );

    setSelectedDate(
      toDateISO(
        nextDate.getFullYear(),
        nextDate.getMonth(),
        1
      )
    );
  };

  const changeRepeat = (
    value: RepeatType
  ) => {
    setRepeatInput(value);

    if (value === "weekly") {
      // 最初は選択中の日付の曜日を
      // 自動で選ぶ
      setWeekdayInputs([
        getWeekdayFromISO(
          selectedDate
        ),
      ]);
    } else {
      setWeekdayInputs([]);
    }
  };

  const toggleWeekday = (
    weekday: number
  ) => {
    setWeekdayInputs(
      (current) => {
        if (
          current.includes(
            weekday
          )
        ) {
          return current.filter(
            (value) =>
              value !== weekday
          );
        }

        return [
          ...current,
          weekday,
        ].sort(
          (a, b) => a - b
        );
      }
    );
  };

  const addSchedule = () => {
    const title =
      titleInput.trim();

    if (!title) {
      window.alert(
        "予定名を入力してください"
      );

      return;
    }

    if (
      repeatInput ===
        "weekly" &&
      weekdayInputs.length === 0
    ) {
      window.alert(
        "繰り返す曜日を選択してください"
      );

      return;
    }

    const newSchedule: ScheduleItem =
      {
        id: crypto.randomUUID(),
        date: selectedDate,
        title,
        memo: memoInput.trim(),
        repeat: repeatInput,

        weekdays:
          repeatInput ===
          "weekly"
            ? weekdayInputs
            : [],
      };

    setSchedules(
      (current) => [
        ...current,
        newSchedule,
      ]
    );

    setTitleInput("");
    setMemoInput("");
    setRepeatInput("none");
    setWeekdayInputs([]);
  };

  const removeSchedule = (
    id: string
  ) => {
    const target =
      schedules.find(
        (schedule) =>
          schedule.id === id
      );

    const message =
  target?.repeat &&
  target.repeat !== "none"
    ? "この繰り返し予定をすべて削除しますか？"
    : "この予定を削除しますか？";

    const confirmed =
      window.confirm(message);

    if (!confirmed) {
      return;
    }

    setSchedules(
      (current) =>
        current.filter(
          (schedule) =>
            schedule.id !== id
        )
    );
  };

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <button
          type="button"
          onClick={onBack}
          style={backButtonStyle}
        >
          ← 部屋へ戻る
        </button>

        <h1 style={titleStyle}>
          予定表
        </h1>

        <div
          style={
            monthNavigationStyle
          }
        >
          <button
            type="button"
            onClick={() =>
              changeMonth(-1)
            }
            style={monthButtonStyle}
            aria-label="前月へ"
          >
            ◀
          </button>

          <strong
            style={monthLabelStyle}
          >
            {displayYear}年
            {displayMonth + 1}月
          </strong>

          <button
            type="button"
            onClick={() =>
              changeMonth(1)
            }
            style={monthButtonStyle}
            aria-label="次月へ"
          >
            ▶
          </button>
        </div>

        <div style={calendarStyle}>
          {WEEKDAYS.map(
            (weekday) => (
              <div
                key={weekday}
                style={
                  weekdayStyle
                }
              >
                {weekday}
              </div>
            )
          )}

          {calendarDays.map(
            (day, index) => {
              if (
                day === null
              ) {
                return (
                  <div
                    key={`empty-${index}`}
                    style={
                      emptyDayStyle
                    }
                  />
                );
              }

              const dateISO =
                toDateISO(
                  displayYear,
                  displayMonth,
                  day
                );

              const selected =
                selectedDate ===
                dateISO;

              const todayDate =
                getTodayISO() ===
                dateISO;

              const dateSchedules =
                getSchedulesByDate(
                  dateISO
                );
                const holiday =
               getHolidayByDate(dateISO);
              const scheduleCount =
                dateSchedules.length;

              const scheduleIcon =
                scheduleCount > 0
                  ? getScheduleIcon(
                      dateSchedules
                    )
                  : null;

              return (
                <button
                  key={dateISO}
                  type="button"
                  onClick={() =>
                    setSelectedDate(
                      dateISO
                    )
                  }
                  aria-label={
                    scheduleCount >
                    0
                      ? `${dateISO}、予定${scheduleCount}件`
                      : dateISO
                  }
                 style={{
  ...dayButtonStyle,

  ...(holiday
    ? holidayDayStyle
    : {}),

  ...(selected
    ? selectedDayStyle
    : {}),

  ...(todayDate
    ? todayDayStyle
    : {}),
}}
                >
                  <span
                    style={{
                      ...dayNumberStyle,

                      ...(todayDate
                        ? todayNumberStyle
                        : {}),
                    }}
                  >
                    {day}
                  </span>
                  {holiday && (
  <span style={holidayNameStyle}>
    {holiday.name}
  </span>
)}

                  {scheduleCount >
                    0 && (
                    <>
                      <span
                        aria-hidden="true"
                        style={
                          scheduleIconStyle
                        }
                      >
                        {
                          scheduleIcon
                        }
                      </span>

                      <span
                        aria-label={`予定${scheduleCount}件`}
                        style={
                          scheduleCountStyle
                        }
                      >
                        {
                          scheduleCount
                        }
                      </span>
                    </>
                  )}
                </button>
              );
            }
          )}
        </div>

        <section
          style={
            scheduleSectionStyle
          }
        >
          <h2
            style={
              sectionTitleStyle
            }
          >
            {selectedDate}の予定
          </h2>

          <div style={formStyle}>
            <input
              type="text"
              value={titleInput}
              placeholder="予定名"
              onChange={(event) =>
                setTitleInput(
                  event.target
                    .value
                )
              }
              style={inputStyle}
            />

            <textarea
              value={memoInput}
              placeholder="メモ（任意）"
              rows={3}
              onChange={(event) =>
                setMemoInput(
                  event.target
                    .value
                )
              }
              style={textareaStyle}
            />

            <select
  value={repeatInput}
  onChange={(event) =>
    changeRepeat(
      event.target.value as RepeatType
    )
  }
  style={inputStyle}
>
  <option value="none">
    繰り返しなし
  </option>

  <option value="weekly">
    毎週
  </option>

  <option value="monthly">
    毎月
  </option>

  <option value="yearly">
    毎年
  </option>
</select>

            {repeatInput ===
              "weekly" && (
              <div
                style={
                  weekdaySelectStyle
                }
              >
                {WEEKDAYS.map(
                  (
                    label,
                    index
                  ) => {
                    const checked =
                      weekdayInputs.includes(
                        index
                      );

                    return (
                      <button
                        key={
                          label
                        }
                        type="button"
                        onClick={() =>
                          toggleWeekday(
                            index
                          )
                        }
                        style={{
                          ...weekdayButtonStyle,

                          ...(checked
                            ? weekdayButtonSelectedStyle
                            : {}),
                        }}
                      >
                        {label}
                      </button>
                    );
                  }
                )}
              </div>
            )}

            <button
              type="button"
              onClick={
                addSchedule
              }
              style={
                addButtonStyle
              }
            >
              予定を追加
            </button>
          </div>

          {selectedSchedules.length >
          0 ? (
            <div
              style={
                scheduleListStyle
              }
            >
              {selectedSchedules.map(
                (schedule) => (
                  <div
                    key={
                      schedule.id
                    }
                    style={
                      scheduleItemStyle
                    }
                  >
                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <strong
                        style={
                          scheduleTitleStyle
                        }
                      >
                        {
                          schedule.title
                        }
                      </strong>

                      {schedule.repeat !== "none" && (
  <p style={repeatLabelStyle}>
    {schedule.repeat === "weekly" &&
      `毎週 ${
        schedule.weekdays
          ?.map((weekday) => WEEKDAYS[weekday])
          .join("・")
      }曜日`}

    {schedule.repeat === "monthly" &&
      `毎月 ${Number(schedule.date.slice(8, 10))}日`}

    {schedule.repeat === "yearly" &&
      `毎年 ${Number(schedule.date.slice(5, 7))}月${Number(
        schedule.date.slice(8, 10)
      )}日`}
  </p>
)}

                      {schedule.memo && (
                        <p
                          style={
                            scheduleMemoStyle
                          }
                        >
                          {
                            schedule.memo
                          }
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeSchedule(
                          schedule.id
                        )
                      }
                      style={
                        deleteButtonStyle
                      }
                    >
                      削除
                    </button>
                  </div>
                )
              )}
            </div>
          ) : (
            <p
              style={
                emptyTextStyle
              }
            >
              この日の予定はありません
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: 20,
  background: "#f5f6f7",
};

const containerStyle: CSSProperties = {
  width: "min(720px, 100%)",
  margin: "0 auto",
  padding: 20,
  boxSizing: "border-box",
  borderRadius: 20,
  background: "#fff",
};

const dayNumberStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 24,
  minHeight: 24,
  fontSize: 15,
};

const todayNumberStyle: CSSProperties = {
  minWidth: 31,
  minHeight: 31,
  borderRadius: 999,
  background: "#4f7c5b",
  color: "#fff",
  fontSize: 19,
  fontWeight: 800,
};

const scheduleIconStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: 16,
  transform: "translateX(-50%)",
  fontSize: 14,
  lineHeight: 1,
};

const scheduleCountStyle: CSSProperties = {
  position: "absolute",
  top: 3,
  right: 3,
  minWidth: 17,
  height: 17,
  padding: "0 4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  background: "#4f7c5b",
  color: "#fff",
  fontSize: 10,
  fontWeight: 800,
  lineHeight: 1,
  boxSizing: "border-box",
};

const backButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #cad8cf",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const titleStyle: CSSProperties = {
  margin: "24px 0",
  textAlign: "center",
};

const monthNavigationStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "48px 1fr 48px",
  alignItems: "center",
  gap: 8,
  marginBottom: 16,
};

const monthButtonStyle: CSSProperties = {
  height: 44,
  border: "1px solid #cad8cf",
  borderRadius: 12,
  background: "#fff",
  cursor: "pointer",
};

const monthLabelStyle: CSSProperties = {
  textAlign: "center",
  fontSize: 20,
};

const calendarStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(7, minmax(0, 1fr))",
  gap: 6,
};

const weekdayStyle: CSSProperties = {
  padding: "8px 0",
  textAlign: "center",
  color: "#78817c",
  fontWeight: 700,
};

const emptyDayStyle: CSSProperties = {
  aspectRatio: "1 / 1",
};

const dayButtonStyle: CSSProperties = {
  position: "relative",
  aspectRatio: "1 / 1",
  padding: 4,
  border: "1px solid #dce7df",
  borderRadius: 12,
  background: "#fff",
  cursor: "pointer",
  fontSize: 15,
};

const selectedDayStyle: CSSProperties = {
  border: "2px solid #4f7c5b",
  background: "#e9f2ec",
  color: "#3f6849",
  fontWeight: 800,
};

const todayDayStyle: CSSProperties = {
  boxShadow:
    "inset 0 0 0 1px #4f7c5b",
};

const scheduleSectionStyle: CSSProperties =
  {
    marginTop: 24,
    paddingTop: 20,
    borderTop:
      "1px solid #e2ebe5",
  };

const sectionTitleStyle: CSSProperties = {
  margin: "0 0 16px",
  fontSize: 19,
};

const formStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  border: "1px solid #cad8cf",
  borderRadius: 12,
  fontSize: 16,
  background: "#fff",
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
};

const weekdaySelectStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(7, 1fr)",
  gap: 6,
};

const weekdayButtonStyle: CSSProperties = {
  minHeight: 40,
  border: "1px solid #cad8cf",
  borderRadius: 10,
  background: "#fff",
  color: "#66706a",
  cursor: "pointer",
  fontWeight: 700,
};

const weekdayButtonSelectedStyle: CSSProperties =
  {
    border: "1px solid #4f7c5b",
    background: "#e9f2ec",
    color: "#3f6849",
  };

const addButtonStyle: CSSProperties = {
  padding: "12px 16px",
  border: "none",
  borderRadius: 12,
  background: "#4f7c5b",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const scheduleListStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  marginTop: 18,
};

const scheduleItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  padding: 14,
  border: "1px solid #dce7df",
  borderRadius: 14,
  background: "#f7faf8",
};

const scheduleTitleStyle: CSSProperties = {
  display: "block",
  overflowWrap: "anywhere",
};

const repeatLabelStyle: CSSProperties = {
  margin: "5px 0 0",
  color: "#4f7c5b",
  fontSize: 13,
  fontWeight: 700,
};

const scheduleMemoStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "#66706a",
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
};

const deleteButtonStyle: CSSProperties = {
  flexShrink: 0,
  padding: "7px 10px",
  border: "none",
  borderRadius: 9,
  background: "#fff0f0",
  color: "#c33",
  cursor: "pointer",
  fontWeight: 700,
};

const emptyTextStyle: CSSProperties = {
  margin: "18px 0 0",
  textAlign: "center",
  color: "#78817c",
};
const holidayDayStyle: CSSProperties = {
  background: "#fff5f5",
};

const holidayNameStyle: CSSProperties = {
  position: "absolute",
  left: 2,
  right: 2,
  bottom: 3,
  color: "#c44",
  fontSize: 8,
  fontWeight: 700,
  lineHeight: 1.1,
  textAlign: "center",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};