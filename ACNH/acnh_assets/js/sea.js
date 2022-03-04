var sea_data = null;

var selected_id = null;
var month_select_list = [];
var month_select_name_list = [];
var speed_select_list = [];
var shadow_select_list = [];

var name_flag = null;
var donate_flag = null;
var statue_flag = null;
var hemisphere_flag = null;

var current_page = 1;
var max_page = 10;
var max_item = 18;
var tmp_inner_text = '';
var max_show = 3;

function sea_page_onload() {
    name_flag = null;
    donate_flag = null;
    statue_flag = null;
    hemisphere_flag = null;
    selected_id = null;

    all_page_onload();
    load_sea_db();
    multi_select_onload();
}

function onChangeSelectedSea() {
    var i = 0;
    if (sea_data != null) {
        if (selected_id == null) {
            selected_id = sea_data[0].id;
        }
        var language = getLanguage();
        var sea_selected_pic = document.getElementById("sea_selected_pic");
        var sea_selected_name = document.getElementById("sea_selected_name");
        var sea_selected_dialog = document.getElementById("sea_selected_dialog");
        var sea_selected_speed_td = document.getElementById("sea_selected_speed_td");
        var sea_selected_shadow_b = document.getElementById("sea_selected_shadow_b");
        var sea_selected_shadow_td = document.getElementById("sea_selected_shadow_td");
        var sea_selected_sell_td = document.getElementById("sea_selected_sell_td");
        var shadow_arr = ["Tiny", "Small", "Medium", "Large", "Very large", "Huge", "Long & Thin", "Very large (finned)"];

        for (i = 0; i < sea_data.length; i++) {
            if (sea_data[i].id === selected_id) {
                sea_selected_pic.src = './images/sea_png/' + sea_data[i].pic_name;
                sea_selected_name.innerText = sea_data[i]['name'][language];
                sea_selected_dialog.innerText = sea_data[i]['dialogue'][language];
                sea_selected_speed_td.innerText = sea_data[i]['speed'][language];
                sea_selected_shadow_b.innerText = sea_data[i]['shadow'][language];
                sea_selected_sell_td.innerText = sea_data[i]['sell'];
                if (hemisphere_flag) {
                    update_new_month_span(Object.keys(sea_data[i].north_time), "sea_month_span")
                } else {
                    update_new_month_span(Object.keys(sea_data[i].south_time), "sea_month_span")
                }
                if (hemisphere_flag) {
                    update_new_day_span(sea_data[i].north_time, "sea_am_span", "sea_pm_span")
                } else {
                    update_new_day_span(sea_data[i].south_time, "sea_am_span", "sea_pm_span")
                }
                var j = 0;
                for (let k = 0; k < sea_selected_shadow_td.childNodes.length; k++) {
                    if (sea_selected_shadow_td.childNodes[k].nodeName === "IMG") {
                        var img = sea_selected_shadow_td.childNodes[k];
                        if (sea_data[i]['shadow']['english'] === shadow_arr[j]) {
                            img.style.border = "solid";
                            img.style.borderWidth = "1px";
                            img.style.borderRadius = "5px";
                            img.style.borderColor = "#50b3d4";
                        } else {
                            img.style.border = "none";
                        }
                        j = j + 1;
                    }
                }
                window.location.href = "#two"
                break
            }
        }

    }
}

