// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/**
 * 
 * @export
 * @interface ApiDevicesProbePost200Response
 */
export interface ApiDevicesProbePost200Response {
    /**
     * 
     * @type {ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice}
     * @memberof ApiDevicesProbePost200Response
     */
    device: ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice;
}
/**
 * 
 * @export
 * @interface ApiDevicesProbePost400Response
 */
export interface ApiDevicesProbePost400Response {
    /**
     * 
     * @type {string}
     * @memberof ApiDevicesProbePost400Response
     */
    code: string;
    /**
     * 
     * @type {string}
     * @memberof ApiDevicesProbePost400Response
     */
    message: string;
}
/**
 * 
 * @export
 * @interface ApiDevicesProbePostRequest
 */
export interface ApiDevicesProbePostRequest {
    /**
     * 
     * @type {string}
     * @memberof ApiDevicesProbePostRequest
     */
    ip: string;
}
/**
 * 
 * @export
 * @interface ApiDiscoveryDevicesGet200Response
 */
export interface ApiDiscoveryDevicesGet200Response {
    /**
     * 
     * @type {boolean}
     * @memberof ApiDiscoveryDevicesGet200Response
     */
    scanning: boolean;
    /**
     * 
     * @type {Array<ApiDiscoveryDevicesGet200ResponseDevicesInner>}
     * @memberof ApiDiscoveryDevicesGet200Response
     */
    devices: Array<ApiDiscoveryDevicesGet200ResponseDevicesInner>;
}
/**
 * 
 * @export
 * @interface ApiDiscoveryDevicesGet200ResponseDevicesInner
 */
export interface ApiDiscoveryDevicesGet200ResponseDevicesInner {
    /**
     * 
     * @type {string}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInner
     */
    ip: string;
    /**
     * 
     * @type {ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInner
     */
    device: ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice;
    /**
     * 
     * @type {string}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInner
     */
    discoveredAt: string;
}
/**
 * 
 * @export
 * @interface ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice
 */
export interface ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice {
    /**
     * 
     * @type {string}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice
     */
    deviceName: string;
    /**
     * 
     * @type {string}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice
     */
    type: string;
    /**
     * 
     * @type {string}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice
     */
    product?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice
     */
    hv?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice
     */
    fv?: string;
    /**
     * 
     * @type {number}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice
     */
    universe?: number;
    /**
     * 
     * @type {ApiDiscoveryDevicesGet200ResponseDevicesInnerDeviceApiLevel}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice
     */
    apiLevel?: ApiDiscoveryDevicesGet200ResponseDevicesInnerDeviceApiLevel;
    /**
     * 
     * @type {Array<number>}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice
     */
    categories?: Array<number>;
    /**
     * 
     * @type {string}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice
     */
    ip?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiDiscoveryDevicesGet200ResponseDevicesInnerDevice
     */
    availableFv?: string | null;
}
/**
 * 
 * @export
 * @interface ApiDiscoveryDevicesGet200ResponseDevicesInnerDeviceApiLevel
 */
export interface ApiDiscoveryDevicesGet200ResponseDevicesInnerDeviceApiLevel {
}
/**
 * 
 * @export
 * @interface ApiDiscoveryStartPost202Response
 */
export interface ApiDiscoveryStartPost202Response {
    /**
     * 
     * @type {boolean}
     * @memberof ApiDiscoveryStartPost202Response
     */
    scanning: boolean;
}
/**
 * 
 * @export
 * @interface ApiHealthGet200Response
 */
export interface ApiHealthGet200Response {
    /**
     * 
     * @type {ApiHealthGet200ResponseStatusEnum}
     * @memberof ApiHealthGet200Response
     */
    status: ApiHealthGet200ResponseStatusEnum;
    /**
     * 
     * @type {number}
     * @memberof ApiHealthGet200Response
     */
    uptimeS: number;
}


/**
 * @export
 */
export const ApiHealthGet200ResponseStatusEnum = {
    Ok: 'ok'
} as const;
export type ApiHealthGet200ResponseStatusEnum = typeof ApiHealthGet200ResponseStatusEnum[keyof typeof ApiHealthGet200ResponseStatusEnum];

