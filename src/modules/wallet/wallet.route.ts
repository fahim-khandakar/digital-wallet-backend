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
  "/create-wallet",
  validateRequest(createWalletZodSchema),
  WalletControllers.createWallet
);
router.get(
  "/all-wallets",
  checkAuth(Role.ADMIN),
  WalletControllers.getAllWallets
);
router.get(
  "/my-wallet",
  checkAuth(...Object.values(Role)),
  WalletControllers.getMyWallet
);
router.get("/:id", checkAuth(Role.ADMIN), WalletControllers.getSingleWallet);
router.patch(
  "/:id",
  validateRequest(updateWalletZodSchema),
  checkAuth(...Object.values(Role)),
  WalletControllers.updateWallet
);

export const WalletRoutes = router;
