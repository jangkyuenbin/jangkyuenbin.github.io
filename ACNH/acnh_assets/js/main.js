function arrayRemove(e,t){return e.filter(function(e){return e!==t})}function goto_page(e){window.location.href=e}function goto_home_page(){window.location.href="./index.html"}function cleanElementChild(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function menu_onload(){var e=document.getElementById("language-category"),t=document.getElementById("user-category")
const n=getSelectedUserJson()
var l="0"
if(null!=n.global.language&&(l=n.global.language),null!=t&&null!=e){for(;t.firstChild;)t.removeChild(t.firstChild)
var a=getAllUserName()
if(e.options[parseInt(l)].selected=!0,null!=a)for(var o=0;o<a.length;o++){const s=document.createElement("option")
s.value=a[o],s.textContent=a[o],n.info.name===a[o]&&(s.selected=!0),t.appendChild(s)}else{const s=document.createElement("option")
s.value="none",s.textContent="-未注册-",t.appendChild(s)}}}function all_page_onload(){menu_onload()}function menu_form_change(){var e=document.getElementById("language-category"),t=e.selectedIndex,n=getGlobalJson()
null!=n?n.language=e.options[t].value:n={language:e.options[t].value},saveGlobalJson(n),location.reload()}function change_user(){var e=document.getElementById("user-category"),t=e.selectedIndex
console.log(e.options[t].value),cancelSelectionOtherUser()
const n=getUserJson(e.options[t].value)
n.is_selected=!0,saveUserJson(e.options[t].value,n),location.reload()}function init_language(){var e="db/json/language.json",t=new XMLHttpRequest,n="0"
const l=getSelectedUserJson()
null!=l.global.language&&(n=l.global.language),t.open("get",e),t.send(null),t.onload=function(){if(200==t.status){var e=JSON.parse(t.responseText),l=0
for(var a in e){var o,s=e[a],r=document.getElementsByClassName(a)
if(null!=r)for(l=0;l<r.length;++l)if("0"===n?o=s.english:"1"===n?o=s.chinese:"2"===n&&(o=s.japanese),"INPUT"===r[l].tagName)r[l].placeholder=o
else if("umbrella_category_all_text"===a){var c=document.createElement("span")
c.classList.add("icon_more"),r[l].textContent=o,r[l].appendChild(c)}else r[l].textContent=o
if(r=document.getElementsByClassName(a+"_left"),null!=r)for(l=0;l<r.length;++l)"0"===n?o=s.chinese:"1"===n?o=s.japanese:"2"===n&&(o=s.english),"INPUT"===r[l].tagName?(console.log(r[l]),console.log(r[l].tagName),r[l].placeholder=o):r[l].textContent=o
if(r=document.getElementsByClassName(a+"_right"),null!=r)for(l=0;l<r.length;++l)"0"===n?o=s.japanese:"1"===n?o=s.english:"2"===n&&(o=s.chinese),"INPUT"===r[l].tagName?(console.log(r[l]),console.log(r[l].tagName),r[l].placeholder=o):r[l].textContent=o}}else console.log("error")}}