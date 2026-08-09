import asyncio
import base64
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path("/app/backend/.env"))

from emergentintegrations.llm.chat import LlmChat, UserMessage

OUT = Path("/app/frontend/public/illustrations")
OUT.mkdir(parents=True, exist_ok=True)

STYLE = (
    "Editorial ink-and-watercolor-wash illustration for a sophisticated literary magazine. "
    "Hand-drawn deep charcoal ink linework with soft muted watercolor washes on a warm ivory paper background (#F7F5F0). "
    "Restrained palette: charcoal ink, warm ivory, small touches of oxblood red, muted Central Park green, faded taxicab yellow. "
    "Observational, warm, quietly witty, elegant, timeless, full of small details. "
    "Absolutely no text, no words, no letters, no numbers anywhere in the image."
)

SPOT_STYLE = (
    "Small editorial spot illustration: refined black ink linework with a light warm-gray wash on warm ivory paper (#F7F5F0), "
    "sophisticated literary-magazine marginalia, observational humor, hand-drawn, elegant. "
    "Use dark red (#731F17) only as one restrained accent — a correction mark, a time, an arrow, a circled detail or a single word. "
    "No text beyond what is specified. Generous empty ivory space around the subject."
)

SCENES = {
    "hero.png": (
        "Wide scene: an elegantly dressed couple crossing Central Park South toward a grand clubhouse entrance at dusk, "
        "seen from across the street. A doorman, one yellow taxi, a dog walker, small warmly lit windows with tiny scenes, "
        "the trees of Central Park behind. The city seems to quietly reorganize itself around the couple."
    ),
    "evening.png": "Cocktail glasses waiting in neat formation on a long bar, one waiter carrying an improbably elegant tray, evening light.",
    "doorman.png": "A Manhattan doorman in a long uniform coat reviewing a very long guest list outside a club entrance with an awning.",
    "chairs.png": "Two empty chairs reserved beside one another at a long candlelit dinner table, small place cards, quiet anticipation.",
    "taxi.png": "A yellow taxi seen from the side on a Manhattan street at night, a pair of evening shoes visible on the back seat through the window.",
    "nyac.png": "An elegant nineteenth-century clubhouse facade on Central Park South with a dark awning, lanterns, and trees across the street.",
    "pigeon.png": "A single city pigeon standing with unusual dignity on a marble step, looking slightly to the left.",
    "story.png": "Two figures sharing a green park bench in Central Park, one reading aloud to the other, a skyline faintly behind the trees.",
}

FEATURE_SCENES = {
    "manhattan-plan.png": (
        "Wide 4:3 editorial cartoon, high detail: an out-of-town wedding guest in shirtsleeves sitting at a small Manhattan "
        "hotel desk, calmly and seriously constructing an absurdly ambitious Saturday itinerary. On the desk: a large unfolded "
        "map of Manhattan covered in increasingly frantic dark-red arrows crossing the city in every direction, a cup of coffee, "
        "a wristwatch, a formal wedding invitation, hotel stationery, a pen, and a neatly handwritten schedule reading: "
        "'8:00 Breakfast downtown, 9:30 Museum uptown, 12:00 Lunch in Brooklyn, 2:00 Walk the High Line, 4:00 Drinks downtown, "
        "5:15 Quick nap, 5:30 Wedding'. The guest treats the plan as entirely reasonable. Refined black ink, restrained wash, "
        "dark red only for the map arrows, warm ivory paper background (#F7F5F0)."
    ),
    "manhattan-map.png": (
        "A hand-drawn illustrated map of Manhattan island for a sophisticated literary magazine: elegant black ink streets and "
        "avenues, the island vertical and slightly elongated, Central Park rendered in muted green wash, the surrounding rivers "
        "in pale blue-gray wash, a few tiny hand-drawn buildings and bridges, generous negative space, warm ivory paper "
        "background (#F7F5F0). Absolutely no text, no labels, no street names, no pins, no arrows, no numbers."
    ),
    "wedding-party-group.png": (
        "Editorial illustration: a wedding party of about ten people in formal clothes waiting at a Manhattan crosswalk, "
        "each engaged in slightly different mundane behavior — one fixing a cuff, one checking directions on a phone, one "
        "changing shoes, one carrying someone else's garment bag, one holding a coffee, one already eating, one looking in "
        "completely the wrong direction. Only the bride and groom, at the center, are looking in the same direction. "
        "Observational humor, not slapstick. Refined black ink, restrained wash, warm ivory paper (#F7F5F0)."
    ),
    "portrait-placeholder.png": (
        "A single elegant empty wooden picture frame leaning against a warm ivory wall, portrait orientation, soft light, "
        "a small pool of shadow beneath it. Refined black ink, restrained warm-gray wash, ivory paper (#F7F5F0). No text."
    ),
    "faq-suitcase.png": (
        "Editorial illustration: an exceptionally prepared wedding guest standing beside an open suitcase with carefully "
        "labeled compartments reading CEREMONY, WEATHER, AFTER-PARTY, EMERGENCY OUTFIT #1, EMERGENCY OUTFIT #2, and "
        "QUESTIONS FOR KEN. The guest looks calmly satisfied. Refined black ink, restrained wash, warm ivory paper (#F7F5F0)."
    ),
    "rsvp-list.png": (
        "Editorial illustration: a club attendant at a lectern carefully checking a guest's name against an implausibly long "
        "list that unrolls onto the floor. The guest waits patiently. In the distant background, a small happy couple waves "
        "directly at the guest, making the formality slightly ridiculous. No speech bubbles, no readable text. Refined black "
        "ink, restrained wash, warm ivory paper (#F7F5F0)."
    ),
    "rsvp-taxi.png": (
        "A warm, cinematic editorial illustration of a yellow New York taxi traveling through Manhattan at night, its "
        "illuminated roof sign reading JUNE 5. Through the rear window: formal clothing on a hanger, a garment bag, a gift "
        "bag, and one abandoned pair of dress shoes. Romantic, slightly funny, never cartoonish. Refined black ink, "
        "restrained wash, deep evening tones on warm ivory paper (#F7F5F0)."
    ),
    "notfound.png": (
        "Editorial cartoon: two impeccably dressed wedding guests, a man in a tuxedo and a woman in a long evening gown, "
        "standing outside the wrong imposing Manhattan club at night, holding a wedding invitation and speaking to a "
        "doorman. A discreet brass plaque beside the entrance reads 'KNICKERBOCKER CLUB'. They are clearly prepared for the "
        "correct wedding, and beginning to understand they are not at the correct building. Refined black ink, restrained "
        "wash, subtle dark red accent, warm ivory paper (#F7F5F0), observational humor."
    ),
}

