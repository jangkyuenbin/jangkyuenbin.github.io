function get_icons_li(href, label, cs) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    var span = document.createElement("span");
    span.classList.add("label");
    span.textContent = label;
    a.appendChild(span);
    a.href = href;
    for (var i = 0; i < cs.length; i++) {
        a.classList.add(cs[i]);
    }
    li.appendChild(a);
    return li
}

function get_icons_ul() {
    var ul = document.createElement("ul");
    ul.classList.add("icons");
    ul.appendChild(get_icons_li("mailto:jangkyuenbin@163.com", "Email", "icon solid alt fa-envelope".split(" ")));
    ul.appendChild(get_icons_li("#", "Twitter", "icon brands alt fa-twitter".split(" ")));
    ul.appendChild(get_icons_li("#", "Facebook", "icon brands alt fa-facebook-f".split(" ")));
    ul.appendChild(get_icons_li("#", "Instagram", "icon brands alt fa-instagram".split(" ")));
    ul.appendChild(get_icons_li("https://github.com/jangkyuenbin", "GitHub", "icon brands alt fa-github".split(" ")));
    ul.appendChild(get_icons_li("#", "LinkedIn", "icon brands alt fa-linkedin-in".split(" ")));
    return ul;
}

function get_copyright_ul() {
    var ul = document.createElement("ul");
    var li1 = document.createElement("li");
    var li2 = document.createElement("li");
    ul.classList.add("copyright");
    li1.innerHTML = "&copy; Animal Crossing Book";
    li2.innerHTML = "Design: <a href=\"https://jangkyuenbin.github.io\">Jang</a>";
    ul.appendChild(li1);
    ul.appendChild(li2);
    return ul;
}

function createFooter() {
    var footer = document.getElementById("footer");
    if (footer != null) {
        while (footer.firstChild) {
            footer.removeChild(footer.firstChild);
        }
        var inner = document.createElement('div');
        inner.classList.add("inner");
        var icons_ul = get_icons_ul();
        var copyright_ul = get_copyright_ul();
        inner.appendChild(icons_ul);
        inner.appendChild(copyright_ul);
        footer.appendChild(inner);
    }
}

createFooter();