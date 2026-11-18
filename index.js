const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');
const pino = require('pino');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = require('@whiskeysockets/baileys');

const AUTH_DIR = 'auth_info_baileys';
const logger = pino({ level: 'silent' });
let pairingCodeRequested = false;

function normalizePhoneNumber(value) {
  const phone = String(value || '').replace(/[^\d]/g, '');
  if (!/^\d{8,15}$/.test(phone)) {
    throw new Error('Nomor tidak valid. Gunakan format internasional dengan kode negara, angka saja (8–15 digit), contoh 62812...');
  }
  return phone;
}

async function askPhoneNumber() {
  if (process.env.PHONE_NUMBER) {
    return normalizePhoneNumber(process.env.PHONE_NUMBER);
  }

  // Panel hosting umumnya tidak menyediakan terminal interaktif.
  if (!stdin.isTTY) {
    throw new Error('Atur environment variable PHONE_NUMBER di panel (format internasional, angka saja), lalu restart server.');
  }

  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    const answer = await rl.question('Nomor WhatsApp (format internasional, angka saja; contoh 62812...): ');
    return normalizePhoneNumber(answer);
  } finally {
    rl.close();
  }
}

function getText(message) {
  const content = message?.message;
  return content?.conversation
    || content?.extendedTextMessage?.text
    || content?.imageMessage?.caption
    || content?.videoMessage?.caption
    || '';
}

async function startBot(phoneNumber) {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const socket = makeWASocket({
    auth: state,
    logger,
    printQRInTerminal: false,
    browser: ['Rawr Baileys Bot', 'Chrome', '1.0.0'],
  });

  socket.ev.on('creds.update', saveCreds);

  socket.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'connecting') console.log('Menghubungkan ke WhatsApp...');
    if (connection === 'open') console.log('Bot berhasil terhubung ke WhatsApp.');

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode === DisconnectReason.loggedOut) {
        console.log('Sesi logout. Hapus folder auth_info_baileys lalu jalankan ulang untuk pairing lagi.');
        process.exitCode = 1;
        return;
      }
      console.log('Koneksi terputus; mencoba menghubungkan kembali...');
      setTimeout(() => startBot(phoneNumber).catch((error) => {
        console.error('Gagal memulai ulang bot:', error.message);
      }), 2000);
    }

    // Pairing code dibuat lokal dan hanya ditampilkan di console pemilik server.
    if (!state.creds.registered && !pairingCodeRequested && connection === 'connecting') {
      pairingCodeRequested = true;
      try {
        const code = await socket.requestPairingCode(phoneNumber);
        console.log(`\nKode pairing WhatsApp: ${code}`);
        console.log('Masukkan di WhatsApp > Perangkat tertaut > Tautkan dengan nomor telepon. Jangan bagikan kode ini.\n');
      } catch (error) {
        pairingCodeRequested = false;
        console.error('Tidak dapat meminta pairing code:', error.message);
      }
    }
  });

  socket.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const message of messages) {
      if (!message?.message || message.key.fromMe) continue;
      const text = getText(message).trim().toLowerCase();
      if (text === 'ping' || text === '.ping') {
        await socket.sendMessage(message.key.remoteJid, { text: 'Pong! Bot aktif ✅' }, { quoted: message });
      } else if (text === 'menu' || text === '.menu') {
        await socket.sendMessage(message.key.remoteJid, {
          text: '*Menu*\n• ping — cek status bot\n• menu — tampilkan menu',
        }, { quoted: message });
      }
    }
  });
}

async function main() {
  console.log('=== Rawr Baileys Bot ===');
  console.log('Pairing code akan tampil di console server; jangan bagikan kode atau folder sesi.');
  const phoneNumber = await askPhoneNumber();
  await startBot(phoneNumber);
}

main().catch((error) => {
  console.error('Bot gagal dijalankan:', error.message);
  process.exitCode = 1;
});
