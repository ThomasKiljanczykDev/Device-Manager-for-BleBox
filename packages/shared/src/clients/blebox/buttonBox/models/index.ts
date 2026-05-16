// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/**
 * 
 * @export
 * @interface ApFound
 */
export interface ApFound {
    /**
     * SSID (name) of found network
     * @type {string}
     * @memberof ApFound
     */
    ssid?: string;
    /**
     * <br>**Signal strength** of found network, where:<br> <table> <tr> <td>From:</td> <td>To:</td> <td>Description:</td> </tr> <tr> <td>**-67**</td> <td>**0**</td> <td>Very good</td> </tr> <tr> <td>**-73**</td> <td>**-68**</td> <td>Good</td> </tr> <tr> <td>**-80**</td> <td>**-74**</td> <td>Poor</td> </tr> <tr> <td>**-127**</td> <td>**-81**</td> <td>Unstable/Unusable</td> </tr> </table>
     * @type {number}
     * @memberof ApFound
     */
    rssi?: number;
    /**
     * 
     * @type {Encryption}
     * @memberof ApFound
     */
    enc?: Encryption;
}


/**
 * 
 * @export
 * @interface ApiDeviceSetPost200Response
 */
export interface ApiDeviceSetPost200Response {
    /**
     * 
     * @type {Device}
     * @memberof ApiDeviceSetPost200Response
     */
    device?: Device;
    /**
     * 
     * @type {Network}
     * @memberof ApiDeviceSetPost200Response
     */
    network?: Network;
}
/**
 * 
 * @export
 * @interface ApiDeviceSetPostRequest
 */
export interface ApiDeviceSetPostRequest {
    /**
     * 
     * @type {ApiDeviceSetPostRequestNetwork}
     * @memberof ApiDeviceSetPostRequest
     */
    network: ApiDeviceSetPostRequestNetwork;
}
/**
 * **Internal** access Point's settings
 * @export
 * @interface ApiDeviceSetPostRequestNetwork
 */
export interface ApiDeviceSetPostRequestNetwork {
    /**
     * <br>Parameter that show if **internal** WiFi Access Point is enabled, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**false**</td> <td>disabled</td> </tr> <tr> <td>**true**</td> <td>enabled</td> </tr> </table><br> If **false** - **apSSID** and **apPasswd** can be ignored.
     * @type {boolean}
     * @memberof ApiDeviceSetPostRequestNetwork
     */
    apEnable?: boolean;
    /**
     * SSID of **internal** WiFi access Point
     * @type {string}
     * @memberof ApiDeviceSetPostRequestNetwork
     */
    apSSID?: string;
    /**
     * Password of **internal** WiFi Access Point. <br> WPA2-PSK is used. <br>Empty string or 'null' indicates that internal AP is set to open mode (without password).
     * @type {string}
     * @memberof ApiDeviceSetPostRequestNetwork
     */
    apPasswd?: string | null;
}
/**
 * 
 * @export
 * @interface ApiDeviceUptimeGet200Response
 */
export interface ApiDeviceUptimeGet200Response {
    /**
     * Number of **seconds** since the device was turned on
     * @type {number}
     * @memberof ApiDeviceUptimeGet200Response
     */
    upTimeS?: number;
}
/**
 * 
 * @export
 * @interface ApiSettingsSetPostRequest
 */
export interface ApiSettingsSetPostRequest {
    /**
     * 
     * @type {ApiSettingsSetPostRequestSettings}
     * @memberof ApiSettingsSetPostRequest
     */
    settings?: ApiSettingsSetPostRequestSettings;
}
/**
 * 
 * @export
 * @interface ApiSettingsSetPostRequestSettings
 */
export interface ApiSettingsSetPostRequestSettings {
    /**
     * **Name** of BleBox device/controller
     * @type {string}
     * @memberof ApiSettingsSetPostRequestSettings
     */
    deviceName?: string;
    /**
     * 
     * @type {Tunnel}
     * @memberof ApiSettingsSetPostRequestSettings
     */
    tunnel?: Tunnel;
    /**
     * 
     * @type {StatusLed}
     * @memberof ApiSettingsSetPostRequestSettings
     */
    statusLed?: StatusLed;
    /**
     * 
     * @type {StateExtendedGet200ResponseButtonbox}
     * @memberof ApiSettingsSetPostRequestSettings
     */
    buttonbox?: StateExtendedGet200ResponseButtonbox;
}
/**
 * 
 * @export
 * @interface ApiSettingsStateGet200Response
 */
