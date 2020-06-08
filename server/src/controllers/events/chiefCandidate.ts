import { Target, DayTimeingEvent } from "../event";

enum eN {
  ChiefCandidate = "CHIEF_CANDIDATE",
}

class ChiefCandidate extends DayTimeingEvent {
  constructor() {
    super({ name: eN.ChiefCandidate, accessRole: [], timeOut: 1 });
  }

  start() {
    if (this.world.day !== 1) {
      this.next();
    } else {
      super.start();
    }
  }

  targets({ initiatorId, day }: { initiatorId: number; day: number }) {
    const targets: Target[] = [];

    const initiator = this.world.players.get(initiatorId);
    if (!initiator && this.hasIdPermission({ initiatorId })) {
      return [];
    }

    const action = this.lastAction(day, initiatorId);

    if (!action) {
      return [];
    }

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
