//
//  ContentView.swift
//  Diary Watch App Watch App
//

import SwiftUI
import Combine
import WatchKit

struct ContentView: View {

    @StateObject private var healthKit =
        HealthKitManager()

    @StateObject private var calendarManager =
        CalendarManager()

    @StateObject private var diaryWatch =
        DiaryWatchReceiver()

    @State private var walkFrameIndex = 0
    @State private var mofuX: CGFloat = -45
    @State private var movingRight = true

    @State private var isSleeping = false
    @State private var elapsedTime: Double = 0

    @State private var healthMessage: String? = nil

    @State private var isConcerned = false
    @State private var isSleepDeprived = false
    @State private var isYawning = false
    @State private var isJumping = false

    // 通知済みのDiary予定段階を記録
    @State private var notifiedDiaryAlertIds:
        Set<String> = []

    // 同じ天気コメントを何度も通知しない
    @State private var lastWeatherNotificationMessage:
        String? = nil

    // false = 歩数
    // true = Appleカレンダー予定
    @State private var showScheduleNext = false

    private let walkFrames = [
        "watch-mofu-walk-1",
        "watch-mofu-walk-2",
        "watch-mofu-walk-3",
        "watch-mofu-walk-2"
    ]

    var body: some View {

        ZStack {

            Image("watch-living-room")
                .resizable()
                .scaledToFill()
                .ignoresSafeArea()

            if isSleeping {

                Image("watch-mofu-sleep")
                    .resizable()
                    .scaledToFit()
                    .frame(
                        width: 80,
                        height: 80
                    )
                    .offset(
                        x: 10,
                        y: 35
                    )

            } else if isConcerned {

                Image("watch-mofu-concerned")
                    .resizable()
                    .scaledToFit()
                    .frame(
                        width: 80,
                        height: 80
                    )
                    .offset(
                        x: 0,
                        y: 35
                    )

            } else if isSleepDeprived {

                Image("watch-mofu-sleepy-angry")
                    .resizable()
                    .scaledToFit()
                    .frame(
                        width: 80,
                        height: 80
                    )
                    .offset(
                        x: 0,
                        y: 35
                    )

            } else if isYawning {

                Image("watch-mofu-yawn")
                    .resizable()
                    .scaledToFit()
                    .frame(
                        width: 80,
                        height: 80
                    )
                    .offset(
                        x: 0,
                        y: 35
                    )

            } else {

                Image(
                    walkFrames[
                        walkFrameIndex
                    ]
                )
                .resizable()
                .scaledToFit()
                .frame(
                    width: 65,
                    height: 65
                )
                .scaleEffect(
                    x: movingRight ? -1 : 1,
                    y: 1
                )
                .offset(
                    x: mofuX,
                    y: isJumping
                        ? 15
                        : 35
                )
                .animation(
                    .spring(
                        response: 0.25,
                        dampingFraction: 0.45
                    ),
                    value: isJumping
                )
                .onTapGesture {

                    // --------------------
                    // タップリアクション
                    // --------------------

                    isJumping = true

                    DispatchQueue.main
                        .asyncAfter(
                            deadline:
                                .now() + 0.25
                        ) {
                            isJumping = false
                        }

                    // --------------------
                    // Appleカレンダー予定
                    // --------------------

                    if showScheduleNext {

                        healthMessage =
                            calendarManager
                                .scheduleMessage()

                    // --------------------
                    // 歩数
                    // --------------------

                    } else {

                        let steps =
                            healthKit.stepCount

                        if steps < 3000 {

                            healthMessage =
                                "今日は \(steps) 歩。\nまだ動けるだろ？"

                        } else if steps < 8000 {

                            healthMessage =
                                "今日は \(steps) 歩。\nまあまあだな"

                        } else if steps < 10000 {

                            healthMessage =
                                "今日は \(steps) 歩。\n結構歩いたじゃん"

                        } else {

                            healthMessage =
                                "今日は \(steps) 歩。\n1万歩超え。やるじゃん"
                        }
                    }

                    showScheduleNext.toggle()

                    DispatchQueue.main
                        .asyncAfter(
                            deadline:
                                .now() + 4
                        ) {
                            healthMessage = nil
                        }
                }
            }

            if let healthMessage {

                Text(healthMessage)
                    .font(.caption2)
                    .multilineTextAlignment(
                        .center
                    )
                    .padding(6)
                    .background(
                        .black.opacity(0.65)
                    )
                    .clipShape(
                        RoundedRectangle(
                            cornerRadius: 8
                        )
                    )
                    .padding(
                        .horizontal,
                        8
                    )
                    .offset(y: -45)
            }
        }

        // --------------------
        // 起動処理
        // --------------------

        .task {

            print(
                "ContentView task started"
            )

            // --------------------
            // Diary予定・天気
            // 起動直後チェック
            // --------------------

            DispatchQueue.main
                .asyncAfter(
                    deadline:
                        .now() + 2
                ) {

                    print(
                        "⌚ 起動時Diary予定チェック"
                    )

                    // --------------------
                    // Diary予定を最優先
                    // --------------------

                    if let alert =
                        diaryWatch
                            .upcomingScheduleAlert()
                    {
                        handleDiaryAlert(
                            alert
                        )

                        return
                    }

                    // --------------------
                    // 予定がなければ天気
                    // --------------------

                    print(
                        "⌚ 起動時天気チェック"
                    )

                    if let message =
                        diaryWatch
                            .weatherMessage()
                    {
                        lastWeatherNotificationMessage =
                            message

                        print(
                            "⌚ 天気お知らせ: \(message)"
                        )

                        showMofuNotification(
                            message
                        )
                    }
                }

            // --------------------
            // HealthKit
            // --------------------

            await healthKit
                .requestAuthorization()

            await healthKit
                .fetchTodaySteps()

            await healthKit
                .fetchLatestHeartRate()

            await healthKit
                .fetchSleep()

            // --------------------
            // Apple Calendar
            // --------------------

            await calendarManager
                .requestAuthorization()

            calendarManager
                .fetchTodayEvents()

            // --------------------
            // 睡眠リアクション
            // --------------------

            let sleepHours =
                healthKit.sleepHours

            if sleepHours < 3 {

                isSleepDeprived = true
                isYawning = false

                healthMessage =
                    "……寝てないだろ。"

            } else if sleepHours < 5 {

                isSleepDeprived = true
                isYawning = false

                healthMessage =
                    "寝不足。今日は無理すんな。"

            } else if sleepHours < 6 {

                isSleepDeprived = false
                isYawning = true

                healthMessage =
                    "ふぁ〜……もうちょい寝たかったな"

            } else if sleepHours < 8 {

                isSleepDeprived = false
                isYawning = false

                healthMessage =
                    "まあ、悪くない"

            } else {

                isSleepDeprived = false
                isYawning = false

                healthMessage =
                    "よく寝たじゃん"
            }

            if healthMessage != nil {

                DispatchQueue.main
                    .asyncAfter(
                        deadline:
                            .now() + 5
                    ) {

                        healthMessage = nil
                        isSleepDeprived =
                            false
                        isYawning = false
                    }
            }
        }

        // --------------------
        // 心拍リアクション
        // --------------------

        .onChange(
            of: healthKit.heartRate
        ) { _, newHeartRate in

            if newHeartRate >= 110 {

                isConcerned = true

                healthMessage =
                    "おい、ちょっと深呼吸しろ"

                DispatchQueue.main
                    .asyncAfter(
                        deadline:
                            .now() + 5
                    ) {

                        healthMessage = nil
                        isConcerned = false
                    }
            }
        }

        // --------------------
        // 心拍更新
        // --------------------

        .onReceive(
            Timer.publish(
                every: 30,
                on: .main,
                in: .common
            )
            .autoconnect()
        ) { _ in

            Task {
                await healthKit
                    .fetchLatestHeartRate()
            }
        }

        // --------------------
        // 歩数更新
        // --------------------

        .onReceive(
            Timer.publish(
                every: 30,
                on: .main,
                in: .common
            )
            .autoconnect()
        ) { _ in

            Task {
                await healthKit
                    .fetchTodaySteps()
            }
        }

        // --------------------
        // 睡眠更新
        // --------------------

        .onReceive(
            Timer.publish(
                every: 600,
                on: .main,
                in: .common
            )
            .autoconnect()
        ) { _ in

            Task {
                await healthKit
                    .fetchSleep()
            }
        }

        // --------------------
        // Appleカレンダー予定更新
        // --------------------

        .onReceive(
            Timer.publish(
                every: 60,
                on: .main,
                in: .common
            )
            .autoconnect()
        ) { _ in

            calendarManager
                .fetchTodayEvents()
        }

        // --------------------
        // Diary予定 自動お知らせ
        // --------------------

        .onReceive(
            Timer.publish(
                every: 30,
                on: .main,
                in: .common
            )
            .autoconnect()
        ) { _ in

            guard
                let alert =
                    diaryWatch
                        .upcomingScheduleAlert()
            else {
                return
            }

            handleDiaryAlert(
                alert
            )
        }

        // --------------------
        // 天気 自動お知らせ
        // --------------------

        .onReceive(
            Timer.publish(
                every: 60,
                on: .main,
                in: .common
            )
            .autoconnect()
        ) { _ in

            // 1時間以内にDiary予定があるなら
            // 天気より予定を優先
            if diaryWatch
                .upcomingScheduleAlert()
                != nil
            {
                return
            }

            guard
                let message =
                    diaryWatch
                        .weatherMessage()
            else {
                return
            }

            guard
                message !=
                    lastWeatherNotificationMessage
            else {
                return
            }

            lastWeatherNotificationMessage =
                message

            print(
                "⌚ 天気お知らせ: \(message)"
            )

            showMofuNotification(
                message
            )
        }

        // --------------------
        // モフ歩行
        // --------------------

        .onReceive(
            Timer.publish(
                every: 0.18,
                on: .main,
                in: .common
            )
            .autoconnect()
        ) { _ in

            if isConcerned
                || isSleepDeprived
                || isYawning
            {
                return
            }

            elapsedTime += 0.18

            if isSleeping {

                if elapsedTime >= 10 {

                    isSleeping = false
                    elapsedTime = 0

                    mofuX = -45
                    movingRight = true
                }

                return
            }

            walkFrameIndex =
                (
                    walkFrameIndex + 1
                )
                % walkFrames.count

            if movingRight {

                mofuX += 3

                if mofuX >= 45 {

                    mofuX = 45
                    movingRight = false
                }

            } else {

                mofuX -= 3

                if mofuX <= -45 {

                    mofuX = -45
                    movingRight = true
                }
            }

            if elapsedTime >= 20 {

                isSleeping = true
                elapsedTime = 0
            }
        }
    }

