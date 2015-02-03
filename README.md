# jsonsocket
JSON socket

## Install

```
$ npm install jsonsocket
```

## Usage

```js
var JsonSocket = require('jsonsocket');
```

## Methods

### `JsonSocket(ip, port)`

Create new json socket from ip and port.

```js
var socket = new JsonSocket('127.0.0.1', 7000);
```

### `JsonSocket(socket)`

Create new json socket from existing`net.Socket`

```js
var net = require('net');
var server = net.createServer(function (con) {
    var socket = new JsonSocket(con);
}
```

### `write(data)`

Send object over socket.

```js
socket.write({foo: 'bar'});
```
### `disconnect()`

Destroy connection

### `on(eventType, listener)`

Inherited from `events.EventEmitter`.

## Events

### error

Emitted when net.Socket emit error.

> Error events are treated as a special case in node. If there is no listener for it,
> then the default action is to print a stack trace and exit the program.

[see more](http://nodejs.org/api/events.html#events_class_events_eventemitter).

### newListener, removeListener

Inherited from [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter).

### connect
Emitted when socket connected (only when you pass ip, port).

### json
Emitted when full json received.

```js
socket.on('json', function (json) {
    console.log(json);
}
```
### disconnect
Emitted when disconnected.

## Logging

You can enable logging. [See more](https://github.com/visionmedia/debug)

```bash
# disabled logging
node test.js

# connect, disconnect log
DEBUG=JsonSocket:connection node test.js

# data log
DEBUG=JsonSocket:data node test.js

# all json socket logs
DEBUG=JsonSocket:* node test.js
```

## Protocol

We send json objects over socket then write one `\0`. This is c/c++ friendly protocol. :smile:

```
{"x": 3}\0null\0"Hi"\0[]\0
```