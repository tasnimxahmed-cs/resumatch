/*
  Warnings:

  - Added the required column `userId` to the `ResumeVersion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ResumeVersion" DROP CONSTRAINT "ResumeVersion_jobId_fkey";

-- AlterTable
ALTER TABLE "ResumeVersion" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "jobId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ResumeVersion" ADD CONSTRAINT "ResumeVersion_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
