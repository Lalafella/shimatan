/*
 * Copyright (C) 2026 Shimatan Authors (Shima Bird + Yomitan fork)
 * Licensed under GPL-3.0
 *
 * Adds "Add to Shima Bird" button to the popup.
 * Collects words into a list, then generates a QR code for batch import.
 */

export class DisplayShima {
    /** @type {import('./display.js').Display} */
    _display;
    /** @type {object[]} */
    _wordList = [];

    /**
     * @param {import('./display.js').Display} display
     */
    constructor(display) {
        this._display = display;
        this._onShimaAddBind = this._onShimaAdd.bind(this);
    }

    prepare() {
        this._display.on('contentUpdateComplete', this._onContentUpdate.bind(this));
    }

    _onContentUpdate() {
        const entries = this._display.dictionaryEntries;
        for (let i = 0; i < entries.length; i++) {
            this._createShimaButton(i);
        }
    }

    /**
     * @param {number} index
     */
    _createShimaButton(index) {
        const entry = this._getEntry(index);
        if (entry === null) { return; }

        const container = entry.querySelector('.note-actions-container');
        if (container === null) { return; }

        if (container.querySelector('.shima-export-button')) { return; }

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'action-button shima-export-button';
        button.title = 'Add to Shima Bird';
        button.dataset.action = 'shima-export';
        button.innerHTML = '<span class="action-icon" style="font-size: 16px;">🐦</span>';
        button.addEventListener('click', this._onShimaAddBind);

        const wrapper = document.createElement('div');
        wrapper.className = 'action-button-container';
        wrapper.appendChild(button);
        container.appendChild(wrapper);
    }

    /**
     * @param {MouseEvent} e
     */
    _onShimaAdd(e) {
        e.preventDefault();
        const element = /** @type {HTMLElement} */ (e.currentTarget);
        const index = this._display.getElementDictionaryEntryIndex(element);
        const entries = this._display.dictionaryEntries;

        if (index < 0 || index >= entries.length) { return; }

        const data = this._extractEntryData(entries[index]);

        if (!data.w) { return; }
        if (this._wordList.some((w) => w.w === data.w)) { return; }
        if (this._wordList.length >= 10) {
            this._showToast('Maximum 10 words reached');
            return;
        }

        this._wordList.push(data);

        // Visual feedback on button
        element.innerHTML = '<span class="action-icon" style="font-size: 16px;">✅</span>';
        element.disabled = true;

        this._updateFloatingBadge();
    }

    _updateFloatingBadge() {
        let badge = document.getElementById('shima-floating-badge');

        if (this._wordList.length === 0) {
            if (badge) { badge.remove(); }
            return;
        }

        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'shima-floating-badge';
            badge.style.cssText = `
                position: fixed; bottom: 16px; right: 16px; z-index: 99998;
                background: linear-gradient(135deg, #4FC3F7, #0288D1);
                color: #fff; border-radius: 28px; padding: 10px 18px;
                font-size: 14px; font-weight: bold; cursor: pointer;
                box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                display: flex; align-items: center; gap: 8px;
                transition: transform 0.2s;
            `;
            badge.addEventListener('mouseenter', () => { badge.style.transform = 'scale(1.05)'; });
            badge.addEventListener('mouseleave', () => { badge.style.transform = 'scale(1)'; });
            badge.addEventListener('click', () => this._showListPopup());
            document.body.appendChild(badge);
        }

