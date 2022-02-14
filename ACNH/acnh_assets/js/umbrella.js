var checkbox_select_list = [];
var current_page = 1;
var max_page = 10;
var max_item = 18;
var tmp_inner_text = '';

var umbrella_data = null;
var name_flag = null;
var own_flag = null;

function umbrella_page_onload() {
    all_page_onload();
    name_flag = null;
    own_flag = null;
    load_umbrella_db();
    var multi_select_content = document.getElementById('multi_select_content');
    var umbrella_category = document.getElementById('umbrella_category');
    multi_select_content.style.display = "none";

    document.onclick = function () {
        if (multi_select_content.style.display !== "none") {
            multi_select_content.style.display = "none";
            onUmbrellaSearch(null);
        }
    }

    umbrella_category.addEventListener('click', function (e) {
        stopFunc(e);
        multi_select_content.style.display = "";
    }, false)
    multi_select_content.addEventListener('click', function (e) {
        stopFunc(e);
    }, false)

    //阻止事件向上传递
    function stopFunc(e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }
}

function change_own_flag(id) {
    var page_json = getPageJson('umbrella')
    if (page_json != null) {
        if (page_json.includes(id)) {
            const index = page_json.indexOf(id);
            if (index > -1) {
                page_json.splice(index, 1);
            }
        } else {
            page_json.push(id)
        }
    } else {
        page_json = [id]
    }
    page_json = Array.from(new Set(page_json));
    page_json.sort(function (a, b) {
        return a - b
    });
    savePageJson('umbrella', page_json)
    onUmbrellaSearch(null);
}

function get_img_div(url) {
    var div = document.createElement('div');
    var img = document.createElement('img');
    img.style = "border-radius: 10px";
    img.className = "one";
    img.src = url;
    img.width = "100%";
    div.className = "border_tr";
    div.style = "width: 100%;";
    div.appendChild(img);
    return div
}

function get_node_div(id, url, name, source, flag) {
    var img_div = get_img_div(url);
    var name_div = document.createElement('div');
    name_div.classList.add('border_b');
    name_div.style = "width: 100%;text-align: center;";
    if (name === "") {
        name_div.classList.add('not_translated_text');
    } else {
        name_div.textContent = name;
    }

    var source_div = document.createElement('div');
    source_div.classList.add('border_b');
    source_div.style = "width: 100%;text-align: center;";
    source_div.textContent = source;

    var flag_div = document.createElement('div');
    flag_div.classList.add('border_b');
    if (flag === 0) {
        flag_div.classList.add('not_owned_label_text');
    } else {
        flag_div.classList.add('owned_label_text');
    }
    flag_div.style = "width: 100%;text-align: center;";
    flag_div.onclick = function () {
        change_own_flag(id);
    }

    var div2 = document.createElement('div');
    div2.className = "row out_border";
    div2.appendChild(img_div);
    div2.appendChild(name_div);
    div2.appendChild(source_div);
    div2.appendChild(flag_div);

    var node_div = document.createElement('div');
    node_div.className = "col-2 col-6-small pd";
    node_div.appendChild(div2);
    return node_div
}

function get_checkbox_div(checkBox_id, checkBox_label, is_check) {
    var checkBox_div = document.createElement("div")
    var checkBox = document.createElement("input");
    var label = document.createElement("label");
    checkBox_div.classList.add("col-12")
    checkBox_div.classList.add("col-12-small")
    checkBox_div.classList.add("multi_select_item")

    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", checkBox_id);
    checkBox.setAttribute("name", checkBox_label);
    checkBox.checked = is_check;

    checkBox.addEventListener('change', function (event) {
        var umbrella_category = document.getElementById('umbrella_category');
        var span = document.createElement('span');
        span.classList.add('icon_more');
        tmp_inner_text = umbrella_category.innerText;
        current_page = 1;
        if (event.currentTarget.checked) {
            checkbox_select_list.push(event.currentTarget.name);
            checkbox_select_list.sort();
        } else {
            checkbox_select_list = arrayRemove(checkbox_select_list, event.currentTarget.name);
        }

        var text = '';
        if (checkbox_select_list.length > 1) {
            umbrella_category.classList.remove("category_all_text")
            text = checkbox_select_list[0] + ", ...";
            umbrella_category.textContent = text;
        } else if (checkbox_select_list.length === 0) {
            umbrella_category.classList.add("category_all_text")
            umbrella_category.textContent = tmp_inner_text;
        } else {
            umbrella_category.classList.remove("category_all_text")
            umbrella_category.textContent = checkbox_select_list[0];
        }
        umbrella_category.appendChild(span);
    })

    label.htmlFor = checkBox_id;
    label.textContent = checkBox_label;

    checkBox_div.appendChild(checkBox);
    checkBox_div.appendChild(label);
    return checkBox_div;
}

