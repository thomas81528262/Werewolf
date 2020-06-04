import { timeout } from "../util";
import World from "./world";
import { Actions } from "../models/actions";
import { State } from "../models/player";

interface TargetEvent {
  name: string;
  targets: Target[];
}

interface Target {
  eventName: string;
  targetId: number;
  initiatorsId: number[];
  value: string | number | null;
}

abstract class Event {
  private _name = "";
  private accessRole: string[] = [];
  protected world: World = null;
  protected actions: Actions = new Actions();
  protected playersLock = new Map<number, boolean>();
  constructor({ name, accessRole }: { name: string; accessRole: string[] }) {
    this._name = name;
    this.accessRole = accessRole;
  }

  abstract wait(): void;

  protected iniPlayersLock() {
    this.playersLock = new Map<number, boolean>();

    this.world.players.forEach((player) => {
      const { id } = player;
      if (this.hasIdPermission({ initiatorId: id })) {
        this.playersLock.set(id, false);
      }
    });
  }

  //default action control, remove all the initiator action, and add new action if the target is valid
  protected actionControl({
    initiatorId,
    targetId,
    eventName,
    date,
    day,
  }: {
    initiatorId: number;
    targetId: number;
    eventName: string;
    day: number;
    date: Date;
  }) {
    this.actions.remove(initiatorId);

    if (this.world.players.get(targetId)) {
      this.actions.add({ eventName, initiatorId, targetId, date, day });
    }
  }
  addAction({
    initiatorId,
    targetId,
    eventName,
    day,
    isLock,
  }: {
    initiatorId: number;
    targetId: number;
    eventName: string;
    day: number;
    isLock: boolean;
  }) {
    //the user should has the permission, and not lock his action
    if (
      eventName !== this._name ||
      !this.playersLock.has(initiatorId) ||
      this.playersLock.get(initiatorId)
    ) {
      return;
    }

    if (isLock) {
      this.playersLock.set(initiatorId, true);
    }

    this.actionControl({
      eventName,
      initiatorId,
      targetId,
      date: new Date(),
      day,
    });
  }

  hasRolePermission(role: string) {
    return this.accessRole.length === 0 || this.accessRole.includes(role);
  }

  hasIdPermission({ initiatorId }: { initiatorId: number }) {
    const player = this.world.players.get(initiatorId);
    if (!player) {
      return false;
    }

    return this.hasRolePermission(player.role);
  }

  abstract targets({
    initiatorId,
    day,
  }: {
    initiatorId: number;
    day: number;
  }): Target[];

  setWorld(world: World) {
    this.world = world;
  }

  protected get name() {
    return this._name;
  }
}

abstract class StateEvent extends Event {
  private accessStates: State[] = [];
  private _isEnd: boolean = false;

  constructor({
    name,
    accessRole,
    accessStates,
  }: {
    name: string;
    accessRole: string[];
    accessStates: State[];
  }) {
    super({ name, accessRole });
    this.accessStates = accessStates;
  }

  start({ id, state }: { id: number; state: State }) {
    this._isEnd = true;
    if (this.hasIdPermission({ initiatorId: id }) && this.isValidState(state)) {
      this.playersLock.set(id, false);
    }
  }

  private isValidState(state: State) {
    return this.accessStates.includes(state);
  }

  addAction({
    initiatorId,
    targetId,
    eventName,
    day,
    state,
    isLock,
  }: {
    initiatorId: number;
    targetId: number;
    eventName: string;
    day: number;
    state: State;
    isLock: boolean;
  }) {
    if (!this.accessStates.includes(state)) {
      return;
    }
    super.addAction({ initiatorId, targetId, eventName, day, isLock });
    this.wait();
  }

  wait() {
    let isEnd = true;

    this.playersLock.forEach((isLock) => {
      if (!isLock) {
        isEnd = false;
      }
    });

    if (isEnd) {
      this.end();
    }
  }

  end() {
    this._isEnd = false;
  }

  get isEnd() {
    return this._isEnd;
  }
}

abstract class DayEvent extends Event {
  private nextEvent: DayEvent = null;

  constructor({
    name,
    accessRole,
  }: 
  {
    name: string;
    accessRole: string[];
    
  }) {
    super({ name, accessRole });
  }

  start() {
    this.world.dayEvent = this;
    this.iniPlayersLock();
    this.wait();
  }

  setNextEvent(event: DayEvent) {
    this.nextEvent = event;
  }

  //save all the action to the world status
  protected end() {
    this.actions.statuses.forEach((status) => {
      this.world.statuses.add(status);
    });
  }

  //end current event and start new event
  protected next() {
    this.end();
    if (this.nextEvent) {
      this.nextEvent.start();
    }
  }
}

abstract class DayTimeingEvent extends DayEvent {
  private _remainTime = 0;
  private timeOutSec = 0;
  constructor({
    name,
    accessRole,
    timeOut,
  }: {
    name: string;
    accessRole: string[];
    timeOut: number;
  }) {
    super({ name, accessRole });
    this.timeOutSec = timeOut;
  }

  async wait() {
    this._remainTime = this.timeOutSec;

    if (this._remainTime) {
      while (this._remainTime) {
        await timeout(1000);
        this._remainTime -= 1;
      }
    } else {
      console.log("no timer set");
    }
    //when the event finish, must call the next event!!!
    this.next();
  }
}

abstract class DayConditionalEvent extends DayEvent {
  actionControl({
    initiatorId,
    targetId,
    eventName,
    date,
    day,
  }: {
    initiatorId: number;
    targetId: number;
    eventName: string;
    day: number;
    date: Date;
  }) {
    super.actionControl({ initiatorId, targetId, eventName, date, day });
    this.wait();
  }
}

export {
  Target,
  TargetEvent,
  StateEvent,
  DayConditionalEvent,
  DayTimeingEvent,
  DayEvent,
};