var current_page = 1;
var max_page = 10;
var max_item = 18;
var celeste_data = null;
var name_flag = null;
var own_flag = null;

function celeste_page_onload() {
    all_page_onload();
    name_flag = null;
    own_flag = null;
    load_celeste_db();
}

function onCelesteEnterPress(e) {
    console.log(e);
    if (e.which === 13) {
        console.log(e);
        alert("You've entered: ");
    }
}

function onCelesteReset() {
    var celeste_name = document.getElementById('celeste_name');
    var radio_00 = document.getElementById('celeste_radio_00');
    celeste_name.value = '';
    radio_00.checked = true;
    current_page = 1;
    celeste_page_onload();
}

function onCelesteSearch(element) {
    var celeste_name = document.getElementById('celeste_name');
    var radio_01 = document.getElementById('celeste_radio_01');
    var radio_02 = document.getElementById('celeste_radio_02');
    var current_name = null;
    if (celeste_name.value !== '') {
        current_name = celeste_name.value;
    }
    name_flag = current_name;
    if (element != null && element.tagName === "LABEL") {
        var radio = document.getElementById(element.htmlFor);
        if (!radio.checked) {
            if (radio.value === '1') {
                own_flag = true;
            } else if (radio.value === '2') {
                own_flag = false;
            } else {
                own_flag = null;
            }
            current_page = 1;
            load_celeste_db();
        }
    } else {
        if (radio_01.checked) {
            own_flag = true;
        } else if (radio_02.checked) {
            own_flag = false;
        } else {
            own_flag = null;
        }
        load_celeste_db();
    }
}

function get_celeste_img_div(url) {
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

function change_celeste_own_flag(id) {
    var page_json = getPageJson('celeste')
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
    savePageJson('celeste', page_json)
    onCelesteSearch(null);
}

function get_celeste_node_div(id, url, name, flag) {
    var img_div = get_celeste_img_div(url);
    var name_div = document.createElement('div');
    name_div.classList.add('border_b');
    name_div.style = "width: 100%;text-align: center;";
    if (name === "") {
        name_div.classList.add('not_translated_text');
    } else {
        name_div.textContent = name;
    }

    var flag_div = document.createElement('div');
    flag_div.classList.add('border_b');
    if (flag === 0) {
        flag_div.classList.add('not_owned_label_text');
    } else {
        flag_div.classList.add('owned_label_text');
    }
    flag_div.style = "width: 100%;text-align: center;";
    flag_div.onclick = function () {
        change_celeste_own_flag(id);
    }

    var div2 = document.createElement('div');
    div2.className = "row out_border";
    div2.appendChild(img_div);
    div2.appendChild(name_div);
    div2.appendChild(flag_div);

    var node_div = document.createElement('div');
    node_div.className = "col-2 col-6-small pd";
    node_div.appendChild(div2);
    return node_div
}

function filter_celeste_data() {
    if (celeste_data != null) {
        var i;
        var page_json = getPageJson('celeste')
        // clean data
        for (i = 0; i < celeste_data.length; i++) {
            celeste_data[i].show_flag = 1;
            celeste_data[i].own_flag = 0;
        }
        // get own cookie
        if (page_json != null) {
            for (i = 0; i < celeste_data.length; i++) {
                if (page_json.includes(celeste_data[i].id)) {
                    celeste_data[i].own_flag = 1
                }
            }
        }
        // filter name data
        if (name_flag != null) {
            console.log('name filter')
            for (i = 0; i < celeste_data.length; i++) {
                if (celeste_data[i].show_flag === 1) {
                    celeste_data[i].show_flag = 0
                    for (var p in celeste_data[i].name){
                        if (celeste_data[i].name[p].indexOf(name_flag) > -1){
                            celeste_data[i].show_flag = 1
                            break;
                        }
                    }
                }
            }
        }

        // filter own data
        if (own_flag != null) {
            console.log('own filter')
            for (i = 0; i < celeste_data.length; i++) {
                if (celeste_data[i].show_flag === 1) {
                    if (own_flag) {
                        celeste_data[i].show_flag = celeste_data[i].own_flag
                    } else {
                        celeste_data[i].show_flag = celeste_data[i].own_flag ^ 1
                    }
                }
            }
        }
    }
}

function update_celeste_page() {
    if (celeste_data != null) {
        var language = getLanguage();
        var i;
        var show_size = 0;
        var start_i = (current_page - 1) * max_item;
        var end_i = current_page * max_item;

        var items_div = document.getElementById('items_div');
        cleanElementChild(items_div);
        celeste_data.sort(function (a, b) {
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
        for (i = 0; i < celeste_data.length; i++) {
            if (celeste_data[i].show_flag === 1) {
                if (show_size >= start_i && show_size < end_i) {
                    var node_div = get_celeste_node_div(
                        id = celeste_data[i].id,
                        url = './images/celeste_png/' + celeste_data[i].pic_name,
                        name = celeste_data[i]['name'][language],
                        flag = celeste_data[i].own_flag)
                    items_div.appendChild(node_div);
                }
                show_size++;
            }
        }
        max_page = Math.ceil(show_size / max_item);
        update_pagination(onCelesteSearch);
        // input
        var input = document.getElementById("celeste_name");
        input.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("celeste_search_btn").click();
            }
        });
    }
}

function load_celeste_db() {
    if (celeste_data != null) {
        filter_celeste_data();
        update_celeste_page();
        init_language();
        window.location.href = "#two"
    } else {
        var request = new XMLHttpRequest();
        request.open("get", 'db/json/celeste.json');
        request.send(null);
        request.onload = function () {
            if (request.status === 200) {
                celeste_data = JSON.parse(request.responseText);
                filter_celeste_data();
                update_celeste_page();
                init_language();
            } else {
                window.alert("load data Error!");
                goto_home_page();
            }
        }
    }
}
