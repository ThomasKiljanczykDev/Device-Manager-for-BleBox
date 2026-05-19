// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/**
 * All information connected with network
 * @export
 * @interface ApiDeviceNetworkGet200Response
 */
export interface ApiDeviceNetworkGet200Response {
    /**
     * 
     * @type {object}
     * @memberof ApiDeviceNetworkGet200Response
     */
    ssid?: object;
    /**
     * BSSID of connected WiFi network. <br> **Empty string** indicates that **no WiFi network was found**
     * @type {string}
     * @memberof ApiDeviceNetworkGet200Response
     */
    bssid?: string;
    /**
     * 
     * @type {object}
     * @memberof ApiDeviceNetworkGet200Response
     */
    ip?: object;
    /**
     * MAC address of BleBox device. <br> This interface connect to Access Point (to local WiFi network)
     * @type {string}
     * @memberof ApiDeviceNetworkGet200Response
     */
    mac?: string;
    /**
     * 
     * @type {object}
     * @memberof ApiDeviceNetworkGet200Response
     */
    stationStatus?: object;
    /**
     * <br>Status of **cloud connection** (remote access), where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>Waiting for stable WiFi connection</td> </tr> <tr> <td>**1**</td> <td>Connecting</td> </tr> <tr> <td>**2**</td> <td>Internet network is unreachable (DNS failed)</td> </tr> <tr> <td>**3**</td> <td>Internet network is unreachable (server not found)</td> </tr> <tr> <td>**4**</td> <td>Connection broken (connection was estabilished but it's broken now)</td> </tr> <tr> <td>**5**</td> <td>Connected</td> </tr> <tr> <td>**6**</td> <td>Disabled by user</td> </tr> </table>
     * @type {ApiDeviceNetworkGet200ResponseTunnelStatusEnum}
     * @memberof ApiDeviceNetworkGet200Response
     */
    tunnelStatus?: ApiDeviceNetworkGet200ResponseTunnelStatusEnum;
    /**
     * 
     * @type {object}
     * @memberof ApiDeviceNetworkGet200Response
     */
    apEnable?: object;
    /**
     * 
     * @type {object}
     * @memberof ApiDeviceNetworkGet200Response
     */
    apSSID?: object;
    /**
     * 
     * @type {object}
     * @memberof ApiDeviceNetworkGet200Response
     */
    apPasswd?: object;
    /**
     * Channel of **internal** WiFi Access Point. **If device is connected to local WiFi** network then internal WiFi **channel is the same** as local WiFi Access Point's channel
     * @type {number}
     * @memberof ApiDeviceNetworkGet200Response
     */
    channel?: number;
}


/**
 * @export
 */
export const ApiDeviceNetworkGet200ResponseTunnelStatusEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3,
    NUMBER_4: 4,
    NUMBER_5: 5,
    NUMBER_6: 6
} as const;
export type ApiDeviceNetworkGet200ResponseTunnelStatusEnum = typeof ApiDeviceNetworkGet200ResponseTunnelStatusEnum[keyof typeof ApiDeviceNetworkGet200ResponseTunnelStatusEnum];

/**
 * 
 * @export
 * @interface ApiDeviceSetPost200Response
 */
