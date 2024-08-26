# Vanilla JS Toast Library

A simple vanilla JS toast notification library.

## Installation

Install the library using npm:

```bash
npm install vanilla-js-toast
```

## Usage

### Importing the Library

To use the `Toast` class and styles, import them as follows:

```javascript
import { Toast } from 'vanilla-js-toast'
import 'vanilla-js-toast/styles'
```

### Creating a Toast Instance

Create an instance of the `Toast` class with optional configuration:

```javascript
const toast = new Toast({
  position: 'br', // bottom-right
  maxWidthPx: 400,
  defaultIconSizePx: 18, // for toasts that have an icon (success, error, warning, info)
  richColors: true,
  preventClosingOnHover: true,
  durationMs: 5000,
  showCloseButton: true,
  closeButtonPosition: 'tr' // top-right
})
```

Or you could simply create an instance of the `Toast` class with default configuration options:

```javascript
const toast = new Toast()
```

### Showing Toasts

You can show different types of toasts calling a method from the `Toast` instance with the name of
the type you want to show, following this syntax:

```javascript
toast.$toastType($content, $options)
```

- where `$toastType` can be one of the following: `default`, `success`, `error`, `warning`, `info`,
  or `loading`.
- where `$content` is a string with the message you want to show
- where `$options` is an object with the following properties:
  - `title` (default `<empty string>`): string
  - `durationMs` (default `5000`): number
  - `showCloseButton` (default `false`): boolean
  - `closeButtonPosition` (default `'tr'`): `'tl'` | `'tr'`

The properties: `durationMs`, `showCloseButton`, and `closeButtonPosition` can also be specified
when creating an instance of the `Toast` class, that way if you want to change one of this
properties default value for all toasts you can simply set it when creating the instance instead of
specifying it every time you call a method to show a toast.

Also if you want to change one of this properties for all toasts but you want only one of them to
have a different value, you could always specify it when calling the toast instance method, since
this options have a higher priority than the ones set when creating the `Toast` instance.

For example, if you create this instance:

```javascript
const toast = new Toast({
  durationMs: 10 * 1000,
  showCloseButton: true,
  closeButtonPosition: 'tr'
})
```

All toasts by default will now show for 10 seconds, and have a close button at the top right corner;
but if you want to change this on one of your toasts you could always do it like so:

```javascript
toast.success('success toast with different options than the Toast instance', {
  durationMs: 3 * 1000,
  showCloseButton: false
})
```

Check out an example calling each of the available methods from the `toast` instance for each of the
available `$toastType` values:

#### Default Toast

With default option values:

```javascript
toast.default('This is a default toast')
```

With custom option values:

```javascript
toast.default('This is a default toast', {
  title: 'Default toast title',
  durationMs: 10 * 1000,
  showCloseButton: true
})
```

#### Success Toast

With default option values:

```javascript
toast.success('This is a success toast')
```

With custom option values:

```javascript
toast.success('This is a success toast', {
  durationMs: 4 * 1000,
  showCloseButton: true,
  closeButtonPosition: 'tl'
})
```

#### Error Toast

With default option values:

```javascript
toast.error('This is an error toast')
```

With custom option values:

```javascript
toast.error('This is an error toast', {
  title: 'Error toast title'
})
```

#### Warning Toast

With default option values:

```javascript
toast.warning('This is a warning toast')
```

With custom option values:

```javascript
toast.warning('This is a warning toast', {
  showCloseButton: true
})
```

#### Info Toast

With default option values:

```javascript
toast.info('This is an info toast')
```

With custom option values:

```javascript
toast.info('This is an info toast', {
  durationMs: 15 * 1000
})
```

#### Loading Toast

With default option values:

```javascript
toast.loading('This is a loading toast')
```

With custom option values:

```javascript
toast.loading('This is a loading toast', {
  durationMs: 15 * 1000
})
```

### Removing a Toast

You can force a toast to be removed from the UI calling the `remove` method from the toast instance
with the toastId:

```javascript
const toastId = toast.success('This toast will be removed soon')
toast.remove(toastId)
```

> Note: all methods shown before (default, success, error, warning, info) return the toastId which
> can be used to remove the toast later by calling the toast.remove method

### Using Promises with Toasts

You can show toasts based on the state of a promise:

```javascript
toast
  .promise(
    fetch('https://api.weather.gov/'),
    {
      loading: {
        content: 'Loading weather data',
        title: 'Loading' // <- optional property
      },
      success: {
        content: 'Weather data loaded',
        title: 'Success' // <- optional property
      },
      error: {
        content: 'Error loading weather data',
        title: 'Error' // <- optional property
      }
    },
    {
      durationWhenDoneMs: 7000, // <- optional property (default = 5000)
      showCloseButtonWhenDone: true, // <- optional property (default = false)
      closeButtonPositionWhenDone: 'tr'
    }
  )
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })
```

Keep in mind that setting different values for the `durationMs`, `showCloseButton`, and
`closeButtonPosition` when creating an instance of the `Toast` class, will change the default values
of the `durationWhenDoneMs`, `showCloseButtonWhenDone`, `closeButtonPositionWhenDone` optional
properties respectively.

## Configuration Options

### Toast Class Constructor Options

- `position` (default: `'br'`): Position of the toasts container. Possible values: `'tl'`, `'tr'`,
  `'bl'`, `'br'`, `'tc'`, `'bc'`.
