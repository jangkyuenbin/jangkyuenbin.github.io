var search_space = [1, 0, 0, 0, 0, 0, 0, 0, 0]
var clothing_data = [null, null, null, null, null, null, null, null, null]
var clothing_data_name = ["tops", "bottoms", "dressup", "headwear", "accessories", "socks", "shoes", "bags", "umbrellas"]
var category_list = [];
var color_mapper = {
    "Red": {"bg": "#bc3f40", "font": "white"},
    "Berry Red": {"bg": "#c12e68", "font": "white"},
    "Red Necktie": {"bg": "#bc3f40", "font": "white"},
    "Red-Striped Necktie": {"bg": "#bc3f40", "font": "white"},
    "Red Towel": {"bg": "#ff3a3a", "font": "white"},
    "Ruby Red": {"bg": "#b81b7c", "font": "white"},
    "Rose Red": {"bg": "#9a264c", "font": "black"},
    "Dark Red": {"bg": "#93362f", "font": "white"},

    "Pink": {"bg": "#fe8fe6", "font": "white"},
    "Salmon Pink": {"bg": "#f7528b", "font": "white"},
    "Neon Pink": {"bg": "#ff4bff", "font": "black"},
    "Light Pink": {"bg": "#f2cbc1", "font": "black"},
    "Baby Pink": {"bg": "#ff93b1", "font": "black"},
    "Pink Towel": {"bg": "#fd8dfb", "font": "white"},
    "Pink Necktie": {"bg": "#fe8fe6", "font": "white"},

    "Orange": {"bg": "#fe6a2d", "font": "white"},
    "Baby Orange": {"bg": "#feaa7f", "font": "black"},
    "Neon Orange": {"bg": "#ffc42a", "font": "black"},
    "Pale Orange": {"bg": "#fea84a", "font": "black"},
    "Parrot Orange": {"bg": "#ffac4c", "font": "black"},
    "Orange Towel": {"bg": "#fda02a", "font": "white"},
    "Flame Orange": {"bg": "#ff432f", "font": "white"},

    "Yellow": {"bg": "#edb21a", "font": "white"},
    "Baby Yellow": {"bg": "#f7cf68", "font": "black"},
    "Golden Yellow": {"bg": "#fedb62", "font": "black"},
    "Lime Yellow": {"bg": "#bfd535", "font": "black"},

    "Green": {"bg": "#3c7456", "font": "white"},
    "Dark Green": {"bg": "#1e8373", "font": "white"},
    "Parrot Green": {"bg": "#97a81b", "font": "white"},
    "Yellow-Green": {"bg": "#95b417", "font": "white"},
    "Baby Green": {"bg": "#88e87e", "font": "black"},
    "Green Tea": {"bg": "#aac648", "font": "black"},
    "Light Green": {"bg": "#c4f293", "font": "black"},
    "Neon Green": {"bg": "#32f823", "font": "black"},
    "Green Necktie": {"bg": "#3c7456", "font": "white"},
    "Green-Striped Necktie": {"bg": "#3c7456", "font": "white"},
    "Green Towel": {"bg": "#53d849", "font": "white"},
    "Moss Green": {"bg": "#237073", "font": "white"},
    "Pale Green": {"bg": "#61a580", "font": "black"},

    "Blue": {"bg": "#3652ed", "font": "white"},
    "Baby Blue": {"bg": "#7aadfe", "font": "black"},
    "Light Blue": {"bg": "#18a9fe", "font": "black"},
    "Sky Blue": {"bg": "#54bafe", "font": "black"},
    "Indigo Blue": {"bg": "#65709d", "font": "white"},
    "Saxon Blue": {"bg": "#1c94ae", "font": "black"},
    "Navy Blue": {"bg": "#35438f", "font": "white"},
    "Pale Blue": {"bg": "#add4db", "font": "white"},
    "Neon Blue": {"bg": "#23feff", "font": "black"},
    "Blue Necktie": {"bg": "#3652ed", "font": "white"},
    "Blue-Striped Necktie": {"bg": "#3652ed", "font": "white"},
    "Blue Towel": {"bg": "#4b97fa", "font": "white"},
    "Dark Blue": {"bg": "#3e4971", "font": "white"},
    "Blue-Gray": {"bg": "#496794", "font": "white"},
    "Ice Blue": {"bg": "#69a8d5", "font": "black"},
    "Peacock Blue": {"bg": "#1a9aa4", "font": "black"},

    "Purple": {"bg": "#8978ef", "font": "white"},
    "Baby Purple": {"bg": "#ffa2fe", "font": "black"},
    "Light Purple": {"bg": "#ae91d3", "font": "black"},
    "Purple Necktie": {"bg": "#8978ef", "font": "white"},
    "Purple-Striped Necktie": {"bg": "#8978ef", "font": "white"},

    "Brown": {"bg": "#9e552c", "font": "white"},
    "Dark Brown": {"bg": "#71391f", "font": "white"},
    "Light Brown": {"bg": "#ad977e", "font": "white"},
    "White Towel": {"bg": "#ffffff", "font": "black"},
    "White Shirt": {"bg": "#ffffff", "font": "black"},
    "White": {"bg": "#ffffff", "font": "black"},
    "White-Striped Necktie": {"bg": "#ffffff", "font": "black"},
    "Off-White": {"bg": "#c8bb9e", "font": "black"},
    "Black": {"bg": "#3c3c3c", "font": "white"},
    "Black Towel": {"bg": "#3c3c3c", "font": "white"},
    "Black Shirt": {"bg": "#3c3c3c", "font": "white"},
    "Black Necktie": {"bg": "#3c3c3c", "font": "white"},
    "Gray": {"bg": "#9c9f99", "font": "white"},
    "Baby Gray": {"bg": "#bbb193", "font": "black"},
    "Light Gray": {"bg": "#bababa", "font": "black"},
    "Dark Gray": {"bg": "#3c3f54", "font": "white"},

    "Vanilla": {"bg": "#e6f5f9", "font": "black"},
    "Black Sesame": {"bg": "#6e7b97", "font": "white"},
    "Strawberry": {"bg": "#ffb0d6", "font": "black"},
    "Gold Leaf": {"bg": "#f3c253", "font": "white"},
    "Pale Sky": {"bg": "#9cf5ff", "font": "black"},
    "Purple Sweet Potato": {"bg": "#c5a6fc", "font": "black"},
    "Chocolate": {"bg": "#c57965", "font": "white"},
    "Garnet": {"bg": "#d8281c", "font": "white"},
    "Topaz": {"bg": "#fab41b", "font": "white"},
    "Amethyst": {"bg": "#891cff", "font": "white"},
    "Vermilion": {"bg": "#e7341f", "font": "white"},
    "Plum": {"bg": "#8b457b", "font": "white"},
    "Wisteria": {"bg": "#eecfcf", "font": "black"},
    "Muslin": {"bg": "#e4d39b", "font": "black"},
    "Magenta": {"bg": "#ff609e", "font": "white"},
    "Natural": {"bg": "#ffc45c", "font": "white"},
    "Ash": {"bg": "#6e6c5a", "font": "white"},
    "Greige": {"bg": "#7f735c", "font": "white"},
    "Emerald": {"bg": "#29bad6", "font": "white"},
    "Cyan": {"bg": "#38a4b3", "font": "black"},
    "Aqua": {"bg": "#77c9d6", "font": "white"},
    "Camel": {"bg": "#d6986a", "font": "white"},
    "Beige": {"bg": "#ccac8c", "font": "black"},
    "Mustard": {"bg": "#cfa828", "font": "white"},
    "Chestnut": {"bg": "#9b7e58", "font": "white"},
    "Lime": {"bg": "#91d726", "font": "white"},
    "Avocado": {"bg": "#748249", "font": "white"},
    "Cream": {"bg": "#eeedbf", "font": "black"},
    "Mint": {"bg": "#70e4e1", "font": "black"},
    "Baby Mint": {"bg": "#38e3ed", "font": "black"},
    "Peach": {"bg": "#ff9eaa", "font": "white"},
    "Aquamarine": {"bg": "#77ffdd", "font": "black"},
    "Coral": {"bg": "#e8dcb2", "font": "black"},
    "Navy": {"bg": "#2d364b", "font": "white"},
    "Washed Out": {"bg": "#669eca", "font": "black"},
    "Olive": {"bg": "#576343", "font": "white"},
    "Turquoise": {"bg": "#25b3cf", "font": "black"},
    "Fuchsia": {"bg": "#974561", "font": "white"},
    "Ochre": {"bg": "#e88318", "font": "white"},
    "Ivory": {"bg": "#e3e4e0", "font": "black"},
    "Silver": {"bg": "#d3d7db", "font": "black"},
    "Gold": {"bg": "#e1b43f", "font": "white"},
    "Rose Gold": {"bg": "#dc929d", "font": "white"},
    "Tulip": {"bg": "#ff6690", "font": "white"},
    "Cherry Blossom": {"bg": "#ffa3fe", "font": "black"},
    "Chick": {"bg": "#ffee5e", "font": "black"},
    "Frog": {"bg": "#47cc8f", "font": "white"},
    "Midnight": {"bg": "#5d5969", "font": "white"},
    "Passion": {"bg": "#873546", "font": "white"},
    "Love": {"bg": "#fa3ca2", "font": "white"},
    "Sunset": {"bg": "#8d5a2b", "font": "white"},
    "Ocean": {"bg": "#4e5688", "font": "white"},
    "Twilight": {"bg": "#5c4175", "font": "white"},
    "Star": {"bg": "#56a79f", "font": "white"},
    "1": {"bg": "#d01e1e", "font": "white"},
    "2": {"bg": "#1c40cb", "font": "white"},
    "3": {"bg": "#45c13f", "font": "white"},
    "4": {"bg": "#ff3fb8", "font": "white"},
    "5": {"bg": "#f4bb3b", "font": "white"},
    "6": {"bg": "#ec5e2b", "font": "white"},
    "7": {"bg": "#a047fe", "font": "white"},
    "8": {"bg": "#494753", "font": "white"},

    "Sash": {"bg": "linear-gradient(0.35turn, #ff23aa, #202ad3)", "font": "black"},
    "Checkered": {"bg": "linear-gradient(0.35turn, #fdea1b, #fe741d)", "font": "black"},
    "Diamonds": {"bg": "linear-gradient(0.35turn, #17bd22, #2d37f5)", "font": "black"},
    "Ring": {"bg": "linear-gradient(0.35turn, #e3d41d, #42dfff)", "font": "black"},
    "Stars": {"bg": "linear-gradient(0.35turn, #ffa1e8, #2160ff)", "font": "black"},
    "Double Sash": {"bg": "linear-gradient(0.35turn, #f91f20, #19da7e)", "font": "black"},
    "Vertical Stripes": {"bg": "linear-gradient(0.35turn, #4b4b4b, #f3e51a)", "font": "black"},
    "Zigzag": {"bg": "linear-gradient(0.35turn, #ededed, #ff721d)", "font": "black"},
    "Polka Dots": {"bg": "linear-gradient(0.35turn, #ff93e8, #ffd4f8, #ff93e8)", "font": "black"},
    "Colorful Quilt Design": {
        "bg": "linear-gradient(0.35turn, #fd9649, #ff65fa, #66eaf6, #fda146, #fe74f7)",
        "font": "white"
    },
    "Cherries": {"bg": "linear-gradient(0.35turn, #78e6e1, #fe6e6c, #78e6e1)", "font": "black"},
    "Denim with Stripes": {
        "bg": "linear-gradient(0.35turn, #4c73b1, #4e6b9f, #4c73b1, #4e6b9f, #4c73b1, #4e6b9f)",
        "font": "white"
    },
    "Black Ribbons": {"bg": "linear-gradient(0.35turn, #e7e2c3, #383636, #e7e2c3)", "font": "black"},
    "Red Ribbons": {"bg": "linear-gradient(0.35turn, #e7e2c3, #fb2019, #e7e2c3)", "font": "black"},
    "Green Ribbons": {"bg": "linear-gradient(0.35turn, #e7e2c3, #269d6b, #e7e2c3)", "font": "black"},
    "Blue Ribbons": {"bg": "linear-gradient(0.35turn, #e7e2c3, #3857ff, #e7e2c3)", "font": "black"},
    "Cool": {"bg": "linear-gradient(0.35turn, #d253fc, #4bd7c0, #756a79, #ce49f7, #4cdec8)", "font": "white"},
    "Pop": {"bg": "linear-gradient(0.35turn, #ffc987, #ffc7ef, #40fbc6, #fe70f8, #ffa12a)", "font": "black"},
    "Pastel": {"bg": "linear-gradient(0.35turn, #b4faed, #fdc4c3, #fec3f1, #bafaed, #fdc2c2)", "font": "black"},
    "Rainbow": {"bg": "linear-gradient(0.35turn, #fd9649, #ff65fa, #66eaf6, #fda146, #fe74f7)", "font": "white"},
    "Tiger": {"bg": "linear-gradient(0.35turn, #cda01e, #3e3b32, #cda01e, #3e3b32, #cda01e, #3e3b32)", "font": "white"},
    "Monotone": {
        "bg": "linear-gradient(0.35turn, #767269, #d0cfc7, #767269, #d0cfc7, #767269, #d0cfc7)",
        "font": "white"
    },
    "Zebra": {"bg": "linear-gradient(0.35turn, #767269, #484642, #767269, #484642, #767269, #484642)", "font": "white"},
    "M": {"bg": "linear-gradient(0.35turn, #ffa236, #57aec5, #ffa236)", "font": "white"},
    "Flowers": {"bg": "linear-gradient(0.35turn, #d5ccaf, #378447, #dfab27, #d95879, #d5ccaf)", "font": "white"},
    "Animal": {"bg": "linear-gradient(0.35turn, #76b93a, #c4b920, #ebc1b5, #c4b920, #76b93a)", "font": "white"},
    "Teddy Bear": {"bg": "linear-gradient(0.35turn, #3769ba, #c66d30, #3769ba)", "font": "white"},
    "Accent Patch": {"bg": "linear-gradient(0.35turn, #c3974d, #5b607e, #c3974d)", "font": "white"},
    "Quilted Pattern": {"bg": "linear-gradient(0.35turn, #fe95fc, #7876fe, #86f5ff, #e8fc61)", "font": "white"},
    "Chicks": {"bg": "linear-gradient(0.35turn, #eb94ae, #f0d93e, #eb94ae)", "font": "white"},
    "Animals": {"bg": "linear-gradient(0.35turn, #f4f2e4, #9fc25d, #f4f2e4)", "font": "white"},
    "Fruits": {"bg": "linear-gradient(0.35turn, #f7f4ea, #febecf, #f7f4ea)", "font": "white"},
    "Denim": {"bg": "linear-gradient(0.35turn, #b0afc2, #3b5075, #b0afc2)", "font": "white"},
    "Forest Print": {"bg": "linear-gradient(0.35turn, #edeede, #538170, #edeede)", "font": "white"},
    "Family": {"bg": "linear-gradient(0.35turn, #cfe2e8, #54597d, #cfe2e8)", "font": "white"},
    "Fancy Plaid": {"bg": "linear-gradient(0.35turn, #afeef0, #89ecb2, #c7efb9, #fcd6da)", "font": "black"},
    "Energetic Plaid": {"bg": "linear-gradient(0.35turn, #afeef0, #fcd1bc, #edeb95, #ace9fe)", "font": "black"},
    "Dreamy Plaid": {"bg": "linear-gradient(0.35turn, #afeef0, #ecbbfe, #b7d0ff, #b0f2e1)", "font": "black"},
    "Sweet Plaid": {"bg": "linear-gradient(0.35turn, #afeef0, #dfc7bb, #85e9ff, #9ef1ca)", "font": "black"},
    "Red Roses on Black": {"bg": "linear-gradient(0.35turn, #3e3e40, #e294a2, #e2ded3, #3e3e40)", "font": "white"},
    "Orange Roses on Blue": {"bg": "linear-gradient(0.35turn, #6083b2, #dbdfad, #d7836a, #6083b2)", "font": "white"},
    "Blue Roses on White": {"bg": "linear-gradient(0.35turn, #e3e2e2, #c1cafe, #8dacfe, #e3e2e2)", "font": "black"},
    "Yellow Roses on White": {"bg": "linear-gradient(0.35turn, #e8e2e6, #c1e1c9, #cdc14e, #e8e2e6)", "font": "black"},
    "Dream": {"bg": "linear-gradient(0.35turn, #fe95fc, #7876fe, #86f5ff, #e8fc61)", "font": "black"},
    "Soul": {"bg": "linear-gradient(0.35turn, #c29b16, #fbcc1b, #b48e13)", "font": "black"},
    "Bond": {"bg": "linear-gradient(0.35turn, #b0c4d1, #cce0ed, #8fa9c3)", "font": "black"},
    "Noodles": {"bg": "linear-gradient(0.35turn, #ecece7, #eeede9, #ebebe5)", "font": "black"},
    "Colorful": {"bg": "linear-gradient(0.35turn, #fe95fc, #7876fe, #86f5ff, #e8fc61)", "font": "black"},
}

