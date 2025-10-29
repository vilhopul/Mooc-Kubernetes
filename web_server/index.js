import http from 'http';

const PORT = 8080;


const server = http.createServer((req, res) => {
    res.statusCode = 200;
    });

server.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
    });
