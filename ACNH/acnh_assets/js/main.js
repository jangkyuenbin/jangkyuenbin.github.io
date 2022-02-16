var language_data = null;

function isIntNum(val) {
    var regPos = / ^\d+$/; // 非负整数
    var regNeg = /^\-[1-9][0-9]*$/; // 负整数
    if (regPos.test(val) && regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}

function isPositiveInteger(s) {//是否为正整数
    var re = /^[0-9]+$/;
    return re.test(s)
}

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

function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

function insertAfter(referenceNode, newNode) {
    console.log(newNode)
    console.log(referenceNode.nextSibling)
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function setMenufunc() {
    var menu_form = document.getElementById('menu_form');
    var user_form = document.getElementById("user_form");
    var import_btn_text = document.getElementById("import_btn_text");
    var reset_btn_text = document.getElementById("reset_btn_text");
    var download_btn_text = document.getElementById("download_btn_text");

    if (menu_form != null) {
        menu_form.onchange = function () {
            menu_form_change();
        }
    }

    if (user_form != null) {
        user_form.onchange = function () {
            change_user();
        }
    }
    if (import_btn_text != null) {
        import_btn_text.onclick = function () {
            uploadUserJson();
        }
    }
    if (reset_btn_text != null) {
        reset_btn_text.onclick = function () {
            resetGlobalSettings();
        }
    }
    if (download_btn_text != null) {
        download_btn_text.onclick = function () {
            downloadCurrentUserJson();
        }
    }
}


function menu_onload() {
    var language_select = document.getElementById('language-category')
    var user_select = document.getElementById('user-category')
    const current_user_json = getSelectedUserJson();
    var language = getLanguage();

    setMenufunc();

    if (user_select != null && language_select != null) {
        while (user_select.firstChild) {
            user_select.removeChild(user_select.firstChild);
        }
        var all_user_names = getAllUserName();
        for (var i = 0; i < language_select.options.length; i++) {
            if (language_select.options[i].value === language) {
                language_select.options[i].selected = true;
                break;
            }
        }

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

function get_new_flag_img() {
    var img = document.createElement('img');
    img.src = "./images/flag_png/new.png"
    img.style.borderRadius = "10px";
    img.style.position = "absolute";
    img.style.left = "0px";
    img.style.top = "0px";
    img.style.width = "20%";
    return img
}

function get_pass_flag_img() {
    var img = document.createElement('img');
    img.src = "./images/flag_png/pass.png"
    img.style.borderRadius = "10px";
    img.style.position = "absolute";
    img.style.right = "0px";
    img.style.top = "0px";
    img.style.width = "20%";
    return img
}

function get_fishable_flag_img() {
    var img = document.createElement('img');
    img.src = "./images/flag_png/fishable.png"
    img.style.borderRadius = "10px";
    img.style.position = "absolute";
    img.style.left = "0px";
    img.style.bottom = "0px";
    img.style.width = "20%";
    return img
}

function get_bugsable_flag_img() {
    var img = document.createElement('img');
    img.src = "./images/flag_png/catch.png"
    img.style.borderRadius = "10px";
    img.style.position = "absolute";
    img.style.left = "0px";
    img.style.bottom = "0px";
    img.style.width = "20%";
    return img
}

function get_coming_flag_img() {
    var img = document.createElement('img');
    img.src = "./images/flag_png/coming.png"
    img.style.borderRadius = "10px";
    img.style.position = "absolute";
    img.style.left = "0px";
    img.style.top = "0px";
    img.style.width = "20%";
    return img
}

function get_shadow_img(shadow_url) {
    var img = document.createElement('img');
    img.src = shadow_url
    img.style.borderRadius = "10px";
    img.style.position = "absolute";
    img.style.right = "0px";
    img.style.bottom = "0px";
    img.style.width = "20%";
    img.style.filter = "invert(1)";
    return img
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

function assign_element_language() {
    var language = getLanguage();
    var i;
    var result;
    for (var name_k in language_data) {
        var name_v = language_data[name_k];
        var objs = document.getElementsByClassName(name_k);
        var text;
        if (objs != null) {
            for (i = 0; i < objs.length; ++i) {
                text = name_v[language];
                if (objs[i].tagName === "INPUT") {
                    objs[i].placeholder = text;
                } else if (name_k.indexOf("category_all_text") > -1) {
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
                result = Object.keys(name_v).map(e => name_v[e]);
                result.push(result.shift());
                name_v = Object.fromEntries(new Map(Object.keys(name_v).map(function (e, i) {
                    return [e, result[i]];
                })));
                text = name_v[language];
                if (objs[i].tagName === "INPUT") {
                    objs[i].placeholder = text;
                } else {
                    objs[i].textContent = text;
                }
            }
        }

        objs = document.getElementsByClassName(name_k + "_right");
        if (objs != null) {
            for (i = 0; i < objs.length; ++i) {
                result = Object.keys(name_v).map(e => name_v[e]);
                result.push(result.shift());
                result.push(result.shift());
                name_v = Object.fromEntries(new Map(Object.keys(name_v).map(function (e, i) {
                    return [e, result[i]];
                })));
                text = name_v[language];
                if (objs[i].tagName === "INPUT") {
                    objs[i].placeholder = text;
                } else {
                    objs[i].textContent = text;
                }
            }
        }
    }
}

function init_language() {
    if (language_data != null) {
        assign_element_language();
    } else {
        var request = new XMLHttpRequest();
        request.open("get", 'db/json/language.json');
        request.send(null);
        request.onload = function () {
            if (request.status === 200) {
                language_data = JSON.parse(request.responseText);
                assign_element_language();
            } else {
                console.log('error');
            }
        }
    }

}