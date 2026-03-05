const http = require('http');
const fs = require('fs');

fs.writeFileSync('test.txt', 'Hello World');
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

const payload = `--${boundary}\r
Content-Disposition: form-data; name="firstName"\r\n\r
TestName\r
--${boundary}\r
Content-Disposition: form-data; name="avatar"; filename="test.txt"\r
Content-Type: text/plain\r\n\r
Hello World\r
--${boundary}--`;

const req = http.request({
    hostname: 'localhost',
    port: 5002,
    path: '/api/v1/auth/profile',
    method: 'PUT',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(payload)
    }
}, res => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('BODY:', raw);
    });
});

req.on('error', console.error);
req.write(payload);
req.end();
