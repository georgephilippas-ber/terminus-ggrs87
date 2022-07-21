import "./main.css"

import {OpenStreetMap} from "../fundamental";
import {Land} from "../land";
import React from "react";

import {PointCollection} from "../../core/point-collection";
import {Button, Input} from "@material-tailwind/react";


function Table()
{
    return (
        <table className={"border-2"}>
            <thead>
                <tr>
                    <th>Point</th><td>X (m)</td><td>Y (m)</td><td>φ (DD)</td><td>λ (DD)</td>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    )
}

export function Container()
{
    return (
        <div className={"w-screen h-screen flex"}>
            <OpenStreetMap className={"w-2/3 h-full m-3"}>
                <Land pointCollection={new PointCollection([[20, 30]])}/>
            </OpenStreetMap>
            <div className={"w-auto h-full flex grow flex-col m-3 p-3 space-y-2 justify-start items-stretch"}>
                <Input variant={"standard"} className={"w-full"}/>
                <Table/>
                <div>
                    <Button>Compute</Button>
                </div>
            </div>
        </div>
    )
}