function multi_select_onload() {
    var sea_month_msc = document.getElementById("sea_month_msc");
    var sea_speed_msc = document.getElementById("sea_speed_msc");
    var sea_shadow_msc = document.getElementById("sea_shadow_msc");
    var sea_month_category = document.getElementById("sea_month_category");
    var sea_speed_category = document.getElementById("sea_speed_category");
    var sea_shadow_category = document.getElementById("sea_shadow_category");
    sea_month_msc.style.display = "none";
    sea_speed_msc.style.display = "none";
    sea_shadow_msc.style.display = "none";

    document.onclick = function () {
        if (sea_month_msc.style.display !== "none") {
            sea_month_msc.style.display = "none";
            onSeaSearch(null);
        }
        if (sea_speed_msc.style.display !== "none") {
            sea_speed_msc.style.display = "none";
            onSeaSearch(null);
        }
        if (sea_shadow_msc.style.display !== "none") {
            sea_shadow_msc.style.display = "none";
            onSeaSearch(null);
        }
    }

    sea_month_category.addEventListener('click', function (e) {
        if (sea_month_msc.style.display === "none") {
            stopFunc(e);
            sea_month_msc.style.display = "";
            sea_speed_msc.style.display = "none";
            sea_shadow_msc.style.display = "none";
        }
    }, false)
    sea_speed_category.addEventListener('click', function (e) {
        if (sea_speed_msc.style.display === "none") {
            stopFunc(e);
            sea_speed_msc.style.display = "";
            sea_month_msc.style.display = "none";
            sea_shadow_msc.style.display = "none";
        }
    }, false)
    sea_shadow_category.addEventListener('click', function (e) {
        if (sea_shadow_msc.style.display === "none") {
            stopFunc(e);
            sea_shadow_msc.style.display = "";
            sea_month_msc.style.display = "none";
            sea_speed_msc.style.display = "none";
        }
    }, false)

    sea_month_msc.addEventListener('click', function (e) {
        stopFunc(e);
    }, false)
    sea_speed_msc.addEventListener('click', function (e) {
        stopFunc(e);
    }, false)
    sea_shadow_msc.addEventListener('click', function (e) {
        stopFunc(e);
    }, false)

    //阻止事件向上传递
    function stopFunc(e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }
}

function change_sea_donated_flag(id) {
    var page_json = getPageJson('sea_donate')
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
    savePageJson('sea_donate', page_json)
    onSeaSearch(null);
}

function change_sea_statued_flag(id) {
    var page_json = getPageJson('sea_statue')
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
    savePageJson('sea_statue', page_json)
    onSeaSearch(null);
}

function get_sea_img_div(url, now_month_flag, new_flag, pass_flag, bugsable_flag, coming_flag) {
    var div = document.createElement('div');
    var img = document.createElement('img');

    img.style.borderRadius = "10px";
    img.classList.add("one");
    img.src = url;
    img.width = "100%";
    if (now_month_flag) {
        div.className = "border_tr_red";
    } else {
        div.className = "border_tr";
    }
    div.style.width = "100%";
    div.style.position = "relative";

    div.appendChild(img);
    if (new_flag) {
        div.appendChild(get_new_flag_img());
    }
    if (pass_flag) {
        div.appendChild(get_pass_flag_img());
    }
    if (bugsable_flag) {
        div.appendChild(get_bugsable_flag_img());
    }
    if (coming_flag) {
        div.appendChild(get_coming_flag_img());
    }
    return div
}

function get_sea_node_div(id, url, name, donated_flag, statue_flag, catchable_flag, new_flag, pass_flag, bugsable_flag, coming_flag) {
    var img_div = get_sea_img_div(url, catchable_flag, new_flag, pass_flag, bugsable_flag, coming_flag);
    img_div.onclick = function (){
        selected_id = id;
        onChangeSelectedSea();
    }
    var name_div = document.createElement('div');
    if (catchable_flag) {
        name_div.classList.add('border_b_red');
    } else {
        name_div.classList.add('border_b');
    }

    name_div.style = "width: 100%;text-align: center;";
    if (name === "") {
        name_div.classList.add('not_translated_text');
    } else {
        name_div.textContent = name;
    }

    var donated_flag_div = document.createElement('div');
    if (catchable_flag) {
        donated_flag_div.classList.add('border_b_red');
    } else {
        donated_flag_div.classList.add('border_b');
    }
    if (donated_flag === 0) {
        donated_flag_div.classList.add('not_donated_label_text');
    } else {
        donated_flag_div.classList.add('donated_label_text');
    }
    donated_flag_div.style = "width: 100%;text-align: center;";
    donated_flag_div.onclick = function () {
        change_sea_donated_flag(id);
    }

    var statue_flag_div = document.createElement('div');
    if (catchable_flag) {
        statue_flag_div.classList.add('border_b_red');
    } else {
        statue_flag_div.classList.add('border_b');
    }
    if (statue_flag === 0) {
        statue_flag_div.classList.add('not_statued_label_text');
    } else {
        statue_flag_div.classList.add('statued_label_text');
    }
    statue_flag_div.style = "width: 100%;text-align: center;";
    statue_flag_div.onclick = function () {
        change_sea_statued_flag(id);
    }

    var div2 = document.createElement('div');
    if (catchable_flag) {
        div2.classList.add('out_border_red');
    } else {
        div2.classList.add('out_border');
    }
    div2.classList.add("row");
    div2.appendChild(img_div);
    div2.appendChild(name_div);
    div2.appendChild(donated_flag_div);
    div2.appendChild(statue_flag_div);

    var node_div = document.createElement('div');
    node_div.className = "col-2 col-6-small pd";
    node_div.appendChild(div2);
    return node_div
}

