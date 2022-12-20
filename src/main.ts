#!/usr/bin/env node

import * as http from 'http';
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";

const server = http.createServer();

// Now that server is running
server.listen(11337, '127.0.0.1');

server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log('Request ', req.url, req.method)

    const url = new URL(req.url, 'http://localhost:11337/')
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Stupid CORS preflight request
    if (req.method === 'OPTIONS') {
        //res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        res.end();
        return;
      }

    console.log('Action ', url.pathname)
    if (req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json'});
        res.write(JSON.stringify({error: 'request ' + url.pathname + ' method not allowed ' + req.method}));
        res.end();
        return
    }
    
    switch (url.pathname) {
        case '/preview/link':
            if (req.method == 'POST') {
                let body = ''
                // get json data
                req.on('data', (chunk) => {
                    body += chunk
                })

                req.on('end', function () {
                    const json = JSON.parse(body)
                    if (json && json.url) {
                        new Promise((resolve, reject) => {
                            setTimeout(() => reject('Timeout'), 5000)
                            return getLinkPreview(json.url)
                        }).then((data) => {
                            console.debug(data);
                            res.writeHead(200, { 'Content-Type': 'application/json'});

                            res.write(JSON.stringify(data));
                            res.end();
                        }).catch((error) => {
                            res.writeHead(200, { 'Content-Type': 'application/json'});
                            res.write(JSON.stringify({'msg': error}));
                            res.end();
                        });

                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json'});
                        res.write(JSON.stringify({ msg: 'No url in request' }));
                        res.end();
                    }
                });
            }
            if (req.method == 'GET') {
                getLinkPreview("https://www.youtube.com/watch?v=MejbOFk7H6c").then((data) => {
                    console.debug(data);
                    res.writeHead(200, { 'Content-Type': 'application/json'});
                    res.write(JSON.stringify(data));
                    res.end();
                });
            }
            break;
        default:
            res.writeHead(200, { 'Content-Type': 'application/json'});
            res.write(JSON.stringify({error: 'request ' + url.pathname + ' unknown'}));
            res.end();
            return
    }
});

/*
server.on('data', (req, res, head) => {
    // pass the link directly
    getLinkPreview("https://www.youtube.com/watch?v=MejbOFk7H6c").then((data) => {
        console.debug(data);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('Hello World!');
        res.end();
    });
});
*/
