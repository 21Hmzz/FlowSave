-- AlterTable
ALTER TABLE "Account" ADD COLUMN "companyName" TEXT DEFAULT '';
ALTER TABLE "Account" ADD COLUMN "nameBank" TEXT DEFAULT '';

-- CreateIndex
CREATE INDEX "account_balance_index" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Transaction_accountId_idx" ON "Transaction"("accountId");
