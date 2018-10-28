import { Action } from "@ngrx/store";
import { Planet } from "src/app/models/planet";

export const REQUEST_GET_PLANETS = "[planet] REQUEST_GET_PLANETS";
export const REQUEST_GET_SIGNED_IN_USER_PLANETS = "[planet] REQUEST_GET_SIGNED_IN_USER_PLANETS";
export const GET_PLANET_SUCCESS = "[planet] GET_PLANET_SUCCESS";

export class RequestGetPlanets implements Action {
    type = REQUEST_GET_PLANETS;
    constructor() {}
}

export class RequestGetSignedInUserPlanets implements Action {
    type = REQUEST_GET_SIGNED_IN_USER_PLANETS;
    constructor() {}
}

export class GetPlanetSuccess implements Action {
    type = GET_PLANET_SUCCESS;
    constructor(public payload: Planet) {}
}

export type PlanetActions =
    | RequestGetPlanets
    | RequestGetSignedInUserPlanets
    | GetPlanetSuccess