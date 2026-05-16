# ControlWithGETApi

All URIs are relative to *http://192.168.4.1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**s1ForTimeTimeSNs0Get**](ControlWithGETApi.md#s1fortimetimesns0get) | **GET** /s/1/forTime/{timeS}/ns/0 | Set all relays for a given time |
| [**sRelay1ForTimeTimeSNs0Get**](ControlWithGETApi.md#srelay1fortimetimesns0get) | **GET** /s/{relay}/1/forTime/{timeS}/ns/0 | Set relay for a given time |
| [**sRelayStateGet**](ControlWithGETApi.md#srelaystateget) | **GET** /s/{relay}/{state} | Set relay |
| [**sStateGet**](ControlWithGETApi.md#sstateget) | **GET** /s/{state} | Set all relays |



## s1ForTimeTimeSNs0Get

> StateGet200Response s1ForTimeTimeSNs0Get(timeS)

Set all relays for a given time

**Set all relays state to ON for a given time in seconds** using GET request

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { S1ForTimeTimeSNs0GetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  const body = {
    // number
    timeS: 56,
  } satisfies S1ForTimeTimeSNs0GetRequest;

  try {
    const data = await api.s1ForTimeTimeSNs0Get(body);
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
| **timeS** | `number` |  | [Defaults to `undefined`] |

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
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sRelay1ForTimeTimeSNs0Get

> StateGet200Response sRelay1ForTimeTimeSNs0Get(relay, timeS)

Set relay for a given time

**Set relay state to ON for a given time in seconds** using GET request

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { SRelay1ForTimeTimeSNs0GetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  const body = {
    // Relay
    relay: ...,
    // number
    timeS: 56,
  } satisfies SRelay1ForTimeTimeSNs0GetRequest;

  try {
    const data = await api.sRelay1ForTimeTimeSNs0Get(body);
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
| **relay** | `Relay` |  | [Defaults to `undefined`] [Enum: 0, 1] |
| **timeS** | `number` |  | [Defaults to `undefined`] |

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
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sRelayStateGet

> StateGet200Response sRelayStateGet(relay, state)

Set relay

**Set relay state** using *GET* request

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { SRelayStateGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  const body = {
    // Relay
    relay: ...,
    // StateSet
    state: ...,
  } satisfies SRelayStateGetRequest;

  try {
    const data = await api.sRelayStateGet(body);
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
| **relay** | `Relay` |  | [Defaults to `undefined`] [Enum: 0, 1] |
| **state** | `StateSet` |  | [Defaults to `undefined`] [Enum: 0, 1, 2] |

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
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sStateGet

> StateGet200Response sStateGet(state)

Set all relays

**Set all relays state** using *GET* request

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { SStateGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  const body = {
    // StateSet
    state: ...,
  } satisfies SStateGetRequest;

  try {
    const data = await api.sStateGet(body);
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
| **state** | `StateSet` |  | [Defaults to `undefined`] [Enum: 0, 1, 2] |

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
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

