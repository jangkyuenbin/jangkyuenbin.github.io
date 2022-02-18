var language_data = null;

function isJSON(str) {
    try {
        if (typeof JSON.parse(str) == "object") {
            return true;
        }
    } catch (e) {
    }
    return false;
}

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
    var import_qrcode_btn_text = document.getElementById("import_qrcode_btn_text");
    var download_qrcode_btn_text = document.getElementById("download_qrcode_btn_text");

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
    if (import_qrcode_btn_text != null) {
        import_qrcode_btn_text.onclick = function () {
            var menu_x = document.getElementsByClassName("close")[0];
            if (menu_x != null) {
                menu_x.style.display = "none";
            }
            var bg = document.getElementById("menu_mask_bg");
            var pop = document.getElementById("menu_mask_pop");
            while (pop.firstChild) {
                pop.removeChild(pop.firstChild);
            }
            if (bg != null) {
                bg.style.display = "block";
            }
            var mycanvas = document.createElement("canvas");
            var myoutputMessage = document.createElement("div");
            myoutputMessage.id = "outputMessage";
            mycanvas.id = "canvas";
            mycanvas.hidden = true;
            var div = document.createElement("div");
            div.id = "loadingMessage";
            div.innerText = "🎥 Unable to access video stream (please make sure you have a webcam enabled)";
            // myoutputMessage.innerText = "No QR code detected.";
            pop.appendChild(mycanvas)
            pop.appendChild(div)
            pop.appendChild(myoutputMessage)

            var video = document.createElement("video");
            var canvasElement = document.getElementById("canvas");
            var canvas = canvasElement.getContext("2d");
            var loadingMessage = document.getElementById("loadingMessage");
            var outputContainer = document.getElementById("output");
            var outputMessage = document.getElementById("outputMessage");
            var outputData = document.getElementById("outputData");

            function drawLine(begin, end, color) {
                canvas.beginPath();
                canvas.moveTo(begin.x, begin.y);
                canvas.lineTo(end.x, end.y);
                canvas.lineWidth = 4;
                canvas.strokeStyle = color;
                canvas.stroke();
            }

            function drawMessage(text, x, y) {
                canvas.font = "48px serif";
                canvas.textBaseline = "hanging";
                canvas.strokeText(text, x, y);
            }

            // Use facingMode: environment to attemt to get the front camera on phones

            navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}}).then(function (stream) {
                video.srcObject = stream;
                video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                video.play();
                requestAnimationFrame(tick);
            }).catch(function (e) {

            });

            function tick() {
                loadingMessage.innerText = "⌛ Loading video..."
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    loadingMessage.hidden = true;
                    canvasElement.hidden = false;
                    // outputContainer.hidden = false;

                    canvasElement.height = video.videoHeight;
                    canvasElement.width = video.videoWidth;
                    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
                    var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                    var code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "dontInvert",
                    });
                    if (code) {
                        drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                        drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                        drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                        drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
                        // outputMessage.innerText = code.data;
                        if (isJSON(code.data)) {
                            var json = JSON.parse(code.data);
                            if (json.info.name != null) {
                                var usernames = getAllUserName();
                                if (usernames.includes(json.info.name)) {
                                    var r = window.confirm("是否覆盖已有用户: " + json.info.name);
                                    if (r === true) {
                                        json.is_default = false;
                                        createUser(json.info.name, json)
                                        location.reload();
                                    } else {
                                        console.log("取消覆盖!");
                                    }
                                } else {
                                    json.is_default = false;
                                    createUser(json.info.name, json)
                                    location.reload();
                                }
                            } else {
                                var x = Math.floor(0.5 * code.location.topLeftCorner.x + 0.5 * code.location.bottomLeftCorner.x);
                                var y = Math.floor(0.5 * code.location.topLeftCorner.y + 0.5 * code.location.bottomLeftCorner.y);
                                drawMessage("Not User Data!", x, y);
                            }
                        } else {
                            var x = Math.floor(0.5 * code.location.topLeftCorner.x + 0.5 * code.location.bottomLeftCorner.x);
                            var y = Math.floor(0.5 * code.location.topLeftCorner.y + 0.5 * code.location.bottomLeftCorner.y);
                            drawMessage("Not User Data!", x, y);
                        }
                    } else {
                        // outputMessage.innerText = "No QR code detected.";
                    }
                }
                requestAnimationFrame(tick);
            }
        }
    }
    if (download_qrcode_btn_text != null) {
        download_qrcode_btn_text.onclick = function () {
            var menu_x = document.getElementsByClassName("close")[0];
            if (menu_x != null) {
                menu_x.style.display = "none";
            }
            var bg = document.getElementById("menu_mask_bg");
            var pop = document.getElementById("menu_mask_pop");
            while (pop.firstChild) {
                pop.removeChild(pop.firstChild);
            }
            if (bg != null) {
                bg.style.display = "block";
            }
            const current_user_json = getSelectedUserJson();
            var canvas = document.createElement("canvas");
            canvas.id = "canvas";
            pop.appendChild(canvas)
            QRCode.toCanvas(document.getElementById('canvas'), JSON.stringify(current_user_json), function (error) {
                if (error) console.error(error)
                var canvas1 = document.getElementById('canvas');
                canvas1.style.height = "100%";
                canvas1.style.width = "100%";
                canvas1.style.padding = "20px";
                canvas1.style.borderRadius = "25px";
            })
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

function update_new_month_span(month_list, month_span_id) {
    var arr = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    var now_month = getGameMonths();
    var month_spans = document.getElementById(month_span_id);
    while (month_spans.firstChild) {
        month_spans.removeChild(month_spans.firstChild);
    }
    var b = document.createElement("b")
    b.innerText = "Month: ";
    month_spans.appendChild(b);

    for (let i = 0; i < arr.length; ++i) {
        var span = document.createElement("span");
        span.innerText = arr[i];
        if (i + 1 === now_month) {
            span.classList.add("current_span")
        } else {
            span.classList.add("not_current_span")
        }
        if (month_list.includes((i + 1).toString())) {
            span.classList.add("blue_span");
        } else {
            span.classList.add("gray_span");
        }
        month_spans.appendChild(span);
    }
}

function update_new_day_span(time_dict, am_span_id, pm_span_id) {
    var am_spans = document.getElementById(am_span_id);
    var pm_spans = document.getElementById(pm_span_id);
    var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
    var am_b = document.createElement("b");
    var pm_b = document.createElement("b");

    var now_month = getGameMonths();
    var now_hour = getGameHours();

    while (am_spans.firstChild) {
        am_spans.removeChild(am_spans.firstChild);
    }
    while (pm_spans.firstChild) {
        pm_spans.removeChild(pm_spans.firstChild);
    }

    am_b.innerText = "AM: ";
    pm_b.innerText = "PM: ";
    am_spans.appendChild(am_b);
    pm_spans.appendChild(pm_b);

    for (let i = 0; i < arr.length; ++i) {
        var am_span = document.createElement("span");
        var pm_span = document.createElement("span");
        am_span.innerText = arr[i];
        pm_span.innerText = arr[i];
        if (now_hour > 11) {
            if (i === now_hour - 12) {
                pm_span.classList.add("current_span");
            } else {
                pm_span.classList.add("not_current_span");
            }
            am_span.classList.add("not_current_span");
        } else {
            if (i === now_hour) {
                am_span.classList.add("current_span");
            } else {
                am_span.classList.add("not_current_span");
            }
            pm_span.classList.add("not_current_span");
        }
        if (Object.keys(time_dict).includes(now_month.toString())) {
            if (time_dict[now_month.toString()].includes(i)) {
                am_span.classList.add("blue_span");
            } else {
                am_span.classList.add("gray_span");
            }

            if (time_dict[now_month.toString()].includes(i + 12)) {
                pm_span.classList.add("blue_span");
            } else {
                pm_span.classList.add("gray_span");
            }
        } else {
            am_span.classList.add("gray_span");
            pm_span.classList.add("gray_span");
        }
        am_spans.appendChild(am_span);
        pm_spans.appendChild(pm_span);
    }
}

function change_detail_card(flag) {
    var section = document.getElementById("two");
    if (section != null) {
        if (flag) {
            section.style.display = "";
        } else {
            section.style.display = "none";
        }
    }
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