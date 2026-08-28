export type MofuMessageRoomId =
  | "living-kitchen"
  | "workroom"
  | "conditioning-room";

type MessageSchedule = {
  title: string;
  memo: string;
};

type GetMofuMessageParams = {
  roomId: MofuMessageRoomId;
  tapCount: number;
  todaySchedules: MessageSchedule[];
  tomorrowSchedules: MessageSchedule[];
};

const livingMessages = [
  "今日は予定なしか。たまにはのんびりするのも悪くないぞ🐾",
  "暇なら冷蔵庫でも覗いてこい。何かあるだろ🐾",
  "予定がない日くらい、好きに過ごせばいいんじゃないか？🐾",
  "何もない日も立派な予定だ。俺は寝るけどな🐾",
];

const workMessages = [
  "さて、今日はどれだけ積むつもりだ？🐾",
  "また作業か。好きだな、お前も🐾",
  "無理して倒れたら意味ないぞ🐾",
  "積むのはいいが、休むのも仕事だぞ🐾",
];

const getRandomMessage = (
  messages: string[]
) =>
  messages[
    Math.floor(
      Math.random() * messages.length
    )
  ];

const getTapMessage = (
  tapCount: number
) => {
  if (tapCount >= 50) {
    return "…………💢";
  }

  if (tapCount >= 30) {
    return "おい…。";
  }

  if (tapCount >= 20) {
    return "かまいすぎだ…";
  }

  if (tapCount >= 8) {
    return "触りすぎだ…";
  }

  if (tapCount >= 4) {
    return "なんだ？";
  }

  if (tapCount >= 1) {
    return "……ん？";
  }

  return null;
};

const formatScheduleTitles = (
  schedules: MessageSchedule[]
) => {
  const visible =
    schedules.slice(0, 2);

  const titles = visible
    .map(
      (schedule) =>
        `「${schedule.title}」`
    )
    .join("、");

  const remaining =
    schedules.length -
    visible.length;

  if (remaining > 0) {
    return `${titles}ほか${remaining}件`;
  }

  return titles;
};

export const getMofuMessage = ({
  roomId,
  tapCount,
  todaySchedules,
  tomorrowSchedules,
}: GetMofuMessageParams) => {
  const tapMessage =
    getTapMessage(tapCount);

  if (tapMessage) {
    return tapMessage;
  }

  if (roomId === "living-kitchen") {
    const todayText =
      todaySchedules
        .map(
          (schedule) =>
            `${schedule.title} ${schedule.memo}`
        )
        .join(" ");

    if (
      /誕生日|birthday/i.test(
        todayText
      )
    ) {
      return "今日は誕生日だね🎂 おめでとう！";
    }

    if (todaySchedules.length > 0) {
      return `今日は${formatScheduleTitles(
        todaySchedules
      )}の予定があるよ🐾`;
    }

    if (
      tomorrowSchedules.length > 0
    ) {
      return `明日は${formatScheduleTitles(
        tomorrowSchedules
      )}の予定があるよ🐾`;
    }

    return getRandomMessage(
      livingMessages
    );
  }

  if (roomId === "workroom") {
    return getRandomMessage(
      workMessages
    );
  }

  return "今日は何しようかな〜🐾";
};