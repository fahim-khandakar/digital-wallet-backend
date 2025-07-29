import bcrypt from "bcryptjs";
import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { Wallet } from "../modules/wallet/wallet.model"; // make sure this path is correct
import { Role, IsActive } from "../shared/types"; // make sure IsActive is imported

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

    const wallet = await Wallet.create({
      balance: 50,
      owner: superAdmin._id,
      ownerType: superAdmin.role,
      status: IsActive.ACTIVE,
    });

    superAdmin.wallet = wallet._id;
    await superAdmin.save();

    console.log("Super Admin Created Successfully with Wallet! \n");
    console.log(superAdmin);
  } catch (error) {
    console.log("Failed to seed admin:", error);
  }
};