    // --------------------
    // Diary予定通知
    // --------------------

    private func handleDiaryAlert(
        _ alert: DiaryScheduleAlert
    ) {
        // この予定のこの段階は
        // すでに通知済みなら何もしない
        guard
            !notifiedDiaryAlertIds
                .contains(
                    alert.notificationId
                )
        else {
            return
        }

        notifiedDiaryAlertIds
            .insert(
                alert.notificationId
            )

        print(
            "⌚ Diary予定お知らせ: \(alert.message)"
        )

        print(
            "⌚ Diary通知段階: \(alert.stage.rawValue)"
        )

        // モフを起こす
        isSleeping = false
        elapsedTime = 0

        // モフがぴょん
        isJumping = true

        // セリフ
        healthMessage =
            alert.message

        DispatchQueue.main
            .asyncAfter(
                deadline:
                    .now() + 0.25
            ) {
                isJumping = false
            }

        // --------------------
        // 段階別ハプティック
        // --------------------

        switch alert.stage {

        case .oneHour:

            // 1時間前
            // 軽く1回
            WKInterfaceDevice
                .current()
                .play(.click)

        case .thirtyMinutes:

            // 30分前
            // 通知らしい1回
            WKInterfaceDevice
                .current()
                .play(.notification)

        case .fifteenMinutes:

            // 15分前
            // 強調して2回
            WKInterfaceDevice
                .current()
                .play(.notification)

            DispatchQueue.main
                .asyncAfter(
                    deadline:
                        .now() + 0.45
                ) {
                    WKInterfaceDevice
                        .current()
                        .play(
                            .notification
                        )
                }
        }

        // 5秒後にセリフを消す
        DispatchQueue.main
            .asyncAfter(
                deadline:
                    .now() + 5
            ) {

                if healthMessage ==
                    alert.message
                {
                    healthMessage = nil
                }
            }
    }

    // --------------------
    // モフ共通通知
    // 天気などで使用
    // --------------------

    private func showMofuNotification(
        _ message: String
    ) {
        // モフを起こす
        isSleeping = false
        elapsedTime = 0

        // モフがぴょん
        isJumping = true

        // セリフ
        healthMessage = message

        // 通常ハプティック
        WKInterfaceDevice
            .current()
            .play(.notification)

        DispatchQueue.main
            .asyncAfter(
                deadline:
                    .now() + 0.25
            ) {
                isJumping = false
            }

        // 5秒後にセリフを消す
        DispatchQueue.main
            .asyncAfter(
                deadline:
                    .now() + 5
            ) {

                if healthMessage ==
                    message
                {
                    healthMessage = nil
                }
            }
    }
}

#Preview {
    ContentView()
}
