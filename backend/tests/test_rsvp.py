"""Backend regression tests for Sophie+Ken RSVP + Rehearsal Dinner.

Covers guest-lookup normalization, disambiguation, returning guest, submission,
per-person events (REHEARSAL_DINNER) eligibility, admin overview/parties/settings,
security (cross-party injection, unauthorized admin), and deadline enforcement.
"""
import os
import time
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else "https://sophie-ken.preview.emergentagent.com"
API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "skks-2027"

# time-trap in server: submit requires >=1s since t; lookup >=1.2s
def _tform():
    return int(time.time() * 1000) - 2000


@pytest.fixture(scope="session")
def s():
    ses = requests.Session()
    ses.headers.update({"Content-Type": "application/json"})
    return ses


@pytest.fixture(scope="session")
def admin_token(s):
    r = s.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def admin(s, admin_token):
    ses = requests.Session()
    ses.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {admin_token}"})
    return ses


def lookup(s, name, **extra):
    payload = {"name": name, "t": _tform(), **extra}
    r = s.post(f"{API}/guest-lookup", json=payload)
    assert r.status_code == 200, r.text
    return r.json()


# ---------- health ----------

class TestHealth:
    def test_root(self, s):
        r = s.get(f"{API}/")
        assert r.status_code == 200
        assert "Sophie" in r.json()["message"]

    def test_status_open(self, s):
        r = s.get(f"{API}/rsvp/status")
        assert r.status_code == 200
        d = r.json()
        assert d["closed"] is False
        # per test instructions deadline should be unset
        assert d["deadline"] in (None, "")


# ---------- lookup ----------

class TestLookup:
    def test_exact_test_guest(self, s):
        d = lookup(s, "Test Guest")
        assert d["status"] == "found"
        names = [f"{m['first_name']} {m['last_name']}" for m in d["members"]]
        assert "Test Guest" in names and "Taylor Guest" in names
        test_guest = next(m for m in d["members"] if m["first_name"] == "Test")
        assert test_guest["plus_one_allowed"] is True
        taylor = next(m for m in d["members"] if m["first_name"] == "Taylor")
        assert taylor["plus_one_allowed"] is False

    def test_normalization_whitespace_case(self, s):
        d = lookup(s, "  taylor   GUEST ")
        assert d["status"] == "found"

    def test_apostrophe_dropped(self, s):
        d = lookup(s, "saoirse obrien")
        assert d["status"] == "found"
        assert "O'Brien" in d["party"]["display_name"]

    def test_curly_apostrophe(self, s):
        d = lookup(s, "Saoirse O\u2019Brien")
        assert d["status"] == "found"

    def test_hyphen_as_space(self, s):
        d = lookup(s, "Jamie Doe Smith")
        assert d["status"] == "found"
        assert "Doe-Smith" in d["party"]["display_name"]

    def test_collapsed_no_space(self, s):
        d = lookup(s, "jamie doesmith")
        assert d["status"] == "found"

    def test_not_found(self, s):
        d = lookup(s, "Barack Obama")
        assert d["status"] == "not_found"

    def test_ambiguous_alex(self, s):
        d = lookup(s, "Alex Sample")
        assert d["status"] == "multiple"
        assert d["method"] == "email"
        assert "candidates_token" in d

    def test_disambiguate_by_email(self, s):
        d = lookup(s, "Alex Sample")
        tok = d["candidates_token"]
        # wrong disambiguator
        r_wrong = s.post(f"{API}/guest-lookup", json={"name": "Alex Sample", "candidates_token": tok, "disambiguator": "nope@nope.com", "t": _tform()})
        assert r_wrong.json()["status"] == "not_found"
        # correct email
        r_ok = s.post(f"{API}/guest-lookup", json={"name": "Alex Sample", "candidates_token": tok, "disambiguator": "delivered@resend.dev", "t": _tform()})
        j = r_ok.json()
        assert j["status"] == "found"
        # The party with email is "Alex Sample" party (single member)
        first_names = [m["first_name"] for m in j["members"]]
        assert "Alex" in first_names

    def test_disambiguate_by_member(self, s):
        d = lookup(s, "Alex Sample")
        tok = d["candidates_token"]
        r_ok = s.post(f"{API}/guest-lookup", json={"name": "Alex Sample", "candidates_token": tok, "disambiguator": "Jordan Sample", "t": _tform()})
        j = r_ok.json()
        assert j["status"] == "found"
        assert "Sample Cousins" in j["party"]["display_name"]


