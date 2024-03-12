# LSP UI

Recommended resolution for your embedded widget:

- width - `480px`
- height - `800px`

```html
<iframe
	style="margin: auto; min-width: 480px; min-height: 800px;"
	id="widget"
	src="https://widget.synonym.to/"
	seamless
></iframe>
```

## Set environment variables

The following environment variables are required to run the app:

```bash
REACT_APP_MAINNET=true // or false
```

Set this environment variable if you want to test in regtest:

```bash
REACT_APP_API_URL="https://api.stag.blocktank.to/blocktank/api/v2/"
```

## Available Scripts

⚠️ Switch to the Node.js version defined in `.node-version`. You can visit [.node-version File Usage](https://github.com/shadowspawn/node-version-usage) and use one of these methods to change the node version you need.

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `yarn build:mainnet` and `yarn build:testnet`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.\
It also sets the `REACT_APP_MAINNET` environment variable to `true` or `false` respectively.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
