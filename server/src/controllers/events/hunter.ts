import { StateEvent, Target } from "../event";



class HunterKill extends StateEvent {

    constructor() {
        super({ name: "HUNTER_KILL", accessRole: ["hunter"], accessStates:[] });
    }
    

    get isFinish() {
        return true;
    }

    targets({ initiatorId }: { initiatorId: number }): Target[] {
        return [];
    }

}

const statusEvent = [new HunterKill]



export default {statusEvent}