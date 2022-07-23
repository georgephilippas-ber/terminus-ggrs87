import {Collection} from "./point-collection";

import {bounds_type} from "./point-collection";
import {toGeographical, toUTM} from "./coordinate-systems";

// http://epsg.io/2100

const GGRS87_greece_bounds: bounds_type = [{min: 94874.71, max: 3868409.44}, {min: 857398.00, max: 4630676.91}];

//const WGS84_greece_bounds: bounds_type = [{min: 28.3, max: 41.75}, {min: 19.57, max: 34.88}];

//

function calculate(sourceCollection: Collection, targetCoordinateSystem: "utm" | "wsg84"): Collection
{
    let targetCollection: Collection = new Collection();

    sourceCollection.getCollection().forEach(value =>
    {
        let targetPosition;

        if (targetCoordinateSystem === "utm")
            targetPosition = toUTM([value[0], value[1], 0])
        else
            targetPosition = toGeographical([value[0], value[1], 0])

        targetCollection.add([targetPosition[0], targetPosition[1]]);
    });

    return targetCollection;
}

type coordinatesSet_type = {
    UTM: Collection, WGS_84: Collection
};

export function getCoordinatesSet(sourceCollection: Collection): coordinatesSet_type
{
    let utm: Collection = new Collection([]), wsg84: Collection = new Collection([]);

    if (sourceCollection.validateBounds(GGRS87_greece_bounds))
    {
        utm = sourceCollection;
        wsg84 = calculate(sourceCollection, "wsg84");
    } else if (sourceCollection.validateBounds([{min: -90, max: 90}, {min: -180, max: 180}]))
    {
        wsg84 = sourceCollection;
        utm = calculate(sourceCollection, "utm");
    }

    return {
        UTM: utm, WGS_84: wsg84
    }
}

export function toTableData(collectionSet: coordinatesSet_type): number[][]
{
    let data_: number[][] = [];

    let length: number = Math.min(collectionSet.UTM.length(), collectionSet.WGS_84.length());

    for (let i = 0; i < length; i++)
        data_.push([collectionSet.WGS_84.getCollection()[i][0], collectionSet.WGS_84.getCollection()[i][1], collectionSet.UTM.getCollection()[i][0], collectionSet.UTM.getCollection()[i][1]]);

    return data_;
}