function get_month_checkbox_div(checkBox_id, checkBox_class, i, is_check) {
    var checkBox_div = document.createElement("div")
    var checkBox = document.createElement("input");
    var label = document.createElement("label");
    checkBox_div.classList.add("col-12")
    checkBox_div.classList.add("col-12-small")
    checkBox_div.classList.add("multi_select_item")

    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", checkBox_id);
    checkBox.checked = is_check;
    checkBox.addEventListener('change', function (event) {
        var category = document.getElementById('sea_month_category');
        var span = document.createElement('span');
        span.classList.add('icon_more');
        tmp_inner_text = category.innerText;
        current_page = 1;
        if (event.currentTarget.checked) {
            var label = document.getElementById(event.currentTarget.id + "_label")
            month_select_list.push(i);
            month_select_name_list.push(label.innerText)
            month_select_list.sort();
            month_select_name_list.sort();
        } else {
            var label = document.getElementById(event.currentTarget.id + "_label")
            month_select_list = arrayRemove(month_select_list, i);
            month_select_name_list = arrayRemove(month_select_name_list, label.innerText);
        }

        var text = '';
        if (month_select_name_list.length > max_show) {
            category.classList.remove("month_category_all_text")
            text = month_select_name_list.slice(0, max_show).join(", ") + ", ...";
            category.textContent = text;
        } else if (month_select_name_list.length > 1) {
            category.classList.remove("month_category_all_text")
            text = month_select_name_list.join(", ");
            category.textContent = text;
        } else if (month_select_name_list.length === 0) {
            category.classList.add("month_category_all_text")
            category.textContent = tmp_inner_text;
        } else {
            category.classList.remove("month_category_all_text")
            category.textContent = month_select_name_list[0];
        }
        category.appendChild(span);
    })

    label.classList.add(checkBox_class);
    label.htmlFor = checkBox_id;
    label.setAttribute("id", checkBox_id + "_label");

    checkBox_div.appendChild(checkBox);
    checkBox_div.appendChild(label);
    return checkBox_div;
}

function get_checkbox_div(checkBox_id, checkBox_label, is_check, category_name) {
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
    if (category_name.indexOf("speed") > -1) {
        checkBox.addEventListener('change', function (event) {
            var category = document.getElementById(category_name);
            var span = document.createElement('span');
            span.classList.add('icon_more');
            tmp_inner_text = category.innerText;
            current_page = 1;
            if (event.currentTarget.checked) {
                speed_select_list.push(event.currentTarget.name);
                speed_select_list.sort();
            } else {
                speed_select_list = arrayRemove(speed_select_list, event.currentTarget.name);
            }

            var text = '';
            if (speed_select_list.length > max_show) {
                category.classList.remove("speed_category_all_text")
                text = speed_select_list.slice(0, max_show).join(", ") + ", ...";
                category.textContent = text;
            } else if (speed_select_list.length > 1) {
                category.classList.remove("speed_category_all_text")
                text = speed_select_list.join(", ");
                category.textContent = text;
            } else if (speed_select_list.length === 0) {
                category.classList.add("speed_category_all_text")
                category.textContent = tmp_inner_text;
            } else {
                category.classList.remove("speed_category_all_text")
                category.textContent = speed_select_list[0];
            }
            category.appendChild(span);
        })
    } else if (category_name.indexOf("shadow") > -1) {
        checkBox.addEventListener('change', function (event) {
            var category = document.getElementById(category_name);
            var span = document.createElement('span');
            span.classList.add('icon_more');
            tmp_inner_text = category.innerText;
            current_page = 1;
            if (event.currentTarget.checked) {
                shadow_select_list.push(event.currentTarget.name);
                shadow_select_list.sort();
            } else {
                shadow_select_list = arrayRemove(shadow_select_list, event.currentTarget.name);
            }

            var text = '';
            if (shadow_select_list.length > max_show) {
                category.classList.remove("shadow_category_all_text")
                text = shadow_select_list.slice(0, max_show).join(", ") + ", ...";
                category.textContent = text;
            } else if (shadow_select_list.length > 1) {
                category.classList.remove("shadow_category_all_text")
                text = shadow_select_list.join(", ");
                category.textContent = text;
            } else if (shadow_select_list.length === 0) {
                category.classList.add("shadow_category_all_text")
                category.textContent = tmp_inner_text;
            } else {
                category.classList.remove("shadow_category_all_text")
                category.textContent = shadow_select_list[0];
            }
            category.appendChild(span);
        })
    } else {
        window.alert("123")
    }

    label.htmlFor = checkBox_id;
    label.textContent = checkBox_label;

    checkBox_div.appendChild(checkBox);
    checkBox_div.appendChild(label);
    return checkBox_div;
}

