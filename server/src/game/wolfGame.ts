import World from "../controllers/world";
import Wolf from "../controllers/events/wolf";
import Vote from "../controllers/events/vote";
import { State } from "../models/player";
import vote from "../controllers/events/vote";

const dayEvents = [...Wolf.dayEvents];

function getEvents(dayEventOrder: string[]) {
  const result = [];
  dayEventOrder.forEach((name) => {
    dayEvents.forEach((event) => {
      if (name === event.name) {
        result.push(event);
      }
    });
  });
  return result;
}

class WolfGame extends World {
  constructor(dayEventOrder: string[]) {
    super({ dayEvents: [...getEvents(dayEventOrder), ...Vote.dayEvents], stateEvents:[] });
  }

  setPlayerState() {
    const day = this.day;
    this.players.forEach((player) => {
      if (player.hasState({ day, eventName: Wolf.eN.wolfKill })) {
        player.addState({ day, state: State.Die });
      }
    });
  }
}

export { WolfGame };
