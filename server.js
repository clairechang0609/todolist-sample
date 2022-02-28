const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandler = require('./errorHandler');
const todos = [];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
        'Content-Type': 'application/json'
    };
    let body = '';

    req.on('data', chunk => { // 取得封包，組合起來
        body += chunk;
    });
    if (req.url === '/todos' && req.method === 'GET') {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "message": "取得成功",
            "data": todos
        }));
        res.end();
    } else if (req.url === '/todos' && req.method === 'POST') {
        req.on('end', () => { // 取得結束
            try { // 取得成功
                const title = JSON.parse(body).title;
                if (title !== undefined) {
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    };
                    todos.push(todo);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "message": "新增成功",
                        "data": todos
                    }));
                    res.end();
                } else {
                    errorHandler(res);
                }
            } catch(err) { // 取得失敗（非JSON格式）
                errorHandler(res);
            }
        });
    } else if (req.url === '/todos' && req.method === 'DELETE') {
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "message": "刪除成功",
            "data": todos
        }));
        res.end();
    } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
        const id = req.url.split('/').pop();
        const index = todos.findIndex(item => item.id === id);
        if (index !== -1) {
            todos.splice(index, 1);
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                "status": "success",
                "message": "刪除成功",
                "data": todos
            }));
            res.end();
        } else {
            errorHandler(res);
        }
    } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                const id = req.url.split('/').pop();
                const index = todos.findIndex(item => item.id === id);
                if (title !== undefined && index !== -1) {
                    todos[index].title = title;
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "message": "編輯成功",
                        "data": todos
                    }));
                    res.end();
                } else {
                    errorHandler(res);
                }
            } catch(error) {
                errorHandler(res);
            }
        });
    } else if (req.method === 'OPTIONS') { // preflight
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "data": "查無此頁面"
        }));
        res.end();
    }
};

const server = http.createServer(requestListener);

server.listen(8080);