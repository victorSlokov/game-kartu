/** 
 * GAME CONFIG 
 */
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const SUITS = ['♥','♦','♣','♠'];

let G = {
    deck: [], playerHand: [], aiHand: [], 
    discardPile: [], turn: 'player',
    isPeekActive: false
};

/** 
 * CORE ENGINE 
 */
function startGame() {
    G.deck = [];
    // Generate Normal Cards
    for (let s of SUITS) {
        for (let r of RANKS) {
            G.deck.push({ rank: r, suit: s, id: Math.random(), isWild: false, type: 'normal' });
        }
    }
    
    // Add Skill Cards (PEEK)
    for(let i=0; i<3; i++) {
        G.deck.push({ rank: 'PEEK', suit: '👁', id: Math.random(), isWild: true, type: 'skill' });
    }
    
    shuffle(G.deck);
    
    // Deal Cards
    G.playerHand = G.deck.splice(0, 7);
    G.aiHand = G.deck.splice(0, 7);
    
    // Initial Discard (Must not be a skill card)
    let initial = G.deck.pop();
    while(initial.type === 'skill') {
        G.deck.unshift(initial);
        initial = G.deck.pop();
    }
    G.discardPile = [initial];
    G.isPeekActive = false;
    G.turn = 'player';

    showScreen('s-game');
    render();
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}

/** 
 * RENDERING 
 */
function render() {
    const aiHandEl = document.getElementById('ai-hand');
    const aiArea = document.getElementById('ai-area');
    
// 1. AI Hand Logic
    if (G.isPeekActive) {
        aiArea.classList.add('peek-active');
        aiHandEl.innerHTML = G.aiHand.map(c => renderCardHTML(c, false)).join('');
    } else {
        aiArea.classList.remove('peek-active');
        aiHandEl.innerHTML = G.aiHand.map(() => `<div class="card back" style="width:35px; height:50px; border-radius:5px"></div>`).join('');
    }

    // 2. Perbarui Angka Jumlah Kartu
    // Memperbarui angka sisa kartu di tumpukan pusat (Deck)
    const deckCtEl = document.getElementById('deck-ct');
    if (deckCtEl) deckCtEl.textContent = G.deck.length;

    // Memperbarui angka jumlah kartu di tangan AI
    document.getElementById('ai-ct').textContent = G.aiHand.length;

    // 3. Discard Pile (Kartu Terbuang)
    const top = G.discardPile[G.discardPile.length - 1];
    document.getElementById('discard-top').innerHTML = renderCardHTML(top, false);

    // 4. Player Hand (Kartu Kamu)
    document.getElementById('pl-hand').innerHTML = G.playerHand.map(c => renderCardHTML(c, true)).join('');
    
    updateStatus();
}

function renderCardHTML(c, isInteractable) {
    const isRed = c.suit === '♥' || c.suit === '♦';
    const clickAttr = isInteractable && G.turn === 'player' ? `onclick="handleCardClick('${c.id}')"` : '';
    let extraClass = '';
    
    if (c.type === 'skill') extraClass = 'skill-card';
    else if (c.rank === 'WILD') extraClass = 'joker-card';
    
    return `
        <div class="card ${extraClass}" ${clickAttr}>
            <span class="rank ${isRed ? 'red' : ''}">${c.rank}</span>
            <span class="suit ${isRed ? 'red' : ''}">${c.suit}</span>
        </div>
    `;
}

/** 
 * ACTIONS 
 */
function handleCardClick(cardId) {
    if(G.turn !== 'player') return;

    const idx = G.playerHand.findIndex(c => c.id == cardId);
    const card = G.playerHand[idx];
    const top = G.discardPile[G.discardPile.length - 1];

    if (card.rank === 'PEEK') {
        usePeekSkill(idx);
        return;
    }

    // Matching Logic
    if (card.rank === top.rank || card.suit === top.suit || card.isWild || top.rank === 'PEEK') {
        G.discardPile.push(G.playerHand.splice(idx, 1)[0]);
        G.isPeekActive = false; 
        render();
        
        if (!checkWin()) {
            G.turn = 'ai';
            setTimeout(aiTurn, 1000);
        }
    } else {
        showToast("Kartu tidak cocok!", "#E24B4A");
    }
}