- `maxWidthPx` (default: `400`): Maximum width of the toasts container in pixels.
- `defaultIconSizePx` (default: `18`): Default size of the icons in pixels.
- `richColors` (default: `true`): Whether to use rich colors for different toast types.
- `preventClosingOnHover` (default: `true`): Whether to prevent the toast from closing when hovered.
- `durationMs` (default: `5000`): Duration in milliseconds before the toast disappears.
- `showCloseButton` (default: `false`): Whether to show a close button on the toasts.
- `closeButtonPosition` (default: `'tr'`): Position of the close button. Possible values: `'tr'`
  (top-right), `'tl'` (top-left).

### Toast Options

- `title` (optional): Title of the toast.
- `showCloseButton` (optional): Whether to show a close button on the toast.
- `closeButtonPosition` (optional): Position of the close button. Possible values: 'tr', 'tl'.
- `durationMs` (default: 5000): Duration in milliseconds before the toast disappears. Use Infinity
  to keep the toast visible indefinitely (you need to make sure to remove the toast using the remove
  method if you set Infinity as the duration).

## Methods

- **Shows a default toast:**

`default(content: string, options?: ToastOptionsType)`

- **Shows a success toast:**

`success(content: string, options?: ToastOptionsType)`

- **Shows an error toast:**

`error(content: string, options?: ToastOptionsType)`

- **Shows a warning toast:**

`warning(content: string, options?: ToastOptionsType)`

- **Shows an info toast:**

`info(content: string, options?: ToastOptionsType)`

- **Shows a loading toast:**

`loading(content: string, options?: ToastOptionsType)`

- **Removes a toast by its ID:**

`remove(toastId: string)`

- **Shows toasts based on the state of a promise:**

```javascript
promise(
  promise: Promise<any>,
  toasts: {
    loading: { content: string; title?: string },
    success: { content: string; title?: string },
    error: { content: string; title?: string }
  },
  options?: {
    durationWhenDoneMs?: number
    showCloseButtonWhenDone?: boolean
    closeButtonPositionWhenDone?: ToastCloseButtonPositionsType
  }
)
```

## Using the Library with a CDN

For those who want to use the library without a bundler, you can import the JS and CSS files using a
CDN.

### JS and CSS CDN Links

Use the following links to include the library in your project:

- **JS**: `https://cdn.jsdelivr.net/gh/jorgeabrahan/vanilla-js-toast@main/dist/index.esm.js`
- **CSS**: `https://cdn.jsdelivr.net/gh/jorgeabrahan/vanilla-js-toast@main/dist/toast.css`

### Example Usage with CDN

Include the following in your HTML file:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vanilla JS Toast Example</title>
    <!-- Import the CSS file from the CDN -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/jorgeabrahan/vanilla-js-toast@main/dist/toast.css"
    />
  </head>
  <body>
    <script
      src="https://cdn.jsdelivr.net/gh/jorgeabrahan/vanilla-js-toast@main/dist/index.esm.js"
      type="module"
    ></script>
    <script type="module">
      import { Toast } from 'https://cdn.jsdelivr.net/gh/jorgeabrahan/vanilla-js-toast@main/dist/index.esm.js'

      const toast = new Toast({
        position: 'br',
        maxWidthPx: 400,
        defaultIconSizePx: 18,
        richColors: true,
        showCloseButton: false,
        preventClosingOnHover: true,
        closeButtonPosition: 'tr'
      })

      toast.success('This is a success toast message')
    </script>
  </body>
</html>
```

## Replacing Toasts

The vanilla-js-toast library allows you to replace the content of an existing toast by using the replaceToastId option. This is useful when you want to update the message or type of a toast without creating a new one.

### Example Usage

Here is an example of how to use the replaceToastId option to replace a toast:

```javascript
const btnFetchData = document.getElementById('btnFetchData')
btnFetchData.addEventListener('click', () => {
  // Show a loading toast
  const toastId = toast.loading('Removing element', {
    durationMs: Infinity
  })

  // Simulate a server request
  simulateFetchDataFromServer().then((res) => {
    if (!res.ok) {
      // Replace the loading toast with a warning toast if the request fails
      toast.warning('The element could not be removed', {
        replaceToastId: toastId
      })
      return
    }

    // Replace the loading toast with an action toast if the request succeeds
    toast.action('The element was removed', {
      label: 'Undo',
      onClick: () => {
        console.log('Undo clicked')
      }
    }, {
      replaceToastId: toastId,
      showCloseButton: true
    })
  }).catch(() => {
    // Replace the loading toast with an error toast if there is an error
    toast.error('Error removing element', {
      replaceToastId: toastId
    })
  })
})
```

In this example:

- A loading toast is shown when the button is clicked.
- If the simulated server request fails, the loading toast is replaced with a warning toast.
- If the request succeeds, the loading toast is replaced with an action toast that includes an “Undo” button.
- If there is an error during the request, the loading toast is replaced with an error toast.

> By using the `replaceToastId` option, you can ensure that only one toast is displayed at a time, and you can update its content based on the result of asynchronous operations.

### Important Notes
1- Indefinite Duration: The loading toast is shown with `durationMs` set to `Infinity` to keep it visible indefinitely, as the time required to resolve the promise is unknown.

2- Timeout Management: Setting `durationMs` to `Infinity` does not mean the toast will never be hidden. When the loading toast is replaced by another toast, the original timeout is cleared, and a new timeout is created with the `durationMs` of the replacement toast. For example, if the loading toast had a `durationMs` of 5 seconds and was replaced by the `toast.action` toast at the 4th second, the toast would not disappear at the 5th second. Instead, the previous timer is cleared, and a new timer is set with the `durationMs` of the `toast.action` toast.