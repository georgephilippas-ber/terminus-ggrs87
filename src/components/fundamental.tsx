import {LatLng} from "leaflet";
import {MapContainer, TileLayer} from "react-leaflet";
import React, {CSSProperties} from "react";

export function OpenStreetMap(props: { zoom?: number; style?: CSSProperties; className?: string; children?: React.ReactNode })
{
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
