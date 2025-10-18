-- CreateEnum
CREATE TYPE "user_roles" AS ENUM ('USER', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roles" "user_roles"[] DEFAULT ARRAY['USER']::"user_roles"[];
