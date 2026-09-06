import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Download, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { Seal } from "@/components/Seal";

const inputCls =
  "w-full bg-transparent border-b-2 border-[#1A1A1A]/25 focus:border-[#1D3F2C] outline-none py-2.5 font-body text-sm text-[#1A1A1A] transition-colors";
const smallBtn =
  "font-label text-[0.65rem] tracking-[0.14em] uppercase border border-[#1A1A1A]/40 px-4 py-2.5 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors min-h-[44px]";
const oxbloodBtn =
  "font-label text-[0.65rem] tracking-[0.14em] uppercase bg-[#1D3F2C] text-[#F7F5F0] px-5 py-2.5 hover:bg-[#142B1F] transition-colors min-h-[44px]";

const SAMPLE_CSV = "party,first_name,last_name,email,plus_one\nThe Syme Family,Gordon,Syme,,no\nThe Syme Family,Moira,Syme,,no";

const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem("sk_admin_token") || "");
  const [password, setPassword] = useState("");
  const [overview, setOverview] = useState(null);
  const [parties, setParties] = useState([]);
  const [tab, setTab] = useState("guests");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [newParty, setNewParty] = useState({ name: "", members: [{ first_name: "", last_name: "", plus_one_allowed: false }] });
  const [newMember, setNewMember] = useState({});
  const [editing, setEditing] = useState(null); // party id being response-edited
  const [editDraft, setEditDraft] = useState(null);
  const [importSource, setImportSource] = useState("text");
  const [importData, setImportData] = useState("");
  const [importPreview, setImportPreview] = useState(null);
  const [importBusy, setImportBusy] = useState(false);
  const [settings, setSettings] = useState(null);
  const [mealDraft, setMealDraft] = useState("");

  const auth = { headers: { Authorization: `Bearer ${token}` } };

  const load = async (q = search, f = filter) => {
    try {
      const [o, p, s] = await Promise.all([
        api.get("/admin/overview", auth),
        api.get(`/admin/parties?search=${encodeURIComponent(q)}&filter=${f}`, auth),
        api.get("/admin/settings", auth),
      ]);
      setOverview(o.data);
      setParties(p.data);
      setSettings(s.data);
      setMealDraft((s.data.meal_options || []).join("\n"));
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

  const addParty = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/parties", newParty, auth);
      setNewParty({ name: "", members: [{ first_name: "", last_name: "", plus_one_allowed: false }] });
      toast.success("Party added to the list.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not add party.");
    }
  };

  const addMember = async (pid) => {
    const m = newMember[pid];
    if (!m?.first_name || !m?.last_name) return;
    await api.post(`/admin/parties/${pid}/members`, m, auth);
    setNewMember({ ...newMember, [pid]: { first_name: "", last_name: "", plus_one_allowed: false } });
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

  const startEdit = (p) => {
    setEditing(p.id);
    setEditDraft({
      email: p.contact_email || "",
      responses: p.members.map((m) => ({
        guest_id: m.id,
        attending: m.attendance === "yes",
        meal_choice: m.meal_choice || "",
        dietary_notes: m.dietary_notes || "",
        plus_one_name: m.plus_one_name || "",
      })),
      accessibility_notes: p.details?.accessibility_notes || "",
      song_request: p.details?.song_request || "",
      message_to_couple: p.details?.message_to_couple || "",
    });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/admin/parties/${editing}/response`, editDraft, auth);
      toast.success("Response updated.");
      setEditing(null);
      setEditDraft(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not update the response.");
    }
  };

  const runImportPreview = async (fileOverride) => {
    setImportBusy(true);
    setImportPreview(null);
    try {
      if (importSource === "xlsx") {
        const file = fileOverride;
        if (!file) { setImportBusy(false); return; }
        const b64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const res = await api.post("/admin/import/preview", { source: "xlsx", data: b64 }, auth);
        setImportPreview(res.data);
      } else {
        if (!importData.trim()) { setImportBusy(false); return; }
        const res = await api.post("/admin/import/preview", { source: importSource, data: importData }, auth);
        setImportPreview(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not read that file.");
    } finally {
      setImportBusy(false);
    }
  };

  const commitImport = async () => {
    setImportBusy(true);
    try {
      const res = await api.post("/admin/import/commit", { token: importPreview.token }, auth);
      toast.success(`Imported ${res.data.parties} parties, ${res.data.guests} guests.`);
      setImportPreview(null);
      setImportData("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Import failed.");
    } finally {
      setImportBusy(false);
    }
  };

  const saveSettings = async () => {
    try {
      await api.put("/admin/settings", {
        deadline: settings.deadline || null,
        meal_options_enabled: settings.meal_options_enabled,
        meal_options: mealDraft.split("\n").map((s) => s.trim()).filter(Boolean),
      }, auth);
      toast.success("Settings saved.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not save settings.");
    }
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
            className="mt-6 w-full font-label text-[0.7rem] tracking-[0.2em] uppercase bg-[#1A1A1A] text-[#F7F5F0] py-3.5 hover:bg-[#1D3F2C] transition-colors min-h-[44px]"
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
            <button onClick={exportCsv} className="font-label text-[0.65rem] tracking-[0.16em] uppercase flex items-center gap-2 link-underline min-h-[44px]" data-testid="admin-export-button">
              <Download size={13} /> Export CSV
            </button>
            <button
              onClick={() => { localStorage.removeItem("sk_admin_token"); setToken(""); }}
              className="font-label text-[0.65rem] tracking-[0.16em] uppercase text-[#595959] link-underline min-h-[44px]"
              data-testid="admin-logout-button"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-12">
        {overview && (
          <div data-testid="admin-stats">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[#1A1A1A]/15 border border-[#1A1A1A]/15">
              {[
                ["Invited", overview.total_invited],
                ["Parties", overview.parties],
                ["Replied", overview.parties_responded],
                ["Attending", overview.attending],
                ["Declined", overview.declined],
                ["Outstanding", overview.outstanding],
                ["Plus-ones", overview.plus_ones],
                ["Dietary notes", overview.dietary_notes],
                ["Access notes", overview.accessibility_notes],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#F7F5F0] p-5">
                  <p className="overline-label">{label}</p>
                  <p className="font-display text-4xl mt-2 text-[#1A1A1A]">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-between gap-3 mt-3">
              {Object.keys(overview.meal_totals || {}).length > 0 && (
                <p className="font-body text-sm text-[#595959]" data-testid="admin-meal-totals">
                  Meals: {Object.entries(overview.meal_totals).map(([k, v]) => `${k} × ${v}`).join(" · ")}
                </p>
              )}
              {overview.last_updated && (
                <p className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-[#595959]/70" data-testid="admin-last-updated">
                  Last updated {new Date(overview.last_updated).toLocaleString()}
                </p>
              )}
            </div>
            {overview.rehearsal_dinner && overview.rehearsal_dinner.invited > 0 && (
              <div className="mt-8" data-testid="admin-rd-stats">
                <p className="overline-label text-[#1D3F2C] mb-3">The night before — Rehearsal Dinner</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-[#1A1A1A]/15 border border-[#1A1A1A]/15">
                  {[
                    ["Invited", overview.rehearsal_dinner.invited],
                    ["Responded", overview.rehearsal_dinner.responded],
                    ["Attending", overview.rehearsal_dinner.attending],
                    ["Declined", overview.rehearsal_dinner.declined],
                    ["Outstanding", overview.rehearsal_dinner.outstanding],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-[#F7F5F0] p-4">
                      <p className="overline-label">{label}</p>
                      <p className="font-display text-3xl mt-1.5 text-[#1A1A1A]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-12 mb-8">
          {["guests", "responses", "import", "settings"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-label text-[0.68rem] tracking-[0.16em] uppercase px-5 py-2.5 border transition-colors min-h-[44px] ${
                tab === t ? "bg-[#1A1A1A] text-[#F7F5F0] border-[#1A1A1A]" : "border-[#1A1A1A]/40"
              }`}
              data-testid={`admin-tab-${t}`}
            >
              {t === "guests" ? "Guest list" : t === "responses" ? "Responses" : t === "import" ? "Import" : "Settings"}
            </button>
          ))}
        </div>

        {tab === "guests" && (
          <div>
            <form onSubmit={addParty} className="border border-[#1A1A1A]/25 bg-[#F2EFE9] p-6 mb-10" data-testid="admin-add-household-form">
              <p className="overline-label text-[#1D3F2C] mb-4">Add a party</p>
              <input
                required
                placeholder="Party name (e.g. The Syme Family)"
                value={newParty.name}
                onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                className={inputCls}
                data-testid="admin-household-name-input"
              />
              {newParty.members.map((m, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 mt-4 items-center">
                  <input
                    required
                    placeholder="First name"
                    value={m.first_name}
                    onChange={(e) => {
                      const members = [...newParty.members];
                      members[i].first_name = e.target.value;
                      setNewParty({ ...newParty, members });
                    }}
                    className={inputCls}
                    data-testid={`admin-member-first-${i}`}
                  />
                  <input
                    required
                    placeholder="Last name"
                    value={m.last_name}
                    onChange={(e) => {
                      const members = [...newParty.members];
                      members[i].last_name = e.target.value;
                      setNewParty({ ...newParty, members });
                    }}
                    className={inputCls}
                    data-testid={`admin-member-last-${i}`}
                  />
                  <label className="flex items-center gap-2 font-label text-[0.65rem] tracking-[0.12em] uppercase cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={m.plus_one_allowed}
                      onChange={(e) => {
                        const members = [...newParty.members];
                        members[i].plus_one_allowed = e.target.checked;
                        setNewParty({ ...newParty, members });
                      }}
                      data-testid={`admin-member-plusone-${i}`}
                    />
                    +1
                  </label>
                </div>
              ))}
              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setNewParty({ ...newParty, members: [...newParty.members, { first_name: "", last_name: "", plus_one_allowed: false }] })}
                  className={`${smallBtn} flex items-center gap-2`}
                  data-testid="admin-add-member-row"
                >
                  <Plus size={12} /> Another guest
                </button>
                <button type="submit" className={oxbloodBtn} data-testid="admin-save-household-button">
                  Save party
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {parties.map((p) => (
                <div key={p.id} className="rule-fine pt-5" data-testid={`admin-household-${p.id}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display text-2xl tracking-tight">
                      {p.display_name}
                      {p.responded && (
                        <span className={`ml-3 font-label text-[0.6rem] tracking-[0.16em] uppercase align-middle ${p.attending_any ? "text-[#1D3F2C]" : "text-[#595959]"}`}>
                          {p.attending_any ? "Replied — attending" : "Replied — regrets"}
                        </span>
                      )}
                    </p>
                    <button
                      onClick={async () => { await api.delete(`/admin/parties/${p.id}`, auth); load(); }}
                      className="text-[#1D3F2C] p-1.5 min-h-[44px] min-w-[44px]"
                      aria-label={`Delete ${p.display_name}`}
                      data-testid={`admin-delete-household-${p.id}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {p.members.map((m) => (
                      <li key={m.id} className="flex items-center justify-between font-body text-sm text-[#595959]">
                        <span>
                          {m.first_name} {m.last_name}
                          {m.plus_one_allowed && <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-[#1D3F2C] ml-2">+1</span>}
                        </span>
                        <button
                          onClick={async () => { await api.delete(`/admin/members/${m.id}`, auth); load(); }}
                          className="text-[#595959]/60 hover:text-[#1D3F2C] p-2 min-h-[44px] min-w-[44px]"
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
                      value={newMember[p.id]?.first_name || ""}
                      onChange={(e) => setNewMember({ ...newMember, [p.id]: { ...(newMember[p.id] || {}), first_name: e.target.value } })}
                      className={inputCls}
                      data-testid={`admin-addmember-first-${p.id}`}
                    />
                    <input
                      placeholder="Last name"
                      value={newMember[p.id]?.last_name || ""}
                      onChange={(e) => setNewMember({ ...newMember, [p.id]: { ...(newMember[p.id] || {}), last_name: e.target.value } })}
                      className={inputCls}
                      data-testid={`admin-addmember-last-${p.id}`}
                    />
                    <label className="flex items-center gap-2 font-label text-[0.65rem] tracking-[0.12em] uppercase cursor-pointer min-h-[44px]">
                      <input
                        type="checkbox"
                        checked={newMember[p.id]?.plus_one_allowed || false}
                        onChange={(e) => setNewMember({ ...newMember, [p.id]: { ...(newMember[p.id] || {}), plus_one_allowed: e.target.checked } })}
                        data-testid={`admin-addmember-plusone-${p.id}`}
                      />
                      +1
                    </label>
                    <button onClick={() => addMember(p.id)} className={smallBtn} data-testid={`admin-addmember-button-${p.id}`}>
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "responses" && (
          <div>
            <div className="flex flex-wrap gap-3 mb-8 items-center">
              <input
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load(search, filter)}
                className={`${inputCls} max-w-xs`}
                data-testid="admin-search-input"
              />
              <select
                value={filter}
                onChange={(e) => { setFilter(e.target.value); load(search, e.target.value); }}
                className={`${inputCls} max-w-[12rem] cursor-pointer`}
                data-testid="admin-filter-select"
              >
                <option value="all">All parties</option>
                <option value="responded">Responded</option>
                <option value="outstanding">Outstanding</option>
                <option value="attending">Attending</option>
                <option value="declined">Declined</option>
              </select>
              <button onClick={() => load(search, filter)} className={smallBtn} data-testid="admin-search-button">
                Search
              </button>
            </div>

            <div className="space-y-8" data-testid="admin-responses-list">
              {parties.length === 0 && (
                <p className="font-body italic text-[#595959]">No parties match. The envelopes are still out.</p>
              )}
              {parties.map((p) => (
                <div key={p.id} className="rule-fine pt-5" data-testid={`admin-response-${p.id}`}>
                  <div className="flex flex-wrap justify-between gap-2 items-baseline">
                    <p className="font-display text-2xl tracking-tight">{p.display_name}</p>
                    <div className="flex items-center gap-4">
                      <p className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-[#595959]">
                        {p.contact_email || "No email on file"}
                        {p.updated_at && ` · ${new Date(p.updated_at).toLocaleDateString()}`}
                      </p>
                      <button onClick={() => (editing === p.id ? setEditing(null) : startEdit(p))} className={smallBtn} data-testid={`admin-edit-response-${p.id}`}>
                        {editing === p.id ? "Close" : "Edit response"}
                      </button>
                    </div>
                  </div>

                  {editing !== p.id && (
                    <>
                      <ul className="mt-3 space-y-1.5 font-body text-sm text-[#595959]">
                        {p.members.map((m) => (
                          <li key={m.id}>
                            <span className={m.attendance === "yes" ? "text-[#1D3F2C]" : m.attendance === "no" ? "text-[#595959]" : "text-[#595959]/50"}>
                              {m.attendance === "yes" ? "✓" : m.attendance === "no" ? "✕" : "—"}
                            </span>{" "}
                            {m.first_name} {m.last_name}
                            {m.plus_one_name && ` — brings ${m.plus_one_name}`}
                            {m.meal_choice && ` — ${m.meal_choice}`}
                            {m.dietary_notes && ` — dietary: ${m.dietary_notes}`}
                          </li>
                        ))}
                      </ul>
                      {p.details?.song_request && <p className="font-body italic text-sm text-[#595959] mt-2">Song: “{p.details.song_request}”</p>}
                      {p.details?.accessibility_notes && <p className="font-body italic text-sm text-[#595959] mt-1">Access: “{p.details.accessibility_notes}”</p>}
                      {p.details?.message_to_couple && <p className="font-body italic text-sm text-[#595959] mt-1">Note: “{p.details.message_to_couple}”</p>}
                    </>
                  )}

                  {editing === p.id && editDraft && (
                    <div className="border border-[#1A1A1A]/25 bg-[#F2EFE9] p-6 mt-4" data-testid="admin-edit-form">
                      <div className="max-w-sm">
                        <label className="overline-label block mb-1.5">Contact email</label>
                        <input
                          value={editDraft.email}
                          onChange={(e) => setEditDraft({ ...editDraft, email: e.target.value })}
                          className={inputCls}
                          data-testid="admin-edit-email"
                        />
                      </div>
                      {p.members.map((m, i) => {
                        const r = editDraft.responses[i];
                        return (
                          <div key={m.id} className="rule-fine mt-5 pt-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="font-body text-sm text-[#1A1A1A]">{m.first_name} {m.last_name}</span>
                              <button
                                onClick={() => {
                                  const responses = [...editDraft.responses];
                                  responses[i] = { ...r, attending: true };
                                  setEditDraft({ ...editDraft, responses });
                                }}
                                className={`font-label text-[0.6rem] tracking-[0.14em] uppercase px-3 py-2 border min-h-[44px] ${r.attending ? "bg-[#1D3F2C] text-[#F7F5F0] border-[#1D3F2C]" : "border-[#1A1A1A]/40"}`}
                                data-testid={`admin-edit-yes-${m.id}`}
                              >
                                Attending
                              </button>
                              <button
                                onClick={() => {
                                  const responses = [...editDraft.responses];
                                  responses[i] = { ...r, attending: false };
                                  setEditDraft({ ...editDraft, responses });
                                }}
                                className={`font-label text-[0.6rem] tracking-[0.14em] uppercase px-3 py-2 border min-h-[44px] ${!r.attending ? "bg-[#1A1A1A] text-[#F7F5F0] border-[#1A1A1A]" : "border-[#1A1A1A]/40"}`}
                                data-testid={`admin-edit-no-${m.id}`}
                              >
                                Declined
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                              {m.plus_one_allowed && (
                                <input
                                  placeholder="Plus-one name"
                                  value={r.plus_one_name}
                                  onChange={(e) => {
                                    const responses = [...editDraft.responses];
                                    responses[i] = { ...r, plus_one_name: e.target.value };
                                    setEditDraft({ ...editDraft, responses });
                                  }}
                                  className={inputCls}
                                  data-testid={`admin-edit-plusone-${m.id}`}
                                />
                              )}
                              <input
                                placeholder="Dietary notes"
                                value={r.dietary_notes}
                                onChange={(e) => {
                                  const responses = [...editDraft.responses];
                                  responses[i] = { ...r, dietary_notes: e.target.value };
                                  setEditDraft({ ...editDraft, responses });
                                }}
                                className={inputCls}
                                data-testid={`admin-edit-dietary-${m.id}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                        <input
                          placeholder="Accessibility notes"
                          value={editDraft.accessibility_notes}
                          onChange={(e) => setEditDraft({ ...editDraft, accessibility_notes: e.target.value })}
                          className={inputCls}
                          data-testid="admin-edit-accessibility"
                        />
                        <input
                          placeholder="Song request"
                          value={editDraft.song_request}
                          onChange={(e) => setEditDraft({ ...editDraft, song_request: e.target.value })}
                          className={inputCls}
                          data-testid="admin-edit-song"
                        />
                        <input
                          placeholder="Message to couple"
                          value={editDraft.message_to_couple}
                          onChange={(e) => setEditDraft({ ...editDraft, message_to_couple: e.target.value })}
                          className={inputCls}
                          data-testid="admin-edit-message"
                        />
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button onClick={saveEdit} className={oxbloodBtn} data-testid="admin-save-response-button">
                          Save response
                        </button>
                        <button onClick={() => setEditing(null)} className={smallBtn} data-testid="admin-cancel-response-button">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "import" && (
          <div className="max-w-3xl" data-testid="admin-import">
            <p className="font-body text-[#595959] text-sm leading-relaxed mb-6">
              Upload the guest-list workbook (.xlsx with Parties, Guests, Events, and Event_Invites sheets), paste a CSV, or link a Google
              Sheet published to the web as CSV. Workbook rows upsert by their stable external IDs — re-importing a corrected file updates
              the same records instead of duplicating them. The sheet stays an import source only; this database remains the live record.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {["xlsx", "text", "url"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setImportSource(s); setImportPreview(null); }}
                  className={`font-label text-[0.65rem] tracking-[0.14em] uppercase px-4 py-2.5 border min-h-[44px] ${importSource === s ? "bg-[#1A1A1A] text-[#F7F5F0] border-[#1A1A1A]" : "border-[#1A1A1A]/40"}`}
                  data-testid={`admin-import-source-${s}`}
                >
                  {s === "xlsx" ? "Workbook (.xlsx)" : s === "text" ? "Paste CSV" : "Google Sheet URL"}
                </button>
              ))}
            </div>
            {importSource === "xlsx" ? (
              <div>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => e.target.files?.[0] && runImportPreview(e.target.files[0])}
                  className="font-body text-sm text-[#595959] file:mr-4 file:font-label file:text-[0.65rem] file:tracking-[0.14em] file:uppercase file:border file:border-[#1A1A1A]/40 file:px-4 file:py-2.5 file:bg-transparent file:cursor-pointer"
                  data-testid="admin-import-file"
                />
                {importBusy && <p className="font-body italic text-sm text-[#595959] mt-3">Reading the workbook…</p>}
              </div>
            ) : importSource === "text" ? (
              <textarea
                rows={8}
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder={SAMPLE_CSV}
                className="w-full bg-[#F2EFE9] border border-[#1A1A1A]/25 p-4 font-mono text-xs text-[#1A1A1A] outline-none focus:border-[#1D3F2C]"
                data-testid="admin-import-textarea"
              />
            ) : (
              <input
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/…/pub?output=csv"
                className={inputCls}
                data-testid="admin-import-url"
              />
            )}
            {importSource !== "xlsx" && (
              <button onClick={() => runImportPreview()} disabled={importBusy} className={`${oxbloodBtn} mt-5`} data-testid="admin-import-preview-button">
                {importBusy ? "Reading…" : "Preview import"}
              </button>
            )}

            {importPreview && (
              <div className="border border-[#1A1A1A]/25 bg-[#F2EFE9] p-6 mt-8" data-testid="admin-import-summary">
                <p className="overline-label text-[#1D3F2C]">Import summary — nothing committed yet</p>
                <p className="font-display text-3xl tracking-tight mt-4">
                  {importPreview.parties} parties · {importPreview.guests} guests
                </p>
                {importPreview.kind === "xlsx" && (
                  <p className="font-body text-sm text-[#595959] mt-2" data-testid="admin-import-event-counts">
                    {importPreview.events} events · {importPreview.event_invites} event invitations
                    {importPreview.rehearsal_dinner_invites > 0 && ` · ${importPreview.rehearsal_dinner_invites} rehearsal-dinner invitations`}
                  </p>
                )}
                {importPreview.duplicates.length > 0 && (
                  <div className="mt-4">
                    <p className="overline-label">Duplicates skipped</p>
                    <ul className="font-body text-sm text-[#595959] mt-2 space-y-1">
                      {importPreview.duplicates.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                )}
                {importPreview.errors.length > 0 && (
                  <div className="mt-4">
                    <p className="overline-label">Rows skipped</p>
                    <ul className="font-body text-sm text-[#595959] mt-2 space-y-1">
                      {importPreview.errors.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                )}
                <div className="mt-5 space-y-2">
                  {importPreview.sample.map((s) => (
                    <p key={s.party} className="font-body text-sm text-[#1A1A1A]">
                      <span className="font-display text-lg">{s.party}</span>
                      <span className="text-[#595959]"> — {s.members.join(", ")}</span>
                    </p>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={commitImport} disabled={importBusy} className={oxbloodBtn} data-testid="admin-import-commit-button">
                    {importBusy ? "Importing…" : "Commit import"}
                  </button>
                  <button onClick={() => setImportPreview(null)} className={smallBtn} data-testid="admin-import-cancel-button">
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "settings" && settings && (
          <div className="max-w-2xl space-y-10" data-testid="admin-settings">
            <div>
              <p className="overline-label text-[#1D3F2C] mb-3">RSVP deadline</p>
              <p className="font-body text-sm text-[#595959] mb-4">
                After this moment, the RSVP desk closes and guests are asked to contact you directly. Leave empty to keep RSVPs open.
              </p>
              <input
                type="datetime-local"
                value={settings.deadline ? settings.deadline.slice(0, 16) : ""}
                onChange={(e) => setSettings({ ...settings, deadline: e.target.value ? new Date(e.target.value).toISOString() : null })}
                className={`${inputCls} max-w-xs`}
                data-testid="admin-deadline-input"
              />
              {settings.deadline && (
                <p className="font-body italic text-xs text-[#595959] mt-2" data-testid="admin-deadline-readout">
                  Closes {new Date(settings.deadline).toLocaleString()}
                </p>
              )}
            </div>
            <div>
              <p className="overline-label text-[#1D3F2C] mb-3">Meal selection</p>
              <label className="flex items-center gap-3 font-body text-sm text-[#1A1A1A] cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={settings.meal_options_enabled}
                  onChange={(e) => setSettings({ ...settings, meal_options_enabled: e.target.checked })}
                  data-testid="admin-meal-enabled-toggle"
                />
                Ask guests to choose an entrée
              </label>
              <textarea
                rows={4}
                value={mealDraft}
                onChange={(e) => setMealDraft(e.target.value)}
                placeholder={"Herb-roasted chicken\nSeared salmon\nWild mushroom risotto"}
                className="w-full max-w-sm mt-4 bg-[#F2EFE9] border border-[#1A1A1A]/25 p-4 font-body text-sm text-[#1A1A1A] outline-none focus:border-[#1D3F2C]"
                data-testid="admin-meal-options-input"
              />
              <p className="font-body italic text-xs text-[#595959] mt-2">One option per line. Hidden from guests until enabled.</p>
            </div>
            <button onClick={saveSettings} className={oxbloodBtn} data-testid="admin-save-settings-button">
              Save settings
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
