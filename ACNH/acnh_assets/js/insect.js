var insect_data = null;

var month_select_list = [];
var month_select_name_list = [];
var loc_select_list = [];
var weather_select_list = [];

var name_flag = null;
var donate_flag = null;
var statue_flag = null;
var hemisphere_flag = null;

var current_page = 1;
var max_page = 10;
var max_item = 18;
var tmp_inner_text = '';
var max_show = 3;
var selected_id = null;

function insect_page_onload() {
    name_flag = null;
    donate_flag = null;
    statue_flag = null;
    hemisphere_flag = null;
    selected_id = null;

    all_page_onload();
    load_insect_db();
    multi_select_onload();
}

function onChangeSelectedInsect() {
    var i = 0;
    if (insect_data != null) {
        if (selected_id == null) {
            selected_id = insect_data[0].id;
        }
        var language = getLanguage();
        var insect_selected_pic = document.getElementById("insect_selected_pic");
        var insect_selected_name = document.getElementById("insect_selected_name");
        var insect_selected_dialog = document.getElementById("insect_selected_dialog");
        var insect_selected_loc_td = document.getElementById("insect_selected_loc_td");
        var insect_selected_weather_b = document.getElementById("insect_selected_weather_b");
        var insect_selected_weather_td = document.getElementById("insect_selected_weather_td");
        var insect_selected_sell_td = document.getElementById("insect_selected_sell_td");
        var weather_arr = ["Any except rain", "Rain only", "Any weather"];

        for (i = 0; i < insect_data.length; i++) {
            if (insect_data[i].id === selected_id) {
                insect_selected_pic.src = './images/insect_png/' + insect_data[i].pic_name;
                insect_selected_name.innerText = insect_data[i]['name'][language];
                insect_selected_dialog.innerText = insect_data[i]['dialogue'][language];
                insect_selected_loc_td.innerText = insect_data[i]['location'][language];
                insect_selected_weather_b.innerText = insect_data[i]['weather'][language];
                insect_selected_sell_td.innerText = insect_data[i]['sell'];
                if (hemisphere_flag) {
                    update_new_month_span(Object.keys(insect_data[i].north_time), "insect_month_span")
                } else {
                    update_new_month_span(Object.keys(insect_data[i].south_time), "insect_month_span")
                }
                if (hemisphere_flag) {
                    update_new_day_span(insect_data[i].north_time, "insect_am_span", "insect_pm_span")
                } else {
                    update_new_day_span(insect_data[i].south_time, "insect_am_span", "insect_pm_span")
                }
                var j = 0;
                for (let k = 0; k < insect_selected_weather_td.childNodes.length; k++) {
                    if (insect_selected_weather_td.childNodes[k].nodeName === "IMG") {
                        var img = insect_selected_weather_td.childNodes[k];
                        if (insect_data[i]['weather']['english'] === weather_arr[j]) {
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
    var insect_month_msc = document.getElementById("insect_month_msc");
    var insect_loc_msc = document.getElementById("insect_loc_msc");
    var insect_weather_msc = document.getElementById("insect_weather_msc");
    var insect_month_category = document.getElementById("insect_month_category");
    var insect_loc_category = document.getElementById("insect_loc_category");
    var insect_weather_category = document.getElementById("insect_weather_category");
    insect_month_msc.style.display = "none";
    insect_loc_msc.style.display = "none";
    insect_weather_msc.style.display = "none";

    document.onclick = function () {
        if (insect_month_msc.style.display !== "none") {
            insect_month_msc.style.display = "none";
            onInsectSearch(null);
        }
        if (insect_loc_msc.style.display !== "none") {
            insect_loc_msc.style.display = "none";
            onInsectSearch(null);
        }
        if (insect_weather_msc.style.display !== "none") {
            insect_weather_msc.style.display = "none";
            onInsectSearch(null);
        }
    }

    insect_month_category.addEventListener('click', function (e) {
        if (insect_month_msc.style.display === "none") {
            stopFunc(e);
            insect_month_msc.style.display = "";
            insect_loc_msc.style.display = "none";
            insect_weather_msc.style.display = "none";
        }
    }, false)
    insect_loc_category.addEventListener('click', function (e) {
        if (insect_loc_msc.style.display === "none") {
            stopFunc(e);
            insect_loc_msc.style.display = "";
            insect_month_msc.style.display = "none";
            insect_weather_msc.style.display = "none";
        }
    }, false)
    insect_weather_category.addEventListener('click', function (e) {
        if (insect_weather_msc.style.display === "none") {
            stopFunc(e);
            insect_weather_msc.style.display = "";
            insect_month_msc.style.display = "none";
            insect_loc_msc.style.display = "none";
        }
    }, false)

    insect_month_msc.addEventListener('click', function (e) {
        stopFunc(e);
    }, false)
    insect_loc_msc.addEventListener('click', function (e) {
        stopFunc(e);
    }, false)
    insect_weather_msc.addEventListener('click', function (e) {
        stopFunc(e);
    }, false)

    //阻止事件向上传递
    function stopFunc(e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }
}

function change_insect_donated_flag(id) {
    var page_json = getPageJson('insect_donate')
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
    savePageJson('insect_donate', page_json)
    onInsectSearch(null);
}

function change_insect_statued_flag(id) {
    var page_json = getPageJson('insect_statue')
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
    savePageJson('insect_statue', page_json)
    onInsectSearch(null);
}

function get_insect_img_div(url, now_month_flag, new_flag, pass_flag, bugsable_flag, coming_flag) {
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

function get_insect_node_div(id, url, name, donated_flag, statue_flag, catchable_flag, new_flag, pass_flag, bugsable_flag, coming_flag) {
    var img_div = get_insect_img_div(url, catchable_flag, new_flag, pass_flag, bugsable_flag, coming_flag);
    img_div.onclick = function () {
        selected_id = id;
        onChangeSelectedInsect();
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
        change_insect_donated_flag(id);
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
        change_insect_statued_flag(id);
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
        var category = document.getElementById('insect_month_category');
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
    } else if (category_name.indexOf("weather") > -1) {
        checkBox.addEventListener('change', function (event) {
            var category = document.getElementById(category_name);
            var span = document.createElement('span');
            span.classList.add('icon_more');
            tmp_inner_text = category.innerText;
            current_page = 1;
            if (event.currentTarget.checked) {
                weather_select_list.push(event.currentTarget.name);
                weather_select_list.sort();
            } else {
                weather_select_list = arrayRemove(weather_select_list, event.currentTarget.name);
            }

            var text = '';
            if (weather_select_list.length > max_show) {
                category.classList.remove("weather_category_all_text")
                text = weather_select_list.slice(0, max_show).join(", ") + ", ...";
                category.textContent = text;
            } else if (weather_select_list.length > 1) {
                category.classList.remove("weather_category_all_text")
                text = weather_select_list.join(", ");
                category.textContent = text;
            } else if (weather_select_list.length === 0) {
                category.classList.add("weather_category_all_text")
                category.textContent = tmp_inner_text;
            } else {
                category.classList.remove("weather_category_all_text")
                category.textContent = weather_select_list[0];
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
        var insect_hradio_north = document.getElementById('insect_hradio_north');
        var insect_hradio_south = document.getElementById('insect_hradio_south');
        if (getHemisphere() === 'north') {
            hemisphere_flag = true;
            insect_hradio_north.checked = true;
        } else {
            hemisphere_flag = false;
            insect_hradio_south.checked = true;
        }
    }
}

function onInsectSearch(element) {
    var insect_name = document.getElementById('insect_name');
    var insect_dradio_true = document.getElementById('insect_dradio_true');
    var insect_dradio_false = document.getElementById('insect_dradio_false');
    var insect_sradio_true = document.getElementById('insect_sradio_true');
    var insect_sradio_false = document.getElementById('insect_sradio_false');
    var insect_hradio_north = document.getElementById('insect_hradio_north');
    var insect_hradio_south = document.getElementById('insect_hradio_south');
    var current_name = null;
    if (insect_name.value !== '') {
        current_name = insect_name.value;
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
            load_insect_db();
        }
    } else {
        if (insect_dradio_true.checked) {
            donate_flag = true
        } else if (insect_dradio_false.checked) {
            donate_flag = false
        } else {
            donate_flag = null
        }
        if (insect_sradio_true.checked) {
            statue_flag = true
        } else if (insect_sradio_false.checked) {
            statue_flag = false
        } else {
            statue_flag = null
        }
        if (insect_hradio_north.checked) {
            hemisphere_flag = true
        } else if (insect_hradio_south.checked) {
            hemisphere_flag = false
        } else {
            hemisphere_flag = null
        }
        load_insect_db();
    }
}

function onInsectReset() {
    var insect_name = document.getElementById('insect_name');
    var insect_dradio_all = document.getElementById('insect_dradio_all');
    var insect_sradio_all = document.getElementById('insect_sradio_all');
    var insect_month_category = document.getElementById('insect_month_category');
    var insect_loc_category = document.getElementById('insect_loc_category');
    var insect_weather_category = document.getElementById('insect_weather_category');
    insect_name.value = '';
    insect_dradio_all.checked = true;
    insect_sradio_all.checked = true;
    month_select_list = [];
    month_select_name_list = [];
    loc_select_list = [];
    weather_select_list = [];
    current_page = 1;
    insect_month_category.classList.add("month_category_all_text");
    insect_loc_category.classList.add("loc_category_all_text");
    insect_weather_category.classList.add("weather_category_all_text");
    insect_page_onload();
}

function filter_insect_data() {
    var i;
    if (insect_data != null) {
        var donate_json = getPageJson('insect_donate')
        var statue_json = getPageJson('insect_statue')
        var now_month = getGameMonths();
        var next_month = now_month === 12 ? 1 : now_month + 1;
        var prev_month = now_month === 1 ? 12 : now_month - 1;
        var now_hour = getGameHours();
        for (i = 0; i < insect_data.length; i++) {
            insect_data[i].show_flag = 1;
            insect_data[i].donate_flag = 0;
            insect_data[i].statue_flag = 0;
            insect_data[i].this_month_flag = 0;
            insect_data[i].coming_month_flag = 0;
            insect_data[i].last_month_flag = 0;
            insect_data[i].new_month_flag = 0;
            insect_data[i].catchable_flag = 0;

            if (hemisphere_flag != null) {
                if (hemisphere_flag) {
                    if (Object.keys(insect_data[i].north_time).includes(now_month.toString())) {
                        insect_data[i].this_month_flag = 1;
                        if (insect_data[i].north_time[now_month.toString()].includes(now_hour)) {
                            insect_data[i].catchable_flag = 1;
                        }
                        if (!Object.keys(insect_data[i].north_time).includes(next_month.toString())) {
                            insect_data[i].last_month_flag = 1;
                        }
                        if (!Object.keys(insect_data[i].north_time).includes(prev_month.toString())) {
                            insect_data[i].new_month_flag = 1;
                        }
                    } else {
                        if (Object.keys(insect_data[i].north_time).includes(next_month.toString())) {
                            insect_data[i].coming_month_flag = 1;
                        }
                    }
                } else {
                    if (Object.keys(insect_data[i].south_time).includes(now_month.toString())) {
                        insect_data[i].this_month_flag = 1;
                        if (insect_data[i].south_time[now_month.toString()].includes(now_hour)) {
                            insect_data[i].catchable_flag = 1;
                        }
                        if (!Object.keys(insect_data[i].south_time).includes(next_month.toString())) {
                            insect_data[i].last_month_flag = 1;
                        }
                        if (!Object.keys(insect_data[i].south_time).includes(prev_month.toString())) {
                            insect_data[i].new_month_flag = 1;
                        }
                    } else {
                        if (Object.keys(insect_data[i].south_time).includes(next_month.toString())) {
                            insect_data[i].coming_month_flag = 1;
                        }
                    }
                }
            }
        }

        if (donate_json != null) {
            for (i = 0; i < insect_data.length; i++) {
                if (donate_json.includes(insect_data[i].id)) {
                    insect_data[i].donate_flag = 1
                }
            }
        }

        if (statue_json != null) {
            for (i = 0; i < insect_data.length; i++) {
                if (statue_json.includes(insect_data[i].id)) {
                    insect_data[i].statue_flag = 1
                }
            }
        }

        // filter name data
        if (name_flag != null) {
            console.log('name filter')
            for (i = 0; i < insect_data.length; i++) {
                if (insect_data[i].show_flag === 1) {
                    insect_data[i].show_flag = 0
                    for (var p in insect_data[i].name) {
                        if (insect_data[i].name[p].indexOf(name_flag) > -1) {
                            insect_data[i].show_flag = 1
                            break;
                        }
                    }
                }
            }
        }

        // filter donate data
        if (donate_flag != null) {
            for (i = 0; i < insect_data.length; i++) {
                if (insect_data[i].show_flag === 1) {
                    if (donate_flag) {
                        insect_data[i].show_flag = insect_data[i].donate_flag
                    } else {
                        insect_data[i].show_flag = insect_data[i].donate_flag ^ 1
                    }
                }

            }
        }

        // filter statue data
        if (statue_flag != null) {
            for (i = 0; i < insect_data.length; i++) {
                if (insect_data[i].show_flag === 1) {
                    if (statue_flag) {
                        insect_data[i].show_flag = insect_data[i].statue_flag
                    } else {
                        insect_data[i].show_flag = insect_data[i].statue_flag ^ 1
                    }
                }

            }
        }

        // filter loc category data
        if (loc_select_list.length !== 0) {
            for (i = 0; i < insect_data.length; i++) {
                if (insect_data[i].show_flag === 1) {
                    insect_data[i].show_flag = 0
                    for (var p in insect_data[i].location) {
                        if (loc_select_list.includes(insect_data[i].location[p])) {
                            insect_data[i].show_flag = 1
                            break;
                        }
                    }
                }

            }
        }

        // filter weather category data
        if (weather_select_list.length !== 0) {
            for (i = 0; i < insect_data.length; i++) {
                if (insect_data[i].show_flag === 1) {
                    insect_data[i].show_flag = 0
                    for (var p in insect_data[i].location) {
                        if (weather_select_list.includes(insect_data[i].weather[p])) {
                            insect_data[i].show_flag = 1
                            break;
                        }
                    }
                }

            }
        }

        // filter month category data
        if (month_select_list.length !== 0) {
            for (i = 0; i < insect_data.length; i++) {
                if (insect_data[i].show_flag === 1) {
                    insect_data[i].show_flag = 0
                    if (hemisphere_flag != null) {
                        if (hemisphere_flag) {
                            for (var p in insect_data[i].north_time) {
                                if (month_select_list.includes(parseInt(p))) {
                                    insect_data[i].show_flag = 1
                                    break;
                                }
                            }
                        } else {
                            for (var p in insect_data[i].south_time) {
                                if (month_select_list.includes(parseInt(p))) {
                                    insect_data[i].show_flag = 1
                                    break;
                                }
                            }
                        }
                    } else {
                        insect_data[i].show_flag = 1
                    }
                }
            }
        }
    }
}

function update_insect_page() {
    if (insect_data != null) {
        var language = getLanguage();
        var insect_loc_category_array = [];
        var insect_weather_category_array = [];
        var i = 0;
        var j = 0;
        var items_div = document.getElementById('items_div');
        while (items_div.firstChild) {
            items_div.removeChild(items_div.firstChild);
        }
        var start_i = (current_page - 1) * max_item;
        var end_i = current_page * max_item;

        insect_data.sort(function (a, b) {
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

        for (i = 0; i < insect_data.length; i++) {
            if (insect_data[i].show_flag === 1) {
                if (j >= start_i && j < end_i) {
                    var node_div = get_insect_node_div(
                        id = insect_data[i].id,
                        url = './images/insect_png/' + insect_data[i].pic_name,
                        name = insect_data[i]['name'][language],
                        donate_flag = insect_data[i].donate_flag,
                        statue_flag = insect_data[i].statue_flag,
                        catchable_flag = insect_data[i].this_month_flag,
                        new_flag = insect_data[i].new_month_flag,
                        pass_flag = insect_data[i].last_month_flag,
                        bugsable_flag = insect_data[i].catchable_flag,
                        coming_flag = insect_data[i].coming_month_flag)
                    items_div.appendChild(node_div);
                }
                j++;
            }
            insect_loc_category_array.push(insect_data[i]['location'][language])
            insect_weather_category_array.push(insect_data[i]['weather'][language])
        }
        // update insect_loc_category
        insect_loc_category_array = Array.from(new Set(insect_loc_category_array));
        insect_loc_category_array.sort();
        var insect_loc_msc = document.getElementById('insect_loc_msc');
        if (insect_loc_msc != null) {
            while (insect_loc_msc.firstChild) {
                insect_loc_msc.removeChild(insect_loc_msc.firstChild);
            }
            for (i = 0; i < insect_loc_category_array.length; i++) {
                var is_check = loc_select_list.includes(insect_loc_category_array[i]);
                var div = get_checkbox_div("check_loc_" + i.toString(),
                    insect_loc_category_array[i], is_check, "insect_loc_category")
                insect_loc_msc.appendChild(div)
            }
        }
        // update insect_weather_category
        insect_weather_category_array = Array.from(new Set(insect_weather_category_array));
        insect_weather_category_array.sort();
        var insect_weather_msc = document.getElementById('insect_weather_msc');
        if (insect_weather_msc != null) {
            while (insect_weather_msc.firstChild) {
                insect_weather_msc.removeChild(insect_weather_msc.firstChild);
            }
            for (i = 0; i < insect_weather_category_array.length; i++) {
                var is_check = weather_select_list.includes(insect_weather_category_array[i]);
                var div = get_checkbox_div("check_weather_" + i.toString(),
                    insect_weather_category_array[i], is_check, "insect_weather_category")
                insect_weather_msc.appendChild(div)
            }
        }
        // update insect_month_category
        var insect_month_msc = document.getElementById('insect_month_msc');
        if (insect_month_msc != null) {
            while (insect_month_msc.firstChild) {
                insect_month_msc.removeChild(insect_month_msc.firstChild);
            }
            var Jan = get_month_checkbox_div("check_month_Jan",
                "January_text", 1, month_select_list.includes(1))
            var Feb = get_month_checkbox_div("check_month_Feb",
                "February_text", 2, month_select_list.includes(2))
            var Mar = get_month_checkbox_div("check_month_Mar",
                "March_text", 3, month_select_list.includes(3))
            var Apr = get_month_checkbox_div("check_month_Apr",
                "April_text", 4, month_select_list.includes(4))
            insect_month_msc.appendChild(Jan)
            insect_month_msc.appendChild(Feb)
            insect_month_msc.appendChild(Mar)
            insect_month_msc.appendChild(Apr)

            var May = get_month_checkbox_div("check_month_May",
                "May_text", 5, month_select_list.includes(5))
            var Jun = get_month_checkbox_div("check_month_Jun",
                "June_text", 6, month_select_list.includes(6))
            var Jul = get_month_checkbox_div("check_month_Jul",
                "July_text", 7, month_select_list.includes(7))
            var Aug = get_month_checkbox_div("check_month_Aug",
                "August_text", 8, month_select_list.includes(8))
            insect_month_msc.appendChild(May)
            insect_month_msc.appendChild(Jun)
            insect_month_msc.appendChild(Jul)
            insect_month_msc.appendChild(Aug)

            var Sep = get_month_checkbox_div("check_month_Sep",
                "September_text", 9, month_select_list.includes(9))
            var Oct = get_month_checkbox_div("check_month_Oct",
                "October_text", 10, month_select_list.includes(10))
            var Nov = get_month_checkbox_div("check_month_Nov",
                "November_text", 11, month_select_list.includes(11))
            var Dec = get_month_checkbox_div("check_month_Dec",
                "December_text", 12, month_select_list.includes(12))
            insect_month_msc.appendChild(Sep)
            insect_month_msc.appendChild(Oct)
            insect_month_msc.appendChild(Nov)
            insect_month_msc.appendChild(Dec)
        }

        // update pagination
        max_page = Math.ceil(j / max_item);
        update_pagination(onInsectSearch);
        // input
        var input = document.getElementById("insect_name");
        input.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("insect_search_btn").click();
            }
        });
    }
}

function load_insect_db() {
    if (insect_data != null) {
        update_hemisphere_radio();
        filter_insect_data();
        update_insect_page();
        onChangeSelectedInsect();
        init_language();
    } else {
        var request = new XMLHttpRequest();
        request.open("get", 'db/json/insect.json');
        request.send(null);
        request.onload = function () {
            if (request.status === 200) {
                insect_data = JSON.parse(request.responseText);
                update_hemisphere_radio();
                filter_insect_data();
                update_insect_page();
                onChangeSelectedInsect();
                init_language();
            } else {
                window.alert("load data Error!");
                goto_home_page();
            }
        }
    }

}