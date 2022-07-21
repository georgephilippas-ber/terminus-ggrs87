import "./main.css"

import {OpenStreetMap} from "../fundamental";
import {Land} from "../land";
import React from "react";

import {PointCollection} from "../../core/point-collection";
import {Button, Input} from "@material-tailwind/react";

function TableRow(props: { index: number; data: number[] })
{
    return (
        <tr key={props.index}>
            <th>{props.index}</th>
            {props.data.map(value => <td>{value}</td>)}
        </tr>
    );
}

function toRows(cartesianCollection: PointCollection, geographicalCollection: PointCollection): JSX.Element[]
{
    let array = [];

    for (let i = 0; i < cartesianCollection.length(); i++)
        array.push(<TableRow key={i} index={i + 1}
                             data={[...cartesianCollection.array_[i], ...geographicalCollection.array_[i]]}/>);

    return array;
}

function Table(props: { cartesianCollection?: PointCollection, geographicalCollection?: PointCollection })
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
                {props.cartesianCollection && props.geographicalCollection ? toRows(props.cartesianCollection, props.geographicalCollection) : null}
                </tbody>
            </table>
        </div>
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
                <Input placeholder={"Points"} variant={"standard"} className={"w-full"}/>
                <Table geographicalCollection={new PointCollection([[30, 40]])} cartesianCollection={new PointCollection([[10, 20]])}/>
                <div>
                    <Button>Compute</Button>
                </div>
            </div>
        </div>
    )
}