function usePeekSkill(idx) {
    G.isPeekActive = true;
    G.discardPile.push(G.playerHand.splice(idx, 1)[0]);
    showToast("👁 PEEK AKTIF!", "#534AB7");
    render();
}

function drawCard() {
    if(G.turn !== 'player') return;
    
    if(G.deck.length === 0) {
        showToast("Dek habis!");
        return;
    }

    G.playerHand.push(G.deck.pop());
    G.isPeekActive = false;
    G.turn = 'ai';
    render();
    setTimeout(aiTurn, 800);
}

function aiTurn() {
    G.isPeekActive = false; 
    const top = G.discardPile[G.discardPile.length - 1];
    
    const playableIdx = G.aiHand.findIndex(c => 
        c.rank === top.rank || c.suit === top.suit || c.isWild || top.rank === 'PEEK'
    );

    if (playableIdx !== -1) {
        const card = G.aiHand.splice(playableIdx, 1)[0];
        G.discardPile.push(card);
        
        if(card.rank === 'PEEK') {
            showToast("AI menggunakan PEEK!");
            render();
            setTimeout(aiTurn, 1000); 
            return;
        }
    } else {
        if(G.deck.length > 0) G.aiHand.push(G.deck.pop());
    }

    if (!checkWin()) {
        G.turn = 'player';
        render();
    }
}

/** 
 * UI HELPERS 
 */
function checkWin() {
    if (G.playerHand.length === 0) { endGame(true); return true; }
    if (G.aiHand.length === 0) { endGame(false); return true; }
    return false;
}

function endGame(win) {
    showScreen('s-result');
    document.getElementById('res-ico').textContent = win ? '🏆' : '💀';
    document.getElementById('res-title').textContent = win ? 'Kamu Menang!' : 'AI Menang!';
}

