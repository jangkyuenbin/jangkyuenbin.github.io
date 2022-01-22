function umbrella_page_onload(){function e(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0}all_page_onload(),load_umbrella_db(null,null)
var t=document.getElementById("multi_select_content"),n=document.getElementById("umbrella_category")
t.style.display="none",document.onclick=function(){"none"!==t.style.display&&(t.style.display="none",onSearch(null))},n.addEventListener("click",function(n){e(n),t.style.display=""},!1),t.addEventListener("click",function(t){e(t)},!1)}function change_own_flag(e){var t=getPageJson("umbrella")
if(null!=t)if(t.includes(e)){const n=t.indexOf(e)
n>-1&&t.splice(n,1)}else t.push(e)
else t=[e]
t=Array.from(new Set(t)),t.sort(function(e,t){return e-t}),savePageJson("umbrella",t),onSearch(null)}function get_img_div(e){var t=document.createElement("div"),n=document.createElement("img")
return n.style="border-radius: 10px",n.className="one",n.src=e,n.width="100%",t.className="border_tr",t.style="width: 100%;",t.appendChild(n),t}function get_node_div(e,t,n,l,a){var o=get_img_div(t),r=document.createElement("div")
r.classList.add("border_b"),r.style="width: 100%;text-align: center;",""===n?r.classList.add("not_translated_text"):r.textContent=n
var c=document.createElement("div")
c.classList.add("border_b"),c.style="width: 100%;text-align: center;",c.textContent=l
var s=document.createElement("div")
s.classList.add("border_b"),0===a?s.classList.add("not_owned_label_text"):s.classList.add("owned_label_text"),s.style="width: 100%;text-align: center;",s.onclick=function(){change_own_flag(e)}
var i=document.createElement("div")
i.className="row out_border",i.appendChild(o),i.appendChild(r),i.appendChild(c),i.appendChild(s)
var d=document.createElement("div")
return d.className="col-2 col-6-small pd",d.appendChild(i),d}function get_checkbox_div(e,t,n){var l=document.createElement("div"),a=document.createElement("input"),o=document.createElement("label")
return l.classList.add("col-12"),l.classList.add("col-12-small"),l.classList.add("multi_select_item"),a.setAttribute("type","checkbox"),a.setAttribute("id",e),a.setAttribute("name",t),a.checked=n,a.addEventListener("change",function(e){var t=document.getElementById("umbrella_category"),n=document.createElement("span")
n.classList.add("icon_more"),tmp_inner_text=t.innerText,e.currentTarget.checked?(checkbox_select_list.push(e.currentTarget.name),checkbox_select_list.sort()):checkbox_select_list=arrayRemove(checkbox_select_list,e.currentTarget.name)
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
return n.onclick=function(){max_page>=e&&e>=1&&(current_page=e,onSearch(null))},n.appendChild(t),n}function update_page(e){for(var t=getLanguage(),n=[],l=0,a=0,o=document.getElementById("items_div");o.firstChild;)o.removeChild(o.firstChild)
var r=(current_page-1)*max_item,c=current_page*max_item
for(l=0;l<e.length;l++){if(1===e[l].show_flag){if(l>=r&&c>l){var s=get_node_div(id=e[l].id,url="./images/umbrella_png/"+e[l].pic_name,name=e[l].name[t],source=e[l].source[t],flag=e[l].own_flag)
o.appendChild(s)}a++}n.push(e[l].source[t])}n=Array.from(new Set(n)),n.sort()
var i=document.getElementById("multi_select_content")
if(null!=i){for(;i.firstChild;)i.removeChild(i.firstChild)
for(l=0;l<n.length;l++){var d=checkbox_select_list.includes(n[l]),u=get_checkbox_div("check_"+l,n[l],d)
i.appendChild(u)}}max_page=Math.ceil(a/max_item)
var g=document.getElementById("pagination")
if(null!=g){for(;g.firstChild;)g.removeChild(g.firstChild)
if(max_page>1){var m=getPrevDiv(),_=getNextDiv()
for(g.appendChild(m),l=0;max_page>l;l++){var f=getNavPageDiv(l+1)
g.appendChild(f)}g.appendChild(_)}}}function onSearch(e){var t=document.getElementById("umbrella_name"),n=(document.getElementById("umbrella_radio_00"),document.getElementById("umbrella_radio_01")),l=document.getElementById("umbrella_radio_02"),a=null
if(""!==t.value&&(a=t.value),null!=e&&"LABEL"===e.tagName){var o=document.getElementById(e.htmlFor)
return o.checked||("1"===o.value?load_umbrella_db(name=a,own=!0):"2"===o.value?load_umbrella_db(name=a,own=!1):load_umbrella_db(name=a,own=null)),null}return n.checked?load_umbrella_db(name=a,own=!0):l.checked?load_umbrella_db(name=a,own=!1):load_umbrella_db(name=a,own=null),null}function onReset(){var e=document.getElementById("umbrella_name"),t=document.getElementById("umbrella_radio_00"),n=document.getElementById("umbrella_category")
e.value="",t.checked=!0,checkbox_select_list=[],current_page=1,n.classList.add("umbrella_category_all_text"),umbrella_page_onload()}function load_umbrella_db(e,t){var n=new XMLHttpRequest,l=0
n.open("get","db/json/umbrella.json"),n.send(null),n.onload=function(){if(200===n.status){var a=JSON.parse(n.responseText),o=getPageJson("umbrella")
for(l=0;l<a.length;l++)a[l].show_flag=1
if(null!=o)for(l=0;l<a.length;l++)o.includes(a[l].id)&&(a[l].own_flag=1)
if(null!=e)for(l=0;l<a.length;l++)1===a[l].show_flag&&(a[l].name.english.indexOf(e)>-1||a[l].name.chinese.indexOf(e)>-1||a[l].name.japanese.indexOf(e)>-1?a[l].show_flag=1:a[l].show_flag=0)
if(null!=t)for(l=0;l<a.length;l++)1===a[l].show_flag&&(t?a[l].show_flag=a[l].own_flag:a[l].show_flag=1^a[l].own_flag)
if(0!==checkbox_select_list.length)for(l=0;l<a.length;l++)1===a[l].show_flag&&(checkbox_select_list.includes(a[l].source.english)||checkbox_select_list.includes(a[l].source.chinese)||checkbox_select_list.includes(a[l].source.japanese)?a[l].show_flag=1:a[l].show_flag=0)
update_page(a),init_language()}else window.alert("load data Error!"),goto_home_page()}}var checkbox_select_list=[],current_page=1,max_page=10,max_item=18,tmp_inner_text=""
