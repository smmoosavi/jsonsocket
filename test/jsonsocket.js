require("blanket")();
var net = require('net');
var expect = require('chai').expect;
var JsonSocket = require('../lib/JsonSocket');

var lastPort = 18252;
function getPort() {
    return lastPort++;
}

describe('JsonSocket', function () {
    describe('End to End', function () {
        function sendReciveJson(item, done) {
            var server = net.createServer(function (con) {
                var socket = new JsonSocket(con);
                socket.write(item);
                socket.disconnect();
            });
            var port = getPort();
            server.listen(port);
            var socket = new JsonSocket(port, '127.0.0.1');
            socket.on('json', function (_item) {
                expect(_item).to.deep.equals(item);
                server.close();
                done();
            });
        }

        it('Sending null', function (done) {
            sendReciveJson(null, done);
        });

        it('Sending boolean', function (done) {
            sendReciveJson(false, done);
        });

        it('Sending int', function (done) {
            sendReciveJson(12, done);
        });
        it('Sending string', function (done) {
            sendReciveJson("test", done);
        });
        it('Sending array', function (done) {
            sendReciveJson(["test", 12, [null, 2]], done);
        });
        it('Sending object', function (done) {
            sendReciveJson({text: 12, box: null, arr: [1, 2, 3]}, done);
        });
        it('Sending big object', function (done) {
            var s = new Array(10000).join("test ");
            sendReciveJson({text: s}, done);
        });

        it('Sending multiple object', function (done) {
            var items = [null, false, 3, 'hi', ['array'], {object: 'test'}];
            var server = net.createServer(function (con) {
                var socket = new JsonSocket(con);
                items.forEach(function (item) {
                    socket.write(item);
                });
                socket.disconnect();
            });
            var port = getPort();
            server.listen(port);
            var socket = new JsonSocket(port, '127.0.0.1');
            var _items = [];
            socket.on('json', function (_item) {
                _items.push(_item);
            });
            socket.on('disconnect', function () {
                expect(_items).to.deep.equals(items);
                server.close();
                done();
            });
        });

        it('Handling error', function (done) {
            var server = net.createServer(function (con) {
                var socket = new JsonSocket(con);
                socket.disconnect();
            });
            var port = getPort();
            server.listen(port);
            var socket = new JsonSocket(port, '127.0.0.1');
            socket.on('error', function () {
                server.close();
                done();
            });
            socket.on('disconnect', function () {
                socket.write({sending: 'after close'});
            });
        });

        it('reconnect and destroy', function (done) {
            var count = 0;
            var server = net.createServer(function (con) {
                var socket = new JsonSocket(con);
                count++;
                socket.write(count);
            });
            var port = getPort();
            server.listen(port);
            var socket = new JsonSocket(port, '127.0.0.1');
            socket.on('json', function (count) {
                if (count == 2) {
                    done();
                } else {
                    socket.disconnect();
                    socket.connect(port, '127.0.0.1');
                }
            });
        });

    });
    //describe('End to End', function () {
    //
    //});
});