var name_flag = null;
var own_flag = null;
var selected_id = null;
var selected_type = null;

var current_page = 1;
var max_page = 10;
var max_item = 18;
var max_show = 4;

function clothing_page_onload() {
    name_flag = null;
    own_flag = null;
    selected_id = null;

    all_page_onload();
    load_clothing_db();
    multi_select_onload();
}

function onChangeSelectedClothing() {
    if (clothing_data[0] != null) {
        if (selected_id == null || selected_type == null) {
            selected_type = clothing_data_name[0]
            selected_id = clothing_data[0][0].id;
        }
        var selected_data_id = 0
        for (var i = 0; i < search_space.length; i++) {
            if (selected_type === clothing_data_name[i]) {
                selected_data_id = i;
                break;
            }
        }
        var selected_data = clothing_data[selected_data_id]
        if (selected_data != null) {
            var language = getLanguage();
            var clothing_selected_pic = document.getElementById("clothing_selected_pic");
            var clothing_selected_name = document.getElementById("clothing_selected_name");
            var clothing_selected_buy_td = document.getElementById("clothing_selected_buy_td");
            var clothing_selected_sell_td = document.getElementById("clothing_selected_sell_td");
            var clothing_selected_obtain_td = document.getElementById("clothing_selected_obtain_td");
            var clothing_selected_styles_td = document.getElementById("clothing_selected_styles_td");
            var clothing_selected_themes_td = document.getElementById("clothing_selected_themes_td");
            var clothing_selected_colors_td = document.getElementById("clothing_selected_colors_td");
            var clothing_selected_variations_td = document.getElementById("clothing_selected_variations_td");

            for (i = 0; i < selected_data.length; i++) {
                if (selected_data[i].id === selected_id) {
                    clothing_selected_pic.src = './images/clothing_png/' + selected_type + '/' + selected_data[i].pic_name;
                    clothing_selected_name.innerText = selected_data[i]['name'][language];
                    clothing_selected_sell_td.innerText = selected_data[i]['sell'];
                    var buy_list = selected_data[i]['buy'].split("\n ")
                    clothing_selected_buy_td.innerHTML = ""
                    for (var j = 0; j < buy_list.length; j++) {
                        var div = document.createElement("div");
                        div.classList.add("capsule_box");
                        div.innerText = buy_list[j];
                        clothing_selected_buy_td.appendChild(div)
                    }
                    var obtain_list = selected_data[i]['obtain'][language].split(" / ")
                    clothing_selected_obtain_td.innerHTML = ""
                    for (var j = 0; j < obtain_list.length; j++) {
                        var div = document.createElement("div");
                        div.classList.add("capsule_box");
                        div.innerText = obtain_list[j];
                        clothing_selected_obtain_td.appendChild(div)
                    }
                    var styles_list = selected_data[i]['styles'][language].split(" / ")
                    clothing_selected_styles_td.innerHTML = ""
                    for (var j = 0; j < styles_list.length; j++) {
                        var div = document.createElement("div");
                        div.classList.add("capsule_box");
                        div.innerText = styles_list[j];
                        clothing_selected_styles_td.appendChild(div)
                    }
                    var themes_list = selected_data[i]['themes'][language].split(" / ")
                    clothing_selected_themes_td.innerHTML = ""
                    for (var j = 0; j < themes_list.length; j++) {
                        var div = document.createElement("div");
                        div.classList.add("capsule_box");
                        div.innerText = themes_list[j];
                        clothing_selected_themes_td.appendChild(div)
                    }
                    var colors_list = selected_data[i]['colors'][language].split(" / ")
                    var colors_list_english = selected_data[i]['colors']['english'].split(" / ")
                    clothing_selected_colors_td.innerHTML = ""
                    for (var j = 0; j < colors_list.length; j++) {
                        var div = document.createElement("div");
                        div.classList.add("capsule_box");
                        if (colors_list_english[j].includes("&")) {
                            var mc_list = colors_list_english[j].split("&");
                            var background = "linear-gradient(0.35turn"
                            for (var k = 0; k < mc_list.length; k++) {
                                if (Object.keys(color_mapper).includes(mc_list[k])) {
                                    background += (", " + color_mapper[mc_list[k]].bg);
                                } else {
                                    console.log(mc_list[k])
                                }
                            }
                            background += ")"
                            div.style.background = background;
                            div.style.color = color_mapper[mc_list[0]].font;
                        } else {
                            if (Object.keys(color_mapper).includes(colors_list_english[j])) {
                                if (color_mapper[colors_list_english[j]].bg[0] === "#") {
                                    div.style.backgroundColor = color_mapper[colors_list_english[j]].bg;
                                } else {
                                    div.style.background = color_mapper[colors_list_english[j]].bg;
                                }
                                div.style.color = color_mapper[colors_list_english[j]].font;
                            } else {
                                console.log(colors_list_english[j])
                            }
                        }
                        if (colors_list[j] === "") {
                            div.classList.add("none_text");
                        } else {
                            if (colors_list[j].includes("&")) {
                                div.innerText = colors_list[j].replaceAll("&", " ");
                            } else {
                                div.innerText = colors_list[j];
                            }

                        }
                        clothing_selected_colors_td.appendChild(div)
                    }
                    clothing_selected_variations_td.innerHTML = ""
                    if (selected_data[i]['variations'].length === 0) {
                        var div = document.createElement("div");
                        div.classList.add("capsule_box");
                        div.classList.add("none_text");
                        clothing_selected_variations_td.appendChild(div)
                    }

                    for (var j = 0; j < selected_data[i]['variations'].length; j++) {
                        var img = document.createElement("img");
                        img.src = './images/clothing_png/' + selected_type + '/' + selected_data[i]['variations'][j];
                        img.style.height = "48px";
                        img.style.borderWidth = "2px";
                        img.style.borderStyle = "solid";
                        img.style.padding = "5px";
                        img.style.marginLeft = "10px";
                        img.style.borderRadius = "10px";
                        img.onclick = function () {
                            clothing_selected_pic.src = this.src;
                        }
                        clothing_selected_variations_td.appendChild(img)
                    }
                    init_language();
                    break;
                }
            }
        }
    }
}

