# DevicesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiDevicesProbePost**](DevicesApi.md#apidevicesprobepostoperation) | **POST** /api/devices/probe | Probe a manually entered IP for a BleBox device |



## apiDevicesProbePost

> ApiDevicesProbePost200Response apiDevicesProbePost(apiDevicesProbePostRequest)

Probe a manually entered IP for a BleBox device

### Example

```ts
import {
  Configuration,
  DevicesApi,
} from '';
import type { ApiDevicesProbePostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DevicesApi();

  const body = {
    // ApiDevicesProbePostRequest
    apiDevicesProbePostRequest: ...,
  } satisfies ApiDevicesProbePostOperationRequest;

  try {
    const data = await api.apiDevicesProbePost(body);
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
| **apiDevicesProbePostRequest** | [ApiDevicesProbePostRequest](ApiDevicesProbePostRequest.md) |  | |

### Return type

[**ApiDevicesProbePost200Response**](ApiDevicesProbePost200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Default Response |  -  |
| **400** | Default Response |  -  |
| **502** | Default Response |  -  |
| **504** | Default Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

