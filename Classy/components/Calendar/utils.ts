import { Timestamp } from "firebase/firestore";
import Layout from "../../constants/Layout";
import { getAdjustedDate } from "../../utils";

export const calculateTop = (
  time: Timestamp,
  startCalendarHour: number,
  hourHeight: number
) => {
  if (!time) return 0;

  const offset = Layout.spacing.medium + hourHeight / 2;
  const t = time.toDate();
  const hourDiff = t.getHours() - startCalendarHour;

  return offset + hourDiff * hourHeight + (t.getMinutes() * hourHeight) / 60;
};

export const calculateHeight = (
  startTime: Timestamp,
  endTime: Timestamp,
  hourHeight: number
) => {
  const adjustedEndDate = getAdjustedDate(endTime.toDate());

  const startHours = startTime.toDate().getHours();
  const endHours = adjustedEndDate.getHours();
  const hourDiff = endHours - startHours;

  const startMinutes = startTime.toDate().getMinutes();
  const endMinutes = adjustedEndDate.getMinutes();
  const minDiff = endMinutes - startMinutes;

  return hourDiff * hourHeight + (minDiff * hourHeight) / 60;
};
