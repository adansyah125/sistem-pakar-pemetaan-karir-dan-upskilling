import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/prisma";
import { askGeminiJSON } from "@/lib/gemini";
import { DIAGNOSE_SYSTEM_PROMPT } from "@/lib/prompts";
import type { DiagnosisResult, MinatInput } from "@/types/career";

export async function POST(request: NextRequest) {
  try {
    const { minat, userId } = (await request.json()) as {
      minat: MinatInput;
      userId: string;
    };

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userMessage = `
Minat yang dipilih: ${minat.pilihan.join(", ") || "Tidak ada"}
Minat custom: ${minat.custom || "Tidak ada"}
Skill yang dimiliki: ${minat.skill.join(", ") || "Belum ada skill"}

Berdasarkan data di atas, tentukan jalur karir yang paling cocok.`;

    const result = await askGeminiJSON<DiagnosisResult>(
      DIAGNOSE_SYSTEM_PROMPT,
      userMessage,
      userId
    );

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const { data: session, error } = await db
      .from('DiagnosisSession')
      .insert({
        id,
        userId,
        minat: JSON.stringify(minat),
        hasilDiagnosis: JSON.stringify(result),
        updatedPada: now,
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return NextResponse.json({
      result,
      sessionId: session.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan";
    const status = message.includes("Rate limit") ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
