import * as net from 'net';
import * as fs from 'fs';
import zlib from 'zlib';
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
        const httpResponse404 = `HTTP/1.1 ${Status[404].code.toString()} ${Status[404].message}\r\n\r\n`;
        const fileName = `${process.argv[3]}${echoRequest}`

        if(path[1] === '/') 
            socket.write(`HTTP/1.1 ${Status[200].code.toString()} ${Status[200].message}\r\n\r\n`)
        if(path[1] === '/user-agent')
            socket.write(`${httpResponse200sWithContent} ${agentRequest.length}\r\n\r\n${agentRequest}`)
        if(path[1] === `/echo/${echoRequest}`) {
            if(acceptedEncoding.includes('gzip,') || acceptedEncoding[1] === 'gzip') {
                const buffer = Buffer.from(echoRequest, 'utf-8');
                const zipper = zlib.gzipSync(buffer)
                socket.write(
                    `HTTP/1.1 ${statusCodeRequest.code} ${statusCodeRequest.message}\r\nContent-Encoding: gzip\r\nContent-Type: ${contentType}\r\nContent-Length: ${zipper.length}\r\n\r\n`
                )
                socket.write(zipper)
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
                socket.write(httpResponse404)
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
                socket.write(httpResponse404)
            }
        }
        if(path[1] !== '/')
            socket.write(httpResponse404)

        socket.end();
    })
});

console.log("Logs from your program will appear here!");

server.listen(PORT as number, 'localhost', () => {
    console.log(`Server is running on port ${PORT}`);
});