function update_hemisphere_radio() {
    if (hemisphere_flag === null) {
        var sea_hradio_north = document.getElementById('sea_hradio_north');
        var sea_hradio_south = document.getElementById('sea_hradio_south');
        if (getHemisphere() === 'north') {
            hemisphere_flag = true;
            sea_hradio_north.checked = true;
        } else {
            hemisphere_flag = false;
            sea_hradio_south.checked = true;
        }
    }
}

function onSeaSearch(element) {
    var sea_name = document.getElementById('sea_name');
    var sea_dradio_true = document.getElementById('sea_dradio_true');
    var sea_dradio_false = document.getElementById('sea_dradio_false');
    var sea_sradio_true = document.getElementById('sea_sradio_true');
    var sea_sradio_false = document.getElementById('sea_sradio_false');
    var sea_hradio_north = document.getElementById('sea_hradio_north');
    var sea_hradio_south = document.getElementById('sea_hradio_south');
    var current_name = null;
    if (sea_name.value !== '') {
        current_name = sea_name.value;
    }
    name_flag = current_name;
    if (element != null && element.tagName === "LABEL") {
        var radio = document.getElementById(element.htmlFor);
        if (!radio.checked) {
            if (element.htmlFor.indexOf("dradio") > -1) {
                if (radio.value === '1') {
                    donate_flag = true
                } else if (radio.value === '2') {
                    donate_flag = false
                } else {
                    donate_flag = null
                }
            } else if (element.htmlFor.indexOf("sradio") > -1) {
                if (radio.value === '1') {
                    statue_flag = true
                } else if (radio.value === '2') {
                    statue_flag = false
                } else {
                    statue_flag = null
                }
            } else if (element.htmlFor.indexOf("hradio") > -1) {
                if (radio.value === '0') {
                    hemisphere_flag = true
                } else if (radio.value === '1') {
                    hemisphere_flag = false
                }
            } else {
                window.alert("error!")
            }
            current_page = 1;
            load_sea_db();
        }
    } else {
        if (sea_dradio_true.checked) {
            donate_flag = true
        } else if (sea_dradio_false.checked) {
            donate_flag = false
        } else {
            donate_flag = null
        }
        if (sea_sradio_true.checked) {
            statue_flag = true
        } else if (sea_sradio_false.checked) {
            statue_flag = false
        } else {
            statue_flag = null
        }
        if (sea_hradio_north.checked) {
            hemisphere_flag = true
        } else if (sea_hradio_south.checked) {
            hemisphere_flag = false
        } else {
            hemisphere_flag = null
        }
        load_sea_db();
    }
}

