import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import UserModel from "./user.model";

@Injectable()
class UsersService {
  constructor(@InjectModel(UserModel) public model: typeof UserModel) {}

  public async isEmailInUse(email: string): Promise<boolean> {
    const user = await this.model.findOne({
      where: { email }
    });

    return user !== null;
  }
}

export default UsersService;