function filter_umbrella_data() {
    var i;
    if (umbrella_data != null) {
        var page_json = getPageJson('umbrella')
        for (i = 0; i < umbrella_data.length; i++) {
            umbrella_data[i].show_flag = 1;
            umbrella_data[i].own_flag = 0;
        }

        if (page_json != null) {
            for (i = 0; i < umbrella_data.length; i++) {
                if (page_json.includes(umbrella_data[i].id)) {
                    umbrella_data[i].own_flag = 1
                }
            }
        }
        // filter name data
        if (name_flag != null) {
            console.log('name filter')
            for (i = 0; i < umbrella_data.length; i++) {
                if (umbrella_data[i].show_flag === 1) {
                    umbrella_data[i].show_flag = 0
                    for (var p in umbrella_data[i].name){
                        if (umbrella_data[i].name[p].indexOf(name_flag) > -1){
                            umbrella_data[i].show_flag = 1
                            break;
                        }
                    }
                }
            }
        }

        // filter own data
        if (own_flag != null) {
            for (i = 0; i < umbrella_data.length; i++) {
                if (umbrella_data[i].show_flag === 1) {
                    if (own_flag) {
                        umbrella_data[i].show_flag = umbrella_data[i].own_flag
                    } else {
                        umbrella_data[i].show_flag = umbrella_data[i].own_flag ^ 1
                    }
                }

            }
        }

        // filter cate data
        if (checkbox_select_list.length !== 0) {
            for (i = 0; i < umbrella_data.length; i++) {
                if (umbrella_data[i].show_flag === 1) {
                    if (checkbox_select_list.includes(umbrella_data[i].source.english) ||
                        checkbox_select_list.includes(umbrella_data[i].source.chinese) ||
                        checkbox_select_list.includes(umbrella_data[i].source.japanese)) {
                        umbrella_data[i].show_flag = 1
                    } else {
                        umbrella_data[i].show_flag = 0
                    }
                }

            }
        }
    }

}

function update_umbrella_page() {
    if (umbrella_data != null) {
        var language = getLanguage();
        var umbrella_category_array = [];
        var i = 0;
        var j = 0;
        var items_div = document.getElementById('items_div');
        while (items_div.firstChild) {
            items_div.removeChild(items_div.firstChild);
        }
        var start_i = (current_page - 1) * max_item;
        var end_i = current_page * max_item;

        umbrella_data.sort(function (a, b) {
            var nameA = a['name'][language];
            var nameB = b['name'][language];
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        for (i = 0; i < umbrella_data.length; i++) {
            if (umbrella_data[i].show_flag === 1) {
                if (j >= start_i && j < end_i) {
                    var node_div = get_node_div(
                        id = umbrella_data[i].id,
                        url = './images/umbrella_png/' + umbrella_data[i].pic_name,
                        name = umbrella_data[i]['name'][language],
                        source = umbrella_data[i]['source'][language],
                        flag = umbrella_data[i].own_flag)
                    items_div.appendChild(node_div);
                }
                j++;
            }
            umbrella_category_array.push(umbrella_data[i]['source'][language])
        }
        // update umbrella_category
        umbrella_category_array = Array.from(new Set(umbrella_category_array));
        umbrella_category_array.sort();
        var umbrella_category = document.getElementById('multi_select_content');
        if (umbrella_category != null) {
            while (umbrella_category.firstChild) {
                umbrella_category.removeChild(umbrella_category.firstChild);
            }
            for (i = 0; i < umbrella_category_array.length; i++) {
                var is_check = checkbox_select_list.includes(umbrella_category_array[i]);
                var div = get_checkbox_div("check_" + i.toString(), umbrella_category_array[i], is_check)
                umbrella_category.appendChild(div)
            }
        }

        // update pagination
        max_page = Math.ceil(j / max_item);
        update_pagination(onUmbrellaSearch);
        // input
        var input = document.getElementById("umbrella_name");
        input.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("umbrella_search_btn").click();
            }
        });
    }
}


function onUmbrellaSearch(element) {
    var umbrella_name = document.getElementById('umbrella_name');
    var radio_01 = document.getElementById('umbrella_radio_01');
    var radio_02 = document.getElementById('umbrella_radio_02');
    var current_name = null;
    if (umbrella_name.value !== '') {
        current_name = umbrella_name.value;
    }
    name_flag = current_name;
    if (element != null && element.tagName === "LABEL") {
        var radio = document.getElementById(element.htmlFor);
        if (!radio.checked) {
            if (radio.value === '1') {
                own_flag = true
            } else if (radio.value === '2') {
                own_flag = false
            } else {
                own_flag = null
            }
            current_page = 1;
            load_umbrella_db();
        }
    } else {
        if (radio_01.checked) {
            own_flag = true
        } else if (radio_02.checked) {
            own_flag = false
        } else {
            own_flag = null
        }
        load_umbrella_db();
    }
}

function onUmbrellaReset() {
    var umbrella_name = document.getElementById('umbrella_name');
    var umbrella_radio_00 = document.getElementById('umbrella_radio_00');
    var umbrella_category = document.getElementById('umbrella_category');
    umbrella_name.value = '';
    umbrella_radio_00.checked = true;
    checkbox_select_list = [];
    current_page = 1;
    umbrella_category.classList.add("category_all_text");
    umbrella_page_onload();
}

function load_umbrella_db() {
    if (umbrella_data != null) {
        filter_umbrella_data();
        update_umbrella_page();
        init_language();
    } else {
        var request = new XMLHttpRequest();
        request.open("get", 'db/json/umbrella.json');
        request.send(null);
        request.onload = function () {
            if (request.status === 200) {
                umbrella_data = JSON.parse(request.responseText);
                filter_umbrella_data();
                update_umbrella_page();
                init_language();
            } else {
                window.alert("load data Error!");
                goto_home_page();
            }
        }
    }

}