function onSeaReset() {
    var sea_name = document.getElementById('sea_name');
    var sea_dradio_all = document.getElementById('sea_dradio_all');
    var sea_sradio_all = document.getElementById('sea_sradio_all');
    var sea_month_category = document.getElementById('sea_month_category');
    var sea_speed_category = document.getElementById('sea_speed_category');
    var sea_shadow_category = document.getElementById('sea_shadow_category');
    sea_name.value = '';
    sea_dradio_all.checked = true;
    sea_sradio_all.checked = true;
    month_select_list = [];
    month_select_name_list = [];
    speed_select_list = [];
    shadow_select_list = [];
    current_page = 1;
    sea_month_category.classList.add("month_category_all_text");
    sea_speed_category.classList.add("speed_category_all_text");
    sea_shadow_category.classList.add("shadow_category_all_text");
    sea_page_onload();
}

function filter_sea_data() {
    var i;
    if (sea_data != null) {
        var donate_json = getPageJson('sea_donate')
        var statue_json = getPageJson('sea_statue')
        var now_month = getGameMonths();
        var next_month = now_month === 12 ? 1 : now_month + 1;
        var prev_month = now_month === 1 ? 12 : now_month - 1;
        var now_hour = getGameHours();
        for (i = 0; i < sea_data.length; i++) {
            sea_data[i].show_flag = 1;
            sea_data[i].donate_flag = 0;
            sea_data[i].statue_flag = 0;
            sea_data[i].this_month_flag = 0;
            sea_data[i].coming_month_flag = 0;
            sea_data[i].last_month_flag = 0;
            sea_data[i].new_month_flag = 0;
            sea_data[i].catchable_flag = 0;

            if (hemisphere_flag != null) {
                if (hemisphere_flag) {
                    if (Object.keys(sea_data[i].north_time).includes(now_month.toString())) {
                        sea_data[i].this_month_flag = 1;
                        if (sea_data[i].north_time[now_month.toString()].includes(now_hour)) {
                            sea_data[i].catchable_flag = 1;
                        }
                        if (!Object.keys(sea_data[i].north_time).includes(next_month.toString())) {
                            sea_data[i].last_month_flag = 1;
                        }
                        if (!Object.keys(sea_data[i].north_time).includes(prev_month.toString())) {
                            sea_data[i].new_month_flag = 1;
                        }
                    } else {
                        if (Object.keys(sea_data[i].north_time).includes(next_month.toString())) {
                            sea_data[i].coming_month_flag = 1;
                        }
                    }
                } else {
                    if (Object.keys(sea_data[i].south_time).includes(now_month.toString())) {
                        sea_data[i].this_month_flag = 1;
                        if (sea_data[i].south_time[now_month.toString()].includes(now_hour)) {
                            sea_data[i].catchable_flag = 1;
                        }
                        if (!Object.keys(sea_data[i].south_time).includes(next_month.toString())) {
                            sea_data[i].last_month_flag = 1;
                        }
                        if (!Object.keys(sea_data[i].south_time).includes(prev_month.toString())) {
                            sea_data[i].new_month_flag = 1;
                        }
                    } else {
                        if (Object.keys(sea_data[i].south_time).includes(next_month.toString())) {
                            sea_data[i].coming_month_flag = 1;
                        }
                    }
                }
            }
        }

        if (donate_json != null) {
            for (i = 0; i < sea_data.length; i++) {
                if (donate_json.includes(sea_data[i].id)) {
                    sea_data[i].donate_flag = 1
                }
            }
        }

        if (statue_json != null) {
            for (i = 0; i < sea_data.length; i++) {
                if (statue_json.includes(sea_data[i].id)) {
                    sea_data[i].statue_flag = 1
                }
            }
        }

        // filter name data
        if (name_flag != null) {
            console.log('name filter')
            for (i = 0; i < sea_data.length; i++) {
                if (sea_data[i].show_flag === 1) {
                    sea_data[i].show_flag = 0
                    for (var p in sea_data[i].name) {
                        if (sea_data[i].name[p].indexOf(name_flag) > -1) {
                            sea_data[i].show_flag = 1
                            break;
                        }
                    }
                }
            }
        }

        // filter donate data
        if (donate_flag != null) {
            for (i = 0; i < sea_data.length; i++) {
                if (sea_data[i].show_flag === 1) {
                    if (donate_flag) {
                        sea_data[i].show_flag = sea_data[i].donate_flag
                    } else {
                        sea_data[i].show_flag = sea_data[i].donate_flag ^ 1
                    }
                }

            }
        }

        // filter statue data
        if (statue_flag != null) {
            for (i = 0; i < sea_data.length; i++) {
                if (sea_data[i].show_flag === 1) {
                    if (statue_flag) {
                        sea_data[i].show_flag = sea_data[i].statue_flag
                    } else {
                        sea_data[i].show_flag = sea_data[i].statue_flag ^ 1
                    }
                }

            }
        }

        // filter speed category data
        if (speed_select_list.length !== 0) {
            for (i = 0; i < sea_data.length; i++) {
                if (sea_data[i].show_flag === 1) {
                    sea_data[i].show_flag = 0
                    for (var p in sea_data[i].speed) {
                        if (speed_select_list.includes(sea_data[i].speed[p])) {
                            sea_data[i].show_flag = 1
                            break;
                        }
                    }
                }

            }
        }

        // filter shadow category data
        if (shadow_select_list.length !== 0) {
            for (i = 0; i < sea_data.length; i++) {
                if (sea_data[i].show_flag === 1) {
                    sea_data[i].show_flag = 0
                    for (var p in sea_data[i].speed) {
                        if (shadow_select_list.includes(sea_data[i].shadow[p])) {
                            sea_data[i].show_flag = 1
                            break;
                        }
                    }
                }

            }
        }

        // filter month category data
        if (month_select_list.length !== 0) {
            for (i = 0; i < sea_data.length; i++) {
                if (sea_data[i].show_flag === 1) {
                    sea_data[i].show_flag = 0
                    if (hemisphere_flag != null) {
                        if (hemisphere_flag) {
                            for (var p in sea_data[i].north_time) {
                                if (month_select_list.includes(parseInt(p))) {
                                    sea_data[i].show_flag = 1
                                    break;
                                }
                            }
                        } else {
                            for (var p in sea_data[i].south_time) {
                                if (month_select_list.includes(parseInt(p))) {
                                    sea_data[i].show_flag = 1
                                    break;
                                }
                            }
                        }
                    } else {
                        sea_data[i].show_flag = 1
                    }
                }
            }
        }
    }
}

