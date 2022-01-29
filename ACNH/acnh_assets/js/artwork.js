var artwork_data = null;
var name_flag = null;
var donate_flag = null;

function artwork_page_onload() {
    all_page_onload();
    name_flag = null;
    donate_flag = null;
    load_artwork_db();
}

function onMouseIn(ele) {
    ele.className = 'img_dec_box img_dec_txtShow';
}

function onMouseOut(ele) {
    ele.className = 'img_dec_box';
}

function onArtworkSearch(element) {
    var artwork_name = document.getElementById('artwork_name');
    var radio_01 = document.getElementById('artwork_radio_01');
    var radio_02 = document.getElementById('artwork_radio_02');
    var current_name = null;
    if (artwork_name.value !== '') {
        current_name = artwork_name.value;
    }
    name_flag = current_name;
    if (element != null && element.tagName === "LABEL") {
        var radio = document.getElementById(element.htmlFor);
        if (!radio.checked) {
            if (radio.value === '1') {
                donate_flag = true;
            } else if (radio.value === '2') {
                donate_flag = false;
            } else {
                donate_flag = null;
            }
            load_artwork_db();
        }
    } else {
        if (radio_01.checked) {
            donate_flag = true;
        } else if (radio_02.checked) {
            donate_flag = false;
        } else {
            donate_flag = null;
        }
        load_artwork_db();
    }
}

function onArtworkReset() {
    var artwork_name = document.getElementById('artwork_name');
    var radio_00 = document.getElementById('artwork_radio_00');
    artwork_name.value = '';
    radio_00.checked = true;
    artwork_page_onload();
}

function onArtworkDonateChange(id) {
    var page_json = getPageJson('artwork')
    if (page_json) {
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
    savePageJson('artwork', page_json)
    onArtworkSearch(null);
}


function get_img_box(img_url, text, p_class) {
    var div = document.createElement('div');
    div.classList.add('img_dec_box');
    div.onmouseover = function () {
        div.className = 'img_dec_box img_dec_txtShow';
    }
    div.onmouseout = function () {
        div.className = 'img_dec_box';
    }

    var img = document.createElement('img');
    img.src = './images/artwork_png/' + img_url;
    var p1 = document.createElement('p');
    p1.classList.add(p_class);
    var div2 = document.createElement('div');
    div2.classList.add('img_dec_mask');
    var p2 = document.createElement('p');
    p2.classList.add('img_dec_sub');
    p2.textContent = text;
    div.appendChild(img);
    div.appendChild(p1);
    div.appendChild(div2);
    div.appendChild(p2);
    return div
}

function get_img_td(real_img_url, fake_img_url, des, aut) {
    var td = document.createElement('td');
    td.classList.add("text_center");
    if (fake_img_url === "") {
        var img_div = get_img_box(real_img_url, des, "artwork_real_text");
        td.appendChild(img_div);
        return td
    } else {
        var div_row = document.createElement('div');
        div_row.classList.add("row");
        var div01 = document.createElement('div');
        div01.classList.add("col-6")
        div01.classList.add("col-12-xsmall")
        var div02 = document.createElement('div');
        div02.classList.add("col-6")
        div02.classList.add("col-12-xsmall")

        var real_box = get_img_box(real_img_url, des, "artwork_real_text");
        var fake_box = get_img_box(fake_img_url, aut, "artwork_fake_text");
        div01.appendChild(real_box);
        div02.appendChild(fake_box);
        div_row.appendChild(div01);
        div_row.appendChild(div02);
        td.appendChild(div_row);
        return td
    }
}

function get_artwork_tr(data, language) {
    var tr = document.createElement('tr');
    var img_td = get_img_td(
        data.real_pic_name,
        data.fake_pic_name,
        data.description[language],
        data.authenticity[language])
    var td02 = document.createElement('td');
    td02.classList.add("text_center");
    var td03 = document.createElement('td');
    td03.classList.add("text_center");
    td02.textContent = data.name[language];
    if (data.donate_flag === 0) {
        td03.classList.add('not_donated_label_text');
    } else {
        td03.classList.add('donated_label_text');
    }

    td03.onclick = function () {
        onArtworkDonateChange(data.id);
    };

    tr.appendChild(img_td);
    tr.appendChild(td02);
    tr.appendChild(td03);
    return tr
}

function filter_artwork_data() {
    if (artwork_data != null) {
        var i;
        var page_json = getPageJson('artwork')
        // clean data
        for (i = 0; i < artwork_data.length; i++) {
            artwork_data[i].show_flag = 1;
            artwork_data[i].donate_flag = 0;
        }
        // get donate cookie
        if (page_json) {
            for (i = 0; i < artwork_data.length; i++) {
                if (page_json.includes(artwork_data[i].id)) {
                    artwork_data[i].donate_flag = 1
                }
            }
        }
        // filter name data
        if (name_flag != null) {
            console.log('name filter')
            for (i = 0; i < artwork_data.length; i++) {
                if (artwork_data[i].show_flag === 1) {
                    artwork_data[i].show_flag = 0
                    for (var p in artwork_data[i].name) {
                        if (artwork_data[i].name[p].indexOf(name_flag) > -1) {
                            artwork_data[i].show_flag = 1
                            break;
                        }
                    }
                }
            }
        }

        // filter donate data
        if (donate_flag != null) {
            console.log('donate filter')
            for (i = 0; i < artwork_data.length; i++) {
                if (artwork_data[i].show_flag === 1) {
                    if (donate_flag) {
                        artwork_data[i].show_flag = artwork_data[i].donate_flag
                    } else {
                        artwork_data[i].show_flag = artwork_data[i].donate_flag ^ 1
                    }
                }
            }
        }
    }
}

function update_artwork_page() {
    if (artwork_data != null) {
        var language = getLanguage();
        var i;
        var summary = 0;
        var items_div = document.getElementById('artwork_table_body');

        cleanElementChild(items_div);
        artwork_data.sort(function (a, b) {
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
        for (i = 0; i < artwork_data.length; i++) {
            if (artwork_data[i].show_flag === 1) {
                var tr = get_artwork_tr(artwork_data[i], language)
                items_div.appendChild(tr);
            }
        }
        // input
        var input = document.getElementById("artwork_name");
        input.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("artwork_search_btn").click();
            }
        });
    }
}

function load_artwork_db() {
    if (artwork_data != null) {
        filter_artwork_data();
        update_artwork_page();
        init_language();
        window.location.href = "#two"
    } else {
        var request = new XMLHttpRequest();
        request.open("get", 'db/json/artwork.json');
        request.send(null);
        request.onload = function () {
            if (request.status === 200) {
                artwork_data = JSON.parse(request.responseText);
                filter_artwork_data();
                update_artwork_page();
                console.log(artwork_data);
                init_language();
            } else {
                window.alert("load data Error!");
                goto_home_page();
            }
        }
    }
}
