
// ===== WEBSITE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

async function initializeWebsite() {
    try {
        showLoadingScreen();
        
        // Initialize semua components
        await Promise.all([
            initializeAuth(),
            initializeMusicPlayer(),
            initializeNavigation(),
            initializeTutorials(),
            initializeAIChat(),
            initializeAnimations()
        ]);
        
        setTimeout(() => {
            hideLoadingScreen();
            showNotification('🎉 Website Fii Community siap!', 'success');
        }, 2000);
        
    } catch (error) {
        console.error('Error initializing website:', error);
        hideLoadingScreen();
        showNotification('⚠️ Beberapa fitur mungkin tidak berfungsi', 'warning');
    }
}

// ===== LOADING SCREEN =====
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) loadingScreen.style.display = 'flex';
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => loadingScreen.style.display = 'none', 500);
    }
}

// ===== FIREBASE AUTHENTICATION =====
let auth;

async function initializeAuth() {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyC4mZ4Xz7X9X9X9X9X9X9X9X9X9X9X9X9X9X9",
        authDomain: "fii-community.firebaseapp.com",
        projectId: "fii-community",
        storageBucket: "fii-community.appspot.com",
        messagingSenderId: "1234567890",
        appId: "1:1234567890:web:1234567890abcdef"
    };

    // Initialize Firebase hanya jika belum diinisialisasi
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    auth = firebase.auth();

    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const googleLogin = document.getElementById('googleLogin');
    const userMenu = document.getElementById('userMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    // Check auth state
    auth.onAuthStateChanged((user) => {
        if (user) {
            showUserMenu(user);
            showNotification(`👋 Welcome back, ${user.displayName || 'User'}!`, 'success');
        } else {
            hideUserMenu();
        }
    });

    // Login modal handlers
    if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
    if (closeModal) closeModal.addEventListener('click', hideLoginModal);
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) hideLoginModal();
        });
    }

    // Mobile menu handler
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Google Login
    if (googleLogin) {
        googleLogin.addEventListener('click', async () => {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                provider.addScope('profile');
                provider.addScope('email');
                
                await auth.signInWithPopup(provider);
                hideLoginModal();
                showNotification('✅ Login berhasil dengan Google!', 'success');
            } catch (error) {
                console.error('Google login error:', error);
                showNotification('❌ Login gagal. Coba lagi!', 'error');
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await auth.signOut();
                showNotification('👋 Logout berhasil!', 'info');
            } catch (error) {
                console.error('Logout error:', error);
                showNotification('❌ Logout gagal', 'error');
            }
        });
    }
}

function showUserMenu(user) {
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');

    if (loginBtn) loginBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    
    if (userAvatar && user.photoURL) {
        userAvatar.src = user.photoURL;
    }
    if (userName) userName.textContent = user.displayName || 'User';
}

function hideUserMenu() {
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (loginBtn) loginBtn.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
}

function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (navMenu) navMenu.classList.toggle('active');
    if (mobileMenuBtn) {
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    }
}

// ===== MUSIC PLAYER =====
function initializeMusicPlayer() {
    const audio = document.getElementById('main-audio');
    const playBtn = document.getElementById('play-btn');
    const progressFill = document.getElementById('progressFill');
    
    if (!audio || !playBtn) return;

    let isPlaying = false;
    
    // Auto-play dengan interaksi user
    const enableAutoPlay = () => {
        if (audio) {
            audio.play().then(() => {
                isPlaying = true;
                updatePlayButton();
            }).catch(() => {
                isPlaying = false;
                updatePlayButton();
            });
        }
    };

    // Tunggu interaksi user pertama
    document.addEventListener('click', function initAudio() {
        enableAutoPlay();
        document.removeEventListener('click', initAudio);
    }, { once: true });

    // Toggle play/pause
    function togglePlay() {
        if (!audio) return;
        
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(error => {
                console.log('Play failed:', error);
                showNotification('🎵 Musik sedang loading...', 'info');
            });
        }
        isPlaying = !isPlaying;
        updatePlayButton();
    }

    function updatePlayButton() {
        if (!playBtn) return;
        playBtn.innerHTML = isPlaying ? 
            '<i class="fas fa-pause"></i>' : 
            '<i class="fas fa-play"></i>';
    }

    // Event listeners
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    
    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            togglePlay();
        }
    });

    // Audio events
    if (audio) {
        audio.addEventListener('play', () => {
            isPlaying = true;
            updatePlayButton();
        });

        audio.addEventListener('pause', () => {
            isPlaying = false;
            updatePlayButton();
        });

        // Progress bar update
        audio.addEventListener('timeupdate', () => {
            if (progressFill && audio.duration) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = `${progress}%`;
            }
        });
    }

    // Simulasi previous/next
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showNotification('⏮️ Memutar track sebelumnya...', 'info');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showNotification('⏭️ Memutar track selanjutnya...', 'info');
        });
    }
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    // Smooth scrolling untuk nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu
                const navMenu = document.querySelector('.nav-menu');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (mobileMenuBtn) {
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
                
                // Smooth scroll
                const targetPosition = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link
                updateActiveNavLink(targetId);
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', throttle(updateNavOnScroll, 100));
}