export interface ApiSettingsStateGet200Response {
    /**
     * 
     * @type {ApiSettingsStateGet200ResponseSettings}
     * @memberof ApiSettingsStateGet200Response
     */
    settings?: ApiSettingsStateGet200ResponseSettings;
}
/**
 * Object with **specific** settings
 * @export
 * @interface ApiSettingsStateGet200ResponseSettings
 */
export interface ApiSettingsStateGet200ResponseSettings {
    /**
     * **Name** of BleBox device/controller
     * @type {string}
     * @memberof ApiSettingsStateGet200ResponseSettings
     */
    deviceName?: string;
    /**
     * 
     * @type {Tunnel}
     * @memberof ApiSettingsStateGet200ResponseSettings
     */
    tunnel?: Tunnel;
    /**
     * 
     * @type {StatusLed}
     * @memberof ApiSettingsStateGet200ResponseSettings
     */
    statusLed?: StatusLed;
    /**
     * 
     * @type {ApiSettingsStateGet200ResponseSettingsButtonbox}
     * @memberof ApiSettingsStateGet200ResponseSettings
     */
    buttonbox?: ApiSettingsStateGet200ResponseSettingsButtonbox;
}
/**
 * 
 * @export
 * @interface ApiSettingsStateGet200ResponseSettingsButtonbox
 */
export interface ApiSettingsStateGet200ResponseSettingsButtonbox {
    /**
     * 
     * @type {UiType}
     * @memberof ApiSettingsStateGet200ResponseSettingsButtonbox
     */
    uiType?: UiType;
}


/**
 * 
 * @export
 * @interface ApiWifiConnectPost200Response
 */
export interface ApiWifiConnectPost200Response {
    /**
     * SSID of connected WiFi network. <br> **Empty string** indicates that **no WiFi network was selected**
     * @type {string}
     * @memberof ApiWifiConnectPost200Response
     */
    ssid?: string;
    /**
     * 
     * @type {StationStatus}
     * @memberof ApiWifiConnectPost200Response
     */
    stationStatus?: StationStatus;
}


/**
 * 
 * @export
 * @interface ApiWifiConnectPostRequest
 */
export interface ApiWifiConnectPostRequest {
    /**
     * SSID of WiFi network. <br> **Empty string** will disconnect from WiFi network
     * @type {string}
     * @memberof ApiWifiConnectPostRequest
     */
    ssid: string;
    /**
     * Password to WiFi network. Empty string or 'null' indicates open mode (without password).
     * @type {string}
     * @memberof ApiWifiConnectPostRequest
     */
    pwd?: string | null;
}
/**
 * 
 * @export
 * @interface ApiWifiScanGet200Response
 */
export interface ApiWifiScanGet200Response {
    /**
     * **List of** found **WiFi** networks
     * @type {Array<ApFound>}
     * @memberof ApiWifiScanGet200Response
     */
    ap?: Array<ApFound>;
}
/**
 * 
 * @export
 * @interface ApiWifiStatusGet200Response
 */
export interface ApiWifiStatusGet200Response {
    /**
     * <br>Parameter that show if **WiFi scanning is in progress**, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**false**</td> <td>disabled</td> </tr> <tr> <td>**true**</td> <td>enabled</td> </tr> </table>
     * @type {boolean}
     * @memberof ApiWifiStatusGet200Response
     */
    scanning?: boolean;
    /**
     * SSID of connected WiFi network. <br> **Empty string** indicates that **no WiFi network was selected**
     * @type {string}
     * @memberof ApiWifiStatusGet200Response
     */
    ssid?: string;
    /**
     * IPv4 of BleBox device connected to local WiFi network. <br> **Empty string** indicates that **no WiFi network was connected**
     * @type {string}
     * @memberof ApiWifiStatusGet200Response
     */
    ip?: string;
    /**
     * 
     * @type {StationStatus}
     * @memberof ApiWifiStatusGet200Response
     */
    stationStatus?: StationStatus;
}



/**
 * <br>Allow to **disable or enable function**, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>disabled</td> </tr> <tr> <td>**1**</td> <td>enabled</td> </tr> </table>
 * @export
 */
export const BoolFieldEnabled = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type BoolFieldEnabled = typeof BoolFieldEnabled[keyof typeof BoolFieldEnabled];

/**
 * **General** information about device
 * @export
 * @interface Device
 */
