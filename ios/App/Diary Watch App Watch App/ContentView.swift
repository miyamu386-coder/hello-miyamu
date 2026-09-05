//
//  ContentView.swift
//  Diary Watch App Watch App
//

import SwiftUI
import Combine

struct ContentView: View {

    @StateObject private var healthKit = HealthKitManager()
    @StateObject private var calendarManager = CalendarManager()

    @State private var walkFrameIndex = 0
    @State private var mofuX: CGFloat = -45
    @State private var movingRight = true

    @State private var isSleeping = false
    @State private var elapsedTime: Double = 0

    @State private var healthMessage: String? = nil

    @State private var isConcerned = false
    @State private var isSleepDeprived = false
    @State private var isYawning = false

    // false = 歩数
    // true = 予定
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
                    .frame(width: 80, height: 80)
                    .offset(x: 10, y: 35)

            } else if isConcerned {

                Image("watch-mofu-concerned")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                    .offset(x: 0, y: 35)

            } else if isSleepDeprived {

                Image("watch-mofu-sleepy-angry")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                    .offset(x: 0, y: 35)

            } else if isYawning {

                Image("watch-mofu-yawn")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                    .offset(x: 0, y: 35)

            } else {

                Image(walkFrames[walkFrameIndex])
                    .resizable()
                    .scaledToFit()
                    .frame(width: 65, height: 65)
                    .scaleEffect(
                        x: movingRight ? -1 : 1,
                        y: 1
                    )
                    .offset(
                        x: mofuX,
                        y: 35
                    )
                    .onTapGesture {

                        // --------------------
                        // 予定を表示
                        // --------------------

                        if showScheduleNext {

                            healthMessage =
                                calendarManager.scheduleMessage()

                        // --------------------
                        // 歩数を表示
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

                        // 次回は反対側
                        showScheduleNext.toggle()

                        DispatchQueue.main.asyncAfter(
                            deadline: .now() + 4
                        ) {
                            healthMessage = nil
                        }
                    }
            }

            if let healthMessage {

                Text(healthMessage)
                    .font(.caption2)
                    .multilineTextAlignment(.center)
                    .padding(6)
                    .background(
                        .black.opacity(0.65)
                    )
                    .clipShape(
                        RoundedRectangle(
                            cornerRadius: 8
                        )
                    )
                    .padding(.horizontal, 8)
                    .offset(y: -45)
            }
        }

        .task {

            // --------------------
            // HealthKit
            // --------------------

            await healthKit.requestAuthorization()

            await healthKit.fetchTodaySteps()
            await healthKit.fetchLatestHeartRate()
            await healthKit.fetchSleep()
            
            

            // --------------------
            // Calendar
            // --------------------

            await calendarManager.requestAuthorization()
            calendarManager.fetchTodayEvents()

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

                DispatchQueue.main.asyncAfter(
                    deadline: .now() + 5
                ) {

                    healthMessage = nil
                    isSleepDeprived = false
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

                DispatchQueue.main.asyncAfter(
                    deadline: .now() + 5
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
                await healthKit.fetchLatestHeartRate()
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
                await healthKit.fetchTodaySteps()
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
                await healthKit.fetchSleep()
            }
        }

        // --------------------
        // 予定更新
        // --------------------

        .onReceive(
            Timer.publish(
                every: 60,
                on: .main,
                in: .common
            )
            .autoconnect()
        ) { _ in

            calendarManager.fetchTodayEvents()
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
                || isYawning {

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
                (walkFrameIndex + 1)
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
}

#Preview {
    ContentView()
}
