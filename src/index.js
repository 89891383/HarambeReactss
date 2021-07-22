import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { store } from './redux/store'
import { Provider } from 'react-redux'
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";


Sentry.init({
	dsn: "https://261557991ccf4fa6b9dd1aa1ff674ab9@o795817.ingest.sentry.io/5824645",
	integrations: [new Integrations.BrowserTracing()],
  
	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
  });

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store} >
			<App />
		</Provider>

	</React.StrictMode>,
	document.getElementById("root")
);

// const root = ReactDOM.unstable_createRoot(document.getElementById("root"));
// root.render(<React.StrictMode>
// 				<App />
// 			</React.StrictMode>);
