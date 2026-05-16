# ControlWithGETApi

All URIs are relative to *http://192.168.4.1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**sAdjustChannelsDeltaGet**](ControlWithGETApi.md#sadjustchannelsdeltaget) | **GET** /s/{adjust}/{channelsDelta} | Adjust brightness |
| [**sChannelsColorFadeMsTimeMsForTimeTimeSGet**](ControlWithGETApi.md#schannelscolorfademstimemsfortimetimesget) | **GET** /s/{channels}/colorFadeMs/{timeMs}/forTime/{timeS} | Set color with fade time for a given time |
| [**sChannelsColorFadeMsTimeMsGet**](ControlWithGETApi.md#schannelscolorfademstimemsget) | **GET** /s/{channels}/colorFadeMs/{timeMs} | Set color with fade time |
| [**sChannelsForTimeTimeSGet**](ControlWithGETApi.md#schannelsfortimetimesget) | **GET** /s/{channels}/forTime/{timeS} | Set color for a given time |
| [**sChannelsGet**](ControlWithGETApi.md#schannelsget) | **GET** /s/{channels} | Set color |
| [**sOffonLastGet**](ControlWithGETApi.md#soffonlastget) | **GET** /s/offon/last | Toggle (ON/OFF last state) |
| [**sOnlastGet**](ControlWithGETApi.md#sonlastget) | **GET** /s/onlast | Set to last state |
| [**sXEffectIDForTimeTimeSGet**](ControlWithGETApi.md#sxeffectidfortimetimesget) | **GET** /s/x/{effectID}/forTime/{timeS} | Set effect for a given time |
| [**sXEffectIDGet**](ControlWithGETApi.md#sxeffectidget) | **GET** /s/x/{effectID} | Set effect |



## sAdjustChannelsDeltaGet

> ApiRgbwStateGet200Response sAdjustChannelsDeltaGet(adjust, channelsDelta)

Adjust brightness

**Adjust brightness** using GET request

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { SAdjustChannelsDeltaGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  const body = {
    // Adjust
    adjust: ...,
    // string
    channelsDelta: channelsDelta_example,
  } satisfies SAdjustChannelsDeltaGetRequest;

  try {
    const data = await api.sAdjustChannelsDeltaGet(body);
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
| **adjust** | `Adjust` |  | [Defaults to `undefined`] [Enum: inc, dec] |
| **channelsDelta** | `string` |  | [Defaults to `undefined`] |

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
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sChannelsColorFadeMsTimeMsForTimeTimeSGet

> ApiRgbwStateGet200Response sChannelsColorFadeMsTimeMsForTimeTimeSGet(channels, timeMs, timeS)

Set color with fade time for a given time

**Set color with color fade time for given time** using GET request (after given time returns to previous state)

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { SChannelsColorFadeMsTimeMsForTimeTimeSGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  const body = {
    // string
    channels: channels_example,
    // ColorFade
    timeMs: ...,
    // number | **Time in seconds** for which the selected **state will be set**, **after this time the last state will be restored**.
    timeS: 30,
  } satisfies SChannelsColorFadeMsTimeMsForTimeTimeSGetRequest;

  try {
    const data = await api.sChannelsColorFadeMsTimeMsForTimeTimeSGet(body);
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
| **channels** | `string` |  | [Defaults to `undefined`] |
| **timeMs** | `ColorFade` |  | [Defaults to `undefined`] [Enum: 0] |
| **timeS** | `number` | **Time in seconds** for which the selected **state will be set**, **after this time the last state will be restored**. | [Defaults to `undefined`] |

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
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sChannelsColorFadeMsTimeMsGet

> ApiRgbwStateGet200Response sChannelsColorFadeMsTimeMsGet(channels, timeMs)

Set color with fade time

**Set color with color fade time** in milliseconds using GET request

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { SChannelsColorFadeMsTimeMsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  const body = {
    // string
    channels: channels_example,
    // ColorFade
    timeMs: ...,
  } satisfies SChannelsColorFadeMsTimeMsGetRequest;

  try {
    const data = await api.sChannelsColorFadeMsTimeMsGet(body);
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
| **channels** | `string` |  | [Defaults to `undefined`] |
| **timeMs** | `ColorFade` |  | [Defaults to `undefined`] [Enum: 0] |

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
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sChannelsForTimeTimeSGet

> ApiRgbwStateGet200Response sChannelsForTimeTimeSGet(channels, timeS)

Set color for a given time

**Set color for given time** using GET request (after given time returns to previous state)

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { SChannelsForTimeTimeSGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  const body = {
    // string
    channels: channels_example,
    // number | **Time in seconds** for which the selected **state will be set**, **after this time the last state will be restored**.
    timeS: 30,
  } satisfies SChannelsForTimeTimeSGetRequest;

  try {
    const data = await api.sChannelsForTimeTimeSGet(body);
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
| **channels** | `string` |  | [Defaults to `undefined`] |
| **timeS** | `number` | **Time in seconds** for which the selected **state will be set**, **after this time the last state will be restored**. | [Defaults to `undefined`] |

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
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sChannelsGet

> ApiRgbwStateGet200Response sChannelsGet(channels)

Set color

**Set color** using GET request

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { SChannelsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  const body = {
    // string
    channels: channels_example,
  } satisfies SChannelsGetRequest;

  try {
    const data = await api.sChannelsGet(body);
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
| **channels** | `string` |  | [Defaults to `undefined`] |

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
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sOffonLastGet

> ApiRgbwStateGet200Response sOffonLastGet()

Toggle (ON/OFF last state)

**Turning ON/OFF** (toggle) **last color or effect**

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { SOffonLastGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  try {
    const data = await api.sOffonLastGet();
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
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sOnlastGet

> ApiRgbwStateGet200Response sOnlastGet()

Set to last state

**Setting last color or effect**

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { SOnlastGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  try {
    const data = await api.sOnlastGet();
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
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sXEffectIDForTimeTimeSGet

> ApiRgbwStateGet200Response sXEffectIDForTimeTimeSGet(effectID, timeS)

Set effect for a given time

**Turning ON effect with given ID** using GET request (after given time returns to previous state)

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { SXEffectIDForTimeTimeSGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  const body = {
    // number
    effectID: 56,
    // number | **Time in seconds** for which the selected **state will be set**, **after this time the last state will be restored**.
    timeS: 30,
  } satisfies SXEffectIDForTimeTimeSGetRequest;

  try {
    const data = await api.sXEffectIDForTimeTimeSGet(body);
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
| **effectID** | `number` |  | [Defaults to `undefined`] |
| **timeS** | `number` | **Time in seconds** for which the selected **state will be set**, **after this time the last state will be restored**. | [Defaults to `undefined`] |

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
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sXEffectIDGet

> ApiRgbwStateGet200Response sXEffectIDGet(effectID)

Set effect

**Turning ON effect with given ID** using GET request

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { SXEffectIDGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  const body = {
    // number
    effectID: 56,
  } satisfies SXEffectIDGetRequest;

  try {
    const data = await api.sXEffectIDGet(body);
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
| **effectID** | `number` |  | [Defaults to `undefined`] |

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
| **400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

