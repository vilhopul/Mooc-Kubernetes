import http from 'http';

const PORT = process.env.PORT;


const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`
            <!DOCTYPE html>
                <html>
                    <body>
                        <h1>this is running inside kube!</h1>
                    </body>
                </html>
        `);
    } else {
        res.statusCode = 404;
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
    });
