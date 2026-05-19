# GeneralApi

All URIs are relative to *http://192.168.4.1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiDeviceStateGet**](GeneralApi.md#apidevicestateget) | **GET** /api/device/state | Information about device |
| [**apiDeviceUptimeGet**](GeneralApi.md#apideviceuptimeget) | **GET** /api/device/uptime | Device upTime |
| [**apiOtaUpdatePost**](GeneralApi.md#apiotaupdatepost) | **POST** /api/ota/update | Perform firmware update |
| [**infoGet**](GeneralApi.md#infoget) | **GET** /info | Information about device |



## apiDeviceStateGet

> InfoGet200Response apiDeviceStateGet()

Information about device

Returns **general information** about device &lt;br&gt;&lt;br&gt;**It is deprecated** -&gt; look at:

### Example

```ts
import {
  Configuration,
  GeneralApi,
} from '';
import type { ApiDeviceStateGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new GeneralApi();

  try {
    const data = await api.apiDeviceStateGet();
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

[**InfoGet200Response**](InfoGet200Response.md)

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


## apiDeviceUptimeGet

> ApiDeviceUptimeGet200Response apiDeviceUptimeGet()

Device upTime

Returns information about **number of seconds from boot**

### Example

```ts
import {
  Configuration,
  GeneralApi,
} from '';
import type { ApiDeviceUptimeGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new GeneralApi();

  try {
    const data = await api.apiDeviceUptimeGet();
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

[**ApiDeviceUptimeGet200Response**](ApiDeviceUptimeGet200Response.md)

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


## apiOtaUpdatePost

> apiOtaUpdatePost()

Perform firmware update

**Perform firmware update**. Return conflict if update is in progress

### Example

```ts
import {
  Configuration,
  GeneralApi,
} from '';
import type { ApiOtaUpdatePostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new GeneralApi();

  try {
    const data = await api.apiOtaUpdatePost();
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
| **200** | OK |  -  |
| **409** | Conflict |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## infoGet

> InfoGet200Response infoGet()

Information about device

Returns **general information** about device

### Example

```ts
import {
  Configuration,
  GeneralApi,
} from '';
import type { InfoGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new GeneralApi();

  try {
    const data = await api.infoGet();
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

[**InfoGet200Response**](InfoGet200Response.md)

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

