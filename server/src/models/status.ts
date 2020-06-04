
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

  getByDay() {

  }
  
  getByEvent() {

  }
}







export {Status, Statuses}
