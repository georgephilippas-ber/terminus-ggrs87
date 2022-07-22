import {CircleMarker, Polygon, useMap} from "react-leaflet";
import React, {useEffect} from "react";

import {LatLng} from "leaflet";
import {Collection} from "../core/point-collection";

export function Land(props: { collection: Collection })
{
    let map = useMap();

    useEffect(() =>
    {
        let centroid_ = props.collection.centroid();

        map.flyTo(new LatLng(centroid_[0], centroid_[1]));
    });

    if (props.collection.length() === 1)
        return <CircleMarker
            center={new LatLng(props.collection.getCollection()[0][0], props.collection.getCollection()[0][1])}
            radius={3} fillColor={"purple"} fillOpacity={0.65} color={"black"}/>
    else
        return (
            <Polygon fillColor={"purple"} fillOpacity={0.65} pathOptions={{color: "purple"}}
                     positions={props.collection.getCollection().map(value => new LatLng(value[0], value[1]))}/>
        );
}
