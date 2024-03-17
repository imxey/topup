const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/purchase', (req, res) => {
    const { nama, server, id, noHp, paket } = req.body;

    // Kirim pesan WhatsApp
    const client = twilio('ACe40eafd88c762b4ffd88e12955c87143', '1df0e277bf97bbf32d34c8ecfa5a8901');
    const twilioNumber = '+14155238886';
    const userPhoneNumber = '+6281211499250'; // Nomor WhatsApp pengguna
    const purchaseDetails = `Nama: ${nama}\n ID: ${id}(${server})\n Nomor: wa.me/${noHp}\n Item: ${paket}`;

    client.messages.create({
        from: `whatsapp:${twilioNumber}`,
        to: `whatsapp:${userPhoneNumber}`,
        body: `*Pemberitahuan Orderan Masuk:*\n\n ${purchaseDetails}\n\n*MOHON SEGERA LAKUKAN PENGIRIMAN DAN KONFIRMASI KE NOMOR TERTERA*`
    })
    .then(message => console.log(`Pesan berhasil dikirim: ${message.sid}`))
    .catch(error => console.error(`Pesan gagal dikirim: ${error}`));

    // Response
    res.send('Pembelian berhasil!');

});

// Server listening
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
