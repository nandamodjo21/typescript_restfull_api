export type User = {
  name: string;
  username: string;
  email: string;
};

export function toUserResponse(user: any): User {
  return {
    username: user.username,
    name: user.name,
    email: user.email,
  };
}
