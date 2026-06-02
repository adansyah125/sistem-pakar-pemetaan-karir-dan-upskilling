import { createAdminSupabase } from "./supabase";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

export const db = createAdminSupabase();

export type { PostgrestSingleResponse };
