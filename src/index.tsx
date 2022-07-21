import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';

import {OpenStreetMap} from "./components/fundamental";
import {Land} from "./components/land";

import {PointCollection} from "./core/point-collection";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

let pCollection = new PointCollection([[20, 30]]);

root.render(
    <React.StrictMode>
        <OpenStreetMap className={"w-screen h-screen"}>
            <Land pointCollection={pCollection}/>
        </OpenStreetMap>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
