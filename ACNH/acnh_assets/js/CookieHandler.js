function setCookie(name, value) {
    var exp = new Date();
    var days = 7;
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    // console.log(document.cookie)
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var value = getCookie(name);
    if (value != null) {
        document.cookie = name + "=" + value + ";expires=" + exp.toGMTString();
    }
}

function cleanCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
    }
    location.reload();
}

function checkCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    return !!keys;
}

function Cookie2Json() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    var jsonObj = {};
    console.log(keys)
    if (keys) {
        for (var i = keys.length; i--;) {
            var value = getCookie(keys[i]);
            if (value != null) {
                jsonObj[keys[i]] = JSON.parse(value);
            }
        }
    }
    // console.log(jsonObj)
    if (JSON.stringify(jsonObj) == "{}") {
        return null;
    } else {
        return jsonObj
    }

}

function resetGlobalSettings() {
    saveGlobalJson({});
    location.reload();
}

function downloadJson() {
    var json = Cookie2Json()
    if (json != null) {
        var eleLink = document.createElement('a');
        eleLink.download = 'data.json';
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        var blob = new Blob([JSON.stringify(json)]);
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    } else {
        alert('未有数据！');
    }
}

function downloadCurrentUserJson() {
    const current_user_json = getSelectedUserJson();
    var eleLink = document.createElement('a');
    eleLink.download = current_user_json.info.name + '.json';
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([JSON.stringify(current_user_json)]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);

    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
}

function downloadCurrentUserJson2() {
    const current_user_json = getSelectedUserJson();
    var eleLink = document.createElement('a');
    eleLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(current_user_json));
    eleLink.setAttribute('download', current_user_json.info.name + '.json')
    eleLink.style.display = 'none';
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
}

function uploadUserJson() {
    var fileInput = document.getElementById('input_f');
    fileInput.onchange = function () {
        if (!fileInput.value) {
            console.log('没有选择文件')
            return null;
        }
        var file = fileInput.files[0];
        // console.log(file.name.split('.')[0])
        if (file.type !== 'application/json') {
            alert('不是有效的json文件!');
            return null;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var json = JSON.parse(data);
            // console.log(json);
            if (json.info.name != null) {
                var usernames = getAllUserName();
                // console.log(json.info.name);
                // console.log(usernames);
                if (usernames.includes(json.info.name)) {
                    var r = window.confirm("是否覆盖已有用户: " + json.info.name);
                    if (r === true) {
                        json.is_default = false;
                        createUser(json.info.name, json)
                        location.reload();
                    } else {
                        console.log("取消覆盖!");
                    }
                } else {
                    json.is_default = false;
                    createUser(json.info.name, json)
                    location.reload();
                }
            } else {
                alert("Json 文件格式有误,请仔细检测！");
            }
        };
        reader.readAsText(file);
    }
    fileInput.click();
}

function uploadJson() {
    var fileInput = document.getElementById('input_f');
    fileInput.onchange = function () {
        if (!fileInput.value) {
            console.log('没有选择文件')
            return null;
        }
        var file = fileInput.files[0];
        if (file.type !== 'application/json') {
            alert('不是有效的json文件!');
            return null;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            Json2Cookie(JSON.parse(data))
            location.reload();
        };
        reader.readAsText(file);
    }
    fileInput.click();
}

function Json2Cookie(json) {
    cleanCookie()
    for (var json_key in json) {
        if (json_key === 'umbrella') {
            json[json_key] = Array.from(new Set(json[json_key]));
        }
        setCookie(json_key, JSON.stringify(json[json_key]));
    }
}

function getLanguage() {
    var global_json = getGlobalJson();
    if (global_json != null) {
        if (global_json['language'] != null) {
            return global_json['language']
        }
        return 'english';
    } else {
        return null;
    }
}

function getGameTime() {
    var time_offset = getTimeOffset();
    var real_now_time = new Date();
    var now_time = new Date(real_now_time.getTime() + time_offset * 60000);
    return now_time
}

function getGameMonths() {
    var time_offset = getTimeOffset();
    var real_now_time = new Date();
    var now_time = new Date(real_now_time.getTime() + time_offset * 60000);
    return now_time.getMonth() + 1
}

function getGameHours() {
    var time_offset = getTimeOffset();
    var real_now_time = new Date();
    var now_time = new Date(real_now_time.getTime() + time_offset * 60000);
    return now_time.getHours()
}

function getHemisphere() {
    var global_json = getGlobalJson();
    if (global_json != null) {
        if (global_json['hemisphere'] != null) {
            return global_json['hemisphere']
        }
        global_json['hemisphere'] = 'north'
        saveGlobalJson(global_json);
        return global_json['hemisphere'];
    } else {
        global_json = {'hemisphere': 'north'}
        saveGlobalJson(global_json);
        return global_json['hemisphere'];
    }
}

function getRealTimeFlag() {
    var global_json = getGlobalJson();
    if (global_json != null) {
        if (global_json['is_real_time_flag'] != null) {
            return global_json['is_real_time_flag']
        }
        global_json['is_real_time_flag'] = true
        saveGlobalJson(global_json);
        return global_json['is_real_time_flag'];
    } else {
        global_json = {'is_real_time_flag': true}
        saveGlobalJson(global_json);
        return global_json['is_real_time_flag'];
    }
}

