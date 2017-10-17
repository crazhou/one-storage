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

    function progressFunction(event) {

        console.log('Event->', event.type, event);

    }


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
                console.log('Progress->', event);
                let precent = Math.round(event.loaded/event.total * 98);
                console.log('Precent->', precent);
                progressBar.css('width', precent + '%')
                .html(precent + '%')
            };
            xhr.upload.onloadstart = function(event) {//上传开始执行方法
                console.log('Start ->', event);
                stamp1 = Date.now();   //设置上传开始时间
                onload = 0;//设置上传开始时，以上传的文件大小为0
            };
            xhr.upload.onloadend = function(event) {
                console.log('Upload End', this, event);
            };

            xhr.send(ff); //开始上传，发送form数据

        })
        
    }
    
})