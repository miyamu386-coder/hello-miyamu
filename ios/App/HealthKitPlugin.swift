import Foundation
import Capacitor
import HealthKit

@objc(HealthKitPlugin)
public class HealthKitPlugin: CAPPlugin, CAPBridgedPlugin {

    public let identifier = "HealthKitPlugin"
    public let jsName = "HealthKit"

    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "requestAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getSteps", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getSleep", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getHeartRate", returnType: CAPPluginReturnPromise)
    ]

    private let healthStore = HKHealthStore()

    @objc func requestAuthorization(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKitはこの端末では利用できません")
            return
        }

        guard
            let stepType = HKObjectType.quantityType(forIdentifier: .stepCount),
            let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate),
            let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)
        else {
            call.reject("HealthKitのデータ型を取得できませんでした")
            return
        }

        let readTypes: Set<HKObjectType> = [
            stepType,
            heartRateType,
            sleepType
        ]

        healthStore.requestAuthorization(
            toShare: [],
            read: readTypes
        ) { success, error in
            if let error = error {
                call.reject(
                    "HealthKit認証に失敗しました: \(error.localizedDescription)"
                )
                return
            }

            call.resolve([
                "authorized": success
            ])
        }
    }

    @objc func getSteps(_ call: CAPPluginCall) {
        guard let stepType =
            HKQuantityType.quantityType(
                forIdentifier: .stepCount
            )
        else {
            call.reject("歩数データ型を取得できません")
            return
        }

        let calendar = Calendar.current
        let now = Date()
        let startOfDay = calendar.startOfDay(for: now)

        let predicate = HKQuery.predicateForSamples(
            withStart: startOfDay,
            end: now,
            options: .strictStartDate
        )

        let query = HKStatisticsQuery(
            quantityType: stepType,
            quantitySamplePredicate: predicate,
            options: .cumulativeSum
        ) { _, result, error in

            if let error = error {
                call.reject(
                    "歩数取得に失敗しました: \(error.localizedDescription)"
                )
                return
            }

            let steps =
                result?
                    .sumQuantity()?
                    .doubleValue(
                        for: HKUnit.count()
                    ) ?? 0

            call.resolve([
                "steps": Int(steps)
            ])
        }

        healthStore.execute(query)
    }

    @objc func getSleep(_ call: CAPPluginCall) {
        guard let sleepType =
            HKObjectType.categoryType(
                forIdentifier: .sleepAnalysis
            )
        else {
            call.reject("睡眠データ型を取得できません")
            return
        }

        let now = Date()

        guard let startDate =
            Calendar.current.date(
                byAdding: .day,
                value: -1,
                to: now
            )
        else {
            call.reject("睡眠検索期間を作成できません")
            return
        }

        let predicate = HKQuery.predicateForSamples(
            withStart: startDate,
            end: now,
            options: []
        )

        let query = HKSampleQuery(
            sampleType: sleepType,
            predicate: predicate,
            limit: HKObjectQueryNoLimit,
            sortDescriptors: nil
        ) { _, samples, error in

            if let error = error {
                call.reject(
                    "睡眠データ取得に失敗しました: \(error.localizedDescription)"
                )
                return
            }

            let sleepSamples =
                samples as? [HKCategorySample] ?? []

            let asleepValues: Set<Int> = [
                HKCategoryValueSleepAnalysis.asleepUnspecified.rawValue,
                HKCategoryValueSleepAnalysis.asleepCore.rawValue,
                HKCategoryValueSleepAnalysis.asleepDeep.rawValue,
                HKCategoryValueSleepAnalysis.asleepREM.rawValue
            ]
            let totalSeconds =
                sleepSamples.reduce(0.0) {
                    total,
                    sample in

                    guard asleepValues.contains(sample.value) else {
                        return total
                    }

                    return total +
                        sample.endDate.timeIntervalSince(
                            sample.startDate
                        )
                }

            call.resolve([
                "seconds": totalSeconds,
                "hours": totalSeconds / 3600
            ])
        }

        healthStore.execute(query)
    }

    @objc func getHeartRate(_ call: CAPPluginCall) {
        guard let heartRateType =
            HKQuantityType.quantityType(
                forIdentifier: .heartRate
            )
        else {
            call.reject("心拍データ型を取得できません")
            return
        }

        let sortDescriptor = NSSortDescriptor(
            key: HKSampleSortIdentifierEndDate,
            ascending: false
        )

        let query = HKSampleQuery(
            sampleType: heartRateType,
            predicate: nil,
            limit: 1,
            sortDescriptors: [
                sortDescriptor
            ]
        ) { _, samples, error in

            if let error = error {
                call.reject(
                    "心拍取得に失敗しました: \(error.localizedDescription)"
                )
                return
            }

            guard
                let sample =
                    samples?.first
                        as? HKQuantitySample
            else {
                call.resolve([
                    "bpm": NSNull()
                ])
                return
            }

            let unit = HKUnit.count()
                .unitDivided(
                    by: HKUnit.minute()
                )

            let bpm =
                sample.quantity
                    .doubleValue(for: unit)

            call.resolve([
                "bpm": bpm,
                "date":
                    ISO8601DateFormatter()
                        .string(
                            from: sample.endDate
                        )
            ])
        }

        healthStore.execute(query)
    }
}
