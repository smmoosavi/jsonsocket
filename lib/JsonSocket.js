var net = require('net');
var util = require('util');
var events = require('events');
var log = require('debug')('JsonSocket:connection');
var dataLog = require('debug')('JsonSocket:data');

var version = require('../package.json').version;

function isString(s){
    return (typeof s === 'string' || s instanceof String);
}

function JsonSocket(ip, port) {
    var socket = this;
    var connection = null;
    var json = "";
    if (isString(ip)) {
        log('connecting... %s:%s', ip, port);
        connection = net.connect({ip: ip, port: port}, function () {
            log('connect');
            socket.emit('connect');
        });
    } else if (ip instanceof net.Socket) {
        log('connect');
        connection = ip;
    } else {
        throw new Error('Invalid input. Arguments must be ip, port or net.Socket');
    }


    connection.on('data', function (data) {
        var str = data.toString();
        var parts = str.split('\0');
        json += parts.shift();
        while (parts.length > 0) {
            dataLog('receive %s', json);
            socket.emit('json', JSON.parse(json));
            json = parts.shift();
        }
    });

    connection.on('end', function () {
        log('disconnect');
        socket.emit('disconnect');
    });



    socket.write = function (data) {
        dataLog('write %s', JSON.stringify(data));
        connection.write(JSON.stringify(data) + '\0');
    };

    socket.disconnect = function(){
        connection.destroy();
    };
}

util.inherits(JsonSocket, events.EventEmitter);

module.exports = JsonSocket;
module.exports.version = version;