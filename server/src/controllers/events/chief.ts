import { Target, DayTimeingEvent } from "../event";


enum eN {
  ChiefVote = "CHIEF_VOTE",
  
}

class ChiefVote extends DayTimeingEvent {
  constructor() {
    super({ name: eN.ChiefVote, accessRole: [], timeOut: 1 });
  }

  targets({ initiatorId, day }: { initiatorId: number; day: number }) {
    const targets: Target[] = [];

    const initiator = this.world.players.get(initiatorId);
    if (!initiator && this.hasIdPermission({ initiatorId })) {
      return [];
    }

    const action = this.lastAction(day, initiatorId);

    if (!action ) {
      return [];
    }

    this.world.players.forEach((player) => {
      const { isDie, id , isChiefCandidate} = player;

      if (!isDie && isChiefCandidate) {
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



const dayEvent = [new ChiefVote()];

export default { dayEvent, eN, ChiefVote };