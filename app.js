const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public")); // buat baca suruh isi folder

app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect("mongodb+srv://root:root@ppqitadb.nytneum.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Buat model schema
const Comment = mongoose.model("Comment", {
  nama: String,
  komentar: String,
});

app.use(express.json());

// Endpoint untuk menambahkan komentar
app.post("/api/komentar", async (req, res) => {
  const { nama, komentar } = req.body;
  console.log(nama.length);
  console.log(komentar.length);
  // Validasi panjang nama dan komentar
  if (nama.length > 20 || komentar.length > 160) {
    return res.status(400).send({
      error: "Nama maksimal 20 karakter, komentar maksimal 160 karakter",
    });
  }

  console.log("seharusnya tidak di jalankan");

  try {
    const newComment = new Comment({ nama, komentar });
    await newComment.save();
    res.status(201).json({ message: "Komentar berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint untuk mendapatkan semua komentar
app.get("/api/komentar", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
