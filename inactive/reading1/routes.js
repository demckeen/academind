const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><head><title>First Response</title></head><body>');
    res.write('<form action="/message" method="POST">');
    res.write('<input type="text" name="message"><button type="submit">Send</button>');
    res.write('</form>');
    res.write('</body></html>');
    return res.end();

}

if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
        console.log(chunk);
        body.push(chunk);
    });
    return req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        console.log(parsedBody);
        const message = parsedBody.split('=')[1];
        fs.writeFile('message.txt', message, err => {
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });

    });
}
};

// module.exports = requestHandler;

// module.exports = {
//     handler: requestHandler,
//     someText: 'Some hard coded text stuff',
// }

exports.handler = requestHandler;
exports.someText = 'Some hard coded stufff';