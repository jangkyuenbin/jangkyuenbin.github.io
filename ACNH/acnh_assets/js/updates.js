updates_data = {
    "v0_2_0": {
        'name': 'Version:0.2.0(Alpha)',
        'subv': {
            '0.2.0.012422': ["li_01_text"],
            '0.2.1.012422': ["li_01_text"],
            '0.2.2.012422': ["li_01_text", "li_02_text"],
            '0.2.3.012422': ["li_01_text"],
        }
    },
    "v0_1_0": {
        'name': 'Version:0.1.0(Alpha)',
        'subv': {
            '0.1.0.012222': ["li_01_text"],
            '0.1.1.012322': ["li_01_text"],
            '0.1.2.012322': ["li_01_text"],
            '0.1.3.012322': ["li_01_text"],
        }
    },
    "v0_0_0": {
        'name': 'Version:0.0.0(Base)',
        'subv': {
            '0.0.0.012222': ["li_01_text"],
            '0.0.1.012222': ["li_01_text"],
            '0.0.2.012222': ["li_01_text"],
            '0.0.3.012222': ["li_01_text"],
            '0.0.4.012222': ["li_01_text"],
        }
    }
}

function get_session(version_id, version_object) {
    var session = document.createElement("section")
    session.id = version_id;
    var inner = document.createElement("div")
    inner.classList.add("inner");
    var h2 = document.createElement("h2")
    var version_name = version_object.name;
    h2.innerText = version_name;
    inner.appendChild(h2);
    var sub_list = version_object.subv;
    for (var svn in sub_list) {
        var h4 = document.createElement("h4")
        h4.style.paddingLeft = "20px";
        h4.innerText = svn;
        var ul = document.createElement("ul")
        ul.id = svn;
        ul.style.paddingLeft = "64px";
        for (var i = 0; i < sub_list[svn].length; i++) {
            var li = document.createElement("li");
            li.classList.add("v" + svn.replaceAll('.', '_') + "_" + sub_list[svn][i]);
            ul.appendChild(li);
        }
        h4.onclick = function () {
            var ul = document.getElementById(this.innerText);
            if (ul != null) {
                if (ul.style.display === "block" || ul.style.display === "") {
                    ul.style.display = "none";
                } else if (ul.style.display === "none") {
                    ul.style.display = "block"
                }
            }
        }
        ul.style.display = "none";
        inner.appendChild(h4);
        inner.appendChild(ul);
    }
    session.appendChild(inner);
    return session
}

function updates_page_onload() {
    all_page_onload();
    var parent = document.getElementById("main");
    for (var k in updates_data) {
        var s = get_session(k, updates_data[k]);
        parent.appendChild(s);
    }
    init_language();
}

