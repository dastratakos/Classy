import FriendCard from "./FriendCard";

export default function FriendList({ friends }) {
  return (
    <>
      {friends.map((friend) => (
        <FriendCard friend={friend} key={friend.id} />
      ))}
    </>
  );
}
