export type User = {
  id: string;
  username: string;
  passwordHash: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}
