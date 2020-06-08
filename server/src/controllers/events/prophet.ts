import { Target, DayTimeingEvent } from "../event";

enum eN {
  prophetCheck = "PROPHET_CHECK"
}

class ProphetCheck extends DayTimeingEvent {
  constructor() {
    super({ name: eN.prophetCheck, accessRole: ["prophet"], timeOut: 1 });
  }
  

  end() {
     this.actions.statuses.forEach(status=>{
         const {initiatorIds, targetId} = status;

        const targetPlayer = this.world.players.get(targetId);
        if (!targetPlayer) {
            return;
        }

        const camp = targetPlayer.camp;


         initiatorIds.forEach(initiatorId=>{
             const player = this.world.players.get(initiatorId);
             if (player) {
                 player.addTargeInfo({targetId, value:camp})
             }
         })
     })
     super.end();
  }

  targets({ initiatorId, day }: { initiatorId: number; day: number }) {
    const targets: Target[] = [];

    const initiator = this.world.players.get(initiatorId);
    if (!initiator && this.hasIdPermission({ initiatorId })) {
      return [];
    }

    const action = this.lastAction(day);

    if (!action ) {
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



const dayEvent = [new ProphetCheck()];

export default { dayEvent, eN, ProphetCheck };