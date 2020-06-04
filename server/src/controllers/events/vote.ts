import { DayConditionalEvent, Target } from "../event";

class VoteKill extends DayConditionalEvent {
  constructor() {
    super({ name: "VOTE_KILL", accessRole: [] });
  }

  async wait() {
    let isFinish = true;

    this.playersLock.forEach((isLock) => {
      if (!isLock) {
        isFinish = false;
      }
    });

    if (isFinish) {
      let maxVotedNumber = 0;

      this.actions.statuses.forEach((status) => {
        const { initiatorIds } = status;
        if (initiatorIds.length > maxVotedNumber) {
          maxVotedNumber = initiatorIds.length;
        }
      });

      const maxVotedTargets = this.actions.statuses.filter(
        (v) => v.initiatorIds.length === maxVotedNumber
      );

      if (maxVotedNumber === 0 || maxVotedTargets.length > 1) {
        isFinish = false;
      }
    }

    if (isFinish) {
      this.next();
    }
  }

  targets({ initiatorId }: { initiatorId: number }) {
    return [];
  }
}

const dayEvents = [new VoteKill()];

export default { VoteKill, dayEvents };
