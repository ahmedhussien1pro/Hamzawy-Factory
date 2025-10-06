-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'MANAGER', 'WAREHOUSE_STAFF', 'FACTORY_STAFF', 'ACCOUNTANT', 'SALES');

-- CreateEnum
CREATE TYPE "public"."MovementType" AS ENUM ('IN', 'OUT', 'ADJUST');

-- CreateEnum
CREATE TYPE "public"."MovementReason" AS ENUM ('PURCHASE', 'SALE_CONSUME', 'MANUFACTURE_CONSUME', 'MANUFACTURE_RETURN', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."JobStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'CHEQUE', 'CREDIT');

-- CreateEnum
CREATE TYPE "public"."BOMStatus" AS ENUM ('DRAFT', 'ACTIVE', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "public"."WithdrawalStatus" AS ENUM ('CONSUMED', 'RETURNED', 'PENDING');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'WAREHOUSE_STAFF',
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."item_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT,
    "minQuantity" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" TEXT NOT NULL,
    "itemCodeId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sku" TEXT,
    "purchasePrice" DECIMAL(16,2) NOT NULL,
    "salePrice" DECIMAL(16,2),
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT,
    "lastPurchaseAt" TIMESTAMP(3),
    "isManufactured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventory_movements" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "public"."MovementType" NOT NULL,
    "reason" "public"."MovementReason" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "performedById" TEXT,
    "relatedEntityId" TEXT,
    "unitCostSnapshot" DECIMAL(16,2) NOT NULL,
    "remainingAfter" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."boms" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetProductId" TEXT,
    "wasteFactor" DECIMAL(18,6) NOT NULL DEFAULT 0.000000,
    "expectedManufactureTime" INTEGER,
    "estimatedCost" DECIMAL(16,2),
    "status" "public"."BOMStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bom_components" (
    "id" TEXT NOT NULL,
    "bomId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "qtyPerUnit" DECIMAL(18,6) NOT NULL,

    CONSTRAINT "bom_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."manufacturing_jobs" (
    "id" TEXT NOT NULL,
    "jobNumber" TEXT NOT NULL,
    "bomId" TEXT,
    "targetProductId" TEXT,
    "targetQuantity" INTEGER NOT NULL,
    "status" "public"."JobStatus" NOT NULL DEFAULT 'PENDING',
    "startedById" TEXT,
    "completedById" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manufacturing_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "salesRepId" TEXT,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'DRAFT',
    "totalAmount" DECIMAL(16,2) NOT NULL DEFAULT 0.00,
    "deliveryAddress" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceSnapshot" DECIMAL(16,2) NOT NULL,
    "unitCostSnapshot" DECIMAL(16,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."financial_transactions" (
    "id" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "amount" DECIMAL(16,2) NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "relatedEntityId" TEXT,
    "recordedById" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "amount" DECIMAL(16,2) NOT NULL,
    "method" "public"."PaymentMethod" NOT NULL,
    "paidBy" TEXT,
    "recordedById" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "actionType" "public"."AuditAction" NOT NULL,
    "oldData" JSONB,
    "newData" JSONB,
    "performedById" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."manufacturing_withdrawals" (
    "id" TEXT NOT NULL,
    "jobId" TEXT,
    "productId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "withdrawnById" TEXT,
    "withdrawnAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."WithdrawalStatus" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "manufacturing_withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "public"."users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "item_codes_code_key" ON "public"."item_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "public"."products"("sku");

-- CreateIndex
CREATE INDEX "products_sku_idx" ON "public"."products"("sku");

-- CreateIndex
CREATE INDEX "inventory_movements_productId_createdAt_idx" ON "public"."inventory_movements"("productId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "boms_code_key" ON "public"."boms"("code");

-- CreateIndex
CREATE UNIQUE INDEX "bom_components_bomId_productId_key" ON "public"."bom_components"("bomId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturing_jobs_jobNumber_key" ON "public"."manufacturing_jobs"("jobNumber");

-- CreateIndex
CREATE INDEX "manufacturing_jobs_status_completedAt_idx" ON "public"."manufacturing_jobs"("status", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "public"."customers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "public"."customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "public"."orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_status_createdAt_idx" ON "public"."orders"("status", "createdAt");

-- CreateIndex
CREATE INDEX "financial_transactions_type_date_idx" ON "public"."financial_transactions"("type", "date");

-- CreateIndex
CREATE INDEX "audit_logs_tableName_recordId_createdAt_idx" ON "public"."audit_logs"("tableName", "recordId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_itemCodeId_fkey" FOREIGN KEY ("itemCodeId") REFERENCES "public"."item_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_movements" ADD CONSTRAINT "inventory_movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_movements" ADD CONSTRAINT "inventory_movements_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."boms" ADD CONSTRAINT "boms_targetProductId_fkey" FOREIGN KEY ("targetProductId") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bom_components" ADD CONSTRAINT "bom_components_bomId_fkey" FOREIGN KEY ("bomId") REFERENCES "public"."boms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bom_components" ADD CONSTRAINT "bom_components_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manufacturing_jobs" ADD CONSTRAINT "manufacturing_jobs_bomId_fkey" FOREIGN KEY ("bomId") REFERENCES "public"."boms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manufacturing_jobs" ADD CONSTRAINT "manufacturing_jobs_targetProductId_fkey" FOREIGN KEY ("targetProductId") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manufacturing_jobs" ADD CONSTRAINT "manufacturing_jobs_startedById_fkey" FOREIGN KEY ("startedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manufacturing_jobs" ADD CONSTRAINT "manufacturing_jobs_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_salesRepId_fkey" FOREIGN KEY ("salesRepId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."financial_transactions" ADD CONSTRAINT "financial_transactions_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manufacturing_withdrawals" ADD CONSTRAINT "manufacturing_withdrawals_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."manufacturing_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manufacturing_withdrawals" ADD CONSTRAINT "manufacturing_withdrawals_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manufacturing_withdrawals" ADD CONSTRAINT "manufacturing_withdrawals_withdrawnById_fkey" FOREIGN KEY ("withdrawnById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
