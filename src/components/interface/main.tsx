import "./main.css"

import {OpenStreetMap} from "../fundamental";
import {Land} from "../land";
import React from "react";

import {PointCollection} from "../../core/point-collection";

export function Container()
{
    return (
        <div className={"w-screen h-screen flex "}>
            <OpenStreetMap style={{height: "100%"}} className={"border-2 w-2/3"}>
                <Land pointCollection={new PointCollection([[20, 30]])}/>
            </OpenStreetMap>
        </div>
    )
}
