import { Timestamp } from "firebase/firestore";
import { Event } from "../../types";
import { calculateHeight, calculateTop } from "./utils";

class CalendarEvent {
  event: Event;
  top: number;
  height: number;
  width: number;
  left: number;
  numIndents: number;

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
    this.numIndents = 0;
  }
}
class Node {
  events: CalendarEvent[];
  parent?: Node;
  children: Node[];

  constructor() {
    this.events = [];
    this.children = [];
  }
}

/**
 * Compares two Timestamps by checking only the hour and minute values. Returns
 * true if a is strictly earlier than b.
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

  return aMinutes < bMinutes;
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

    if (
      currRow[0].top + TOLERANCE >= event.top &&
      currRow[0].top + currRow[0].height >= event.top
    ) {
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
  let currChildren: Node[] = [];

  let i = start;
  while (i < rows.length) {
    const row = rows[i];

    /**
     * If there was a previous iteration and this row's first event starts
     * before the first event in the last currChild, recurse.
     */
    if (currChildren.length > 0) {
      const lastChild = currChildren[currChildren.length - 1];
      if (
        timeIsEarlier(row[0].event.startInfo, lastChild.events[0].event.endInfo)
      ) {
        const { end, children } = buildTree(
          lastChild,
          rows,
          i,
          dayWidth,
          calendarTimesWidth
        );
        lastChild.children = children;
        i = end;
        continue;
      }
    }

    if (
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
        while (currValid < parent.events.length - 1) {
          if (
            parent.events[currValid + 1].top + TOLERANCE >= event.top &&
            parent.events[currValid + 1].top +
              parent.events[currValid + 1].height >=
              event.top
          )
            break;
          currValid++;
        }
        validList.push(currValid);
      }

      let count = 1;
      let lastUsedParent = -1;
      for (let i = 0; i < validList.length; i++) {
        if (i !== validList.length - 1 && validList[i] === validList[i + 1]) {
          count++;
          continue;
        }

        let parentWidth = dayWidth - calendarTimesWidth;

        if (parent.events.length > 0) {
          parentWidth = 0;
          for (let j = lastUsedParent + 1; j < validList[i] + 1; j++) {
            if (j === parent.events.length - 1) {
              parentWidth += dayWidth - parent.events[j].left;
            } else {
              parentWidth += parent.events[j].width;
            }
          }
          lastUsedParent = validList[i];
        }
        const width = parentWidth / count;
        for (let j = i - count + 1; j < i + 1; j++) {
          row[j].width = width;
          if (j !== 0) row[j].left = row[j - 1].left + row[j - 1].width;
        }
        count = 1;
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

  return { end: i, children: currChildren };
};

const calculateNumIndents = (
  node: Node,
  depth: number,
  lefts: Object,
  indentWidth: number
) => {
  if (node.events.length === 0 && depth > 0) return;

  // let tabs = "";
  // for (let i = 0; i < depth; i++) tabs += "\t";
  // console.log(tabs + "Node");

  for (let event of node.events) {
    let rawLeft = Math.round(event.left);

    // console.log(
    //   `${tabs}\t[${rawLeft}]: ${event.event.title}, ${event.event.startInfo
    //     .toDate()
    //     .toTimeString()}-${event.event.endInfo.toDate().toTimeString()}`
    // );

    if (!(rawLeft in lefts)) {
      lefts[rawLeft] = [event];
      continue;
    }

    let numIndents = 0;
    for (let j = lefts[rawLeft].length - 1; j >= 0; j--) {
      const e = lefts[rawLeft][j];
      if (timeIsEarlier(event.event.startInfo, e.event.endInfo)) {
        numIndents = e.numIndents + 1;
        break;
      }
    }

    if (numIndents < 6) {
      event.width -= indentWidth * numIndents;
      event.left += indentWidth * numIndents;
    } else {
      event.width -= indentWidth * (numIndents - 5);
      event.left += indentWidth * (numIndents - 5);
    }
    event.numIndents = numIndents;

    // console.log(`${tabs}\t\tnumIndents = ${numIndents}`);

    lefts[rawLeft].push(event);
  }

  for (let child of node.children)
    calculateNumIndents(child, depth + 1, lefts, indentWidth);
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
  calendarTimesWidth: number,
  indentWidth: number
) => {
  /* Convert the Events into CalendarEvents. */
  const calendarEvents = events.map(
    (event) =>
      new CalendarEvent(
        event,
        startCalendarHour,
        hourHeight,
        dayWidth,
        calendarTimesWidth
      )
  );

  /* Step 1: Build the event rows. */
  const rows = buildRows(calendarEvents);

  /* Step 2: Build the tree of event rows. */
  const root = new Node();
  const { children } = buildTree(root, rows, 0, dayWidth, calendarTimesWidth);
  root.children = children;

  /* Step 3: Calculate numIndents and final width and left for each event. */
  calculateNumIndents(root, 0, {}, indentWidth);

  /* Return the events in their original order and add the computed styles. */
  return calendarEvents.map((event) => ({
    event: event.event,
    style: {
      top: event.top,
      height: event.height,
      width: event.width,
      left: event.left,
    },
  }));
};
