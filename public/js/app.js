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


    function startUpload(f) {
        fetchPoSign(f.name, function(obj) {
            let ff = new FormData();
            $.each(obj, function(i,e) {
                ff.append(i, e);
            });
            ff.append('file', f);

            $.ajax({
                url:obj.formurl,
                data:ff,
                dataType:'json',
                type:'POST',
                contentType:false,
                processData:false,
                success: function() {

                }
            });

        })
        
    }
    
})