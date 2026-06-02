import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { askGeminiJSON } from "@/lib/gemini";
import { ASSESS_SYSTEM_PROMPT } from "@/lib/prompts";
import type { AnalisisAssessment, SoalKompetensi } from "@/types/career";

export async function POST(request: NextRequest) {
  try {
    const { assessmentId, jawaban, userId } = (await request.json()) as {
      assessmentId: string;
      jawaban: Record<number, string>;
      userId: string;
    };

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: assessment, error: fetchError } = await db
      .from('AssessmentSession')
      .select("soal")
      .eq("id", assessmentId)
      .single();

    if (fetchError || !assessment) {
      return NextResponse.json(
        { error: "Assessment tidak ditemukan" },
        { status: 404 }
      );
    }

    const soal: SoalKompetensi[] = typeof assessment.soal === "string"
      ? JSON.parse(assessment.soal)
      : assessment.soal;

    let detailJawaban = "";
    for (const s of soal) {
      const j = jawaban[s.nomor] || "Tidak dijawab";
      detailJawaban += `\nSoal ${s.nomor}: ${s.pertanyaan}\nJawaban: ${j}\n`;
    }

    const userMessage = `Berikut adalah jawaban user untuk 10 soal kompetensi:\n${detailJawaban}\n\nAnalisis jawaban ini dan berikan skor serta rekomendasi.`;

    const result = await askGeminiJSON<AnalisisAssessment>(
      ASSESS_SYSTEM_PROMPT,
      userMessage,
      userId
    );

    const now = new Date().toISOString();
    const { error: updateError } = await db
      .from('AssessmentSession')
      .update({
        jawaban: JSON.stringify(jawaban),
        hasilAnalisis: JSON.stringify(result),
        updatedPada: now,
      })
      .eq("id", assessmentId);

    if (updateError) {
      throw new Error(`Database error: ${updateError.message}`);
    }

    return NextResponse.json({ result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan";
    const status = message.includes("Rate limit") ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
