import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app-state';
import { Router } from '@angular/router';
import * as selectors from '../../store/selectors';
import * as actions from '../../store/actions';
import { Planet } from 'src/app/models/planet';
import { User } from 'src/app/models/user';
import { Quest } from 'src/app/models/quest';
import { QuestService } from 'src/app/services/quest/quest.service';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.css']
})
export class QuestsComponent implements OnInit {
  signedInUser: User = {} as User;
  currentPlanet: Planet = {} as Planet;
  signedIn: boolean = false;
  planetQuests: Quest[] = [];
  explorerQuests: Quest[] = [];
  possibleQuests: Quest[] = [];

  constructor(private store: Store<AppState>,
    private router: Router,
    private questService: QuestService) { 

  }

  navigateLogin() {
    this.router.navigateByUrl("login");
  }

  navigateQuest() {
    this.router.navigateByUrl("quest");
  }

  logOutClicked() {
    this.store.dispatch(new actions.LogOutUser);
  }

  questClicked(selectedQuest: Quest) {     
    this.store.dispatch(new actions.GetSelectedQuestSuccess(selectedQuest));
    this.navigateQuest();        
  }

  sliceHasLoginSucceeded() {
    this.store.select(selectors.hasLoginSucceeded).subscribe(signedIn => {
      if(!signedIn) {
        this.navigateLogin();
      }
      else {
        this.signedIn = true;
      }
    });
  }

  sliceSignedInUser() {
    this.store.select(selectors.signedInUser).subscribe(signedInUser => {
      if(this.signedIn) {
        this.signedInUser = signedInUser;        
      }  
    })
  }

  sliceCurrentPlanet() {
    this.store.select(selectors.currentPlanet).subscribe(currentPlanet => {
      if(this.signedIn) {       
        this.currentPlanet = currentPlanet;  
        this.store.dispatch(new actions.RequestGetExplorerQuests(this.currentPlanet.name, this.signedInUser.userId));        
      }  
    })
  }

  slicePlanetQuests() {
    this.store.select(selectors.planetQuests).subscribe(planetQuests => {
      if(this.signedIn) {
        this.planetQuests = planetQuests; 
        this.possibleQuests = this.planetQuests;
      }
    })
  }

  sliceExplorerQuests() {
    this.store.select(selectors.explorerQuests).subscribe(explorerQuests => {
      if(this.signedIn) {                   
        if(explorerQuests.length != 0) {                              
          this.explorerQuests = explorerQuests;
          this.possibleQuests = [];
          this.possibleQuests = this.questService.getPossibleQuests(this.planetQuests, this.explorerQuests, this.currentPlanet.name, this.signedInUser.userId);      
        }   
        else {     
          this.possibleQuests = this.planetQuests;
          this.possibleQuests.forEach(possibleQuest => {
            possibleQuest.isAvailable = this.questService.checkIfPrerequisiteQuestCompleted(this.currentPlanet.name, this.signedInUser.userId, possibleQuest);
          });          
        }          
      }
    })
  }

  ngOnInit() {
    this.sliceHasLoginSucceeded();
    this.sliceSignedInUser();
    this.sliceCurrentPlanet();
    this.slicePlanetQuests();
    this.sliceExplorerQuests();
  }

}
