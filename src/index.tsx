import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';
import {DekstopView} from "./components/interface/main";

import {BrowserView, MobileView} from 'react-device-detect';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserView>
            <DekstopView/>
        </BrowserView>
        <MobileView className={"w-screen h-screen flex justify-center items-center"}>
            application currently not available on mobile devices
        </MobileView>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
