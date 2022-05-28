import { Event } from "../../types";
import { calculateTop } from "./utils";

class CalendarEvent {
  constructor(event: Event) {
    this.event = event;
  }

  /**
   * The event's width without any overlap.
   */
  get _width() {
    // The container event's width is determined by the maximum number of
    // events in any of its rows.
    if (this.rows) {
      const columns =
        this.rows.reduce(
          (max, row) => Math.max(max, row.leaves.length + 1), // add itself
          0
        ) + 1; // add the container

      return 100 / columns;
    }

    const availableWidth = 100 - this.container._width;

    // The row event's width is the space left by the container, divided
    // among itself and its leaves.
    if (this.leaves) {
      return availableWidth / (this.leaves.length + 1);
    }

    // The leaf event's width is determined by its row's width
    return this.row._width;
  }

  /**
   * The event's calculated width, possibly with extra width added for
   * overlapping effect.
   */
  get width() {
    const noOverlap = this._width;
    const overlap = Math.min(100, this._width * 1.7);

    // Containers can always grow.
    if (this.rows) {
      return overlap;
    }

    // Rows can grow if they have leaves.
    if (this.leaves) {
      return this.leaves.length > 0 ? overlap : noOverlap;
    }

    // Leaves can grow unless they're the last item in a row.
    const { leaves } = this.row;
    const index = leaves.indexOf(this);
    return index === leaves.length - 1 ? noOverlap : overlap;
  }

  get left() {
    // Containers have no offset.
    if (this.rows) return 0;

    // Rows always start where their container ends.
    if (this.leaves) return this.container._width;

    // Leaves are spread out evenly on the space left by its row.
    const { leaves, left, _width } = this.row;
    const index = leaves.indexOf(this) + 1;
    return left + index * _width;
  }
}

/**
 * Compares two Dates by checking only the hour and minute values.
 *
 * @param a The first Date object to compare
 * @param b The second Date object to compare
 * @returns boolean true if a's time is earlier, false otherwise
 */
const timeIsEarlier = (a: Date, b: Date) => {
  return true;
};

/**
 * Return true if event a and b is considered to be on the same row.
 */
function onSameRow(a, b, minOverlapDiff) {
  return (
    // Occupies the same start slot.
    Math.abs(b.start - a.start) < minOverlapDiff ||
    // A's start slot overlaps with b's end slot.
    (b.start > a.start && b.start < a.end)
  );
}

/**
 * Sorts the events in the order they will be rendered in. This is important
 * because elements rendered later will be placed on top of those rendered
 * earlier.
 *
 * @param events The events to sort. We assume they are already sorted by
 *               earliest start time, then by latest end time.
 * @returns CalendarEvent[] The sorted events array
 */
const sortByRenderOrder = (events: CalendarEvent[]) => {
  const eventsList = JSON.parse(JSON.stringify(events));

  const sorted = [];
  while (eventsList.length > 0) {
    const currParent = eventsList.shift();
    sorted.push(currParent);

    for (let i = 0; i < eventsList.length; i++) {
      const test = eventsList[i];

      // Still inside this event, look for next.
      if (currParent.endMs > test.startMs) continue;

      // We've found the first event of the next event group.
      // If that event is not right next to our current event, we have to
      // move it here.
      if (i > 0) {
        const event = eventsList.splice(i, 1)[0];
        sorted.push(event);
      }

      // We've already found the next event group, so stop looking.
      break;
    }
  }

  return sorted;
};

export const getStyledEvents = (
  events: Event[],
  startCalendarHour: number,
  /**
   * The smallest number of minutes between the start times of two events where
   * they can remain overlapping. If two events have start times closer than
   * minOverlapDiff, then they must be split into a row.
   */
  minOverlapDiff: number
) => {
  const proxies = events.map((event) => new CalendarEvent(event));
  const eventsInRenderOrder = sortByRenderOrder(proxies);

  // Group overlapping events, while keeping order.
  // Every event is always one of: container, row or leaf.
  // Containers can contain rows, and rows can contain leaves.
  const containerEvents = [];
  for (let i = 0; i < eventsInRenderOrder.length; i++) {
    const event = eventsInRenderOrder[i];

    // Check if this event can go into a container event.
    const container = containerEvents.find(
      (c) =>
        c.end > event.start || Math.abs(event.start - c.start) < minOverlapDiff
    );

    // Couldn't find a container — that means this event is a container.
    if (!container) {
      event.rows = [];
      containerEvents.push(event);
      continue;
    }

    // Found a container for the event.
    event.container = container;

    // Check if the event can be placed in an existing row.
    // Start looking from behind.
    let row = null;
    for (let j = container.rows.length - 1; !row && j >= 0; j--) {
      if (onSameRow(container.rows[j], event, minOverlapDiff)) {
        row = container.rows[j];
      }
    }

    if (row) {
      // Found a row, so add it.
      row.leaves.push(event);
      event.row = row;
    } else {
      // Couldn't find a row – that means this event is a row.
      event.leaves = [];
      container.rows.push(event);
    }
  }

  // Return the original events, along with their styles.
  return eventsInRenderOrder.map((event) => ({
    event: event.data,
    style: {
      top: calculateTop(event.startInfo, startCalendarHour),
      height: event.height,
      width: event.width,
      left: Math.max(0, event.left),
    },
  }));
};
