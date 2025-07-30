export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export enum TransactionType {
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
  TRANSFER = "TRANSFER",
  TOP_UP = "TOP_UP",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REVERSED = "REVERSED",
}