# ---------- returning guest / submission ----------

class TestSubmitAndReturn:
    def test_submit_and_return_flow(self, s):
        # Lookup Jamie Doe-Smith
        d = lookup(s, "Jamie Doe-Smith")
        assert d["status"] == "found"
        token = d["token"]
        jamie = d["members"][0]
        payload = {
            "token": token,
            "email": "delivered@resend.dev",
            "responses": [{
                "guest_id": jamie["id"],
                "attending": True,
                "plus_one_name": "Sam Companion",
                "dietary_notes": "no shellfish",
                "meal_choice": "",
            }],
            "event_responses": [],
            "accessibility_notes": "",
            "song_request": "Never Gonna Give You Up",
            "message_to_couple": "",
            "t": _tform(),
        }
        r = s.post(f"{API}/rsvp/submit", json=payload)
        assert r.status_code == 200, r.text
        j = r.json()
        assert j["ok"] is True
        assert j["attending_any"] is True

        # returning guest — lookup again
        d2 = lookup(s, "Jamie Doe-Smith")
        assert d2["already_responded"] is True
        assert d2["existing"]["responses"][0]["attending"] is True
        assert d2["existing"]["responses"][0]["plus_one_name"] == "Sam Companion"
        assert d2["existing"]["email"] == "delivered@resend.dev"

        # update to declined
        d3 = lookup(s, "Jamie Doe-Smith")
        payload["token"] = d3["token"]
        payload["responses"][0]["attending"] = False
        payload["responses"][0]["plus_one_name"] = ""
        payload["t"] = _tform()
        r2 = s.post(f"{API}/rsvp/submit", json=payload)
        assert r2.status_code == 200
        assert r2.json()["attending_any"] is False

    def test_plus_one_rejected_for_non_allowed(self, s):
        d = lookup(s, "Test Guest")
        token = d["token"]
        taylor = next(m for m in d["members"] if m["first_name"] == "Taylor")
        test_g = next(m for m in d["members"] if m["first_name"] == "Test")
        payload = {
            "token": token,
            "email": "delivered@resend.dev",
            "responses": [
                {"guest_id": taylor["id"], "attending": True, "plus_one_name": "Illegal Guest", "dietary_notes": "", "meal_choice": ""},
                {"guest_id": test_g["id"], "attending": True, "plus_one_name": "", "dietary_notes": "", "meal_choice": ""},
            ],
            "event_responses": [],
            "t": _tform(),
        }
        r = s.post(f"{API}/rsvp/submit", json=payload)
        assert r.status_code == 400
        assert "plus-one" in r.text.lower()


# ---------- security ----------

class TestSecurity:
    def test_cross_party_guest_id_rejected(self, s):
        d1 = lookup(s, "Jamie Doe-Smith")
        d2 = lookup(s, "Test Guest")
        # use Test Guest's guest_id but Jamie's token
        foreign_id = d2["members"][0]["id"]
        payload = {
            "token": d1["token"],
            "email": "delivered@resend.dev",
            "responses": [{"guest_id": foreign_id, "attending": True, "plus_one_name": "", "dietary_notes": "", "meal_choice": ""}],
            "event_responses": [],
            "t": _tform(),
        }
        r = s.post(f"{API}/rsvp/submit", json=payload)
        assert r.status_code == 400
        assert "does not belong" in r.text.lower()

    def test_event_response_for_non_invited_rejected(self, s):
        d = lookup(s, "Jamie Doe-Smith")  # not invited to RD
        jamie = d["members"][0]
        payload = {
            "token": d["token"],
            "email": "delivered@resend.dev",
            "responses": [{"guest_id": jamie["id"], "attending": True, "plus_one_name": "", "dietary_notes": "", "meal_choice": ""}],
            "event_responses": [{"guest_id": jamie["id"], "event_code": "REHEARSAL_DINNER", "attending": True}],
            "t": _tform(),
        }
        r = s.post(f"{API}/rsvp/submit", json=payload)
        assert r.status_code == 400
        assert "not invited" in r.text.lower()

    def test_admin_requires_token(self, s):
        r = s.get(f"{API}/admin/overview")
        assert r.status_code == 401
        r = s.get(f"{API}/admin/parties")
        assert r.status_code == 401
        r = s.get(f"{API}/admin/settings")
        assert r.status_code == 401


