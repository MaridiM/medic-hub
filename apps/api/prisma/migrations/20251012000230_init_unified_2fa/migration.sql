/*
  Warnings:

  - The `type` column on the `backup_codes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `is_otp_enabled` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_totp_enabled` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `otp_secret` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `totp_secret` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "2fa_method_types" AS ENUM ('TOTP', 'OTP_EMAIL', 'OTP_SMS', 'WEBAUTHN', 'PASSKEY', 'BACKUP_CODE');

-- CreateEnum
CREATE TYPE "audit_categories" AS ENUM ('SECURITY', 'PROFILE', 'ADMIN', 'SYSTEM', 'ACCOUNT', 'AUTHENTICATION', 'AUTHORIZATION', 'DATA');

-- CreateEnum
CREATE TYPE "security_event_types" AS ENUM ('LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'SESSION_EXPIRED', 'TWO_FA_ENABLED', 'TWO_FA_DISABLED', 'TWO_FA_VERIFIED', 'TWO_FA_FAILED', 'TWO_FA_BACKUP_CODE_USED', 'TWO_FA_METHOD_ADDED', 'TWO_FA_METHOD_REMOVED', 'PASSWORD_CHANGED', 'PASSWORD_RESET_REQUESTED', 'PASSWORD_RESET_COMPLETED', 'PASSWORD_RESET_FAILED', 'ACCOUNT_CREATED', 'ACCOUNT_LOCKED', 'ACCOUNT_UNLOCKED', 'ACCOUNT_DELETED', 'EMAIL_VERIFIED', 'PHONE_VERIFIED', 'EMAIL_CHANGED', 'PHONE_CHANGED', 'NEW_DEVICE_DETECTED', 'DEVICE_TRUSTED', 'DEVICE_UNTRUSTED', 'DEVICE_REVOKED', 'SUSPICIOUS_LOGIN', 'UNUSUAL_LOCATION', 'BRUTE_FORCE_DETECTED', 'ACCOUNT_TAKEOVER_ATTEMPT', 'IMPOSSIBLE_TRAVEL', 'WEBAUTHN_REGISTERED', 'WEBAUTHN_VERIFIED', 'WEBAUTHN_REMOVED', 'PASSKEY_CREATED', 'PASSKEY_USED', 'PASSKEY_DELETED');

-- CreateEnum
CREATE TYPE "security_severity_levels" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "token_types" ADD VALUE 'PHONE_VERIFY';
ALTER TYPE "token_types" ADD VALUE 'TWO_FA_SETUP';

-- DropIndex
DROP INDEX "public"."users_is_otp_enabled_idx";

-- DropIndex
DROP INDEX "public"."users_is_totp_enabled_idx";

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "category" "audit_categories" NOT NULL DEFAULT 'SECURITY',
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "success" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "backup_codes" ADD COLUMN     "auth_method_id" TEXT,
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "used_ip" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "2fa_method_types" NOT NULL DEFAULT 'TOTP';

-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "created_ip" TEXT,
ADD COLUMN     "max_uses" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "use_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "used_at" TIMESTAMP(3),
ADD COLUMN     "used_ip" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_otp_enabled",
DROP COLUMN "is_totp_enabled",
DROP COLUMN "otp_secret",
DROP COLUMN "totp_secret",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "email_verified_at" TIMESTAMP(3),
ADD COLUMN     "is_2fa_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ADD COLUMN     "last_login_ip" TEXT,
ADD COLUMN     "last_risk_assess_at" TIMESTAMP(3),
ADD COLUMN     "password_changed_at" TIMESTAMP(3),
ADD COLUMN     "phone_verified_at" TIMESTAMP(3),
ADD COLUMN     "preferred_2fa_method" "2fa_method_types",
ADD COLUMN     "require_2fa" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "risk_score" DOUBLE PRECISION DEFAULT 0;

-- DropEnum
DROP TYPE "public"."backup_code_types";

-- CreateTable
CREATE TABLE "authentication_methods" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "method" "2fa_method_types" NOT NULL,
    "data" JSONB NOT NULL,
    "name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "last_used_at" TIMESTAMP(3),
    "use_count" INTEGER NOT NULL DEFAULT 0,
    "credential_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authentication_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trusted_devices" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "fingerprint" JSONB NOT NULL,
    "name" TEXT,
    "user_agent" TEXT NOT NULL,
    "browser" TEXT,
    "os" TEXT,
    "device" TEXT,
    "trust_score" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "last_ip" TEXT,
    "last_country" TEXT,
    "last_city" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trusted_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event" "security_event_types" NOT NULL,
    "severity" "security_severity_levels" NOT NULL DEFAULT 'LOW',
    "ip" TEXT,
    "user_agent" TEXT,
    "country" TEXT,
    "city" TEXT,
    "device_id" TEXT,
    "risk_score" DOUBLE PRECISION,
    "risk_factors" JSONB,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "device_id" TEXT,
    "user_agent" TEXT,
    "ip" TEXT,
    "country" TEXT,
    "city" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "device" TEXT,
    "is_trusted" BOOLEAN NOT NULL DEFAULT false,
    "risk_score" DOUBLE PRECISION DEFAULT 0,
    "is_2fa_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_2fa_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_locks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "unlocked_at" TIMESTAMP(3),
    "ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_locks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authentication_methods_credential_id_key" ON "authentication_methods"("credential_id");

-- CreateIndex
CREATE INDEX "authentication_methods_user_id_method_idx" ON "authentication_methods"("user_id", "method");

-- CreateIndex
CREATE INDEX "authentication_methods_user_id_is_primary_idx" ON "authentication_methods"("user_id", "is_primary");

-- CreateIndex
CREATE INDEX "authentication_methods_credential_id_idx" ON "authentication_methods"("credential_id");

-- CreateIndex
CREATE UNIQUE INDEX "authentication_methods_user_id_method_credential_id_key" ON "authentication_methods"("user_id", "method", "credential_id");

-- CreateIndex
CREATE UNIQUE INDEX "trusted_devices_device_id_key" ON "trusted_devices"("device_id");

-- CreateIndex
CREATE INDEX "trusted_devices_user_id_idx" ON "trusted_devices"("user_id");

-- CreateIndex
CREATE INDEX "trusted_devices_device_id_idx" ON "trusted_devices"("device_id");

-- CreateIndex
CREATE INDEX "trusted_devices_user_id_is_active_idx" ON "trusted_devices"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "trusted_devices_expires_at_idx" ON "trusted_devices"("expires_at");

-- CreateIndex
CREATE INDEX "security_events_user_id_idx" ON "security_events"("user_id");

-- CreateIndex
CREATE INDEX "security_events_event_idx" ON "security_events"("event");

-- CreateIndex
CREATE INDEX "security_events_severity_idx" ON "security_events"("severity");

-- CreateIndex
CREATE INDEX "security_events_resolved_idx" ON "security_events"("resolved");

-- CreateIndex
CREATE INDEX "security_events_created_at_idx" ON "security_events"("created_at");

-- CreateIndex
CREATE INDEX "security_events_user_id_created_at_idx" ON "security_events"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refresh_token_key" ON "sessions"("refresh_token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_user_id_revoked_at_idx" ON "sessions"("user_id", "revoked_at");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "sessions_device_id_idx" ON "sessions"("device_id");

-- CreateIndex
CREATE INDEX "sessions_is_2fa_verified_idx" ON "sessions"("is_2fa_verified");

-- CreateIndex
CREATE INDEX "account_locks_user_id_idx" ON "account_locks"("user_id");

-- CreateIndex
CREATE INDEX "account_locks_user_id_expires_at_unlocked_at_idx" ON "account_locks"("user_id", "expires_at", "unlocked_at");

-- CreateIndex
CREATE INDEX "account_locks_expires_at_idx" ON "account_locks"("expires_at");

-- CreateIndex
CREATE INDEX "audit_logs_category_idx" ON "audit_logs"("category");

-- CreateIndex
CREATE INDEX "audit_logs_success_idx" ON "audit_logs"("success");

-- CreateIndex
CREATE INDEX "backup_codes_user_id_type_idx" ON "backup_codes"("user_id", "type");

-- CreateIndex
CREATE INDEX "backup_codes_user_id_type_used_at_idx" ON "backup_codes"("user_id", "type", "used_at");

-- CreateIndex
CREATE INDEX "backup_codes_expires_at_idx" ON "backup_codes"("expires_at");

-- CreateIndex
CREATE INDEX "tokens_user_id_type_expires_in_idx" ON "tokens"("user_id", "type", "expires_in");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_is_2fa_enabled_idx" ON "users"("is_2fa_enabled");

-- CreateIndex
CREATE INDEX "users_preferred_2fa_method_idx" ON "users"("preferred_2fa_method");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE INDEX "users_last_login_at_idx" ON "users"("last_login_at");

-- CreateIndex
CREATE INDEX "users_risk_score_idx" ON "users"("risk_score");

-- AddForeignKey
ALTER TABLE "authentication_methods" ADD CONSTRAINT "authentication_methods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trusted_devices" ADD CONSTRAINT "trusted_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_locks" ADD CONSTRAINT "account_locks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
