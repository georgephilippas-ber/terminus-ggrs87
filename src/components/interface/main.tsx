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
            <th style={{fontSize: "1.15em"}}>{props.index}</th>
            {props.data.map(value => <td>{value.toLocaleString("en-GB", {maximumFractionDigits: 2})}</td>)}
        </tr>
    );
}

function CoordinatesTable(props: { data: number[][] })
{
    return (
        <div className={"h-full table-wrapper"}>
            <table className={"w-full fl-table"}>
                <thead>
                <tr className={"table-header-systems"}>
                    <th/>
                    <th colSpan={2}>
                        WGS 84
                    </th>
                    <th colSpan={2}>
                        GGRS 87
                    </th>
                </tr>
                <tr className={"table-header"}>
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
        <div style={{height: "98vh"}} className={"w-screen h-screen flex"}>
            <OpenStreetMap className={"w-2/3 m-3 shadow-2xl"}>
                <Land collection={collectionSet.wsg84}/>
            </OpenStreetMap>
            <div className={"w-auto h-full flex grow flex-col m-3 p-3 space-y-2 justify-start items-stretch"}>
                <Input value={textInputValue} onChange={event => setTextInputValue(event.target.value)}
                       placeholder={"Start typing coordinates in pairs WGS84 or GGRS87 separated by comma (,)"} variant={"standard"} className={"w-full"}/>
                <CoordinatesTable data={toTableData(collectionSet)}/>
                <div className={"status w-full py-3 px-4 shadow-grey-600 shadow-2xl"}>
                    {collectionSet.utm.area() !== -1 ? collectionSet.utm.area().toLocaleString("en-GB", {maximumFractionDigits: 2}) + " m²" : "0 m²"}
                </div>
            </div>
        </div>
    )
}

// 537298.57, 4133737.88,
// 537315.77, 4133753.76,
// 537348.18, 4133727.96,
// 537377.29, 4133711.42,
// 537403.74, 4133680.34,
// 537419.62, 4133665.78,
// 537480.47, 4133614.85,
// 537474.52, 4133602.94,
// 537463.28, 4133590.38,
// 537445.42, 4133561.93,
// 537422.27, 4133525.55,
// 537403.08, 4133568.55,
// 537341.57, 4133643.95,
// 537321.72, 4133681.00,
// 537317.75, 4133696.87


//15876.0
