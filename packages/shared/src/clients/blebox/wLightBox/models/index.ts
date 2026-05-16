// @ts-nocheck
/* tslint:disable */
/* eslint-disable */

/**
 * As the name of field says<br><br> **inc** or **dec** to increase or decrease brightness
 * @export
 */
export const Adjust = {
    Inc: 'inc',
    Dec: 'dec'
} as const;
export type Adjust = typeof Adjust[keyof typeof Adjust];

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
 * @interface ApiRgbwExtendedSetPostRequest
 */
export interface ApiRgbwExtendedSetPostRequest {
    /**
     * 
     * @type {ApiRgbwExtendedSetPostRequestRgbw}
     * @memberof ApiRgbwExtendedSetPostRequest
     */
    rgbw?: ApiRgbwExtendedSetPostRequestRgbw;
}
/**
 * An object which contain **extended parameters** related with **LED lighting**
 * @export
 * @interface ApiRgbwExtendedSetPostRequestRgbw
 */
export interface ApiRgbwExtendedSetPostRequestRgbw {
    /**
     * **No (ID) of Effect**, where <table> <tr> <td>Value:</td> <td>Decription:</td> <tr> <td>**0**</td> <td>**None Effect** - Disable current effect and restore previous state</td> </tr> <tr> <td>**>0**</td> <td>**Effect** - Turn on selected effect **(if exist)**</td> </tr> </table>
     * @type {number}
     * @memberof ApiRgbwExtendedSetPostRequestRgbw
     */
    effectID?: number;
    /**
     * **Color value in format: 4 channels (R)(G)(B)(W) or 1 channel (S)**, where <br> every channel can get value between: **00-FF** (HEX) *(DEC: 0-255)*<br><br> **Use "--"** instead hex value **to keep channel unchanged** - e.g. ff00--12.
     * @type {string}
     * @memberof ApiRgbwExtendedSetPostRequestRgbw
     */
    desiredColor?: string;
    /**
     * 
     * @type {DurationsMs}
     * @memberof ApiRgbwExtendedSetPostRequestRgbw
     */
    durationsMs?: DurationsMs;
    /**
     * 
     * @type {FavColors}
     * @memberof ApiRgbwExtendedSetPostRequestRgbw
     */
    favColors?: FavColors;
}
/**
 * 
 * @export
 * @interface ApiRgbwExtendedStateGet200Response
 */
export interface ApiRgbwExtendedStateGet200Response {
    /**
     * 
     * @type {ApiRgbwExtendedStateGet200ResponseRgbw}
     * @memberof ApiRgbwExtendedStateGet200Response
     */
    rgbw?: ApiRgbwExtendedStateGet200ResponseRgbw;
}
/**
 * An object containing **extended parameters** related with **LED lighting**
 * @export
 * @interface ApiRgbwExtendedStateGet200ResponseRgbw
 */
export interface ApiRgbwExtendedStateGet200ResponseRgbw {
    /**
     * 
     * @type {ColorMode}
     * @memberof ApiRgbwExtendedStateGet200ResponseRgbw
     */
    colorMode?: ColorMode;
    /**
     * **No (ID) of Effect**, where <table> <tr> <td>Value:</td> <td>Decription:</td> <tr> <td>**0**</td> <td>**None Effect** - Disable current effect and restore previous state</td> </tr> <tr> <td>**>0**</td> <td>**Effect** - Turn on selected effect **(if exist)**</td> </tr> </table>
     * @type {number}
     * @memberof ApiRgbwExtendedStateGet200ResponseRgbw
     */
    effectID?: number;
    /**
     * As the name of field says<br><br> **Color value in format: 4 channels (R)(G)(B)(W) or 1 channel (S)**, where <br> every channel can get value between: **00-FF** (HEX) *(DEC: 0-255)*
     * @type {string}
     * @memberof ApiRgbwExtendedStateGet200ResponseRgbw
     */
    desiredColor?: string;
    /**
     * As the name of field says<br><br> **Color value in format: 4 channels (R)(G)(B)(W) or 1 channel (S)**, where <br> every channel can get value between: **00-FF** (HEX) *(DEC: 0-255)*
     * @type {string}
     * @memberof ApiRgbwExtendedStateGet200ResponseRgbw
     */
    currentColor?: string;
    /**
     * As the name of field says<br><br> **Color value in format: 4 channels (R)(G)(B)(W) or 1 channel (S)**, where <br> every channel can get value between: **00-FF** (HEX) *(DEC: 0-255)*
     * @type {string}
     * @memberof ApiRgbwExtendedStateGet200ResponseRgbw
     */
    lastOnColor?: string;
    /**
     * 
     * @type {DurationsMs}
     * @memberof ApiRgbwExtendedStateGet200ResponseRgbw
     */
    durationsMs?: DurationsMs;
    /**
     * 
     * @type {EffectNames}
     * @memberof ApiRgbwExtendedStateGet200ResponseRgbw
     */
    effectNames?: EffectNames;
    /**
     * 
     * @type {FavColors}
     * @memberof ApiRgbwExtendedStateGet200ResponseRgbw
     */
    favColors?: FavColors;
}


