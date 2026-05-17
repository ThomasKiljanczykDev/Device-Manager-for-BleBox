# ControlStateApi

All URIs are relative to *http://192.168.4.1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiRelayExtendedStateGet**](ControlStateApi.md#apirelayextendedstateget) | **GET** /api/relay/extended/state | Extended relay state |
| [**apiRelaySetPost**](ControlStateApi.md#apirelaysetpost) | **POST** /api/relay/set | Set relay |
| [**apiRelayStateGet**](ControlStateApi.md#apirelaystateget) | **GET** /api/relay/state | Relay state |
| [**stateExtendedGet**](ControlStateApi.md#stateextendedget) | **GET** /state/extended | Extended device state |
| [**stateGet**](ControlStateApi.md#stateget) | **GET** /state | Device state |
| [**statePost**](ControlStateApi.md#statepostoperation) | **POST** /state | State set |



## apiRelayExtendedStateGet

> StateExtendedGet200Response apiRelayExtendedStateGet()

Extended relay state

**extended information** about **device and relays**&lt;br&gt;  *(all parameters needed to display user interface)*&lt;br&gt; &lt;br&gt;&lt;br&gt;**It is deprecated** -&gt; look at:

### Example

```ts
import {
  Configuration,
  ControlStateApi,
} from '';
import type { ApiRelayExtendedStateGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlStateApi();

  try {
    const data = await api.apiRelayExtendedStateGet();
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


## apiRelaySetPost

> StateGet200Response apiRelaySetPost(statePostRequest)

Set relay

Allows to **set** desired **relay state** &lt;br&gt; *(turn on, turn off, toggle state, turn on for time)* &lt;br&gt;&lt;br&gt;**It is deprecated** -&gt; look at:

### Example

```ts
import {
  Configuration,
  ControlStateApi,
} from '';
import type { ApiRelaySetPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlStateApi();

  const body = {
    // StatePostRequest (optional)
    statePostRequest: ...,
  } satisfies ApiRelaySetPostRequest;

  try {
    const data = await api.apiRelaySetPost(body);
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
| **statePostRequest** | [StatePostRequest](StatePostRequest.md) |  | [Optional] |

### Return type

[**StateGet200Response**](StateGet200Response.md)

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


## apiRelayStateGet

> StateGet200Response apiRelayStateGet()

Relay state

Returns information about **relays state** &lt;br&gt;&lt;br&gt;**It is deprecated** -&gt; look at:

### Example

```ts
import {
  Configuration,
  ControlStateApi,
} from '';
import type { ApiRelayStateGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlStateApi();

  try {
    const data = await api.apiRelayStateGet();
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

Extended device state

Returns **extended information** about **device and relays**&lt;br&gt;  *(all parameters needed to display user interface)*

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

Device state

Returns information about **relays state**

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


## statePost

> StateGet200Response statePost(statePostRequest)

State set

Allow to set desired relay state (ON, OFF, TOGGLE, FORTIME)

### Example

```ts
import {
  Configuration,
  ControlStateApi,
} from '';
import type { StatePostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlStateApi();

  const body = {
    // StatePostRequest (optional)
    statePostRequest: ...,
  } satisfies StatePostOperationRequest;

  try {
    const data = await api.statePost(body);
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
| **statePostRequest** | [StatePostRequest](StatePostRequest.md) |  | [Optional] |

### Return type

[**StateGet200Response**](StateGet200Response.md)

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

