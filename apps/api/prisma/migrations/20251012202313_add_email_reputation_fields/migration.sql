-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_bounced_at" TIMESTAMP(3),
ADD COLUMN     "is_unsubscribed" BOOLEAN DEFAULT false;
