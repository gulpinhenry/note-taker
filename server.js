const express = require('express');
const path = require("path");

const PORT = 3001;
const db = require('./db/db.json');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html'))); //loads home page

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html'))); //loads notes page



app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);