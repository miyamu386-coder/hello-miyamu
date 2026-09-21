import Foundation
import Capacitor
import WatchConnectivity

@objc(DiaryWatchPlugin)
public class DiaryWatchPlugin:
    CAPPlugin,
    CAPBridgedPlugin,
    WCSessionDelegate
{
    public let identifier =
        "DiaryWatchPlugin"

    public let jsName =
        "DiaryWatch"

    public let pluginMethods:
        [CAPPluginMethod] = [
        CAPPluginMethod(
            name: "sendSchedules",
            returnType:
                CAPPluginReturnPromise
        )
    ]

    public override func load() {
        super.load()

        guard
            WCSession.isSupported()
        else {
            print(
                "⌚ WatchConnectivity is not supported"
            )
            return
        }

        WCSession.default.delegate =
            self

        WCSession.default.activate()

        print(
            "⌚ DiaryWatchPlugin activated"
        )
    }

    @objc func sendSchedules(
        _ call: CAPPluginCall
    ) {
        guard
            WCSession.isSupported()
        else {
            call.reject(
                "WatchConnectivityを利用できません"
            )
            return
        }

        let schedules =
    call.getArray(
        "schedules",
        JSObject.self
    ) ?? []

let weather =
    call.getObject("weather")

let weatherWarnings =
    call.getObject(
        "weatherWarnings"
    )

let session =
    WCSession.default

print(
    "⌚ --- WCSession status ---"
)

print(
    "⌚ activationState: \(session.activationState.rawValue)"
)

print(
    "⌚ isPaired: \(session.isPaired)"
)

print(
    "⌚ isWatchAppInstalled: \(session.isWatchAppInstalled)"
)

print(
    "⌚ isReachable: \(session.isReachable)"
)

var message: [String: Any] = [
    "diarySchedules":
        schedules
]

if let weather {
    message["weather"] =
        weather

    print(
        "⌚ Weather added to context"
    )
}

if let weatherWarnings {
    message["weatherWarnings"] =
        weatherWarnings

    print(
        "⚠️ Weather warnings added to context"
    )
}

do {
            try session
                .updateApplicationContext(
                    message
                )

            print(
                "⌚ Diary context updated: \(schedules.count)"
            )

            if session.isReachable {
                session.sendMessage(
                    message,
                    replyHandler: nil
                ) { error in

                    print(
                        "⌚ Diary message error: \(error.localizedDescription)"
                    )
                }

                print(
                    "⌚ Diary message sent: \(schedules.count)"
                )
            } else {
                print(
                    "⌚ Watch is not reachable"
                )
            }

            call.resolve([
                "sent": true,
                "count":
                    schedules.count
            ])

        } catch {
            call.reject(
                "予定・天気の送信に失敗しました: \(error.localizedDescription)"
            )
        }
    }

    public func session(
        _ session: WCSession,
        activationDidCompleteWith
            activationState:
                WCSessionActivationState,
        error: Error?
    ) {
        if let error {
            print(
                "⌚ WCSession activation error: \(error.localizedDescription)"
            )
            return
        }

        print(
            "⌚ WCSession activated: \(activationState.rawValue)"
        )
    }

    public func sessionDidBecomeInactive(
        _ session: WCSession
    ) {}

    public func sessionDidDeactivate(
        _ session: WCSession
    ) {
        WCSession.default.activate()
    }
}
