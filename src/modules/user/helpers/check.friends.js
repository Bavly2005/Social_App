// check friends
export const areFriends = function (user, friend) {
  if (
    friend.friends.map(String).include(user.id)
    || user.friends.map(String).include(friend.id)
  )
    return true;

  return false;
};

// check requests
export const requestExist = function (user, friend) {
  if (
    friend.friendRequests.map(String).include(user.id)
    || user.friendRequests.map(String).include(friend.id)
  )
    return true;

  return false;
};
