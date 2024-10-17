# react-dynamic-import-retry

A lightweight package to enhance React's dynamic import functionality by adding retry logic, making it easier to handle failed imports gracefully.

## Description

This package allows you to retry dynamic imports in React applications, providing a more robust user experience in case of network issues or temporary unavailability of resources. It offers both global configuration and inline configuration for individual imports.

## Advantages

- **Robustness**: Automatically retries failed dynamic imports, reducing the chance of errors in production.
- **Customizable**: Allows both global and inline configuration for maximum flexibility.
- **Easy to Use**: Simple API that integrates seamlessly with React's `lazy` function.

### Installation

You can install the `react-dynamic-import-retry` package using npm or yarn. Run one of the following commands in your project directory:

Using npm:

```bash
npm install react-dynamic-import-retry
```

## Usage

### Global Configuration

You can set the default settings for your project:

```javascript
import { setRetrySettings } from "react-dynamic-import-retry";

setRetrySettings({
  maxRetryCount: 10, // Maximum 10 attempts to load
  retryDelayMs: 1000, // 1000 milliseconds delay between each attempt
});
```

### Inline Configuration

You can also configure retries for individual imports directly when calling the `retryDynamicImport` function:

```javascript
import { retryDynamicImport } from "react-dynamic-import-retry";

const MyComponentWithCustomRetry = retryDynamicImport(
  () => import("./MyComponent"),
  5, // Maximum 5 attempts to load
  2000 // 2000 milliseconds delay between each attempt
);
```

## Props

| Prop            | Type     | Required | Description                                                       |
| --------------- | -------- | -------- | ----------------------------------------------------------------- |
| `maxRetryCount` | `number` | No       | Maximum number of attempts to load the component. Default is 15.  |
| `retryDelayMs`  | `number` | No       | Delay in milliseconds between each retry attempt. Default is 500. |

## License

[MIT](https://choosealicense.com/licenses/mit/)
