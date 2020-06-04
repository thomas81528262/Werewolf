import { StateEvent } from "../controllers/event";

export enum State {
  Die,
}



export default class Player {
  private _id: number = null;
  private _role: string = null;
  private _stateEvents: StateEvent[] = [];
  private _states: { state: State; day: number }[] = [];

  constructor({ id, role }) {
    this._id = id;
    this._role = role;
  }

  startEvent(state:State) {
    /*this._states.forEach((s) => {
      
    });*/
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
    isLock
  }: {
    targetId: number;
    day: number;
    eventName: string;
    isLock:boolean;
  }) {
    this._states.forEach((s) => {
      this._stateEvents.forEach((event) => {
        event.addAction({
          initiatorId: this._id,
          targetId,
          eventName,
          day,
          state: s.state,
          isLock
        });
      });
    });
  }

  getEventTarget() {}

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

  get id() {
    return this._id;
  }

  get role() {
    return this._role;
  }

  get isDie(): boolean {
    return this._states.filter((s) => s.state === State.Die).length > 0;
  }

  get stateEvent(): ReadonlyArray<Readonly<StateEvent>> {
    return this._stateEvents;
  }
}


export type PlayersReadyOnly = ReadonlyMap<number, Player>;
export type Players = Map<number, Player>;

//export default { Player, State};
