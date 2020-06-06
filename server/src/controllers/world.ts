import { DayEvent, StateEvent } from "./event";
import  Player from "../models/player";
import { Statuses } from "../models/status";

export default abstract class World {
  private _players: Map<number, Player> = new Map();
  private _day: number = 0;
  private _dayEvent: DayEvent = null;
  private _statuses: Statuses = new Statuses();
  private stateEvents: StateEvent[] = [];

  constructor({
    dayEvents,
  }: {
    dayEvents: DayEvent[];
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
  }

  get players(): ReadonlyMap<number, Player> {
    return this._players;
  }

  addPlayer({ role, id }) {
    const player = new Player({ id, role ,world:this});
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
    this._dayEvent.start();
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