function multi_select_onload() {
    var clothing_msc = document.getElementById("clothing_msc");
    var clothing_category = document.getElementById("clothing_category");
    clothing_msc.style.display = "none";

    document.onclick = function () {
        if (clothing_msc.style.display !== "none") {
            clothing_msc.style.display = "none";
            onClothingSearch(null);
        }
    }

    clothing_category.addEventListener('click', function (e) {
        if (clothing_msc.style.display === "none") {
            stopFunc(e);
            clothing_msc.style.display = "";
        }
    }, false)

    clothing_msc.addEventListener('click', function (e) {
        stopFunc(e);
    }, false)

    //阻止事件向上传递
    function stopFunc(e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }
}

function change_clothing_search_space(type) {
    for (var i = 0; i < clothing_data_name.length; i++) {
        if (clothing_data_name[i] === type) {
            if (sumArray(search_space) === 1 && search_space[i] === 1) {
                return null;
            }
            search_space[i] = search_space[i] ^ 1
            current_page = 1;
            onClothingSearch(null);
            break;
        }
    }
}

function change_clothing_search_space_dc(type) {
    for (var i = 0; i < clothing_data_name.length; i++) {
        if (clothing_data_name[i] === type) {
            search_space[i] = 1
        } else {
            search_space[i] = 0
        }
    }
    current_page = 1;
    onClothingSearch(null);
}

