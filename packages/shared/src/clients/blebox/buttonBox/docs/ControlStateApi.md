# ControlStateApi

All URIs are relative to *http://192.168.4.1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiButtonboxExtendedStateGet**](ControlStateApi.md#apibuttonboxextendedstateget) | **GET** /api/buttonbox/extended/state | Extended device specific state |
| [**apiButtonboxStateGet**](ControlStateApi.md#apibuttonboxstateget) | **GET** /api/buttonbox/state | Device specific state |
| [**stateExtendedGet**](ControlStateApi.md#stateextendedget) | **GET** /state/extended | Extended device specific state |
| [**stateGet**](ControlStateApi.md#stateget) | **GET** /state | Device specific state |



## apiButtonboxExtendedStateGet

> StateExtendedGet200Response apiButtonboxExtendedStateGet()

Extended device specific state

**extended information** about **device and inputs**&lt;br&gt;  *(all parameters needed to display user interface)*&lt;br&gt; &lt;br&gt;&lt;br&gt;**It is deprecated** -&gt; look at:

### Example

```ts
import {
  Configuration,
  ControlStateApi,
} from '';
import type { ApiButtonboxExtendedStateGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlStateApi();

  try {
    const data = await api.apiButtonboxExtendedStateGet();
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

[**StateExtendedGet200Response**](StateExtendedGet200Response.md)

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


## apiButtonboxStateGet

> StateGet200Response apiButtonboxStateGet()

Device specific state

Returns information about **inputs state** &lt;br&gt;&lt;br&gt;**It is deprecated** -&gt; look at:

### Example

```ts
import {
  Configuration,
  ControlStateApi,
} from '';
import type { ApiButtonboxStateGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlStateApi();

  try {
    const data = await api.apiButtonboxStateGet();
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

[**StateGet200Response**](StateGet200Response.md)

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


## stateExtendedGet

> StateExtendedGet200Response stateExtendedGet()

Extended device specific state

Returns **extended information** about **device and inputs**&lt;br&gt;  *(all parameters needed to display user interface)*

### Example

```ts
import {
  Configuration,
  ControlStateApi,
} from '';
import type { StateExtendedGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlStateApi();

  try {
    const data = await api.stateExtendedGet();
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

[**StateExtendedGet200Response**](StateExtendedGet200Response.md)

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


## stateGet

> StateGet200Response stateGet()

Device specific state

Returns information about **inputs state**

### Example

```ts
import {
  Configuration,
  ControlStateApi,
} from '';
import type { StateGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlStateApi();

  try {
    const data = await api.stateGet();
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

[**StateGet200Response**](StateGet200Response.md)

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