export interface Device {
    /**
     * **Name** of BleBox device/controller
     * @type {string}
     * @memberof Device
     */
    deviceName?: string;
    /**
     * Product name for informational purpose only - do not use it in any application logic
     * @type {string}
     * @memberof Device
     */
    product?: string;
    /**
     * **API type** of BleBox device - it indicate what **device-specific API** should be used
     * @type {string}
     * @memberof Device
     */
    type?: string;
    /**
     * **API level** of BleBox device - it indicate what version of **common and device-specific API** should be used
     * @type {string}
     * @memberof Device
     */
    apiLevel?: string;
    /**
     * Hardware version for informational purpose only - do not use it in any application logic
     * @type {string}
     * @memberof Device
     */
    hv?: string;
    /**
     * Firmware version for informational purpose only - do not use it in any application logic
     * @type {string}
     * @memberof Device
     */
    fv?: string;
    /**
     * Unique identification number of BleBox device
     * @type {string}
     * @memberof Device
     */
    id?: string;
    /**
     * IPv4 of BleBox device connected to local WiFi network. <br> **Empty string** indicates that **no WiFi network was connected**
     * @type {string}
     * @memberof Device
     */
    ip?: string;
}

/**
 * <br>**Encryption mode** of found network, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>Open network (without password) - unsafe, but can be used</td> </tr> <tr> <td>**1**</td> <td>WEP encryption - unsafe - can not be used</td> </tr> <tr> <td>**2**</td> <td>WPA encryption - unsafe - can not be used</td> </tr> <tr> <td>**3**</td> <td>WPA2 encryption - safe if properly configured - can be used (recomended)</td> </tr> <tr> <td>**4**</td> <td>WPA/WPA2 encryption - unsafe, but can be used as WPA2</td> </tr> </table>
 * @export
 */
export const Encryption = {
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3,
    NUMBER_4: 4,
    NUMBER_5: 5
} as const;
export type Encryption = typeof Encryption[keyof typeof Encryption];

/**
 * 
 * @export
 * @interface InfoGet200Response
 */
export interface InfoGet200Response {
    /**
     * 
     * @type {Device}
     * @memberof InfoGet200Response
     */
    device?: Device;
}

/**
 * <br>Parameter that show **state of input**, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>Low</td> </tr> <tr> <td>**1**</td> <td>High</td> </tr> </table>
 * @export
 */
export const InputState = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type InputState = typeof InputState[keyof typeof InputState];

/**
 * Description of selected input.
 * @export
 * @interface InputStruct
 */
export interface InputStruct {
    /**
     * Input ID. Numbered from 0. Maximum ID depending on the number of inputs available in the device (the available IDs are given in **inputs** array in the response of **Device state - /state**).
     * @type {number}
     * @memberof InputStruct
     */
    input: number;
    /**
     * 
     * @type {InputState}
     * @memberof InputStruct
     */
    state: InputState;
}


/**
 * All information connected with network
 * @export
 * @interface Network
 */
export interface Network {
    /**
     * SSID of connected WiFi network. <br> **Empty string** indicates that **no WiFi network was selected**
     * @type {string}
     * @memberof Network
     */
    ssid?: string;
    /**
     * BSSID of connected WiFi network. <br> **Empty string** indicates that **no WiFi network was found**
     * @type {string}
     * @memberof Network
     */
    bssid?: string;
    /**
     * IPv4 of BleBox device connected to local WiFi network. <br> **Empty string** indicates that **no WiFi network was connected**
     * @type {string}
     * @memberof Network
     */
    ip?: string;
    /**
     * MAC address of BleBox device. <br> This interface connect to Access Point (to local WiFi network)
     * @type {string}
     * @memberof Network
     */
    mac?: string;
    /**
     * 
     * @type {StationStatus}
     * @memberof Network
     */
    stationStatus?: StationStatus;
    /**
     * 
     * @type {TunnelStatus}
     * @memberof Network
     */
    tunnelStatus?: TunnelStatus;
    /**
     * <br>Parameter that show if **internal** WiFi Access Point is enabled, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**false**</td> <td>disabled</td> </tr> <tr> <td>**true**</td> <td>enabled</td> </tr> </table><br> If **false** - **apSSID** and **apPasswd** can be ignored.
     * @type {boolean}
     * @memberof Network
     */
    apEnable?: boolean;
    /**
     * SSID of **internal** WiFi access Point
     * @type {string}
     * @memberof Network
     */
    apSSID?: string;
    /**
     * Password of **internal** WiFi Access Point. <br> WPA2-PSK is used. <br>Empty string or 'null' indicates that internal AP is set to open mode (without password).
     * @type {string}
     * @memberof Network
     */
    apPasswd?: string | null;
    /**
     * Channel of **internal** WiFi Access Point. **If device is connected to local WiFi** network then internal WiFi **channel is the same** as local WiFi Access Point's channel
     * @type {number}
     * @memberof Network
     */
    channel?: number;
}


