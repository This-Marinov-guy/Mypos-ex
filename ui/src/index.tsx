import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {Provider} from 'mobx-react';

import "./index.css";
import {rootStore} from "./store/RootStore";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<Provider rootStore={rootStore}>
			<App />
		</Provider>
	</React.StrictMode>
);
