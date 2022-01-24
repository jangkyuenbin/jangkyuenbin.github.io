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
        if (usernames.includes(create_name.value)){
            create_name.placeholder = '用户名已存在: [' + create_name.value + ']';
            create_name.value = '';
        }else{
            createUser(create_name.value, {});
            location.reload();
        }
    }
}