# คู่มือติดตั้ง Yomitan + ใช้ Shima Bird Connect

สะสมคำศัพท์ภาษาญี่ปุ่นจากเบราว์เซอร์เข้า **Shima Bird** เพื่อทบทวนด้วยระบบ SRS — ผ่านส่วนเสริมฟรี [Yomitan](https://yomitan.wiki/)

ขณะอ่านเว็บญี่ปุ่น กด Shift ค้างแล้วเลื่อนเมาส์ไปที่คำ → กด **＋** ใน Yomitan → คำจะถูกสะสมเข้า inbox ในแอป พร้อมนำเข้าเป็นการ์ดทบทวน

> เบื้องหลัง: Shima Bird เปิด endpoint ที่เข้ากันได้กับ AnkiConnect → **Yomitan ตัวจริง (stock) คุยกับแอปได้ตรงๆ** ไม่ต้องลงส่วนเสริมเพิ่ม

---

## ภาษาไทย

**1. ติดตั้ง Yomitan** (รองรับ Chrome, Firefox และ Microsoft Edge)
ไปที่ https://yomitan.wiki — มีลิงก์ติดตั้งครบทั้ง 3 เบราว์เซอร์ด้านใน เลือกเบราว์เซอร์ที่ใช้

![หน้าเว็บ Yomitan](images/connect/00-yomitan-website.png)

**2.** กด **Add to Chrome** (หรือเบราว์เซอร์ที่ใช้) แล้วกด **เพิ่มส่วนขยาย**

![Add to Chrome](images/connect/01-add-to-chrome.png)

**3.** ติดตั้งเสร็จจะเปิดหน้า **Welcome to Yomitan** ขึ้นมาเอง

![Welcome to Yomitan](images/connect/02-welcome-page.png)

**4.** ที่หัวข้อ **Import Dictionaries** เลือก **Get recommended dictionaries…** แล้วกด **Download** ทุกอัน (หรือเฉพาะอันที่ต้องการ เช่น Jitendex)

![Get recommended dictionaries](images/connect/03-recommended-dictionaries.png)

**5.** ปกติดิกชันนารีที่โหลดมาจะ **เปิดใช้งาน (Enable) อัตโนมัติ** อยู่แล้ว — ถ้าอยากเช็ก/จัดการ เลือก **Configure Installed and enabled dictionaries…** จะเห็นรายการพร้อม toggle **All** เปิดอยู่

![Dictionaries enabled](images/connect/04-enable-dictionaries.png)

> ✅ ถึงตรงนี้ Yomitan สแกนคำศัพท์ได้แล้ว — แต่ยังส่งเข้า Shima Bird ไม่ได้ ทำขั้นต่อไป

**6.** กดไอคอน Yomitan บน toolbar → จะมี popup ขึ้น → กดรูป **ฟันเฟือง** เพื่อเข้า Settings → เลือกแท็บ **Anki**

![Yomitan icon popup](images/connect/05-yomitan-icon.png)

> ถ้าไม่เห็นไอคอน Yomitan: กดรูป **ส่วนขยาย (จิ๊กซอว์)** บน toolbar แล้ว **ปักหมุด** Yomitan ไว้ — ถ้ายังกดไม่ขึ้น ลอง **สลับแท็บ** ดูก่อน

**7.** เปิดแอป Shima Bird → กดเมนูขวาล่าง → **Shima Bird Connect** → **สร้างลิงก์เชื่อมต่อ** → คัดลอกลิงก์ไปวางในช่อง **AnkiConnect server address** ของ Yomitan (แทนค่า `http://127.0.0.1:8765` เดิม)

![Yomitan Anki settings](images/connect/06-yomitan-anki.png)

ฝั่งแอป — หา Shima Bird Connect (ใต้ Immersion) แล้วสร้างลิงก์ → คัดลอก:

![Shima Bird Connect ในแอป](images/connect/06-app-connect.jpg)
![สร้างลิงก์เชื่อมต่อ](images/connect/06-app-pairing.png)

**8.** กด **Enable Anki Connection** — ถ้าสำเร็จจะขึ้น **Connected**
_(ถ้า Fail: กดสร้างลิงก์ใหม่อีกครั้งก่อนเอาไปวาง แล้ว retoggle อีกรอบ)_

**9.** กด **Configure Anki Flashcard** เลือก **Deck : Shima Bird Inbox**, **Model : Shima Bird** แล้วกด **Close** — ช่อง field จะถูก map ให้อัตโนมัติ (Expression / Reading / Glossary / Sentence / URL)

![Configure card](images/connect/07-configure-card.png)

**10.** เข้าเว็บภาษาญี่ปุ่นที่ต้องการ กด **Shift** ค้างขณะเลื่อนเมาส์ไปที่คำ → จะขึ้นคำแปลพร้อมปุ่ม **＋ สีเขียว** มุมขวาบน → กดปุ่มนั้น คำจะถูกส่งเข้า Server ของ Shima Bird

![Mine a word](images/connect/08-mine-word.png)

**11.** กด **Refresh** ที่ Shima Bird Connect จะเห็นคำที่ mine เข้ามา → กดปุ่ม **＋** เพื่อ import → เปิดหน้า **Create New Card** ที่เติมคำ / คำอ่าน / ความหมาย / แยก kanji ให้แล้ว

![Inbox](images/connect/09-inbox.png)
![Create card](images/connect/10-create-card.png)

กด **AI Autofill** เพื่อเติม explanation + **ประโยคตัวอย่าง (สูงสุด 3)** อัตโนมัติ

![AI example sentences](images/connect/11-ai-examples.png)

**12.** เลือก **Deck** + **Study Mode** ด้านล่าง แล้วกด **Add to Quick Study** → เริ่มเรียนได้เลย (หรือ **Create Only** เก็บไว้ก่อน)

![Add to Quick Study](images/connect/12-add-to-study.png)

### ลิมิตการใช้งาน

|                   |                                  |
| ----------------- | -------------------------------- |
| สะสมต่อวัน        | 300 คำ (รีเซ็ตเที่ยงคืนเวลาไทย)  |
| ความจุ inbox      | 20 คำ — สะสมเกินจะลบคำเก่าสุดออก |
| คำซ้ำใน 10 นาที   | ไม่นับซ้ำ                        |
| เลื่อนเมาส์ดูเฉยๆ | ฟรี ไม่กินลิมิต                  |

---

## English

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

Tap **AI Autofill** to fill in the explanation + **example sentences (up to 3)** automatically.

![AI example sentences](images/connect/11-ai-examples.png)

**12.** Pick a **Deck** + **Study Mode** at the bottom, then tap **Add to Quick Study** to start learning right away (or **Create Only** to save for later).

![Add to Quick Study](images/connect/12-add-to-study.png)

### Limits

|                         |                                        |
| ----------------------- | -------------------------------------- |
| Words per day           | 300 (resets at midnight, Bangkok time) |
| Inbox capacity          | 20 — mining past this drops the oldest |
| Same word within 10 min | not duplicated                         |
| Hovering                | free — never counts against any limit  |

---

<sub>Screenshots live in `docs/images/connect/` (`00`–`09`). Drop real captures with the same filenames to populate this guide.</sub>
