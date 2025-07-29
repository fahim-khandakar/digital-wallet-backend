import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../../shared/types";
import { WalletControllers } from "./wallet.controller";
import {
  createWalletZodSchema,
  updateWalletZodSchema,
} from "./wallet.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createWalletZodSchema),
  WalletControllers.createWallet
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN),
  WalletControllers.getAllWallets
);
router.get(
  "/my",
  checkAuth(...Object.values(Role)),
  WalletControllers.getMyWallet
);
router.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  WalletControllers.getSingleWallet
);
router.patch(
  "/:id",
  validateRequest(updateWalletZodSchema),
  checkAuth(...Object.values(Role)),
  WalletControllers.updateWallet
);

export const UserRoutes = router;
