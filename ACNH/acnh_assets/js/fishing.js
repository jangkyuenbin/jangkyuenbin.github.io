var fishing_data = null;

var selected_id = null;
var month_select_list = [];
var month_select_name_list = [];
var loc_select_list = [];
var shadow_select_list = [];

var tmp_inner_text = '';
var max_show = 3;

var name_flag = null;
var donate_flag = null;
var statue_flag = null;
var hemisphere_flag = null;

var current_page = 1;
var max_page = 10;
var max_item = 18;

function fishing_page_onload() {
    name_flag = null;
    donate_flag = null;
    statue_flag = null;
    hemisphere_flag = null;
    selected_id = null;

    all_page_onload();
    load_fishing_db();
    multi_select_onload();
}

function onChangeSelectedFish() {
    var i = 0;
    if (fishing_data != null) {
        if (selected_id == null) {
            selected_id = fishing_data[0].id;
        }
        var language = getLanguage();
        var fishing_selected_pic = document.getElementById("fishing_selected_pic");
        var fishing_selected_name = document.getElementById("fishing_selected_name");
        var fishing_selected_dialog = document.getElementById("fishing_selected_dialog");
        var fishing_selected_loc_td = document.getElementById("fishing_selected_loc_td");
        var fishing_selected_shadow_b = document.getElementById("fishing_selected_shadow_b");
        var fishing_selected_shadow_td = document.getElementById("fishing_selected_shadow_td");
        var fishing_selected_sell_td = document.getElementById("fishing_selected_sell_td");
        var shadow_arr = ["Tiny", "Small", "Medium", "Large", "Very large", "Huge", "Long & Thin", "Very large (finned)"];

        for (i = 0; i < fishing_data.length; i++) {
            if (fishing_data[i].id === selected_id) {
                fishing_selected_pic.src = './images/fish_png/' + fishing_data[i].pic_name;
                fishing_selected_name.innerText = fishing_data[i]['name'][language];
                fishing_selected_dialog.innerText = fishing_data[i]['dialogue'][language];
                fishing_selected_loc_td.innerText = fishing_data[i]['location'][language];
                fishing_selected_shadow_b.innerText = fishing_data[i]['shadow'][language];
                fishing_selected_sell_td.innerText = fishing_data[i]['sell'];
                if (hemisphere_flag) {
                    update_new_month_span(Object.keys(fishing_data[i].north_time), "fish_month_span")
                } else {
                    update_new_month_span(Object.keys(fishing_data[i].south_time), "fish_month_span")
                }
                if (hemisphere_flag) {
                    update_new_day_span(fishing_data[i].north_time, "fish_am_span", "fish_pm_span")
                } else {
                    update_new_day_span(fishing_data[i].south_time, "fish_am_span", "fish_pm_span")
                }
                var j = 0;
                for (let k = 0; k < fishing_selected_shadow_td.childNodes.length; k++) {
                    if (fishing_selected_shadow_td.childNodes[k].nodeName === "IMG") {
                        var img = fishing_selected_shadow_td.childNodes[k];
                        if (fishing_data[i]['shadow']['english'] === shadow_arr[j]) {
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

function onFishingSearch(element) {
    var fishing_name = document.getElementById('fishing_name');
    var fishing_dradio_true = document.getElementById('fishing_dradio_true');
    var fishing_dradio_false = document.getElementById('fishing_dradio_false');
    var fishing_sradio_true = document.getElementById('fishing_sradio_true');
    var fishing_sradio_false = document.getElementById('fishing_sradio_false');
    var fishing_hradio_north = document.getElementById('fishing_hradio_north');
    var fishing_hradio_south = document.getElementById('fishing_hradio_south');
    var current_name = null;
    if (fishing_name.value !== '') {
        current_name = fishing_name.value;
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
            load_fishing_db();
        }
    } else {
        if (fishing_dradio_true.checked) {
            donate_flag = true
        } else if (fishing_dradio_false.checked) {
            donate_flag = false
        } else {
            donate_flag = null
        }
        if (fishing_sradio_true.checked) {
            statue_flag = true
        } else if (fishing_sradio_false.checked) {
            statue_flag = false
        } else {
            statue_flag = null
        }
        if (fishing_hradio_north.checked) {
            hemisphere_flag = true
        } else if (fishing_hradio_south.checked) {
            hemisphere_flag = false
        } else {
            hemisphere_flag = null
        }
        load_fishing_db();
    }
}

function onFishingReset() {
    var fishing_name = document.getElementById('fishing_name');
    var fishing_dradio_all = document.getElementById('fishing_dradio_all');
    var fishing_sradio_all = document.getElementById('fishing_sradio_all');
    var fishing_month_category = document.getElementById('fishing_month_category');
    var fishing_loc_category = document.getElementById('fishing_loc_category');
    var fishing_shadow_category = document.getElementById('fishing_shadow_category');
    fishing_name.value = '';
    fishing_dradio_all.checked = true;
    fishing_sradio_all.checked = true;
    month_select_list = [];
    month_select_name_list = [];
    loc_select_list = [];
    shadow_select_list = [];
    current_page = 1;
    selected_id = null;
    fishing_month_category.classList.add("month_category_all_text");
    fishing_loc_category.classList.add("loc_category_all_text");
    fishing_shadow_category.classList.add("shadow_category_all_text");
    fishing_page_onload();
}

function multi_select_onload() {
    var fishing_month_msc = document.getElementById("fishing_month_msc");
    var fishing_loc_msc = document.getElementById("fishing_loc_msc");
    var fishing_shadow_msc = document.getElementById("fishing_shadow_msc");
    var fishing_month_category = document.getElementById("fishing_month_category");
    var fishing_loc_category = document.getElementById("fishing_loc_category");
    var fishing_shadow_category = document.getElementById("fishing_shadow_category");
    fishing_month_msc.style.display = "none";
    fishing_loc_msc.style.display = "none";
    fishing_shadow_msc.style.display = "none";

    document.onclick = function () {
        if (fishing_month_msc.style.display !== "none") {
            fishing_month_msc.style.display = "none";
            onFishingSearch(null);
        }
        if (fishing_loc_msc.style.display !== "none") {
            fishing_loc_msc.style.display = "none";
            onFishingSearch(null);
        }
        if (fishing_shadow_msc.style.display !== "none") {
            fishing_shadow_msc.style.display = "none";
            onFishingSearch(null);
        }
    }

    fishing_month_category.addEventListener('click', function (e) {
        if (fishing_month_msc.style.display === "none") {
            stopFunc(e);
            fishing_month_msc.style.display = "";
            fishing_loc_msc.style.display = "none";
            fishing_shadow_msc.style.display = "none";
        }
    }, false)
    fishing_loc_category.addEventListener('click', function (e) {
        if (fishing_loc_msc.style.display === "none") {
            stopFunc(e);
            fishing_loc_msc.style.display = "";
            fishing_month_msc.style.display = "none";
            fishing_shadow_msc.style.display = "none";
        }
    }, false)
    fishing_shadow_category.addEventListener('click', function (e) {
        if (fishing_shadow_msc.style.display === "none") {
            stopFunc(e);
            fishing_shadow_msc.style.display = "";
            fishing_month_msc.style.display = "none";
            fishing_loc_msc.style.display = "none";
        }
    }, false)

    fishing_month_msc.addEventListener('click', function (e) {
        stopFunc(e);
    }, false)
    fishing_loc_msc.addEventListener('click', function (e) {
        stopFunc(e);
    }, false)
    fishing_shadow_msc.addEventListener('click', function (e) {
        stopFunc(e);
    }, false)

    //阻止事件向上传递
    function stopFunc(e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }
}

function update_hemisphere_radio() {
    if (hemisphere_flag === null) {
        var fishing_hradio_north = document.getElementById('fishing_hradio_north');
        var fishing_hradio_south = document.getElementById('fishing_hradio_south');
        if (getHemisphere() === 'north') {
            hemisphere_flag = true;
            fishing_hradio_north.checked = true;
        } else {
            hemisphere_flag = false;
            fishing_hradio_south.checked = true;
        }
    }
}

function filter_fishing_data() {
    var i;
    if (fishing_data != null) {
        var donate_json = getPageJson('fishing_donate')
        var statue_json = getPageJson('fishing_statue')
        var now_month = getGameMonths();
        var next_month = now_month === 12 ? 1 : now_month + 1;
        var prev_month = now_month === 1 ? 12 : now_month - 1;
        var now_hour = getGameHours();
        for (i = 0; i < fishing_data.length; i++) {
            fishing_data[i].show_flag = 1;
            fishing_data[i].donate_flag = 0;
            fishing_data[i].statue_flag = 0;
            fishing_data[i].this_month_flag = 0;
            fishing_data[i].coming_month_flag = 0;
            fishing_data[i].last_month_flag = 0;
            fishing_data[i].new_month_flag = 0;
            fishing_data[i].catchable_flag = 0;

            if (hemisphere_flag != null) {
                if (hemisphere_flag) {
                    if (Object.keys(fishing_data[i].north_time).includes(now_month.toString())) {
                        fishing_data[i].this_month_flag = 1;
                        if (fishing_data[i].north_time[now_month.toString()].includes(now_hour)) {
                            fishing_data[i].catchable_flag = 1;
                        }
                        if (!Object.keys(fishing_data[i].north_time).includes(next_month.toString())) {
                            fishing_data[i].last_month_flag = 1;
                        }
                        if (!Object.keys(fishing_data[i].north_time).includes(prev_month.toString())) {
                            fishing_data[i].new_month_flag = 1;
                        }
                    } else {
                        if (Object.keys(fishing_data[i].north_time).includes(next_month.toString())) {
                            fishing_data[i].coming_month_flag = 1;
                        }
                    }
                } else {
                    if (Object.keys(fishing_data[i].south_time).includes(now_month.toString())) {
                        fishing_data[i].this_month_flag = 1;
                        if (fishing_data[i].south_time[now_month.toString()].includes(now_hour)) {
                            fishing_data[i].catchable_flag = 1;
                        }
                        if (!Object.keys(fishing_data[i].south_time).includes(next_month.toString())) {
                            fishing_data[i].last_month_flag = 1;
                        }
                        if (!Object.keys(fishing_data[i].south_time).includes(prev_month.toString())) {
                            fishing_data[i].new_month_flag = 1;
                        }
                    } else {
                        if (Object.keys(fishing_data[i].south_time).includes(next_month.toString())) {
                            fishing_data[i].coming_month_flag = 1;
                        }
                    }
                }
            }
        }

        if (donate_json != null) {
            for (i = 0; i < fishing_data.length; i++) {
                if (donate_json.includes(fishing_data[i].id)) {
                    fishing_data[i].donate_flag = 1
                }
            }
        }

        if (statue_json != null) {
            for (i = 0; i < fishing_data.length; i++) {
                if (statue_json.includes(fishing_data[i].id)) {
                    fishing_data[i].statue_flag = 1
                }
            }
        }

        // filter name data
        if (name_flag != null) {
            console.log('name filter')
            for (i = 0; i < fishing_data.length; i++) {
                if (fishing_data[i].show_flag === 1) {
                    fishing_data[i].show_flag = 0
                    for (var p in fishing_data[i].name) {
                        if (fishing_data[i].name[p].indexOf(name_flag) > -1) {
                            fishing_data[i].show_flag = 1
                            break;
                        }
                    }
                }
            }
        }

        // filter donate data
        if (donate_flag != null) {
            for (i = 0; i < fishing_data.length; i++) {
                if (fishing_data[i].show_flag === 1) {
                    if (donate_flag) {
                        fishing_data[i].show_flag = fishing_data[i].donate_flag
                    } else {
                        fishing_data[i].show_flag = fishing_data[i].donate_flag ^ 1
                    }
                }

            }
        }

        // filter statue data
        if (statue_flag != null) {
            for (i = 0; i < fishing_data.length; i++) {
                if (fishing_data[i].show_flag === 1) {
                    if (statue_flag) {
                        fishing_data[i].show_flag = fishing_data[i].statue_flag
                    } else {
                        fishing_data[i].show_flag = fishing_data[i].statue_flag ^ 1
                    }
                }

            }
        }

        // filter loc category data
        if (loc_select_list.length !== 0) {
            for (i = 0; i < fishing_data.length; i++) {
                if (fishing_data[i].show_flag === 1) {
                    fishing_data[i].show_flag = 0
                    for (var p in fishing_data[i].location) {
                        if (loc_select_list.includes(fishing_data[i].location[p])) {
                            fishing_data[i].show_flag = 1
                            break;
                        }
                    }
                }

            }
        }

        // filter shadow category data
        if (shadow_select_list.length !== 0) {
            for (i = 0; i < fishing_data.length; i++) {
                if (fishing_data[i].show_flag === 1) {
                    fishing_data[i].show_flag = 0
                    for (var p in fishing_data[i].location) {
                        if (shadow_select_list.includes(fishing_data[i].shadow[p])) {
                            fishing_data[i].show_flag = 1
                            break;
                        }
                    }
                }

            }
        }

        // filter month category data
        if (month_select_list.length !== 0) {
            for (i = 0; i < fishing_data.length; i++) {
                if (fishing_data[i].show_flag === 1) {
                    fishing_data[i].show_flag = 0
                    if (hemisphere_flag != null) {
                        if (hemisphere_flag) {
                            for (var p in fishing_data[i].north_time) {
                                if (month_select_list.includes(parseInt(p))) {
                                    fishing_data[i].show_flag = 1
                                    break;
                                }
                            }
                        } else {
                            for (var p in fishing_data[i].south_time) {
                                if (month_select_list.includes(parseInt(p))) {
                                    fishing_data[i].show_flag = 1
                                    break;
                                }
                            }
                        }
                    } else {
                        fishing_data[i].show_flag = 1
                    }
                }
            }
        }
    }
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
        var category = document.getElementById('fishing_month_category');
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
    if (category_name.indexOf("loc") > -1) {
        checkBox.addEventListener('change', function (event) {
            var category = document.getElementById(category_name);
            var span = document.createElement('span');
            span.classList.add('icon_more');
            tmp_inner_text = category.innerText;
            current_page = 1;
            if (event.currentTarget.checked) {
                loc_select_list.push(event.currentTarget.name);
                loc_select_list.sort();
            } else {
                loc_select_list = arrayRemove(loc_select_list, event.currentTarget.name);
            }

            var text = '';
            if (loc_select_list.length > max_show) {
                category.classList.remove("loc_category_all_text")
                text = loc_select_list.slice(0, max_show).join(", ") + ", ...";
                category.textContent = text;
            } else if (loc_select_list.length > 1) {
                category.classList.remove("loc_category_all_text")
                text = loc_select_list.join(", ");
                category.textContent = text;
            } else if (loc_select_list.length === 0) {
                category.classList.add("loc_category_all_text")
                category.textContent = tmp_inner_text;
            } else {
                category.classList.remove("loc_category_all_text")
                category.textContent = loc_select_list[0];
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

function get_fishing_img_div(url, shadow_url, now_month_flag, new_flag, pass_flag, fishable_flag, coming_flag) {
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
    div.appendChild(get_shadow_img(shadow_url));
    if (new_flag) {
        div.appendChild(get_new_flag_img());
    }
    if (pass_flag) {
        div.appendChild(get_pass_flag_img());
    }
    if (fishable_flag) {
        div.appendChild(get_fishable_flag_img());
    }
    if (coming_flag) {
        div.appendChild(get_coming_flag_img());
    }
    return div
}

function change_fishing_donated_flag(id) {
    var page_json = getPageJson('fishing_donate')
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
    savePageJson('fishing_donate', page_json)
    onFishingSearch(null);
}

function change_fishing_statued_flag(id) {
    var page_json = getPageJson('fishing_statue')
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
    savePageJson('fishing_statue', page_json)
    onFishingSearch(null);
}

function get_fishing_node_div(id, url, shadow_url, name, donated_flag, statue_flag, catchable_flag, new_flag, pass_flag, fishable_flag, coming_flag) {
    var img_div = get_fishing_img_div(url, shadow_url, catchable_flag, new_flag, pass_flag, fishable_flag, coming_flag);

    img_div.onclick = function () {
        selected_id = id;
        onChangeSelectedFish();
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
        change_fishing_donated_flag(id);
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
        change_fishing_statued_flag(id);
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
    node_div.className = "col-2 col-4-small pd";
    node_div.appendChild(div2);
    return node_div
}

function update_fishing_page() {
    if (fishing_data != null) {
        var language = getLanguage();
        var fishing_loc_category_array = [];
        var fishing_shadow_category_array = [];
        var i = 0;
        var j = 0;
        var items_div = document.getElementById('items_div');
        while (items_div.firstChild) {
            items_div.removeChild(items_div.firstChild);
        }
        var start_i = (current_page - 1) * max_item;
        var end_i = current_page * max_item;

        fishing_data.sort(function (a, b) {
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

        for (i = 0; i < fishing_data.length; i++) {
            if (fishing_data[i].show_flag === 1) {
                if (j >= start_i && j < end_i) {
                    var node_div = get_fishing_node_div(
                        id = fishing_data[i].id,
                        url = './images/fish_png/' + fishing_data[i].pic_name,
                        shadow_url = './images/fish_png/' + fishing_data[i].shadow_pic_name,
                        name = fishing_data[i]['name'][language],
                        donate_flag = fishing_data[i].donate_flag,
                        statue_flag = fishing_data[i].statue_flag,
                        catchable_flag = fishing_data[i].this_month_flag,
                        new_flag = fishing_data[i].new_month_flag,
                        pass_flag = fishing_data[i].last_month_flag,
                        fishable_flag = fishing_data[i].catchable_flag,
                        coming_flag = fishing_data[i].coming_month_flag)
                    items_div.appendChild(node_div);
                }
                j++;
            }
            fishing_loc_category_array.push(fishing_data[i]['location'][language])
            fishing_shadow_category_array.push(fishing_data[i]['shadow'][language])
        }
        // update fishing_loc_category
        fishing_loc_category_array = Array.from(new Set(fishing_loc_category_array));
        fishing_loc_category_array.sort();
        var fishing_loc_msc = document.getElementById('fishing_loc_msc');
        if (fishing_loc_msc != null) {
            while (fishing_loc_msc.firstChild) {
                fishing_loc_msc.removeChild(fishing_loc_msc.firstChild);
            }
            for (i = 0; i < fishing_loc_category_array.length; i++) {
                var is_check = loc_select_list.includes(fishing_loc_category_array[i]);
                var div = get_checkbox_div("check_loc_" + i.toString(),
                    fishing_loc_category_array[i], is_check, "fishing_loc_category")
                fishing_loc_msc.appendChild(div)
            }
        }
        // update fishing_shadow_category
        fishing_shadow_category_array = Array.from(new Set(fishing_shadow_category_array));
        fishing_shadow_category_array.sort();
        var fishing_shadow_msc = document.getElementById('fishing_shadow_msc');
        if (fishing_shadow_msc != null) {
            while (fishing_shadow_msc.firstChild) {
                fishing_shadow_msc.removeChild(fishing_shadow_msc.firstChild);
            }
            for (i = 0; i < fishing_shadow_category_array.length; i++) {
                var is_check = shadow_select_list.includes(fishing_shadow_category_array[i]);
                var div = get_checkbox_div("check_shadow_" + i.toString(),
                    fishing_shadow_category_array[i], is_check, "fishing_shadow_category")
                fishing_shadow_msc.appendChild(div)
            }
        }
        // update fishing_month_category
        var fishing_month_msc = document.getElementById('fishing_month_msc');
        if (fishing_month_msc != null) {
            while (fishing_month_msc.firstChild) {
                fishing_month_msc.removeChild(fishing_month_msc.firstChild);
            }
            var Jan = get_month_checkbox_div("check_month_Jan",
                "January_text", 1, month_select_list.includes(1))
            var Feb = get_month_checkbox_div("check_month_Feb",
                "February_text", 2, month_select_list.includes(2))
            var Mar = get_month_checkbox_div("check_month_Mar",
                "March_text", 3, month_select_list.includes(3))
            var Apr = get_month_checkbox_div("check_month_Apr",
                "April_text", 4, month_select_list.includes(4))
            fishing_month_msc.appendChild(Jan)
            fishing_month_msc.appendChild(Feb)
            fishing_month_msc.appendChild(Mar)
            fishing_month_msc.appendChild(Apr)

            var May = get_month_checkbox_div("check_month_May",
                "May_text", 5, month_select_list.includes(5))
            var Jun = get_month_checkbox_div("check_month_Jun",
                "June_text", 6, month_select_list.includes(6))
            var Jul = get_month_checkbox_div("check_month_Jul",
                "July_text", 7, month_select_list.includes(7))
            var Aug = get_month_checkbox_div("check_month_Aug",
                "August_text", 8, month_select_list.includes(8))
            fishing_month_msc.appendChild(May)
            fishing_month_msc.appendChild(Jun)
            fishing_month_msc.appendChild(Jul)
            fishing_month_msc.appendChild(Aug)

            var Sep = get_month_checkbox_div("check_month_Sep",
                "September_text", 9, month_select_list.includes(9))
            var Oct = get_month_checkbox_div("check_month_Oct",
                "October_text", 10, month_select_list.includes(10))
            var Nov = get_month_checkbox_div("check_month_Nov",
                "November_text", 11, month_select_list.includes(11))
            var Dec = get_month_checkbox_div("check_month_Dec",
                "December_text", 12, month_select_list.includes(12))
            fishing_month_msc.appendChild(Sep)
            fishing_month_msc.appendChild(Oct)
            fishing_month_msc.appendChild(Nov)
            fishing_month_msc.appendChild(Dec)
        }

        // update pagination
        max_page = Math.ceil(j / max_item);
        update_pagination(onFishingSearch);
        // input
        var input = document.getElementById("fishing_name");
        input.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("fishing_search_btn").click();
            }
        });
    }
}

function load_fishing_db() {
    if (fishing_data != null) {
        update_hemisphere_radio();
        filter_fishing_data();
        update_fishing_page();
        onChangeSelectedFish();
        init_language();
    } else {
        var request = new XMLHttpRequest();
        request.open("get", 'db/json/fishing.json');
        request.send(null);
        request.onload = function () {
            if (request.status === 200) {
                fishing_data = JSON.parse(request.responseText);
                update_hemisphere_radio();
                filter_fishing_data();
                update_fishing_page();
                onChangeSelectedFish();
                init_language();
            } else {
                window.alert("load data Error!");
                goto_home_page();
            }
        }
    }
}