import bcrypt from "bcryptjs";
import { envVars } from "../config/env";
import { IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("Super Admin Already Exists!");
      return;
    }

    console.log("Trying to create Admin...", envVars.ADMIN_EMAIL);

    const hashedPassword = await bcrypt.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const payload: IUser = {
      name: "Super admin",
      role: Role.ADMIN,
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
    };

    const superAdmin = await User.create(payload);
    console.log("Super Admin Created Successfully! \n");
    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
