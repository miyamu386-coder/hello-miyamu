//
//  ContentView.swift
//  Diary Watch App Watch App
//
//  Created by yuji miyamura on 2026/09/01.
//

import SwiftUI
import Combine

struct ContentView: View {

    @State private var walkFrameIndex = 0
    @State private var mofuX: CGFloat = -45
    @State private var movingRight = true

    // true = お昼寝中
    @State private var isSleeping = false

    // 経過時間
    @State private var elapsedTime: Double = 0

    private let walkFrames = [
        "watch-mofu-walk-1",
        "watch-mofu-walk-2",
        "watch-mofu-walk-3",
        "watch-mofu-walk-2"
    ]

    var body: some View {
        ZStack {

            // リビング背景
            Image("watch-living-room")
                .resizable()
                .scaledToFill()
                .ignoresSafeArea()

            if isSleeping {

                // お昼寝モフ
                Image("watch-mofu-sleep")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                    .offset(x: 10, y: 35)

            } else {

                // てくてくモフ
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
            }
        }
        .onReceive(
            Timer.publish(
                every: 0.18,
                on: .main,
                in: .common
            ).autoconnect()
        ) { _ in

            elapsedTime += 0.18

            // --------------------
            // お昼寝中
            // --------------------
            if isSleeping {

                // 10秒寝たら起床
                if elapsedTime >= 10 {
                    isSleeping = false
                    elapsedTime = 0

                    // 左端から再スタート
                    mofuX = -45
                    movingRight = true
                }

                return
            }

            // --------------------
            // 歩行中
            // --------------------

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

            // 20秒歩いたら寝る
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
