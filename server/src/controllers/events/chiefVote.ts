import { Target, DayConditionalEvent } from "../event";
import ChiefCandidate from "./chiefCandidate";
import { State } from "../../models/player";

enum eN {
  ChiefVote = "CHIEF_VOTE",
}

class ChiefVote extends DayConditionalEvent {
  isValidTarget = new Map<number, boolean>();
  constructor() {
    super({ name: eN.ChiefVote, accessRole: [] });
  }
  clearValidTarget() {
    this.world.players.forEach((player) => {
      const { id } = player;
      this.isValidTarget.set(id, false);
    });
  }

  start() {
    if (this.world.day !== 1) {
      this.next();
    }
    this.clearValidTarget();
    this.world.players.forEach((player) => {
      const { id } = player;

      if (this.isCandidate({targetId:id})) {
        this.isValidTarget.set(id, true);
      } else {
        this.isValidTarget.set(id, false);
      }


      
    });

    super.start();
  }
  async wait() {
    let isFinish = true;

    this.playersLock.forEach((isLock, id) => {
      if (!isLock && !this.isValidTarget.get(id)) {
        isFinish = false;
      }
    });

    if (isFinish) {
      let maxVotedTargets: number[] = [];
      let maxVotedNumber = 0;

      this.actions.statuses.forEach((status) => {
        const { initiatorIds, targetId } = status;
        let voteNumber = initiatorIds.length;

        if (!voteNumber) {
          return;
        }

        if (voteNumber > maxVotedNumber) {
          maxVotedNumber = initiatorIds.length;
          maxVotedTargets = [targetId];
        } else if (voteNumber === maxVotedNumber) {
          maxVotedTargets.push(targetId);
        }
      });

      if ( maxVotedTargets.length != 1) {
        this.clearValidTarget();
        maxVotedTargets.forEach((targetId) => {
          this.isValidTarget.set(targetId, true);
        });

        isFinish = false;
        this.end();
      } else {
        maxVotedTargets.forEach(targetId=>{
          const player = this.world.players.get(targetId);
          player.addState({day:this.world.day, state:State.Chief});
        })
      }
    }

    if (isFinish) {
      
      this.next();
    }
  }

  isCandidate({ targetId }: { targetId: number }) {
    return (
      this.world.statuses.getStatuses({
        eventName: ChiefCandidate.eN.ChiefCandidate,
        day: this.world.day,
        targetId,
      }).length > 0
    );
  }

  targets({ initiatorId, day }: { initiatorId: number; day: number }) {
    const targets: Target[] = [];

    const initiator = this.world.players.get(initiatorId);
    if (!initiator || this.isValidTarget.get(initiatorId)) {
      return [];
    }

    const statuses = this.world.statuses.getStatuses({
      eventName: ChiefCandidate.eN.ChiefCandidate,
      day: this.world.day,
    });

    statuses.forEach((state) => {
      const { initiatorIds, targetId } = state;
      targets.push({
        eventName: this.name,
        initiatorsId: initiatorIds,
        targetId,
        value: null,
      });
    });

    return targets;
  }
}

const dayEvent = [new ChiefVote()];

export default { dayEvent, eN, ChiefVote };
