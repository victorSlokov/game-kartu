/**
 * SETTINGS CONFIGURATION
 */
let GAME_SETTINGS = {
    initialHandSize: 7, // Jumlah kartu awal
    cardsToDraw: 1      // Jumlah kartu yang diambil saat klik Deck
};

function openSettings() {
    // Mengambil nilai saat ini untuk ditampilkan di input (opsional jika pakai UI)
    const newHand = prompt("Masukkan jumlah kartu awal (default: 7):", GAME_SETTINGS.initialHandSize);
    const newDraw = prompt("Masukkan jumlah kartu sekali ambil (default: 1):", GAME_SETTINGS.cardsToDraw);

    if (newHand !== null && !isNaN(newHand)) {
        GAME_SETTINGS.initialHandSize = parseInt(newHand);
    }
    if (newDraw !== null && !isNaN(newDraw)) {
        GAME_SETTINGS.cardsToDraw = parseInt(newDraw);
    }

    showToast("Pengaturan Disimpan!", "#4CAF50");
}