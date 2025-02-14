# Realtime Chat App

Aplikasi **Realtime Chat** menggunakan **Python Flask** dan **WebSockets** (Flask-SocketIO). Aplikasi ini memungkinkan komunikasi real-time antar pengguna dengan sistem autentikasi dan manajemen sesi.

## 🚀 Fitur

- Realtime chat menggunakan **Flask-SocketIO**
- Autentikasi pengguna (**Login & Register**)
- Manajemen pengguna online
- Notifikasi suara untuk pesan masuk
- Sistem admin untuk mengelola pengguna dan chat
- Tampilan UI menggunakan **Tailwind CSS**
- Dukungan emoji dalam chat

## 🛠️ Teknologi yang Digunakan

- **Python 3** (Flask, Flask-SocketIO)
- **SQLite** (Database bawaan)
- **JavaScript (Socket.IO)**
- **Tailwind CSS** (UI)

## 📦 Instalasi & Menjalankan Aplikasi

### 1️⃣ Clone Repository

```bash
git clone https://github.com/username/realtime-chat.git
cd realtime-chat
python app.py
```

### On PowerShell Or Terminal CLI ord CMD

```bash
python -m venv venv
source venv/bin/activate  # Untuk macOS/Linux
venv\Scripts\activate  # Untuk Windows

pip install -r requirements.txt
```

Aplikasi akan berjalan di http://127.0.0.1:5000/
🔧 Struktur Direktori

```bash
/realtime-chat
│── /static/ # Folder untuk file statis (CSS, JS, dll)
│── /templates/ # Folder untuk template HTML
│── /sockets/ # Folder event socket
│── /models.py # Model database
│── /routes.py # Routing aplikasi
│── /config.py # Konfigurasi aplikasi
│── /run.py # Entry point aplikasi
│── /requirements.txt # Dependencies
│── /README.md # Dokumentasi
```

🤝 Kontribusi

Jika ingin berkontribusi, silakan fork repo ini dan buat pull request.
📧 Kontak

📌 Author: Puji Ermanto  
📩 Email: pujiermanto@gmail.com  
<a href='https://ko-fi.com/J3J81AEG3V' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

---

Silakan ganti **"username"** dengan username GitHub Anda pada link clone repository di atas. Jika ada tambahan fitur, bisa diperbarui sesuai kebutuhan. 🚀
