import Foundation
import EventKit
import Combine

@MainActor
final class CalendarManager: ObservableObject {

    private let eventStore = EKEventStore()

    @Published var todayEvents: [EKEvent] = []

    func requestAuthorization() async {

        do {
            try await eventStore.requestFullAccessToEvents()
        } catch {
            print(
                "Calendar authorization error:",
                error
            )
        }
    }

    func fetchTodayEvents() {

        let calendar = Calendar.current
        let now = Date()

        let startOfDay =
            calendar.startOfDay(for: now)

        guard let endOfDay =
                calendar.date(
                    byAdding: .day,
                    value: 1,
                    to: startOfDay
                )
        else {
            return
        }

        let predicate =
            eventStore.predicateForEvents(
                withStart: startOfDay,
                end: endOfDay,
                calendars: nil
            )

        todayEvents =
            eventStore.events(
                matching: predicate
            )
            .sorted {
                $0.startDate < $1.startDate
            }

        print(
            "今日の予定:",
            todayEvents.count,
            "件"
        )
    }

    // MARK: - モフ用予定メッセージ

    func scheduleMessage() -> String {

        let now = Date()

        // まだ終わっていない予定を探す
        guard let event =
                todayEvents.first(
                    where: {
                        $0.endDate > now
                    }
                )
        else {
            if todayEvents.isEmpty {
                return "今日は予定なし。\n自由だな"
            } else {
                return "今日の予定は\nもう終わりだな"
            }
        }

        let title =
            event.title ?? "予定"

        let formatter = DateFormatter()
        formatter.locale =
            Locale(identifier: "ja_JP")
        formatter.timeZone =
            TimeZone.current
        formatter.dateFormat = "HH:mm"

        let time =
            formatter.string(
                from: event.startDate
            )

        let minutes =
            Int(
                event.startDate
                    .timeIntervalSince(now)
                / 60
            )

        // すでに開始している
        if minutes <= 0 {

            return "\(title)の時間だぞ"
        }

        // 30分以内
        if minutes <= 30 {

            return "もうすぐ\n\(title)だぞ"
        }

        // 2時間以内
        if minutes <= 120 {

            let hours =
                minutes / 60

            let remainingMinutes =
                minutes % 60

            if hours > 0
                && remainingMinutes > 0 {

                return "あと\(hours)時間\(remainingMinutes)分で\n\(title)だぞ"

            } else if hours > 0 {

                return "あと\(hours)時間で\n\(title)だぞ"

            } else {

                return "あと\(minutes)分で\n\(title)だぞ"
            }
        }

        // 2時間以上前
        return "今日は\(time)から\n\(title)だぞ"
    }
}
