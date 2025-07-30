import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { TransactionRoutes } from "../modules/transaction/transaction.route";
import { LoginRoutes } from "../modules/auth/auth.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/wallet",
    route: WalletRoutes,
  },
  {
    path: "/transaction",
    route: TransactionRoutes,
  },
  {
    path: "/auth",
    route: LoginRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
