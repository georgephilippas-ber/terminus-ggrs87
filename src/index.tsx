import React, {CSSProperties, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';

import {CircleMarker, MapContainer, TileLayer, useMap} from "react-leaflet";
import {LatLng} from "leaflet";

function Marker(props: { position: LatLng })
{
    let leafletMap = useMap();

    useEffect(() =>
    {
        leafletMap.flyTo(props.position);
    }, []);

    return (
        <CircleMarker radius={2} center={props.position}/>
    )
}

function Map(props: { zoom: number; style?: CSSProperties, className?: string, position: LatLng })
{
    return (
        <MapContainer className={props.className} keyboard={false} dragging={false} zoomControl={false}
                      minZoom={props.zoom} maxZoom={props.zoom}
                      zoom={props.zoom} style={props.style}
                      center={new LatLng(0., 0.)} scrollWheelZoom={false}>
            <TileLayer attribution='&copy;' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={props.position}/>
        </MapContainer>
    );
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Map zoom={6} position={new LatLng(50., 0.)} className={"h-screen"}/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
