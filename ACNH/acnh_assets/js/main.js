function arrayRemove(e,n){return e.filter(function(e){return e!==n})}function goto_page(e){window.location.href=e}function goto_home_page(){window.location.href="./index.html"}function menu_onload(){var e=document.getElementById("language-category"),n=document.getElementById("user-category")
const o=getSelectedUserJson()
var t="0"
if(null!=o.global.language&&(t=o.global.language),null!=n&&null!=e){for(;n.firstChild;)n.removeChild(n.firstChild)
var l=getAllUserName()
if(e.options[parseInt(t)].selected=!0,null!=l)for(var a=0;a<l.length;a++){const s=document.createElement("option")
s.value=l[a],s.textContent=l[a],o.info.name===l[a]&&(s.selected=!0),n.appendChild(s)}else{const s=document.createElement("option")
s.value="none",s.textContent="-未注册-",n.appendChild(s)}}}function all_page_onload(){menu_onload()}function menu_form_change(){var e=document.getElementById("language-category"),n=e.selectedIndex,o=getGlobalJson()
null!=o?o.language=e.options[n].value:o={language:e.options[n].value},saveGlobalJson(o),location.reload()}function change_user(){var e=document.getElementById("user-category"),n=e.selectedIndex
console.log(e.options[n].value),cancelSelectionOtherUser()
const o=getUserJson(e.options[n].value)
o.is_selected=!0,saveUserJson(e.options[n].value,o),location.reload()}function init_language(){var e="db/json/language.json",n=new XMLHttpRequest,o="0"
const t=getSelectedUserJson()
null!=t.global.language&&(o=t.global.language),n.open("get",e),n.send(null),n.onload=function(){if(200==n.status){var e=JSON.parse(n.responseText),t=0
for(var l in e){var a,s=e[l],r=document.getElementsByClassName(l)
if(null!=r)for(t=0;t<r.length;++t)if("0"===o?a=s.english:"1"===o?a=s.chinese:"2"===o&&(a=s.japanese),"INPUT"===r[t].tagName)r[t].placeholder=a
else if("umbrella_category_all_text"===l){var i=document.createElement("span")
i.classList.add("icon_more"),r[t].textContent=a,r[t].appendChild(i)}else r[t].textContent=a
if(r=document.getElementsByClassName(l+"_left"),null!=r)for(t=0;t<r.length;++t)"0"===o?a=s.chinese:"1"===o?a=s.japanese:"2"===o&&(a=s.english),"INPUT"===r[t].tagName?(console.log(r[t]),console.log(r[t].tagName),r[t].placeholder=a):r[t].textContent=a
if(r=document.getElementsByClassName(l+"_right"),null!=r)for(t=0;t<r.length;++t)"0"===o?a=s.japanese:"1"===o?a=s.english:"2"===o&&(a=s.chinese),"INPUT"===r[t].tagName?(console.log(r[t]),console.log(r[t].tagName),r[t].placeholder=a):r[t].textContent=a}}else console.log("error")}}