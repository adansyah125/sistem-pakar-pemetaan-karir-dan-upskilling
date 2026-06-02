export interface MinatInput {
  pilihan: string[];
  custom: string;
  skill: string[];
}

export interface DiagnosisResult {
  karirUtama: string;
  karirAlternatif: string[];
  skorKepercayaan: number;
  alasan: string;
  kompetensiKunci: string[];
}

export interface SoalKompetensi {
  nomor: number;
  pertanyaan: string;
  pilihan: Record<string, string>;
  kategori: string;
}

export interface AnalisisAssessment {
  skorKeseluruhan: number;
  skorPerKompetensi: Record<string, number>;
  kekuatan: string[];
  kelemahan: string[];
  rekomendasi: string;
}

export interface SumberBelajar {
  nama: string;
  tipe: string;
  url: string;
}

export interface RoadmapStep {
  urutan: number;
  judul: string;
  deskripsi: string;
  skill: string[];
  sumberBelajar: SumberBelajar[];
  estimasi: string;
  status: "belum" | "selesai";
}

export interface Roadmap {
  tujuanKarir: string;
  estimasiTotal: string;
  levelAwal: string;
  levelTarget: string;
  langkah: RoadmapStep[];
}

export interface RiwayatItem {
  id: string;
  minat: MinatInput;
  hasilDiagnosis: DiagnosisResult | null;
  roadmap: Roadmap | null;
  dibuatPada: string;
  progressRoadmap: number;
}
