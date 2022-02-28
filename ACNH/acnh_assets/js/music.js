var current_page = 1;
var max_page = 10;
var max_item = 18;
var music_data = null;
var name_flag = null;
var own_flag = null;
var playing_id = null;

function music_page_onload() {
    all_page_onload();
    name_flag = null;
    own_flag = null;
    playing_id = null;
    load_music_db();
    document.addEventListener("load", function () {
        play_music();
    });
}

function play_music() {
    var player = document.getElementById("player");
    if (player) {
        player.play().catch(function () {
            // do something
        });
    }
}

function onMusicSearch(element) {
    var music_name = document.getElementById('music_name');
    var radio_01 = document.getElementById('music_radio_01');
    var radio_02 = document.getElementById('music_radio_02');
    var current_name = null;
    if (music_name.value !== '') {
        current_name = music_name.value;
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
            load_music_db();
        }
    } else {
        if (radio_01.checked) {
            own_flag = true;
        } else if (radio_02.checked) {
            own_flag = false;
        } else {
            own_flag = null;
        }
        load_music_db();
    }
}

function onMusicReset() {
    var music_name = document.getElementById('music_name');
    var radio_00 = document.getElementById('music_radio_00');
    var radio_03 = document.getElementById('music_radio_03');
    music_name.value = '';
    radio_00.checked = true;
    radio_03.checked = true;
    playing_id = null;
    current_page = 1;
    music_page_onload();
}

function onChangePlayerMusic(element) {
    if (playing_id == null) {
        playing_id = music_data[0].id;
    }
    if (music_data != null) {
        var language = getLanguage();
        var play_music_pic = document.getElementById('play_music_pic');
        var play_music_name = document.getElementById('play_music_name');
        var player = document.getElementById('player');
        var flag = false;
        if (element != null && element.tagName === "LABEL") {
            var radio = document.getElementById(element.htmlFor);
            if (radio.value === "0") {
                flag = true;
            }
        } else {
            var radio_03 = document.getElementById('music_radio_03');
            if (radio_03.checked) {
                flag = true;
            }
        }
        for (i = 0; i < music_data.length; i++) {
            if (music_data[i].id === playing_id) {
                play_music_pic.src = './images/music_png/' + music_data[i].pic_name;
                play_music_name.innerText = music_data[i]['name'][language];
                var new_src;
                var new_name;
                if (flag) {
                    new_src = './music/live/' + music_data[i].live_name.split(".")[0] + ".mp3";
                    new_name = music_data[i].live_name;
                } else {
                    new_src = './music/aircheck/' + music_data[i].aircheck_name;
                    new_name = music_data[i].aircheck_name;
                }
                var old_src = player.src.split('/').pop();
                if (old_src !== new_name) {
                    player.src = new_src;
                    player.play().catch(function () {
                        // do something
                    });
                }
            }
        }
    }
}


function get_music_img_div() {
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

function change_music_own_flag(id) {
    var page_json = getPageJson('music')
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
    savePageJson('music', page_json)
    onMusicSearch(null);
}

function get_music_node_div(id, url, name, flag) {
    var img_div = get_music_img_div(url);

    img_div.onclick = function () {
        playing_id = id;
        onChangePlayerMusic(null);
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
        playing_id = id;
        change_music_own_flag(id);
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

function filter_music_data() {
    if (music_data != null) {
        var i;
        var page_json = getPageJson('music')
        // clean data
        for (i = 0; i < music_data.length; i++) {
            music_data[i].show_flag = 1;
            music_data[i].own_flag = 0;
        }
        // get own cookie
        if (page_json != null) {
            for (i = 0; i < music_data.length; i++) {
                if (page_json.includes(music_data[i].id)) {
                    music_data[i].own_flag = 1
                }
            }
        }
        // filter name data
        if (name_flag != null) {
            console.log('name filter')
            for (i = 0; i < music_data.length; i++) {
                if (music_data[i].show_flag === 1) {
                    music_data[i].show_flag = 0
                    for (var p in music_data[i].name) {
                        if (music_data[i].name[p].indexOf(name_flag) > -1) {
                            music_data[i].show_flag = 1
                            break;
                        }
                    }
                }
            }
        }

        // filter own data
        if (own_flag != null) {
            console.log('own filter')
            for (i = 0; i < music_data.length; i++) {
                if (music_data[i].show_flag === 1) {
                    if (own_flag) {
                        music_data[i].show_flag = music_data[i].own_flag
                    } else {
                        music_data[i].show_flag = music_data[i].own_flag ^ 1
                    }
                }
            }
        }
    }
}

function update_music_page() {
    if (music_data != null) {
        var language = getLanguage();
        var show_size = 0;
        var start_i = (current_page - 1) * max_item;
        var end_i = current_page * max_item;

        var items_div = document.getElementById('items_div');
        cleanElementChild(items_div);
        music_data.sort(function (a, b) {
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
        for (i = 0; i < music_data.length; i++) {
            if (music_data[i].show_flag === 1) {
                if (show_size >= start_i && show_size < end_i) {
                    var node_div = get_music_node_div(
                        id = music_data[i].id,
                        url = './images/music_png/' + music_data[i].pic_name,
                        name = music_data[i]['name'][language],
                        flag = music_data[i].own_flag)
                    items_div.appendChild(node_div);
                }
                show_size++;
            }
        }
        max_page = Math.ceil(show_size / max_item);
        update_pagination(onMusicSearch);
        // input
        var input = document.getElementById("music_name");
        input.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("music_search_btn").click();
            }
        });
    }
}

function load_music_db() {
    if (music_data != null) {
        filter_music_data();
        update_music_page();
        onChangePlayerMusic(null);
        init_language();
        window.location.href = "#two"
    } else {
        var request = new XMLHttpRequest();
        request.open("get", 'db/json/music.json');
        request.send(null);
        request.onload = function () {
            if (request.status === 200) {
                music_data = JSON.parse(request.responseText);
                filter_music_data();
                update_music_page();
                onChangePlayerMusic(null);
                init_language();
            } else {
                window.alert("load data Error!");
                goto_home_page();
            }
        }
    }
}