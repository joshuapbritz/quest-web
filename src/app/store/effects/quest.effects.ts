import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { AngularFirestore } from "@angular/fire/firestore";
import * as actions from '../actions/';
import { switchMap, mergeMap, map } from 'rxjs/operators';
import { Quest, QuestData } from "src/app/models/quest";

@Injectable()
export class QuestEffects {

    constructor(private actions$: Actions, 
        private angularFirestore: AngularFirestore) {}
        planetName: string;
        userId: string;

        @Effect()
        RequestInProgressQuestExists$ = this.actions$.ofType(actions.REQUEST_IN_PROGRESS_QUEST_EXISTS).pipe(
            switchMap((action: actions.RequestInProgressQuestExists) => {
                this.planetName = action.planetNamePayload;
                this.userId = action.userIdPayload;
                return this.angularFirestore.collection(this.planetName + "/explorers/entries/" + this.userId + "/quests", ref => ref.where('status', '==', 'in_progress')).get();
            }),
            map(snapShot => {
                if(snapShot.size === 0) {
                    return new actions.NoCurrentQuest();
                }
                return new actions.RequestGetCurrentQuest();
            })
        );

        @Effect()
        GetCurrentQuest$ = this.actions$.ofType(actions.REQUEST_GET_CURRENT_QUEST).pipe(
            switchMap((action: actions.RequestGetCurrentQuest) => {                                                     
                return this.angularFirestore.collection(this.planetName + "/explorers/entries/" + this.userId + "/quests", ref => ref.where('status', '==', 'in_progress')).stateChanges();
            }),
            mergeMap(actions => actions),
            map(action => {
                if(action.type === "added") {
                    return new actions.GetQuestSuccess(new Quest(action.payload.doc.id, action.payload.doc.data() as QuestData));
                }
                return new actions.UnimplementedAction("");
            })
        ); 
}