// Models
import user from "../models/user.model";
// Types
import { UserType } from "../types/users.type";

export const findByEmailOrUsername = async (emailOrUsername: string): Promise<any> => {
  return emailOrUsername.includes("@")
    ? await user.findOne({ email: emailOrUsername }, { _id: 1, email: 1, password: 1 })
    : await user.findOne({ username: emailOrUsername }, { _id: 1, username: 1, password: 1 });
};

export const findByEmail = async (email: string): Promise<any> => {
  return await user.findOne({ email: email }, { _id: 1, firstname: 1, lastname: 1, email: 1, country: 1 });
};

export const findById = async (id: string): Promise<any> => {
  return await user.findOne({ _id: id }, { _id: 1, username: 1 });
};

export const findByUsername = async (username: string): Promise<any> => {
  return await user.findOne({ username: username }, { _id: 1, firstname: 1, lastname: 1, username: 1 });
};

export const findById_flu = async (id: Array<string>): Promise<any> => {
  return await user.find({ _id: id }, { _id: 0, firstname: 1, lastname: 1, username: 1 });
};

export const checkEmailOrUsername = async (emailOrUsername: string): Promise<any> => {
  return emailOrUsername.includes("@")
    ? await user.findOne({ email: emailOrUsername }, { _id: 1, email: 1 })
    : await user.findOne({ username: emailOrUsername }, { _id: 1, username: 1 });
};

export const insertUser = async (DATA: UserType): Promise<any> => {
  return await user.insertOne({
    firstname: DATA.firstname,
    lastname: DATA.lastname,
    username: DATA.username,
    email: DATA.email,
    password: DATA.password,
    dateOfBirth: DATA.dateOfBirth,
    country: DATA.country,
    createdAt: new Date()
  });
};

export const updatePasswordWithId = async (id: string, password: string): Promise<any> => {
  return await user.updateOne({
    _id: id,
  }, { $set: { password: password } });
};