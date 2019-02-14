const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const SpotifyWebApi = require('spotify-web-api-node');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('layout', 'layouts/main');
app.use(express.static(path.join(__dirname, '/public')));
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Remember to insert your credentials here
const clientId = 'b8ab7dc20bd446b79876b8b618539dc8';
const clientSecret = '1124b312ba464bdab6a1330b419ae3b9';

const spotifyApi = new SpotifyWebApi({ clientId, clientSecret });

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch((error) => {
    console.log('Something went wrong when retrieving an access token', error);
  });


// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index', { title: 'Ironhack Spotify' });
});

app.post('/artist', (req, res, next) => {

  const { query } = req.body;

  spotifyApi.searchArtists(query)
    .then((data) => {
      console.log(data.body.artists.items[0].images[0].url);
      res.render('artist', { title: 'Artist', data });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {

  const { artistId } = req.params;

  spotifyApi.getArtistAlbums(artistId)
    .then((data) => {
      console.log('Artist albums', data.body);
      res.render('albums', { title: 'Artist albums', data });
    })
    .catch((err) => {
      console.log('The error while searching artist albums: ', err);
    });
});

app.get('/albums/:albumId/tracks', (req, res, next) => {

  const { albumId } = req.params;

  spotifyApi.getAlbumTracks(albumId, { limit: 5, offset: 1 })
    .then((data) => {
      console.log('Album tracks: ', data.body);
      res.render('tracks', { title: 'Album tracks', data });
    })
    .catch((err) => {
      console.log('The error while searching album tracks: ', err);
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