export interface ApiDeviceSetPost200Response {
    /**
     * 
     * @type {object}
     * @memberof ApiDeviceSetPost200Response
     */
    device?: object;
    /**
     * 
     * @type {object}
     * @memberof ApiDeviceSetPost200Response
     */
    network?: object;
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
 * Object with **specific** settings
 * @export
 * @interface ApiSettingsSetPostRequestSettings
 */
export interface ApiSettingsSetPostRequestSettings {
    /**
     * 
     * @type {DeviceName}
     * @memberof ApiSettingsSetPostRequestSettings
     */
    deviceName?: DeviceName;
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
     * @type {PowerMeasuring}
     * @memberof ApiSettingsSetPostRequestSettings
     */
    powerMeasuring?: PowerMeasuring;
    /**
     * 
     * @type {Array<ApiSettingsStateGet200ResponseSettingsRelaysInner>}
     * @memberof ApiSettingsSetPostRequestSettings
     */
    relays?: Array<ApiSettingsStateGet200ResponseSettingsRelaysInner>;
    /**
     * 
     * @type {Switch}
     * @memberof ApiSettingsSetPostRequestSettings
     */
    _switch?: Switch;
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
     * @type {ApiSettingsStateGet200ResponseSettingsTunnel}
     * @memberof ApiSettingsStateGet200ResponseSettings
     */
    tunnel?: ApiSettingsStateGet200ResponseSettingsTunnel;
    /**
     * 
     * @type {ApiSettingsStateGet200ResponseSettingsStatusLed}
     * @memberof ApiSettingsStateGet200ResponseSettings
     */
    statusLed?: ApiSettingsStateGet200ResponseSettingsStatusLed;
    /**
     * 
     * @type {ApiSettingsStateGet200ResponseSettingsPowerMeasuring}
     * @memberof ApiSettingsStateGet200ResponseSettings
     */
    powerMeasuring?: ApiSettingsStateGet200ResponseSettingsPowerMeasuring;
    /**
     * 
     * @type {Array<ApiSettingsStateGet200ResponseSettingsRelaysInner>}
     * @memberof ApiSettingsStateGet200ResponseSettings
     */
    relays?: Array<ApiSettingsStateGet200ResponseSettingsRelaysInner>;
    /**
     * 
     * @type {Switch}
     * @memberof ApiSettingsStateGet200ResponseSettings
     */
    _switch?: Switch;
}
/**
 * Allows to enable or disable **power measuring module** (**powerConsumption** and **activePower** sensor). If hardware doesn't support power measuring then **this object doesn't exist**
 * @export
 * @interface ApiSettingsStateGet200ResponseSettingsPowerMeasuring
 */
export interface ApiSettingsStateGet200ResponseSettingsPowerMeasuring {
    /**
     * 
     * @type {Enabled}
     * @memberof ApiSettingsStateGet200ResponseSettingsPowerMeasuring
     */
    enabled?: Enabled;
}
/**
 * 
 * @export
 * @interface ApiSettingsStateGet200ResponseSettingsRelaysInner
 */
export interface ApiSettingsStateGet200ResponseSettingsRelaysInner {
    /**
     * 
     * @type {StateAfterRestart}
     * @memberof ApiSettingsStateGet200ResponseSettingsRelaysInner
     */
    stateAfterRestart?: StateAfterRestart;
    /**
     * Time in **seconds** **for button** "turn on for time" in wBox App, where **0 == disabled button**
     * @type {number}
     * @memberof ApiSettingsStateGet200ResponseSettingsRelaysInner
     */
    defaultForTime?: number;
    /**
     * **Name of output**
     * @type {string}
     * @memberof ApiSettingsStateGet200ResponseSettingsRelaysInner
     */
    name?: string;
}


/**
 * Allows to **enable** or **disable** extended status notification using built in **LED**
 * @export
 * @interface ApiSettingsStateGet200ResponseSettingsStatusLed
 */
export interface ApiSettingsStateGet200ResponseSettingsStatusLed {
    /**
     * 
     * @type {Enabled}
     * @memberof ApiSettingsStateGet200ResponseSettingsStatusLed
     */
    enabled?: Enabled;
}
/**
 * Allows to **enable or disable** connection with **the BleBox's cloud** and decide whether events generated by this device should be log to **the BleBox's cloud** (necessary for push notifications), the user can view the event log through the wBox application.
 * @export
 * @interface ApiSettingsStateGet200ResponseSettingsTunnel
 */
export interface ApiSettingsStateGet200ResponseSettingsTunnel {
    /**
     * <br>Allow to **disable or enable function**, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>disabled</td> </tr> <tr> <td>**1**</td> <td>enabled</td> </tr> </table>
     * @type {ApiSettingsStateGet200ResponseSettingsTunnelEnabledEnum}
     * @memberof ApiSettingsStateGet200ResponseSettingsTunnel
     */
    enabled?: ApiSettingsStateGet200ResponseSettingsTunnelEnabledEnum;
    /**
     * 
     * @type {Enabled}
     * @memberof ApiSettingsStateGet200ResponseSettingsTunnel
     */
    logEnabled?: Enabled;
}


/**
 * @export
 */
export const ApiSettingsStateGet200ResponseSettingsTunnelEnabledEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type ApiSettingsStateGet200ResponseSettingsTunnelEnabledEnum = typeof ApiSettingsStateGet200ResponseSettingsTunnelEnabledEnum[keyof typeof ApiSettingsStateGet200ResponseSettingsTunnelEnabledEnum];

/**
 * 
 * @export
 * @interface ApiWifiConnectPost200Response
 */
export interface ApiWifiConnectPost200Response {
    /**
     * 
     * @type {object}
     * @memberof ApiWifiConnectPost200Response
     */
    ssid?: object;
    /**
     * 
     * @type {object}
     * @memberof ApiWifiConnectPost200Response
     */
    stationStatus?: object;
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
     * @type {Array<ApiWifiScanGet200ResponseApInner>}
     * @memberof ApiWifiScanGet200Response
     */
    ap?: Array<ApiWifiScanGet200ResponseApInner>;
}
/**
 * 
 * @export
 * @interface ApiWifiScanGet200ResponseApInner
 */
export interface ApiWifiScanGet200ResponseApInner {
    /**
     * SSID (name) of found network
     * @type {string}
     * @memberof ApiWifiScanGet200ResponseApInner
     */
    ssid?: string;
    /**
     * <br>**Signal strength** of found network, where:<br> <table> <tr> <td>From:</td> <td>To:</td> <td>Description:</td> </tr> <tr> <td>**-67**</td> <td>**0**</td> <td>Very good</td> </tr> <tr> <td>**-73**</td> <td>**-68**</td> <td>Good</td> </tr> <tr> <td>**-80**</td> <td>**-74**</td> <td>Poor</td> </tr> <tr> <td>**-127**</td> <td>**-81**</td> <td>Unstable/Unusable</td> </tr> </table>
     * @type {number}
     * @memberof ApiWifiScanGet200ResponseApInner
     */
    rssi?: number;
    /**
     * <br>**Encryption mode** of found network, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>Open network (without password) - unsafe, but can be used</td> </tr> <tr> <td>**1**</td> <td>WEP encryption - unsafe - can not be used</td> </tr> <tr> <td>**2**</td> <td>WPA encryption - unsafe - can not be used</td> </tr> <tr> <td>**3**</td> <td>WPA2 encryption - safe if properly configured - can be used (recomended)</td> </tr> <tr> <td>**4**</td> <td>WPA/WPA2 encryption - unsafe, but can be used as WPA2</td> </tr> </table>
     * @type {ApiWifiScanGet200ResponseApInnerEncEnum}
     * @memberof ApiWifiScanGet200ResponseApInner
     */
    enc?: ApiWifiScanGet200ResponseApInnerEncEnum;
}


/**
 * @export
 */
export const ApiWifiScanGet200ResponseApInnerEncEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3,
    NUMBER_4: 4,
    NUMBER_5: 5
} as const;
export type ApiWifiScanGet200ResponseApInnerEncEnum = typeof ApiWifiScanGet200ResponseApInnerEncEnum[keyof typeof ApiWifiScanGet200ResponseApInnerEncEnum];

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
     * <br>Status of current **WiFi connection**, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>Not configured</td> </tr> <tr> <td>**1**</td> <td>Connecting</td> </tr> <tr> <td>**2**</td> <td>Wrong password</td> </tr> <tr> <td>**3**</td> <td>WiFi network not found</td> </tr> <tr> <td>**4**</td> <td>Communication with WiFi network failed</td> </tr> <tr> <td>**5**</td> <td>Connected</td> </tr> </table>
     * @type {ApiWifiStatusGet200ResponseStationStatusEnum}
     * @memberof ApiWifiStatusGet200Response
     */
    stationStatus?: ApiWifiStatusGet200ResponseStationStatusEnum;
}


