function arrayRemove(e,t){return e.filter(function(e){return e!==t})}function goto_page(e){window.location.href=e}function goto_home_page(){window.location.href="./index.html"}function cleanElementChild(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function menu_onload(){var e=document.getElementById("language-category"),t=document.getElementById("user-category")
const n=getSelectedUserJson()
var l="0"
if(null!=n.global.language&&(l=n.global.language),null!=t&&null!=e){for(;t.firstChild;)t.removeChild(t.firstChild)
var a=getAllUserName()
if(e.options[parseInt(l)].selected=!0,null!=a)for(var o=0;o<a.length;o++){const r=document.createElement("option")
r.value=a[o],r.textContent=a[o],n.info.name===a[o]&&(r.selected=!0),t.appendChild(r)}else{const r=document.createElement("option")
r.value="none",r.textContent="-未注册-",t.appendChild(r)}}}function all_page_onload(){menu_onload()}function menu_form_change(){var e=document.getElementById("language-category"),t=e.selectedIndex,n=getGlobalJson()
null!=n?n.language=e.options[t].value:n={language:e.options[t].value},saveGlobalJson(n),location.reload()}function change_user(){var e=document.getElementById("user-category"),t=e.selectedIndex
console.log(e.options[t].value),cancelSelectionOtherUser()
const n=getUserJson(e.options[t].value)
n.is_selected=!0,saveUserJson(e.options[t].value,n),location.reload()}function init_language(){var e="db/json/language.json",t=new XMLHttpRequest,n="0"
const l=getSelectedUserJson()
null!=l.global.language&&(n=l.global.language),t.open("get",e),t.send(null),t.onload=function(){if(200==t.status){var e=JSON.parse(t.responseText),l=0
for(var a in e){var o,r=e[a],s=document.getElementsByClassName(a)
if(null!=s)for(l=0;l<s.length;++l)if("0"===n?o=r.english:"1"===n?o=r.chinese:"2"===n&&(o=r.japanese),"INPUT"===s[l].tagName)s[l].placeholder=o
else if("umbrella_category_all_text"===a){var c=document.createElement("span")
c.classList.add("icon_more"),s[l].textContent=o,s[l].appendChild(c)}else s[l].textContent=o
if(s=document.getElementsByClassName(a+"_left"),null!=s)for(l=0;l<s.length;++l)"0"===n?o=r.chinese:"1"===n?o=r.japanese:"2"===n&&(o=r.english),"INPUT"===s[l].tagName?(console.log(s[l]),console.log(s[l].tagName),s[l].placeholder=o):s[l].textContent=o
if(s=document.getElementsByClassName(a+"_right"),null!=s)for(l=0;l<s.length;++l)"0"===n?o=r.japanese:"1"===n?o=r.english:"2"===n&&(o=r.chinese),"INPUT"===s[l].tagName?(console.log(s[l]),console.log(s[l].tagName),s[l].placeholder=o):s[l].textContent=o}}else console.log("error")}}