function change_clothing_own_flag(id, type) {
    var page_json = getPageJson(type + '_own')
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
    savePageJson(type + '_own', page_json)
    onClothingSearch(null);
}

function get_clothing_img_div(urls) {
    var div = document.createElement('div');
    var img = document.createElement('img');
    img.style = "border-radius: 10px";
    img.className = "one";
    img.src = urls[0];
    img.width = "100%";
    div.className = "border_tr";
    div.style = "width: 100%;";
    div.appendChild(img);
    return div
}

function get_clothing_node_div(id, type, urls, name, own_flag) {
    var img_div = get_clothing_img_div(urls);
    img_div.onclick = function () {
        selected_id = id;
        selected_type = type;
        onChangeSelectedClothing();
    }
    var name_div = document.createElement('div');
    name_div.classList.add('border_b');

    name_div.style = "width: 100%;text-align: center;";
    if (name === "") {
        name_div.classList.add('not_translated_text');
    } else {
        name_div.textContent = name;
    }

    var own_flag_div = document.createElement('div');
    own_flag_div.classList.add('border_b');
    if (own_flag === 0) {
        own_flag_div.classList.add('not_donated_label_text');
    } else {
        own_flag_div.classList.add('donated_label_text');
    }
    own_flag_div.style = "width: 100%;text-align: center;";
    own_flag_div.onclick = function () {
        change_clothing_own_flag(id, type);
    }

    var div2 = document.createElement('div');
    div2.classList.add('out_border');
    div2.classList.add("row");
    div2.appendChild(img_div);
    div2.appendChild(name_div);
    div2.appendChild(own_flag_div);

    var node_div = document.createElement('div');
    node_div.className = "col-2 col-6-small pd";
    node_div.appendChild(div2);
    return node_div
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
    checkBox.addEventListener('change', function (event) {
        var category = document.getElementById(category_name);
        var span = document.createElement('span');
        span.classList.add('icon_more');
        tmp_inner_text = category.innerText;
        current_page = 1;
        if (event.currentTarget.checked) {
            category_list.push(event.currentTarget.name);
            category_list.sort();
        } else {
            category_list = arrayRemove(category_list, event.currentTarget.name);
        }

        var text = '';
        if (category_list.length > max_show) {
            category.classList.remove("category_all_text")
            text = category_list.slice(0, max_show).join(", ") + ", ...";
            category.textContent = text;
        } else if (category_list.length > 1) {
            category.classList.remove("category_all_text")
            text = category_list.join(", ");
            category.textContent = text;
        } else if (category_list.length === 0) {
            category.classList.add("category_all_text")
            category.textContent = tmp_inner_text;
        } else {
            category.classList.remove("category_all_text")
            category.textContent = category_list[0];
        }
        category.appendChild(span);
    })

    label.htmlFor = checkBox_id;
    label.textContent = checkBox_label;

    checkBox_div.appendChild(checkBox);
    checkBox_div.appendChild(label);
    return checkBox_div;
}

