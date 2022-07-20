export type ellipsoid_parameters_type =
    {
        a: number;
        b: number;
        inv_f: number;
        sqr_e: number;
    }

type ellipsoid_type = "GRS 80" | "Bessel" | "Hayford";

export const ellipsoids: { [ellipsoid_ in ellipsoid_type]: ellipsoid_parameters_type } =
    {
        "GRS 80":
            {
                a: 6378137.0,
                b: 6356752.314,
                inv_f: 298.257222101,
                sqr_e: 0.006694380
            },
        "Bessel":
            {
                a: 6377397.155,
                b: 6356078.963,
                inv_f: 299.1528128,
                sqr_e: 0.006674372
            },
        "Hayford":
            {
                a: 6378388.000,
                b: 6356911.946,
                inv_f: 297.000,
                sqr_e: 0.006722670
            }
    }

function N(ellipsoid: ellipsoid_type, phi: number)
{
    let a = ellipsoids[ellipsoid].a;
    let sqr_e = ellipsoids[ellipsoid].sqr_e;

    return a / Math.sqrt(1 - sqr_e * Math.sin(phi) ** 2);
}

function phi(x: number, y: number, ellipsoid: ellipsoid_type, initial: number = Math.PI)
{
    let phi = initial; let cal = initial;
    do {
        phi = cal;
        cal = Math.atan( + ellipsoids[ellipsoid].sqr_e * N(ellipsoid, phi) / (Math.sqrt(x ** 2 + y ** 2)))
    } while (Math.abs( cal - phi) > 1.e-4);

    return cal;
}

function lambda(x: number, y: number)
{
    return Math.atan(y / x);
}

export function convert(coordinates: number[]): number[]
{
    return [phi(coordinates[0] + 199.87, coordinates[1] - 74.79, "Bessel") * 180 / Math.PI, lambda(coordinates[0] + 199.87, coordinates[1] - 74.79) * 180 / Math.PI];
}