function updateStatus() {
    const s = document.getElementById('status');
    s.textContent = G.turn === 'player' ? "Giliran Kamu" : "AI sedang berpikir...";
    s.className = G.turn === 'player' ? "status active" : "status";
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showToast(msg, bg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.background = bg || '#378ADD';
    t.style.opacity = 1;
    setTimeout(() => t.style.opacity = 0, 1500);
}


// --- FUNGSI BARU UNTUK ANIMASI GESER ---
function animateCard(startEl, endEl, cardObj, callback) {
    const startRect = startEl.getBoundingClientRect();
    const endRect = endEl.getBoundingClientRect();

    const ghost = document.createElement('div');
    ghost.className = `card anim-card ${cardObj.type === 'skill' ? 'skill-card' : (cardObj.isWild ? 'joker-card' : '')}`;
    
    const isRed = cardObj.suit === '♥' || cardObj.suit === '♦';
    ghost.innerHTML = cardObj.hideFace ? '' : `
        <span class="rank ${isRed ? 'red' : ''}">${cardObj.rank || ''}</span>
        <span class="suit ${isRed ? 'red' : ''}">${cardObj.suit || ''}</span>
    `;

    ghost.style.top = startRect.top + 'px';
    ghost.style.left = startRect.left + 'px';
    ghost.style.width = startRect.width + 'px';
    ghost.style.height = startRect.height + 'px';
    if (cardObj.hideFace) ghost.classList.add('back');

    document.body.appendChild(ghost);

    ghost.offsetHeight;

    // Tambahkan rotasi acak sedikit agar terlihat natural
    ghost.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
    ghost.style.top = endRect.top + 'px';
    ghost.style.left = endRect.left + 'px';

    setTimeout(() => {
        ghost.remove();
        if (callback) callback();
    }, 600);
}

// --- UPDATE HANDLE CLICK (PEMAIN BUANG KARTU) ---
function handleCardClick(cardId) {
    if(G.turn !== 'player') return;

    const idx = G.playerHand.findIndex(c => c.id == cardId);
    const card = G.playerHand[idx];
    const top = G.discardPile[G.discardPile.length - 1];

    if (card.rank === 'PEEK' || card.rank === top.rank || card.suit === top.suit || card.isWild || top.rank === 'PEEK') {
        const startEl = event.currentTarget;
        const endEl = document.getElementById('discard-top');

        // Jalankan animasi dulu
        animateCard(startEl, endEl, card, () => {
            // Setelah animasi selesai, baru update logika game
            if (card.rank === 'PEEK') {
                usePeekSkill(idx);
            } else {
                G.discardPile.push(G.playerHand.splice(idx, 1)[0]);
                G.isPeekActive = false;
                render();
                if (!checkWin()) {
                    G.turn = 'ai';
                    setTimeout(aiTurn, 600);
                }
            }
        });
        
        // Sembunyikan kartu asli selama animasi agar tidak terlihat double
        startEl.style.visibility = 'hidden'; 
    } else {
        showToast("Kartu tidak cocok!", "#E24B4A");
    }
}

// --- UPDATE DRAW CARD (AMBIL DARI DEK) ---
function drawCard() {
    if(G.turn !== 'player') return;
    if(G.deck.length === 0) return;

    const startEl = event.currentTarget; // Area DECK
    const plHandEl = document.getElementById('pl-hand');
    
    const newCard = G.deck.pop();

    // Buat elemen bayangan sementara untuk mendapatkan koordinat tujuan yang benar
    const tempDiv = document.createElement('div');
    tempDiv.className = 'card fan-card';
    tempDiv.style.visibility = 'hidden';
    plHandEl.appendChild(tempDiv);
    
    // Ambil koordinat tujuan (paling kanan di container tangan)
    const endRect = tempDiv.getBoundingClientRect();

    // Jalankan animasi dari DECK ke posisi baru di tangan
    animateToTarget(startEl, endRect, { ...newCard, hideFace: true }, () => {
        tempDiv.remove(); // Hapus elemen pembantu
        G.playerHand.push(newCard);
        G.isPeekActive = false;
        G.turn = 'ai';
        render(); // Render ulang akan menghitung ulang posisi kipas yang rapi
        setTimeout(aiTurn, 600);
    });
}

function updateStatus() {
    const textEl = document.getElementById('status-text');
    const charImg = document.getElementById('char-img');

    if (G.turn === 'player') {
        textEl.textContent = "Giliranmu! Pilih kartu.";
        // Pastikan file ini ada di folder yang sama
        charImg.src = "karakter.gif"; 
    } else {
        textEl.textContent = "Tunggu sebentar....";
        charImg.src = "karakter.gif";
    }
}

function showToast(msg, bg) {
    const t = document.getElementById('toast');
    const textEl = document.getElementById('status-text');
    const charImg = document.getElementById('char-img');

    t.textContent = msg;
    t.style.background = bg || '#378ADD';
    t.style.opacity = 1;

    // Feedback visual dengan GIF berbeda
    if (msg === "Kartu tidak cocok!") {
        textEl.textContent = "Kartumu salah coba yang lain";
        charImg.src = "refrensi.png"; 
    }

    setTimeout(() => {
        t.style.opacity = 0;
        updateStatus(); 
    }, 1500);
}


function cekOrientasi() {
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;

    if (isLandscape) {
        console.log("Layar sudah miring (Landscape)");
        // Jalankan logika game
    } else {
        console.log("Layar masih tegak (Portrait)");
        // Tampilkan pesan peringatan
    }
}


// Jalankan cek setiap kali layar diputar
window.addEventListener("resize", cekOrientasi);
/*tombol exit game*/


function animateToTarget(startEl, endRect, cardObj, callback) {
    const startRect = startEl.getBoundingClientRect();
    const ghost = document.createElement('div');
    
    ghost.className = `card anim-card ${cardObj.type === 'skill' ? 'skill-card' : (cardObj.isWild ? 'joker-card' : '')}`;
    if (cardObj.hideFace) ghost.classList.add('back');

    // Posisi awal di DECK
    ghost.style.top = startRect.top + 'px';
    ghost.style.left = startRect.left + 'px';
    ghost.style.width = startRect.width + 'px';
    ghost.style.height = startRect.height + 'px';

    document.body.appendChild(ghost);
    ghost.offsetHeight; // Trigger reflow

    // Gerakkan ke koordinat tangan pemain (kanan bawah)
    ghost.style.top = endRect.top + 'px';
    ghost.style.left = endRect.left + 'px';
    ghost.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;

    setTimeout(() => {
        ghost.remove();
        if (callback) callback();
    }, 600);
}