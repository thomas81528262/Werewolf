import { StateEvent } from "../controllers/event";
import World from "../controllers/world";
export enum State {
  Die,
  Chief
}


interface TargetInfo {
  targetId:number;
  value: string 
}


export default class Player {
  private _id: number = null;
  private _role: string = null;
  private _world: World = null;
  private _camp: string = null;
  name: string = null;
  private _stateEvents: StateEvent[] = [];
  private _states: { state: State; day: number }[] = [];
  private _targetsInfo = [];

  constructor({ id, role, world,camp }) {
    this._id = id;
    this._role = role;
    this._world = world;
    this._camp = camp;
  }


  addTargeInfo({targetId, value }:{targetId:number, value:string}) {
    this._targetsInfo.push({targetId, value});

  }

  startEvent(state: State) {
    this._stateEvents.forEach((event) => {
      event.start({ id: this.id, state });
    });
  }

  get isBusy() {
    let isBusy = false;

    this._stateEvents.forEach((event) => {
      if (event.isEnd) {
        isBusy = true;
      }
    });

    return isBusy;
  }

  addEventAction({
    targetId,
    eventName,
    day,
    isLock,
  }: {
    targetId: number;
    day: number;
    eventName: string;
    isLock: boolean;
  }) {
    this._stateEvents.forEach((event) => {
      event.addAction({
        initiatorId: this.id,
        targetId,
        eventName,
        day,
        isLock,
      });
    });
  }

  getEventTarget({initiatorId, day}:{initiatorId:number, day:number}) {
    
    let result = [];
    this._stateEvents.forEach((event) => {
      const eTargets = event.targets({initiatorId, day});
      result = [...result, ...eTargets];
    });

    return result;

  }

  addEvent(event: StateEvent) {
    this._stateEvents.push(event);
  }

  addState({ day, state }: { day: number; state: State }) {
    this._states.push({ day, state });
  }

  getState(day: number) {
    const result = this._states.filter((s) => s.day === day);
    return result.sort();
  }

  get camp() {
    return this._camp;
  }

  get id() {
    return this._id;
  }

  get role() {
    return this._role;
  }

  get isDie(): boolean {
    return this._states.filter((s) => s.state === State.Die).length > 0;
  }
  get isChief(): boolean {
    return this._states.filter((s)=>s.state=== State.Chief).length > 0;
  }

  get stateEvent(): ReadonlyArray<Readonly<StateEvent>> {
    return this._stateEvents;
  }

  hasState({ day, eventName }: { day: number; eventName: string }) {
    return this._world.statuses.isExist({ targetId: this.id, day, eventName });
  }
}

export type PlayersReadyOnly = ReadonlyMap<number, Player>;
export type Players = Map<number, Player>;
