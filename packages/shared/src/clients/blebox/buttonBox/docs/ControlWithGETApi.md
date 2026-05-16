# ControlWithGETApi

All URIs are relative to *http://192.168.4.1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**tInputIdTriggerTypeGet**](ControlWithGETApi.md#tinputidtriggertypeget) | **GET** /t/{inputId}/{triggerType} | Trigger the selected input |



## tInputIdTriggerTypeGet

> StateGet200Response tInputIdTriggerTypeGet(inputId, triggerType)

Trigger the selected input

Trigger the selected input in the chosen way to run the assigned actions (using *GET* request).

### Example

```ts
import {
  Configuration,
  ControlWithGETApi,
} from '';
import type { TInputIdTriggerTypeGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ControlWithGETApi();

  const body = {
    // number
    inputId: 56,
    // TriggerType
    triggerType: ...,
  } satisfies TInputIdTriggerTypeGetRequest;

  try {
    const data = await api.tInputIdTriggerTypeGet(body);
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
| **inputId** | `number` |  | [Defaults to `undefined`] |
| **triggerType** | `TriggerType` |  | [Defaults to `undefined`] [Enum: 1, 2, 3, 4, 5] |

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

