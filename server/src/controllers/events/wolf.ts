import { DayConditionalEvent, Target, TargetEvent } from "../event";
import { Actions, Action } from "../../models/actions";

//const eN = "WOLF_KILL";

enum eN {
  wolfKill = "WOLF_KILL",
}

class WolfKill extends DayConditionalEvent {
  constructor() {
    super({ name: eN.wolfKill, accessRole: ["wolf"] });
  }

  async wait() {
    let finish = true;
    this.playersLock.forEach((isLock) => {
      if (!isLock) {
        finish = false;
      }
    });

    if (finish) {
      const targetsSet = new Set();
      const actions = this.actions.getAction({
        eventName: this.name,
        day: this.world.day,
      });
      actions.forEach((action) => {
        const { targetId } = action;
        targetsSet.add(targetId);
      });

      if (targetsSet.size !== 1) {
        this.iniPlayersLock();
        finish = false;
      }
    }

    if (finish) {
      this.next();
    }
  }

  targets({ initiatorId, day }: { initiatorId: number; day: number }) {
    const targets: Target[] = [];

    if (!this.hasIdPermission({ initiatorId })) {
      return [];
    }

    const actions = this.lastAction(day);

    if (!actions.length) {
      return [];
    }

    //const action = actions[0];

    this.world.players.forEach((player) => {
      const { isDie, id } = player;
      if (!isDie) {
        const initiatorsId = [];

        actions.forEach((action) => {
          if (id === action.targetId && initiatorId) {
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

const dayEvents = [new WolfKill()];

export default { WolfKill, dayEvents, eN };
