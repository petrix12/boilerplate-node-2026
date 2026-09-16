-- AlterTable
ALTER TABLE "system_logs" ADD COLUMN     "context" JSONB,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'BACKEND';

-- CreateIndex
CREATE INDEX "system_logs_source_idx" ON "system_logs"("source");

-- CreateIndex
CREATE INDEX "system_logs_level_idx" ON "system_logs"("level");

-- CreateIndex
CREATE INDEX "system_logs_createdAt_idx" ON "system_logs"("createdAt");
