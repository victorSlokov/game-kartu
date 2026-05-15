// Fungsi transisi layar yang lebih halus
function showScreen(nextId) {
    const currentScreen = document.querySelector('.screen.active');
    
    if (currentScreen) {
        // Tambahkan class animasi keluar
        currentScreen.classList.add('screen-exit');
        
        // Tunggu animasi keluar selesai (400ms) baru pindah layar
        setTimeout(() => {
            currentScreen.classList.remove('active', 'screen-exit');
            const nextScreen = document.getElementById(nextId);
            nextScreen.classList.add('active');
        }, 400);
    } else {
        // Jika tidak ada layar aktif (awal main), langsung munculkan
        document.getElementById(nextId).classList.add('active');
    }
}

// Fungsi untuk tombol Exit
// Fungsi untuk tombol Exit
function exitGame() {
    if (confirm("Apakah kamu ingin keluar dan kembali ke menu utama?")) {
        showScreen('s-title');
        // location.reload() DIHAPUS agar tidak terjadi reset kasar/putih sesaat
    }
}
/** * MODIFIKASI FUNGSI YANG SUDAH ADA 
 */

// Update endGame agar layar result muncul dengan animasi
function endGame(win) {
    // Berikan sedikit delay agar pemain bisa melihat kartu terakhir yang dibuang
    setTimeout(() => {
        showScreen('s-result');
        document.getElementById('res-ico').textContent = win ? '🏆' : '💀';
        document.getElementById('res-title').textContent = win ? 'Kamu Menang!' : 'AI Menang!';
    }, 800);
}

// Update startGame agar transisi dari Title ke Game ada animasinya
function startGame() {
    // 1. Reset data game secara internal (Logika Reset)
    G.deck = [];
    G.playerHand = [];
    G.aiHand = [];
    G.discardPile = [];
    G.isPeekActive = false;
    G.turn = 'player';

    // 2. Generate ulang deck (seperti kode awalmu)
    for (let s of SUITS) {
        for (let r of RANKS) {
            G.deck.push({ rank: r, suit: s, id: Math.random(), isWild: false, type: 'normal' });
        }
    }
    for(let i=0; i<3; i++) {
        G.deck.push({ rank: 'PEEK', suit: '👁', id: Math.random(), isWild: true, type: 'skill' });
    }
    
    shuffle(G.deck);
    
    // 3. Bagi kartu baru
    G.playerHand = G.deck.splice(0, 7);
    G.aiHand = G.deck.splice(0, 7);
    
    let initial = G.deck.pop();
    while(initial.type === 'skill') {
        G.deck.unshift(initial);
        initial = G.deck.pop();
    }
    G.discardPile = [initial];

    // 4. Baru pindah layar dengan animasi
    showScreen('s-game');
    render();
}