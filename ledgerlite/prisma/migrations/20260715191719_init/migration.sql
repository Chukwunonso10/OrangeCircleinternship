/*
  Warnings:

  - Changed the type of `resource` on the `SyncOperation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SyncOperation" DROP COLUMN "resource",
ADD COLUMN     "resource" "Resource" NOT NULL;
