import MBaseAttributes from "../../../types/MBaseAttributes";

interface UserAttributes extends MBaseAttributes {
  email: string;
  name: string;
  role: number;
}

export default UserAttributes;
