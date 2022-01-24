function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele !== value;
    });
}

function goto_page(url) {
    window.location.href = url
}

function goto_home_page() {
    window.location.href = "./index.html";
}

function cleanElementChild(ele) {
    while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
    }
}

function menu_onload() {
    var language_select = document.getElementById('language-category')
    var user_select = document.getElementById('user-category')
    const current_user_json = getSelectedUserJson();
    var index = '0';
    if (current_user_json.global.language != null) {
        index = current_user_json.global.language;
    }
    if (user_select != null && language_select != null) {
        while (user_select.firstChild) {
            user_select.removeChild(user_select.firstChild);
        }
        var all_user_names = getAllUserName();
        language_select.options[parseInt(index)].selected = true;

        if (all_user_names != null) {
            for (var i = 0; i < all_user_names.length; i++) {
                const opt = document.createElement('option');
                opt.value = all_user_names[i];
                opt.textContent = all_user_names[i];
                if (current_user_json.info.name === all_user_names[i]) {
                    opt.selected = true;
                }
                user_select.appendChild(opt)
            }
        } else {
            const opt = document.createElement('option');
            opt.value = "none";
            opt.textContent = "-未注册-";
            user_select.appendChild(opt)
        }
    }
}

function all_page_onload() {
    menu_onload();
}

function menu_form_change() {
    var select = document.getElementById('language-category')
    var index = select.selectedIndex;
    var global_json = getGlobalJson();
    if (global_json != null) {
        global_json['language'] = select.options[index].value
    } else {
        global_json = {'language': select.options[index].value}
    }
    saveGlobalJson(global_json);
    location.reload();
}

function change_user() {
    var user_select = document.getElementById('user-category')
    var index = user_select.selectedIndex;
    console.log(user_select.options[index].value);
    cancelSelectionOtherUser();
    const selected_user_json = getUserJson(user_select.options[index].value);
    selected_user_json.is_selected = true;
    saveUserJson(user_select.options[index].value, selected_user_json);
    location.reload();
}

function getPrevDiv(onPageSearch) {
    var prev_btn = document.createElement('span');
    prev_btn.classList.add("button")
    prev_btn.classList.add("small")
    prev_btn.classList.add("prev_text")
    if (current_page === 1) {
        prev_btn.classList.add("disabled")
    }
    var prev_li = document.createElement('li');
    prev_li.onclick = function () {
        if (current_page > 1) {
            current_page = current_page - 1;
            onPageSearch(null);
        }
    };
    prev_li.appendChild(prev_btn)
    return prev_li
}

function getNextDiv(onPageSearch) {
    var next_btn = document.createElement('span');
    next_btn.classList.add("button")
    next_btn.classList.add("small")
    next_btn.classList.add("next_text")
    if (current_page === max_page) {
        next_btn.classList.add("disabled")
    }
    var next_li = document.createElement('li');
    next_li.onclick = function () {
        if (current_page < max_page) {
            current_page = current_page + 1;
            onPageSearch(null);
        }
    };
    next_li.appendChild(next_btn)
    return next_li
}

function getNavPageDiv(onPageSearch, page_id) {
    var a = document.createElement('a');
    a.classList.add('page');
    a.textContent = page_id;
    if (page_id === current_page) {
        a.classList.add("active");
    }
    var li = document.createElement('li');
    li.onclick = function () {
        if (page_id <= max_page && page_id >= 1) {
            current_page = page_id;
            onPageSearch(null);
        }
    };
    li.appendChild(a);
    return li
}

function update_pagination(onPageSearch) {
    // update pagination
    var i = 0;
    var nav_page;
    var pagination = document.getElementById('pagination');
    if (pagination != null) {
        cleanElementChild(pagination);
        if (max_page > 1) {
            var prev = getPrevDiv(onPageSearch);
            var next = getNextDiv(onPageSearch);
            pagination.appendChild(prev);
            if (max_page <= 7) {
                for (i = 0; i < max_page; i++) {
                    nav_page = getNavPageDiv(onPageSearch, i + 1);
                    pagination.appendChild(nav_page);
                }
            } else {
                for (i = 1; i <= 7; i++) {
                    if (current_page + 3 <= max_page) {
                        nav_page = getNavPageDiv(onPageSearch, Math.max([current_page - 4 + i, 1]));
                    } else {
                        nav_page = getNavPageDiv(onPageSearch, max_page - 7 + i);
                    }
                    pagination.appendChild(nav_page);
                }
            }
            pagination.appendChild(next);
        }
    }
}

function init_language() {
    var url = 'db/json/language.json'
    var request = new XMLHttpRequest();
    var i = 0;
    var language = '0';
    const current_user_json = getSelectedUserJson();
    if (current_user_json.global.language != null) {
        language = current_user_json.global.language;
    }
    // 设置请求方法与路径
    request.open("get", url);
    // 不发送数据到服务器
    request.send(null);
    //XHR对象获取到返回信息后执行
    request.onload = function () {
        // 返回状态为200，即为数据获取成功
        if (request.status == 200) {
            var language_json = JSON.parse(request.responseText);
            var i = 0;
            for (var name_k in language_json) {
                var name_v = language_json[name_k];
                var objs = document.getElementsByClassName(name_k);
                var text;
                if (objs != null) {
                    for (i = 0; i < objs.length; ++i) {
                        if (language === '0') {
                            text = name_v.english;
                        } else if (language === '1') {
                            text = name_v.chinese;
                        } else if (language === '2') {
                            text = name_v.japanese;
                        }
                        if (objs[i].tagName === "INPUT") {
                            objs[i].placeholder = text;
                        } else if (name_k === "umbrella_category_all_text") {
                            var span = document.createElement('span');
                            span.classList.add('icon_more');
                            objs[i].textContent = text;
                            objs[i].appendChild(span);
                        } else {
                            objs[i].textContent = text;
                        }

                    }
                }

                objs = document.getElementsByClassName(name_k + "_left");
                if (objs != null) {
                    for (i = 0; i < objs.length; ++i) {
                        if (language === '0') {
                            text = name_v.chinese;
                        } else if (language === '1') {
                            text = name_v.japanese;
                        } else if (language === '2') {
                            text = name_v.english;
                        }
                        if (objs[i].tagName === "INPUT") {
                            console.log(objs[i])
                            console.log(objs[i].tagName)
                            objs[i].placeholder = text;
                        } else {
                            objs[i].textContent = text;
                        }
                    }
                }

                objs = document.getElementsByClassName(name_k + "_right");
                if (objs != null) {
                    for (i = 0; i < objs.length; ++i) {
                        if (language === '0') {
                            text = name_v.japanese;
                        } else if (language === '1') {
                            text = name_v.english;
                        } else if (language === '2') {
                            text = name_v.chinese;
                        }
                        if (objs[i].tagName === "INPUT") {
                            console.log(objs[i])
                            console.log(objs[i].tagName)
                            objs[i].placeholder = text;
                        } else {
                            objs[i].textContent = text;
                        }
                    }
                }

            }
        } else {
            console.log('error');
        }
    }
}