function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = '#' + section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
}

// ===== TUTORIALS SYSTEM =====
function initializeTutorials() {
    // Pathway buttons
    const pathwayBtns = document.querySelectorAll('.pathway-btn');
    pathwayBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.pathway-card');
            const pathway = card.getAttribute('data-pathway');
            showPathwayDetails(pathway);
        });
    });

    // Quick tutorial items
    const tutorialItems = document.querySelectorAll('.tutorial-item');
    tutorialItems.forEach(item => {
        item.addEventListener('click', function() {
            const tutorial = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showTutorial(tutorial);
        });
    });

    // Download buttons
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const resource = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            downloadResource(resource);
        });
    });
}

function showPathwayDetails(pathway) {
    const pathwayTitles = {
        'frontend': 'Frontend Development',
        'backend': 'Backend Development', 
        'bot': 'Bot Development'
    };
    
    const messages = {
        'frontend': `🚀 **Frontend Development Pathway**

**Yang akan kamu pelajari:**
🎯 HTML5 & CSS3 Modern
🎯 JavaScript ES6+
🎯 React.js & Vue.js
🎯 Responsive Design
🎯 Web Performance
🎯 Git & GitHub

**Project yang akan dibuat:**
• Portfolio Website
• E-commerce Dashboard
• Social Media App
• Admin Dashboard

**Tools yang digunakan:**
• VS Code
• Chrome DevTools
• Figma untuk design
• GitHub untuk version control

Mau mulai belajar frontend development? Chat dengan BotFiiv12 untuk penjelasan detail!`,

        'backend': `🚀 **Backend Development Pathway**

**Yang akan kamu pelajari:**
🎯 Node.js & Express.js
🎯 MongoDB & MySQL
🎯 REST API Development
🎯 JWT Authentication
🎯 Web Security
🎯 Deployment

**Project yang akan dibuat:**
• REST API untuk aplikasi
• Authentication system
• Real-time chat app
• E-commerce backend

**Tools yang digunakan:**
• Node.js runtime
• MongoDB Atlas
• Postman untuk testing
• Heroku untuk deployment

Mau mulai belajar backend development? Chat dengan BotFiiv12 untuk penjelasan detail!`,

        'bot': `🚀 **Bot Development Pathway**

**Yang akan kamu pelajari:**
🎯 WhatsApp Bot dengan Baileys
🎯 Telegram Bot
🎯 Discord Bot
🎯 API Integration
🎯 Database untuk bot
🎯 Deployment bot

**Project yang akan dibuat:**
• WhatsApp Bot dengan berbagai fitur
• Telegram Bot untuk automation
• Discord Bot untuk komunitas
• Multi-platform bot

**Tools yang digunakan:**
• Node.js
• Baileys library
• MongoDB untuk data
• Railway/Render untuk hosting

Mau mulai belajar bot development? Chat dengan BotFiiv12 untuk penjelasan detail!`
    };
    
    const message = messages[pathway] || `🚀 Kamu memilih pathway: ${pathwayTitles[pathway]}!
    
Untuk memulai belajar ${pathwayTitles[pathway]}, kamu bisa:
1. Tanya BotFiiv12 tentang topik spesifik
2. Download resources yang tersedia
3. Join grup WhatsApp untuk bantuan langsung

Mau belajar apa tentang ${pathwayTitles[pathway]}?`;
    
    showNotification(message, 'info');
    
    // Scroll to tutorial section
    const tutorialSection = document.getElementById('tutorial');
    if (tutorialSection) {
        window.scrollTo({
            top: tutorialSection.offsetTop - 80,
            behavior: 'smooth'
        });
    }
} 

