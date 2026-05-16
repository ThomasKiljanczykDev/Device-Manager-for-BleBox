# DiscoveryApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiDiscoveryDevicesGet**](DiscoveryApi.md#apidiscoverydevicesget) | **GET** /api/discovery/devices | Currently discovered BleBox devices |
| [**apiDiscoveryStartPost**](DiscoveryApi.md#apidiscoverystartpost) | **POST** /api/discovery/start | Start an mDNS + subnet scan |
| [**apiDiscoveryStopPost**](DiscoveryApi.md#apidiscoverystoppost) | **POST** /api/discovery/stop | Stop scanning |



## apiDiscoveryDevicesGet

> ApiDiscoveryDevicesGet200Response apiDiscoveryDevicesGet()

Currently discovered BleBox devices

### Example

```ts
import {
  Configuration,
  DiscoveryApi,
} from '';
import type { ApiDiscoveryDevicesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DiscoveryApi();

  try {
    const data = await api.apiDiscoveryDevicesGet();
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

[**ApiDiscoveryDevicesGet200Response**](ApiDiscoveryDevicesGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Default Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiDiscoveryStartPost

> ApiDiscoveryStartPost202Response apiDiscoveryStartPost()

Start an mDNS + subnet scan

### Example

```ts
import {
  Configuration,
  DiscoveryApi,
} from '';
import type { ApiDiscoveryStartPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DiscoveryApi();

  try {
    const data = await api.apiDiscoveryStartPost();
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

[**ApiDiscoveryStartPost202Response**](ApiDiscoveryStartPost202Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Default Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiDiscoveryStopPost

> ApiDiscoveryStartPost202Response apiDiscoveryStopPost()

Stop scanning

### Example

```ts
import {
  Configuration,
  DiscoveryApi,
} from '';
import type { ApiDiscoveryStopPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DiscoveryApi();

  try {
    const data = await api.apiDiscoveryStopPost();
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

[**ApiDiscoveryStartPost202Response**](ApiDiscoveryStartPost202Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Default Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

