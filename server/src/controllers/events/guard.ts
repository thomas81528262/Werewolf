import { Target, DayTimeingEvent } from "../event";


enum eN {
  guardProtect = "GUARD_PROTECT",
}

class GuardProtect extends DayTimeingEvent {
  constructor() {
    super({ name: eN.guardProtect, accessRole: ["guard"], timeOut: 1 });
  }
 
  isProtected(day:number, targetId:number):boolean {
      return this.world.statuses.getStatuses({day:day - 1, eventName:eN.guardProtect, targetId}).length > 0
  }
 

  targets({ initiatorId, day }: { initiatorId: number; day: number }) {
    const targets: Target[] = [];

    const initiator = this.world.players.get(initiatorId);
    if (!initiator && this.hasIdPermission({ initiatorId })) {
      return [];
    }

    const actions = this.lastAction(day);

    if (!actions.length) {
      return [];
    }

    const action = actions[0];

    this.world.players.forEach((player) => {
      const { isDie, id } = player;

      if (!isDie && !this.isProtected(day, id)) {
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



const dayEvent = [new GuardProtect];

export default { dayEvent, eN, GuardProtect };