function showTutorial(tutorial) {
    const tutorialTitles = {
        'javascript-basic': 'JavaScript Dasar',
        'whatsapp-bot': 'Bot WhatsApp Basic', 
        'html-css': 'HTML & CSS Fundamentals',
        'nodejs': 'Node.js Pengenalan'
    };
    
    const messages = {
        'javascript-basic': `📚 **JavaScript Dasar - Quick Start**

**Variabel dan Tipe Data:**
\`\`\`javascript
// Variabel
let nama = "Fii";
const umur = 20;
var kota = "Medan";

// Tipe Data
let string = "Hello World";
let number = 42;
let boolean = true;
let array = [1, 2, 3];
let object = { nama: "Fii", umur: 20 };
\`\`\`

**Fungsi:**
\`\`\`javascript
// Function declaration
function sapa(nama) {
    return "Halo " + nama + "!";
}

// Arrow function
const tambah = (a, b) => a + b;

console.log(sapa("Rafi")); // Halo Rafi!
console.log(tambah(5, 3)); // 8
\`\`\`

**Struktur Kontrol:**
\`\`\`javascript
// If-else
let nilai = 85;
if (nilai >= 80) {
    console.log("Lulus dengan baik!");
} else {
    console.log("Coba lagi!");
}

// Loop
for (let i = 0; i < 5; i++) {
    console.log("Iterasi ke-" + i);
}
\`\`\`

Ingin belajar lebih dalam? Tanya BotFiiv12!`,

        'whatsapp-bot': `📚 **Bot WhatsApp Basic**

**Setup Dasar Bot:**
\`\`\`javascript
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (connection === 'open') {
            console.log('Bot terhubung!');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];
        if (!message.key.fromMe) {
            const text = message.message?.conversation;
            const sender = message.key.remoteJid;
            
            if (text === 'ping') {
                await sock.sendMessage(sender, { text: '🏓 Pong!' });
            }
        }
    });
}

startBot();
\`\`\`

**Package.json:**
\`\`\`json
{
  "name": "whatsapp-bot",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@whiskeysockets/baileys": "^6.5.0"
  }
}
\`\`\`

**Cara Menjalankan:**
\`\`\`bash
npm install
npm start
\`\`\`

Scan QR code yang muncul dengan WhatsApp!`,

        'html-css': `📚 **HTML & CSS Fundamentals**

**Struktur HTML Dasar:**
\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Pertamaku</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Selamat Datang</h1>
        <nav>
            <a href="#home">Home</a>
            <a href="#about">About</a>
        </nav>
    </header>
    
    <main>
        <section id="home">
            <h2>Halo Dunia!</h2>
            <p>Ini website pertama saya.</p>
        </section>
    </main>
</body>
</html>
\`\`\`

**CSS Dasar:**
\`\`\`css
/* Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    background-color: #f4f4f4;
}

header {
    background: #8B5FBF;
    color: white;
    padding: 1rem 0;
    text-align: center;
}

nav a {
    color: white;
    text-decoration: none;
    margin: 0 1rem;
}

nav a:hover {
    text-decoration: underline;
}

main {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}
\`\`\`

**Tips:**
- Gunakan semantic HTML
- CSS Grid & Flexbox untuk layout
- Responsive design dengan media queries`,

        'nodejs': `📚 **Node.js Pengenalan**

**Apa itu Node.js?**
- Runtime JavaScript di server
- Non-blocking I/O
- Event-driven architecture
- Package manager: npm

**Server HTTP Sederhana:**
\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('
        <html>
            <body>
                <h1>Hello from Node.js!</h1>
                <p>Server berjalan dengan sukses!</p>
            </body>
        </html>
    ');
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
\`\`\`

**Module System:**
\`\`\`javascript
// module.js
exports.sapa = function(nama) {
    return "Halo " + nama;
}

// app.js
const modul = require('./module.js');
console.log(modul.sapa("Fii"));
\`\`\`

**NPM Basics:**
\`\`\`bash
# Initialize project
npm init -y

# Install package
npm install express

# Install dev dependency
npm install --save-dev nodemon

# Run script
npm start
\`\`\`

Node.js perfect untuk backend dan tools development!`
    };
    
    const message = messages[tutorial] || `📚 Membuka tutorial: ${tutorialTitles[tutorial]}
    
Untuk tutorial lengkap "${tutorialTitles[tutorial]}", kamu bisa:
• Tanya BotFiiv12 untuk penjelasan detail
• Download resources terkait
• Pelajari contoh code yang diberikan

Ingin belajar ${tutorialTitles[tutorial]} lebih dalam?`;
    
    showNotification(message, 'info');
}

