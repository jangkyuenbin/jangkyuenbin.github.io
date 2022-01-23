function celeste_page_onload(){all_page_onload(),name_flag=null,own_flag=null,load_celeste_db()}function onCelesteEnterPress(e){console.log(e),13===e.which&&(console.log(e),alert("You've entered: "))}function onCelesteReset(){var e=document.getElementById("celeste_name"),t=document.getElementById("celeste_radio_00")
e.value="",t.checked=!0,current_page=1,celeste_page_onload()}function onCelesteSearch(e){var t=document.getElementById("celeste_name"),n=document.getElementById("celeste_radio_01"),l=document.getElementById("celeste_radio_02"),a=null
if(""!==t.value&&(a=t.value),name_flag=a,null!=e&&"LABEL"===e.tagName){var o=document.getElementById(e.htmlFor)
o.checked||(own_flag="1"===o.value?!0:"2"===o.value?!1:null,current_page=1,load_celeste_db())}else own_flag=n.checked?!0:l.checked?!1:null,load_celeste_db()}function getPrevDiv(){var e=document.createElement("span")
e.classList.add("button"),e.classList.add("small"),e.classList.add("prev_text"),1===current_page&&e.classList.add("disabled")
var t=document.createElement("li")
return t.onclick=function(){current_page>1&&(current_page-=1,onCelesteSearch(null))},t.appendChild(e),t}function getNextDiv(){var e=document.createElement("span")
e.classList.add("button"),e.classList.add("small"),e.classList.add("next_text"),current_page===max_page&&e.classList.add("disabled")
var t=document.createElement("li")
return t.onclick=function(){max_page>current_page&&(current_page+=1,onCelesteSearch(null))},t.appendChild(e),t}function getNavPageDiv(e){var t=document.createElement("a")
t.classList.add("page"),t.textContent=e,e===current_page&&t.classList.add("active")
var n=document.createElement("li")
return n.onclick=function(){max_page>=e&&e>=1&&(current_page=e,onCelesteSearch(null))},n.appendChild(t),n}function update_pagination(){var e,t=0,n=document.getElementById("pagination")
if(null!=n&&(cleanElementChild(n),max_page>1)){var l=getPrevDiv(),a=getNextDiv()
if(n.appendChild(l),7>=max_page)for(t=0;max_page>t;t++)e=getNavPageDiv(t+1),n.appendChild(e)
else for(t=1;7>=t;t++)e=getNavPageDiv(max_page>=current_page+3?Math.max([current_page-4+t,1]):max_page-7+t),n.appendChild(e)
n.appendChild(a)}}function get_celeste_img_div(e){var t=document.createElement("div"),n=document.createElement("img")
return n.style="border-radius: 10px",n.className="one",n.src=e,n.width="100%",t.className="border_tr",t.style="width: 100%;",t.appendChild(n),t}function change_celeste_own_flag(e){var t=getPageJson("celeste")
if(null!=t)if(t.includes(e)){const n=t.indexOf(e)
n>-1&&t.splice(n,1)}else t.push(e)
else t=[e]
t=Array.from(new Set(t)),t.sort(function(e,t){return e-t}),savePageJson("celeste",t),onCelesteSearch(null)}function get_celeste_node_div(e,t,n,l){var a=get_celeste_img_div(t),o=document.createElement("div")
o.classList.add("border_b"),o.style="width: 100%;text-align: center;",""===n?o.classList.add("not_translated_text"):o.textContent=n
var s=document.createElement("div")
s.classList.add("border_b"),0===l?s.classList.add("not_owned_label_text"):s.classList.add("owned_label_text"),s.style="width: 100%;text-align: center;",s.onclick=function(){change_celeste_own_flag(e)}
var c=document.createElement("div")
c.className="row out_border",c.appendChild(a),c.appendChild(o),c.appendChild(s)
var r=document.createElement("div")
return r.className="col-2 col-6-small pd",r.appendChild(c),r}function filter_celeste_data(){if(null!=celeste_data){var e,t=getPageJson("celeste")
for(e=0;e<celeste_data.length;e++)celeste_data[e].show_flag=1,celeste_data[e].own_flag=0
if(null!=t)for(e=0;e<celeste_data.length;e++)t.includes(celeste_data[e].id)&&(celeste_data[e].own_flag=1)
if(null!=name_flag)for(console.log("name filter"),e=0;e<celeste_data.length;e++)1===celeste_data[e].show_flag&&(celeste_data[e].name.english.indexOf(name_flag)>-1||celeste_data[e].name.chinese.indexOf(name_flag)>-1||celeste_data[e].name.japanese.indexOf(name_flag)>-1?celeste_data[e].show_flag=1:celeste_data[e].show_flag=0)
if(null!=own_flag)for(console.log("own filter"),e=0;e<celeste_data.length;e++)1===celeste_data[e].show_flag&&(own_flag?celeste_data[e].show_flag=celeste_data[e].own_flag:celeste_data[e].show_flag=1^celeste_data[e].own_flag)}}function update_celeste_page(){if(null!=celeste_data){var e,t=getLanguage(),n=0,l=(current_page-1)*max_item,a=current_page*max_item,o=document.getElementById("items_div")
for(cleanElementChild(o),celeste_data.sort(function(e,n){var l=e.name[t],a=n.name[t]
return a>l?-1:l>a?1:0}),e=0;e<celeste_data.length;e++)if(1===celeste_data[e].show_flag){if(n>=l&&a>n){var s=get_celeste_node_div(id=celeste_data[e].id,url="./images/celeste_png/"+celeste_data[e].pic_name,name=celeste_data[e].name[t],flag=celeste_data[e].own_flag)
o.appendChild(s)}n++}max_page=Math.ceil(n/max_item),update_pagination()
var c=document.getElementById("celeste_name")
c.addEventListener("keydown",function(e){13===e.keyCode&&(e.preventDefault(),document.getElementById("celeste_search_btn").click())})}}function load_celeste_db(){if(null!=celeste_data)filter_celeste_data(),update_celeste_page(),init_language()
else{var e=new XMLHttpRequest
e.open("get","db/json/celeste.json"),e.send(null),e.onload=function(){200===e.status?(celeste_data=JSON.parse(e.responseText),filter_celeste_data(),update_celeste_page(),init_language()):(window.alert("load data Error!"),goto_home_page())}}}var current_page=1,max_page=10,max_item=18,celeste_data=null,name_flag=null,own_flag=null