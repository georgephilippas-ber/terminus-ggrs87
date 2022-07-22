// https://math.libretexts.org/Bookshelves/Calculus/Book%3A_Calculus_(OpenStax)/12%3A_Vectors_in_Space/12.7%3A_Cylindrical_and_Spherical_Coordinates
// https://en.wikipedia.org/wiki/Earth-centered,_Earth-fixed_coordinate_system
// https://en.wikipedia.org/wiki/Geographic_coordinate_system#Latitude_and_longitude
// https://en.wikipedia.org/wiki/Earth_radius

// https://en.wikipedia.org/wiki/Geodetic_Reference_System_1980#Derived_quantities
// https://en.wikipedia.org/wiki/Hellenic_Geodetic_Reference_System_1987

// https://en.wikipedia.org/wiki/Transverse_Mercator_projection
// https://en.wikipedia.org/wiki/Mercator_projection

// https://en.wikipedia.org/wiki/Universal_Transverse_Mercator_coordinate_system
// https://www.linz.govt.nz/data/geodetic-services/coordinate-conversion/projection-conversions/transverse-mercator-transformation-formulae

const earthRadius: number = 6_378_137; //per GRS80

function sum(arr: number[]): number
{
    return arr.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
}

type ellipsoidParameters_type =
    {
        a: number; b: number;
    }

const ellipsoid: ellipsoidParameters_type =
    {
        a: earthRadius,
        b: 6_356_752.314,
    };

type coords = [number, number, number];

function toRadians_spherical(position: coords): coords
{
    return [position[0] * Math.PI / 180., position[1] * Math.PI / 180., position[2]];
}

function toDegrees_spherical(position: coords): coords
{
    return [position[0] / Math.PI * 180., position[1] / Math.PI * 180., position[2]];
}

function latLng_ecefCartesian(latitude: number, longitude: number, radius: number = earthRadius): coords
{
    return ecefCartesian(toRadians_spherical([latitude, longitude, radius])) as coords;
}

function cartesianLength(vector: coords)
{
    return Math.sqrt(vector.map(value => value ** 2).reduce((previousValue, currentValue) => previousValue + currentValue, 0));
}

function ecefCartesian(ecefSpherical_rad: coords): coords
{
    let phi = ecefSpherical_rad[0], lambda = ecefSpherical_rad[1], radius = ecefSpherical_rad[2];

    let x = radius * Math.cos(phi) * Math.cos(lambda);
    let y = radius * Math.cos(phi) * Math.sin(lambda);

    let z = radius * Math.sin(phi);

    return [x, y, z];
}

function ecefSpherical(ecefCartesian: coords, radius: number = cartesianLength(ecefCartesian)): coords
{
    let x = ecefCartesian[0], y = ecefCartesian[1], z = ecefCartesian[2];

    //phi = f(z) -radius <= z <= radius

    let phi: number, lambda: number;

    if (radius !== cartesianLength(ecefCartesian))
    {
        if (Math.abs(z) > radius)
            phi = Math.sign(z) * Math.PI / 2.;
        else
            phi = Math.asin(z / radius);
    } else
        phi = Math.asin(z / radius);

    lambda = x >= 0 ? Math.atan2(y, Math.abs(x)) : Math.PI - Math.atan2(y, Math.abs(x))

    return [phi, lambda, radius];
}

type preliminaryQuantities_type =
    {
        n: number;
        A: number;
        alpha: [number, number, number],
        beta: [number, number, number],
        delta: [number, number, number]
    };

function getPreliminary(ellipsoid: ellipsoidParameters_type): preliminaryQuantities_type
{
    let a = ellipsoid.a, b = ellipsoid.b;

    let f = 1. - b / a;

    let n = f / (2. - f);

    let A = a / (1 + n) * (1. + n ** 2 / 4 + n ** 4 / 64.); //series

    let alpha: [number, number, number] = [1 / 2 * n - 2 / 3 * n ** 2 + 5 / 16 * n ** 3, 13. / 48. * n ** 2 - 3 / 5 * n ** 3, 61. / 240. * n ** 3];
    let beta: [number, number, number] = [1 / 2 * n - 2 / 3 * n ** 2 + 37 / 96 * n ** 3, 1 / 48 * n ** 2 + 1 / 15 * n ** 3, 17. / 480 * n ** 3]
    let delta: [number, number, number] = [2 * n - 2 / 3 * n ** 2 - 2 * n ** 3, 7 / 3 * n ** 2 - 8 / 5 * n ** 3, 56 / 15 * n ** 3];

    return {
        n, A, alpha, beta, delta
    }
}

