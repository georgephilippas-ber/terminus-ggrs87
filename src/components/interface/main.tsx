import "./main.css"

import {Earth, Location2} from "@styled-icons/icomoon"

import {OpenStreetMap} from "../fundamental";
import {Land} from "../land";
import React, {MouseEventHandler, useMemo, useState} from "react";

import {process} from "../../core/point-collection";

import {IconButton, Input, Tabs, Tab, TabsBody, TabsHeader, TabPanel} from "@material-tailwind/react";
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
        <div className={"table-wrapper h-full overflow-auto my-2"} style={{display: "initial"}}>
            <table className={"fl-table"}>
                <thead className={""}>
                <tr>
                    <th/>
                    <th colSpan={2}>
                        WGS 84
                    </th>
                    <th colSpan={2}>
                        GGRS 87
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
                <tbody className={"grow"}>
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

export function Desktop()
{
    let controller = useController();

    return (
        <div style={{height: "98vh"}} className={"w-screen h-screen flex"}>
            <OpenStreetMap className={"grow-0 w-2/3 h-full m-3 shadow-2xl"}>
                <Land collection={controller.coordinatesSet.WGS_84}/>
            </OpenStreetMap>
            <div className={"grow flex flex-col h-full m-3 p-3"}>
                <div className={"px-1 flex flex-row space-x-4"}>
                    <Input value={controller.coordinatesInput.value}
                           onChange={event => controller.coordinatesInput.set(event.target.value)}
                           placeholder={"Start typing coordinates in pairs WGS-84 or GGRS-87 separated by commas (,)"}
                           variant={"standard"} className={"w-full"}/>
                    <IconButton onClick={controller.handlers.locationButton.onClick}><Location2/></IconButton>
                </div>
                <CoordinatesTable data={toTableData(controller.coordinatesSet)}/>
                <div className={"status w-full py-3 px-4 shadow-grey-600 shadow-2xl"}>
                    {controller.coordinatesSet.UTM.area() !== -1 ? controller.coordinatesSet.UTM.area().toLocaleString("en-GB", {maximumFractionDigits: 2}) + " m²" : "0 m²"}
                </div>
            </div>
        </div>
    );
}

export function Mobile()
{
    let controller = useController();

    return (
        <Tabs value={"div"} className={"h-full border-2 border-red-500 border-red-300"}>
            <TabsHeader>
                <Tab value={"div"}>
                    <Earth style={{width: "1.25em"}}/>
                    MAP
                </Tab>
            </TabsHeader>
            <TabsBody className={"border-2 border-green-500 h-full"}>
                <TabPanel className={"h-full"} value={"div"}>
                    <OpenStreetMap style={{height: "95vh"}}>
                        <Land collection={controller.coordinatesSet.WGS_84}/>
                    </OpenStreetMap>
                </TabPanel>
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
// 537317.75, 4133696.87,


//15876.0
