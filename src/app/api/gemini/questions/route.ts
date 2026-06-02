import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/prisma";
import { askGeminiJSON } from "@/lib/gemini";
import { QUESTIONS_SYSTEM_PROMPT } from "@/lib/prompts";
import type { SoalKompetensi, DiagnosisResult } from "@/types/career";

export async function POST(request: NextRequest) {
  try {
    const { diagnosisSessionId, userId } = (await request.json()) as {
      diagnosisSessionId: string;
      userId: string;
    };

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: session, error: fetchError } = await db
      .from('DiagnosisSession')
      .select("hasilDiagnosis")
      .eq("id", diagnosisSessionId)
      .single();

    if (fetchError || !session) {
      return NextResponse.json(
        { error: "Session tidak ditemukan" },
        { status: 404 }
      );
    }

    const hasil = typeof session.hasilDiagnosis === "string"
      ? JSON.parse(session.hasilDiagnosis)
      : session.hasilDiagnosis;

    const userMessage = `
Jalur karir: ${hasil.karirUtama}
Kompetensi kunci: ${hasil.kompetensiKunci.join(", ")}

Buatkan 10 soal kompetensi untuk menguji pengetahuan di bidang ini.`;

    const soal = await askGeminiJSON<SoalKompetensi[]>(
      QUESTIONS_SYSTEM_PROMPT,
      userMessage,
      userId
    );

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const { data: assessment, error: insertError } = await db
      .from('AssessmentSession')
      .insert({
        id,
        diagnosisId: diagnosisSessionId,
        soal: JSON.stringify(soal),
        updatedPada: now,
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`);
    }

    return NextResponse.json({
      soal,
      assessmentId: assessment.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan";
    const status = message.includes("Rate limit") ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
