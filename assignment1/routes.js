const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><head><title>Main Response</title></head><body>');
    res.write('<h1>User Accounts</h1>');
    res.write('<form action="/create-user" method="POST">');
    res.write('<h2>Create an Account</h2>');
    res.write('<label for="username" id="usernamelabel">Username</label>');
    res.write('<input type="text" name="username"><button type="submit">Create Account</button>');
    res.write('</form>');
    res.write('</body></html>');
    return res.end();

}

if (url === '/users') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><head><title>Users List</title></head><body>');
    res.write('<h1>Existing Users</h1>');
    res.write('<ul>');
    res.write('<li>banana245</li>');
    res.write('<li>wenseul92</li>');
    res.write('<li>reveluv4ever</li>');
    res.write('<li>cancan83</li>');
    res.write('<li>armyfanBTS</li>');
    res.write('<li>dMcKeen</li>');
    res.write('</ul>');
    res.write('</body></html>');
    return res.end();

}

if (url === '/create-user' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
        console.log(chunk);
        body.push(chunk);
    });
    return req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        console.log(parsedBody);
        const message = parsedBody.split('=')[1];
        fs.writeFile('./assignment1/newuser.txt', message, err => {
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