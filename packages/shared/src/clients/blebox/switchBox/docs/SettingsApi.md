# SettingsApi

All URIs are relative to *http://192.168.4.1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiSettingsSetPost**](SettingsApi.md#apisettingssetpostoperation) | **POST** /api/settings/set | Settings set |
| [**apiSettingsStateGet**](SettingsApi.md#apisettingsstateget) | **GET** /api/settings/state | Settings state |



## apiSettingsSetPost

> ApiSettingsStateGet200Response apiSettingsSetPost(apiSettingsSetPostRequest)

Settings set

Allow to set device\&#39;s **specific** settings

### Example

```ts
import {
  Configuration,
  SettingsApi,
} from '';
import type { ApiSettingsSetPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SettingsApi();

  const body = {
    // ApiSettingsSetPostRequest (optional)
    apiSettingsSetPostRequest: ...,
  } satisfies ApiSettingsSetPostOperationRequest;

  try {
    const data = await api.apiSettingsSetPost(body);
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
| **apiSettingsSetPostRequest** | [ApiSettingsSetPostRequest](ApiSettingsSetPostRequest.md) |  | [Optional] |

### Return type

[**ApiSettingsStateGet200Response**](ApiSettingsStateGet200Response.md)

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


## apiSettingsStateGet

> ApiSettingsStateGet200Response apiSettingsStateGet()

Settings state

Return device\&#39;s **specific** settings

### Example

```ts
import {
  Configuration,
  SettingsApi,
} from '';
import type { ApiSettingsStateGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SettingsApi();

  try {
    const data = await api.apiSettingsStateGet();
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

[**ApiSettingsStateGet200Response**](ApiSettingsStateGet200Response.md)

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

