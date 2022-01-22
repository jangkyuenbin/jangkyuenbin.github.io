function setCookie(e,t){var n=new Date,l=7
n.setTime(n.getTime()+24*l*60*60*1e3),document.cookie=e+"="+escape(t)+";expires="+n.toGMTString()}function getCookie(e){var t,n=RegExp("(^| )"+e+"=([^;]*)(;|$)")
return(t=document.cookie.match(n))?unescape(t[2]):null}function delCookie(e){var t=new Date
t.setTime(t.getTime()-1)
var n=getCookie(e)
null!=n&&(document.cookie=e+"="+n+";expires="+t.toGMTString())}function cleanCookie(){var e=document.cookie.match(/[^ =;]+(?=\=)/g)
if(e)for(var t=e.length;t--;)document.cookie=e[t]+"=0;expires="+new Date(0).toUTCString()
location.reload()}function checkCookie(){var e=document.cookie.match(/[^ =;]+(?=\=)/g)
return!!e}function Cookie2Json(){var e=document.cookie.match(/[^ =;]+(?=\=)/g),t={}
if(console.log(e),e)for(var n=e.length;n--;){var l=getCookie(e[n])
null!=l&&(t[e[n]]=JSON.parse(l))}return"{}"==JSON.stringify(t)?null:t}function resetGlobalSettings(){saveGlobalJson({}),location.reload()}function downloadJson(){var e=Cookie2Json()
if(null!=e){var t=document.createElement("a")
t.download="data.json",t.style.display="none"
var n=new Blob([JSON.stringify(e)])
t.href=URL.createObjectURL(n),document.body.appendChild(t),t.click(),document.body.removeChild(t)}else alert("未有数据！")}function downloadCurrentUserJson(){const e=getSelectedUserJson()
var t=document.createElement("a")
t.download=e.info.name+".json",t.style.display="none"
var n=new Blob([JSON.stringify(e)])
t.href=URL.createObjectURL(n),document.body.appendChild(t),t.click(),document.body.removeChild(t)}function downloadCurrentUserJson2(){const e=getSelectedUserJson()
var t=document.createElement("a")
t.setAttribute("href","data:text/plain;charset=utf-8,"+JSON.stringify(e)),t.setAttribute("download",e.info.name+".json"),t.style.display="none",document.body.appendChild(t),t.click(),document.body.removeChild(t)}function uploadUserJson(){var e=document.getElementById("input_f")
e.onchange=function(){if(!e.value)return console.log("没有选择文件"),null
var t=e.files[0]
if("application/json"!==t.type)return alert("不是有效的json文件!"),null
var n=new FileReader
n.onload=function(e){var t=e.target.result,n=JSON.parse(t)
if(null!=n.info.name){var l=getAllUserName()
if(l.includes(n.info.name)){var a=window.confirm("是否覆盖已有用户: "+n.info.name)
a===!0?(n.is_default=!1,createUser(n.info.name,n),location.reload()):console.log("取消覆盖!")}else n.is_default=!1,createUser(n.info.name,n),location.reload()}else alert("Json 文件格式有误,请仔细检测！")},n.readAsText(t)},e.click()}function uploadJson(){var e=document.getElementById("input_f")
e.onchange=function(){if(!e.value)return console.log("没有选择文件"),null
var t=e.files[0]
if("application/json"!==t.type)return alert("不是有效的json文件!"),null
var n=new FileReader
n.onload=function(e){var t=e.target.result
Json2Cookie(JSON.parse(t)),location.reload()},n.readAsText(t)},e.click()}function Json2Cookie(e){cleanCookie()
for(var t in e)"umbrella"===t&&(e[t]=Array.from(new Set(e[t]))),setCookie(t,JSON.stringify(e[t]))}function getLanguage(){var e=getGlobalJson()
if(null!=e){if(null!=e.language){if("0"===e.language)return"english"
if("1"===e.language)return"chinese"
if("2"===e.language)return"japanese"}return"english"}return null}function getPageJson(e){const t=getSelectedUserJson()
return t.page[e]}function savePageJson(e,t){const n=getSelectedUserJson()
n.page[e]=t,saveUserJson(n.info.name,n)}function getGlobalJson(){const e=getSelectedUserJson()
return e.global}function saveGlobalJson(e){const t=getSelectedUserJson()
console.log(t),t.global=e,saveUserJson(t.info.name,t)}function getInfoJson(){const e=getSelectedUserJson()
return e.info}function saveInfoJson(e){const t=getSelectedUserJson()
t.info=e,saveUserJson(t.info.name,t)}function saveUserJson(e,t){var n=getUserJson(e)
null!=n?(delCookie(e),setCookie(e,JSON.stringify(t))):setCookie(e,JSON.stringify(t))}function createDefaultUser(){var e={info:{name:"anonymous"},global:{},page:{},is_default:!0,is_selected:!0}
return saveUserJson("anonymous",e),e}function createUser(e,t){"{}"===JSON.stringify(t)&&(t={info:{name:e},global:{},page:{},is_default:!1,is_selected:!0}),cancelSelectionOtherUser(),saveUserJson(e,t)}function deleteUser(e){var t=getAllUserName(),n=getUserJson(e)
if(null!=n){var l=window.confirm("是否删除用户: ["+e+"]")
l===!0?(delCookie(e),1===t.length?createDefaultUser():(cancelSelectionOtherUser(),setDefault2Selected()),goto_home_page()):console.log("取消删除用户!")}}function cancelSelectionOtherUser(){var e=getAllUserName()
if(console.log(e),e)for(var t=e.length;t--;){var n=getUserJson(e[t])
null!=n&&(n.is_selected=!1,saveUserJson(e[t],n))}}function cancelDefaultOtherUser(){var e=getAllUserName()
if(console.log(e),e)for(var t=e.length;t--;){var n=getUserJson(e[t])
null!=n&&(n.is_default=!1,saveUserJson(e[t],n))}}function setDefault2Selected(){var e=getAllUserName(),t=!1
if(e){for(var n=e.length;n--;){var l=getUserJson(e[n])
if(null!=l&&l.is_default){l.is_selected=!0,saveUserJson(e[n],l),t=!0
break}}t||(l=getUserJson(e[0]),l.is_default=!0,l.is_selected=!0,saveUserJson(e[0],l))}}function getDefaultUserJson(){var e,t=document.cookie.match(/[^ =;]+(?=\=)/g)
if(console.log(t),t){for(var n=t.length;n--;){var l=getCookie(t[n])
if(null!=l&&(e=JSON.parse(l),e.is_default))return e}return l=getCookie(t[0]),e=JSON.parse(l),e.is_default=!0,saveUserJson(t[0],e),e}return createDefaultUser()}function getSelectedUserJson(){var e,t=getAllUserName()
if(t){for(var n=t.length;n--;){var l=getCookie(t[n])
if(null!=l&&(e=JSON.parse(l),e.is_selected))return e}return l=getCookie(t[0]),e=JSON.parse(l),e.is_selected=!0,saveUserJson(t[0],e),e}return createDefaultUser()}function getUserJson(e){var t=getCookie(e)
return null!=t?JSON.parse(t):null}function getAllUserName(){return document.cookie.match(/[^ =;]+(?=\=)/g)}