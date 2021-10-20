const express = require('express');
const path = require("path");
const fs = require('fs');
const uniqid = require('uniqid'); 
const util = require('util');
let writeFileAsync = util.promisify(fs.writeFile);

const PORT = process.env.PORT || 3001;
const db = require('./db/db.json');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html'))); //loads home page

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html'))); //loads notes page

// get notes from db.json
app.get('/api/notes', (req, res) => res.json(db));


// add note to db.json
app.post('/api/notes', (req, res) => {

    
    
    let input = JSON.stringify(req.body)
    const {title, text} = req.body;

    const objWithID = {
        title,
        text,
        id: uniqid()
    }
    
    // get the existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const arr = JSON.parse(data);
  
          // Add a new review
          arr.push(objWithID);
          writeFileAsync(
            './db/db.json',
            JSON.stringify(arr, null, 4),
            (err) =>
              err
                ? console.error(err)
                : console.info('Successfully updated reviews!')
          );
        }
      });
    // Log our request to the terminal
    console.info(`${req.method} request received to add a review`);
    // Inform the client that their POST request was received
    res.json(`${req.method} request received to add a review`);
  });

//delete notes
app.delete('/api/notes/:id', (req,res)=> {
    console.log('hi');
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);