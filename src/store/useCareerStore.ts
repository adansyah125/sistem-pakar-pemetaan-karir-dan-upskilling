import { create } from "zustand";
import type {
  MinatInput,
  DiagnosisResult,
  SoalKompetensi,
  AnalisisAssessment,
  Roadmap,
} from "@/types/career";

interface CareerStore {
  minat: MinatInput;
  diagnosisResult: DiagnosisResult | null;
  soalAktif: SoalKompetensi[];
  jawaban: Record<number, string>;
  assessmentResult: AnalisisAssessment | null;
  roadmap: Roadmap | null;
  sessionId: string | null;
  assessmentId: string | null;
  loadingStep: string | null;
  setMinat: (minat: MinatInput) => void;
  setDiagnosisResult: (result: DiagnosisResult, sessionId: string) => void;
  setSessionId: (sessionId: string | null) => void;
  setSoalAktif: (soal: SoalKompetensi[], assessmentId: string) => void;
  setJawaban: (nomor: number, jawaban: string) => void;
  setAssessmentResult: (result: AnalisisAssessment) => void;
  setRoadmap: (roadmap: Roadmap | null) => void;
  setLoadingStep: (step: string | null) => void;
  reset: () => void;
}

const initialState = {
  minat: { pilihan: [], custom: "", skill: [] },
  diagnosisResult: null,
  soalAktif: [],
  jawaban: {},
  assessmentResult: null,
  roadmap: null,
  sessionId: null,
  assessmentId: null,
  loadingStep: null,
};

export const useCareerStore = create<CareerStore>((set) => ({
  ...initialState,
  setMinat: (minat) => set({ minat }),
  setDiagnosisResult: (result, sessionId) =>
    set({ diagnosisResult: result, sessionId }),
  setSessionId: (sessionId) => set({ sessionId }),
  setSoalAktif: (soal, assessmentId) =>
    set({ soalAktif: soal, assessmentId, jawaban: {} }),
  setJawaban: (nomor, jawaban) =>
    set((state) => ({ jawaban: { ...state.jawaban, [nomor]: jawaban } })),
  setAssessmentResult: (result) => set({ assessmentResult: result }),
  setRoadmap: (roadmap) => set({ roadmap }),
  setLoadingStep: (step) => set({ loadingStep: step }),
  reset: () => set(initialState),
}));
