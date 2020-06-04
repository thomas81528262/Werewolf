import World from "../controllers/world";
import Wolf from "../controllers/events/wolf";
import Vote from "../controllers/events/vote";
const dayEvents = [...Wolf.dayEvents];

function getEvents(roleOrder: string[]) {
  const result = [];
  roleOrder.forEach((role) => {
    dayEvents.forEach((event) => {
      if (event.hasRolePermission(role)) {
        result.push(event);
      }
    });
  });
  return result;
}

class WolfGame extends World {
  constructor(roleOrder: string[]) {
    super({ dayEvents: [...getEvents(roleOrder), ...Vote.dayEvents] });
  }

  setPlayerState() {}
}

export { WolfGame };
