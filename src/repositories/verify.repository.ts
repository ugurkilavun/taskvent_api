// Models
import verify from "../models/verify.model";
// Types
import { verifyType } from "../types/verify.type";

export class VerifyRepository {

  public async insertVerify(DATA: verifyType): Promise<any> {
    return await verify.insertOne({
      id: DATA.id,
      token: DATA.token,
      expiresAt: DATA.expiresAt,
      used: DATA.used,
    });
  };

  public async findVerify(token: string): Promise<any> {
    return await verify.findOne({
      token: token,
    });
  };

  public async updateVerify(id: string, token: string): Promise<any> {
    return await verify.updateOne({
      id: id,
      token: token,
    }, { $set: { used: true } });
  };

};