var reaction_data = null;

var current_page = 1;

var max_page = 10;
var max_item = 18;

var name_flag = null;
var own_flag = null;
var selected_id = null;

function reaction_page_onload() {
    all_page_onload();
    name_flag = null;
    own_flag = null;
    selected_id = null;
    load_reaction_db();
}

function onChangeSelectedReaction() {
    var i = 0;
    if (reaction_data != null) {
        if (selected_id == null) {
            selected_id = reaction_data[0].id;
        }
        var language = getLanguage();
        var selected_reaction_pic = document.getElementById("selected_reaction_pic");
        var selected_reaction_name = document.getElementById("selected_reaction_name");
        for (i = 0; i < reaction_data.length; i++) {
            if (reaction_data[i].id === selected_id) {
                selected_reaction_pic.src = './images/reaction_png/' + reaction_data[i].pic_name;
                selected_reaction_pic.src = './images/reaction_gif/' + reaction_data[i].name.english + ".gif";
                selected_reaction_name.innerText = reaction_data[i]['name'][language];
                window.location.href = "#one"
                break
            }
        }

    }
}

function onReactionSearch(element) {
    var reaction_name = document.getElementById('reaction_name');
    var reaction_dradio_true = document.getElementById('reaction_dradio_true');
    var reaction_dradio_false = document.getElementById('reaction_dradio_false');
    var current_name = null;
    if (reaction_name.value !== '') {
        current_name = reaction_name.value;
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
            load_reaction_db();
        }
    } else {
        if (reaction_dradio_true.checked) {
            own_flag = true;
        } else if (reaction_dradio_false.checked) {
            own_flag = false;
        } else {
            own_flag = null;
        }
        load_reaction_db();
    }
}

function onReactionReset() {
    var reaction_name = document.getElementById('reaction_name');
    var reaction_dradio_all = document.getElementById('reaction_dradio_all');
    reaction_name.value = '';
    reaction_dradio_all.checked = true;
    selected_id = null;
    current_page = 1;
    reaction_page_onload();
}

function get_reaction_img_div(url) {
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

function change_reaction_own_flag(id) {
    var page_json = getPageJson('reaction')
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
    savePageJson('reaction', page_json)
    onReactionSearch(null);
}

function get_reaction_node_div(id, url, name, flag) {
    var img_div = get_reaction_img_div(url);

    img_div.onclick = function () {
        selected_id = id;
        onChangeSelectedReaction();
    }

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
        selected_id = id;
        change_reaction_own_flag(id);
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

function filter_reaction_data() {
    if (reaction_data != null) {
        var i;
        var page_json = getPageJson('reaction')
        // clean data
        for (i = 0; i < reaction_data.length; i++) {
            reaction_data[i].show_flag = 1;
            reaction_data[i].own_flag = 0;
        }
        // get own cookie
        if (page_json != null) {
            for (i = 0; i < reaction_data.length; i++) {
                if (page_json.includes(reaction_data[i].id)) {
                    reaction_data[i].own_flag = 1
                }
            }
        }
        // filter name data
        if (name_flag != null) {
            console.log('name filter')
            for (i = 0; i < reaction_data.length; i++) {
                if (reaction_data[i].show_flag === 1) {
                    reaction_data[i].show_flag = 0
                    for (var p in reaction_data[i].name) {
                        if (reaction_data[i].name[p].indexOf(name_flag) > -1) {
                            reaction_data[i].show_flag = 1
                            break;
                        }
                    }
                }
            }
        }

        // filter own data
        if (own_flag != null) {
            console.log('own filter')
            for (i = 0; i < reaction_data.length; i++) {
                if (reaction_data[i].show_flag === 1) {
                    if (own_flag) {
                        reaction_data[i].show_flag = reaction_data[i].own_flag
                    } else {
                        reaction_data[i].show_flag = reaction_data[i].own_flag ^ 1
                    }
                }
            }
        }
    }
}

function update_reaction_page() {
    var i = 0;
    if (reaction_data != null) {
        var language = getLanguage();
        var show_size = 0;
        var start_i = (current_page - 1) * max_item;
        var end_i = current_page * max_item;

        var items_div = document.getElementById('items_div');
        cleanElementChild(items_div);
        reaction_data.sort(function (a, b) {
            var nameA = a['id'];
            var nameB = b['id'];
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
        for (i = 0; i < reaction_data.length; i++) {
            if (reaction_data[i].show_flag === 1) {
                if (show_size >= start_i && show_size < end_i) {
                    var node_div = get_reaction_node_div(
                        id = reaction_data[i].id,
                        url = './images/reaction_png/' + reaction_data[i].pic_name,
                        name = reaction_data[i]['name'][language],
                        flag = reaction_data[i].own_flag)
                    items_div.appendChild(node_div);
                }
                show_size++;
            }
        }
        max_page = Math.ceil(show_size / max_item);
        update_pagination(onReactionSearch);
        // input
        var input = document.getElementById("reaction_name");
        input.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("reaction_search_btn").click();
            }
        });
    }
}

function load_reaction_db() {
    if (reaction_data != null) {
        filter_reaction_data();
        update_reaction_page();
        onChangeSelectedReaction();
        init_language();
    } else {
        var request = new XMLHttpRequest();
        request.open("get", 'db/json/reaction.json');
        request.send(null);
        request.onload = function () {
            if (request.status === 200) {
                reaction_data = JSON.parse(request.responseText);
                filter_reaction_data();
                update_reaction_page();
                onChangeSelectedReaction();
                init_language();
            } else {
                window.alert("load data Error!");
                goto_home_page();
            }
        }
    }
}