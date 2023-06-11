import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

// get environment variables
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV;
const mySetting = process.env.MY_SETTING;
const version = 4;

const app = express();
app.use(express.json());

////////////////////////////////////////////////////////////////////////////////
// Define the route for the root URL
app.get('/', (req, res) => {
  // Use the join() function from the path module to get the absolute path of index.html
  const indexPath = join(__dirname, 'public', 'index.html');

  // Send the index.html file as the response
  res.sendFile(indexPath);
});

////////////////////////////////////////////////////////////////////////////////


















// save albums in memory
let albums = [{
    id: "6f4df1f1-dbb2-46b5-903c-2995c16ed4bb",
    title: "All the Right Reasons",
    artist: "Nickelback"
}];

// setup routes
app.get('/api/albums', (req, res) => {
    res.send(albums);
});

app.get('/api/albums/:id', (req, res) => {
    const id = req.params.id;
    const album = albums.find(a => a.id === id);
    if(!album){
        return res.sendStatus(404);
    }
    return res.send(album);
});

app.post('/api/albums', (req, res) => {
    const {title, artist} = req.body;

    if (!title || typeof title !== 'string') return res.status(400).send('Invalid required field: title (string)');
    if (!artist || typeof artist !== 'string') return res.status(400).send('Invalid required field: artist (string)');

    const album = {
        id: uuidv4(),
        title,
        artist
    }
    albums.push(album);
    return res.status(201).send(album);
});

app.delete('/api/albums/:id', (req, res) => {
    const id = req.params.id;

    // if album doesn't exist, return 404
    const album = albums.find(a => a.id === id);
    if (!album) {
        return res.sendStatus(404);
    }

    // otherwise album was found, remove it and return the album that has been deleted
    albums = albums.filter(a => a.id !== id);
    return res.send(album);
});

// utility endpoints
app.get('/api/healthcheck', (req, res) => {
    res.send({
        status: 'online',
        version,
        nodeEnv,
        mySetting
    });
});

// DO NOT USE in actual production server
app.get('/api/stopserver', (req, res) => {
    process.exit(1);
});

// start express
app.listen(port, () => {
    console.log(`App listening on port: ${port}`)
});
