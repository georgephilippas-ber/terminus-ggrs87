import "./main.css"

import {OpenStreetMap} from "../fundamental";
import {Land} from "../land";
import React, {useMemo, useState} from "react";

import {Collection} from "../../core/point-collection";

import {Button, Input} from "@material-tailwind/react";

import {processPlane} from "../../core/point-collection";
import {toTableData, getSet} from "../../core/conversion";

function TableRow(props: { index: number; data: number[] })
{
    return (
        <tr key={props.index}>
            <th>{props.index}</th>
            {props.data.map(value => <td>{value.toFixed(3)}</td>)}
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
                    <td>φ (DD)</td>
                    <td>λ (DD)</td>
                    <td>X (m)</td>
                    <td>Y (m)</td>
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

    let collectionSet = useMemo(() => {
        return getSet(processPlane(textInputValue))
    }, [textInputValue]);

    return (
        <div className={"w-screen h-screen flex"}>
            <OpenStreetMap className={"w-2/3 h-full m-3"}>
                <Land collection={collectionSet.wsg84}/>
            </OpenStreetMap>
            <div className={"w-auto h-full flex grow flex-col m-3 p-3 space-y-2 justify-start items-stretch"}>
                <Input value={textInputValue} onChange={event => setTextInputValue(event.target.value)}
                       placeholder={"Points"} variant={"standard"} className={"w-full"}/>
                <CoordinatesTable data={toTableData(collectionSet)}/>
                <div className={"status"}>
                    Area {collectionSet.utm.area() !== -1 ? collectionSet.utm.area().toFixed(2) + " m²" : "0 m²"}
                </div>
            </div>
        </div>
    )
}
