# Hex Game
### by Curtis Bechtel

This is a personal project for implementing a user-friendly game of Hex for
people to play remotely through the internet. It is currently being hosted on
[Heroku](playhex.herokuapp.com).



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
