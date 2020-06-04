import { DayConditionalEvent, Target, TargetEvent } from "../event";
import { Actions, Action } from "../../models/actions";
class WolfKill extends DayConditionalEvent {
  constructor() {
    super({ name: "WOLF_KILL", accessRole: ["wolf"] });
  }

  private lastAction(day: number): Action {
    let action = null;

    const actions = this.actions.getAction({
      eventName: this.name,
      day,
    });

    if (actions.length > 0) {
      action = actions[actions.length - 1];
    }

    return action;
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

    const action = this.lastAction(day);

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

const dayEvents = [new WolfKill()];

export default { WolfKill, dayEvents };
