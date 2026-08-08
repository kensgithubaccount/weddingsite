# Centralized editable content for sophieandken.
# Every public string on the site comes from here.
# "_status": "confirmed"  -> verified wedding information, safe to publish
# "_status": "placeholder" -> sample/draft, clearly marked, replace before launch
# "_status": "hidden"      -> section framework exists but stays unpublished

CONTENT = {
    "couple": {
        "partner_one": "Sophie Knochenhauer",
        "partner_two": "Ken Syme",
        "display_names": "Sophie + Ken",
        "mark": "SK+KS",
        "tagline": "Apparently, it requires a website.",
        "_status": "confirmed",
    },
    "date": {
        "display": "Saturday, June 5, 2027",
        "short": "June 5, 2027",
        "stamp": "JUN 05 2027",
        "iso_start": "2027-06-05T17:30:00-04:00",
        "iso_end": "2027-06-06T00:30:00-04:00",
        "_status": "confirmed",
    },
    "venue": {
        "name": "New York Athletic Club",
        "address": "180 Central Park South",
        "city": "New York, New York",
        "maps_query": "New York Athletic Club, 180 Central Park South, New York, NY",
        "_status": "confirmed",
    },
    "issue": {
        "volume": "Vol. I",
        "number": "No. 1",
        "edition": "The Wedding Issue",
        "price_line": "Issued to friends & family",
        "_status": "confirmed",
    },
    "schedule": [
        {
            "time": "5:30 PM",
            "title": "Arrival",
            "description": "Come in. Get settled. Feel privately relieved that you made it on time.",
            "location": "New York Athletic Club",
            "note": "",
            "_status": "confirmed",
        },
        {
            "time": "6:00 PM",
            "title": "The Ceremony",
            "description": "The part where we get married.",
            "location": "New York Athletic Club",
            "note": "",
            "_status": "confirmed",
        },
        {
            "time": "6:30 PM",
            "title": "Cocktail Hour",
            "description": "An hour of cocktails.",
            "location": "New York Athletic Club",
            "note": "",
            "_status": "confirmed",
        },
        {
            "time": "7:30 – 11:30 PM",
            "title": "The Reception",
            "description": "The ceremony, dinner and dancing.",
            "location": "New York Athletic Club",
            "note": "",
            "_status": "confirmed",
        },
        {
            "time": "11:30 PM",
            "title": "After-Party",
            "description": "To follow. Location and details to be announced.",
            "location": "To be announced",
            "note": "",
            "_status": "placeholder",
        },
    ],
    "meal_options": {
        "enabled": True,
        "sample": True,
        "sample_note": "Sample entrées — final menu to be confirmed by the venue.",
        "options": ["Herb-roasted chicken (sample)", "Seared salmon (sample)", "Wild mushroom risotto (sample)"],
        "_status": "placeholder",
    },
    "story": {
        "published": True,
        "placeholder": True,
        "kicker": "A feature in progress",
        "headline": "How It Started",
        "intro": "[ The editors — Sophie and Ken — are still at work on this feature. A concise essay, a few important scenes, and one or two sincere passages will appear here before June. ]",
        "sophie_note": "[ Something Sophie remembers. To be written by Sophie. ]",
        "ken_note": "[ Something Ken remembers. To be written by Ken. ]",
        "photos": [
            {
                "url": "https://images.unsplash.com/photo-1522941471521-6ee21ec5cc26?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBibGFjayUyMGFuZCUyMHdoaXRlJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg1OTg1NDc5fDA&ixlib=rb-4.1.0&q=85",
                "caption": "[ A real photograph of Sophie and Ken, with a caption they write themselves. ]",
                "alt": "Placeholder black and white portrait of a couple",
            },
            {
                "url": "https://images.unsplash.com/photo-1445699269025-bcc2c8f3faee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwzfHxjbGFzc2ljJTIwbmV3JTIweW9ya3klMjBhcmNoaXRlY3R1cmV8ZW58MHx8fHwxNzg1OTg1NDc5fDA&ixlib=rb-4.1.0&q=85",
                "caption": "[ A place in New York that became theirs. ]",
                "alt": "Placeholder photograph of classic New York architecture",
            },
        ],
        "_status": "placeholder",
    },
    "ny_guide": {
        "published": True,
        "intro": "You cannot do New York in a weekend. This has never stopped anyone from trying. These are the places we would send you when left in charge of your limited time, appetite and judgment.",
        "empty_note": "This page is being quietly compiled. Sophie and Ken's recommendations — the restaurants, bars, walks and rooms they actually love — will appear here as June approaches.",
        "categories": ["Eat", "Drink", "Coffee", "Walk", "See", "Late Night"],
        "recommendations": [],
        "_status": "placeholder",
    },
    "travel": {
        "published": True,
        "intro": "New York has three airports, several train stations and an impressive number of ways to take the wrong route. These are the simplest options.",
        "hotels_note": "Room blocks and recommended hotels are being arranged. Details, rates and booking deadlines will be posted here.",
        "hotels": [],
        "getting_here": [
            {"title": "By plane", "body": "Fly into whichever airport produces the least offensive combination of price and arrival time. JFK, LaGuardia and Newark all serve the city — allow an hour to Manhattan, more at rush hour."},
            {"title": "By train", "body": "Penn Station and Grand Central are both convenient, depending on where you are coming from and how strongly you feel about train stations. Amtrak arrives at Moynihan Train Hall; commuter lines at Grand Central. Both are a short ride from the venue."},
            {"title": "By car", "body": "If you are brave enough to drive into Manhattan, valet parking is available at the venue."},
            {"title": "Getting around", "body": "The venue is on Central Park South and is easy to reach by subway, cab or a walk in shoes you have planned appropriately."},
        ],
        "_status": "placeholder",
    },
    "attire": {
        "published": True,
        "placeholder": False,
        "headline": "Black Tie Optional",
        "body": "In plain English: tuxedos and floor-length gowns are welcome and encouraged — but a dark suit and tie, or an elegant cocktail dress, is equally at home. Dress for the best evening you plan to have all year.",
        "guidance": [
            {"label": "For men", "body": "A tuxedo if you own one — or have been waiting for an excuse. Otherwise, a dark suit, a white shirt and a tie will do beautifully."},
            {"label": "For women", "body": "A long gown, a cocktail dress or a dressy suit. Anything you'd wear to an evening you'd rather not end."},
            {"label": "Shoes & walking", "body": "There will be dancing, and possibly a short walk afterward. Choose shoes that can survive both."},
            {"label": "Weather", "body": "June evenings in New York are warm and the club is cool inside. A wrap or jacket is a good companion for the taxi line."},
        ],
        "_status": "confirmed",
    },
    "faqs": [
        {"q": "What time should I arrive?", "a": "Doors open at 5:30 PM at the New York Athletic Club. Cocktail hour begins at 6:30.", "_status": "confirmed"},
        {"q": "Where is the wedding?", "a": "The New York Athletic Club at 180 Central Park South, New York, New York. It is directly across from Central Park, which is helpful both geographically and aesthetically.", "_status": "confirmed"},
        {"q": "Is the wedding indoors?", "a": "The entire evening takes place at the New York Athletic Club.", "_status": "confirmed"},
        {"q": "What should I wear?", "a": "Black tie optional. Tuxedos, dark suits, gowns and formal dresses are all appropriate.", "_status": "confirmed"},
        {"q": "Can I bring a guest?", "a": "Your invitation lists everyone in your party. When you RSVP, you'll see exactly who is included — including any plus-one.", "_status": "confirmed"},
        {"q": "Are children invited?", "a": "Unfortunately, they are not.", "_status": "confirmed"},
        {"q": "When should I RSVP?", "a": "As soon as you know your plans. A formal deadline will be announced here.", "_status": "confirmed"},
        {"q": "What happens after 11:30 PM?", "a": "The after-party. More information will follow. For now, assume the evening continues.", "_status": "confirmed"},
        {"q": "Who should I contact with a question?", "a": "See the Contact section below — one address for logistics, one for RSVP help, one for accessibility.", "_status": "confirmed"},
    ],
    "registry": {
        "published": True,
        "note": "Your presence at 180 Central Park South is the gift. For those who have asked — thank you. The links below are the honest answer.",
        "entries": [
            {"name": "Zola", "kind": "Registry", "note": "Sample link — the couple will replace it with their real registry page.", "url": "https://www.zola.com", "_status": "placeholder"},
            {"name": "The Honeymoon Fund", "kind": "A fund", "note": "Toward a proper trip, taken slowly. Link to come.", "url": "", "_status": "placeholder"},
            {"name": "A Charity Close to Their Hearts", "kind": "In lieu of anything wrapped", "note": "Details to come.", "url": "", "_status": "placeholder"},
        ],
        "_status": "placeholder",
    },
    "contacts": [
        {"label": "General questions", "name": "Sophie & Ken", "user": "hello", "domain": "sophieandken.example", "_status": "placeholder"},
        {"label": "RSVP support", "name": "The Wedding Office", "user": "rsvp", "domain": "sophieandken.example", "_status": "placeholder"},
        {"label": "Accessibility & venue", "name": "The Wedding Office", "user": "access", "domain": "sophieandken.example", "_status": "placeholder"},
    ],
    "rsvp": {
        "personality_question": "What song gets you to the dance floor without fail?",
        "deadline_note": "Kindly respond at your earliest convenience.",
        "_status": "confirmed",
    },
}

SEED_HOUSEHOLDS = [
    {
        "name": "The Guest Household",
        "members": [
            {"first_name": "Test", "last_name": "Guest", "plus_one_allowed": True},
            {"first_name": "Taylor", "last_name": "Guest", "plus_one_allowed": False},
        ],
    },
    {
        "name": "Alex Sample",
        "members": [
            {"first_name": "Alex", "last_name": "Sample", "plus_one_allowed": True},
        ],
    },
    {
        "name": "The Example Family",
        "members": [
            {"first_name": "Jordan", "last_name": "Example", "plus_one_allowed": False},
            {"first_name": "Riley", "last_name": "Example", "plus_one_allowed": False},
            {"first_name": "Casey", "last_name": "Example", "plus_one_allowed": False},
        ],
    },
]