function downloadResource(resource) {
    const resourceNames = {
        'templates': 'Starter Templates Pack',
        'ebooks': 'E-Book Collection', 
        'tools': 'Development Tools'
    };
    
    const messages = {
        'templates': `📦 **Download: Starter Templates Pack**

**Yang termasuk:**
✅ WhatsApp Bot Base Template
✅ Express.js API Starter
✅ Frontend React Template
✅ Database Configuration
✅ Environment Variables Setup
✅ Deployment Configs

**Cara menggunakan:**
1. Download template yang diinginkan
2. Extract zip file
3. Run \`npm install\`
4. Setup environment variables
5. Run \`npm start\`

**Template tersedia untuk:**
• Bot Development
• Web Development  
• API Development
• Full Stack Apps

Untuk akses template lengkap, join grup WhatsApp Fii Community!`,

        'ebooks': `📦 **Download: E-Book Collection**
        
        **Daftar E-Book:**
📖 JavaScript Modern Guide (ID)
📖 Node.js Complete Handbook (ID)  
📖 Bot Development Bible (ID)
📖 Web Development Fundamentals (ID)
📖 API Design Patterns (EN)
📖 Clean Code Practices (EN)

**Format:**
• PDF (High Quality)
• EPUB (Mobile Friendly)
• Source Code Included
• Bahasa Indonesia & English

**Topik yang dicover:**
• Basic to Advanced Concepts
• Real-world Projects
• Best Practices
• Code Examples

E-book collection perfect untuk belajar mandiri!`,

        'tools': `📦 **Download: Development Tools Pack**

**VS Code Snippets:**
⚡ JavaScript/Node.js Snippets
⚡ React/Vue Snippets  
⚡ HTML/CSS Snippets
⚡ Bot Development Snippets

**Configuration Files:**
⚙️ VS Code Settings
⚙️ ESLint Configuration
⚙️ Prettier Config
⚙️ Git Ignore Templates

**Debugging Tools:**
🔧 Error Handling Utilities
🔧 Performance Monitor
🔧 API Testing Tools
🔧 Database Management

**Productivity Boosters:**
🚀 Code Generators
🚀 Project Templates
🚀 Automation Scripts
🚀 Deployment Helpers

Tools ini akan mempercepat development process!`
    };
    
    const message = messages[resource] || `📦 Download: ${resourceNames[resource]}
    
Download akan segera dimulai... 
(Sedang mengarahkan ke sumber download)

**Alternatif:**
• Tanya BotFiiv12 tentang resources ${resource}
• Check GitHub Fii untuk file terbaru
• Join grup WhatsApp untuk akses langsung

Tetap semangat belajar! 💪`;

    showNotification(message, 'info');
}

