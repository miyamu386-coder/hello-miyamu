import Foundation
import WatchConnectivity
import Combine
import UserNotifications

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
    
    @Published var weatherWarnings:
        [[String: String]] = []
    private let notificationCenter =
        UNUserNotificationCenter.current()

    private let notificationPrefix =
        "diary-mofu-"

    override init() {
        super.init()

        // --------------------
        // 通知許可
        // --------------------

        requestNotificationAuthorization()

        // --------------------
        // WatchConnectivity
        // --------------------

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

    // --------------------
    // 通知許可
    // --------------------

    private func requestNotificationAuthorization()
    {
        notificationCenter
            .requestAuthorization(
                options: [
                    .alert,
                    .sound
                ]
            ) {
                granted,
                error in

                if let error {
                    print(
                        "⌚ 通知許可エラー: \(error.localizedDescription)"
                    )
                    return
                }

                print(
                    "⌚ 通知許可: \(granted)"
                )
            }
    }

    // --------------------
    // WatchConnectivity
    // --------------------

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

    // --------------------
    // Diaryデータ受信
    // --------------------

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
                
                // --------------------
                // ローカル通知を予約
                // --------------------
                
                self.scheduleLocalNotifications(
                    for: receivedSchedules
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
        
        if let weatherWarningData =
            context["weatherWarnings"]
            as? [String: Any],
           let receivedWarnings =
            weatherWarningData["warnings"]
            as? [[String: String]]
        {
            DispatchQueue.main.async {
                
                self.weatherWarnings =
                receivedWarnings
                
                print(
                    "⚠️ Weather warnings received: \(receivedWarnings)"
                )
            }
        }   //
    }
    // --------------------
    // Diaryローカル通知予約
    // --------------------

    private func scheduleLocalNotifications(
        for schedules:
            [[String: Any]]
    ) {
        let center =
            notificationCenter

        // --------------------
        // 古いDiary通知だけ削除
        // --------------------

        center
            .getPendingNotificationRequests {
                [weak self]
                requests in

                guard let self else {
                    return
                }

                let oldIds =
                    requests
                        .map {
                            $0.identifier
                        }
                        .filter {
                            $0.hasPrefix(
                                self.notificationPrefix
                            )
                        }

                if !oldIds.isEmpty {

                    center
                        .removePendingNotificationRequests(
                            withIdentifiers:
                                oldIds
                        )

                    print(
                        "⌚ 古いDiary通知削除: \(oldIds.count)"
                    )
                }

                // --------------------
                // 最新予定を予約
                // --------------------

                self.addScheduleNotifications(
                    schedules
                )
            }
    }

    // --------------------
    // 各予定の通知を登録
    // --------------------

    private func addScheduleNotifications(
        _ schedules:
            [[String: Any]]
    ) {
        let calendar =
            Calendar.current

        let now =
            Date()

        let formatter =
            DateFormatter()

        formatter.locale =
            Locale(
                identifier:
                    "en_US_POSIX"
            )

        formatter.calendar =
            calendar

        formatter.dateFormat =
            "yyyy-MM-dd HH:mm"

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
                let startDate =
                    formatter.date(
                        from:
                            "\(date) \(startTime)"
                    )
            else {
                print(
                    "⌚ 通知日時変換失敗: \(title)"
                )

                continue
            }

            // --------------------
            // 1時間前
            // --------------------

            addLocalNotification(
                scheduleId: id,
                title: title,
                stage: .oneHour,
                fireDate:
                    calendar.date(
                        byAdding:
                            .minute,
                        value: -60,
                        to: startDate
                    ),
                now: now
            )

            // --------------------
            // 30分前
            // --------------------

            addLocalNotification(
                scheduleId: id,
                title: title,
                stage:
                    .thirtyMinutes,
                fireDate:
                    calendar.date(
                        byAdding:
                            .minute,
                        value: -30,
                        to: startDate
                    ),
                now: now
            )

            // --------------------
            // 15分前
            // --------------------

            addLocalNotification(
                scheduleId: id,
                title: title,
                stage:
                    .fifteenMinutes,
                fireDate:
                    calendar.date(
                        byAdding:
                            .minute,
                        value: -15,
                        to: startDate
                    ),
                now: now
            )
        }
    }

    // --------------------
    // 1件の通知を予約
    // --------------------

    private func addLocalNotification(
        scheduleId: String,
        title: String,
        stage:
            DiaryScheduleAlertStage,
        fireDate: Date?,
        now: Date
    ) {
        guard
            let fireDate
        else {
            return
        }

        // 過去の通知は予約しない
        guard
            fireDate > now
        else {
            return
        }

        let alert =
            DiaryScheduleAlert(
                scheduleId:
                    scheduleId,
                title:
                    title,
                stage:
                    stage
            )

        let content =
            UNMutableNotificationContent()

        content.title =
            "秘書もふ"

        content.body =
            alert.message
                .replacingOccurrences(
                    of: "\n",
                    with: " "
                )

        content.sound =
            .default

        let dateComponents =
            Calendar.current
                .dateComponents(
                    [
                        .year,
                        .month,
                        .day,
                        .hour,
                        .minute
                    ],
                    from:
                        fireDate
                )

        let trigger =
            UNCalendarNotificationTrigger(
                dateMatching:
                    dateComponents,
                repeats: false
            )

        let identifier =
            notificationPrefix
            + alert.notificationId

        let request =
            UNNotificationRequest(
                identifier:
                    identifier,
                content:
                    content,
                trigger:
                    trigger
            )

        notificationCenter
            .add(request) {
                error in

                if let error {

                    print(
                        "⌚ 通知予約失敗: \(title) / \(stage.rawValue) / \(error.localizedDescription)"
                    )

                    return
                }

                let logFormatter =
                    DateFormatter()

                logFormatter
                    .dateFormat =
                        "yyyy-MM-dd HH:mm"

                print(
                    "⌚ 通知予約成功: \(title) / \(stage.rawValue) / \(logFormatter.string(from: fireDate))"
                )
            }
    }

    // --------------------
    // 予約済み通知確認
    // --------------------

    private func printPendingNotifications()
    {
        notificationCenter
            .getPendingNotificationRequests {
                [weak self]
                requests in

                guard let self else {
                    return
                }

                let diaryRequests =
                    requests.filter {
                        $0.identifier.hasPrefix(
                            self.notificationPrefix
                        )
                    }

                print(
                    "⌚ ===== Diary pending通知 ====="
                )

                print(
                    "⌚ pending件数: \(diaryRequests.count)"
                )

                for request in diaryRequests {

                    print(
                        "⌚ pending ID: \(request.identifier)"
                    )

                    print(
                        "⌚ pending本文: \(request.content.body)"
                    )

                    if let trigger =
                        request.trigger
                            as? UNCalendarNotificationTrigger
                    {
                        print(
                            "⌚ pending次回発火: \(String(describing: trigger.nextTriggerDate()))"
                        )
                    }
                }

                print(
                    "⌚ ============================"
                )
            }
    }

    // --------------------
    // Diary予定チェック
    // フォアグラウンド用
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
    // 指定したDiary予定が
    // 開始時刻を迎えたか
    // --------------------

    func hasScheduleStarted(
        scheduleId: String
    ) -> Bool {

        let now = Date()

        let formatter =
            DateFormatter()

        formatter.locale =
            Locale(
                identifier:
                    "en_US_POSIX"
            )

        formatter.dateFormat =
            "yyyy-MM-dd HH:mm"

        for schedule in schedules {

            guard
                let id =
                    schedule["id"]
                        as? String,
                id == scheduleId,
                let date =
                    schedule["date"]
                        as? String,
                let startTime =
                    schedule["startTime"]
                        as? String,
                !startTime.isEmpty
            else {
                continue
            }

            guard
                let startDate =
                    formatter.date(
                        from:
                            "\(date) \(startTime)"
                    )
            else {
                return false
            }

            return now >= startDate
        }

        return false
    }
    
    // --------------------
    // タップ用
    // 次のDiary予定
    // --------------------

    func nextDiaryScheduleMessage()
        -> String?
    {
        let now =
            Date()

        let dateFormatter =
            DateFormatter()

        dateFormatter.locale =
            Locale(
                identifier:
                    "en_US_POSIX"
            )

        dateFormatter.dateFormat =
            "yyyy-MM-dd"

        let timeFormatter =
            DateFormatter()

        timeFormatter.locale =
            Locale(
                identifier:
                    "en_US_POSIX"
            )

        timeFormatter.dateFormat =
            "yyyy-MM-dd HH:mm"

        let today =
            dateFormatter.string(
                from: now
            )

        var nextSchedule:
            (
                date: Date,
                title: String,
                startTime: String
            )? = nil

        for schedule in schedules {

            guard
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

            // 今日の予定だけ
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

            // すでに始まった予定は除外
            guard
                startDate > now
            else {
                continue
            }

            // 一番近い予定を保存
            if nextSchedule == nil
                || startDate <
                    nextSchedule!.date
            {
                nextSchedule =
                    (
                        date:
                            startDate,
                        title:
                            title,
                        startTime:
                            startTime
                    )
            }
        }

        guard
            let nextSchedule
        else {
            return nil
        }

        return
            "次は\(nextSchedule.startTime)から\n\(nextSchedule.title)だぞ"
    }
    
    // --------------------
    // 15分前通知か判定
    // --------------------

    func isFifteenMinuteNotification(
        _ notificationId: String
    ) -> Bool {

        return notificationId.hasSuffix(
            "-\(DiaryScheduleAlertStage.fifteenMinutes.rawValue)"
        )
    }
    // --------------------
    // 通知IDから予定IDを取得
    // --------------------

    func scheduleIdFromNotification(
        _ notificationId: String
    ) -> String? {

        let prefix = "diary-mofu-"

        guard
            notificationId.hasPrefix(prefix)
        else {
            return nil
        }

        let value =
            String(
                notificationId.dropFirst(
                    prefix.count
                )
            )

        let suffix =
            "-\(DiaryScheduleAlertStage.fifteenMinutes.rawValue)"

        guard
            value.hasSuffix(suffix)
        else {
            return nil
        }

        return String(
            value.dropLast(
                suffix.count
            )
        )
    }
    // --------------------
    // 配信済みDiary通知
    // モフの報告用
    // --------------------

    func latestDeliveredDiaryNotification(
        completion:
            @escaping (
                String?,
                String?
            ) -> Void
    ) {
        notificationCenter
            .getDeliveredNotifications {
                [weak self]
                notifications in
                print(
                    "⌚ 配信済み通知の取得件数: \(notifications.count)"
                )
                guard let self else {

                    DispatchQueue.main.async {
                        completion(
                            nil,
                            nil
                        )
                    }

                    return
                }

                let diaryNotifications =
                    notifications
                        .filter {
                            $0.request
                                .identifier
                                .hasPrefix(
                                    self.notificationPrefix
                                )
                        }
                        .sorted {
                            $0.date > $1.date
                        }

                guard
                    let latest =
                        diaryNotifications.first
                else {

                    DispatchQueue.main.async {
                        completion(
                            nil,
                            nil
                        )
                    }

                    return
                }

                let notificationId =
                    latest.request
                        .identifier

                let body =
                    latest.request
                        .content
                        .body

                DispatchQueue.main.async {

                    completion(
                        "さっき知らせたぞ。\n\(body)",
                        notificationId
                    )
                }
            }
    }
    
    // --------------------
    // 天気コメント
    // --------------------

    func weatherMessage()
        -> String?
    {
        // --------------------
        // 警報・注意報を最優先
        // --------------------

        if let warning =
            weatherWarnings.first,
           let name =
            warning["name"]
        {
            if name.contains(
                "特別警報"
            ) {
                return
                    "\(name)だぞ。\n安全を最優先にしろ"
            }

            if name.contains(
                "警報"
            ) {
                return
                    "\(name)出てるぞ。\n十分気をつけろ"
            }

            if name.contains(
                "注意報"
            ) {
                return
                    "\(name)出てるぞ。\n気をつけてけよ"
            }
        }

        guard
            let temperature,
            let precipitationProbability
        else {
            return nil
        }

        if precipitationProbability == 100 {

            return
                "雨だぞ。\n傘持ってけよ"
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
