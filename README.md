# Rawr Baileys Bot

Starter bot WhatsApp berbasis JavaScript dan Baileys. Pairing code diminta saat bot dijalankan dan ditampilkan hanya di terminal lokal. Tiap pengguna menghubungkan nomor WhatsApp miliknya sendiri; nomor tidak ditanamkan di source code.

## Persyaratan

- Node.js 20 atau lebih baru
- WhatsApp di ponsel yang akan ditautkan

## Instalasi dan jalankan

```bash
npm install
npm start
```

Masukkan nomor dengan kode negara, angka saja (contoh format: `62812...`). Buka WhatsApp → **Perangkat tertaut** → **Tautkan dengan nomor telepon**, lalu masukkan pairing code yang tampil di terminal.

Bot menyimpan kredensial sesi di `auth_info_baileys/` agar tidak perlu pairing setiap kali restart. Folder ini diabaikan Git; jangan unggah atau bagikan folder tersebut, pairing code, atau file sesi. Untuk menautkan ulang, hapus folder itu secara lokal lalu jalankan ulang.

## Perintah bawaan

- `ping` atau `.ping` — balasan status `Pong!`
- `menu` atau `.menu` — daftar perintah

Contoh ini hanya memproses pesan masuk untuk perintah yang dikenali dan tidak mencatat isi pesan ke console.

## Protocol / protobuf

Lihat [`src/proto/README.md`](src/proto/README.md). Baileys mengelola implementasi protokol dan definisi/generated protobuf yang digunakannya. File `.proto` kosong atau buatan sendiri tidak membuat bot kompatibel dengan semua versi WhatsApp; pembaruan protokol harus mengikuti sumber resmi/upstream Baileys dan lisensinya.
