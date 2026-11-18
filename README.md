# Rawr Baileys Bot

Starter bot WhatsApp berbasis JavaScript dan Baileys resmi (`@whiskeysockets/baileys`). Pairing code diminta saat bot dijalankan dan ditampilkan hanya di console server. Tiap pengguna menghubungkan nomor WhatsApp miliknya sendiri; nomor tidak ditanamkan di source code.

## Persyaratan

- Node.js 20 atau lebih baru
- WhatsApp di ponsel yang akan ditautkan

## Instalasi lokal

```bash
npm install
npm start
```

Masukkan nomor dengan kode negara, angka saja (contoh format: `62812...`). Buka WhatsApp → **Perangkat tertaut** → **Tautkan dengan nomor telepon**, lalu masukkan pairing code yang tampil di console.

## Deploy ke Pterodactyl

1. Buat server dengan egg Node.js dan Node 20 atau lebih baru.
2. Isi **Startup Command** dengan `npm start` (install dependency dengan `npm install`, atau gunakan install command egg).
3. Tambahkan environment variable `PHONE_NUMBER` berisi nomor yang akan ditautkan dalam format internasional angka saja, misalnya `62812...` (jangan memakai `+`, spasi, atau tanda hubung).
4. Start server. Pairing code akan tampil di console Pterodactyl; masukkan kode di WhatsApp → **Perangkat tertaut** → **Tautkan dengan nomor telepon**.
5. Pastikan direktori `auth_info_baileys/` berada di storage persisten server. Direktori ini menyimpan sesi supaya tidak perlu pairing setiap restart. Jangan bagikan atau unggah folder ini.

Tanpa `PHONE_NUMBER`, bot akan meminta input interaktif hanya saat dijalankan di terminal lokal. Pada panel non-interaktif, bot berhenti dengan pesan konfigurasi yang jelas.

## Dukungan nomor

Nomor dimasukkan dalam format internasional E.164 tanpa tanda `+`, dengan panjang 8–15 digit. Format ini mencakup format nomor dari berbagai negara, tetapi tidak menjamin layanan WhatsApp tersedia untuk setiap nomor/negara atau bahwa pairing selalu diizinkan. Ketersediaan bergantung pada WhatsApp, akun, dan jaringan/server hosting.

## Perintah bawaan

- `ping` atau `.ping` — balasan status `Pong!`
- `menu` atau `.menu` — daftar perintah

Contoh ini hanya memproses pesan masuk untuk perintah yang dikenali dan tidak mencatat isi pesan ke console.

## Nama paket Baileys

Dependency tetap memakai `@whiskeysockets/baileys`, yaitu nama paket library yang dipakai kode ini. Nama npm seperti `@rawrvip/baileys` hanya dapat dipakai jika akun/org `rawrvip` memiliki namespace npm tersebut dan paket fork Baileys memang dipublikasikan di sana; nama itu tidak bisa dibuat hanya dengan mengubah nama aplikasi bot.

## Protocol / protobuf

Lihat [`src/proto/README.md`](src/proto/README.md). Baileys mengelola implementasi protokol dan definisi/generated protobuf yang digunakannya. File `.proto` kosong atau buatan sendiri tidak membuat bot kompatibel dengan semua versi WhatsApp; pembaruan protokol harus mengikuti sumber resmi/upstream Baileys dan lisensinya.
