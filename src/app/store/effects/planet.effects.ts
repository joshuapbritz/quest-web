import * as actions from '../actions';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, mergeMap, map } from 'rxjs/operators';
import { Planet, PlanetData } from 'src/app/models/planet';

@Injectable() 
export class PlanetEffects {
    
    constructor(private actions$: Actions, private angularFirestore: AngularFirestore) {}

    @Effect() 
    GetPlanet$ = this.actions$.ofType(actions.REQUEST_GET_PLANETS).pipe(
        switchMap((action: actions.RequestGetPlanets) => {
            return this.angularFirestore.collection("planets").stateChanges();
        }),
        mergeMap(actions => actions),
        map(action => {
            if(action.type === "added") {
                return new actions.GetPlanetSuccess(new Planet(action.payload.doc.id, action.payload.doc.data() as PlanetData));
            }
            return new actions.UnimplementedAction("");
        })
    )

    // GetSignedInUserPlanet$ = this.actions$.ofType(actions.REQUEST_GET_SIGNED_IN_USER_PLANETS).pipe(
    //     switchMap((action: actions.RequestGetSignedInUserPlanets) => {
    //         return this.angularFirestore.collection
    //     })
    // )
}