import "./main.css"

import {OpenStreetMap} from "../fundamental";
import {Land} from "../land";
import React, {useState} from "react";

import {Collection} from "../../core/point-collection";

import {Button, Input} from "@material-tailwind/react";

import {processPlane} from "../../core/point-collection";

function TableRow(props: { index: number; data: number[] })
{
    return (
        <tr key={props.index}>
            <th>{props.index}</th>
            {props.data.map(value => <td>{value}</td>)}
        </tr>
    );
}

function CoordinatesTable(props: { data: number[][] })
{
    return (
        <div className={"h-full"}>
            <table className={"w-full"}>
                <thead>
                <tr>
                    <th/>
                    <th colSpan={2}>
                        GGRS 87
                    </th>
                    <th colSpan={2}>
                        WGS 84
                    </th>
                </tr>
                <tr>
                    <th>Point</th>
                    <td>X (m)</td>
                    <td>Y (m)</td>
                    <td>φ (DD)</td>
                    <td>λ (DD)</td>
                </tr>
                </thead>
                <tbody>
                {props.data.map((value, index) => <TableRow key={index} index={index + 1} data={value}/>)}
                </tbody>
            </table>
        </div>
    )
}

export function Container()
{
    let [textInputValue, setTextInputValue] = useState<string>("");

    return (
        <div className={"w-screen h-screen flex"}>
            <OpenStreetMap className={"w-2/3 h-full m-3"}>
                <Land collection={new Collection([[0, 0]])}/>
            </OpenStreetMap>
            <div className={"w-auto h-full flex grow flex-col m-3 p-3 space-y-2 justify-start items-stretch"}>
                <Input value={textInputValue} onChange={event => setTextInputValue(event.target.value)}
                       placeholder={"Points"} variant={"standard"} className={"w-full"}/>
                <CoordinatesTable data={processPlane(textInputValue).getCollection()}/>
                <div>
                    <Button>Compute</Button>
                </div>
            </div>
        </div>
    )
}
