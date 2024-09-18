import * as amplitude from "@amplitude/analytics-node"

class AmplitudeServiceForNode {
  private static instance: AmplitudeServiceForNode
  private isInitialized: boolean = false
  private apiKey: string
  public hasUser: boolean = false

  // Private constructor for Singleton pattern
  private constructor(apiKey: string) {
    this.apiKey = apiKey
    this.initialize()
  }

  // Singleton instance getter
  public static getInstance(apiKey: string): AmplitudeServiceForNode {
    if (!AmplitudeServiceForNode.instance) {
      AmplitudeServiceForNode.instance = new AmplitudeServiceForNode(apiKey)
    }
    return AmplitudeServiceForNode.instance
  }

  // Initialize Amplitude (only once)
  private initialize() {
    amplitude.init(this.apiKey)
    this.isInitialized = true
  }

  // Set user details (only once)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public setUser(userProperties: any) {
    if (this.hasUser) return // Prevent multiple user setups
    const { user_id, name } = userProperties

    const identify = new amplitude.Identify()
      .set("User ID", user_id || "")
      .set("Name", name || "")

    amplitude.identify(identify, { user_id: user_id || "" })
    this.hasUser = true // Mark user as set
  }

  // Track events
  public trackEvent(
    userId: string,
    eventType: string,
    data?: Record<string, unknown>
  ) {
    amplitude.track({
      event_type: eventType,
      user_id: userId,
      event_properties: {
        app_source: "dashboard",
        ...data,
      },
    })
  }
}

// Ensure the instance is created with the API key
const amplitudeServiceForNode = AmplitudeServiceForNode.getInstance(
  "8ba592c88a86b320747c2645b7289366"
)

export default amplitudeServiceForNode
