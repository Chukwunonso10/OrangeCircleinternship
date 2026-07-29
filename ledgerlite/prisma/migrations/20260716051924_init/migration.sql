/*
  Warnings:

  - Changed the type of `operation` on the `SyncOperation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SyncOperation" DROP COLUMN "operation",
ADD COLUMN     "operation" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Operation";
