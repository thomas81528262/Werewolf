import { DayConditionalEvent, Target } from "../event";

class VoteKill extends DayConditionalEvent {
  constructor() {
    super({ name: "VOTE_KILL", accessRole: [] });
  }

  get chiefId() {
    let cheifId = null;
    this.world.players.forEach((player) => {
      const { isChief, isDie, id } = player;
      if (isChief && !isDie) {
        cheifId = id;
      }
    });
    return cheifId;
  }

  async wait() {
    let isFinish = true;

    this.playersLock.forEach((isLock) => {
      if (!isLock) {
        isFinish = false;
      }
    });

    if (isFinish) {
      let maxVotedTargets = [];
      let maxVotedNumber = 0;
      const chiefId = this.chiefId;
      this.actions.statuses.forEach((status) => {
        const { initiatorIds, targetId } = status;
        let voteNumber = initiatorIds.length;

        if (!voteNumber) {
          return;
        }

        if (initiatorIds.includes(chiefId)) {
          voteNumber += 0.5;
        }
        if (voteNumber > maxVotedNumber) {
          maxVotedNumber = initiatorIds.length;
          maxVotedTargets = [targetId];
        } else if (voteNumber === maxVotedNumber) {
          maxVotedTargets.push(targetId);
        }
      });

      if (maxVotedNumber === 0 || maxVotedTargets.length > 1) {
        isFinish = false;
        this.end();
      }
    }

    if (isFinish) {
      this.next();
    }
  }

  targets({ initiatorId, day }: { initiatorId: number; day: number }) {
    const targets: Target[] = [];

    const initiator = this.world.players.get(initiatorId);
    if (!initiator || initiator.isDie) {
      return [];
    }

    const action = this.lastAction(day, initiatorId);

    if (!action) {
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

const dayEvents = [new VoteKill()];

export default { VoteKill, dayEvents };
