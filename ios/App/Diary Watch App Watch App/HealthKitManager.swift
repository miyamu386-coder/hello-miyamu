import Foundation
import HealthKit
import Combine

@MainActor
final class HealthKitManager: ObservableObject {

    private let healthStore = HKHealthStore()

    @Published var stepCount: Int = 0
    @Published var heartRate: Double = 0
    @Published var sleepHours: Double = 0

    func requestAuthorization() async {

        guard HKHealthStore.isHealthDataAvailable() else {
            return
        }

        guard let stepType =
                HKObjectType.quantityType(
                    forIdentifier: .stepCount
                )
        else {
            return
        }

        guard let heartRateType =
                HKObjectType.quantityType(
                    forIdentifier: .heartRate
                )
        else {
            return
        }

        guard let sleepType =
                HKObjectType.categoryType(
                    forIdentifier: .sleepAnalysis
                )
        else {
            return
        }

        let readTypes: Set<HKObjectType> = [
            stepType,
            heartRateType,
            sleepType
        ]

        do {
            try await healthStore.requestAuthorization(
                toShare: [],
                read: readTypes
            )
        } catch {
            print(
                "HealthKit authorization error:",
                error
            )
        }
    }

    func fetchTodaySteps() async {

        guard let stepType =
                HKQuantityType.quantityType(
                    forIdentifier: .stepCount
                )
        else {
            return
        }

        let startOfDay =
            Calendar.current.startOfDay(
                for: Date()
            )

        let predicate =
            HKQuery.predicateForSamples(
                withStart: startOfDay,
                end: Date(),
                options: .strictStartDate
            )

        do {
            let descriptor =
                HKStatisticsQueryDescriptor(
                    predicate:
                        .quantitySample(
                            type: stepType,
                            predicate: predicate
                        ),
                    options: .cumulativeSum
                )

            let result =
                try await descriptor.result(
                    for: healthStore
                )

            let steps =
                result?
                    .sumQuantity()?
                    .doubleValue(
                        for: .count()
                    ) ?? 0

            stepCount = Int(steps)

            print(
                "今日の歩数:",
                stepCount
            )

        } catch {
            print(
                "Step fetch error:",
                error
            )
        }
    }

    func fetchLatestHeartRate() async {

        guard let heartRateType =
                HKQuantityType.quantityType(
                    forIdentifier: .heartRate
                )
        else {
            return
        }

        let predicate =
            HKSamplePredicate.quantitySample(
                type: heartRateType,
                predicate: nil
            )

        let sortDescriptor =
            SortDescriptor(
                \HKQuantitySample.endDate,
                order: .reverse
            )

        let descriptor =
            HKSampleQueryDescriptor(
                predicates: [predicate],
                sortDescriptors: [sortDescriptor],
                limit: 1
            )

        do {
            let samples =
                try await descriptor.result(
                    for: healthStore
                )

            guard let sample = samples.first else {
                return
            }

            let unit =
                HKUnit.count()
                    .unitDivided(
                        by: .minute()
                    )

            heartRate =
                sample.quantity.doubleValue(
                    for: unit
                )

            print(
                "最新心拍:",
                heartRate
            )

        } catch {
            print(
                "Heart rate fetch error:",
                error
            )
        }
    }

    func fetchSleep() async {

        guard let sleepType =
                HKObjectType.categoryType(
                    forIdentifier: .sleepAnalysis
                )
        else {
            return
        }

        let now = Date()

        let startDate =
            Calendar.current.date(
                byAdding: .hour,
                value: -18,
                to: now
            ) ?? now

        let predicate =
            HKQuery.predicateForSamples(
                withStart: startDate,
                end: now,
                options: []
            )

        let descriptor =
            HKSampleQueryDescriptor(
                predicates: [
                    .categorySample(
                        type: sleepType,
                        predicate: predicate
                    )
                ],
                sortDescriptors: []
            )

        do {
            let samples =
                try await descriptor.result(
                    for: healthStore
                )

            let asleepValues: Set<Int> = [
                HKCategoryValueSleepAnalysis.asleepUnspecified.rawValue,
                HKCategoryValueSleepAnalysis.asleepCore.rawValue,
                HKCategoryValueSleepAnalysis.asleepDeep.rawValue,
                HKCategoryValueSleepAnalysis.asleepREM.rawValue
            ]

            let totalSeconds =
                samples.reduce(0.0) {
                    total,
                    sample in

                    guard asleepValues.contains(
                        sample.value
                    ) else {
                        return total
                    }

                    return total
                        + sample.endDate.timeIntervalSince(
                            sample.startDate
                        )
                }

            sleepHours =
                totalSeconds / 3600

            print(
                "睡眠時間:",
                sleepHours,
                "時間"
            )

        } catch {
            print(
                "Sleep fetch error:",
                error
            )
        }
    }
}