function onClothingSearch(element) {
    var clothing_name = document.getElementById('clothing_name');
    var clothing_oradio_true = document.getElementById('clothing_oradio_true');
    var clothing_oradio_false = document.getElementById('clothing_oradio_false');
    var current_name = null;
    if (clothing_name.value !== '') {
        current_name = clothing_name.value;
    }
    name_flag = current_name;
    if (element != null && element.tagName === "LABEL") {
        var radio = document.getElementById(element.htmlFor);
        if (!radio.checked) {
            if (radio.value === '1') {
                own_flag = true
            } else if (radio.value === '2') {
                own_flag = false
            } else {
                own_flag = null
            }
            current_page = 1;
            load_clothing_db();
        }
    } else {
        if (clothing_oradio_true.checked) {
            own_flag = true
        } else if (clothing_oradio_false.checked) {
            own_flag = false
        } else {
            own_flag = null
        }
        load_clothing_db();
    }
}

function onClothingReset() {
    var clothing_name = document.getElementById('clothing_name');
    var clothing_oradio_all = document.getElementById('clothing_oradio_all');
    var clothing_category = document.getElementById('clothing_category');
    clothing_name.value = '';
    clothing_oradio_all.checked = true;
    category_list = [];
    current_page = 1;
    search_space = [1, 0, 0, 0, 0, 0, 0, 0, 0]
    clothing_category.classList.add("category_all_text");
    clothing_page_onload();
}

