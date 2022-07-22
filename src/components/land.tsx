import {CircleMarker, Polygon, useMap} from "react-leaflet";
import React, {useEffect} from "react";

import {LatLng} from "leaflet";
import {Collection} from "../core/point-collection";

let greece_LatLng = new LatLng(38.314996695376, 23.93499135299);

export function Land(props: { collection: Collection })
{
    let map = useMap();

    useEffect(() =>
    {
        let centroid_ = props.collection.centroid();

        if (centroid_.length > 0)
            map.flyTo(new LatLng(centroid_[0], centroid_[1]));
        else
        {
            map.flyTo(greece_LatLng);
        }
    }, [props.collection]);

    switch (props.collection.length())
    {
        case 0:
            return <CircleMarker radius={6} fillColor={"purple"} fillOpacity={0.65} color={"black"}
                                 center={greece_LatLng}/>
        case 1:
            return <CircleMarker
                center={new LatLng(props.collection.getCollection()[0][0], props.collection.getCollection()[0][1])}
                radius={6} fillColor={"purple"} fillOpacity={0.65} color={"black"}/>
        default:
            return <Polygon fillColor={"purple"} fillOpacity={0.65} pathOptions={{color: "purple"}}
                            positions={props.collection.getCollection().map(value => new LatLng(value[0], value[1]))}/>
    }
}
