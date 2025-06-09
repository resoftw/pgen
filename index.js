const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve semua file statis dari folder root
app.use(express.static(__dirname));

// Serve halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});