function update_sea_page() {
    if (sea_data != null) {
        var language = getLanguage();
        var sea_speed_category_array = [];
        var sea_shadow_category_array = [];
        var i = 0;
        var j = 0;
        var items_div = document.getElementById('items_div');
        while (items_div.firstChild) {
            items_div.removeChild(items_div.firstChild);
        }
        var start_i = (current_page - 1) * max_item;
        var end_i = current_page * max_item;

        sea_data.sort(function (a, b) {
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

        for (i = 0; i < sea_data.length; i++) {
            if (sea_data[i].show_flag === 1) {
                if (j >= start_i && j < end_i) {
                    var node_div = get_sea_node_div(
                        id = sea_data[i].id,
                        url = './images/sea_png/' + sea_data[i].pic_name,
                        name = sea_data[i]['name'][language],
                        donate_flag = sea_data[i].donate_flag,
                        statue_flag = sea_data[i].statue_flag,
                        catchable_flag = sea_data[i].this_month_flag,
                        new_flag = sea_data[i].new_month_flag,
                        pass_flag = sea_data[i].last_month_flag,
                        bugsable_flag = sea_data[i].catchable_flag,
                        coming_flag = sea_data[i].coming_month_flag)
                    items_div.appendChild(node_div);
                }
                j++;
            }
            sea_speed_category_array.push(sea_data[i]['speed'][language])
            sea_shadow_category_array.push(sea_data[i]['shadow'][language])
        }
        // update sea_speed_category
        sea_speed_category_array = Array.from(new Set(sea_speed_category_array));
        sea_speed_category_array.sort();
        var sea_speed_msc = document.getElementById('sea_speed_msc');
        if (sea_speed_msc != null) {
            while (sea_speed_msc.firstChild) {
                sea_speed_msc.removeChild(sea_speed_msc.firstChild);
            }
            for (i = 0; i < sea_speed_category_array.length; i++) {
                var is_check = speed_select_list.includes(sea_speed_category_array[i]);
                var div = get_checkbox_div("check_speed_" + i.toString(),
                    sea_speed_category_array[i], is_check, "sea_speed_category")
                sea_speed_msc.appendChild(div)
            }
        }
        // update sea_shadow_category
        sea_shadow_category_array = Array.from(new Set(sea_shadow_category_array));
        sea_shadow_category_array.sort();
        var sea_shadow_msc = document.getElementById('sea_shadow_msc');
        if (sea_shadow_msc != null) {
            while (sea_shadow_msc.firstChild) {
                sea_shadow_msc.removeChild(sea_shadow_msc.firstChild);
            }
            for (i = 0; i < sea_shadow_category_array.length; i++) {
                var is_check = shadow_select_list.includes(sea_shadow_category_array[i]);
                var div = get_checkbox_div("check_shadow_" + i.toString(),
                    sea_shadow_category_array[i], is_check, "sea_shadow_category")
                sea_shadow_msc.appendChild(div)
            }
        }
        // update sea_month_category
        var sea_month_msc = document.getElementById('sea_month_msc');
        if (sea_month_msc != null) {
            while (sea_month_msc.firstChild) {
                sea_month_msc.removeChild(sea_month_msc.firstChild);
            }
            var Jan = get_month_checkbox_div("check_month_Jan",
                "January_text", 1, month_select_list.includes(1))
            var Feb = get_month_checkbox_div("check_month_Feb",
                "February_text", 2, month_select_list.includes(2))
            var Mar = get_month_checkbox_div("check_month_Mar",
                "March_text", 3, month_select_list.includes(3))
            var Apr = get_month_checkbox_div("check_month_Apr",
                "April_text", 4, month_select_list.includes(4))
            sea_month_msc.appendChild(Jan)
            sea_month_msc.appendChild(Feb)
            sea_month_msc.appendChild(Mar)
            sea_month_msc.appendChild(Apr)

            var May = get_month_checkbox_div("check_month_May",
                "May_text", 5, month_select_list.includes(5))
            var Jun = get_month_checkbox_div("check_month_Jun",
                "June_text", 6, month_select_list.includes(6))
            var Jul = get_month_checkbox_div("check_month_Jul",
                "July_text", 7, month_select_list.includes(7))
            var Aug = get_month_checkbox_div("check_month_Aug",
                "August_text", 8, month_select_list.includes(8))
            sea_month_msc.appendChild(May)
            sea_month_msc.appendChild(Jun)
            sea_month_msc.appendChild(Jul)
            sea_month_msc.appendChild(Aug)

            var Sep = get_month_checkbox_div("check_month_Sep",
                "September_text", 9, month_select_list.includes(9))
            var Oct = get_month_checkbox_div("check_month_Oct",
                "October_text", 10, month_select_list.includes(10))
            var Nov = get_month_checkbox_div("check_month_Nov",
                "November_text", 11, month_select_list.includes(11))
            var Dec = get_month_checkbox_div("check_month_Dec",
                "December_text", 12, month_select_list.includes(12))
            sea_month_msc.appendChild(Sep)
            sea_month_msc.appendChild(Oct)
            sea_month_msc.appendChild(Nov)
            sea_month_msc.appendChild(Dec)
        }

        // update pagination
        max_page = Math.ceil(j / max_item);
        update_pagination(onSeaSearch);
        // input
        var input = document.getElementById("sea_name");
        input.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("sea_search_btn").click();
            }
        });
    }
}

function load_sea_db() {
    if (sea_data != null) {
        update_hemisphere_radio();
        filter_sea_data();
        update_sea_page();
        onChangeSelectedSea();
        init_language();
    } else {
        var request = new XMLHttpRequest();
        request.open("get", 'db/json/sea.json');
        request.send(null);
        request.onload = function () {
            if (request.status === 200) {
                sea_data = JSON.parse(request.responseText);
                update_hemisphere_radio();
                filter_sea_data();
                update_sea_page();
                onChangeSelectedSea()
                init_language();
            } else {
                window.alert("load data Error!");
                goto_home_page();
            }
        }
    }
}