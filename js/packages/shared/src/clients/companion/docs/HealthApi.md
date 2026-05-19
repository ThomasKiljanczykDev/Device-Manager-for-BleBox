# HealthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiHealthGet**](HealthApi.md#apihealthget) | **GET** /api/health | Liveness probe |



## apiHealthGet

> ApiHealthGet200Response apiHealthGet()

Liveness probe

### Example

```ts
import {
  Configuration,
  HealthApi,
} from '';
import type { ApiHealthGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new HealthApi();

  try {
    const data = await api.apiHealthGet();
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

[**ApiHealthGet200Response**](ApiHealthGet200Response.md)

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

