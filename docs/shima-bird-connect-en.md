# Shima Bird Connect — Setup Guide

Mine Japanese words from your browser into **Shima Bird** for spaced-repetition review, using the free [Yomitan](https://yomitan.wiki/) extension.

While reading a Japanese page, hold **Shift** and hover a word → tap **＋** in Yomitan → the word lands in your in-app **inbox**, ready to import as a flashcard.

> 🇹🇭 ภาษาไทย: [shima-bird-connect-th.md](shima-bird-connect-th.md)

---

**1. Install Yomitan** (supports Chrome, Firefox, and Microsoft Edge)
Go to https://yomitan.wiki — it has install links for all three browsers; pick yours.

![Yomitan website](images/connect/00-yomitan-website.png)

**2.** Click **Add to Chrome** (or your browser), then **Add extension**.

![Add to Chrome](images/connect/01-add-to-chrome.png)

**3.** After installing, the **Welcome to Yomitan** page opens automatically.

![Welcome to Yomitan](images/connect/02-welcome-page.png)

**4.** Under **Import Dictionaries**, choose **Get recommended dictionaries…** and **Download** all of them (or just the ones you want, e.g. Jitendex).

![Get recommended dictionaries](images/connect/03-recommended-dictionaries.png)

**5.** Downloaded dictionaries are **enabled by default**. To check or manage them, open **Configure Installed and enabled dictionaries…** — the **All** toggle should already be on.

![Dictionaries enabled](images/connect/04-enable-dictionaries.png)

> ✅ Yomitan can now look up words — but can't send them to Shima Bird yet. Continue below.

**6.** Click the Yomitan icon on the toolbar → a popup appears → click the **gear** to open Settings → select the **Anki** tab.

![Yomitan icon popup](images/connect/05-yomitan-icon.png)

> Don't see the Yomitan icon? Click the **Extensions (puzzle)** button and **pin** Yomitan to the toolbar — if it's still unresponsive, switch browser tabs first.

**7.** Open Shima Bird → bottom-right menu → **Shima Bird Connect** → **Create link** → copy it into Yomitan's **AnkiConnect server address** field (replacing the default `http://127.0.0.1:8765`).

![Yomitan Anki settings](images/connect/06-yomitan-anki.png)

In the app — find Shima Bird Connect (under Immersion), create the link, then copy it:

![Shima Bird Connect in the app](images/connect/06-app-connect.jpg)
![Create pairing link](images/connect/06-app-pairing.png)

**8.** Tap **Enable Anki Connection** — on success it shows **Connected**.
_(If it fails: generate a new link, paste it again, and re-toggle.)_

**9.** Tap **Configure Anki Flashcard**, choose **Deck: Shima Bird Inbox**, **Model: Shima Bird**, then **Close** — the fields auto-map (Expression / Reading / Glossary / Sentence / URL).

![Configure card](images/connect/07-configure-card.png)

**10.** Open any Japanese page. Hold **Shift** while pointing at a Japanese word → a definition pops up with a green **＋** button at the top-right → click it, and the word is sent to the Shima Bird server.

![Mine a word](images/connect/08-mine-word.png)

**11.** Tap **Refresh** in Shima Bird Connect — your mined words appear → tap **＋** to import → the **Create New Card** page opens pre-filled (word / reading / meaning / kanji breakdown).

![Inbox](images/connect/09-inbox.png)
![Create card](images/connect/10-create-card.png)

_(Optional)_ You can tap **AI Autofill** to fill in the explanation + **example sentences (up to 3)** automatically.

![AI example sentences](images/connect/11-ai-examples.png)

**12.** Pick a **Deck** + **Study Mode** at the bottom, then tap **Add to Quick Study** to start learning right away (or **Create Only** to save for later).

![Add to Quick Study](images/connect/12-add-to-study.png)

### Limits

|                |                                        |
| -------------- | -------------------------------------- |
| Words per day  | 300 (resets at midnight, Bangkok time) |
| Inbox capacity | 20 — mining past this drops the oldest |
