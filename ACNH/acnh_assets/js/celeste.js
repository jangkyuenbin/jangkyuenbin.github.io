function getJSON(url, page) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            var data = JSON.parse(xhr.responseText);
            page.get_json_call_back(true, data);
        } else {
            page.get_json_call_back(false, null);
        }
    };
    xhr.send();
}

class BasePage {
    constructor() {
        this.data = null;
        this.page_name = 'base';
    }


    filter_data() {
        alert("not implement!");
    }

    update_page() {
        alert("not implement!");
    }

    get_json_call_back(status, data) {
        if (status) {
            this.data = data;
            this.load_db();
        } else {
            goto_home_page();
        }

    }

    load_db() {
        if (this.data != null) {
            this.filter_data();
            this.update_page();
            init_language();
            window.location.href = "#two"
        } else {
            getJSON('db/json/' + this.page_name + '.json', this);
        }
    }
}

class BasePageUI {
    constructor(page) {
        this.page = page;
        this.OnMenuLoad();
        this.hookMenuEvent();
    }

    // event
    OnMenuFormChange() {
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

    OnUserChange() {
        var user_select = document.getElementById('user-category')
        var index = user_select.selectedIndex;
        console.log(user_select.options[index].value);
        cancelSelectionOtherUser();
        const selected_user_json = getUserJson(user_select.options[index].value);
        selected_user_json.is_selected = true;
        saveUserJson(user_select.options[index].value, selected_user_json);
        location.reload();
    }

    OnClickScanQRCode() {
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
                canvasElement.style.height = "100%";
                canvasElement.style.width = "100%";
                canvasElement.style.padding = "20px";
                canvasElement.style.borderRadius = "25px";
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

    OnClickShowQRCode() {
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
        var div = document.createElement("div");
        canvas.id = "canvas";
        div.id = "qrcode_show_div";
        pop.appendChild(canvas);
        pop.appendChild(div);
        QRCode.toCanvas(document.getElementById('canvas'), JSON.stringify(current_user_json), function (error) {
            if (error) console.error(error)
            var canvas1 = document.getElementById('canvas');
            canvas1.style.height = "100%";
            canvas1.style.width = "100%";
            canvas1.style.padding = "20px";
            canvas1.style.borderRadius = "25px";
        })
    }

    hookMenuEvent() {
        var menu_form = document.getElementById('menu_form');
        var user_form = document.getElementById("user_form");
        var import_btn_text = document.getElementById("import_btn_text");
        var reset_btn_text = document.getElementById("reset_btn_text");
        var download_btn_text = document.getElementById("download_btn_text");
        var import_qrcode_btn_text = document.getElementById("import_qrcode_btn_text");
        var download_qrcode_btn_text = document.getElementById("download_qrcode_btn_text");

        var this_object = this;

        if (menu_form != null) {
            menu_form.onchange = function () {
                this_object.OnMenuFormChange();
            }
        }

        if (user_form != null) {
            user_form.onchange = function () {
                this_object.OnUserChange();
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
                this_object.OnClickScanQRCode();
            }
        }
        if (download_qrcode_btn_text != null) {
            download_qrcode_btn_text.onclick = function () {
                this_object.OnClickShowQRCode();
            }
        }
    }

    OnMenuLoad() {
        var language_select = document.getElementById('language-category')
        var user_select = document.getElementById('user-category')
        const current_user_json = getSelectedUserJson();
        var language = getLanguage();

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

    getPrevDiv() {
        var page = this.page;
        var prev_btn = document.createElement('span');
        prev_btn.classList.add("button")
        prev_btn.classList.add("small")
        prev_btn.classList.add("prev_text")
        if (this.page.current_page === 1) {
            prev_btn.classList.add("disabled")
        }
        var prev_li = document.createElement('li');
        prev_li.onclick = function () {
            if (page.current_page > 1) {
                page.current_page = page.current_page - 1;
                page.onSearch(null);
            }
        };
        prev_li.appendChild(prev_btn)
        return prev_li
    }

    getNextDiv() {
        var page = this.page;
        var next_btn = document.createElement('span');
        next_btn.classList.add("button")
        next_btn.classList.add("small")
        next_btn.classList.add("next_text")
        if (this.page.current_page === this.page.max_page) {
            next_btn.classList.add("disabled")
        }
        var next_li = document.createElement('li');
        next_li.onclick = function () {
            if (page.current_page < page.max_page) {
                page.current_page = page.current_page + 1;
                page.onSearch(null);
            }
        };
        next_li.appendChild(next_btn)
        return next_li
    }

    getNavPageDiv(page_id) {
        var page = this.page;
        var a = document.createElement('a');
        a.classList.add('page');
        a.textContent = page_id;
        if (page_id === this.page.current_page) {
            a.classList.add("active");
        }
        var li = document.createElement('li');
        li.onclick = function () {
            if (page_id <= page.max_page && page_id >= 1) {
                page.current_page = page_id;
                page.onSearch(null);
            }
        };
        li.appendChild(a);
        return li
    }

    getEmptyNavPageDiv() {
        var a = document.createElement('a');
        a.classList.add('page');
        a.textContent = "...";
        var li = document.createElement('li');
        li.appendChild(a);
        return li
    }

    updatePagination() {
        // update pagination
        var i = 0;
        var nav_page;
        var pagination = document.getElementById('pagination');
        if (pagination != null) {
            cleanElementChild(pagination);
            if (this.page.max_page > 1) {
                var prev = this.getPrevDiv();
                var next = this.getNextDiv();
                pagination.appendChild(prev);
                if (this.page.max_page <= 7) {
                    for (i = 0; i < this.page.max_page; i++) {
                        nav_page = this.getNavPageDiv(i + 1);
                        pagination.appendChild(nav_page);
                    }
                } else {
                    if (this.page.current_page <= 3 || this.page.current_page + 3 > this.page.max_page) {
                        for (i = 1; i <= 3; i++) {
                            nav_page = this.getNavPageDiv(i);
                            pagination.appendChild(nav_page);
                        }
                        nav_page = this.getEmptyNavPageDiv();
                        pagination.appendChild(nav_page);
                        for (i = this.page.max_page - 2; i <= this.page.max_page; i++) {
                            nav_page = this.getNavPageDiv(i + 1);
                            pagination.appendChild(nav_page);
                        }
                    } else {
                        nav_page = this.getNavPageDiv(1);
                        pagination.appendChild(nav_page);
                        nav_page = this.getEmptyNavPageDiv();
                        pagination.appendChild(nav_page);

                        nav_page = this.getNavPageDiv(this.page.current_page - 1);
                        pagination.appendChild(nav_page);
                        nav_page = this.getNavPageDiv(this.page.current_page);
                        pagination.appendChild(nav_page);
                        nav_page = this.getNavPageDiv(this.page.current_page + 1);
                        pagination.appendChild(nav_page);

                        nav_page = this.getEmptyNavPageDiv();
                        pagination.appendChild(nav_page);
                        nav_page = this.getNavPageDiv(this.page.max_page);
                        pagination.appendChild(nav_page);
                    }
                }
                pagination.appendChild(next);
            }
        }
    }
}

class CelestePageUI extends BasePageUI {
    constructor(page) {
        super(page);
        this.hookBtnEvent();
    }

    hookBtnEvent() {
        var reset_btn = document.getElementById('reset_btn');
        var search_btn = document.getElementById('search_btn');
        var all_own_btn = document.getElementById('all_own_btn');
        var is_own_btn = document.getElementById('is_own_btn');
        var not_own_btn = document.getElementById('not_own_btn');
        var page = this.page;
        reset_btn.onclick = function () {
            page.onReset();
        };
        search_btn.onclick = function () {
            page.onSearch(search_btn);
        };
        all_own_btn.onclick = function () {
            page.onSearch(all_own_btn);
        };
        is_own_btn.onclick = function () {
            page.onSearch(is_own_btn);
        };
        not_own_btn.onclick = function () {
            page.onSearch(not_own_btn);
        };
    }

    getImgDiv(url) {
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

    getNodeDiv(id, url, name, flag) {
        var page = this.page;
        var img_div = this.getImgDiv(url);
        var name_div = document.createElement('div');
        var tips_div = document.createElement('div');
        var name_p = document.createElement('p');
        name_div.classList.add('border_b');
        name_div.classList.add('overflow_info');
        name_div.style = "width: 100%;text-align: center;";
        // name_div.appendChild(inner_div)
        // inner_div.appendChild(name_p)
        name_div.appendChild(name_p)
        name_div.appendChild(tips_div);
        if (name === "") {
            name_p.classList.add('not_translated_text');
            tips_div.classList.add('not_translated_text');
        } else {
            name_p.textContent = name;
            tips_div.textContent = name;
        }
        // name_p.classList.add('haveTips')
        // name_p.setAttribute("tips", name);

        var flag_div = document.createElement('div');
        flag_div.classList.add('border_b');
        if (flag === 0) {
            flag_div.classList.add('not_owned_label_text');
        } else {
            flag_div.classList.add('owned_label_text');
        }
        flag_div.style = "width: 100%;text-align: center;";
        flag_div.onclick = function () {
            page.onChangeOwnFlag(id);
        }

        var div2 = document.createElement('div');
        div2.className = "row out_border";
        div2.appendChild(img_div);
        div2.appendChild(name_div);
        div2.appendChild(flag_div);

        var node_div = document.createElement('div');
        node_div.className = "col-2 col-6-small pd";
        node_div.appendChild(div2);
        // event
        // name_div.onclick = function () {
        //     var div = name_div.getElementsByTagName('div')[0];
        //     var p = div.getElementsByTagName('p')[0];
        //     var p_w = p.offsetWidth;
        //     var div_w = name_div.offsetWidth;
        //     console.log(p_w, div_w);
        //     if (div_w > p_w) {
        //         return false;
        //     }
        //     //div.innerHTML += div.innerHTML;
        //     console.log(name_div)
        //     name_div.scrollLeft += 20
        //     // setInterval(function () {
        //     //     if (p_w <= p.scrollLeft) {
        //     //         p.scrollLeft -= p_w;
        //     //     } else {
        //     //         p.scrollLeft+=1;
        //     //     }
        //     //     console.log(p_w, p.scrollLeft)
        //     // }, 1000);
        //
        // }

        return node_div
    }
}

class CelestePage extends BasePage {

    constructor() {
        super();
        this.page_name = 'celeste';
        this.current_page = 1;
        this.max_page = null;
        this.max_item = 18;
        this.name_flag = null;
        this.own_flag = null;
        this.load_db();
        this.ui = new CelestePageUI(this);
    }

    // event
    onSearch(element) {
        var celeste_name = document.getElementById('celeste_name');
        var radio_01 = document.getElementById('celeste_radio_01');
        var radio_02 = document.getElementById('celeste_radio_02');
        var current_name = null;
        if (celeste_name.value !== '') {
            current_name = celeste_name.value;
        }
        this.name_flag = current_name;
        if (element != null && element.tagName === "LABEL") {
            var radio = document.getElementById(element.htmlFor);
            if (!radio.checked) {
                if (radio.value === '1') {
                    this.own_flag = true;
                } else if (radio.value === '2') {
                    this.own_flag = false;
                } else {
                    this.own_flag = null;
                }
                this.current_page = 1;
                this.load_db();
            }
        } else {
            if (radio_01.checked) {
                this.own_flag = true;
            } else if (radio_02.checked) {
                this.own_flag = false;
            } else {
                this.own_flag = null;
            }
            this.load_db();
        }
    }

    onChangeOwnFlag(id) {
        var page_json = getPageJson(this.page_name)
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
        savePageJson(this.page_name, page_json)
        this.onSearch(null);
    }

    onReset() {
        var celeste_name = document.getElementById('celeste_name');
        var radio_00 = document.getElementById('celeste_radio_00');
        celeste_name.value = '';
        radio_00.checked = true;
        this.current_page = 1;
        this.name_flag = null;
        this.own_flag = null;
        this.load_db();
    }

    // page handler
    filter_data() {
        if (this.data != null) {
            var i;
            var page_json = getPageJson(this.page_name)
            // clean data
            for (i = 0; i < this.data.length; i++) {
                this.data[i].show_flag = 1;
                this.data[i].own_flag = 0;
            }
            // get own cookie
            if (page_json != null) {
                for (i = 0; i < this.data.length; i++) {
                    if (page_json.includes(this.data[i].id)) {
                        this.data[i].own_flag = 1
                    }
                }
            }
            // filter name data
            if (this.name_flag != null) {
                console.log('name filter')
                for (i = 0; i < this.data.length; i++) {
                    if (this.data[i].show_flag === 1) {
                        this.data[i].show_flag = 0
                        for (var p in this.data[i].name) {
                            if (this.data[i].name[p].indexOf(this.name_flag) > -1) {
                                this.data[i].show_flag = 1
                                break;
                            }
                        }
                    }
                }
            }

            // filter own data
            if (this.own_flag != null) {
                console.log('own filter')
                for (i = 0; i < this.data.length; i++) {
                    if (this.data[i].show_flag === 1) {
                        if (this.own_flag) {
                            this.data[i].show_flag = this.data[i].own_flag
                        } else {
                            this.data[i].show_flag = this.data[i].own_flag ^ 1
                        }
                    }
                }
            }
        }
    }

    update_page() {
        if (this.data != null) {
            var language = getLanguage();
            var i;
            var show_size = 0;
            var start_i = (this.current_page - 1) * this.max_item;
            var end_i = this.current_page * this.max_item;

            var items_div = document.getElementById('items_div');
            cleanElementChild(items_div);
            this.data.sort(function (a, b) {
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
            for (i = 0; i < this.data.length; i++) {
                if (this.data[i].show_flag === 1) {
                    if (show_size >= start_i && show_size < end_i) {
                        var node_div = this.ui.getNodeDiv(
                            this.data[i].id,
                            './images/celeste_png/' + this.data[i].pic_name,
                            this.data[i]['name'][language],
                            this.data[i].own_flag
                        )
                        items_div.appendChild(node_div);
                    }
                    show_size++;
                }
            }
            this.max_page = Math.ceil(show_size / this.max_item);
            this.ui.updatePagination();
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
}

// var current_page = 1;
// var max_page = 10;
// var max_item = 18;
// var celeste_data = null;
// var name_flag = null;
// var own_flag = null;
//
// function celeste_page_onload() {
//     all_page_onload();
//     name_flag = null;
//     own_flag = null;
//     load_celeste_db();
// }
//
// function onCelesteEnterPress(e) {
//     console.log(e);
//     if (e.which === 13) {
//         console.log(e);
//         alert("You've entered: ");
//     }
// }
//
// function onCelesteReset() {
//     var celeste_name = document.getElementById('celeste_name');
//     var radio_00 = document.getElementById('celeste_radio_00');
//     celeste_name.value = '';
//     radio_00.checked = true;
//     current_page = 1;
//     celeste_page_onload();
// }
//
// function onCelesteSearch(element) {
//     var celeste_name = document.getElementById('celeste_name');
//     var radio_01 = document.getElementById('celeste_radio_01');
//     var radio_02 = document.getElementById('celeste_radio_02');
//     var current_name = null;
//     if (celeste_name.value !== '') {
//         current_name = celeste_name.value;
//     }
//     name_flag = current_name;
//     if (element != null && element.tagName === "LABEL") {
//         var radio = document.getElementById(element.htmlFor);
//         if (!radio.checked) {
//             if (radio.value === '1') {
//                 own_flag = true;
//             } else if (radio.value === '2') {
//                 own_flag = false;
//             } else {
//                 own_flag = null;
//             }
//             current_page = 1;
//             load_celeste_db();
//         }
//     } else {
//         if (radio_01.checked) {
//             own_flag = true;
//         } else if (radio_02.checked) {
//             own_flag = false;
//         } else {
//             own_flag = null;
//         }
//         load_celeste_db();
//     }
// }
//
// function get_celeste_img_div(url) {
//     var div = document.createElement('div');
//     var img = document.createElement('img');
//     img.style = "border-radius: 10px";
//     img.className = "one";
//     img.src = url;
//     img.width = "100%";
//     div.className = "border_tr";
//     div.style = "width: 100%;";
//     div.appendChild(img);
//     return div
// }
//
// function change_celeste_own_flag(id) {
//     var page_json = getPageJson('celeste')
//     if (page_json != null) {
//         if (page_json.includes(id)) {
//             const index = page_json.indexOf(id);
//             if (index > -1) {
//                 page_json.splice(index, 1);
//             }
//         } else {
//             page_json.push(id)
//         }
//     } else {
//         page_json = [id]
//     }
//     page_json = Array.from(new Set(page_json));
//     page_json.sort(function (a, b) {
//         return a - b
//     });
//     savePageJson('celeste', page_json)
//     onCelesteSearch(null);
// }
//
// function get_celeste_node_div(id, url, name, flag) {
//     var img_div = get_celeste_img_div(url);
//     var name_div = document.createElement('div');
//     name_div.classList.add('border_b');
//     name_div.style = "width: 100%;text-align: center;";
//     if (name === "") {
//         name_div.classList.add('not_translated_text');
//     } else {
//         name_div.textContent = name;
//     }
//
//     var flag_div = document.createElement('div');
//     flag_div.classList.add('border_b');
//     if (flag === 0) {
//         flag_div.classList.add('not_owned_label_text');
//     } else {
//         flag_div.classList.add('owned_label_text');
//     }
//     flag_div.style = "width: 100%;text-align: center;";
//     flag_div.onclick = function () {
//         change_celeste_own_flag(id);
//     }
//
//     var div2 = document.createElement('div');
//     div2.className = "row out_border";
//     div2.appendChild(img_div);
//     div2.appendChild(name_div);
//     div2.appendChild(flag_div);
//
//     var node_div = document.createElement('div');
//     node_div.className = "col-2 col-6-small pd";
//     node_div.appendChild(div2);
//     return node_div
// }
//
// function filter_celeste_data() {
//     if (celeste_data != null) {
//         var i;
//         var page_json = getPageJson('celeste')
//         // clean data
//         for (i = 0; i < celeste_data.length; i++) {
//             celeste_data[i].show_flag = 1;
//             celeste_data[i].own_flag = 0;
//         }
//         // get own cookie
//         if (page_json != null) {
//             for (i = 0; i < celeste_data.length; i++) {
//                 if (page_json.includes(celeste_data[i].id)) {
//                     celeste_data[i].own_flag = 1
//                 }
//             }
//         }
//         // filter name data
//         if (name_flag != null) {
//             console.log('name filter')
//             for (i = 0; i < celeste_data.length; i++) {
//                 if (celeste_data[i].show_flag === 1) {
//                     celeste_data[i].show_flag = 0
//                     for (var p in celeste_data[i].name) {
//                         if (celeste_data[i].name[p].indexOf(name_flag) > -1) {
//                             celeste_data[i].show_flag = 1
//                             break;
//                         }
//                     }
//                 }
//             }
//         }
//
//         // filter own data
//         if (own_flag != null) {
//             console.log('own filter')
//             for (i = 0; i < celeste_data.length; i++) {
//                 if (celeste_data[i].show_flag === 1) {
//                     if (own_flag) {
//                         celeste_data[i].show_flag = celeste_data[i].own_flag
//                     } else {
//                         celeste_data[i].show_flag = celeste_data[i].own_flag ^ 1
//                     }
//                 }
//             }
//         }
//     }
// }
//
// function update_celeste_page() {
//     if (celeste_data != null) {
//         var language = getLanguage();
//         var i;
//         var show_size = 0;
//         var start_i = (current_page - 1) * max_item;
//         var end_i = current_page * max_item;
//
//         var items_div = document.getElementById('items_div');
//         cleanElementChild(items_div);
//         celeste_data.sort(function (a, b) {
//             var nameA = a['name'][language];
//             var nameB = b['name'][language];
//             if (nameA < nameB) {
//                 return -1;
//             }
//             if (nameA > nameB) {
//                 return 1;
//             }
//             return 0;
//         });
//         for (i = 0; i < celeste_data.length; i++) {
//             if (celeste_data[i].show_flag === 1) {
//                 if (show_size >= start_i && show_size < end_i) {
//                     var node_div = get_celeste_node_div(
//                         id = celeste_data[i].id,
//                         url = './images/celeste_png/' + celeste_data[i].pic_name,
//                         name = celeste_data[i]['name'][language],
//                         flag = celeste_data[i].own_flag)
//                     items_div.appendChild(node_div);
//                 }
//                 show_size++;
//             }
//         }
//         max_page = Math.ceil(show_size / max_item);
//         update_pagination(onCelesteSearch);
//         // input
//         var input = document.getElementById("celeste_name");
//         input.addEventListener("keydown", function (event) {
//             if (event.keyCode === 13) {
//                 event.preventDefault();
//                 document.getElementById("celeste_search_btn").click();
//             }
//         });
//     }
// }
//
// function load_celeste_db() {
//     if (celeste_data != null) {
//         filter_celeste_data();
//         update_celeste_page();
//         init_language();
//         window.location.href = "#two"
//     } else {
//         var request = new XMLHttpRequest();
//         request.open("get", 'db/json/celeste.json');
//         request.send(null);
//         request.onload = function () {
//             if (request.status === 200) {
//                 celeste_data = JSON.parse(request.responseText);
//                 filter_celeste_data();
//                 update_celeste_page();
//                 init_language();
//             } else {
//                 window.alert("load data Error!");
//                 goto_home_page();
//             }
//         }
//     }
// }
