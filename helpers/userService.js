export const buildUserObject = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    theme: user.theme,
  };
};
