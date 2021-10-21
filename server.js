/** Creates a server
 * @author Henry Kam
*/
const express = require('express');
const path = require("path");
const fs = require('fs');
const uniqid = require('uniqid'); 
const util = require('util');
let writeFileAsync = util.promisify(fs.writeFile);
let readFileAsync = util.promisify(fs.readFile);

const PORT = process.env.PORT || 3001;
const db = require('./db/db.json');

const app = express();

/**
 *  middleware to allow inputs to be readable by the machine
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));

/**
 *  GET request that renders the home page when the user goes to the main port
 *  
 */
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html'))); 

/**
 *  GET request that renders the notes user interface when the user reaches the /notes url
 */

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html'))); 

/**
 * GET request for a list of notes formatted in JSON files
 * @param {String} url
 * @returns {JSON} notes - notes from db.json
 * 
 */
app.get('/api/notes', (req, res) => readFileAsync('db/db.json', 'utf8').then((notes) => res.json([].concat(JSON.parse(notes)))));


/**
 * POST request to append a new note to db.json, add the existing list of notes
 * @param {String} url
 * @returns {String} feedback - whether or not the POST request was successful or not
 * 
 */
app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;

    const objWithID = {
        title,
        text,
        id: uniqid()
    }
    
    // get the existing notes
    readFileAsync('./db/db.json', 'utf8', (err, data) => {
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
    console.info(`${req.method} request received to add a note`);
    // Inform the client that their POST request was received
    res.json(`${req.method} request received to add a note`);
  });

/**
 * DELETE request to delete a note to db.json using an id tag
 * @param {String} id
 * @returns {String} feedback - whether or not the DELETE request was successful or not
 * 
 */
app.delete('/api/notes/:id', (req,res)=> {
    readFileAsync('db/db.json', 'utf8').then((notes) => {
        
        let tempID = req.params.id;
        // create array of JSON objects while reading the file
        let tempArr = [].concat(JSON.parse(notes));
        // removes object from array if the ids match
        for(let i = 0; i<tempArr.length; i++)
        {
            if(tempArr[i].id == tempID)
            {
                tempArr.splice(i,1);
            }
        }
        writeFileAsync(
            './db/db.json',
            JSON.stringify(tempArr, null, 4),
            (err) =>
              err
                ? console.error(err)
                : console.info('Successfully updated reviews!')
        );
    }).catch(err => console.error("error!"));
    // return feedback
    console.info(`${req.method} request received to delete note`);
    res.json(`${req.method} request received to delete note`);
    
});

/**
 * initializes server
 * @param {Integer} port number
 */
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);