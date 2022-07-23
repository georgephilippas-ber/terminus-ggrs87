import "./main.css"

import {Location2} from "@styled-icons/icomoon"

import {OpenStreetMap} from "../fundamental";
import {Land} from "../land";
import React, {MouseEventHandler, useMemo, useState} from "react";

import {process} from "../../core/point-collection";

import {IconButton, Input, Tabs, Tab, TabsBody, TabsHeader} from "@material-tailwind/react";
import {getCoordinatesSet, toTableData} from "../../core/conversion";

function TableRow(props: { index: number; data: number[] })
{
    return (
        <tr>
            <th style={{fontSize: "1.15em"}}>{props.index}</th>
            {props.data.map((value, index) => <td
                key={index}>{value.toLocaleString("en-GB", {maximumFractionDigits: 2})}</td>)}
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

export function useController()
{
    let [coordinatesInput, setCoordinatesInput] = useState<string>("");

    let coordinatesSet = useMemo(() =>
    {
        return getCoordinatesSet(process(coordinatesInput));
    }, [coordinatesInput]);

    let onClick_locationButton: MouseEventHandler<HTMLButtonElement> = (event) =>
    {
        navigator.geolocation.getCurrentPosition(position =>
        {
            let coordinates = [position.coords.latitude, position.coords.longitude];

            if (coordinatesInput.trim())
                setCoordinatesInput([coordinatesInput, ...coordinates].join(", "));
            else
                setCoordinatesInput(coordinates.join(", "));
        });
    }

    return {
        coordinatesInput:
            {
                value: coordinatesInput,
                set: setCoordinatesInput,
            },
        coordinatesSet,
        handlers:
            {
                locationButton:
                    {
                        onClick: onClick_locationButton
                    }
            }
    }
}

export function DekstopView()
{
    let controller = useController();

    return (
        <div style={{height: "98vh"}} className={"w-screen h-screen flex"}>
            <OpenStreetMap className={"w-2/3 m-3 shadow-2xl"}>
                <Land collection={controller.coordinatesSet.WGS84}/>
            </OpenStreetMap>
            <div className={"w-auto h-full flex grow flex-col m-3 p-3 space-y-2 justify-start items-stretch"}>
                <div className={"px-1 flex flex-row space-x-4"}>
                    <Input value={controller.coordinatesInput.value}
                           onChange={event => controller.coordinatesInput.set(event.target.value)}
                           placeholder={"Start typing coordinates in pairs WGS84 or GGRS87 separated by commas (,)"}
                           variant={"standard"} className={"w-full"}/>
                    <IconButton onClick={controller.handlers.locationButton.onClick}><Location2/></IconButton>
                </div>
                <CoordinatesTable data={toTableData(controller.coordinatesSet)}/>
                <div className={"status w-full py-3 px-4 shadow-grey-600 shadow-2xl"}>
                    {controller.coordinatesSet.UTM.area() !== -1 ? controller.coordinatesSet.UTM.area().toLocaleString("en-GB", {maximumFractionDigits: 2}) + " m²" : "0 m²"}
                </div>
            </div>
        </div>
    )
}

export function MobileView()
{
    let controller = useController();

    return (
        <Tabs value={"0"}>
            <TabsHeader>
                <Tab value={""}>
                    DIV
                </Tab>
            </TabsHeader>
            <TabsBody>

            </TabsBody>
        </Tabs>

    );
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
