import * as net from 'net';
import { argv } from 'process';

const PORT = process.env.PORT || 4221

const server = net.createServer((socket) => {
    socket.on('data', data => {
        const request = data.toString().split('\r\n')[0].split(' ')
        switch (request[1]) {
            case '/':
                socket.write('HTTP/1.1 200 OK\r\n\r\n')
                break;
        
            default:
                socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
                break;
        }

        socket.end();
    })
});

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
server.listen(PORT as number, 'localhost', () => {
    console.log('Server is running on port 4221');
});
