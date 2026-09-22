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
    @State private var isReportingNotification = false
    @State private var rewardStage = 0
    @State private var isRewardAvailable = false
    @State private var didCompleteFifteenMinuteAlert = false
    @State private var rewardScheduleId: String? = nil
    // 最後にご褒美を受け取った予定ID
    @State private var lastRewardedScheduleId: String? =
        UserDefaults.standard.string(
            forKey: "lastRewardedScheduleId"
        )
    // 通知済みのDiary予定段階を記録
    @State private var notifiedDiaryAlertIds:
        Set<String> = []

    // 同じ天気コメントを何度も通知しない
    @State private var lastWeatherNotificationMessage:
        String? = nil
    
    // 同じ気象警報を何度も通知しない
    @State private var lastWeatherWarningKey:
        String? = nil
    
    // 最後にモフが報告した
    // 配信済みDiary通知ID
    @State private var lastReportedDiaryNotificationId:
        String? =
            UserDefaults.standard.string(
                forKey:
                    "lastReportedDiaryNotificationId"
            )

    // 起動時に配信済みDiary通知を
    // モフが報告したか
    @State private var didReportDeliveredDiaryNotification =
        false

    // false = 歩数
    // true = Diary予定
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

            // --------------------
            // モフ表示
            // --------------------
            

            if rewardStage == 1 {

                Image("watch-chocolat-supply")
                    .resizable()
                    .scaledToFit()
                    .frame(
                        width: 90,
                        height: 90
                    )
                    .offset(
                        x: 0,
                        y: 30
                    )

            } else if rewardStage == 2 {

                Image("watch-mofu-reward-time")
                    .resizable()
                    .scaledToFit()
                    .frame(
                        width: 120,
                        height: 90
                    )
                    .offset(
                        x: 0,
                        y: 30
                    )

            } else if isReportingNotification {

                // 事後報告中は
                // 腕組みモフを最優先
                Image("watch-mofu-arms-crossed")
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

            } else if isSleeping {

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
                    // Diary予定
                    // --------------------

                    if showScheduleNext {

                        if let diaryMessage =
                            diaryWatch
                                .nextDiaryScheduleMessage()
                        {
                            healthMessage =
                                diaryMessage

                        } else {

                            healthMessage =
                                "Diaryの予定は\nもうないぞ"
                        }

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

                            // 事後報告中なら
                            // タップ側から消さない
                            guard
                                !isReportingNotification
                            else {
                                return
                            }
                            
                            

                            healthMessage = nil
                            
                        }
                }
            }
            // --------------------
            // ツナ缶ご褒美ボタン
            // --------------------

            if isRewardAvailable && rewardStage == 0
            {

                Button {

                    rewardStage = 1
                    healthMessage = "ショコラ！それ…ツナ缶か！"
                    DispatchQueue.main
                        .asyncAfter(
                            deadline:
                                .now() + 5
                        )
                    {

                            rewardStage = 2
                            healthMessage = nil
                            DispatchQueue.main
                                .asyncAfter(
                                    deadline:
                                        .now() + 5
                                )
                        {
                            rewardStage = 0
                            isRewardAvailable = false
                            
                            //
                            // --------------------
                            // 今回の予定は
                            // ご褒美受取済みとして保存
                            // --------------------

                            if let completedScheduleId =
                                rewardScheduleId
                            {
                                lastRewardedScheduleId =
                                    completedScheduleId

                                UserDefaults.standard.set(
                                    completedScheduleId,
                                    forKey: "lastRewardedScheduleId"
                                )

                                print(
                                    "🥫 ご褒美受取済み: \(completedScheduleId)"
                                )
                            }

                            // --------------------
                            // 今回のご褒美処理を完了
                            // --------------------

                            didCompleteFifteenMinuteAlert = false
                            rewardScheduleId = nil
                            // --------------------
                            // 保存していた
                            // ご褒美対象も削除
                            // --------------------
                            
                            UserDefaults.standard.removeObject(
                                forKey: "rewardScheduleId"
                            )
                            
                            print(
                                "🥫 ご褒美完了"
                            )
                        }
                    }

                } label:
                {
                    Text("🥫 ご褒美")
                        .font(.caption2)
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.mini)
                .offset(y: 70)
            }
            // --------------------
            // モフのセリフ
            // --------------------

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
            // 保存済みのご褒美対象を復元
            // --------------------

            if let savedRewardScheduleId =
                UserDefaults.standard.string(
                    forKey: "rewardScheduleId"
                )
            {
                rewardScheduleId =
                    savedRewardScheduleId

                didCompleteFifteenMinuteAlert =
                    true

                print(
                    "🥫 ご褒美対象を復元: \(savedRewardScheduleId)"
                )
            }
            // --------------------
            // 閉じている間に届いた
            // Diary通知をモフが報告
            // --------------------

            diaryWatch
                .latestDeliveredDiaryNotification {
                    message,
                    notificationId in

                    guard
                        let message,
                        let notificationId
                    else {
                        return
                    }

                    guard
                        notificationId !=
                            lastReportedDiaryNotificationId
                    else {
                        return
                    }

                    lastReportedDiaryNotificationId =
                        notificationId

                    didReportDeliveredDiaryNotification =
                        true

                    UserDefaults.standard.set(
                        notificationId,
                        forKey:
                            "lastReportedDiaryNotificationId"
                    )

                    print(
                        "⌚ 未報告Diary通知あり: \(notificationId)"
                    )
                    
                    

                    // --------------------
                    // 他の表情を解除して
                    // 腕組み事後報告モフへ
                    // --------------------

                    isSleeping = false
                    isSleepDeprived = false
                    isYawning = false
                    isConcerned = false

                    isReportingNotification = true

                    // --------------------
                    // 15分前通知なら
                    // ご褒美を解放
                    // --------------------

                    if diaryWatch
                        .isFifteenMinuteNotification(
                            notificationId
                        )
                    {
                        let notificationScheduleId =
                            diaryWatch
                                .scheduleIdFromNotification(
                                    notificationId
                                )

                        if notificationScheduleId !=
                            lastRewardedScheduleId
                        {
                            rewardScheduleId =
                                notificationScheduleId

                            isRewardAvailable = true

                            print(
                                "🥫 15分前通知のお仕事完了・ご褒美解放"
                            )

                        } else {

                            print(
                                "🥫 この予定はご褒美受取済み"
                            )
                        }
                    }

                    print("😼 腕組みモフ ON")
                    showMofuNotification(
                        message,
                        duration: 10
                    )

                    DispatchQueue.main
                        .asyncAfter(
                            deadline:
                                .now() + 10
                        ) {

                            isReportingNotification =
                                false

                            print("😼 腕組みモフ OFF")
                        }
                }

            // --------------------
            // Diary予定・天気
            // 起動直後チェック
            // --------------------

            DispatchQueue.main
                .asyncAfter(
                    deadline:
                        .now() + 2
                ) {

                                
                    // --------------------
                    // 気象警報を最優先
                    // --------------------

                    if let warning =
                        currentWeatherWarning()
                    {
                        lastWeatherWarningKey =
                            warning.key

                        print(
                            "⚠️ 起動時気象警報: \(warning.message)"
                        )

                        isSleeping = false
                        isSleepDeprived = false
                        isYawning = false
                        isConcerned = false

                        isReportingNotification = true

                        showMofuNotification(
                            warning.message,
                            duration: 10
                        )

                        DispatchQueue.main
                            .asyncAfter(
                                deadline:
                                    .now() + 10
                            ) {

                                isReportingNotification =
                                    false
                            }

                        return
                    }
                    // --------------------
                    // 配信済みDiary通知を
                    // モフが報告した場合は
                    // 通常の起動時チェックを重ねない
                    // --------------------

                    guard
                        !didReportDeliveredDiaryNotification
                    else {

                        print(
                            "⌚ 配信済みDiary通知を報告済みのため起動時チェック省略"
                        )

                        return
                    }
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
            // 睡眠リアクション
            // Diary通知の事後報告中は
            // 上書きしない
            // --------------------

            if !didReportDeliveredDiaryNotification {

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

                            // 事後報告モフが始まっていたら
                            // 古い睡眠リアクションの
                            // タイマーで消さない
                            guard
                                !isReportingNotification
                            else {
                                return
                            }

                            healthMessage = nil
                            isSleepDeprived =
                                false
                            isYawning = false
                        }
                }

            } else {

                print(
                    "⌚ Diary通知報告中のため睡眠リアクション省略"
                )
            }
        }

        .onChange(
            of: isReportingNotification
        ) { _, newValue in

            print(
                "😼 isReportingNotification changed: \(newValue)"
            )
        }
        // --------------------
        // 気象警報 更新監視
        // --------------------

        .onChange(
            of: diaryWatch.weatherWarnings
        ) { _, _ in

            guard
                let warning =
                    currentWeatherWarning()
            else {
                // 警報がなくなったら
                // 次回の発表を通知できるようリセット
                lastWeatherWarningKey = nil
                return
            }

            // 同じ警報は繰り返さない
            guard
                warning.key !=
                    lastWeatherWarningKey
            else {
                return
            }

            lastWeatherWarningKey =
                warning.key

            print(
                "⚠️ 気象警報更新: \(warning.message)"
            )

            isSleeping = false
            isSleepDeprived = false
            isYawning = false
            isConcerned = false

            // 腕組みモフ
            isReportingNotification = true

            showMofuNotification(
                warning.message,
                duration: 10
            )

            DispatchQueue.main
                .asyncAfter(
                    deadline:
                        .now() + 10
                ) {

                    isReportingNotification =
                        false
                }
        }
        // --------------------
        // 心拍リアクション
        // --------------------

        .onChange(
            of: healthKit.heartRate
        ) { _, newHeartRate in

            // 事後報告中は
            // 心拍リアクションを重ねない
            guard
                !isReportingNotification
            else {
                return
            }

            if newHeartRate >= 110 {

                isConcerned = true

                healthMessage =
                    "おい、ちょっと深呼吸しろ"

                DispatchQueue.main
                    .asyncAfter(
                        deadline:
                            .now() + 5
                    ) {

                        guard
                            !isReportingNotification
                        else {
                            return
                        }

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
        // ご褒美解放チェック
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
                didCompleteFifteenMinuteAlert,
                let rewardScheduleId,
                !isRewardAvailable
            else {
                return
            }

            guard
                diaryWatch.hasScheduleStarted(
                    scheduleId: rewardScheduleId
                )
            else {
                return
            }

            isRewardAvailable = true

            print(
                "🥫 ご褒美解放: \(rewardScheduleId)"
            )
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
            
            print(
                "⏱️ Diary予定タイマー発火"
            )
            // 事後報告中は
            // 新しい画面表示を重ねない
            guard
                !isReportingNotification
            else {
                return
            }
            
            // --------------------
            // 気象警報が出ている間は
            // Diary予定より警報を優先
            // --------------------

            if currentWeatherWarning() != nil
            {
                return
            }
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

            // 事後報告中は
            // 天気を重ねない
            guard
                !isReportingNotification
            else {
                return
            }
            
            // --------------------
            // 気象警報が出ている間は
            // 通常天気を表示しない
            // --------------------

            if currentWeatherWarning() != nil
            {
                return
            }
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

            // 特別な表情中は
            // 歩行処理を止める
            if isConcerned
                || isSleepDeprived
                || isYawning
                || isReportingNotification
                || rewardStage > 0
            {
                return
            }

            elapsedTime += 0.18

            // --------------------
            // 睡眠中
            // --------------------

            if isSleeping {

                if elapsedTime >= 10 {

                    isSleeping = false
                    elapsedTime = 0

                    mofuX = -45
                    movingRight = true
                }

                return
            }

            // --------------------
            // 歩行アニメーション
            // --------------------

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

            // --------------------
            // 20秒歩いたら寝る
            // --------------------

            if elapsedTime >= 20 {

                isSleeping = true
                elapsedTime = 0
            }
        }
    }
    
    // --------------------
    // 気象警報
    // --------------------

    private func currentWeatherWarning()
        -> (key: String, message: String)?
    {
        guard
            let warning =
                diaryWatch.weatherWarnings.first,
            let code = warning["code"],
            let name = warning["name"]
        else {
            return nil
        }

        let key =
            "\(code)-\(name)"

        let message =
            "⚠️ \(name)出てるぞ。\n最新情報確認しろ"

        return (
            key: key,
            message: message
        )
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
            
            // --------------------

               // この予定ですでに

               // ご褒美を受取済みなら

               // 再びご褒美対象にしない

               // --------------------

               if lastRewardedScheduleId ==

                   alert.scheduleId

               {

                   print(

                       "🥫 ご褒美受取済みの予定: \(alert.scheduleId)"

                   )

                   break

               }
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
            
            // --------------------
            // 15分前のお知らせ完了を記録
            // ※まだご褒美は表示しない
            // --------------------
            
            didCompleteFifteenMinuteAlert = true
            rewardScheduleId = alert.scheduleId

            // --------------------
            // アプリを閉じても
            // ご褒美対象を保持
            // --------------------

            UserDefaults.standard.set(
                alert.scheduleId,
                forKey: "rewardScheduleId"
            )

            print(
                "😼 15分前のお知らせ完了: \(alert.scheduleId)"
            )
        }

        // 指定時間後にセリフを消す
        DispatchQueue.main
            .asyncAfter(
                deadline:
                    .now() + 5
            ) {

                // その後に事後報告が
                // 始まっていたら消さない
                guard
                    !isReportingNotification
                else {
                    return
                }

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
        _ message: String,
        duration: Double = 5
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

        // 指定時間後にセリフを消す
        DispatchQueue.main
            .asyncAfter(
                deadline:
                    .now() + duration
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
