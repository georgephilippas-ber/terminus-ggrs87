import "./main.css"

import {OpenStreetMap} from "../fundamental";
import {Land} from "../land";
import React from "react";

import {PointCollection} from "../../core/point-collection";

export function Container()
{
    return (
        <div className={"w-screen h-screen space-x-4"}>
            <OpenStreetMap className={"map m-3.5 w-3/5"}>
                <Land pointCollection={new PointCollection([[30, 45]])}/>
            </OpenStreetMap>
            <div className={"interface m-3.5 border-2 flex basis-1 grow"}>
                border
            </div>
            <div className={"interface m-3.5 border-2 flex basis-1 grow-2"}>
                border
            </div>

        </div>
    )
}
