const express = require('express');
const app = express();
const routers = require('./routers');

routers.init(app);

app.listen(3003, function() {

});