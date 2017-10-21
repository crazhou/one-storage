$(function(){
    // Event
    var field = $('#choseField');

    $(document).on('click', '#choseBtn', function(e){
        e.preventDefault();
        field.trigger('click');
    });


    field.on('change', function(e) {
        var files = this.files;
        if(files.length>0) {
            var file = files[0];
            startUpload(file);  
        };
    });

    
    function fetchPoSign(fileName, fn) {
        $.ajax({
            url : '/fetchSign',
            type:'get',
            data:{f:fileName},
            cache:false,
            dataType:'json',
            success: function(resp) {
                if(resp.code === 1000) {
                    fn&&fn({
                        'authorization' : 'UPYUN ' + resp.data.operator + ':' + resp.data.sign,
                        'policy' : resp.data.policy,
                        'formurl' : resp.data.formurl
                    });
                } else {
                    alert('接口异常！');
                }
            },
            error:function(err) {

            }
        })
 
    };
    /*
     * 取验证签名
     */
    function fetchAuth(bucket, obj, fn) {
        var targetPath = obj.path||'/';
        $.ajax({
            url : '/fetchAuth',
            type:'GET',
            data: {bucket:bucket, path:targetPath, method:obj.method },
            cache:false,
            dataType:'json',
            timeout:15000,
            success:function(resp) {
                if(!resp.ret) {
                    fn&&fn(resp.data);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('ERROR->', textStatus, errorThrown);
            }
        })
    }

    function listFile(bucket, obj) {
        var targetPath = obj.path||'/';
        fetchAuth('miniprogram', {
            method:'get',
            path:'/'
        }, function(data) {
            $.ajax({
                url:data.API_URL + '/' + bucket + targetPath,
                type:'GET',
                data: {
                    'x-list-limit' : 20
                },
                dataType:'text',
                timeout:15000,
                headers:{
                    Authorization:data.Authorization,
                    'X-Date': (new Date).toGMTString()
                },
                success: function(resp) {
                    var arr1 = resp.split(/\n/g);
                    arr2 = arr1.map(function(item){
                        return item.split(/\t/g);
                    })
                    var _html = _.template($('#tplFilelist').html());
                    $('.tables').html(_html(arr2));
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('ERROR->', textStatus, errorThrown);
                }

            })
        })
    }

    listFile('miniprogram', {
        path:'/',
        pageSize:20
    });

    function startUpload(f) {
        let progressBar = $('.progress-bar');
        let stamp1, onload;
        fetchPoSign(f.name, function(obj) {
            let ff = new FormData();
            $.each(obj, function(i,e) {
                ff.append(i, e);
            });
            ff.append('file', f);

            let xhr = new XMLHttpRequest;

            xhr.open('post', obj.formurl, true);

            xhr.onload = function(event) {
                if(xhr.readyState === xhr.DONE && xhr.status === 200) {
                    progressBar.css('width', '100%')
                    .html('上传完成！')
                    console.log(xhr.responseText);
                }
            };
            xhr.onerror = function(err) {
                console.log('Error', err)
            };
            xhr.upload.onprogress = function(event) {
                let precent = Math.round(event.loaded/event.total * 98);
                progressBar.css('width', precent + '%')
                .html(precent + '%')
            };
            xhr.upload.onloadstart = function(event) {//上传开始执行方法
                console.log('Start ->', event);
            };
            xhr.upload.onloadend = function(event) {
                console.log('Upload End', this, event);
            };

            xhr.send(ff); //开始上传，发送form数据

        })
        
    }
    
})