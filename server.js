const http = require('http');
const { v4: uuidv4 } = require('uuid');
const successHandler = require('./successHandler');
const errorHandler = require('./errorHandler');
const headers = require('./headers');
const todos = [];

const requestListener = (req, res) => {
    const url = req.url;
    const method = req.method;
    let body = '';
    req.on('data', chunk => { // 取得封包
        body += chunk;
    });

    if (url === '/todos' && method === 'GET') {
        successHandler(res, method, todos);
    } else if (url === '/todos' && method === 'POST') {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                if (title !== undefined) {
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    };
                    todos.push(todo);
                    successHandler(res, method, todos);
                } else {
                    errorHandler(res);
                }
            } catch(err) {
                errorHandler(res);
            }
        });
    } else if (url === '/todos' && method === 'DELETE') {
        todos.length = 0;
        successHandler(res, method, todos);
    } else if (url.startsWith('/todos/') && method === 'DELETE') {
        const id = url.split('/').pop();
        const index = todos.findIndex(item => item.id === id);
        if (index !== -1) {
            todos.splice(index, 1);
            successHandler(res, method, todos);
        } else {
            errorHandler(res);
        }
    } else if (url.startsWith('/todos/') && method === 'PATCH') {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                const id = url.split('/').pop();
                const index = todos.findIndex(item => item.id === id);
                if (title !== undefined && index !== -1) {
                    todos[index].title = title;
                    successHandler(res, method, todos);
                } else {
                    errorHandler(res);
                }
            } catch(error) {
                errorHandler(res);
            }
        });
    } else if (method === 'OPTIONS') { // preflight 跨網域使用
        res.writeHead(200, headers);
        res.end();
    } else {
        errorHandler(res, 404);
    }
};

const server = http.createServer(requestListener);

server.listen(process.env.PORT || 8080);