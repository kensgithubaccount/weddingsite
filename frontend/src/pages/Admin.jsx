import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Download, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { Seal } from "@/components/Seal";

const inputCls =
  "w-full bg-transparent border-b-2 border-[#1A1A1A]/25 focus:border-[#731F17] outline-none py-2.5 font-body text-sm text-[#1A1A1A] transition-colors";

const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem("sk_admin_token") || "");
  const [password, setPassword] = useState("");
  const [overview, setOverview] = useState(null);
  const [households, setHouseholds] = useState([]);
  const [responses, setResponses] = useState([]);
  const [tab, setTab] = useState("guests");
  const [newHousehold, setNewHousehold] = useState({ name: "", members: [{ first_name: "", last_name: "", plus_one_allowed: false }] });
  const [newMember, setNewMember] = useState({});

  const auth = { headers: { Authorization: `Bearer ${token}` } };

  const load = async () => {
    try {
      const [o, h, r] = await Promise.all([
        api.get("/admin/overview", auth),
        api.get("/admin/households", auth),
        api.get("/admin/responses", auth),
      ]);
      setOverview(o.data);
      setHouseholds(h.data);
      setResponses(r.data);
    } catch {
      localStorage.removeItem("sk_admin_token");
      setToken("");
    }
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/login", { password });
      localStorage.setItem("sk_admin_token", res.data.token);
      setToken(res.data.token);
    } catch {
      toast.error("Incorrect password.");
    }
  };

  const addHousehold = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/households", newHousehold, auth);
      setNewHousehold({ name: "", members: [{ first_name: "", last_name: "", plus_one_allowed: false }] });
      toast.success("Household added to the list.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not add household.");
    }
  };

  const addMember = async (hid) => {
    const m = newMember[hid];
    if (!m?.first_name || !m?.last_name) return;
    await api.post(`/admin/households/${hid}/members`, m, auth);
    setNewMember({ ...newMember, [hid]: { first_name: "", last_name: "", plus_one_allowed: false } });
    load();
  };

  const exportCsv = async () => {
    const res = await api.get("/admin/export", { ...auth, responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sophie-ken-rsvps.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-6" data-testid="admin-login">
        <form onSubmit={login} className="w-full max-w-sm text-center">
          <Seal size={64} className="mx-auto" />
          <h1 className="font-display text-3xl tracking-tight mt-6">The Back Office</h1>
          <p className="overline-label mt-2">Editors only</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputCls} mt-8 text-center`}
            placeholder="Password"
            aria-label="Admin password"
            data-testid="admin-password-input"
          />
          <button
            type="submit"
            className="mt-6 w-full font-label text-[0.7rem] tracking-[0.2em] uppercase bg-[#1A1A1A] text-[#F7F5F0] py-3.5 hover:bg-[#731F17] transition-colors"
            data-testid="admin-login-button"
          >
            Sign in
          </button>
          <Link to="/" className="block mt-6 font-label text-[0.65rem] tracking-[0.16em] uppercase text-[#595959] link-underline" data-testid="admin-back-home">
            Back to the issue
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0]" data-testid="admin-dashboard">
      <header className="border-b border-[#1A1A1A]/15">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Seal size={30} />
            <span className="font-display font-semibold text-lg">The Back Office</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={exportCsv} className="font-label text-[0.65rem] tracking-[0.16em] uppercase flex items-center gap-2 link-underline" data-testid="admin-export-button">
              <Download size={13} /> Export CSV
            </button>
            <button
              onClick={() => { localStorage.removeItem("sk_admin_token"); setToken(""); }}
              className="font-label text-[0.65rem] tracking-[0.16em] uppercase text-[#595959] link-underline"
              data-testid="admin-logout-button"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-12">
        {overview && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[#1A1A1A]/15 border border-[#1A1A1A]/15" data-testid="admin-stats">
            {[
              ["Households", overview.households],
              ["Guests", overview.guests],
              ["Replied", overview.households_responded],
              ["Attending", overview.attending],
              ["Regrets", overview.declining],
              ["Plus-ones", overview.plus_ones],
            ].map(([label, value]) => (
              <div key={label} className="bg-[#F7F5F0] p-5">
                <p className="overline-label">{label}</p>
                <p className="font-display text-4xl mt-2 text-[#1A1A1A]">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-12 mb-8">
          {["guests", "responses"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-label text-[0.68rem] tracking-[0.16em] uppercase px-5 py-2.5 border transition-colors ${
                tab === t ? "bg-[#1A1A1A] text-[#F7F5F0] border-[#1A1A1A]" : "border-[#1A1A1A]/40"
              }`}
              data-testid={`admin-tab-${t}`}
            >
              {t === "guests" ? "Guest list" : "Responses"}
            </button>
          ))}
        </div>

        {tab === "guests" && (
          <div>
            <form onSubmit={addHousehold} className="border border-[#1A1A1A]/25 bg-[#F2EFE9] p-6 mb-10" data-testid="admin-add-household-form">
              <p className="overline-label text-[#731F17] mb-4">Add a household</p>
              <input
                required
                placeholder="Household name (e.g. The Syme Family)"
                value={newHousehold.name}
                onChange={(e) => setNewHousehold({ ...newHousehold, name: e.target.value })}
                className={inputCls}
                data-testid="admin-household-name-input"
              />
              {newHousehold.members.map((m, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 mt-4 items-center">
                  <input
                    required
                    placeholder="First name"
                    value={m.first_name}
                    onChange={(e) => {
                      const members = [...newHousehold.members];
                      members[i].first_name = e.target.value;
                      setNewHousehold({ ...newHousehold, members });
                    }}
                    className={inputCls}
                    data-testid={`admin-member-first-${i}`}
                  />
                  <input
                    required
                    placeholder="Last name"
                    value={m.last_name}
                    onChange={(e) => {
                      const members = [...newHousehold.members];
                      members[i].last_name = e.target.value;
                      setNewHousehold({ ...newHousehold, members });
                    }}
                    className={inputCls}
                    data-testid={`admin-member-last-${i}`}
                  />
                  <label className="flex items-center gap-2 font-label text-[0.65rem] tracking-[0.12em] uppercase cursor-pointer">
                    <input
                      type="checkbox"
                      checked={m.plus_one_allowed}
                      onChange={(e) => {
                        const members = [...newHousehold.members];
                        members[i].plus_one_allowed = e.target.checked;
                        setNewHousehold({ ...newHousehold, members });
                      }}
                      data-testid={`admin-member-plusone-${i}`}
                    />
                    +1
                  </label>
                </div>
              ))}
              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setNewHousehold({ ...newHousehold, members: [...newHousehold.members, { first_name: "", last_name: "", plus_one_allowed: false }] })}
                  className="font-label text-[0.65rem] tracking-[0.14em] uppercase border border-[#1A1A1A]/40 px-4 py-2.5 flex items-center gap-2"
                  data-testid="admin-add-member-row"
                >
                  <Plus size={12} /> Another guest
                </button>
                <button
                  type="submit"
                  className="font-label text-[0.65rem] tracking-[0.14em] uppercase bg-[#731F17] text-[#F7F5F0] px-5 py-2.5 hover:bg-[#5d1812] transition-colors"
                  data-testid="admin-save-household-button"
                >
                  Save household
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {households.map((h) => (
                <div key={h.id} className="rule-fine pt-5" data-testid={`admin-household-${h.id}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display text-2xl tracking-tight">
                      {h.name}
                      {h.responded && (
                        <span className={`ml-3 font-label text-[0.6rem] tracking-[0.16em] uppercase align-middle ${h.attending_any ? "text-[#4A5D4E]" : "text-[#731F17]"}`}>
                          {h.attending_any ? "Replied — attending" : "Replied — regrets"}
                        </span>
                      )}
                    </p>
                    <button
                      onClick={async () => { await api.delete(`/admin/households/${h.id}`, auth); load(); }}
                      className="text-[#731F17] p-1.5"
                      aria-label={`Delete ${h.name}`}
                      data-testid={`admin-delete-household-${h.id}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {h.members.map((m) => (
                      <li key={m.id} className="flex items-center justify-between font-body text-sm text-[#595959]">
                        <span>
                          {m.first_name} {m.last_name}
                          {m.plus_one_allowed && <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-[#731F17] ml-2">+1</span>}
                        </span>
                        <button
                          onClick={async () => { await api.delete(`/admin/members/${m.id}`, auth); load(); }}
                          className="text-[#595959]/60 hover:text-[#731F17] p-1"
                          aria-label={`Remove ${m.first_name} ${m.last_name}`}
                          data-testid={`admin-delete-member-${m.id}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-3 mt-4 items-center">
                    <input
                      placeholder="First name"
                      value={newMember[h.id]?.first_name || ""}
                      onChange={(e) => setNewMember({ ...newMember, [h.id]: { ...(newMember[h.id] || {}), first_name: e.target.value } })}
                      className={inputCls}
                      data-testid={`admin-addmember-first-${h.id}`}
                    />
                    <input
                      placeholder="Last name"
                      value={newMember[h.id]?.last_name || ""}
                      onChange={(e) => setNewMember({ ...newMember, [h.id]: { ...(newMember[h.id] || {}), last_name: e.target.value } })}
                      className={inputCls}
                      data-testid={`admin-addmember-last-${h.id}`}
                    />
                    <label className="flex items-center gap-2 font-label text-[0.65rem] tracking-[0.12em] uppercase cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMember[h.id]?.plus_one_allowed || false}
                        onChange={(e) => setNewMember({ ...newMember, [h.id]: { ...(newMember[h.id] || {}), plus_one_allowed: e.target.checked } })}
                        data-testid={`admin-addmember-plusone-${h.id}`}
                      />
                      +1
                    </label>
                    <button
                      onClick={() => addMember(h.id)}
                      className="font-label text-[0.65rem] tracking-[0.14em] uppercase border border-[#1A1A1A]/40 px-4 py-2.5 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors"
                      data-testid={`admin-addmember-button-${h.id}`}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "responses" && (
          <div className="space-y-8" data-testid="admin-responses-list">
            {responses.length === 0 && (
              <p className="font-body italic text-[#595959]">No responses yet. The envelopes are still out.</p>
            )}
            {responses.map((r) => (
              <div key={r.id} className="rule-fine pt-5">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-display text-2xl tracking-tight">{r.household_name}</p>
                  <p className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-[#595959]">{r.email}</p>
                </div>
                <ul className="mt-3 space-y-1.5 font-body text-sm text-[#595959]">
                  {r.responses.map((g) => (
                    <li key={g.guest_id}>
                      <span className={g.attending ? "text-[#4A5D4E]" : "text-[#731F17]"}>{g.attending ? "✓" : "✕"}</span>{" "}
                      {g.guest_name}
                      {g.meal && ` — ${g.meal}`}
                      {g.plus_one_name && ` — brings ${g.plus_one_name}`}
                      {g.dietary && ` — dietary: ${g.dietary}`}
                      {g.accessibility && ` — access: ${g.accessibility}`}
                    </li>
                  ))}
                </ul>
                {r.personality_answer && (
                  <p className="font-body italic text-sm text-[#595959] mt-2">Song: “{r.personality_answer}”</p>
                )}
                {r.note && <p className="font-body italic text-sm text-[#595959] mt-1">Note: “{r.note}”</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
