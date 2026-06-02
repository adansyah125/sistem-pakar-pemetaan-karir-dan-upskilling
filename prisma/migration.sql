CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE IF NOT EXISTS "DiagnosisSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "minat" JSONB NOT NULL,
    "hasilDiagnosis" JSONB,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedPada" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DiagnosisSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AssessmentSession" (
    "id" TEXT NOT NULL,
    "diagnosisId" TEXT NOT NULL,
    "soal" JSONB NOT NULL,
    "jawaban" JSONB,
    "hasilAnalisis" JSONB,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedPada" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AssessmentSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Roadmap" (
    "id" TEXT NOT NULL,
    "diagnosisId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "progress" JSONB NOT NULL DEFAULT '{}',
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedPada" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "DiagnosisSession_userId_idx" ON "DiagnosisSession"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "AssessmentSession_diagnosisId_key" ON "AssessmentSession"("diagnosisId");
CREATE INDEX IF NOT EXISTS "AssessmentSession_diagnosisId_idx" ON "AssessmentSession"("diagnosisId");
CREATE UNIQUE INDEX IF NOT EXISTS "Roadmap_diagnosisId_key" ON "Roadmap"("diagnosisId");
CREATE INDEX IF NOT EXISTS "Roadmap_diagnosisId_idx" ON "Roadmap"("diagnosisId");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AssessmentSession_diagnosisId_fkey') THEN
        ALTER TABLE "AssessmentSession" ADD CONSTRAINT "AssessmentSession_diagnosisId_fkey"
            FOREIGN KEY ("diagnosisId") REFERENCES "DiagnosisSession"("id") ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Roadmap_diagnosisId_fkey') THEN
        ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_diagnosisId_fkey"
            FOREIGN KEY ("diagnosisId") REFERENCES "DiagnosisSession"("id") ON DELETE CASCADE;
    END IF;
END;
$$;
