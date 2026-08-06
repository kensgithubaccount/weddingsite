import asyncio
import base64
import os
import sys
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


async def generate(name, prompt):
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
        msg = UserMessage(text=f"{prompt}\n\n{STYLE}")
        text, images = await chat.send_message_multimodal_response(msg)
        if images:
            data = base64.b64decode(images[0]["data"])
            path.write_bytes(data)
            print(f"OK {name} ({len(data)} bytes)")
        else:
            print(f"FAIL {name}: no image returned. Text: {str(text)[:120]}")
    except Exception as e:
        print(f"FAIL {name}: {e}")


async def main():
    for name, prompt in SCENES.items():
        await generate(name, prompt)
    print("DONE")


if __name__ == "__main__":
    asyncio.run(main())
