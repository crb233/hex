# Hex Game
### by Curtis Bechtel

A web implementation of the game of Hex. It is currently being hosted on
[Heroku](http://playhex.herokuapp.com).



## Getting Started

To clone and set up this repository:
- `$ git clone https://github.com/crb233/hex`
- `$ npm install`

To run tests and see test coverage:
- `$ npm test`
- Navigate to `coverage/index.html` on a modern web browser

To lint a directory or file (static code analysis):
- `$ npm run -s lint file/path/here.js`

To lint all source and test files:
- `$ npm run -s lint-all`

To deploy this project locally:
- `$ npm start`
- Navigate to `localhost:8080` on a modern web browser

To deploy this project on Heroku (for contributors only):
- Create a free Heroku account
- Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
- `$ heroku login`
- `$ git push heroku master`
- Navigate to `playhex.herokuapp.com` on a modern web browser



## Future Additions

- Compressed files: Before running the server, minify all JS, CSS, and HTML to
an output directory.

- Instant messaging: Include a sidebar for messaging other players in your
current game.

- Game history: View a list of all completed games (with statistics and a
playback slider) as well as a list of uncompleted games to be continued. All
data can be kept in local storage.

- Auto continue: If a player closes the window during a game, they will be
automatically redirected back to that game the next time they visit the site.

- Game board creator: Page for creating custom game boards which can be
uploaded to the server and used by other players.