function filter_clothing_data() {
    var i;
    for (var di = 0; di < search_space.length; di++) {
        if (search_space[di] === 1 && clothing_data[di] != null) {
            var own_json = getPageJson(clothing_data_name[di] + '_own')
            for (i = 0; i < clothing_data[di].length; i++) {
                clothing_data[di][i].show_flag = 1;
                clothing_data[di][i].own_flag = 0;
            }
            if (own_json != null) {
                for (i = 0; i < clothing_data[di].length; i++) {
                    if (own_json.includes(clothing_data[di][i].id)) {
                        clothing_data[di][i].own_flag = 1
                    }
                }
            }
            // filter name data
            if (name_flag != null) {
                console.log('name filter')
                for (i = 0; i < clothing_data[di].length; i++) {
                    if (clothing_data[di][i].show_flag === 1) {
                        clothing_data[di][i].show_flag = 0
                        for (var p in clothing_data[di][i].name) {
                            if (clothing_data[di][i].name[p].indexOf(name_flag) > -1) {
                                clothing_data[di][i].show_flag = 1
                                break;
                            }
                        }
                    }
                }
            }
            // filter own data
            if (own_flag != null) {
                for (i = 0; i < clothing_data[di].length; i++) {
                    if (clothing_data[di][i].show_flag === 1) {
                        if (own_flag) {
                            clothing_data[di][i].show_flag = clothing_data[di][i].own_flag
                        } else {
                            clothing_data[di][i].show_flag = clothing_data[di][i].own_flag ^ 1
                        }
                    }

                }
            }

            // filter category data
            if (category_list.length !== 0) {
                for (i = 0; i < clothing_data[di].length; i++) {
                    if (clothing_data[di][i].show_flag === 1) {
                        clothing_data[di][i].show_flag = 0
                        for (var p in clothing_data[di][i].obtain) {
                            var olist = clothing_data[di][i].obtain[p].split(" / ")
                            for (var j = 0; j < olist.length; j++) {
                                if (category_list.includes(olist[j])) {
                                    clothing_data[di][i].show_flag = 1
                                    break;
                                }
                            }
                            if (clothing_data[di][i].show_flag === 1) {
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}

function update_clothing_page() {
    var language = getLanguage();
    var category_array = [];
    var items_div = document.getElementById('items_div');
    while (items_div.firstChild) {
        items_div.removeChild(items_div.firstChild);
    }
    var start_i = (current_page - 1) * max_item;
    var end_i = current_page * max_item;
    var merge_data = []
    for (var di = 0; di < search_space.length; di++) {
        if (search_space[di] === 1 && clothing_data[di] != null) {
            for (var i = 0; i < clothing_data[di].length; i++) {
                if (clothing_data[di][i].show_flag === 1) {
                    var tmp_d = clothing_data[di][i]
                    tmp_d['type'] = clothing_data_name[di];
                    merge_data.push(tmp_d)
                }
                var olist = clothing_data[di][i]['obtain'][language].split(" / ")
                for (var j = 0; j < olist.length; j++) {
                    category_array.push(olist[j])
                }
            }
        }
    }
    merge_data.sort(function (a, b) {
        var nameA = a['name'][language];
        var nameB = b['name'][language];
        var idA = a['id'];
        var idB = b['id'];
        if (idA < idB) {
            return -1;
        }
        if (idA > idB) {
            return 1;
        }
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    for (var i = 0; i < merge_data.length; i++) {
        if (i >= start_i && i < end_i) {
            var node_div = get_clothing_node_div(
                id = merge_data[i].id,
                type = merge_data[i].type,
                urls = ['./images/clothing_png/' + merge_data[i].type + '/' + merge_data[i].pic_name],
                name = merge_data[i]['name'][language],
                own_flag = merge_data[i].own_flag)
            items_div.appendChild(node_div);
        }
    }

    // update type category
    for (var i = 0; i < search_space.length; i++) {
        var img = document.getElementById(clothing_data_name[i] + "_img")
        if (search_space[i] === 1) {
            img.classList = []
            img.classList.add("category_selected")
        } else {
            img.classList = []
            img.classList.add("category_not_selected")
        }
    }

    // update category
    category_array = Array.from(new Set(category_array));
    category_array.sort();
    var clothing_msc = document.getElementById('clothing_msc');
    if (clothing_msc != null) {
        while (clothing_msc.firstChild) {
            clothing_msc.removeChild(clothing_msc.firstChild);
        }
        for (var i = 0; i < category_array.length; i++) {
            var is_check = category_list.includes(category_array[i]);
            var div = get_checkbox_div("check_" + i.toString(),
                category_array[i], is_check, "clothing_category")
            clothing_msc.appendChild(div)
        }
    }

    // update pagination
    max_page = Math.ceil(merge_data.length / max_item);
    update_pagination(onClothingSearch);
    // input
    var input = document.getElementById("clothing_name");
    input.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("clothing_search_btn").click();
        }
    });
}

function load_clothing_db() {
    var is_download = false;
    var last_index = 0;
    var download_list = []
    for (var i = 0; i < search_space.length; i++) {
        if (search_space[i] === 1 && clothing_data[i] == null) {
            is_download = true;
            last_index = i;
            download_list.push(i);
        }
    }
    if (is_download) {
        var ind = download_list[0]
        var request = new XMLHttpRequest();
        request.open("get", 'db/json/' + clothing_data_name[ind] + '.json');
        request.send(null);
        request.onload = function () {
            if (request.status === 200) {
                clothing_data[ind] = JSON.parse(request.responseText);
                load_clothing_db();
            } else {
                window.alert("load data Error!");
                goto_home_page();
            }
        }
    } else {
        filter_clothing_data();
        update_clothing_page();
        onChangeSelectedClothing();
        init_language();
    }
}