import React, {CSSProperties, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';

import {CircleMarker, MapContainer, Polygon, Polyline, TileLayer, useMap} from "react-leaflet";
import {LatLng} from "leaflet";
import {convert} from "./core/conversion";

function Marker(props: { position: LatLng }) {
    let leafletMap = useMap();

    useEffect(() => {
        leafletMap.flyTo(props.position);
    }, []);

    return (
        <CircleMarker radius={2} center={props.position}/>
    )
}

function OpenStreetMap(props: { zoom?: number; style?: CSSProperties; className?: string; children?: React.ReactNode }) {
    let defaultZoom: number = 6;

    return (
        <MapContainer className={props.className} keyboard={false} dragging={false} zoomControl={false}
                      zoom={props.zoom ?? defaultZoom} style={props.style}
                      center={new LatLng(0., 0.)} scrollWheelZoom={false}>
            <TileLayer attribution='&copy;' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {props.children}
        </MapContainer>
    )
}

function mean(sequence: number[])
{
    return sequence.length ? sequence.reduce((previousValue, currentValue) => previousValue + currentValue, 0.) / sequence.length : 0;
}

function fromLatLngToHCS(pointCollection: PointCollection): PointCollection
{
    let targetPointCollection: PointCollection = new PointCollection();

    return targetPointCollection;
}

class PointCollection
{
    collection: number[][];

    constructor(collection_: number[][] = []) {
        this.collection = collection_;
    }

    add(coordinates: number[])
    {
        this.collection.push(coordinates);
    }

    getCoordinates(): LatLng[]
    {
        return this.collection.map(value => new LatLng(value[0], value[1]));
    }

    getCentroid()
    {
        let latitude_: number[] = this.collection.map(value => value[0]);
        let longitude_: number[] = this.collection.map(value => value[1]);

        return new LatLng(mean(latitude_), mean(longitude_));
    }
}

function Land(props: {pointCollection: PointCollection})
{
    let map = useMap();

    useEffect(() => {
        map.flyTo(props.pointCollection.getCentroid())
    });

    return (
        <Polygon fillColor={"purple"} fillOpacity={0.65} pathOptions={{color: "purple"}} positions={props.pointCollection.getCoordinates()}/>
    );
}

let p = [[0, 0], [3, 0], [3, 3], [0, 3]];

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

console.log(convert([0, 500_000]));

root.render(
    <React.StrictMode>
        <OpenStreetMap className={"w-screen h-screen"}>
            <Land pointCollection={new PointCollection(p)}/>
        </OpenStreetMap>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