/**
 * 
 * @export
 * @interface StateExtendedGet200Response
 */
export interface StateExtendedGet200Response {
    /**
     * List of all available inputs with corresponding states.
     * @type {Array<InputStruct>}
     * @memberof StateExtendedGet200Response
     */
    inputs?: Array<InputStruct>;
    /**
     * 
     * @type {StateExtendedGet200ResponseButtonbox}
     * @memberof StateExtendedGet200Response
     */
    buttonbox?: StateExtendedGet200ResponseButtonbox;
}
/**
 * 
 * @export
 * @interface StateExtendedGet200ResponseButtonbox
 */
export interface StateExtendedGet200ResponseButtonbox {
    /**
     * 
     * @type {UiType}
     * @memberof StateExtendedGet200ResponseButtonbox
     */
    uiType?: UiType;
}


/**
 * 
 * @export
 * @interface StateGet200Response
 */
export interface StateGet200Response {
    /**
     * List of all available inputs with corresponding states.
     * @type {Array<InputStruct>}
     * @memberof StateGet200Response
     */
    inputs?: Array<InputStruct>;
}

/**
 * <br>Status of current **WiFi connection**, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>Not configured</td> </tr> <tr> <td>**1**</td> <td>Connecting</td> </tr> <tr> <td>**2**</td> <td>Wrong password</td> </tr> <tr> <td>**3**</td> <td>WiFi network not found</td> </tr> <tr> <td>**4**</td> <td>Communication with WiFi network failed</td> </tr> <tr> <td>**5**</td> <td>Connected</td> </tr> </table>
 * @export
 */
export const StationStatus = {
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3,
    NUMBER_4: 4,
    NUMBER_5: 5
} as const;
export type StationStatus = typeof StationStatus[keyof typeof StationStatus];

/**
 * Allows to **enable** or **disable** extended status notification using built in **LED**
 * @export
 * @interface StatusLed
 */
export interface StatusLed {
    /**
     * 
     * @type {BoolFieldEnabled}
     * @memberof StatusLed
     */
    enabled?: BoolFieldEnabled;
}



/**
 * Type of selected trigger, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**1**</td> <td>Short click</td> </tr> <tr> <td>**2**</td> <td>Long click</td> </tr> <tr> <td>**3**</td> <td>Falling edge (transition from high to low state on the selected input)</td> </tr> <tr> <td>**4**</td> <td>Rising edge (transition from low to high state on the selected input)</td> </tr> <tr> <td>**5**</td> <td>Any edge (transition from "low to high state" or "high to low state" on the selected input)</td> </tr> </table>
 * @export
 */
export const TriggerType = {
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3,
    NUMBER_4: 4,
    NUMBER_5: 5
} as const;
export type TriggerType = typeof TriggerType[keyof typeof TriggerType];

/**
 * Allows to **enable or disable** connection with **the BleBox's cloud** and decide whether events generated by this device should be log to **the BleBox's cloud** (necessary for push notifications), the user can view the event log through the wBox application.
 * @export
 * @interface Tunnel
 */
export interface Tunnel {
    /**
     * 
     * @type {BoolFieldEnabled}
     * @memberof Tunnel
     */
    enabled?: BoolFieldEnabled;
    /**
     * 
     * @type {BoolFieldEnabled}
     * @memberof Tunnel
     */
    logEnabled?: BoolFieldEnabled;
}



/**
 * <br>Status of **cloud connection** (remote access), where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>Waiting for stable WiFi connection</td> </tr> <tr> <td>**1**</td> <td>Connecting</td> </tr> <tr> <td>**2**</td> <td>Internet network is unreachable (DNS failed)</td> </tr> <tr> <td>**3**</td> <td>Internet network is unreachable (server not found)</td> </tr> <tr> <td>**4**</td> <td>Connection broken (connection was estabilished but it's broken now)</td> </tr> <tr> <td>**5**</td> <td>Connected</td> </tr> <tr> <td>**6**</td> <td>Disabled by user</td> </tr> </table>
 * @export
 */
export const TunnelStatus = {
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3,
    NUMBER_4: 4,
    NUMBER_5: 5,
    NUMBER_6: 6
} as const;
export type TunnelStatus = typeof TunnelStatus[keyof typeof TunnelStatus];


/**
 * Type of selected user interface (only information about the selected type, implementation should be provided on the GUI side), where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>Display controls for all triggers</td> </tr> <tr> <td>**1**</td> <td>Display controls for short and long click triggers only</td> </tr> </table>
 * @export
 */
export const UiType = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type UiType = typeof UiType[keyof typeof UiType];

