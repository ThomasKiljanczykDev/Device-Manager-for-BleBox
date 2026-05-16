# NetworkApi

All URIs are relative to *http://192.168.4.1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiDeviceNetworkGet**](NetworkApi.md#apidevicenetworkget) | **GET** /api/device/network | Network information |
| [**apiDeviceSetPost**](NetworkApi.md#apidevicesetpostoperation) | **POST** /api/device/set | Set internal access Point\&#39;s settings |
| [**apiWifiConnectPost**](NetworkApi.md#apiwificonnectpostoperation) | **POST** /api/wifi/connect | Perform WiFi connect |
| [**apiWifiDisconnectPost**](NetworkApi.md#apiwifidisconnectpost) | **POST** /api/wifi/disconnect | Perform WiFi disconnect |
| [**apiWifiScanGet**](NetworkApi.md#apiwifiscanget) | **GET** /api/wifi/scan | Perform WiFi scan and get results |
| [**apiWifiStatusGet**](NetworkApi.md#apiwifistatusget) | **GET** /api/wifi/status | Local WiFi Status |



## apiDeviceNetworkGet

> ApiDeviceNetworkGet200Response apiDeviceNetworkGet()

Network information

Returns information about **internal WiFi AP** or about connected **local WiFi network**

### Example

```ts
import {
  Configuration,
  NetworkApi,
} from '';
import type { ApiDeviceNetworkGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NetworkApi();

  try {
    const data = await api.apiDeviceNetworkGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiDeviceNetworkGet200Response**](ApiDeviceNetworkGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiDeviceSetPost

> ApiDeviceSetPost200Response apiDeviceSetPost(apiDeviceSetPostRequest)

Set internal access Point\&#39;s settings

**Allows to set** interal access Point\&#39;s **ssid and password**. Allows also to **turn off internal AP**.

### Example

```ts
import {
  Configuration,
  NetworkApi,
} from '';
import type { ApiDeviceSetPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NetworkApi();

  const body = {
    // ApiDeviceSetPostRequest (optional)
    apiDeviceSetPostRequest: ...,
  } satisfies ApiDeviceSetPostOperationRequest;

  try {
    const data = await api.apiDeviceSetPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiDeviceSetPostRequest** | [ApiDeviceSetPostRequest](ApiDeviceSetPostRequest.md) |  | [Optional] |

### Return type

[**ApiDeviceSetPost200Response**](ApiDeviceSetPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiWifiConnectPost

> ApiWifiConnectPost200Response apiWifiConnectPost(apiWifiConnectPostRequest)

Perform WiFi connect

Perform connect to local WiFi network

### Example

```ts
import {
  Configuration,
  NetworkApi,
} from '';
import type { ApiWifiConnectPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NetworkApi();

  const body = {
    // ApiWifiConnectPostRequest (optional)
    apiWifiConnectPostRequest: ...,
  } satisfies ApiWifiConnectPostOperationRequest;

  try {
    const data = await api.apiWifiConnectPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiWifiConnectPostRequest** | [ApiWifiConnectPostRequest](ApiWifiConnectPostRequest.md) |  | [Optional] |

### Return type

[**ApiWifiConnectPost200Response**](ApiWifiConnectPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiWifiDisconnectPost

> apiWifiDisconnectPost()

Perform WiFi disconnect

**Perform disconnect** from current local **WiFi network**

### Example

```ts
import {
  Configuration,
  NetworkApi,
} from '';
import type { ApiWifiDisconnectPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NetworkApi();

  try {
    const data = await api.apiWifiDisconnectPost();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiWifiScanGet

> ApiWifiScanGet200Response apiWifiScanGet()

Perform WiFi scan and get results

**Perform WiFi scan** and **return list of found WiFi** networks. Return conflict if scanning is in progress

### Example

```ts
import {
  Configuration,
  NetworkApi,
} from '';
import type { ApiWifiScanGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NetworkApi();

  try {
    const data = await api.apiWifiScanGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiWifiScanGet200Response**](ApiWifiScanGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **409** | Conflict |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiWifiStatusGet

> ApiWifiStatusGet200Response apiWifiStatusGet()

Local WiFi Status

Returns information about **connected local WiFi network** and **if scanning is in progress** &lt;br&gt;&lt;br&gt;**It is deprecated** -&gt; look at:

### Example

```ts
import {
  Configuration,
  NetworkApi,
} from '';
import type { ApiWifiStatusGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NetworkApi();

  try {
    const data = await api.apiWifiStatusGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiWifiStatusGet200Response**](ApiWifiStatusGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

