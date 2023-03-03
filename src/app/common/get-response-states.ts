import { State } from "./state";

export interface GetResponseStates {
    _embedded: {
        states: State[];
    }
}
