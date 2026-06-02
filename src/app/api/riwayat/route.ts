import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data: sessions, error } = await db
    .from('DiagnosisSession')
    .select("id, minat, hasilDiagnosis, dibuatPada")
    .eq("userId", userId)
    .order("dibuatPada", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const riwayat = await Promise.all(
    (sessions || []).map(async (s: Record<string, unknown>) => {
      const { data: roadmapData } = await db
        .from('Roadmap')
        .select("data")
        .eq("diagnosisId", s.id)
        .single();

      const roadmap = roadmapData?.data
        ? (typeof roadmapData.data === "string"
            ? JSON.parse(roadmapData.data)
            : roadmapData.data)
        : null;

      const roadmapSteps = roadmap?.langkah || [];
      const selesai = roadmapSteps.filter(
        (l: { status?: string }) => l.status === "selesai"
      ).length;
      const total = roadmapSteps.length || 1;

      return {
        id: s.id,
        minat: typeof s.minat === "string" ? JSON.parse(s.minat) : s.minat,
        hasilDiagnosis:
          typeof s.hasilDiagnosis === "string"
            ? JSON.parse(s.hasilDiagnosis)
            : s.hasilDiagnosis,
        roadmap,
        dibuatPada: s.dibuatPada,
        progressRoadmap: Math.round((selesai / total) * 100),
      };
    })
  );

  return NextResponse.json({ riwayat });
}
