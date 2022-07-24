import "./main.css"

import {Download, Location2, Share2} from "@styled-icons/icomoon"

import {OpenStreetMap} from "../fundamental";
import {Land} from "../land";
import React, {MouseEventHandler} from "react";

import {process} from "../../core/point-collection";

import {Button, IconButton, Input, Tab, TabPanel, Tabs, TabsBody, TabsHeader} from "@material-tailwind/react";
import {coordinatesSet_type, getCoordinatesSet, toTableData} from "../../core/conversion";
import {action, computed, makeObservable, observable} from "mobx";
import {observer} from "mobx-react";

import { Email, Globe, Send, Table} from "../../assets/assets";

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
        <div className={"table-wrapper h-full w-full overflow-y-auto"}>
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

class Controller
{
    coordinatesInput: string;
    shareEmail: string;

    constructor()
    {
        this.coordinatesInput = "";
        this.shareEmail = "";

        makeObservable(this, {
            coordinatesInput: observable,
            setCoordinatesInput: action,
            getSet: computed,
            onClick_locationButton: action,
            shareEmail: observable,
            setShareEmail: action
        });
    }

    get getSet(): coordinatesSet_type
    {
        return getCoordinatesSet(process(this.coordinatesInput));
    }

    setCoordinatesInput(coordinatesInput: string)
    {
        this.coordinatesInput = coordinatesInput;
    }

    setShareEmail(shareEmail: string)
    {
        return this.shareEmail = shareEmail;
    }

    onClick_locationButton: MouseEventHandler<HTMLButtonElement> = (event) =>
    {
        navigator.geolocation.getCurrentPosition(position =>
        {
            let coordinates = [position.coords.latitude, position.coords.longitude];

            if (this.coordinatesInput.trim())
                this.setCoordinatesInput([this.coordinatesInput, ...coordinates].join(", "));
            else
                this.setCoordinatesInput(coordinates.join(", "));
        });
    }
}

export const controller = new Controller();

export const Desktop = observer(() =>
{
    let coordinatesSet = controller.getSet;

    return (
        <div className={"w-full h-screen flex flex-row"}>
            <div className={"w-2/3 h-full shadow-2xl"}>
                <OpenStreetMap style={{height: "100%"}}>
                    <Land collection={coordinatesSet.WGS_84}/>
                </OpenStreetMap>
            </div>
            <div className={"m-3 px-3 flex flex-col flex-auto h-full space-y-2.5"} style={{height: "98%"}}>
                <div className={"px-1 flex flex-row space-x-4"}>
                    <Input value={controller.coordinatesInput}
                           onChange={event => controller.setCoordinatesInput(event.target.value)}
                           placeholder={"Start typing coordinates in pairs WGS-84 or GGRS-87 separated by commas (,)"}
                           variant={"standard"} className={"w-full"}/>
                    <IconButton onClick={controller.onClick_locationButton}><Location2/></IconButton>
                </div>
                <div className={"flex-auto overflow-y-auto"}>
                    <CoordinatesTable data={toTableData(coordinatesSet)}/>
                </div>
                <div className={"status w-full px-4 py-2 shadow-grey-600 shadow-2xl"}>
                    {coordinatesSet.UTM.area() !== -1 ? coordinatesSet.UTM.area().toLocaleString("en-GB", {maximumFractionDigits: 2}) + " m²" : "0 m²"}
                </div>
            </div>
        </div>
    );
});

let Share = observer(() =>
{
    return (
        <div className={"w-full h-full flex flex-col p-3 space-y-2.5"}>
            <div className={"flex space-x-2"}>
                <Input placeholder={"recipient e-mail address"} variant={"standard"}/>
                <IconButton color={"green"} variant={"filled"}>
                    <Send size={"1.35em"}/>
                </IconButton>
            </div>
            <div className={"flex space-x-2"}>
                <Input placeholder={"filename (.DXF implied)"} variant={"standard"}/>
                <IconButton variant={"filled"}>
                    <Download/>
                </IconButton>
            </div>
        </div>
    );
});

export const Mobile = observer(() =>
{
    let coordinatesSet = controller.getSet;

    return (
        <Tabs value={"email"} className={"h-full"}>
            <TabsHeader>
                <Tab value={"map"}>
                    <div className={"flex flex-row space-x-5"}>
                        <Globe size={"2.15em"}/>
                        <div style={{fontFamily: "Cabin, sans-serif", fontSize: "1.15rem"}}>Map</div>
                    </div>
                </Tab>
                <Tab value={"table"}>
                    <div className={"flex flex-row space-x-5"}>
                        <Table size={"1.85em"}/>
                        <div style={{fontFamily: "Cabin, sans-serif", fontSize: "1.15rem"}}>Data</div>
                    </div>
                </Tab>
                <Tab value={"email"}>
                    <div className={"flex flex-row space-x-5"}>
                        <Email size={"1.85em"}/>
                        <div style={{fontFamily: "Cabin, sans-serif", fontSize: "1.15rem"}}>Share</div>
                    </div>
                </Tab>
            </TabsHeader>
            <TabsBody className={"h-full"}>
                <TabPanel style={{height: "96%"}} className={"p-1 flex flex-col space-y-2.5"} value={"map"}>
                    <div className={"px-1 flex flex-row space-x-4"}>
                        <Input value={controller.coordinatesInput}
                               onChange={event => controller.setCoordinatesInput(event.target.value)}
                               placeholder={"Enter coordinates in pairs"}
                               variant={"standard"} className={"w-full"}/>
                        <IconButton onClick={controller.onClick_locationButton}><Location2/></IconButton>
                    </div>
                    <div className={"flex-auto"}>
                        <OpenStreetMap style={{height: "100%"}}>
                            <Land collection={coordinatesSet.WGS_84}/>
                        </OpenStreetMap>
                    </div>
                </TabPanel>
                <TabPanel style={{height: "95%"}} className={"p-1 flex flex-col space-y-2.5"} value={"table"}>
                    <div className={"px-1 flex flex-row space-x-4"}>
                        <Input value={controller.coordinatesInput}
                               onChange={event => controller.setCoordinatesInput(event.target.value)}
                               placeholder={"Start typing coordinates in pairs WGS-84 or GGRS-87 separated by commas (,)"}
                               variant={"standard"} className={"w-full"}/>
                        <IconButton onClick={controller.onClick_locationButton}><Location2/></IconButton>
                    </div>
                    <div className={"flex-auto overflow-y-auto"}>
                        <CoordinatesTable data={toTableData(coordinatesSet)}/>
                    </div>
                    <div className={"status w-full py-3 px-4 shadow-grey-600 shadow-2xl"}>
                        {coordinatesSet.UTM.area() !== -1 ? coordinatesSet.UTM.area().toLocaleString("en-GB", {maximumFractionDigits: 2}) + " m²" : "0 m²"}
                    </div>
                </TabPanel>
                <TabPanel value={"email"}>
                    <Share/>
                </TabPanel>
            </TabsBody>
        </Tabs>
    );
});

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
