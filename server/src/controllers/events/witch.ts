import { Target, DayTimeingEvent } from "../event";
import Wolf from "./wolf";

enum eN {
  witchKill = "WITCH_KILL",
  witchCure = "WITCH_CURE",
}

class WitchCure extends DayTimeingEvent {
  constructor() {
    super({ name: eN.witchCure, accessRole: ["witch"], timeOut: 1 });
  }
  get isWitchCured() {
    return (
      this.world.statuses.getStatuses({ eventName: eN.witchKill }).length > 0
    );
  }

  isWolfKill(day: number) {
    return this.world.statuses.getStatuses({
      eventName: Wolf.eN.wolfKill,
      day,
    });
  }

  targets({ initiatorId, day }: { initiatorId: number; day: number }) {
    const targets: Target[] = [];

    const initiator = this.world.players.get(initiatorId);
    if (!initiator && this.hasIdPermission({ initiatorId })) {
      return [];
    }

    const action = this.lastAction(day);

    if (!action || this.isWitchCured) {
      return [];
    }

    this.world.players.forEach((player) => {
      const { isDie, id } = player;

      if (!isDie && this.isWolfKill(day)) {
        const initiatorsId = [];

        if (id === action.targetId) {
          initiatorsId.push(action.initiatorId);
        }

        targets.push({
          initiatorsId,
          eventName: this.name,
          targetId: id,
          value: null,
        });
      }
    });

    return targets;
  }
}

class WitchKill extends DayTimeingEvent {
  constructor() {
    super({ name: eN.witchKill, accessRole: ["witch"], timeOut: 1 });
  }

  get isFinish() {
    return true;
  }

  get isWitchKilled() {
    return (
      this.world.statuses.getStatuses({ eventName: eN.witchKill }).length > 0
    );
  }

  targets({ initiatorId, day }: { initiatorId: number; day: number }) {
    const targets: Target[] = [];

    const initiator = this.world.players.get(initiatorId);
    if (!initiator && this.hasIdPermission({ initiatorId })) {
      return [];
    }

    const action = this.lastAction(day);

    if (!action || this.isWitchKilled) {
      return [];
    }

    this.world.players.forEach((player) => {
      const { isDie, id } = player;

      if (!isDie) {
        const initiatorsId = [];

        if (id === action.targetId) {
          initiatorsId.push(action.initiatorId);
        }

        targets.push({
          initiatorsId,
          eventName: this.name,
          targetId: id,
          value: null,
        });
      }
    });

    return targets;
  }
}

const dayEvent = [new WitchKill(), new WitchCure()];

export default { dayEvent, eN, WitchKill };
