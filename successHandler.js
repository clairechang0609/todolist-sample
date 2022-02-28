const headers = require('./headers');

const successContent = {
    GET: '取得成功',
    POST: '新增成功',
    DELETE: '刪除成功',
    PATCH: '編輯成功'
}

function successHandler(res, method, todos) {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
        "status": "success",
        "message": successContent[method],
        "data": todos
    }));
    res.end();
}

module.exports = successHandler;