        badge.innerHTML = `🐦 ${this._wordList.length} word${this._wordList.length > 1 ? 's' : ''}`;
    }

    _showListPopup() {
        const existing = document.getElementById('shima-list-overlay');
        if (existing) { existing.remove(); }

        const overlay = document.createElement('div');
        overlay.id = 'shima-list-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.85); z-index: 99999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            cursor: pointer;
        `;
        overlay.addEventListener('click', () => overlay.remove());

        const card = document.createElement('div');
        card.style.cssText = `
            background: #1a1a2e; border-radius: 16px; padding: 20px;
            max-width: 380px; width: 90%; max-height: 80vh;
            cursor: default; border: 1px solid rgba(255,255,255,0.1);
            display: flex; flex-direction: column;
        `;
        card.addEventListener('click', (e) => e.stopPropagation());

        // Header
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;';

        const headerLeft = document.createElement('span');
        headerLeft.style.cssText = 'color: #fff; font-size: 16px; font-weight: bold;';
        headerLeft.textContent = '🐦 Shima Bird Export';

        const headerRight = document.createElement('div');
        headerRight.style.cssText = 'display: flex; align-items: center; gap: 8px;';

        const helpBtn = document.createElement('button');
        helpBtn.textContent = '?';
        helpBtn.style.cssText = `
            background: rgba(255,255,255,0.1); color: #aaa; border: none;
            border-radius: 50%; width: 24px; height: 24px; cursor: pointer;
            font-size: 13px; font-weight: bold;
        `;
        helpBtn.addEventListener('click', () => this._showHelp());

        const countSpan = document.createElement('span');
        countSpan.style.cssText = 'color: #aaa; font-size: 13px;';
        countSpan.textContent = `${this._wordList.length}/10`;

        headerRight.appendChild(helpBtn);
        headerRight.appendChild(countSpan);
        header.appendChild(headerLeft);
        header.appendChild(headerRight);

        // Word list
        const list = document.createElement('div');
        list.style.cssText = 'overflow-y: auto; flex: 1; margin-bottom: 16px;';
        this._renderWordList(list, overlay);

        // Buttons
        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display: flex; gap: 8px;';

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear All';
        clearBtn.style.cssText = `
            flex: 1; background: #e74c3c; color: #fff; border: none;
            border-radius: 10px; padding: 12px; cursor: pointer;
            font-size: 14px; font-weight: bold;
        `;
        clearBtn.addEventListener('click', () => {
            this._wordList = [];
            this._updateFloatingBadge();
            overlay.remove();
        });

        const qrBtn = document.createElement('button');
        qrBtn.textContent = 'Generate QR';
        qrBtn.disabled = this._wordList.length === 0;
        qrBtn.style.cssText = `
            flex: 2; background: linear-gradient(135deg, #4FC3F7, #0288D1);
            color: #fff; border: none; border-radius: 10px; padding: 12px;
            cursor: pointer; font-size: 14px; font-weight: bold;
            ${this._wordList.length === 0 ? 'opacity: 0.5; cursor: default;' : ''}
        `;
        qrBtn.addEventListener('click', () => {
            if (this._wordList.length === 0) { return; }
            overlay.remove();
            this._showQrPopup();
        });

        btnRow.appendChild(clearBtn);
        btnRow.appendChild(qrBtn);

        card.appendChild(header);
        card.appendChild(list);
        card.appendChild(btnRow);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
    }

    /**
     * @param {HTMLElement} container
     * @param {HTMLElement} overlay
     */
    _renderWordList(container, overlay) {
        container.innerHTML = '';
        for (let i = 0; i < this._wordList.length; i++) {
            const w = this._wordList[i];
            const row = document.createElement('div');
            row.style.cssText = `
                display: flex; align-items: center; padding: 10px 12px;
                background: rgba(255,255,255,0.05); border-radius: 10px;
                margin-bottom: 6px;
            `;

            const info = document.createElement('div');
            info.style.cssText = 'flex: 1; min-width: 0;';
            info.innerHTML = `
                <div style="color: #fff; font-size: 16px; font-weight: bold;">${w.w}
                    ${w.r ? `<span style="font-size: 12px; color: #aaa; font-weight: normal; margin-left: 6px;">${w.r}</span>` : ''}
                </div>
                <div style="color: #999; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${w.m}</div>
            `;

            const delBtn = document.createElement('button');
            delBtn.textContent = '✕';
            delBtn.style.cssText = `
                background: rgba(231,76,60,0.2); color: #e74c3c; border: none;
                border-radius: 8px; width: 32px; height: 32px; cursor: pointer;
                font-size: 14px; font-weight: bold; margin-left: 8px; flex-shrink: 0;
            `;
            delBtn.addEventListener('click', () => {
                this._wordList.splice(i, 1);
                this._updateFloatingBadge();
                if (this._wordList.length === 0) {
                    overlay.remove();
                } else {
                    this._renderWordList(container, overlay);
                    // Update header count
                    const countSpan = overlay.querySelector('span:last-child');
                    if (countSpan) { countSpan.textContent = `${this._wordList.length}/10`; }
                }
            });

            row.appendChild(info);
            row.appendChild(delBtn);
            container.appendChild(row);
        }

        if (this._wordList.length === 0) {
            container.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">No words added</div>';
        }
    }

    _showQrPopup() {
        const json = JSON.stringify(this._wordList);

        const existing = document.getElementById('shima-list-overlay');
        if (existing) { existing.remove(); }

        const overlay = document.createElement('div');
        overlay.id = 'shima-list-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.85); z-index: 99999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            cursor: pointer;
        `;
        overlay.addEventListener('click', () => overlay.remove());

        const card = document.createElement('div');
        card.style.cssText = `
            background: #1a1a2e; border-radius: 16px; padding: 24px;
            text-align: center; max-width: 320px; width: 90%;
            cursor: default; border: 1px solid rgba(255,255,255,0.1);
        `;
        card.addEventListener('click', (e) => e.stopPropagation());

        const title = document.createElement('div');
        title.textContent = `🐦 Scan with Shima Bird (${this._wordList.length} words)`;
        title.style.cssText = 'color: #fff; font-size: 15px; font-weight: bold; margin-bottom: 16px;';

        const qrContainer = document.createElement('div');
        qrContainer.style.cssText = `
            background: #fff; border-radius: 12px; padding: 16px;
            display: inline-block; margin: 8px 0;
        `;

        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display: flex; gap: 8px; margin-top: 16px; justify-content: center;';

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy JSON';
        copyBtn.style.cssText = `
            background: #4a4a6a; color: #fff; border: none; border-radius: 8px;
            padding: 8px 16px; cursor: pointer; font-size: 12px;
        `;
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(json).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy JSON'; }, 1500);
            });
        });

        const doneBtn = document.createElement('button');
        doneBtn.textContent = 'Done';
        doneBtn.style.cssText = `
            background: #27ae60; color: #fff; border: none; border-radius: 8px;
            padding: 8px 16px; cursor: pointer; font-size: 12px; font-weight: bold;
        `;
        doneBtn.addEventListener('click', () => {
            this._wordList = [];
            this._updateFloatingBadge();
            overlay.remove();
        });

        btnRow.appendChild(copyBtn);
        btnRow.appendChild(doneBtn);

        card.appendChild(title);
        card.appendChild(qrContainer);
        card.appendChild(btnRow);
        overlay.appendChild(card);
        document.body.appendChild(overlay);

        this._renderQr(qrContainer, json);
    }

    /**
     * @param {HTMLElement} container
     * @param {string} text
     */
    _renderQr(container, text) {
        const img = document.createElement('img');
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`;
        img.alt = 'QR Code';
        img.style.cssText = 'width: 220px; height: 220px;';
        img.onerror = () => {
            container.textContent = 'QR generation failed. Use Copy JSON instead.';
            container.style.cssText += 'color: #666; font-size: 12px; padding: 40px 16px;';
        };
        container.appendChild(img);
    }

    /**
     * @param {string} msg
     */
    _showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = `
            position: fixed; bottom: 60px; right: 16px; z-index: 99999;
            background: #e74c3c; color: #fff; padding: 8px 16px;
            border-radius: 8px; font-size: 13px; font-weight: bold;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    _showHelp() {
        const existing = document.getElementById('shima-help-overlay');
        if (existing) { existing.remove(); }

        const overlay = document.createElement('div');
        overlay.id = 'shima-help-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.85); z-index: 100000;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
        `;
        overlay.addEventListener('click', () => overlay.remove());

        const card = document.createElement('div');
        card.style.cssText = `
            background: #1a1a2e; border-radius: 16px; padding: 24px;
            max-width: 360px; width: 90%; cursor: default;
            border: 1px solid rgba(255,255,255,0.1);
        `;
        card.addEventListener('click', (e) => e.stopPropagation());

        card.innerHTML = `
            <div style="color: #fff; font-size: 17px; font-weight: bold; margin-bottom: 16px;">
                🐦 How to use Shimatan
            </div>
            <div style="color: #ddd; font-size: 13px; line-height: 1.8;">
                <div style="margin-bottom: 12px;">
                    <b style="color: #4FC3F7;">Step 1:</b> Hover over Japanese text on any webpage
                </div>
                <div style="margin-bottom: 12px;">
                    <b style="color: #4FC3F7;">Step 2:</b> Click the 🐦 button to add words to your export list (max 10)
                </div>
                <div style="margin-bottom: 12px;">
                    <b style="color: #4FC3F7;">Step 3:</b> Click the floating badge at bottom-right to review your list
                </div>
                <div style="margin-bottom: 12px;">
                    <b style="color: #4FC3F7;">Step 4:</b> Remove unwanted words with ✕, then tap <b>Generate QR</b>
                </div>
                <div style="margin-bottom: 12px;">
                    <b style="color: #4FC3F7;">Step 5:</b> Open <b>Shima Bird</b> app → Tools → <b>Yomitan Import</b> → Scan the QR code
                </div>
            </div>
            <button style="
                width: 100%; background: #4FC3F7; color: #fff; border: none;
                border-radius: 10px; padding: 10px; cursor: pointer;
                font-size: 14px; font-weight: bold; margin-top: 8px;
            ">Got it!</button>
        `;
        card.querySelector('button').addEventListener('click', () => overlay.remove());

        overlay.appendChild(card);
        document.body.appendChild(overlay);
    }

    /**
     * @param {import('dictionary').DictionaryEntry} entry
     * @returns {object}
     */
    _extractEntryData(entry) {
        if (entry.type === 'term') {
            const headword = entry.headwords[0] || {};
            const term = headword.term || '';
            const reading = headword.reading || '';

            const meanings = [];
            for (const def of entry.definitions || []) {
                for (const entry2 of def.entries || []) {
                    if (typeof entry2 === 'string') {
                        meanings.push(entry2);
                    } else if (entry2 && entry2.text) {
                        meanings.push(entry2.text);
                    }
                }
            }
            if (meanings.length === 0) {
                for (const def of entry.definitions || []) {
                    if (def.glosses) {
                        for (const g of def.glosses) {
                            if (typeof g === 'string') { meanings.push(g); }
                        }
                    }
                }
            }

            return {
                app: 'shima', v: 1,
                w: term,
                r: reading !== term ? reading : '',
                m: meanings.join('; '),
                p: this._extractPos(entry),
            };
        }

        if (entry.type === 'kanji') {
            const char = entry.character || '';
            const meanings = [];
            for (const def of entry.definitions || []) {
                if (typeof def === 'string') { meanings.push(def); }
            }
            return {
                app: 'shima', v: 1,
                w: char, r: '',
                m: meanings.join('; '),
                p: 'kanji',
            };
        }

        return {app: 'shima', v: 1, w: '', r: '', m: '', p: ''};
    }

    /**
     * @param {import('dictionary').DictionaryEntry} entry
     * @returns {string}
     */
    _extractPos(entry) {
        if (entry.type !== 'term') { return ''; }
        const tags = [];
        for (const headword of entry.headwords || []) {
            for (const tag of headword.tags || []) {
                if (tag.category === 'partOfSpeech') { tags.push(tag.name); }
            }
        }
        for (const def of entry.definitions || []) {
            for (const tag of def.tags || []) {
                if (tag.category === 'partOfSpeech') { tags.push(tag.name); }
            }
        }
        return [...new Set(tags)].join(', ');
    }

    /**
     * @param {number} index
     * @returns {?HTMLElement}
     */
    _getEntry(index) {
        const entries = this._display.dictionaryEntryNodes;
        return index >= 0 && index < entries.length ? entries[index] : null;
    }
}
