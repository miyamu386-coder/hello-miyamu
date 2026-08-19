import Capacitor

class MyViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        print("🐾 MyViewController capacitorDidLoad")

        bridge?.registerPluginInstance(
            HealthKitPlugin()
        )

        print("🐾 HealthKitPlugin registered")
    }
}
