function createMenu_li(name, href, c) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = href;
    a.classList.add(c);
    a.textContent = name;
    li.appendChild(a);
    return li
}

function createMenu_option(value, text) {
    var option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    return option
}

function createMenu_lan_form() {
    var form = document.createElement('form');
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    var select = document.createElement('select');
    select.name = "language";
    select.id = "language-category";
    select.appendChild(createMenu_option('english', 'English'));
    select.appendChild(createMenu_option('chinese', '中文(简体)'));
    select.appendChild(createMenu_option('japanese', '日本語'));

    div2.classList.add("col-12");
    div2.appendChild(select);

    div1.classList.add("row");
    div1.classList.add("gtr-uniform");
    div1.appendChild(div2);

    form.id = "menu_form";
    form.method = "post";
    form.action = "#";

    form.appendChild(div1);

    return form

}

function createMenu_btn(c1, c2, text) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    if (c1 === "download_btn_text") {
        a.classList.add("icon");
        a.classList.add("solid");
        a.classList.add("fa-download");
    } else {
        a.classList.add("primary");
    }
    a.classList.add("button");
    a.classList.add("small");
    a.classList.add("fit");
    a.id = c1;
    a.classList.add(c1);
    a.textContent = text;

    li.classList.add(c2);
    li.appendChild(a);
    return li
}

function createMenu_user_form() {
    var form = document.createElement('form');
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    var select = document.createElement('select');

    select.name = "user";
    select.id = "user-category";
    select.appendChild(createMenu_option('none', '-未注册-'));

    div2.classList.add("col-12");
    div2.appendChild(select);

    div1.classList.add("row");
    div1.classList.add("gtr-uniform");
    div1.appendChild(div2);

    form.id = "user_form";
    form.method = "post";
    form.action = "#";
    form.classList.add("nav_li_left_6");

    form.appendChild(div1);

    return form
}

function createMenu() {
    var nav = document.getElementById("menu");
    if (nav != null) {
        while (nav.firstChild) {
            nav.removeChild(nav.firstChild);
        }

        var ul = document.createElement("ul");
        ul.classList.add("links");
        ul.appendChild(createMenu_li("主页", "./index.html", "home_page_text"));
        ul.appendChild(createMenu_li("家具图鉴", "./development.html", "furniture_page_text"));
        ul.appendChild(createMenu_li("化石图鉴", "./fossil.html", "fossil_page_text"));
        ul.appendChild(createMenu_li("Elements", "./elements.html", "elements_page_text"));
        ul.appendChild(createMenu_li("Generic", "./generic.html", "generic_page_text"));
        nav.appendChild(ul);
        nav.appendChild(createMenu_lan_form());

        var ul2 = document.createElement("ul");
        ul2.classList.add("nav_ul");
        ul2.appendChild(createMenu_btn("import_btn_text", "nav_li_left_4", "导入"));
        ul2.appendChild(createMenu_btn("reset_btn_text", "nav_li_center_4", "重置"));
        ul2.appendChild(createMenu_btn("download_btn_text", "nav_li_right_4", "导出"));

        nav.appendChild(ul2);

        var div = document.createElement("div");
        div.style.width = "0";
        div.style.height = "0";
        div.style.display = "none";

        var input = document.createElement("input");
        input.type = "file";
        input.name = "input_f";
        input.id = "input_f";

        div.appendChild(input);
        nav.appendChild(div);

        var ul3 = document.createElement("ul");
        ul3.classList.add("nav_ul");

        ul3.appendChild(createMenu_user_form());

        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "./edit.html";
        a.classList.add("button");
        a.classList.add("fit");
        a.classList.add("edit_btn_text");

        li.appendChild(a);
        ul3.appendChild(li);

        nav.appendChild(ul3);
    }
}

createMenu();