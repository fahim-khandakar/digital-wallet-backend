import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../../shared/types";
import {
  createTransactionZodSchema,
  updateTransactionZodSchema,
} from "./transaction.validation";
import { TransactionControllers } from "./transaction.controller";

const router = Router();

router.post(
  "/create-transaction",
  validateRequest(createTransactionZodSchema),
  checkAuth(...Object.values(Role)),
  TransactionControllers.createTransaction
);
router.get(
  "/all-transactions",
  checkAuth(Role.ADMIN),
  TransactionControllers.getAllTransactions
);
router.get(
  "/my-transactions",
  checkAuth(...Object.values(Role)),
  TransactionControllers.getMyTransactions
);
router.get(
  "/:id",
  checkAuth(Role.ADMIN),
  TransactionControllers.getSingleTransaction
);
router.patch(
  "/:id",
  validateRequest(updateTransactionZodSchema),
  checkAuth(...Object.values(Role)),
  TransactionControllers.updateTransaction
);

export const TransactionRoutes = router;
