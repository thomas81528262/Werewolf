
import {Status} from "./status"

interface Action {
  initiatorId: number;
  targetId: number;
  eventName: string;
  day: number;
  date: Date;
}

interface Search {
  day:number
  eventName:string
}


class Actions {
    private _actions:Action[] = [];
    add(action:Action) {
        this._actions.push(action);   
    }

    remove(initiatorId:number) {
        this._actions = this._actions.filter((v) => v.initiatorId !== initiatorId);
    }

    getAction({eventName, day}:{eventName?:string, day?:number}) {

        if (eventName && day) {
          return this._actions.filter((v)=>v.eventName === eventName && v.day === day);
        } else if (eventName) {
          return this._actions.filter((v)=>v.eventName === eventName);
        } else if (day) {
          return this._actions.filter((v)=> v.day === day);
        }

        return this._actions;
    }

    

   


    get statuses():Status[ ] {
        const targetsSet = new Map<number, Status>();

        this._actions.forEach((act) => {
          const { initiatorId, targetId, eventName, day } = act;
          if (targetsSet.has(targetId)) {
            const { initiatorIds } = targetsSet.get(targetId);
            initiatorIds.push(initiatorId);
          } else {
            targetsSet.set(targetId, {
              targetId,
              eventName,
              day,
              initiatorIds: [initiatorId],
            });
          }
        });

        const result = [];
        targetsSet.forEach(status=>{
            status.initiatorIds.sort();
            result.push(status);
        })

        return result;
    }

}


export {Actions, Action}