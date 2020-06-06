
interface Status {
  eventName: string;
  day: number;
  initiatorIds: number[];
  targetId: number;
}

class Statuses {
  private _statuses:Status[] = [];
  add(status:Status) {
    this._statuses.push(status);
  }

  isExist({targetId, day, eventName}:{targetId:number, day:number, eventName:string}) {
    return this._statuses.filter((v)=>v.targetId === targetId && v.day === day && v.eventName === eventName);
  }

  getStatuses({eventName, day}:{eventName?:string, day?:number}) {

    if (eventName && day) {
      return this._statuses.filter((v)=>v.eventName === eventName && v.day === day);
    } else if (eventName) {
      return this._statuses.filter((v)=>v.eventName === eventName);
    } else if (day) {
      return this._statuses.filter((v)=> v.day === day);
    }

    return this._statuses;
}
 
}







export {Status, Statuses}
