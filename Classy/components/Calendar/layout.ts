import { Timestamp } from "firebase/firestore";
import { Event } from "../../types";
import { calculateHeight, calculateTop } from "./utils";

class CalendarEvent {
  event: Event;
  top: number;
  height: number;
  width: number;
  left: number;

  constructor(
    event: Event,
    startCalendarHour: number,
    hourHeight: number,
    dayWidth: number,
    calendarTimesWidth: number
  ) {
    this.event = event;
    this.top = calculateTop(event.startInfo, startCalendarHour, hourHeight);
    this.height = calculateHeight(event.startInfo, event.endInfo, hourHeight);
    this.width = dayWidth - calendarTimesWidth;
    this.left = calendarTimesWidth;
  }
}
class Node {
  events: CalendarEvent[];
  parent?: Node;
  children: Node[];

  constructor() {
    this.events = [];
    // this.parent = null;
    // this.prevSibling = null; // TODO
    this.children = [];
  }
}

/**
 * Compares two Timestamps by checking only the hour and minute values.
 *
 * @param a The first Timestamp object to compare
 * @param b The second Timestamp object to compare
 * @returns boolean true if a's time is earlier, false otherwise
 */
const timeIsEarlier = (a: Timestamp, b: Timestamp) => {
  const aHours = a.toDate().getHours();
  const bHours = b.toDate().getHours();

  if (aHours !== bHours) return aHours < bHours;

  const aMinutes = a.toDate().getMinutes();
  const bMinutes = b.toDate().getMinutes();

  return aMinutes <= bMinutes;
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
  return events;

  //   const eventsList = JSON.parse(JSON.stringify(events));

  //   const sorted = [];
  //   while (eventsList.length > 0) {
  //     const currParent = eventsList.shift();
  //     sorted.push(currParent);

  //     for (let i = 0; i < eventsList.length; i++) {
  //       const test = eventsList[i];

  //       // Still inside this event, look for next.
  //       if (currParent.endMs > test.startMs) continue;

  //       // We've found the first event of the next event group.
  //       // If that event is not right next to our current event, we have to
  //       // move it here.
  //       if (i > 0) {
  //         const event = eventsList.splice(i, 1)[0];
  //         sorted.push(event);
  //       }

  //       // We've already found the next event group, so stop looking.
  //       break;
  //     }
  //   }

  //   return sorted;
};

/**
 * The number of pixels below the start of an event that cannot overlap.
 */
const TOLERANCE = 40;

/**
 * Builds the rows that make up the calendar layout. A row consists of a
 * starting CalendarEvent followed by any CalendarEvents that start within
 * TOLERANCE pixels of the starting one.
 *
 * @param events  An array of CalendarEvents sorted first by ascending start
 *                time and then by descending end time.
 * @returns CalendarEvent[][]  The rows of CalendarEvents
 */
const buildRows = (events: CalendarEvent[]) => {
  if (events.length === 0) return [];

  let rows: CalendarEvent[][] = [];
  let currRow: CalendarEvent[] = [events[0]];
  for (let i = 1; i < events.length; i++) {
    const event = events[i];

    if (currRow[0].top + TOLERANCE >= event.top) {
      currRow.push(event);
    } else {
      rows.push(currRow);
      currRow = [event];
    }
  }
  rows.push(currRow);

  return rows;
};

const buildTree = (
  parent: Node,
  rows: CalendarEvent[][],
  start: number,
  dayWidth: number,
  calendarTimesWidth: number
) => {
  console.log("hello");
  let currChildren: Node[] = [];

  let i = start;
  while (i < rows.length) {
    const row = rows[i];

    console.log(`i = ${i}`);

    /**
     * If there was a previous iteration and this row's first event starts
     * before the first event in the last currChild, recurse.
     */
    if (currChildren.length > 0) {
      const lastChild = currChildren[currChildren.length - 1];
      if (
        timeIsEarlier(row[0].event.startInfo, lastChild.events[0].event.endInfo)
      ) {
        // const { end, children } = buildTree(
        //   lastChild,
        //   rows,
        //   i,
        //   dayWidth,
        //   calendarTimesWidth
        // );
        // lastChild.children = children;
        // i = end;
        continue;
      }
    } else if (
      /**
       * Make this row a child of the parent Node it's first event starts before
       * the first event in the parent ends.
       */
      parent.events.length === 0 ||
      timeIsEarlier(row[0].event.startInfo, parent.events[0].event.endInfo)
    ) {
      let child = new Node();
      child.events = row;
      child.parent = parent;

      /**
       * Calculate raw width and left for each event now that you know the
       * parent.
       */
      let validList: number[] = [];
      let currValid: number = 0;
      for (let event of row) {
        // TODO: how will this work for the root where parent.events.length === 0
        while (currValid < parent.events.length - 1) {
          if (parent.events[currValid + 1].top + TOLERANCE >= event.top) break;
          currValid++;
        }
        validList.push(currValid);
      }

      let count = 0;
      for (let i = 0; i < validList.length; i++) {
        if (i === validList.length - 1 || validList[i] !== validList[i + 1]) {
          let parentWidth = dayWidth - calendarTimesWidth;
          if (parent.events.length > 0)
            parentWidth = parent.events[validList[i]].width;
          const width = parentWidth / count;
          for (let j = i - count + 1; j < i + 1; j++) {
            row[j].width = width;
            if (j !== 0) row[j].left = row[j - 1].left + row[j - 1].width;
          }
          count = 0;
          continue;
        }
        count++;
      }

      currChildren.push(child);
      i++;
      continue;
    }

    /**
     * Base case: This row was not a child of the parent Node or a child of the
     * previous currChild.
     */
    break;
  }

  console.log(`hi, i = ${i}`);

  return { end: i, children: currChildren };
};

export const getStyledEvents = (
  /**
   * Assume that events are already sorted by ascending start time then by
   * descending end time.
   */
  events: Event[],
  startCalendarHour: number,
  hourHeight: number,
  dayWidth: number,
  calendarTimesWidth: number
) => {
  const proxies = events.map(
    (event) =>
      new CalendarEvent(
        event,
        startCalendarHour,
        hourHeight,
        dayWidth,
        calendarTimesWidth
      )
  );
  const eventsInRenderOrder = sortByRenderOrder(proxies);

  /* Step 1: Build the event rows. */
  const rows = buildRows(eventsInRenderOrder);

  console.log("rows:");
  for (let row of rows) {
    console.log(`\trow`);
    for (let elem of row) {
      console.log(
        `\t\t${elem.event.title}, ${elem.event.startInfo
          .toDate()
          .toTimeString()}-${elem.event.endInfo.toDate().toTimeString()}`
      );
    }
  }

  /* Step 2: Build the tree of event rows. */
  console.log("up here");

  const root = new Node();
  console.log("middle here");
  const { children } = buildTree(root, rows, 0, dayWidth, calendarTimesWidth);
  console.log(`children: ${children}`);
  root.children = children;

  console.log("down here");

  /* Step 4: Calculate numIndents for each event. */

  /* Step 5: Calculate final width and left for each event. */

  /* Return the events in their render order and add the computed styles. */
  return eventsInRenderOrder.map((event) => ({
    event: event.event,
    style: {
      top: event.top,
      height: event.height,
      width: event.width,
      left: event.left,
    },
  }));
};
