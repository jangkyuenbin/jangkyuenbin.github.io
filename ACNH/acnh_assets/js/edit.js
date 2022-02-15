function onCreateUser() {
    var info_form = document.getElementById('info_form');
    var create_form = document.getElementById('create_form');
    info_form.style.display = "none";
    create_form.style.display = "";
}

function onCancelCreateUser() {
    var info_form = document.getElementById('info_form');
    var create_form = document.getElementById('create_form');
    info_form.style.display = "";
    create_form.style.display = "none";
}

function activate_intput() {
    var info_name = document.getElementById('info_name');
    var edit_btn = document.getElementById('edit_btn');
    info_name.readonly = "";
    info_name.disabled = false;
    edit_btn.style.display = "none";
}

function onChangeUserName() {
    const current_user_json = getSelectedUserJson();
    var info_name = document.getElementById('info_name');
    var old_name = current_user_json.info.name;
    var new_name = info_name.value;
    var usernames = getAllUserName();
    if (usernames.includes(new_name)) {
        alert("用户名已存在!无法修改");
        location.reload();
    } else {
        var r = window.confirm("是否修改用户名: [" + old_name + "] --> [" + new_name + "]");
        if (r === true) {
            current_user_json.info.name = new_name;
            deleteUser(old_name);
            createUser(new_name, current_user_json);
            location.reload();
        } else {
            console.log("取消覆盖!");
        }
    }
}

function edit_page_onload() {
    all_page_onload();
    var edit_hradio_north = document.getElementById('edit_hradio_north');
    var edit_hradio_south = document.getElementById('edit_hradio_south');
    if (getHemisphere() === 'north') {
        edit_hradio_north.checked = true;
    } else {
        edit_hradio_south.checked = true;
    }
    var edit_rtradio_true = document.getElementById('edit_rtradio_true');
    var edit_rtradio_false = document.getElementById('edit_rtradio_false');
    var div = document.getElementById("delta_time_div");
    if (getRealTimeFlag()) {
        edit_rtradio_true.checked = true;
        div.style.display = "none";
    } else {
        edit_rtradio_false.checked = true;
        div.style.display = "";
    }

    var time_offset = getTimeOffset();

    var real_now_time = new Date();
    var now_time = new Date(real_now_time.getTime() + time_offset * 60000);
    now_time.setMinutes(now_time.getMinutes() - now_time.getTimezoneOffset());
    var date_input = document.getElementById("date_input");
    var offset_input = document.getElementById("offset_input");
    date_input.value = now_time.toISOString().slice(0, 16);
    offset_input.value = time_offset;

    var info_name = document.getElementById('info_name');
    var edit_dbtn = document.getElementById('edit_dbtn');
    const current_user_json = getSelectedUserJson();
    info_name.value = current_user_json.info.name;
    info_name.disabled = true;
    if (current_user_json.is_default) {
        edit_dbtn.style.display = "none";
    }
    init_language();
}

function setDefaultUser() {
    const current_user_json = getSelectedUserJson();
    if (!current_user_json.is_default) {
        current_user_json.is_default = true;
        cancelDefaultOtherUser();
        saveUserJson(current_user_json.info.name, current_user_json)
        location.reload();
    }
}

function onResetUser() {
    const current_user_json = getSelectedUserJson();
    createUser(current_user_json.info.name, {});
}

function onDeleteUser() {
    const current_user_json = getSelectedUserJson();
    deleteUser(current_user_json.info.name);
}

function onSaveUser() {
    var create_name = document.getElementById('create_name');
    var usernames = getAllUserName();
    if (create_name.value != null && create_name.value !== '') {
        if (usernames.includes(create_name.value)) {
            create_name.placeholder = '用户名已存在: [' + create_name.value + ']';
            create_name.value = '';
        } else {
            createUser(create_name.value, {});
            location.reload();
        }
    }
}

function onChangeHemisphere(flag) {
    var global_json = getGlobalJson();
    var change_flag = false;
    if (global_json != null) {
        if (global_json['hemisphere'] != null) {
            if (flag && global_json['hemisphere'] !== 'north') {
                global_json['hemisphere'] = 'north';
                change_flag = true;
            } else if (!flag && global_json['hemisphere'] !== 'south') {
                global_json['hemisphere'] = 'south';
                change_flag = true;
            }
        } else {
            if (flag) {
                global_json['hemisphere'] = 'north';
                change_flag = true;
            } else {
                global_json['hemisphere'] = 'south';
                change_flag = true;
            }
        }
    } else {
        if (flag) {
            global_json = {'hemisphere': 'north'}
            change_flag = true;
        } else {
            global_json = {'hemisphere': 'south'}
            change_flag = true;
        }
    }
    if (change_flag) {
        saveGlobalJson(global_json);
        location.reload();
    }
}

function showDeltaTimeDiv() {
    var div = document.getElementById("delta_time_div");
    div.style.display = "";
    onChangeIsRealTimeFlag(false);
}

function hiddedDeltaTimeDiv() {
    var div = document.getElementById("delta_time_div");
    div.style.display = "none";
    onChangeIsRealTimeFlag(true);
}

function onChangeIsRealTimeFlag(flag) {
    var global_json = getGlobalJson();
    var change_flag = false;
    if (global_json != null) {
        if (global_json['is_real_time_flag'] != null) {
            if (flag && !global_json['is_real_time_flag']) {
                global_json['is_real_time_flag'] = true;
                change_flag = true;
            } else if (!flag && global_json['is_real_time_flag']) {
                global_json['is_real_time_flag'] = false;
                change_flag = true;
            }
        } else {
            global_json['is_real_time_flag'] = flag;
            change_flag = true;
        }
    } else {
        global_json = {'is_real_time_flag': flag}
        change_flag = true;
    }
    if (change_flag) {
        if (global_json['is_real_time_flag']) {
            delete global_json["time_offset"];
        }
        saveGlobalJson(global_json);
        if (!global_json['is_real_time_flag']) {
            var time_offset = getTimeOffset();
            var real_now_time = new Date();
            var now_time = new Date(real_now_time.getTime() + time_offset * 60000);
            now_time.setMinutes(now_time.getMinutes() - now_time.getTimezoneOffset());
            var date_input = document.getElementById("date_input");
            var offset_input = document.getElementById("offset_input");
            date_input.value = now_time.toISOString().slice(0, 16);
            offset_input.value = time_offset;
        }
    }
}

function onChangeDate(ele) {
    var new_time = new Date(ele.value)
    var now_time = new Date()
    var time_offset = getTimeOffset();
    var new_offset = parseInt((new_time - now_time) / 1000 / 60)
    var global_json = getGlobalJson();
    if (time_offset !== new_offset) {
        if (global_json != null) {
            global_json['time_offset'] = new_offset
        } else {
            global_json = {'time_offset': new_offset}
        }
        saveGlobalJson(global_json);
        var offset_input = document.getElementById("offset_input");
        offset_input.value = new_offset;
    }
}

function onChangeOffset(ele) {
    var new_time_offset = parseInt(ele.value)
    var global_json = getGlobalJson();
    if (global_json != null) {
        global_json['time_offset'] = new_time_offset
    } else {
        global_json = {'time_offset': new_time_offset}
    }
    saveGlobalJson(global_json);
    var real_now_time = new Date();
    var now_time = new Date(real_now_time.getTime() + new_time_offset * 60000);
    now_time.setMinutes(now_time.getMinutes() - now_time.getTimezoneOffset());
    var date_input = document.getElementById("date_input");
    date_input.value = now_time.toISOString().slice(0, 16);
}