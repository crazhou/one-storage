const express = require('express');
const app = express();
const routers = require('./routers');

routers.init(app);

app.listen(8000, function() {
    let addr = this.address();
    console.log('Start Listen->%s:%s', addr.address, addr.port)
});