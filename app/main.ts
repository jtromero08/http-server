import * as net from 'net';
import { argv } from 'process';

const PORT = process.env.PORT || 4221

const server = net.createServer((socket) => {
    socket.on('data', data => {
        const request = data.toString().split('\r\n')
        const path = request[0].split(' ')
        const echoRequest = path[1].split('/')[1]
        console.log(path[1].split('/'))
        const agentRequest = request[2].split(' ')[1]
        const httpResponse200WithContent = 'HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:'

        if(path[1] === '/') 
            socket.write('HTTP/1.1 200 OK\r\n\r\n')
        if(path[1] === `/echo/${echoRequest}`) 
            socket.write(`${httpResponse200WithContent} ${echoRequest.length}\r\n\r\n${echoRequest}`)
        if(path[1] === '/user-agent')
            socket.write(`${httpResponse200WithContent} ${agentRequest.length}\r\n\r\n${agentRequest}`)
        if(path[1] !== '/') 
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