/**
 * @export
 */
export const ApiWifiStatusGet200ResponseStationStatusEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3,
    NUMBER_4: 4,
    NUMBER_5: 5
} as const;
export type ApiWifiStatusGet200ResponseStationStatusEnum = typeof ApiWifiStatusGet200ResponseStationStatusEnum[keyof typeof ApiWifiStatusGet200ResponseStationStatusEnum];

/**
 * Module "forTime" which contain parameters of this functionality. **Requires** **state == 1 (ON)**
 * @export
 * @interface ForTime
 */
export interface ForTime {
    /**
     * Time in **seconds**
     * @type {number}
     * @memberof ForTime
     */
    timeS: number;
    /**
     * 
     * @type {Ns}
     * @memberof ForTime
     */
    ns: Ns;
}


/**
 * 
 * @export
 * @interface InfoGet200Response
 */
export interface InfoGet200Response {
    /**
     * 
     * @type {InfoGet200ResponseDevice}
     * @memberof InfoGet200Response
     */
    device?: InfoGet200ResponseDevice;
}
/**
 * **General** information about device
 * @export
 * @interface InfoGet200ResponseDevice
 */
export interface InfoGet200ResponseDevice {
    /**
     * 
     * @type {DeviceName}
     * @memberof InfoGet200ResponseDevice
     */
    deviceName?: DeviceName;
    /**
     * Product name for informational purpose only - do not use it in any application logic
     * @type {string}
     * @memberof InfoGet200ResponseDevice
     */
    product?: string;
    /**
     * **API type** of BleBox device - it indicate what **device-specific API** should be used
     * @type {string}
     * @memberof InfoGet200ResponseDevice
     */
    type?: string;
    /**
     * **API level** of BleBox device - it indicate what version of **common and device-specific API** should be used
     * @type {string}
     * @memberof InfoGet200ResponseDevice
     */
    apiLevel?: string;
    /**
     * Hardware version for informational purpose only - do not use it in any application logic
     * @type {string}
     * @memberof InfoGet200ResponseDevice
     */
    hv?: string;
    /**
     * Firmware version for informational purpose only - do not use it in any application logic
     * @type {string}
     * @memberof InfoGet200ResponseDevice
     */
    fv?: string;
    /**
     * Unique identification number of BleBox device
     * @type {string}
     * @memberof InfoGet200ResponseDevice
     */
    id?: string;
    /**
     * 
     * @type {object}
     * @memberof InfoGet200ResponseDevice
     */
    ip?: object;
}

