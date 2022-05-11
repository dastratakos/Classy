import FriendCard from "../FriendCard";

export default function FriendList({ friends }) {
  // TODO: use FlatList
  return (
    <>
      {friends.map((friend) => (
        <FriendCard friend={friend} key={friend.id} />
      ))}
    </>
  );
}