/**
 * 
 * @export
 * @interface ApiRgbwSetPostRequest
 */
export interface ApiRgbwSetPostRequest {
    /**
     * 
     * @type {ApiRgbwSetPostRequestRgbw}
     * @memberof ApiRgbwSetPostRequest
     */
    rgbw?: ApiRgbwSetPostRequestRgbw;
}
/**
 * An object which contain parameters related with **LED lighting**
 * @export
 * @interface ApiRgbwSetPostRequestRgbw
 */
export interface ApiRgbwSetPostRequestRgbw {
    /**
     * **No (ID) of Effect**, where <table> <tr> <td>Value:</td> <td>Decription:</td> <tr> <td>**0**</td> <td>**None Effect** - Disable current effect and restore previous state</td> </tr> <tr> <td>**>0**</td> <td>**Effect** - Turn on selected effect **(if exist)**</td> </tr> </table>
     * @type {number}
     * @memberof ApiRgbwSetPostRequestRgbw
     */
    effectID?: number;
    /**
     * **Color value in format: 4 channels (R)(G)(B)(W) or 1 channel (S)**, where <br> every channel can get value between: **00-FF** (HEX) *(DEC: 0-255)*<br><br> **Use "--"** instead hex value **to keep channel unchanged** - e.g. ff00--12.
     * @type {string}
     * @memberof ApiRgbwSetPostRequestRgbw
     */
    desiredColor?: string;
    /**
     * 
     * @type {DurationsMs}
     * @memberof ApiRgbwSetPostRequestRgbw
     */
    durationsMs?: DurationsMs;
}
/**
 * 
 * @export
 * @interface ApiRgbwStateGet200Response
 */
export interface ApiRgbwStateGet200Response {
    /**
     * 
     * @type {ApiRgbwStateGet200ResponseRgbw}
     * @memberof ApiRgbwStateGet200Response
     */
    rgbw?: ApiRgbwStateGet200ResponseRgbw;
}
/**
 * An object containing parameters related with **LED lighting**
 * @export
 * @interface ApiRgbwStateGet200ResponseRgbw
 */
export interface ApiRgbwStateGet200ResponseRgbw {
    /**
     * 
     * @type {ColorMode}
     * @memberof ApiRgbwStateGet200ResponseRgbw
     */
    colorMode?: ColorMode;
    /**
     * **No (ID) of Effect**, where <table> <tr> <td>Value:</td> <td>Decription:</td> <tr> <td>**0**</td> <td>**None Effect** - Disable current effect and restore previous state</td> </tr> <tr> <td>**>0**</td> <td>**Effect** - Turn on selected effect **(if exist)**</td> </tr> </table>
     * @type {number}
     * @memberof ApiRgbwStateGet200ResponseRgbw
     */
    effectID?: number;
    /**
     * As the name of field says<br><br> **Color value in format: 4 channels (R)(G)(B)(W) or 1 channel (S)**, where <br> every channel can get value between: **00-FF** (HEX) *(DEC: 0-255)*
     * @type {string}
     * @memberof ApiRgbwStateGet200ResponseRgbw
     */
    desiredColor?: string;
    /**
     * As the name of field says<br><br> **Color value in format: 4 channels (R)(G)(B)(W) or 1 channel (S)**, where <br> every channel can get value between: **00-FF** (HEX) *(DEC: 0-255)*
     * @type {string}
     * @memberof ApiRgbwStateGet200ResponseRgbw
     */
    currentColor?: string;
    /**
     * As the name of field says<br><br> **Color value in format: 4 channels (R)(G)(B)(W) or 1 channel (S)**, where <br> every channel can get value between: **00-FF** (HEX) *(DEC: 0-255)*
     * @type {string}
     * @memberof ApiRgbwStateGet200ResponseRgbw
     */
    lastOnColor?: string;
    /**
     * 
     * @type {DurationsMs}
     * @memberof ApiRgbwStateGet200ResponseRgbw
     */
    durationsMs?: DurationsMs;
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
 * An object which contain **specific settings**
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
     * @type {ApiSettingsSetPostRequestSettingsRgbw}
     * @memberof ApiSettingsSetPostRequestSettings
     */
    rgbw?: ApiSettingsSetPostRequestSettingsRgbw;
}
/**
 * An object which contain **specific settings**
 * @export
 * @interface ApiSettingsSetPostRequestSettingsRgbw
 */
