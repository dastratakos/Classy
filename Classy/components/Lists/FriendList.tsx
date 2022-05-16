import FriendCard from "../Cards/FriendCard";
import EmptyList from "../EmptyList";
import SVGNoFriends from "../../assets/images/undraw/noFriends.svg";
import SVGNoRequests from "../../assets/images/undraw/noRequests.svg";

export default function FriendList({
  friends,
  emptyPrimary = "",
  emptySecondary = "",
  requests = false,
}: {
  emptyPrimary: string;
  emptySecondary?: string;
  requests: boolean;
}) {
  // TODO: use FlatList
  const elem = requests ? SVGNoRequests : SVGNoFriends;
  if (friends.length === 0)
    return (
      <>
        <EmptyList primaryText={emptyPrimary} secondaryText={emptySecondary} SVGElement={elem} />
      </>
    );
  return (
    <>
      {friends.map((friend) => (
        <FriendCard friend={friend} key={friend.id} />
      ))}
    </>
  );
}