SPOTS = {
    "spot-chairs.png": "Two formal dining chairs beside one another at a set table, each with a small folded place card; one card reads SOPHIE, the other reads KEN.",
    "spot-key.png": "A vintage hotel key with a leather key tag marked JUNE 5.",
    "spot-coatcheck.png": "A single refined coat-check ticket stub marked SK+KS, with a small brass safety pin.",
    "spot-footwear.png": "A formal patent-leather dress shoe and a practical worn walking shoe side by side beside a Manhattan curb and street grate.",
    "spot-twohundred.png": "A yellow taxi roof sign reading TWO HUNDRED.",
    "spot-later.png": "A champagne coupe beside a wristwatch showing a very late hour, the watch hands picked out in dark red.",
    "spot-review.png": "A hand holding a pencil over a handwritten recommendation list reading Pasta, Pizza, Steak, Everything — the word Everything circled once in dark red.",
    "spot-coffee.png": "A strong cup of black coffee on a saucer with one subtle sign of exhaustion: a folded pair of eyeglasses and a slightly drooping newspaper beside it.",
    "spot-tray.png": "A waiter in a dark vest carrying a perfectly balanced tray of champagne coupes high on one hand.",
    "spot-envelope.png": "A cream envelope hand-addressed to S. & K., N.Y.C., with a small postage stamp.",
    "spot-gap.png": "A formal shoe carefully stepping around a Manhattan street grate, a dropped folded place card lying beside it.",
    "spot-nyac.png": "A small precise architectural elevation drawing of a grand nineteenth-century Manhattan athletic club entrance with a dark awning and two lanterns.",
    "spot-reservation.png": "A hand with a pencil changing a restaurant reservation book entry from 2 PEOPLE to 200, the new number in dark red.",
    "spot-placecards.png": "Two small folded place cards side by side on ivory linen, one marked S, one marked K.",
    "spot-bowtie.png": "A black bow tie hanging from a taxi's rearview mirror, seen from the back seat.",
}


async def generate(name, prompt, style):
    path = OUT / name
    if path.exists() and path.stat().st_size > 10000:
        print(f"SKIP {name} (exists)")
        return
    try:
        chat = LlmChat(
            api_key=os.environ["EMERGENT_LLM_KEY"],
            session_id=f"illus-{name}",
            system_message="You are an editorial illustrator.",
        )
        chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
        msg = UserMessage(text=f"{prompt}\n\n{style}")
        text, images = await chat.send_message_multimodal_response(msg)
        if images:
            data = base64.b64decode(images[0]["data"])
            path.write_bytes(data)
            print(f"OK {name} ({len(data)} bytes)")
        else:
            print(f"FAIL {name}: no image returned. Text: {str(text)[:120]}")
    except Exception as e:
        print(f"FAIL {name}: {str(e)[:100]}")


async def main():
    for name, prompt in SCENES.items():
        await generate(name, prompt, STYLE)
    for name, prompt in FEATURE_SCENES.items():
        await generate(name, prompt, STYLE)
    for name, prompt in SPOTS.items():
        await generate(name, prompt, SPOT_STYLE)
    print("DONE")


if __name__ == "__main__":
    asyncio.run(main())
