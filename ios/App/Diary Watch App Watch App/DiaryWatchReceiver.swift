import Foundation
import WatchConnectivity
import Combine

// --------------------
// Diary予定の通知段階
// --------------------

enum DiaryScheduleAlertStage:
    String
{
    case oneHour
    case thirtyMinutes
    case fifteenMinutes
}

// --------------------
// Diary予定通知
// --------------------

struct DiaryScheduleAlert {

    let scheduleId: String
    let title: String
    let stage:
        DiaryScheduleAlertStage

    var notificationId: String {
        "\(scheduleId)-\(stage.rawValue)"
    }

    var message: String {

        switch stage {

        case .oneHour:
            return
                "\(title)まで\nあと1時間だぞ"

        case .thirtyMinutes:
            return
                "\(title)まで\nあと30分だぞ"

        case .fifteenMinutes:
            return
                "\(title)まで\nあと15分。\nそろそろ準備しろ"
        }
    }
}

final class DiaryWatchReceiver:
    NSObject,
    ObservableObject,
    WCSessionDelegate
{
    @Published var schedules:
        [[String: Any]] = []

    @Published var temperature:
        Double? = nil

    @Published var weatherCode:
        Int? = nil

    @Published var precipitationProbability:
        Int? = nil

    override init() {
        super.init()

        guard
            WCSession.isSupported()
        else {
            print(
                "⌚ WatchConnectivity unsupported"
            )
            return
        }

        WCSession.default.delegate =
            self

        WCSession.default.activate()

        print(
            "⌚ DiaryWatchReceiver activated"
        )
    }

    func session(
        _ session: WCSession,
        activationDidCompleteWith
            activationState:
                WCSessionActivationState,
        error: Error?
    ) {
        if let error {
            print(
                "⌚ Watch activation error: \(error.localizedDescription)"
            )
            return
        }

        print(
            "⌚ Watch session activated: \(activationState.rawValue)"
        )

        readApplicationContext(
            session
                .receivedApplicationContext
        )
    }

    func session(
        _ session: WCSession,
        didReceiveMessage
            message: [String: Any]
    ) {
        print(
            "⌚ Diary message received"
        )

        readApplicationContext(
            message
        )
    }

    func session(
        _ session: WCSession,
        didReceiveApplicationContext
            applicationContext:
                [String: Any]
    ) {
        readApplicationContext(
            applicationContext
        )
    }

    private func readApplicationContext(
        _ context: [String: Any]
    ) {
        if let receivedSchedules =
            context["diarySchedules"]
                as? [[String: Any]]
        {
            DispatchQueue.main.async {

                self.schedules =
                    receivedSchedules

                print(
                    "⌚ Diary schedules received: \(receivedSchedules.count)"
                )
            }
        }

        if let weather =
            context["weather"]
                as? [String: Any]
        {
            let temperature =
                weather["temperature"]
                    as? Double

            let weatherCode =
                weather["weatherCode"]
                    as? Int

            let precipitation =
                weather[
                    "precipitationProbability"
                ] as? Int

            DispatchQueue.main.async {

                self.temperature =
                    temperature

                self.weatherCode =
                    weatherCode

                self.precipitationProbability =
                    precipitation

                print(
                    "⌚ Weather received: \(temperature ?? 0)℃ / code \(weatherCode ?? -1) / rain \(precipitation ?? -1)%"
                )
            }
        }
    }

    // --------------------
    // Diary予定チェック
    // --------------------

    func upcomingScheduleAlert()
        -> DiaryScheduleAlert?
    {
        let calendar =
            Calendar.current

        let now =
            Date()

        let dateFormatter =
            DateFormatter()

        dateFormatter.dateFormat =
            "yyyy-MM-dd"

        let timeFormatter =
            DateFormatter()

        timeFormatter.dateFormat =
            "yyyy-MM-dd HH:mm"

        let today =
            dateFormatter.string(
                from: now
            )

        for schedule in schedules {

            guard
                let id =
                    schedule["id"]
                        as? String,
                let date =
                    schedule["date"]
                        as? String,
                let startTime =
                    schedule["startTime"]
                        as? String,
                let title =
                    schedule["title"]
                        as? String,
                !startTime.isEmpty
            else {
                continue
            }

            guard
                date == today
            else {
                continue
            }

            guard
                let startDate =
                    timeFormatter.date(
                        from:
                            "\(date) \(startTime)"
                    )
            else {
                continue
            }

            let minutes =
                calendar
                    .dateComponents(
                        [.minute],
                        from: now,
                        to: startDate
                    )
                    .minute ?? -1

            print(
                "⌚ \(title)まで残り \(minutes) 分"
            )

            // --------------------
            // 15分前
            // 0〜20分
            // --------------------

            if minutes >= 0 &&
                minutes <= 20
            {
                return
                    DiaryScheduleAlert(
                        scheduleId: id,
                        title: title,
                        stage:
                            .fifteenMinutes
                    )
            }

            // --------------------
            // 30分前
            // 21〜45分
            // --------------------

            if minutes >= 21 &&
                minutes <= 45
            {
                return
                    DiaryScheduleAlert(
                        scheduleId: id,
                        title: title,
                        stage:
                            .thirtyMinutes
                    )
            }

            // --------------------
            // 1時間前
            // 46〜60分
            // --------------------

            if minutes >= 46 &&
                minutes <= 60
            {
                return
                    DiaryScheduleAlert(
                        scheduleId: id,
                        title: title,
                        stage:
                            .oneHour
                    )
            }
        }

        return nil
    }

    // --------------------
    // 天気コメント
    // --------------------

    func weatherMessage()
        -> String?
    {
        guard
            let temperature,
            let precipitationProbability
        else {
            return nil
        }

        if precipitationProbability >= 70 {

            return
                "雨降りそうだぞ。\n傘持ってけ"
        }

        if temperature >= 30 {

            return
                "今日は暑いぞ。\n水分忘れんな"
        }

        if temperature <= 10 {

            return
                "今日は寒いぞ。\n暖かくしてけ"
        }

        return nil
    }
}
