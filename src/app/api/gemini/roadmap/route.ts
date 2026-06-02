import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/prisma";
import { askGeminiJSON } from "@/lib/gemini";
import { ROADMAP_SYSTEM_PROMPT } from "@/lib/prompts";
import type { Roadmap, DiagnosisResult, AnalisisAssessment } from "@/types/career";

export async function POST(request: NextRequest) {
  try {
    const { diagnosisSessionId, userId } = (await request.json()) as {
      diagnosisSessionId: string;
      userId: string;
    };

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: existing } = await db
      .from('Roadmap')
      .select("data")
      .eq("diagnosisId", diagnosisSessionId)
      .single();

    if (existing?.data) {
      const roadmap: Roadmap = typeof existing.data === "string"
        ? JSON.parse(existing.data)
        : existing.data;
      return NextResponse.json({ roadmap });
    }

    const { data: session, error: fetchError } = await db
      .from('DiagnosisSession')
      .select("id, hasilDiagnosis")
      .eq("id", diagnosisSessionId)
      .single();

    if (fetchError || !session) {
      return NextResponse.json(
        { error: "Session tidak ditemukan" },
        { status: 404 }
      );
    }

    const { data: assessmentData } = await db
      .from('AssessmentSession')
      .select("hasilAnalisis")
      .eq("diagnosisId", diagnosisSessionId)
      .single();

    const hasil: DiagnosisResult = typeof session.hasilDiagnosis === "string"
      ? JSON.parse(session.hasilDiagnosis)
      : session.hasilDiagnosis;

    const analisis: AnalisisAssessment | null = assessmentData?.hasilAnalisis
      ? (typeof assessmentData.hasilAnalisis === "string"
          ? JSON.parse(assessmentData.hasilAnalisis)
          : assessmentData.hasilAnalisis)
      : null;

    const userMessage = `
Tujuan karir: ${hasil.karirUtama}
Kompetensi kunci: ${hasil.kompetensiKunci.join(", ")}
${analisis ? `Skor assessment: ${analisis.skorKeseluruhan}/100
Kekuatan: ${analisis.kekuatan.join(", ")}
Kelemahan: ${analisis.kelemahan.join(", ")}` : ""}

Buatkan roadmap upskilling yang terstruktur berdasarkan data di atas.`;

    const roadmap = await askGeminiJSON<Roadmap>(
      ROADMAP_SYSTEM_PROMPT,
      userMessage,
      userId
    );

    const roadmapId = crypto.randomUUID();
    const now = new Date().toISOString();
    await db
      .from('Roadmap')
      .insert({
        id: roadmapId,
        diagnosisId: diagnosisSessionId,
        data: JSON.stringify(roadmap),
        updatedPada: now,
      });

    return NextResponse.json({ roadmap });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan";
    const status = message.includes("Rate limit") ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
