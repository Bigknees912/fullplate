"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      className="rounded-lg border border-[#e6d8c7] bg-white px-3 py-1.5 text-sm font-medium text-[#6a5d4f] transition hover:bg-[#fbf3ea]"
    >
      Sign out
    </button>
  );
}
