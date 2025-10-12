/*
  Warnings:

  - You are about to drop the column `code_hash` on the `backup_codes` table. All the data in the column will be lost.
  - You are about to drop the column `used` on the `backup_codes` table. All the data in the column will be lost.
  - Added the required column `code` to the `backup_codes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."backup_code_types" AS ENUM ('TOTP', 'OTP');

-- DropIndex
DROP INDEX "public"."backup_codes_user_id_used_idx";

-- AlterTable
ALTER TABLE "public"."backup_codes" DROP COLUMN "code_hash",
DROP COLUMN "used",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "type" "public"."backup_code_types" NOT NULL DEFAULT 'TOTP';

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "public"."audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "public"."audit_logs"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "public"."audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "public"."audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "backup_codes_user_id_type_idx" ON "public"."backup_codes"("user_id", "type");

-- CreateIndex
CREATE INDEX "backup_codes_user_id_used_at_idx" ON "public"."backup_codes"("user_id", "used_at");

-- CreateIndex
CREATE INDEX "backup_codes_user_id_type_used_at_idx" ON "public"."backup_codes"("user_id", "type", "used_at");

-- CreateIndex
CREATE INDEX "tokens_token_idx" ON "public"."tokens"("token");

-- CreateIndex
CREATE INDEX "tokens_expires_in_idx" ON "public"."tokens"("expires_in");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_is_totp_enabled_idx" ON "public"."users"("is_totp_enabled");

-- CreateIndex
CREATE INDEX "users_is_otp_enabled_idx" ON "public"."users"("is_otp_enabled");

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
