import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {NotificationProvider} from "./store/NotificationStore";
import {UserProvider} from "./store/UserStore";

import "./index.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <NotificationProvider>
            <UserProvider>
                <App/>
            </UserProvider>
        </NotificationProvider>
    </React.StrictMode>
);
