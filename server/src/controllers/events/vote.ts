import { DayConditionalEvent, Target } from "../event";

class VoteKill extends DayConditionalEvent {
  isValidTarget = new Map<number, boolean>();
  constructor() {
    super({ name: "VOTE_KILL", accessRole: [] });
  }

  clearValidTarget() {
    this.world.players.forEach((player) => {
      const { id } = player;
      this.isValidTarget.set(id, false);
    });
  }

  start() {
    this.clearValidTarget();
    this.world.players.forEach((player) => {
      const { id } = player;
      this.isValidTarget.set(id, true);
    });

    super.start();
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
      let maxVotedTargets: number[] = [];
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
        this.clearValidTarget();
        maxVotedTargets.forEach((targetId) => {
          this.isValidTarget.set(targetId, true);
        });

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

    const actions = this.lastAction(day, initiatorId);

    this.world.players.forEach((player) => {
      const { isDie, id } = player;

      if (!isDie && this.isValidTarget.get(id)) {
        const initiatorsId = [];

        actions.forEach((action) => {
          const { targetId } = action;
          if (id === targetId) {
            initiatorsId.push(action.initiatorId);
          }
        });

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