/**
 * <br>**Next state** after previous action (e.g. set for time), where: <br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>OFF</td> </tr> </table>
 * @export
 */
export const Ns = {
    NUMBER_0: 0
} as const;
export type Ns = typeof Ns[keyof typeof Ns];


/**
 * <br>**Relation between output relays**, where: <br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>independent outputs</td> </tr> <tr> <td>**1**</td> <td>push-pull outputs (only one at a time can be enabled)</td> </tr> </table>
 * @export
 */
export const OutputMode = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type OutputMode = typeof OutputMode[keyof typeof OutputMode];

/**
 * 
 * @export
 * @interface PowerConsumption
 */
export interface PowerConsumption {
    /**
     * Period of measurement in seconds - applies to the "value" field.
     * @type {number}
     * @memberof PowerConsumption
     */
    periodS?: number;
    /**
     * **Energy consuption** in **kWh**. Always 3 decimal places
     * @type {number}
     * @memberof PowerConsumption
     */
    value?: number;
}
/**
 * Informations from **power measuring module**, see also section **sensor** for **activePower** sensor data. If hardware doesn't support power measuring then always **"enabled" == 0**
 * @export
 * @interface PowerMeasuring
 */
export interface PowerMeasuring {
    /**
     * <br>Indicates whether **the function is disabled or enabled**, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>disabled</td> </tr> <tr> <td>**1**</td> <td>enabled</td> </tr> </table>
     * @type {PowerMeasuringEnabledEnum}
     * @memberof PowerMeasuring
     */
    enabled?: PowerMeasuringEnabledEnum;
    /**
     * **Energy consumption** from the last time period. If field **"enabled" == 0** then **array doesn't exist**.
     * @type {Array<PowerConsumption>}
     * @memberof PowerMeasuring
     */
    powerConsumption?: Array<PowerConsumption>;
}


/**
 * @export
 */
export const PowerMeasuringEnabledEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type PowerMeasuringEnabledEnum = typeof PowerMeasuringEnabledEnum[keyof typeof PowerMeasuringEnabledEnum];


/**
 * **ID** - relay number
 * @export
 */
export const Relay = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type Relay = typeof Relay[keyof typeof Relay];

/**
 * Sensor and measurement information
 * @export
 * @interface Sensor
 */
export interface Sensor {
    /**
     * 
     * @type {SensorType}
     * @memberof Sensor
     */
    type?: SensorType;
    /**
     * Current value of measurement - **power of connected device** (active power counted in Watt)
     * @type {number}
     * @memberof Sensor
     */
    value?: number;
    /**
     * 
     * @type {SensorTrend}
     * @memberof Sensor
     */
    trend?: SensorTrend;
    /**
     * 
     * @type {SensorState}
     * @memberof Sensor
     */
    state?: SensorState;
}



/**
 * <br>**Status of sensor**, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**4**</td> <td>Active mode without error reporting (if 4 occurs then it is always 4)</td> </tr> <table>
 * @export
 */
export const SensorState = {
    NUMBER_4: 4
} as const;
export type SensorState = typeof SensorState[keyof typeof SensorState];


/**
 * Trend - not used, always 0
 * @export
 */
export const SensorTrend = {
    NUMBER_0: 0
} as const;
export type SensorTrend = typeof SensorTrend[keyof typeof SensorTrend];


/**
 * **Type** of power measurement
 * @export
 */
export const SensorType = {
    ActivePower: 'activePower'
} as const;
export type SensorType = typeof SensorType[keyof typeof SensorType];


/**
 * <br>**State of relay after reebot/reset** (power outage), where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>OFF</td> </tr> <tr> <td>**1**</td> <td>ON</td> </tr> <tr> <td>**2**</td> <td>Last state</td> </tr> <tr> <td>**3**</td> <td>Opposed state</td> </tr> </table>
 * @export
 */
