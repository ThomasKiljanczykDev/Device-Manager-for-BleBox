# ControlStateApi

All URIs are relative to *http://192.168.4.1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiRgbwExtendedSetPost**](ControlStateApi.md#apirgbwextendedsetpostoperation) | **POST** /api/rgbw/extended/set | Set extended parameters of lighting |
| [**apiRgbwExtendedStateGet**](ControlStateApi.md#apirgbwextendedstateget) | **GET** /api/rgbw/extended/state | Extended parameters of lighting |
| [**apiRgbwSetPost**](ControlStateApi.md#apirgbwsetpostoperation) | **POST** /api/rgbw/set | Set state of lighting |
| [**apiRgbwStateGet**](ControlStateApi.md#apirgbwstateget) | **GET** /api/rgbw/state | State of lighting |



## apiRgbwExtendedSetPost

> ApiRgbwExtendedStateGet200Response apiRgbwExtendedSetPost(apiRgbwExtendedSetPostRequest)

Set extended parameters of lighting

Allows to **set state of lighting** - **effect, color, transition times**&lt;br&gt; Additionaly allows to set extended parameters - **favorite colors**&lt;br&gt;

### Example

```ts
import {
  Configuration,
  ControlStateApi,
} from '';
import type { ApiRgbwExtendedSetPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlStateApi();

  const body = {
    // ApiRgbwExtendedSetPostRequest (optional)
    apiRgbwExtendedSetPostRequest: ...,
  } satisfies ApiRgbwExtendedSetPostOperationRequest;

  try {
    const data = await api.apiRgbwExtendedSetPost(body);
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
| **apiRgbwExtendedSetPostRequest** | [ApiRgbwExtendedSetPostRequest](ApiRgbwExtendedSetPostRequest.md) |  | [Optional] |

### Return type

[**ApiRgbwExtendedStateGet200Response**](ApiRgbwExtendedStateGet200Response.md)

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


## apiRgbwExtendedStateGet

> ApiRgbwExtendedStateGet200Response apiRgbwExtendedStateGet()

Extended parameters of lighting

**Returns** information about **mode, selected effect, color, transition times**.&lt;br&gt; Additionaly returns **favorite colors** and **effects names**&lt;br&gt; *(All parameters needed to display user interface)*

### Example

```ts
import {
  Configuration,
  ControlStateApi,
} from '';
import type { ApiRgbwExtendedStateGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlStateApi();

  try {
    const data = await api.apiRgbwExtendedStateGet();
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

[**ApiRgbwExtendedStateGet200Response**](ApiRgbwExtendedStateGet200Response.md)

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


## apiRgbwSetPost

> ApiRgbwStateGet200Response apiRgbwSetPost(apiRgbwSetPostRequest)

Set state of lighting

Allows to **set desired color, effect and transition times**

### Example

```ts
import {
  Configuration,
  ControlStateApi,
} from '';
import type { ApiRgbwSetPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlStateApi();

  const body = {
    // ApiRgbwSetPostRequest (optional)
    apiRgbwSetPostRequest: ...,
  } satisfies ApiRgbwSetPostOperationRequest;

  try {
    const data = await api.apiRgbwSetPost(body);
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
| **apiRgbwSetPostRequest** | [ApiRgbwSetPostRequest](ApiRgbwSetPostRequest.md) |  | [Optional] |

### Return type

[**ApiRgbwStateGet200Response**](ApiRgbwStateGet200Response.md)

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


## apiRgbwStateGet

> ApiRgbwStateGet200Response apiRgbwStateGet()

State of lighting

**Returns** information about **mode, selected effect, color and transition times**

### Example

```ts
import {
  Configuration,
  ControlStateApi,
} from '';
import type { ApiRgbwStateGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlStateApi();

  try {
    const data = await api.apiRgbwStateGet();
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

[**ApiRgbwStateGet200Response**](ApiRgbwStateGet200Response.md)

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

