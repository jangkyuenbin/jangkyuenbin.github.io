function setCookie(e,n){var o=new Date,t=7
o.setTime(o.getTime()+24*t*60*60*1e3),document.cookie=e+"="+escape(n)+";expires="+o.toGMTString()}function getCookie(e){var n,o=RegExp("(^| )"+e+"=([^;]*)(;|$)")
return(n=document.cookie.match(o))?unescape(n[2]):null}function delCookie(e){var n=new Date
n.setTime(n.getTime()-1)
var o=getCookie(e)
null!=o&&(document.cookie=e+"="+o+";expires="+n.toGMTString())}function cleanCookie(){var e=document.cookie.match(/[^ =;]+(?=\=)/g)
if(e)for(var n=e.length;n--;)document.cookie=e[n]+"=0;expires="+new Date(0).toUTCString()
location.reload()}function checkCookie(){var e=document.cookie.match(/[^ =;]+(?=\=)/g)
return!!e}function Cookie2Json(){var e=document.cookie.match(/[^ =;]+(?=\=)/g),n={}
if(console.log(e),e)for(var o=e.length;o--;){var t=getCookie(e[o])
null!=t&&(n[e[o]]=JSON.parse(t))}return"{}"==JSON.stringify(n)?null:n}function resetGlobalSettings(){saveGlobalJson({}),location.reload()}function downloadJson(){var e=Cookie2Json()
if(null!=e){var n=document.createElement("a")
n.download="data.json",n.style.display="none"
var o=new Blob([JSON.stringify(e)])
n.href=URL.createObjectURL(o),document.body.appendChild(n),n.click(),document.body.removeChild(n)}else alert("未有数据！")}function downloadCurrentUserJson(){const e=getSelectedUserJson()
var n=document.createElement("a")
n.download=e.info.name+".json",n.style.display="none"
var o=new Blob([JSON.stringify(e)])
n.href=URL.createObjectURL(o),document.body.appendChild(n),n.click(),document.body.removeChild(n)}function downloadCurrentUserJson2(){const e=getSelectedUserJson()
var n=document.createElement("a")
n.setAttribute("href","data:text/plain;charset=utf-8,"+JSON.stringify(e)),n.setAttribute("download",e.info.name+".json"),n.style.display="none",document.body.appendChild(n),n.click(),document.body.removeChild(n)}function uploadUserJson(){var e=document.getElementById("input_f")
e.onchange=function(){if(!e.value)return console.log("没有选择文件"),null
var n=e.files[0]
if("application/json"!==n.type)return alert("不是有效的json文件!"),null
var o=new FileReader
o.onload=function(e){var n=e.target.result,o=JSON.parse(n)
if(null!=o.info.name){var t=getAllUserName()
if(t.includes(o.info.name)){var r=window.confirm("是否覆盖已有用户: "+o.info.name)
r===!0?(o.is_default=!1,createUser(o.info.name,o),location.reload()):console.log("取消覆盖!")}else o.is_default=!1,createUser(o.info.name,o),location.reload()}else alert("Json 文件格式有误,请仔细检测！")},o.readAsText(n)},e.click()}function uploadJson(){var e=document.getElementById("input_f")
e.onchange=function(){if(!e.value)return console.log("没有选择文件"),null
var n=e.files[0]
if("application/json"!==n.type)return alert("不是有效的json文件!"),null
var o=new FileReader
o.onload=function(e){var n=e.target.result
Json2Cookie(JSON.parse(n)),location.reload()},o.readAsText(n)},e.click()}function Json2Cookie(e){cleanCookie()
for(var n in e)"umbrella"===n&&(e[n]=Array.from(new Set(e[n]))),setCookie(n,JSON.stringify(e[n]))}function getLanguage(){var e=getGlobalJson()
if(null!=e){if(null!=e.language){if(console.log(e.language),"0"===e.language)return"english"
if("1"===e.language)return"chinese"
if("2"===e.language)return"japanese"}return"english"}return null}function getPageJson(e){const n=getSelectedUserJson()
return n.page[e]}function savePageJson(e,n){const o=getSelectedUserJson()
o.page[e]=n,saveUserJson(o.info.name,o)}function getGlobalJson(){const e=getSelectedUserJson()
return e.global}function saveGlobalJson(e){const n=getSelectedUserJson()
console.log(n),n.global=e,saveUserJson(n.info.name,n)}function getInfoJson(){const e=getSelectedUserJson()
return e.info}function saveInfoJson(e){const n=getSelectedUserJson()
n.info=e,saveUserJson(n.info.name,n)}function saveUserJson(e,n){var o=getUserJson(e)
null!=o?(delCookie(e),setCookie(e,JSON.stringify(n))):setCookie(e,JSON.stringify(n))}function createDefaultUser(){var e={info:{name:"anonymous"},global:{},page:{},is_default:!0,is_selected:!0}
return saveUserJson("anonymous",e),e}function createUser(e,n){"{}"===JSON.stringify(n)&&(n={info:{name:e},global:{},page:{},is_default:!1,is_selected:!0}),cancelSelectionOtherUser(),saveUserJson(e,n)}function deleteUser(e){var n=getAllUserName(),o=getUserJson(e)
if(null!=o){var t=window.confirm("是否删除用户: ["+e+"]")
t===!0?(delCookie(e),1===n.length?createDefaultUser():(cancelSelectionOtherUser(),setDefault2Selected()),goto_home_page()):console.log("取消删除用户!")}}function cancelSelectionOtherUser(){var e=getAllUserName()
if(console.log(e),e)for(var n=e.length;n--;){var o=getUserJson(e[n])
null!=o&&(o.is_selected=!1,saveUserJson(e[n],o))}}function cancelDefaultOtherUser(){var e=getAllUserName()
if(console.log(e),e)for(var n=e.length;n--;){var o=getUserJson(e[n])
null!=o&&(o.is_default=!1,saveUserJson(e[n],o))}}function setDefault2Selected(){var e=getAllUserName(),n=!1
if(e){for(var o=e.length;o--;){var t=getUserJson(e[o])
if(null!=t&&t.is_default){t.is_selected=!0,saveUserJson(e[o],t),n=!0
break}}n||(t=getUserJson(e[0]),t.is_default=!0,t.is_selected=!0,saveUserJson(e[0],t))}}function getDefaultUserJson(){var e,n=document.cookie.match(/[^ =;]+(?=\=)/g)
if(console.log(n),n){for(var o=n.length;o--;){var t=getCookie(n[o])
if(null!=t&&(e=JSON.parse(t),e.is_default))return e}return t=getCookie(n[0]),e=JSON.parse(t),e.is_default=!0,saveUserJson(n[0],e),e}return createDefaultUser()}function getSelectedUserJson(){var e,n=getAllUserName()
if(n){for(var o=n.length;o--;){var t=getCookie(n[o])
if(null!=t&&(e=JSON.parse(t),e.is_selected))return e}return t=getCookie(n[0]),e=JSON.parse(t),e.is_selected=!0,saveUserJson(n[0],e),e}return createDefaultUser()}function getUserJson(e){var n=getCookie(e)
return null!=n?JSON.parse(n):null}function getAllUserName(){return document.cookie.match(/[^ =;]+(?=\=)/g)}