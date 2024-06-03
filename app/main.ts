import * as net from 'net';
import * as fs from 'fs';
import pathFufu from 'path';
import { Status, Methods } from './httpCodes';

const PORT = process.env.PORT || 4221

const server = net.createServer((socket) => {
    socket.on('data', data => {
        const request = data.toString().split('\r\n')
        const path = request[0].split(' ')
        const echoRequest = path[1].split('/')[2]
        const agentRequest = request[2].split(' ')[1]
        const ContentTypes = {
            text: 'text/plain',
            application: 'application/octet-stream'
        }
        const contentType = (path[1]===`/files/${echoRequest}`) ? ContentTypes.application : ContentTypes.text
        const httpResponse200WithContent = `HTTP/1.1 ${Status[200].code.toString()} ${Status[200].message}\r\nContent-Type: ${contentType}\r\nContent-Length:`
        const fileName = `${process.argv[3]}${echoRequest}`
        console.log('This file type: ', fileName)
        const fileContent = fs.readFileSync(fileName)
        console.log('This file content: ', pathFufu.extname(fileContent.toString()))

        if(path[1] === '/') 
            socket.write(`HTTP/1.1 ${Status[200].code.toString()} ${Status[200].message}\r\n\r\n`)
        if(path[1] === `/echo/${echoRequest}`) 
            socket.write(`${httpResponse200WithContent} ${echoRequest.length}\r\n\r\n${echoRequest}`)
        if(path[1] === '/user-agent')
            socket.write(`${httpResponse200WithContent} ${agentRequest.length}\r\n\r\n${agentRequest}`)
        if(path[1] === `/files/${echoRequest}`)
            socket.write(`${httpResponse200WithContent} ${echoRequest.length}\r\n\r\n${echoRequest}`)
        if(path[1] !== '/')
            socket.write(`HTTP/1.1 ${Status[404].code.toString()} ${Status[404].message}\r\n\r\n`)

        //te
        socket.end();
    })
});

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
server.listen(PORT as number, 'localhost', () => {
    console.log(`Server is running on port ${PORT}`);
});
