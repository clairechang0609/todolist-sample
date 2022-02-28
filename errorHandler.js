const headers = require('./headers');

const errorContent = {
    400: '欄位未填寫正確，或無此id',
    404: '查無此頁面'
}

function errorHandler(res, status = 400) {
    res.writeHead(status, headers);
    res.write(JSON.stringify({
        "status": "false",
        "message": errorContent[status],
        "data": []
    }));
    res.end();
}

module.exports = errorHandler;