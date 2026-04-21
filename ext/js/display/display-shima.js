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
        button.innerHTML = '<span class="action-icon" style="font-size: 16px;">🐦</span><span style="font-size: 11px; margin-left: 2px;">Shima</span>';
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

        const data = this._extractEntryData(entries[index], index);

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
            background: #1a1a2e; z-index: 99999;
            overflow-y: auto; padding: 16px;
        `;

        const card = document.createElement('div');
        card.style.cssText = `
            text-align: center; max-width: 320px; margin: 0 auto;
        `;

        const title = document.createElement('div');
        title.textContent = `🐦 Scan with Shima Bird (${this._wordList.length} words)`;
        title.style.cssText = 'color: #fff; font-size: 15px; font-weight: bold; margin-bottom: 12px;';

        const qrContainer = document.createElement('div');
        qrContainer.style.cssText = `
            background: #fff; border-radius: 12px; padding: 12px;
            display: inline-block; margin: 4px 0;
        `;

        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display: flex; gap: 6px; margin-top: 10px; justify-content: center;';

        const backBtn = document.createElement('button');
        backBtn.textContent = '← Back';
        backBtn.style.cssText = `
            background: rgba(255,255,255,0.1); color: #fff; border: none; border-radius: 8px;
            padding: 8px 16px; cursor: pointer; font-size: 12px;
        `;
        backBtn.addEventListener('click', () => {
            overlay.remove();
            this._showListPopup();
        });

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy JSON';
        copyBtn.style.cssText = `
            background: #4a4a6a; color: #fff; border: none; border-radius: 8px;
            padding: 8px 16px; cursor: pointer; font-size: 12px;
        `;
        copyBtn.addEventListener('click', () => {
            try {
                const ta = document.createElement('textarea');
                ta.value = json;
                ta.style.cssText = 'position:fixed;left:-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy JSON'; }, 1500);
            } catch (_) {
                copyBtn.textContent = 'Failed';
            }
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

        btnRow.appendChild(backBtn);
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
        if (typeof globalThis.QRCodeLib === 'undefined') {
            container.textContent = 'QR library not loaded. Use Copy JSON.';
            container.style.cssText += 'color: #666; font-size: 12px; padding: 40px 16px;';
            return;
        }
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'width: 220px; height: 220px;';
        globalThis.QRCodeLib.toCanvas(canvas, text, {
            width: 220,
            margin: 2,
            errorCorrectionLevel: 'M',
        }, (err) => {
            if (err) {
                container.textContent = 'QR failed. Use Copy JSON.';
                container.style.cssText += 'color: #666; font-size: 12px; padding: 40px 16px;';
            } else {
                container.appendChild(canvas);
            }
        });
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
            background: #1a1a2e; z-index: 100000;
            overflow-y: auto; padding: 16px;
        `;

        overlay.innerHTML = `
            <div style="max-width: 360px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <span style="color: #fff; font-size: 16px; font-weight: bold;">🐦 How to use</span>
                    <button id="shima-help-close" style="
                        background: rgba(255,255,255,0.1); color: #fff; border: none;
                        border-radius: 8px; padding: 6px 12px; cursor: pointer; font-size: 13px;
                    ">✕ Close</button>
                </div>
                <div style="color: #ddd; font-size: 13px; line-height: 1.8;">
                    <div style="margin-bottom: 10px;"><b style="color: #4FC3F7;">1.</b> Hover over Japanese text</div>
                    <div style="margin-bottom: 10px;"><b style="color: #4FC3F7;">2.</b> Click 🐦 to add words (max 10)</div>
                    <div style="margin-bottom: 10px;"><b style="color: #4FC3F7;">3.</b> Click the floating badge to review</div>
                    <div style="margin-bottom: 10px;"><b style="color: #4FC3F7;">4.</b> Remove unwanted words with ✕</div>
                    <div style="margin-bottom: 10px;"><b style="color: #4FC3F7;">5.</b> Tap <b>Generate QR</b></div>
                    <div style="margin-bottom: 10px;"><b style="color: #4FC3F7;">6.</b> Open Shima Bird → Tools → Yomitan Import → Scan</div>
                </div>
            </div>
        `;
        overlay.querySelector('#shima-help-close').addEventListener('click', () => overlay.remove());

        document.body.appendChild(overlay);
    }

    /**
     * @param {import('dictionary').DictionaryEntry} entry
     * @returns {object}
     */
    _extractEntryData(entry, nodeIndex) {
        if (entry.type === 'term') {
            const headword = entry.headwords[0] || {};
            const term = headword.term || '';
            const reading = headword.reading || '';

            const meanings = [];
            // Collect tag/dict names to strip from text
            const skipWords = new Set();
            for (const def of entry.definitions || []) {
                if (def.dictionary) { skipWords.add(def.dictionary); }
                for (const tag of def.tags || []) {
                    if (tag.name) { skipWords.add(tag.name); }
                    if (tag.content) { skipWords.add(tag.content); }
                }
            }
            for (const hw of entry.headwords || []) {
                for (const tag of hw.tags || []) {
                    if (tag.name) { skipWords.add(tag.name); }
                }
            }
            // Extract from rendered DOM — target glossary li elements directly
            const entryNodes = this._display.dictionaryEntryNodes;
            if (entryNodes && nodeIndex >= 0 && nodeIndex < entryNodes.length) {
                const node = entryNodes[nodeIndex];
                const glossLis = node.querySelectorAll('[data-sc-content="glossary"] li');
                for (const li of glossLis) {
                    const t = li.textContent.trim();
                    if (t && !meanings.includes(t)) { meanings.push(t); }
                }
                // Fallback: plain gloss-content if no structured content
                if (meanings.length === 0) {
                    const glossItems = node.querySelectorAll('.gloss-content');
                    for (const el of glossItems) {
                        const t = el.textContent.trim();
                        if (t && !meanings.includes(t)) { meanings.push(t); }
                    }
                }
            }

            // Extract POS from rendered DOM
            let pos = '';
            if (entryNodes && nodeIndex >= 0 && nodeIndex < entryNodes.length) {
                const node = entryNodes[nodeIndex];
                const posEls = node.querySelectorAll('[data-sc-content="part-of-speech-info"]');
                const posSet = new Set();
                for (const el of posEls) {
                    const t = el.textContent.trim();
                    if (t) { posSet.add(t); }
                }
                pos = [...posSet].join(', ');
            }

            return {
                app: 'shima', v: 1,
                w: term,
                r: reading !== term ? reading : '',
                m: meanings.join('; '),
                p: pos,
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
     * @param {*} g - TermGlossaryContent (string | {type:'text',text} | {type:'structured-content',content} | array)
     * @returns {string}
     */
    _extractGlossText(g) {
        if (typeof g === 'string') { return g; }
        if (!g) { return ''; }
        if (g.type === 'text') { return g.text || ''; }
        if (g.type === 'structured-content') {
            return this._extractStructuredText(g.content);
        }
        if (Array.isArray(g)) {
            // Deinflection tuple [uninflected, rules[]]
            if (g.length >= 1 && typeof g[0] === 'string') { return g[0]; }
        }
        return '';
    }

    /**
     * @param {*} content - StructuredContent (string | object | array)
     * @returns {string}
     */
    _extractStructuredText(content) {
        if (typeof content === 'string') { return content; }
        if (Array.isArray(content)) {
            return content.map((c) => this._extractStructuredText(c)).filter(Boolean).join(' ');
        }
        if (content && typeof content === 'object') {
            if (content.type === 'image') { return ''; }
            // Skip tag-like elements (data-sc-content="tag")
            if (content.data && content.data['sc-content'] === 'tag') { return ''; }
            if (content.content) { return this._extractStructuredText(content.content); }
            if (content.tag === 'br') { return ' '; }
        }
        return '';
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
