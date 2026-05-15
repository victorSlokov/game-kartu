/** * TUTORIAL LOGIC
 */
let currentStep = 0;
const tutorialSteps = [
    {
        text: "Tujuan utama game ini adalah menghabiskan kartu di tanganmu sebelum musuh menghabiskannya!",
        img: "karakter.gif"
    },
    {
        text: "Kamu bisa buang kartu jika **Warna** atau **Angka/Simbol**-nya sama dengan kartu di tumpukan PILE.",
        img: "karakter_nunjuk.gif"
    },
    {
        text: "Gunakan kartu **PEEK (👁)** untuk melihat kartu milik AI secara transparan. Ini rahasia kita ya!",
        img: "karakter_bisik.gif"
    },
    {
        text: "Setelah pakai PEEK, kamu bebas membuang kartu APA SAJA atau mengambil kartu baru dari DECK.",
        img: "karakter_oke.gif"
    },
    {
        text: "Hati-hati, AI juga punya kartu PEEK dan bisa mengintip kartumu! Selamat bermain!",
        img: "karakter_semangat.gif"
    }
];

function startTutorial() {
    currentStep = 0;
    document.getElementById('tutorial-overlay').style.display = 'flex';
    updateTutorialDOM();
}

function nextTutorialStep() {
    currentStep++;
    if (currentStep < tutorialSteps.length) {
        updateTutorialDOM();
    } else {
        closeTutorial();
    }
}

function updateTutorialDOM() {
    const step = tutorialSteps[currentStep];
    document.getElementById('tut-text').innerHTML = step.text;
    document.getElementById('tut-char-img').src = step.img;
    document.getElementById('tut-step').textContent = `${currentStep + 1} / ${tutorialSteps.length}`;
    
    if (currentStep === tutorialSteps.length - 1) {
        document.getElementById('tut-next-btn').textContent = "Mengerti!";
    } else {
        document.getElementById('tut-next-btn').textContent = "Lanjut";
    }
}

function closeTutorial() {
    const overlay = document.getElementById('tutorial-overlay');
    const content = overlay.querySelector('.tut-content'); // Ambil kotak kontennya
    
    // Tambahkan class animasi ke background
    overlay.classList.add('hide-tutorial');
    
    // Tambahkan class animasi mengecil ke kotak konten
    if (content) {
        content.classList.add('hide-content');
    }
    
    // Tunggu animasi selesai (300ms) baru hilangkan elemen secara total
    setTimeout(() => {
        overlay.style.display = 'none';
        
        // Bersihkan semua class animasi agar saat dibuka lagi sudah normal
        overlay.classList.remove('hide-tutorial');
        if (content) {
            content.classList.remove('hide-content');
        }
    }, 300);
}

function startTutorial() {
    currentStep = 0;
    const overlay = document.getElementById('tutorial-overlay');
    const content = overlay.querySelector('.tut-content');

    // Pastikan class animasi menutup sudah bersih sebelum dibuka
    overlay.classList.remove('hide-tutorial');
    if (content) {
        content.classList.remove('hide-content');
    }

    overlay.style.display = 'flex';
    updateTutorialDOM();
}

// Tambahkan integrasi ke sistem kartu (opsional)
// Contoh: Munculkan pesan saat pertama kali dapet kartu PEEK
function checkFirstTimePeek() {
    if (!localStorage.getItem('seenPeekTut')) {
        showToast("Tips: Gunakan PEEK untuk melihat strategi lawan!");
        localStorage.setItem('seenPeekTut', 'true');
    }
}

