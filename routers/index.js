const express = require('express');
const path = require('path');
const formapi = require('../tools/formapi');

module.exports = {
    init:function(app) {

        app.get('/fetchSign', function(req, res) {
            let file = req.query.f;
            if(file) {
                let sign = formapi.genSign(file);
                let policy = formapi.genPolicy(file);
                res.json({
                    code:1000,
                    data: {
                        sign,
                        policy  
                    }
                });
            } else {
                res.json({
                    code:1001,
                    errMsg: '文件名不能为空!'
                });
            }
            
        });

    
        let options = {
            etag:true,
            maxAge:'id',
            dotfiles: 'ignore',
            setHeaders: function (res, path, stat) {
                res.set('x-timestamp', Date.now());
            }
        };

        app.use(express.static(path.resolve(__dirname, '../public'), options));
    }
}