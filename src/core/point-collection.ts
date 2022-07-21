import {LatLng} from "leaflet";

function mean(sequence: number[])
{
    return sequence.length ? sequence.reduce((previousValue, currentValue) => previousValue + currentValue, 0.) / sequence.length : 0;
}

export class PointCollection
{
    array_: number[][];

    constructor(array_: number[][] = [])
    {
        this.array_ = array_;
    }

    addPoint(position: number[])
    {
        this.array_.push(position);
    }

    collectionAsLatLng(): LatLng[]
    {
        return this.array_.map(value => new LatLng(value[0], value[1]));
    }

    getCentroid(): number[]
    {
        if (this.array_.length > 0)
        {
            return Array(this.array_[0].length).fill(0).map((value, index) => mean(this.array_.map(value => value[index])));
        } else
            return [];
    }
}
