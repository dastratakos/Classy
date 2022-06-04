import { Timestamp } from "firebase/firestore";
import Layout from "../../constants/Layout";

export const calculateTop = (
  time: Timestamp,
  startCalendarHour: number,
  hourHeight: number
) => {
  if (!time) return 0;

  const offset = Layout.spacing.medium + hourHeight / 2;
  const adjustedDate = time.toDate();
  const hourDiff = adjustedDate.getHours() - startCalendarHour;

  return offset + hourDiff * hourHeight + (adjustedDate.getMinutes() * hourHeight) / 60;
};

export const calculateHeight = (
  startTime: Timestamp,
  endTime: Timestamp,
  hourHeight: number
) => {
  const adjustedStartDate = startTime.toDate();
  const adjustedEndDate = endTime.toDate();

  const startHours = adjustedStartDate.getHours();
  const endHours = adjustedEndDate.getHours();
  const hourDiff = endHours - startHours;

  const startMinutes = adjustedStartDate.getMinutes();
  const endMinutes = adjustedEndDate.getMinutes();
  const minDiff = endMinutes - startMinutes;

  return hourDiff * hourHeight + (minDiff * hourHeight) / 60;
};
