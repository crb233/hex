
# JSON Formats

This document standardizes the format and type of JavaScript objects and data
being used by this project.

Each field is given a value which specifies its expected type. These types are
represented by the following tokens:
- INT: an integer
- BOOL: a boolean
- STRING: a string object
- COLOR: a string which is a valid color
- ID: a string which is a valid id
- SOME_OBJECT: a reference to SOME_OBJECT specified in this document

Additionally, if there is no specified length of an array of objects, repeating
patterns will be specified with ellipsis `...`.

## Database Objects

### BOARD_OBJECT
```javascript
{
    "id": ID,
    "board_name": STRING,
    "players": INT,
    "board": [
        [INT, INT...],
        [INT, INT...],
        ...
    ]
}
```

### PLAYER_OBJECT
```javascript
{
    "id": ID,
    "name": STRING,
    "number": INT,
    "game_id": ID,
    "last_request": INT,
    "new_messages": [MESSAGE_OBJECT, MESSAGE_OBJECT...]
}
```

### GAME_OBJECT
```javascript
{
    "id": ID,
    "active": BOOL,
    "public": BOOL,
    "turn": INT,
    "players": INT,
    "player_ids": [ID, ID...],
    "player_names": [STRING, STRING...],
    "player_colors": [COLOR, COLOR...],
    "board_id": ID,
    "board_name": STRING,
    "board": [
        [INT, INT...],
        [INT, INT...],
        ...
    ]
}
```

### MESSAGE_OBJECT
```javascript
{
    "type": "join/forfeit/request_draw/accept_draw/reject_draw/pause/resume",
    "text": STRING,
}
```



## HTTP Post Requests and Responses

### LIST_BOARDS_REQUEST
```javascript
{}
```

### LIST_BOARDS_RESPONSE
```javascript
[
    BOARD_OBJECT,
    BOARD_OBJECT,
    ...
]
```

### LIST_GAMES_REQUEST
```javascript
{}
```

### LIST_GAMES_RESPONSE
```javascript
[
    GAME_OBJECT,
    GAME_OBJECT,
    ...
]
```

### NEW_GAME_REQUEST
```javascript
{
    "player_name": STRING,
    "player_color": COLOR,
    "board_id": ID,
    "public": BOOL
}
```

### NEW_GAME_RESPONSE
```javascript
{
    "player": PLAYER_OBJECT,
    "game": GAME_OBJECT
}
```

### JOIN_GAME_REQUEST
```javascript
{
    "player_name": STRING,
    "player_color": COLOR,
    "game_id": ID
}
```

### JOIN_GAME_RESPONSE
```javascript
{
    "player": PLAYER_OBJECT,
    "game": GAME_OBJECT
}
```

### MAKE_MOVE_REQUEST
```javascript
{
    "player_id": ID,
    "move": [INT, INT]
}
```

### MAKE_MOVE_RESPONSE
```javascript
{
    "game": GAME_OBJECT
}
```

### GET_UPDATES_REQUEST
```javascript
{
    "player_id": ID
}
```

### GET_UPDATES_RESPONSE
```javascript
{
    "game": GAME_OBJECT,
    "messages": [
        MESSAGE_OBJECT,
        MESSAGE_OBJECT,
        MESSAGE_OBJECT
    ]
}
```

### SEND_MESSAGE_REQUEST
```javascript
{
    "player_id": ID,
    "message": MESSAGE_OBJECT
}
```

### SEND_MESSAGE_RESPONSE
```javascript
{}
```
