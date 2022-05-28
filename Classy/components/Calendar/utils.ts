import { Timestamp } from "firebase/firestore";
import Layout from "../../constants/Layout";

export const calculateTop = (time: Timestamp, startCalendarHour: number) => {
  if (!time) return 0;

  const offset = Layout.spacing.medium + Layout.spacing.xxxlarge / 2;
  const t = time.toDate();
  const hourDiff = t.getHours() - startCalendarHour;

  return (
    offset +
    hourDiff * Layout.spacing.xxxlarge +
    (t.getMinutes() * Layout.spacing.xxxlarge) / 60
  );
};

export const calculateHeight = (startTime: Timestamp, endTime: Timestamp) => {
  const startHours = startTime.toDate().getHours();
  const endHours = endTime.toDate().getHours();
  const hourDiff = endHours - startHours;

  const startMinutes = startTime.toDate().getMinutes();
  const endMinutes = endTime.toDate().getMinutes();
  const minDiff = endMinutes - startMinutes;

  return (
    hourDiff * Layout.spacing.xxxlarge +
    (minDiff * Layout.spacing.xxxlarge) / 60
  );
};