export interface ApiSettingsSetPostRequestSettingsRgbw {
    /**
     * 
     * @type {PwmFreq}
     * @memberof ApiSettingsSetPostRequestSettingsRgbw
     */
    pwmFreq?: PwmFreq;
    /**
     * 
     * @type {ColorMode}
     * @memberof ApiSettingsSetPostRequestSettingsRgbw
     */
    colorMode?: ColorMode;
    /**
     * 
     * @type {OutputMode}
     * @memberof ApiSettingsSetPostRequestSettingsRgbw
     */
    outputMode?: OutputMode;
    /**
     * 
     * @type {ButtonMode}
     * @memberof ApiSettingsSetPostRequestSettingsRgbw
     */
    buttonMode?: ButtonMode;
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
 * An object which contain **specific settings**
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
     * @type {ApiSettingsStateGet200ResponseSettingsRgbw}
     * @memberof ApiSettingsStateGet200ResponseSettings
     */
    rgbw?: ApiSettingsStateGet200ResponseSettingsRgbw;
}
/**
 * An object which contain **specific settings**
 * @export
 * @interface ApiSettingsStateGet200ResponseSettingsRgbw
 */
export interface ApiSettingsStateGet200ResponseSettingsRgbw {
    /**
     * 
     * @type {ColorMode}
     * @memberof ApiSettingsStateGet200ResponseSettingsRgbw
     */
    colorMode?: ColorMode;
    /**
     * 
     * @type {OutputMode}
     * @memberof ApiSettingsStateGet200ResponseSettingsRgbw
     */
    outputMode?: OutputMode;
    /**
     * 
     * @type {PwmFreq}
     * @memberof ApiSettingsStateGet200ResponseSettingsRgbw
     */
    pwmFreq?: PwmFreq;
    /**
     * 
     * @type {ButtonMode}
     * @memberof ApiSettingsStateGet200ResponseSettingsRgbw
     */
    buttonMode?: ButtonMode;
    /**
     * **Values of settings which are allowed by controller** (hardware/firmware version) <br> *(Parameters needed to display settings page in user interface)*
     * @type {Array<FieldsPreferencesInner>}
     * @memberof ApiSettingsStateGet200ResponseSettingsRgbw
     */
    fieldsPreferences?: Array<FieldsPreferencesInner>;
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
 * Allows to **enable or disable** connection with **BleBox's tunnel/cloud/servers**
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
 * **Behaviour of connected button**, where: <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**0**</td> <td>**None**</td> </tr> <tr> <td>**1**</td> <td>**on - off (100%)**</td> </tr> <tr> <td>**2**</td> <td>**on - off (last brightness)**</td> </tr> <tr> <td>**3**</td> <td>**on - off (100%) with dimming**</td> </tr> <tr> <td>**4**</td> <td>**on - off (last brightness) with dimming**</td> </tr> </table> <br><br> *Warring: This settings is available only in controllers with button input. Allowed buttonMode depends from hardware/firmware version (field preferences)*
 * @export
 */
export const ButtonMode = {
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3,
    NUMBER_4: 4
} as const;
export type ButtonMode = typeof ButtonMode[keyof typeof ButtonMode];


/**
 * **Time of transition from current color to desired color** measured in **milliseconds** <br> (full scale: 0x00 -> 0xff)
 * @export
 */
export const ColorFade = {
    NUMBER_0: 0
} as const;
export type ColorFade = typeof ColorFade[keyof typeof ColorFade];


/**
 * **Type of controlled appliance** (type and quantity of LED strips), where: <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**1**</td> <td>**RGBW**</td> </tr> <tr> <td>**2**</td> <td>**RGB**</td> </tr> <tr> <td>**3**</td> <td>**MONO** - 4 separated channel (LED strips)</td> </tr> <tr> <td>**4**</td> <td>**RGB or W**<br> * RGBW but with exceptive parts: color (RGB) and white (W), where <br> white (W) part has priority*</td> </tr> <tr> <td>**5**</td> <td>**CT** (color temperature)  <br> *For one 2-channel LED strips <br> (warm white - 1:(R); cold white - 1:(G))*</td> </tr> <tr> <td>**6**</td> <td>**CTx2** - 2 separated LED strips (color temperature) <br> *For two separated 2-channel LED strips <br> (warm white - 1:(R),2:(B); cold white - 1:(G),2:(W))*</td> </tr> </table> <br><br> *Warring: This settings is available only in 4-channels controllers. Allowed colorMode depends on hardware/firmware version (field preferences)*
 * @export
 */
export const ColorMode = {
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3,
    NUMBER_4: 4,
    NUMBER_5: 5,
    NUMBER_6: 6
} as const;
export type ColorMode = typeof ColorMode[keyof typeof ColorMode];

/**
 * Object which contain parameters connected with **transitions of color and effects**
 * @export
 * @interface DurationsMs
 */
export interface DurationsMs {
    /**
     * 
     * @type {ColorFade}
     * @memberof DurationsMs
     */
    colorFade?: ColorFade;
    /**
     * 
     * @type {EffectFade}
     * @memberof DurationsMs
     */
    effectFade?: EffectFade;
    /**
     * 
     * @type {EffectStep}
     * @memberof DurationsMs
     */
    effectStep?: EffectStep;
}



/**
 * **Time of color transition in current effect** measured in milliseconds <br> (full scale: 0x00 -> 0xff, value will be overwritten at beginning of another effect to default value of selected effect)
 * @export
 */
export const EffectFade = {
    NUMBER_0: 0
} as const;
export type EffectFade = typeof EffectFade[keyof typeof EffectFade];

/**
 * **Dictionary of effects** saved on device <br> *(Parameters needed to display effects in user interface)*
 * @export
 * @interface EffectNames
 */
export interface EffectNames {
    /**
     * Key, effect ID, 0 as none
     * @type {number}
     * @memberof EffectNames
     */
    id: number;
    /**
     * Name of effect
     * @type {string}
     * @memberof EffectNames
     */
    value: string;
}

/**
 * **Duration of step (color) in current effect** measured in milliseconds <br> (value will be overwritten at beginning of another effect to default value of selected effect)
 * @export
 */
export const EffectStep = {
    NUMBER_0: 0
} as const;
export type EffectStep = typeof EffectStep[keyof typeof EffectStep];

/**
 * **Dictionary of favorite colors** saved on device<br> *(Parameters needed to display favorite colors in user interface)*
 * @export
 * @interface FavColors
 */
export interface FavColors {
    /**
     * *Key, (ID)*
     * @type {string}
     * @memberof FavColors
     */
    id: string;
    /**
     * As the name of field says<br><br> **Color value in format: 4 channels (R)(G)(B)(W) or 1 channel (S)**, where <br> every channel can get value between: **00-FF** (HEX) *(DEC: 0-255)*
     * @type {string}
     * @memberof FavColors
     */
    value: string;
}
/**
 * 
 * @export
 * @interface FieldsPreferencesInner
 */
export interface FieldsPreferencesInner {
    /**
     * Name of field
     * @type {string}
     * @memberof FieldsPreferencesInner
     */
    fieldName?: string;
    /**
     * List of allowed values ​​in this field
     * @type {Array<string>}
     * @memberof FieldsPreferencesInner
     */
    values?: Array<string>;
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
 * **Type of output signal** (depend on controlled LED strip/module), where: <table> <tr> <td>Enum:</td> <td>Description:</td> </tr> <tr> <td>**1**</td> <td>**linearizedPWM**</td> </tr> <tr> <td>**2**</td> <td>**linearizedAndInvertedPWM**</td> </tr> <tr> <td>**3**</td> <td>**linePWM**</td> </tr> <tr> <td>**4**</td> <td>**linearizedCcPWM**</td> </tr> </table> <br><br> *Warring: This settings is available only in 1-channels controllers. Allowed outputMode depends from hardware/firmware version (field preferences)*
 * @export
 */
export const OutputMode = {
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3,
    NUMBER_4: 4
} as const;
export type OutputMode = typeof OutputMode[keyof typeof OutputMode];


/**
 * **Frequency of LED dimming**. **Useful for filmmakers**. <br> Allowed frequencies depends from hardware/firmware version (field preferences)<br> Frequencies over 1200Hz (not exist in field preferences) and can be set only via API!
 * @export
 */
export const PwmFreq = {
    NUMBER_486: 486,
    NUMBER_600: 600,
    NUMBER_1200: 1200,
    NUMBER_2400: 2400,
    NUMBER_4800: 4800
} as const;
export type PwmFreq = typeof PwmFreq[keyof typeof PwmFreq];

