import * as net from 'net';
import * as fs from 'fs';
import pathFufu from 'path';
import { Status, Methods } from './httpCodes';

const PORT = process.env.PORT || 4221

const server = net.createServer((socket) => {
    socket.on('data', data => {
        const request = data.toString().split('\r\n')
        const path = request[0].split(' ')
        const method = path[0];
        const echoRequest = path[1].split('/')[2]
        const agentRequest = request[2].split(' ')[1]
        const acceptedEncoding = request[2].split(' ')
        const ContentTypes = {
            text: 'text/plain',
            application: 'application/octet-stream'
        }
        const contentType = (path[1]===`/files/${echoRequest}`) ? ContentTypes.application : ContentTypes.text
        const statusCodeRequest = method === Methods.GET ? Status[200] : Status[201]
        const httpResponse200sWithContent = `HTTP/1.1 ${statusCodeRequest.code} ${statusCodeRequest.message}\r\nContent-Type: ${contentType}\r\nContent-Length:`
        const fileName = `${process.argv[3]}${echoRequest}`

        if(path[1] === '/') 
            socket.write(`HTTP/1.1 ${Status[200].code.toString()} ${Status[200].message}\r\n\r\n`)
        if(path[1] === `/echo/${echoRequest}` && acceptedEncoding[0] !== 'Accept-Encoding:' ) 
            socket.write(`${httpResponse200sWithContent} ${echoRequest.length}\r\n\r\n${echoRequest}`)
        if(path[1] === '/user-agent')
            socket.write(`${httpResponse200sWithContent} ${agentRequest.length}\r\n\r\n${agentRequest}`)
        if(acceptedEncoding[0] === 'Accept-Encoding:') {
            console.log(acceptedEncoding.includes('gzip'))
            if(acceptedEncoding.includes('gzip')) {
                socket.write(
                    `HTTP/1.1 ${statusCodeRequest.code} ${statusCodeRequest.message}\r\nContent-Encoding: gzip\r\nContent-Type: ${contentType}\r\nContent-Length: ${echoRequest.length}\r\n\r\n${echoRequest}`
                )
            } else {
                socket.write(`${httpResponse200sWithContent} ${echoRequest.length}\r\n\r\n${echoRequest}`)
            }
        }

        // Read File
        if(path[1] === `/files/${echoRequest}` && method === Methods.GET) {
            try {
                const fileContent = fs.readFileSync(fileName)
                socket.write(
                    `${httpResponse200sWithContent} ${fileContent.toString().length}\r\n\r\n${fileContent.toString()}`
                );
            } catch (error) {
                socket.write(`HTTP/1.1 ${Status[404].code.toString()} ${Status[404].message}\r\n\r\n`)
            }
        }

        // Write File
        if(path[1] === `/files/${echoRequest}` && method === Methods.POST) {
            try {
                const fileContent = fs.writeFileSync(fileName, request[4])
                socket.write(
                    `${httpResponse200sWithContent} ${request[4].length}\r\n\r\n${request[4]}`
                );
            } catch (error) {
                socket.write(`HTTP/1.1 ${Status[404].code.toString()} ${Status[404].message}\r\n\r\n`)
            }
        }
        if(path[1] !== '/')
            socket.write(`HTTP/1.1 ${Status[404].code.toString()} ${Status[404].message}\r\n\r\n`)

        // te
        socket.end();
    })
});

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
server.listen(PORT as number, 'localhost', () => {
    console.log(`Server is running on port ${PORT}`);
});