# ---------- rehearsal dinner ----------

class TestRehearsalDinner:
    def test_invited_sees_events(self, s):
        d = lookup(s, "Sophie Knochenhauer")
        assert d["status"] == "found"
        sophie = next((m for m in d["members"] if m["first_name"].lower() == "sophie"), None)
        assert sophie is not None
        assert "events" in sophie, f"Expected events on invited member, got {sophie}"
        codes = [e["code"] for e in sophie["events"]]
        assert "REHEARSAL_DINNER" in codes
        # 'details to follow' — server must NOT invent details: date/location may be None
        rd = next(e for e in sophie["events"] if e["code"] == "REHEARSAL_DINNER")
        # placeholder integrity: fields either null or nonempty string
        for k in ("date", "location", "address", "start_time", "end_time"):
            assert rd[k] is None or isinstance(rd[k], str)

    def test_not_invited_no_events_key(self, s):
        d = lookup(s, "Aunt Gail")
        if d["status"] != "found":
            pytest.skip("Aunt Gail not present in preview DB")
        for m in d["members"]:
            assert "events" not in m, f"Non-invited guest leaks events: {m}"


# ---------- admin ----------

class TestAdmin:
    def test_login_bad(self, s):
        r = s.post(f"{API}/admin/login", json={"password": "wrong"})
        assert r.status_code == 401

    def test_overview(self, admin):
        r = admin.get(f"{API}/admin/overview")
        assert r.status_code == 200
        d = r.json()
        for k in ("parties", "total_invited", "parties_responded", "attending", "declined", "outstanding", "plus_ones", "dietary_notes", "accessibility_notes", "rehearsal_dinner"):
            assert k in d
        rd = d["rehearsal_dinner"]
        for k in ("invited", "responded", "attending", "declined", "outstanding"):
            assert k in rd
        assert rd["invited"] >= 1

    def test_parties_search_and_filter(self, admin):
        r = admin.get(f"{API}/admin/parties", params={"search": "sample"})
        assert r.status_code == 200
        names = [p["display_name"].lower() for p in r.json()]
        assert any("sample" in n for n in names)
        r2 = admin.get(f"{API}/admin/parties", params={"filter": "responded"})
        assert r2.status_code == 200
        assert all(p["responded"] for p in r2.json())

    def test_export_csv(self, admin):
        r = admin.get(f"{API}/admin/export")
        assert r.status_code == 200
        assert "Rehearsal Dinner" in r.text.split("\n")[0]

    def test_settings_deadline_closes_rsvp(self, admin, s):
        # set past deadline
        past = "2020-01-01T00:00:00+00:00"
        r = admin.put(f"{API}/admin/settings", json={"deadline": past, "meal_options_enabled": False, "meal_options": []})
        assert r.status_code == 200
        try:
            status = s.get(f"{API}/rsvp/status").json()
            assert status["closed"] is True
            # attempt submit should now 403
            d = lookup(s, "Test Guest")
            if d.get("status") == "found":
                payload = {
                    "token": d["token"],
                    "email": "delivered@resend.dev",
                    "responses": [{"guest_id": d["members"][0]["id"], "attending": True, "plus_one_name": "", "dietary_notes": "", "meal_choice": ""}],
                    "event_responses": [],
                    "t": _tform(),
                }
                rr = s.post(f"{API}/rsvp/submit", json=payload)
                assert rr.status_code == 403
        finally:
            # ALWAYS clear deadline
            admin.put(f"{API}/admin/settings", json={"deadline": None, "meal_options_enabled": False, "meal_options": []})
            status2 = s.get(f"{API}/rsvp/status").json()
            assert status2["closed"] is False