type projectionParameters_type =
    {
        refCoordinates: { easting: number; northing: number; };
        refMeridian_lng: number;
        scaleFactor: number;
    }

const GGRS87_UTM_parameters: projectionParameters_type = Object.freeze(
    {
        refCoordinates:
            {
                easting: 500_000.,
                northing: 0.
            },
        scaleFactor: 0.9996,
        refMeridian_lng: 24
    });

export function toGeographical(utmCoordinates: coords, projectionParameters: projectionParameters_type = GGRS87_UTM_parameters): coords
{
    let preliminary: preliminaryQuantities_type = getPreliminary(ellipsoid);

    let northing: number = utmCoordinates[1], easting: number = utmCoordinates[0];

    let northing_ = projectionParameters.refCoordinates.northing,
        easting_ = projectionParameters.refCoordinates.easting;

    let xi = (northing - northing_) / (projectionParameters.scaleFactor * preliminary.A);
    let eta = (easting - easting_) / (projectionParameters.scaleFactor * preliminary.A);

    let xi_prime = xi - sum(preliminary.beta.map((value, index) => value * Math.sin(2. * (index + 1) * xi) * Math.cosh(2. * (index + 1) * eta)));
    let eta_prime = eta - sum(preliminary.beta.map((value, index) => value * Math.cos(2. * (index + 1) * xi) * Math.sinh(2. * (index + 1) * eta)));

//    let sigma_prime = 1 - sum(preliminary.beta.map((value, index) => 2 * (index + 1) * value * Math.cos(2. * (index + 1) * xi) * Math.cosh(2. * (index + 1) * eta)));
//    let tau_prime = sum(preliminary.beta.map((value, index) => 2. * (index + 1) * value * Math.sin(2. * (index + 1) * xi) * Math.sinh(2. * (index + 1) * eta)));

    let chi = Math.asin(Math.sin(xi_prime) / Math.cosh(eta_prime));

    let phi = chi + sum(preliminary.delta.map((value, index) => value * Math.sin(2. * (index + 1) * chi)));

    let lambda = projectionParameters.refMeridian_lng * Math.PI / 180. + Math.atan(Math.sinh(eta_prime) / Math.cos(xi_prime));

    return [phi * 180 / Math.PI, lambda * 180 / Math.PI, utmCoordinates[2]];
}

export function toUTM(geographicalCoordinates: coords, projectionParameters: projectionParameters_type = GGRS87_UTM_parameters)
{
    let preliminary: preliminaryQuantities_type = getPreliminary(ellipsoid);

    let phi = geographicalCoordinates[0] * Math.PI / 180.;
    let lambda = geographicalCoordinates[1] * Math.PI / 180.;

    let t = Math.sinh(Math.atanh(Math.sin(phi)) - 2 * Math.sqrt(preliminary.n) / (1 + preliminary.n) * Math.atanh(2 * Math.sqrt(preliminary.n) * Math.sin(phi) / (1 + preliminary.n)));

    let xi_prime = Math.atan(t / (Math.cos(lambda - projectionParameters.refMeridian_lng)));
    let eta_prime = Math.atanh(Math.sin(lambda - projectionParameters.refMeridian_lng) / Math.sqrt(1 + t ** 2));

    let E = projectionParameters.refCoordinates.easting + projectionParameters.scaleFactor * preliminary.A * (
        eta_prime + sum(preliminary.alpha.map((value, index) => value * Math.cos(2 * (index + 1) * xi_prime) * Math.sinh(2 * (index + 1) * eta_prime))));

    let N = projectionParameters.refCoordinates.northing + projectionParameters.scaleFactor * preliminary.A * (
        xi_prime + sum(preliminary.alpha.map((value, index) => value * Math.sin(2. * (index + 1) * xi_prime) * Math.cosh(2. * (index + 1) * eta_prime))));

    return [E, N, geographicalCoordinates[2]];
}
