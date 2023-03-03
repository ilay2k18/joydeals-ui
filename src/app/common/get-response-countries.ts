import { Country } from "./country";

export interface GetResponseCountries {
    _embedded: {
        countries: Country[];
    }
}