export const StateAfterRestart = {
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3
} as const;
export type StateAfterRestart = typeof StateAfterRestart[keyof typeof StateAfterRestart];

/**
 * 
 * @export
 * @interface StateExtendedGet200Response
 */
export interface StateExtendedGet200Response {
    /**
     * List of **relays state** with **additional information**
     * @type {Array<StateExtendedGet200ResponseRelaysInner>}
     * @memberof StateExtendedGet200Response
     */
    relays?: Array<StateExtendedGet200ResponseRelaysInner>;
    /**
     * 
     * @type {PowerMeasuring}
     * @memberof StateExtendedGet200Response
     */
    powerMeasuring?: PowerMeasuring;
    /**
     * **List of active sensors**. If there is no active sensors then array doesn't exist
     * @type {Array<Sensor>}
     * @memberof StateExtendedGet200Response
     */
    sensors?: Array<Sensor>;
}
/**
 * 
 * @export
 * @interface StateExtendedGet200ResponseRelaysInner
 */
export interface StateExtendedGet200ResponseRelaysInner {
    /**
     * 
     * @type {Relay}
     * @memberof StateExtendedGet200ResponseRelaysInner
     */
    relay?: Relay;
    /**
     * 
     * @type {StateGet}
     * @memberof StateExtendedGet200ResponseRelaysInner
     */
    state?: StateGet;
    /**
     * 
     * @type {StateAfterRestart}
     * @memberof StateExtendedGet200ResponseRelaysInner
     */
    stateAfterRestart?: StateAfterRestart;
    /**
     * Time in **seconds** **for button** "turn on for time" in wBox App, where **0 == disabled button**
     * @type {number}
     * @memberof StateExtendedGet200ResponseRelaysInner
     */
    defaultForTime?: number;
    /**
     * **Name of output**
     * @type {string}
     * @memberof StateExtendedGet200ResponseRelaysInner
     */
    name?: string;
}



/**
 * <br>Parameter that show **state of relay**, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>OFF</td> </tr> <tr> <td>**1**</td> <td>ON</td> </tr> </table>
 * @export
 */
export const StateGet = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type StateGet = typeof StateGet[keyof typeof StateGet];

/**
 * 
 * @export
 * @interface StateGet200Response
 */
export interface StateGet200Response {
    /**
     * List of **relays state**
     * @type {Array<StateGet200ResponseRelaysInner>}
     * @memberof StateGet200Response
     */
    relays?: Array<StateGet200ResponseRelaysInner>;
}
/**
 * 
 * @export
 * @interface StateGet200ResponseRelaysInner
 */
export interface StateGet200ResponseRelaysInner {
    /**
     * 
     * @type {Relay}
     * @memberof StateGet200ResponseRelaysInner
     */
    relay?: Relay;
    /**
     * 
     * @type {StateGet}
     * @memberof StateGet200ResponseRelaysInner
     */
    state?: StateGet;
}


/**
 * 
 * @export
 * @interface StatePostRequest
 */
export interface StatePostRequest {
    /**
     * List of relays state
     * @type {Array<StatePostRequestRelaysInner>}
     * @memberof StatePostRequest
     */
    relays?: Array<StatePostRequestRelaysInner>;
}
/**
 * 
 * @export
 * @interface StatePostRequestRelaysInner
 */
export interface StatePostRequestRelaysInner {
    /**
     * 
     * @type {Relay}
     * @memberof StatePostRequestRelaysInner
     */
    relay: Relay;
    /**
     * 
     * @type {StateSet}
     * @memberof StatePostRequestRelaysInner
     */
    state: StateSet;
    /**
     * 
     * @type {ForTime}
     * @memberof StatePostRequestRelaysInner
     */
    forTime?: ForTime;
}



/**
 * <br>**Set state** of relay, where:<br> <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>OFF</td> </tr> <tr> <td>**1**</td> <td>ON</td> </tr> <tr> <td>**2**</td> <td>Toggle (change to the opposite)</td> </tr> </table>
 * @export
 */
export const StateSet = {
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2
} as const;
export type StateSet = typeof StateSet[keyof typeof StateSet];

/**
 * Order of outputs and operating mode
 * @export
 * @interface Switch
 */
export interface Switch {
    /**
     * 
     * @type {OutputMode}
     * @memberof Switch
     */
    outputMode: OutputMode;
    /**
     * **Logical order of outputs**
     * @type {Array<number>}
     * @memberof Switch
     */
    outputOrder?: Array<number>;
}


