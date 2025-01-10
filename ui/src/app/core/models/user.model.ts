export interface User {
  username: string;
  email: string;
}

export interface UpdateUserInfo {
  email: string;
  profilePicture?: File | null;
}