// ===== AI CHAT SYSTEM =====
function initializeAIChat() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const questionBtns = document.querySelectorAll('.question-btn');

    if (!chatMessages || !userInput || !sendBtn) return;

    // Predefined responses untuk AI (super cepat dan detail)
    const quickResponses = {
        'apa itu bahasa pemrograman?': `**Apa itu Bahasa Pemrograman?** 🤔

Bahasa pemrograman adalah bahasa yang digunakan untuk memberikan instruksi kepada komputer. Sama seperti manusia yang butuh bahasa untuk berkomunikasi, komputer butuh bahasa pemrograman untuk memahami apa yang kita inginkan.

**Jenis-jenis Bahasa Pemrograman:**

🔹 **Bahasa Tingkat Rendah** 
- Bahasa Mesin (binary: 0 dan 1)
- Assembly (lebih mudah dibaca manusia)

🔹 **Bahasa Tingkat Menengah**
- C, C++ (cepat dan powerful)

🔹 **Bahasa Tingkat Tinggi**
- JavaScript, Python, Java (mudah dipahami manusia)

**Contoh Sederhana:**
\`\`\`javascript
// JavaScript - Menampilkan pesan
console.log("Halo, Dunia!");

// Python - Perhitungan sederhana
hasil = 5 + 3
print(hasil)

// Java - Program sederhana
public class Halo {
    public static void main(String[] args) {
        System.out.println("Halo, Java!");
    }
}
\`\`\`

**Tips dari Fii:**
- Mulai dengan JavaScript karena mudah dan serbaguna
- Fokus memahami konsep dasar dulu
- Practice coding setiap hari
- Jangan takut membuat error!`,

        'cara membuat website sederhana?': `**Membuat Website Sederhana 🚀**

Berikut langkah-langkah membuat website pertama kamu:

**1. Buat file index.html**
\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Pertamaku</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Selamat Datang di Website Pertamaku!</h1>
        <nav>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>
    
    <main>
        <section id="home">
            <h2>Halo, Saya Fii!</h2>
            <p>Ini adalah website pertama saya menggunakan HTML dan CSS.</p>
            <button id="myButton">Klik Saya!</button>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 Website Pertamaku</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>
\`\`\`

**2. Buat file style.css**
\`\`\`css
/* Reset dasar */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    background-color: #f4f4f4;
}

header {
    background: linear-gradient(135deg, #8B5FBF, #6A0DAD);
    color: white;
    padding: 1rem 0;
    text-align: center;
}

nav {
    margin-top: 1rem;
}

nav a {
    color: white;
    text-decoration: none;
    margin: 0 1rem;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: background 0.3s;
}

nav a:hover {
    background: rgba(255,255,255,0.2);
}

main {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

button {
    background: #8B5FBF;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
}

button:hover {
    background: #6A0DAD;
}

footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 1rem 0;
    margin-top: 2rem;
}
\`\`\`

**3. Buat file script.js**
\`\`\`javascript
// Tambahkan interaksi sederhana
document.getElementById('myButton').addEventListener('click', function() {
    alert('Halo! Terima kasih sudah mengklik! 🎉');
    
    // Ubah teks button
    this.textContent = 'Terima Kasih!';
    this.style.background = '#00D26A';
});

// Animasi sederhana
const header = document.querySelector('header');
window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(139, 95, 191, 0.9)';
    } else {
        header.style.background = 'linear-gradient(135deg, #8B5FBF, #6A0DAD)';
    }
});
\`\`\`

**Cara Menjalankan:**
1. Simpan ketiga file dalam folder yang sama
2. Buka file index.html di browser
3. Website sederhana kamu siap! 🎊`,

        'cara membuat bot whatsapp?': `**Membuat Bot WhatsApp Sederhana 🤖**

Berikut tutorial lengkap membuat bot WhatsApp menggunakan Node.js:

**1. Setup Project**
\`\`\`bash
# Buat folder project
mkdir my-whatsapp-bot
cd my-whatsapp-bot

# Inisialisasi project
npm init -y

# Install dependencies
npm install @whiskeysockets/baileys qrcode-terminal
npm install nodemon --save-dev
\`\`\`

**2. Buat file index.js**
\`\`\`javascript
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

async function startBot() {
    // Setup authentication
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    
    // Create socket connection
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: { level: 'silent' } // Nonaktifkan log yang berisik
    });

    // Handle connection events
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('📱 Scan QR code berikut dengan WhatsApp:');
            qrcode.generate(qr, { small: true });
        }
        
        if (connection === 'open') {
            console.log('✅ Bot berhasil terhubung!');
            console.log('🤖 Bot siap menerima pesan...');
        }
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        }
    });

    // Handle incoming messages
    sock.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];
        if (!message.key.fromMe && m.type === 'notify') {
            const text = message.message?.conversation || 
                        message.message?.extendedTextMessage?.text || 
                        message.message?.imageMessage?.caption || '';
            const sender = message.key.remoteJid;
            
            // Simple command handler
            const command = text.toLowerCase().trim();
            
            switch(command) {
                case 'ping':
                    await sock.sendMessage(sender, { 
                        text: '🏓 Pong! Bot Fii aktif!' 
                    });
                    break;
                    
                case 'hai':
                case 'halo':
                case 'hello':
                    await sock.sendMessage(sender, { 
                        text: 'Halo! 👋 Saya bot created by Fii (RafiFirmansyah)! \n\nKetik "menu" untuk melihat daftar perintah.' 
                    });
                    break;
                    
                case 'menu':
                    const menuText = \`🤖 *BOT FII MENU*

📝 *Perintah yang tersedia:*
• ping - Test bot response
• hai - Sapaan bot
• menu - Tampilkan menu ini
• info - Informasi bot
• waktu - Lihat waktu sekarang
• creator - Info pembuat bot

💡 *Fitur:*
• Auto response
• Simple commands
• Easy to customize

_Semua perintah tidak case sensitive_\`;
                    
                    await sock.sendMessage(sender, { text: menuText });
                    break;
                    
                case 'info':
                    await sock.sendMessage(sender, { 
                        text: '🤖 *Bot Information*\n\nDibuat dengan ❤️ oleh Fii (RafiFirmansyah)\n\nGitHub: github.com/fixx12\nWhatsApp: +62 878-8192-8428' 
                    });
                    break;
                    
                case 'waktu':
                    const now = new Date();
                    const waktu = now.toLocaleString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                    await sock.sendMessage(sender, { 
                        text: \`🕒 Waktu sekarang: \${waktu}\` 
                    });
                    break;
                    
                case 'creator':
                    await sock.sendMessage(sender, { 
                        text: '👨‍💻 *Creator Info*\n\nNama: Fii (Rafi Firmansyah)\nSpecialty: Full Stack Developer & Bot Specialist\nGitHub: github.com/fixx12\nContact: +62 878-8192-8428' 
                    });
                    break;
                    
                default:
                    // Auto reply untuk pesan umum
                    if (text && !text.startsWith('/')) {
                        await sock.sendMessage(sender, { 
                            text: \`Hai! Saya menerima pesan kamu: "\${text}"\n\nKetik "menu" untuk melihat daftar perintah yang tersedia.\` 
                        });
                    }
            }
        }
    });
    
       // Save credentials
    sock.ev.on('creds.update', saveCreds);
}

// Handle errors
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start bot
startBot().catch(console.error);
\`\`\`

**3. Tambahkan script di package.json**
\`\`\`json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
\`\`\`

**4. Jalankan Bot**
\`\`\`bash
npm run dev
\`\`\`

**5. Scan QR Code**
- Buka WhatsApp di handphone
- Pergi ke Settings → Linked Devices → Link a Device
- Scan QR code yang muncul di terminal

**Tips dari Fii:**
- Simpan folder \`auth_info\` agar tidak perlu scan ulang
- Tambahkan fitur sesuai kebutuhan
- Selalu backup credentials
- Gunakan environment variables untuk data sensitif`,

        'apa perbedaan let, const, dan var?': `**Perbedaan let, const, dan var?** 🔍

Berikut perbedaan mendetail antara ketiganya:

**🔹 var (ES5)**
- Function scoped
- Bisa di-redeclare
- Hoisted
- Tidak ada block scope

**🔹 let (ES6+)**
- Block scoped  
- Tidak bisa di-redeclare
- Bisa di-reassign
- Hoisted tapi tidak di-initialize

**🔹 const (ES6+)**
- Block scoped
- Tidak bisa di-redeclare
- Tidak bisa di-reassign
- Harus langsung diassign nilai
- Untuk array/object, isinya masih bisa diubah

**Contoh Lengkap:**
\`\`\`javascript
// ✅ var - function scoped
function testVar() {
    var nama = "Fii";
    if (true) {
        var nama = "Rafi"; // ✅ Boleh redeclare
        console.log(nama); // "Rafi"
    }
    console.log(nama); // "Rafi" - terpengaruh block
}

// ✅ let - block scoped
function testLet() {
    let umur = 20;
    if (true) {
        let umur = 21; // ❌ Bukan redeclare, ini variable berbeda
        console.log(umur); // 21
    }
    console.log(umur); // 20 - tidak terpengaruh
}

// ✅ const - constant
function testConst() {
    const PI = 3.14;
    // PI = 3.15; // ❌ Error: Assignment to constant
    
    const user = { name: "Fii" };
    user.name = "Rafi"; // ✅ Boleh (mutation allowed)
    // user = {}; // ❌ Error (reassignment not allowed)
    
    const numbers = [1, 2, 3];
    numbers.push(4); // ✅ Boleh
    // numbers = []; // ❌ Error
}

// Hoisting example
console.log(x); // undefined (var di-hoist)
var x = 5;

console.log(y); // ❌ Error: Cannot access 'y' before initialization
let y = 10;
\`\`\`

**Best Practices dari Fii:**
1. Gunakan \`const\` sebanyak mungkin
2. Gunakan \`let\` kalau perlu reassign value
3. Hindari \`var\` untuk code modern
4. Always use strict mode`,

        'default': `Halo! 👋 Saya **BotFiiv12**, asisten AI canggih ciptaan **Fii (RafiFirmansyah)**! 

Saya siap membantu kamu belajar programming dan bot development. Berikut yang bisa saya bantu:

🎯 **JavaScript & Node.js** - Fundamental sampai advanced
🤖 **Bot Development** - WhatsApp, Telegram, Discord  
🔧 **Web Development** - Frontend & Backend
🚀 **API Integration & Development**
💡 **Problem Solving & Debugging**
📚 **Best Practices & Coding Standards**

**Contoh pertanyaan yang bisa kamu tanyakan:**
• "Apa itu bahasa pemrograman?"
• "Cara membuat website sederhana?"
• "Cara membuat bot WhatsApp?"
• "Apa perbedaan let, const, dan var?"
• "Bagaimana kerja asynchronous di JavaScript?"
• "Apa itu Express.js dan cara penggunaannya?"

Jangan ragu untuk bertanya apapun! Saya di sini untuk membuat belajar programming jadi lebih mudah dan menyenangkan! 🚀

*"Bersama Fii, jadi developer handal itu mudah!"* ✨`
    };

    // Send message function
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message
        addMessageToChat(message, 'user');
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate AI thinking (instant response)
        setTimeout(() => {
            removeTypingIndicator();
            
            // Get AI response
            const aiResponse = getAIResponse(message);
            addMessageToChat(aiResponse, 'bot');
        }, 800); // Fast response time
    }

    // Get AI response (instant dengan predefined responses)
    function getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Cari response yang cocok
        for (const [key, response] of Object.entries(quickResponses)) {
            if (lowerMessage.includes(key.toLowerCase().replace('?', '').replace('apa', '').replace('bagaimana', '').trim())) {
                return response;
            }
        }
        
        // Default response
        return quickResponses.default;
    }

    // Add message to chat
    function addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarIcon = sender === 'user' ? 'fa-user' : 'fa-robot';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${avatarIcon}"></i>
            </div>
            <div class="message-content">
                <p>${formatMessage(message)}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollChatToBottom();
        
        // Add animation
        messageDiv.style.animation = 'messageSlide 0.3s ease-out';
    }

    // Format message dengan basic markdown
    function formatMessage(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\`\`\`([^`]+)\`\`\`/g, '<pre><code>$1</code></pre>')
            .replace(/\`([^`]+)\`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    // Typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p><i class="fas fa-ellipsis-h"></i> BotFiiv12 sedang mengetik...</p>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        scrollChatToBottom();
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Scroll chat to bottom
    function scrollChatToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Quick question buttons
    questionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            userInput.value = question;
            sendMessage();
        });
    });
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer untuk scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements untuk animation
    const animatableElements = document.querySelectorAll(
        '.hero-content, .profile-section, .pathway-card, .resource-card, .lesson-card, .tutorial-item'
    );

    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Floating shapes animation
    animateFloatingShapes();
}

function animateFloatingShapes() {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.animation = `float ${6 + index * 2}s ease-in-out infinite`;
    });
}

// ===== UTILITY FUNCTIONS =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        info: 'fa-info-circle',
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ===== GLOBAL FUNCTIONS =====
// Functions yang bisa dipanggil dari HTML
window.showLoginModal = showLoginModal;
window.showPathway = showPathwayDetails;
window.showTutorial = showTutorial;
window.downloadResource = downloadResource;

// ===== PERFORMANCE OPTIMIZATIONS =====
// Preload critical resources
function preloadResources() {
    const links = [
        'https://raw.githubusercontent.com/fixx12/background-/54c420bc122baed334dee6c7fa02816d1cf795e2/IMG-20250928-WA0557.jpg',
        'https://raw.githubusercontent.com/fixx12/dj/5dccf474346ab568cec684922fb96b3504b0bb23/dj.mp3',
        'https://raw.githubusercontent.com/fixx12/-/main/IMG-20250802-WA0143.jpg'
    ];
    
    links.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = href.includes('.jpg') ? 'image' : 'audio';
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadResources();

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

console.log('✨ Fii Community - Ultimate Edition Loaded!');
console.log('🎯 Created with ❤️ by RafiFirmansyah (Fii)');
console.log('🚀 Features: Firebase Auth, AI Chat, Music Player, Mobile Optimized');
