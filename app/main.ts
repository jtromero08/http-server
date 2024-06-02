import * as net from 'net';
import { argv } from 'process';

const PORT = process.env.PORT || 4221

const server = net.createServer((socket) => {
    socket.on("data", data => {
        socket.write(argv[0])
    })
    socket.end();
});

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
server.listen(PORT as number, 'localhost', () => {
    console.log('Server is running on port 4221');
});