function getTimeOffset() {
    var global_json = getGlobalJson();
    if (global_json != null) {
        if (global_json['time_offset'] != null) {
            return global_json['time_offset']
        }
        global_json['time_offset'] = 0
        saveGlobalJson(global_json);
        return global_json['time_offset'];
    } else {
        global_json = {'time_offset': 0}
        saveGlobalJson(global_json);
        return global_json['time_offset'];
    }
}

function getPageJson(page_name) {
    const current_user_json = getSelectedUserJson();
    return current_user_json.page[page_name]
}

function savePageJson(page_name, json) {
    const current_user_json = getSelectedUserJson();
    current_user_json.page[page_name] = json;
    saveUserJson(current_user_json.info.name, current_user_json)
}

function getGlobalJson() {
    const current_user_json = getSelectedUserJson();
    return current_user_json.global;
}

function saveGlobalJson(json) {
    const current_user_json = getSelectedUserJson();
    current_user_json.global = json;
    saveUserJson(current_user_json.info.name, current_user_json)
}

function getInfoJson() {
    const current_user_json = getSelectedUserJson();
    return current_user_json.info;
}

function saveInfoJson(json) {
    const current_user_json = getSelectedUserJson();
    current_user_json.info = json;
    saveUserJson(current_user_json.info.name, current_user_json)
}

function saveUserJson(user_name, json) {
    var user_json = getUserJson(user_name)
    if (user_json != null) {
        delCookie(user_name);
        setCookie(user_name, JSON.stringify(json));
    } else {
        setCookie(user_name, JSON.stringify(json));
    }
}

function createDefaultUser() {
    var user_json = {
        "info": {"name": "anonymous"},
        "global": {},
        "page": {},
        "is_default": true,
        "is_selected": true
    }
    saveUserJson("anonymous", user_json)
    return user_json
}

function createUser(name, user_json) {
    if ((JSON.stringify(user_json) === "{}")) {
        user_json = {
            "info": {"name": name},
            "global": {},
            "page": {},
            "is_default": false,
            "is_selected": true
        }
    }
    cancelSelectionOtherUser();
    saveUserJson(name, user_json);
}

function deleteUser(name) {
    var usernames = getAllUserName();
    var user_json = getUserJson(name);
    if (user_json != null) {
        var r = window.confirm("是否删除用户: [" + name + "]");
        if (r === true) {
            delCookie(name);
            if (usernames.length === 1) {
                createDefaultUser();
            } else {
                cancelSelectionOtherUser();
                setDefault2Selected();
            }
            goto_home_page();
        } else {
            console.log("取消删除用户!");
        }

    }
}

function cancelSelectionOtherUser() {
    var user_names = getAllUserName();
    console.log(user_names)
    if (user_names) {
        for (var i = user_names.length; i--;) {
            var user_json = getUserJson(user_names[i])
            if (user_json != null) {
                user_json.is_selected = false;
                saveUserJson(user_names[i], user_json)
            }
        }
    }
}

function cancelDefaultOtherUser() {
    var user_names = getAllUserName();
    console.log(user_names)
    if (user_names) {
        for (var i = user_names.length; i--;) {
            var user_json = getUserJson(user_names[i])
            if (user_json != null) {
                user_json.is_default = false;
                saveUserJson(user_names[i], user_json)
            }
        }
    }
}

function setDefault2Selected() {
    var user_names = getAllUserName();
    var isok = false;
    if (user_names) {
        for (var i = user_names.length; i--;) {
            var user_json = getUserJson(user_names[i])
            if (user_json != null && user_json.is_default) {
                user_json.is_selected = true;
                saveUserJson(user_names[i], user_json);
                isok = true;
                break
            }
        }
        if (!isok) {
            user_json = getUserJson(user_names[0])
            user_json.is_default = true;
            user_json.is_selected = true;
            saveUserJson(user_names[0], user_json);
        }
    }
}

function getDefaultUserJson() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    var user_json;
    console.log(keys)
    if (keys) {
        for (var i = keys.length; i--;) {
            var value = getCookie(keys[i]);
            if (value != null) {
                user_json = JSON.parse(value);
                if (user_json.is_default) {
                    return user_json
                }
            }
        }
        value = getCookie(keys[0]);
        user_json = JSON.parse(value);
        user_json.is_default = true;
        saveUserJson(keys[0], user_json)
        return user_json
    } else {
        return createDefaultUser()
    }
}

function getSelectedUserJson() {
    var user_names = getAllUserName();
    var user_json;
    if (user_names) {
        for (var i = user_names.length; i--;) {
            var value = getCookie(user_names[i]);
            if (value != null) {
                user_json = JSON.parse(value);
                if (user_json.is_selected) {
                    return user_json
                }
            }
        }
        value = getCookie(user_names[0]);
        user_json = JSON.parse(value);
        user_json.is_selected = true;
        saveUserJson(user_names[0], user_json)
        return user_json
    } else {
        return createDefaultUser()
    }
}

function getUserJson(user_name) {
    var user_json = getCookie(user_name);
    if (user_json != null) {
        return JSON.parse(user_json);
    } else {
        return null;
    }
}

function getAllUserName() {
    return document.cookie.match(/[^ =;]+(?=\=)/g)
}

