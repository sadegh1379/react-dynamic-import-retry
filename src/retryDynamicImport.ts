import { ComponentType, lazy } from "react";

// Global settings for retry behavior
let globalMaxRetryCount = 15;
let globalRetryDelayMs = 500;

// Function to set global retry settings
export function setRetrySettings(settings: {
  maxRetryCount?: number;
  retryDelayMs?: number;
}) {
  if (settings.maxRetryCount !== undefined) {
    globalMaxRetryCount = settings.maxRetryCount;
  }
  if (settings.retryDelayMs !== undefined) {
    globalRetryDelayMs = settings.retryDelayMs;
  }
}

// Function to extract the module URL from the import statement
const getRouteComponentUrl = (
  originalImport: () => Promise<any>
): string | null => {
  try {
    // Convert the function to string to extract the import URL
    const fnString = originalImport.toString();
    const uriOrRelativePathRegex = /import\(["']([^)]+)['"]\)/;
    return fnString.match(uriOrRelativePathRegex)?.[1] || null;
  } catch (e) {
    console.error("Error extracting component URL:", e);
    return null;
  }
};

// Function to create a retry import function with versioned query parameter
const getRetryImportFunction = (
  originalImport: () => Promise<any>,
  retryCount: number
): (() => Promise<any>) => {
  const importUrl = getRouteComponentUrl(originalImport);
  if (!importUrl || retryCount === 0) {
    return originalImport; // Return original import if no URL or retry count is 0
  }

  // Construct the import URL with a version query parameter
  const importUrlWithVersionQuery = importUrl.includes("?")
    ? `${importUrl}&v=${retryCount}-${Math.random().toString(36).substring(2)}`
    : `${importUrl}?v=${retryCount}-${Math.random().toString(36).substring(2)}`;

  return () => import(/* @vite-ignore */ importUrlWithVersionQuery);
};

// Main function to wrap the dynamic import with retry logic
export function retryDynamicImport<T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  localMaxRetryCount: number = globalMaxRetryCount,
  localRetryDelayMs: number = globalRetryDelayMs
): React.LazyExoticComponent<T> {
  let retryCount = 0;

  const loadComponent = (): Promise<{ default: T }> =>
    new Promise((resolve, reject) => {
      function tryLoadComponent() {
        const retryImport = getRetryImportFunction(importFunction, retryCount);

        retryImport()
          .then((module) => {
            if (retryCount > 0) {
              console.log(
                `Component loaded successfully after ${retryCount} ${
                  retryCount === 1 ? "retry" : "retries"
                }.`
              );
            }
            resolve(module); // Resolve the promise with the loaded module
          })
          .catch((error) => {
            retryCount += 1; // Increment the retry count
            if (retryCount <= localMaxRetryCount) {
              console.warn(`Retry attempt ${retryCount} failed, retrying...`);
              setTimeout(() => {
                tryLoadComponent(); // Retry loading the component after a delay
              }, retryCount * localRetryDelayMs);
            } else {
              console.error(
                "Failed to load component after maximum retries. Reloading the page..."
              );
              reject(error); // Reject the promise after max retries
              window.location.reload(); // Optionally reload the page
            }
          });
      }

      tryLoadComponent(); // Start the load attempt
    });

  return lazy(() => loadComponent()); // Return a lazily loaded component
}
