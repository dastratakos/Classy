import FriendCard from "../Cards/FriendCard";
import EmptyList from "../EmptyList";
import SVGNoFriends from "../../assets/images/undraw/noFriends.svg";
import SVGNoRequests from "../../assets/images/undraw/noRequests.svg";
import { User } from "../../types";

export default function FriendList({
  friends,
  emptyPrimary = "Nothing to see here",
  emptySecondary = "",
  requests = false,
}: {
  friends: User[];
  emptyPrimary?: string;
  emptySecondary?: string;
  requests?: boolean;
}) {
  // TODO: use FlatList
  if (friends.length === 0)
    return (
      <EmptyList
        SVGElement={requests ? SVGNoRequests : SVGNoFriends}
        primaryText={emptyPrimary}
        secondaryText={emptySecondary}
      />
    );
  return (
    <>
      {friends.map((friend) => (
        <FriendCard friend={friend} key={friend.id} isRequest={requests} />
      ))}
    </>
  );
}
