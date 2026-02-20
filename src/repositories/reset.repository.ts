// Models
import reset from "../models/reset.model";
// Types
import { verifyType } from "../types/verify.type";

export class ResetRepository {

  public async insertReset(DATA: verifyType): Promise<any> {
    return await reset.insertOne({
      id: DATA.id,
      token: DATA.token,
      expiresAt: DATA.expiresAt,
      used: DATA.used,
    });
  };

  public async findReset(token: string): Promise<any> {
    return await reset.findOne({
      token: token,
    });
  };

  public async updateReset(id: string, token: string): Promise<any> {
    return await reset.updateOne({
      id: id,
      token: token,
    }, { $set: { used: true } });
  };
};
