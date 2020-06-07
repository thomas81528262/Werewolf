import { DayEvent, StateEvent } from "./event";
import  Player, { State } from "../models/player";
import { Statuses } from "../models/status";

export default abstract class World {
  private _players: Map<number, Player> = new Map();
  private _day: number = 0;
  private _dayEvent: DayEvent = null;
  private _statuses: Statuses = new Statuses();
  private stateEvents: StateEvent[] = [];
  private isStart = false;

  constructor({
    dayEvents,
    stateEvents,
  }: {
    dayEvents: DayEvent[];
    stateEvents: StateEvent[];
  })
  {
    //connect all the day events
    let preEvent: DayEvent = null;

    dayEvents.forEach((dayEvent) => {
      dayEvent.setWorld(this);
      if (!preEvent) {
        this._dayEvent = dayEvent;
        preEvent = dayEvent;
      } else {
        preEvent.setNextEvent(dayEvent);
        preEvent = dayEvent;
      }
    });

    stateEvents.forEach((stateEvent)=>{
      stateEvent.setWorld(this);
    })

    this.stateEvents = [...stateEvents];

  }

  get players(): ReadonlyMap<number, Player> {
    return this._players;
  }

  addPlayer({ role, id, camp }) {
    const player = new Player({ id, role ,world:this, camp});
    this._players.set(id, player);
    this.stateEvents.forEach((stateEvent) => {
      if (stateEvent.hasIdPermission({ initiatorId: id })) {
        player.addEvent(stateEvent);
      }
    });
  }

  //action interface for the event action
  addAction({
    initiatorId,
    targetId,
    eventName,
    isLock
  }: {
    initiatorId: number;
    targetId: number;
    eventName: string;
    isLock: boolean;
  }) {
    this._dayEvent.addAction({
      initiatorId,
      targetId,
      eventName,
      day: this.day,
      isLock
    });
  }

  //target interface for the event target interface
  targets({ initiatorId }: { initiatorId: number }) {
    return this._dayEvent.targets({ initiatorId, day:this.day });
  }

  async start() {

    if (!this.isStart) {
      this._day += 1;
      this.isStart = true;
      this._dayEvent.start();
    } 
    

  }
  end() {
    this.isStart = false;
  }

  get day() {
    return this._day;
  }

  get statuses() {
    return this._statuses;
  }

  set dayEvent(event: DayEvent) {
    this._dayEvent = event;
  }


  

  abstract setPlayerState():void;
}


