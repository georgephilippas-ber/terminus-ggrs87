import {Polygon, useMap} from "react-leaflet";
import React, {useEffect} from "react";

import {PointCollection} from "../core/point-collection";
import {LatLng} from "leaflet";

export function Land(props: { pointCollection: PointCollection })
{
    let map = useMap();

    useEffect(() =>
    {
        let centroid_ = props.pointCollection.getCentroid();

        map.flyTo(new LatLng(centroid_[0], centroid_[1]));
    });

    return (
        <Polygon fillColor={"purple"} fillOpacity={0.65} pathOptions={{color: "purple"}}
                 positions={props.pointCollection.collectionAsLatLng()}/>
    );
}
