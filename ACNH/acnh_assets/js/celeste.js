function celeste_page_onload() {
    all_page_onload();
}
    var request = new XMLHttpRequest();
    var i = 0;
    // 设置请求方法与路径
    request.open("get", 'db/json/celeste.json');
    // 不发送数据到服务器
    request.send(null);
    //XHR对象获取到返回信息后执行
    request.onload = function () {
        // 返回状态为200，即为数据获取成功
        if (request.status == 200) {
            var data = JSON.parse(request.responseText);
            console.log(data.length);
            var page_json = getPageJson('umbrella')
            for (i = 0; i < data.length; i++) {
                data[i].show_flag = 1
            }

            if (page_json != null) {
                for (i = 0; i < data.length; i++) {
                    if (page_json.includes(data[i].id)) {
                        data[i].own_flag = 1
                    }
                }
            }
            // filter name data
            if (name != null) {
                console.log('name filter')
                for (i = 0; i < data.length; i++) {
                    if (data[i].show_flag === 1) {
                        if (data[i].name.english.indexOf(name) > -1 ||
                            data[i].name.chinese.indexOf(name) > -1 ||
                            data[i].name.japanese.indexOf(name) > -1) {
                            data[i].show_flag = 1
                        } else {
                            data[i].show_flag = 0
                        }
                    }
                }
            }

            // filter own data
            if (own != null) {
                console.log('own filter')
                for (i = 0; i < data.length; i++) {
                    if (data[i].show_flag === 1) {
                        if (own) {
                            data[i].show_flag = data[i].own_flag
                        } else {
                            data[i].show_flag = data[i].own_flag ^ 1
                        }
                    }

                }
            }

            // filter cate data
            if (checkbox_select_list.length != 0) {
                console.log('cate filter')
                for (i = 0; i < data.length; i++) {
                    if (data[i].show_flag === 1) {
                        if (checkbox_select_list.includes(data[i].source.english) ||
                            checkbox_select_list.includes(data[i].source.chinese) ||
                            checkbox_select_list.includes(data[i].source.japanese)) {
                            data[i].show_flag = 1
                        } else {
                            data[i].show_flag = 0
                        }
                    }

                }
            }
            update_page(data);
            init_language();
        } else {
            console.log('error');
        }
    }
}
