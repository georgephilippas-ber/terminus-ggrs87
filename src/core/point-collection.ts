type coords = number[];

type collection = coords[];

export type bounds_type = { min: number, max: number }[];

let allowed: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", ",", ".", "e", "E"];

function sum(array_: number[])
{
    return array_.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
}

function mean(array_: number[])
{
    return array_.length > 0 ? sum(array_) / array_.length : 0;
}

function preprocess(string_: string): string
{
    return string_.split("").filter(value => allowed.includes(value)).join("");
}

function split(string_: string): number[]
{
    return string_.split(",").map(value => parseFloat(value)).filter(value => !isNaN(value));
}

function to_collection(array: number[]): collection
{
    let array_: collection = [];

    if (array.length === 0)
        return [];

    for (let i = 0; i < Math.floor(array.length / 2) * 2; i += 2)
        array_.push([array[i], array[i + 1]])

    return array_;
}

export class Collection
{
    array_: collection

    constructor(array_: collection = [])
    {
        this.array_ = array_;
    }

    add(coords_: coords)
    {
        this.array_.push(coords_);
    }

    length()
    {
        return this.array_.length;
    }

    dimension(): number
    {
        return this.array_.length > 0 ? this.array_[0].length : 0;
    }

    centroid(): number[]
    {
        if (this.dimension() === 0 || this.length() === 0)
            return [];

        return Array(this.dimension()).fill(0).map((value, index) => mean(this.array_.map(value => value[index])));
    }

    area(): number
    {
        if (this.dimension() < 2 || this.length() < 3)
            return -1.;

        let partialSum = 0.;

        for (let i = 0; i < this.array_.length - 1; i++)
            partialSum += (this.array_[i][0] * this.array_[i + 1][1]) - (this.array_[i + 1][0] * this.array_[i][1]);

        partialSum += (this.array_[this.array_.length - 1][0] * this.array_[0][1] - this.array_[0][0] * this.array_[this.array_.length - 1][1]);

        return 1 / 2 * Math.abs(partialSum);
    }

    getCollection(): coords[]
    {
        return this.array_;
    }

    validateBounds(bounds: bounds_type)
    {
        return !Array(this.dimension()).fill(0).map((value, index) => this.array_.filter(value => value[index] >= bounds[index].min && value[index] <= bounds[index].max).length).filter(value => value !== this.array_.length).length
    }
}

export function processPlane(string_: string): Collection
{
    return new Collection(to_collection(split(preprocess(string_))));
}
