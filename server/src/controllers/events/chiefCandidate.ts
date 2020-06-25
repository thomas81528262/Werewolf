import { Target, DayTimeingEvent, DayConditionalEvent } from "../event";

enum eN {
  ChiefCandidate = "CHIEF_CANDIDATE",
}

class ChiefCandidate extends DayConditionalEvent {
  constructor() {
    super({ name: eN.ChiefCandidate, accessRole: [] });
  }

  async wait() {
    let isFinish = true;

    this.playersLock.forEach((isLock, id) => {
      if (!isLock) {
        isFinish = false;
      }
    });

    if (isFinish) {
      this.next();
    }
  }
  start() {
    if (this.world.day !== 1) {
      this.next();
    } else {
      super.start();
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
    if (targetId !== initiatorId && targetId !== -1) {
      return;
    }
    super.addAction({ initiatorId, targetId, eventName, day, isLock });
  }

  targets({ initiatorId, day }: { initiatorId: number; day: number }) {
    const targets: Target[] = [];

    const initiator = this.world.players.get(initiatorId);
    if (!initiator && this.hasIdPermission({ initiatorId })) {
      return [];
    }

    const actions = this.lastAction(day, initiatorId);

    /*
    if (!actions.length) {
      return [];
    }
    */

    const action = actions.length
      ? actions[0]
      : { initiatorId: -1, targetId: -1 };

    this.world.players.forEach((player) => {
      const { isDie, id } = player;

      if (id !== initiatorId) {
        return;
      }

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

const dayEvent = [new ChiefCandidate()];

export default { dayEvent, eN, ChiefCandidate };
