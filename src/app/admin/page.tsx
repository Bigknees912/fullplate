import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

type Donation = {
  id: string;
  donor_name: string;
  donor_email: string | null;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
};

function money(cents: number, currency = "cad") {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function when(iso: string) {
  return new Date(iso).toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("email, name")
    .eq("email", user.email)
    .maybeSingle();

  if (!adminRow) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f1e8] px-6">
        <div className="max-w-md text-center bg-white rounded-2xl p-8 shadow">
          <h1 className="text-xl font-bold text-[#1c1512]">Not authorized</h1>
          <p className="text-sm text-[#6a5d4f] mt-2">
            {user.email} isn&apos;t on the admin allowlist.
          </p>
          <div className="mt-6">
            <LogoutButton />
          </div>
        </div>
      </main>
    );
  }

  const { data: donations } = await supabase
    .from("donations")
    .select("id, donor_name, donor_email, amount_cents, currency, status, created_at")
    .order("created_at", { ascending: false });

  const rows = (donations ?? []) as Donation[];
  const totalCents = rows.reduce((sum, d) => sum + d.amount_cents, 0);
  const count = rows.length;
  const avgCents = count ? Math.round(totalCents / count) : 0;

  return (
    <main className="min-h-screen bg-[#f7f1e8]">
      <header className="border-b border-[#ece0d0] bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-extrabold tracking-tight text-[#1c1512]">
              Full Plate <span className="text-[#E8622A]">YYC</span>
            </div>
            <div className="text-xs text-[#8a7663]">Admin dashboard</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-[#6a5d4f]">{adminRow.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Stat label="Total raised" value={money(totalCents)} accent />
          <Stat label="Donations" value={String(count)} />
          <Stat label="Average gift" value={money(avgCents)} />
        </div>

        <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(200,90,30,0.06)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#f0e6d9]">
            <h2 className="font-bold text-[#1c1512]">Recent donations</h2>
          </div>
          {rows.length === 0 ? (
            <div className="px-6 py-16 text-center text-[#9a8b7a]">
              No donations yet. They&apos;ll appear here as soon as the first payment succeeds.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#9a8b7a] border-b border-[#f0e6d9]">
                    <th className="px-6 py-3 font-medium">Donor</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((d) => (
                    <tr key={d.id} className="border-b border-[#f6efe5] last:border-0">
                      <td className="px-6 py-3 font-medium text-[#2b2320]">{d.donor_name}</td>
                      <td className="px-6 py-3 text-[#6a5d4f]">{d.donor_email ?? "—"}</td>
                      <td className="px-6 py-3 font-semibold text-[#E8622A]">
                        {money(d.amount_cents, d.currency)}
                      </td>
                      <td className="px-6 py-3 text-[#6a5d4f]">{when(d.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-6 shadow-[0_10px_40px_rgba(200,90,30,0.06)] ${
        accent ? "bg-gradient-to-br from-[#E8622A] to-[#F59331] text-white" : "bg-white"
      }`}
    >
      <div className={`text-xs uppercase tracking-wide ${accent ? "text-white/80" : "text-[#9a8b7a]"}`}>
        {label}
      </div>
      <div className={`mt-2 text-3xl font-extrabold ${accent ? "text-white" : "text-[#1c1512]"}`}>
        {value}
      </div>
    </div>
  );
}
