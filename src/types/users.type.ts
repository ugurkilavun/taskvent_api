export type UserType = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  country: string;
  verifiedAccount?: boolean;
};