var fossil_data = null;
var name_flag = null;
var donate_flag = null;

function fossil_page_onload() {
    all_page_onload();
    name_flag = null;
    donate_flag = null;
    load_fossil_db();
}

function onFossilReset() {
    var fossil_name = document.getElementById('fossil_name');
    var radio_00 = document.getElementById('fossil_radio_00');
    fossil_name.value = '';
    radio_00.checked = true;
    fossil_page_onload();
}

function onFossilSearch(element) {
    var fossil_name = document.getElementById('fossil_name');
    var radio_01 = document.getElementById('fossil_radio_01');
    var radio_02 = document.getElementById('fossil_radio_02');
    var current_name = null;
    if (fossil_name.value !== '') {
        current_name = fossil_name.value;
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
            load_fossil_db();
        }
    } else {
        if (radio_01.checked) {
            donate_flag = true;
        } else if (radio_02.checked) {
            donate_flag = false;
        } else {
            donate_flag = null;
        }
        load_fossil_db();
    }
}

function onFossilDonateChange(id) {
    var page_json = getPageJson('fossil_donate')
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
    savePageJson('fossil_donate', page_json)
    onFossilSearch(null);
}

function onFossilRedundancyChange(id, value) {
    var page_json = getPageJson('fossil_redundancy')
    if (!page_json) {
        page_json = {};
    }
    page_json[id] = value;
    savePageJson('fossil_redundancy', page_json)
    onFossilSearch(null);
}

function get_fossil_tr(id, url, name, flag, rv) {
    var tr = document.createElement('tr');
    var img = document.createElement('img');
    var td01 = document.createElement('td');
    td01.classList.add("text_center");
    var td02 = document.createElement('td');
    td02.classList.add("text_center");
    var td03 = document.createElement('td');
    td03.classList.add("text_center");
    var td04 = document.createElement('td');
    td04.classList.add("text_center");
    var input = document.createElement('input');

    img.src = url;
    td01.appendChild(img);
    td02.textContent = name;
    if (flag === 0) {
        td03.classList.add('not_donated_label_text');
    } else {
        td03.classList.add('donated_label_text');
    }

    td03.onclick = function () {
        onFossilDonateChange(id);
    };

    input.type = "text";
    if (rv) {
        input.value = rv;
    } else {
        input.value = "0";
    }
    input.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (isPositiveInteger(event.target.value)) {
                if (rv !== event.target.value) {
                    onFossilRedundancyChange(id, event.target.value);
                }
            } else {
                if (rv) {
                    event.target.value = rv;
                } else {
                    event.target.value = "0";
                }
            }
        }
    });

    td04.appendChild(input)

    tr.appendChild(td01);
    tr.appendChild(td02);
    tr.appendChild(td03);
    tr.appendChild(td04);
    return tr
}

function filter_fossil_data() {
    if (fossil_data != null) {
        var i;
        var page_json = getPageJson('fossil_donate')
        // clean data
        for (i = 0; i < fossil_data.length; i++) {
            fossil_data[i].show_flag = 1;
            fossil_data[i].donate_flag = 0;
        }
        // get donate cookie
        if (page_json) {
            for (i = 0; i < fossil_data.length; i++) {
                if (page_json.includes(fossil_data[i].id)) {
                    fossil_data[i].donate_flag = 1
                }
            }
        }
        // filter name data
        if (name_flag != null) {
            console.log('name filter')
            for (i = 0; i < fossil_data.length; i++) {
                if (fossil_data[i].show_flag === 1) {
                    fossil_data[i].show_flag = 0
                    for (var p in fossil_data[i].name) {
                        if (fossil_data[i].name[p].indexOf(name_flag) > -1) {
                            fossil_data[i].show_flag = 1
                            break;
                        }
                    }
                }
            }
        }

        // filter donate data
        if (donate_flag != null) {
            console.log('donate filter')
            for (i = 0; i < fossil_data.length; i++) {
                if (fossil_data[i].show_flag === 1) {
                    if (donate_flag) {
                        fossil_data[i].show_flag = fossil_data[i].donate_flag
                    } else {
                        fossil_data[i].show_flag = fossil_data[i].donate_flag ^ 1
                    }
                }
            }
        }
    }
}

function update_fossil_page() {
    if (fossil_data != null) {
        var language = getLanguage();
        var i;
        var summary = 0;
        var items_div = document.getElementById('fossil_table_body');
        var page_json = getPageJson('fossil_redundancy')
        if (!page_json) {
            page_json = {};
        }
        cleanElementChild(items_div);
        fossil_data.sort(function (a, b) {
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
        for (i = 0; i < fossil_data.length; i++) {
            if (fossil_data[i].show_flag === 1) {
                var tr = get_fossil_tr(
                    id = fossil_data[i].id,
                    url = './images/fossil_png/' + fossil_data[i].pic_name,
                    name = fossil_data[i]['name'][language],
                    flag = fossil_data[i].donate_flag,
                    rv = page_json[fossil_data[i].id])
                if (page_json[fossil_data[i].id]) {
                    summary = summary + parseInt(page_json[fossil_data[i].id]);
                }
                items_div.appendChild(tr);
            }
        }
        // input
        var input = document.getElementById("fossil_name");
        input.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("fossil_search_btn").click();
            }
        });

        // td
        var summary_td = document.getElementById('summary_td');
        summary_td.textContent = summary;
    }
}

function load_fossil_db() {
    if (fossil_data != null) {
        filter_fossil_data();
        update_fossil_page();
        init_language();
        window.location.href = "#two"
    } else {
        var request = new XMLHttpRequest();
        request.open("get", 'db/json/fossil.json');
        request.send(null);
        request.onload = function () {
            if (request.status === 200) {
                fossil_data = JSON.parse(request.responseText);
                filter_fossil_data();
                update_fossil_page();
                init_language();
            } else {
                window.alert("load data Error!");
                goto_home_page();
            }
        }
    }
}

function exportCanvasAsPNG2() {
    var node = document.body;
    var header = document.getElementById('header');
    var one = document.getElementById('one');
    var footer = document.getElementById('footer');
    var snapshot_btn = document.getElementById('snapshot_btn');
    var three = document.getElementById('three');

    header.style.display = "none";
    one.style.display = "none";
    footer.style.display = "none";
    snapshot_btn.style.display = "none";
    three.style.display = "";

    domtoimage.toBlob(node)
        .then(function (blob) {
            var link = document.createElement("a");
            var objurl = URL.createObjectURL(blob);
            link.download = "fossil_share.png";
            link.href = objurl;
            link.click();
            header.style.display = "";
            one.style.display = "";
            footer.style.display = "";
            snapshot_btn.style.display = "";
            three.style.display = "none";
        });
}