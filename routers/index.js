const express = require('express');
const path = require('path');
const formapi = require('../tools/formapi');
const Config = require('../config/api').upyun;

module.exports = {
    init:function(app) {
        // 取生成的Policy 和 Sign
        app.get('/fetchSign', function(req, res) {
            
            let file = req.query.f;
            
            let formurl = Config.API_URL + '/' + Config.bucket;

            let operator = Config.operator;

            if(file) {
                let sign = formapi.genSign(file);
                let policy = formapi.genPolicy(file);
                res.json({
                    code:1000,
                    data: {
                        sign,
                        policy,
                        formurl,
                        operator
                    }
                });
            } else {
                res.json({
                    code:1001,
                    errMsg: '文件名不能为空!'
                });
            }
        });

        /*
         * 静态文件选项
         */
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