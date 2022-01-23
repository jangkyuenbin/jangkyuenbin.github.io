function umbrella_page_onload(){function e(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0}all_page_onload(),name_flag=null,own_flag=null,load_umbrella_db()
var t=document.getElementById("multi_select_content"),n=document.getElementById("umbrella_category")
t.style.display="none",document.onclick=function(){"none"!==t.style.display&&(t.style.display="none",onSearch(null))},n.addEventListener("click",function(n){e(n),t.style.display=""},!1),t.addEventListener("click",function(t){e(t)},!1)}function change_own_flag(e){var t=getPageJson("umbrella")
if(null!=t)if(t.includes(e)){const n=t.indexOf(e)
n>-1&&t.splice(n,1)}else t.push(e)
else t=[e]
t=Array.from(new Set(t)),t.sort(function(e,t){return e-t}),savePageJson("umbrella",t),onSearch(null)}function get_img_div(e){var t=document.createElement("div"),n=document.createElement("img")
return n.style="border-radius: 10px",n.className="one",n.src=e,n.width="100%",t.className="border_tr",t.style="width: 100%;",t.appendChild(n),t}function get_node_div(e,t,n,l,a){var o=get_img_div(t),r=document.createElement("div")
r.classList.add("border_b"),r.style="width: 100%;text-align: center;",""===n?r.classList.add("not_translated_text"):r.textContent=n
var s=document.createElement("div")
s.classList.add("border_b"),s.style="width: 100%;text-align: center;",s.textContent=l
var c=document.createElement("div")
c.classList.add("border_b"),0===a?c.classList.add("not_owned_label_text"):c.classList.add("owned_label_text"),c.style="width: 100%;text-align: center;",c.onclick=function(){change_own_flag(e)}
var i=document.createElement("div")
i.className="row out_border",i.appendChild(o),i.appendChild(r),i.appendChild(s),i.appendChild(c)
var d=document.createElement("div")
return d.className="col-2 col-6-small pd",d.appendChild(i),d}function get_checkbox_div(e,t,n){var l=document.createElement("div"),a=document.createElement("input"),o=document.createElement("label")
return l.classList.add("col-12"),l.classList.add("col-12-small"),l.classList.add("multi_select_item"),a.setAttribute("type","checkbox"),a.setAttribute("id",e),a.setAttribute("name",t),a.checked=n,a.addEventListener("change",function(e){var t=document.getElementById("umbrella_category"),n=document.createElement("span")
n.classList.add("icon_more"),tmp_inner_text=t.innerText,current_page=1,e.currentTarget.checked?(checkbox_select_list.push(e.currentTarget.name),checkbox_select_list.sort()):checkbox_select_list=arrayRemove(checkbox_select_list,e.currentTarget.name)
var l=""
checkbox_select_list.length>1?(t.classList.remove("umbrella_category_all_text"),l=checkbox_select_list[0]+", ...",t.textContent=l):0===checkbox_select_list.length?(t.classList.add("umbrella_category_all_text"),t.textContent=tmp_inner_text):(t.classList.remove("umbrella_category_all_text"),t.textContent=checkbox_select_list[0]),t.appendChild(n)}),o.htmlFor=e,o.textContent=t,l.appendChild(a),l.appendChild(o),l}function getPrevDiv(){var e=document.createElement("span")
e.classList.add("button"),e.classList.add("small"),e.classList.add("prev_text"),1===current_page&&e.classList.add("disabled")
var t=document.createElement("li")
return t.onclick=function(){current_page>1&&(current_page-=1,onSearch(null))},t.appendChild(e),t}function getNextDiv(){var e=document.createElement("span")
e.classList.add("button"),e.classList.add("small"),e.classList.add("next_text"),current_page===max_page&&e.classList.add("disabled")
var t=document.createElement("li")
return t.onclick=function(){max_page>current_page&&(current_page+=1,onSearch(null))},t.appendChild(e),t}function getNavPageDiv(e){var t=document.createElement("a")
t.classList.add("page"),t.textContent=e,e===current_page&&t.classList.add("active")
var n=document.createElement("li")
return n.onclick=function(){max_page>=e&&e>=1&&(current_page=e,onSearch(null))},n.appendChild(t),n}function filter_umbrella_data(){if(null!=umbrella_data){var e=getPageJson("umbrella")
for(i=0;i<umbrella_data.length;i++)umbrella_data[i].show_flag=1,umbrella_data[i].own_flag=0
if(null!=e)for(i=0;i<umbrella_data.length;i++)e.includes(umbrella_data[i].id)&&(umbrella_data[i].own_flag=1)
if(null!=name_flag)for(i=0;i<umbrella_data.length;i++)1===umbrella_data[i].show_flag&&(umbrella_data[i].name.english.indexOf(name_flag)>-1||umbrella_data[i].name.chinese.indexOf(name_flag)>-1||umbrella_data[i].name.japanese.indexOf(name_flag)>-1?umbrella_data[i].show_flag=1:umbrella_data[i].show_flag=0)
if(null!=own_flag)for(i=0;i<umbrella_data.length;i++)1===umbrella_data[i].show_flag&&(own_flag?umbrella_data[i].show_flag=umbrella_data[i].own_flag:umbrella_data[i].show_flag=1^umbrella_data[i].own_flag)
if(0!==checkbox_select_list.length)for(i=0;i<umbrella_data.length;i++)1===umbrella_data[i].show_flag&&(checkbox_select_list.includes(umbrella_data[i].source.english)||checkbox_select_list.includes(umbrella_data[i].source.chinese)||checkbox_select_list.includes(umbrella_data[i].source.japanese)?umbrella_data[i].show_flag=1:umbrella_data[i].show_flag=0)}}function update_umbrella_page(){if(null!=umbrella_data){for(var e=getLanguage(),t=[],n=0,l=0,a=document.getElementById("items_div");a.firstChild;)a.removeChild(a.firstChild)
var o=(current_page-1)*max_item,r=current_page*max_item
for(umbrella_data.sort(function(t,n){var l=t.name[e],a=n.name[e]
return a>l?-1:l>a?1:0}),n=0;n<umbrella_data.length;n++){if(1===umbrella_data[n].show_flag){if(l>=o&&r>l){var s=get_node_div(id=umbrella_data[n].id,url="./images/umbrella_png/"+umbrella_data[n].pic_name,name=umbrella_data[n].name[e],source=umbrella_data[n].source[e],flag=umbrella_data[n].own_flag)
a.appendChild(s)}l++}t.push(umbrella_data[n].source[e])}t=Array.from(new Set(t)),t.sort()
var c=document.getElementById("multi_select_content")
if(null!=c){for(;c.firstChild;)c.removeChild(c.firstChild)
for(n=0;n<t.length;n++){var i=checkbox_select_list.includes(t[n]),d=get_checkbox_div("check_"+n,t[n],i)
c.appendChild(d)}}max_page=Math.ceil(l/max_item)
var u=document.getElementById("pagination")
if(null!=u){for(;u.firstChild;)u.removeChild(u.firstChild)
if(max_page>1){var g=getPrevDiv(),m=getNextDiv()
for(u.appendChild(g),n=0;max_page>n;n++){var _=getNavPageDiv(n+1)
u.appendChild(_)}u.appendChild(m)}}}}function onSearch(e){var t=document.getElementById("umbrella_name"),n=document.getElementById("umbrella_radio_01"),l=document.getElementById("umbrella_radio_02"),a=null
if(""!==t.value&&(a=t.value),name_flag=a,null!=e&&"LABEL"===e.tagName){var o=document.getElementById(e.htmlFor)
o.checked||(own_flag="1"===o.value?!0:"2"===o.value?!1:null,current_page=1,load_umbrella_db())}else own_flag=n.checked?!0:l.checked?!1:null,load_umbrella_db()}function onReset(){var e=document.getElementById("umbrella_name"),t=document.getElementById("umbrella_radio_00"),n=document.getElementById("umbrella_category")
e.value="",t.checked=!0,checkbox_select_list=[],current_page=1,n.classList.add("umbrella_category_all_text"),umbrella_page_onload()}function load_umbrella_db(){if(null!=umbrella_data)filter_umbrella_data(),update_umbrella_page(),init_language()
else{var e=new XMLHttpRequest
e.open("get","db/json/umbrella.json"),e.send(null),e.onload=function(){200===e.status?(umbrella_data=JSON.parse(e.responseText),filter_umbrella_data(),update_umbrella_page(),init_language()):(window.alert("load data Error!"),goto_home_page())}}}var checkbox_select_list=[],current_page=1,max_page=10,max_item=18,tmp_inner_text="",umbrella_data=null,name_flag=null,own_flag=null
