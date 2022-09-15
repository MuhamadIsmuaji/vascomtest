import { Column, DataType, Index, Model, Table } from "sequelize-typescript";

@Table({ tableName: "users" })
class UserModel extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  @Index({ unique: true })
  public email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public role: number;
}

export default UserModel;
