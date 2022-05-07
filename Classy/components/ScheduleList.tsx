import ScheduleCard from "./ScheduleCard";

export default function ScheduleList({ schedules, onPress }) {
  // TODO: use FlatList
  return (
    <>
      {schedules.map((schedule, i) => (
        <ScheduleCard schedule={schedule} key={i} onPress={() => onPress(i)} />
      ))}
    </>
  );
}
