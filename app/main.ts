import * as net from 'net';
import { argv } from 'process';

const PORT = process.env.PORT || 4221

const server = net.createServer((socket) => {
    socket.on('data', data => {
        const request = data.toString().split('\r\n')
        const agentRequest = request[2].split(' ')[1].split('/')[2]
        const query = request[0].split(' ')[1].split('/')[2]
        const notFound404 = request[0].split(' ')
        const httpResponse200WithContent = 'HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:'

        if(request[1] === '/') 
            socket.write('HTTP/1.1 200 OK\r\n\r\n')
        if(request[1] === `/echo/${query}`) 
            socket.write(`${httpResponse200WithContent} ${query.length}\r\n\r\n${query}`)
        if(request[1] === '/user-agent')
            socket.write(`${httpResponse200WithContent} ${agentRequest.length}\r\n\r\n${agentRequest}`)
        if(request[1] !== '/') 
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n')

        socket.end();
    })
});

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
server.listen(PORT as number, 'localhost', () => {
    console.log('Server is running on port 4221');
});
