!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=291)}([,,,,,,,,,,,,,,,,,function(e,t,r){"use strict";r.d(t,"d",(function(){return c})),r.d(t,"b",(function(){return i})),r.d(t,"c",(function(){return s})),r.d(t,"e",(function(){return u})),r.d(t,"a",(function(){return l}));var n=r(96),o=r.n(n);function c(e){if(!e||!o()(e))return"dark";const t=(e=+("0x"+e.slice(1).replace(e.length<5&&/./g,"$&$&")))>>16,r=e>>8&255,n=255&e;return Math.sqrt(t*t*.299+r*r*.587+n*n*.114)>127.5?"light":"dark"}function a(e){return Math.round(255*e).toString(16).padStart(2,"0")}function i(){return function(e,t,r){let n,o,c;if(0===t)n=o=c=r;else{function i(e,t,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?e+6*(t-e)*r:r<.5?t:r<2/3?e+(t-e)*(2/3-r)*6:e}const a=r<.5?r*(1+t):r+t-r*t,s=2*r-a;n=i(s,a,e+1/3),o=i(s,a,e),c=i(s,a,e-1/3)}return`#${a(n)}${a(o)}${a(c)}`}(Math.random(),Math.random(),.1+.45*Math.random())}function s(){return"#ffffff"}function u(e){const t=e.toString();return t[t.length-1]}function l(){return{enabled:!0,name:"",value:"",comment:""}}},function(e,t){var r=Array.isArray;e.exports=r},function(e,t,r){"use strict";r.d(t,"a",(function(){return s})),r.d(t,"d",(function(){return u})),r.d(t,"b",(function(){return l})),r.d(t,"g",(function(){return f})),r.d(t,"e",(function(){return _})),r.d(t,"c",(function(){return p})),r.d(t,"h",(function(){return d})),r.d(t,"f",(function(){return b}));var n=r(17),o=r(29),c=r.n(o),a=r(30),i=r.n(a);function s(e){let t=!1;0===e.length&&(e.push({title:"Profile 1",hideComment:!0,headers:[Object(n.a)()],respHeaders:[],filters:[],urlReplacements:[],appendMode:!1,backgroundColor:Object(n.b)(),textColor:Object(n.c)(),shortTitle:"1"}),t=!0);for(let r=0;r<e.length;++r){const o=e[r];o.title||(o.title="Profile "+(r+1),t=!0),o.shortTitle||(o.shortTitle=Object(n.e)(r+1),t=!0),o.headers||(o.headers=[Object(n.a)()],t=!0),o.respHeaders||(o.respHeaders=[],t=!0),o.urlReplacements||(o.urlReplacements=[],t=!0),o.filters||(o.filters=[],t=!0);for(let e of o.filters)e.resourceType||(e.resourceType=[],t=!0),e.comment||(e.comment="",t=!0);o.backgroundColor||(o.backgroundColor=Object(n.b)(),t=!0),o.textColor&&(o.textColor=Object(n.c)(),t=!0)}return t}async function u(){if(localStorage.profiles){const e=JSON.parse(localStorage.profiles);s(e);let t=0;localStorage.selectedProfile&&(t=Number(localStorage.selectedProfile)),t>=0&&t<e.length||(t=e.length-1),await f({profiles:e,selectedProfile:t,lockedTabId:localStorage.lockedTabId,isPaused:localStorage.isPaused,activeTabId:localStorage.activeTabId,savedToCloud:localStorage.savedToCloud,currentTabUrl:localStorage.currentTabUrl}),delete localStorage.profiles,delete localStorage.selectedProfile,delete localStorage.lockedTabId,delete localStorage.isPaused,delete localStorage.activeTabId,delete localStorage.savedToCloud,delete localStorage.currentTabUrl}let e=await l();if(!e.profiles){const t=await p(),r=t?Object.keys(t):[];r.sort(),r.length>0&&(e={profiles:t[r[r.length-1]],selectedProfile:0,savedToCloud:!0},await f(e))}i()(e.profiles)&&(e.profiles=[]);let t=s(e.profiles);return(c()(e.selectedProfile)||e.selectedProfile<0||e.selectedProfile>=e.profiles.length)&&(e.selectedProfile=e.profiles.length-1,t=!0),t&&await f(e),e}async function l(e){return new Promise((t,r)=>{chrome.storage.local.get(e,e=>{chrome.runtime.lastError?r(chrome.runtime.lastError):t(e)})})}async function f(e){return new Promise((t,r)=>{chrome.storage.local.set(e,()=>{chrome.runtime.lastError?r(chrome.runtime.lastError):t()})})}async function _(e){return new Promise((t,r)=>{chrome.storage.local.remove(e,()=>{chrome.runtime.lastError?r(chrome.runtime.lastError):t()})})}async function p(e){return new Promise((t,r)=>{chrome.storage.sync.get(e,e=>{chrome.runtime.lastError?r(chrome.runtime.lastError):t(e)})})}async function d(e){return new Promise((t,r)=>{chrome.storage.sync.set(e,()=>{chrome.runtime.lastError?r(chrome.runtime.lastError):t()})})}async function b(e){return new Promise((t,r)=>{chrome.storage.sync.remove(e,()=>{chrome.runtime.lastError?r(chrome.runtime.lastError):t()})})}},,,function(e,t,r){var n=r(79),o="object"==typeof self&&self&&self.Object===Object&&self,c=n||o||Function("return this")();e.exports=c},,function(e,t,r){var n=r(108);e.exports=function(e){return n(e,5)}},,function(e,t){e.exports=function(e){return null!=e&&"object"==typeof e}},,,function(e,t){e.exports=function(e){return void 0===e}},function(e,t,r){var n=r(85),o=r(39),c=r(71),a=r(18),i=r(42),s=r(49),u=r(51),l=r(61),f=Object.prototype.hasOwnProperty;e.exports=function(e){if(null==e)return!0;if(i(e)&&(a(e)||"string"==typeof e||"function"==typeof e.splice||s(e)||l(e)||c(e)))return!e.length;var t=o(e);if("[object Map]"==t||"[object Set]"==t)return!e.size;if(u(e))return!n(e).length;for(var r in e)if(f.call(e,r))return!1;return!0}},,function(e,t,r){var n=r(125),o=r(130);e.exports=function(e,t){var r=o(e,t);return n(r)?r:void 0}},function(e,t){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},,,function(e,t,r){var n=r(41),o=r(126),c=r(127),a=n?n.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":a&&a in Object(e)?o(e):c(e)}},,,function(e,t,r){var n=r(159),o=r(59),c=r(160),a=r(110),i=r(161),s=r(36),u=r(80),l=u(n),f=u(o),_=u(c),p=u(a),d=u(i),b=s;(n&&"[object DataView]"!=b(new n(new ArrayBuffer(1)))||o&&"[object Map]"!=b(new o)||c&&"[object Promise]"!=b(c.resolve())||a&&"[object Set]"!=b(new a)||i&&"[object WeakMap]"!=b(new i))&&(b=function(e){var t=s(e),r="[object Object]"==t?e.constructor:void 0,n=r?u(r):"";if(n)switch(n){case l:return"[object DataView]";case f:return"[object Map]";case _:return"[object Promise]";case p:return"[object Set]";case d:return"[object WeakMap]"}return t}),e.exports=b},,function(e,t,r){var n=r(22).Symbol;e.exports=n},function(e,t,r){var n=r(78),o=r(72);e.exports=function(e){return null!=e&&o(e.length)&&!n(e)}},function(e,t,r){var n=r(83),o=r(85),c=r(42);e.exports=function(e){return c(e)?n(e):o(e)}},function(e,t,r){var n=r(115),o=r(116),c=r(117),a=r(118),i=r(119);function s(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}s.prototype.clear=n,s.prototype.delete=o,s.prototype.get=c,s.prototype.has=a,s.prototype.set=i,e.exports=s},function(e,t,r){var n=r(58);e.exports=function(e,t){for(var r=e.length;r--;)if(n(e[r][0],t))return r;return-1}},function(e,t,r){var n=r(32)(Object,"create");e.exports=n},function(e,t,r){var n=r(139);e.exports=function(e,t){var r=e.__data__;return n(t)?r["string"==typeof t?"string":"hash"]:r.map}},function(e,t,r){var n=r(81),o=r(82);e.exports=function(e,t,r,c){var a=!r;r||(r={});for(var i=-1,s=t.length;++i<s;){var u=t[i],l=c?c(r[u],e[u],u,r,e):void 0;void 0===l&&(l=e[u]),a?o(r,u,l):n(r,u,l)}return r}},function(e,t,r){(function(e){var n=r(22),o=r(147),c=t&&!t.nodeType&&t,a=c&&"object"==typeof e&&e&&!e.nodeType&&e,i=a&&a.exports===c?n.Buffer:void 0,s=(i?i.isBuffer:void 0)||o;e.exports=s}).call(this,r(60)(e))},function(e,t){e.exports=function(e){return function(t){return e(t)}}},function(e,t){var r=Object.prototype;e.exports=function(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||r)}},function(e,t,r){var n=r(74);e.exports=function(e,t){return n(e,t)}},,,,,,function(e,t){e.exports=function(e,t){return e===t||e!=e&&t!=t}},function(e,t,r){var n=r(32)(r(22),"Map");e.exports=n},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,r){var n=r(148),o=r(50),c=r(62),a=c&&c.isTypedArray,i=a?o(a):n;e.exports=i},function(e,t,r){(function(e){var n=r(79),o=t&&!t.nodeType&&t,c=o&&"object"==typeof e&&e&&!e.nodeType&&e,a=c&&c.exports===o&&n.process,i=function(){try{var e=c&&c.require&&c.require("util").types;return e||a&&a.binding&&a.binding("util")}catch(e){}}();e.exports=i}).call(this,r(60)(e))},function(e,t,r){var n=r(83),o=r(151),c=r(42);e.exports=function(e){return c(e)?n(e,!0):o(e)}},function(e,t,r){var n=r(156),o=r(87),c=Object.prototype.propertyIsEnumerable,a=Object.getOwnPropertySymbols,i=a?function(e){return null==e?[]:(e=Object(e),n(a(e),(function(t){return c.call(e,t)})))}:o;e.exports=i},function(e,t,r){var n=r(93);e.exports=function(e){var t=new e.constructor(e.byteLength);return new n(t).set(new n(e)),t}},,,,function(e,t,r){var n=r(44),o=r(120),c=r(121),a=r(122),i=r(123),s=r(124);function u(e){var t=this.__data__=new n(e);this.size=t.size}u.prototype.clear=o,u.prototype.delete=c,u.prototype.get=a,u.prototype.has=i,u.prototype.set=s,e.exports=u},function(e,t,r){var n=r(131),o=r(138),c=r(140),a=r(141),i=r(142);function s(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}s.prototype.clear=n,s.prototype.delete=o,s.prototype.get=c,s.prototype.has=a,s.prototype.set=i,e.exports=s},function(e,t,r){var n=r(146),o=r(26),c=Object.prototype,a=c.hasOwnProperty,i=c.propertyIsEnumerable,s=n(function(){return arguments}())?n:function(e){return o(e)&&a.call(e,"callee")&&!i.call(e,"callee")};e.exports=s},function(e,t){e.exports=function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=9007199254740991}},,function(e,t,r){var n=r(174),o=r(26);e.exports=function e(t,r,c,a,i){return t===r||(null==t||null==r||!o(t)&&!o(r)?t!=t&&r!=r:n(t,r,c,a,e,i))}},,,,function(e,t,r){var n=r(36),o=r(33);e.exports=function(e){if(!o(e))return!1;var t=n(e);return"[object Function]"==t||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t}},function(e,t,r){(function(t){var r="object"==typeof t&&t&&t.Object===Object&&t;e.exports=r}).call(this,r(100))},function(e,t){var r=Function.prototype.toString;e.exports=function(e){if(null!=e){try{return r.call(e)}catch(e){}try{return e+""}catch(e){}}return""}},function(e,t,r){var n=r(82),o=r(58),c=Object.prototype.hasOwnProperty;e.exports=function(e,t,r){var a=e[t];c.call(e,t)&&o(a,r)&&(void 0!==r||t in e)||n(e,t,r)}},function(e,t,r){var n=r(109);e.exports=function(e,t,r){"__proto__"==t&&n?n(e,t,{configurable:!0,enumerable:!0,value:r,writable:!0}):e[t]=r}},function(e,t,r){var n=r(145),o=r(71),c=r(18),a=r(49),i=r(84),s=r(61),u=Object.prototype.hasOwnProperty;e.exports=function(e,t){var r=c(e),l=!r&&o(e),f=!r&&!l&&a(e),_=!r&&!l&&!f&&s(e),p=r||l||f||_,d=p?n(e.length,String):[],b=d.length;for(var h in e)!t&&!u.call(e,h)||p&&("length"==h||f&&("offset"==h||"parent"==h)||_&&("buffer"==h||"byteLength"==h||"byteOffset"==h)||i(h,b))||d.push(h);return d}},function(e,t){var r=/^(?:0|[1-9]\d*)$/;e.exports=function(e,t){var n=typeof e;return!!(t=null==t?9007199254740991:t)&&("number"==n||"symbol"!=n&&r.test(e))&&e>-1&&e%1==0&&e<t}},function(e,t,r){var n=r(51),o=r(149),c=Object.prototype.hasOwnProperty;e.exports=function(e){if(!n(e))return o(e);var t=[];for(var r in Object(e))c.call(e,r)&&"constructor"!=r&&t.push(r);return t}},function(e,t){e.exports=function(e,t){return function(r){return e(t(r))}}},function(e,t){e.exports=function(){return[]}},function(e,t,r){var n=r(89),o=r(90),c=r(64),a=r(87),i=Object.getOwnPropertySymbols?function(e){for(var t=[];e;)n(t,c(e)),e=o(e);return t}:a;e.exports=i},function(e,t){e.exports=function(e,t){for(var r=-1,n=t.length,o=e.length;++r<n;)e[o+r]=t[r];return e}},function(e,t,r){var n=r(86)(Object.getPrototypeOf,Object);e.exports=n},function(e,t,r){var n=r(92),o=r(64),c=r(43);e.exports=function(e){return n(e,c,o)}},function(e,t,r){var n=r(89),o=r(18);e.exports=function(e,t,r){var c=t(e);return o(e)?c:n(c,r(e))}},function(e,t,r){var n=r(22).Uint8Array;e.exports=n},function(e,t,r){var n=r(101),o=r(177),c=r(102);e.exports=function(e,t,r,a,i,s){var u=1&r,l=e.length,f=t.length;if(l!=f&&!(u&&f>l))return!1;var _=s.get(e),p=s.get(t);if(_&&p)return _==t&&p==e;var d=-1,b=!0,h=2&r?new n:void 0;for(s.set(e,t),s.set(t,e);++d<l;){var v=e[d],y=t[d];if(a)var g=u?a(y,v,d,t,e,s):a(v,y,d,e,t,s);if(void 0!==g){if(g)continue;b=!1;break}if(h){if(!o(t,(function(e,t){if(!c(h,t)&&(v===e||i(v,e,r,a,s)))return h.push(t)}))){b=!1;break}}else if(v!==y&&!i(v,y,r,a,s)){b=!1;break}}return s.delete(e),s.delete(t),b}},,function(e,t,r){var n=r(36),o=r(18),c=r(26);e.exports=function(e){return"string"==typeof e||!o(e)&&c(e)&&"[object String]"==n(e)}},,,function(e,t,r){"use strict";async function n(e){return new Promise((t,r)=>chrome.contextMenus.create(e,t))}async function o(e,t){return new Promise((r,n)=>chrome.contextMenus.update(e,t,r))}async function c(){return new Promise((e,t)=>chrome.contextMenus.removeAll(e))}r.d(t,"b",(function(){return n})),r.d(t,"c",(function(){return o})),r.d(t,"a",(function(){return c}))},function(e,t){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(e){"object"==typeof window&&(r=window)}e.exports=r},function(e,t,r){var n=r(70),o=r(175),c=r(176);function a(e){var t=-1,r=null==e?0:e.length;for(this.__data__=new n;++t<r;)this.add(e[t])}a.prototype.add=a.prototype.push=o,a.prototype.has=c,e.exports=a},function(e,t){e.exports=function(e,t){return e.has(t)}},function(e,t){e.exports=function(e){var t=-1,r=Array(e.size);return e.forEach((function(e){r[++t]=e})),r}},,,,,function(e,t,r){var n=r(69),o=r(143),c=r(81),a=r(144),i=r(150),s=r(153),u=r(154),l=r(155),f=r(157),_=r(91),p=r(158),d=r(39),b=r(162),h=r(163),v=r(168),y=r(18),g=r(49),m=r(170),O=r(33),j=r(172),x=r(43),E=r(63),P={};P["[object Arguments]"]=P["[object Array]"]=P["[object ArrayBuffer]"]=P["[object DataView]"]=P["[object Boolean]"]=P["[object Date]"]=P["[object Float32Array]"]=P["[object Float64Array]"]=P["[object Int8Array]"]=P["[object Int16Array]"]=P["[object Int32Array]"]=P["[object Map]"]=P["[object Number]"]=P["[object Object]"]=P["[object RegExp]"]=P["[object Set]"]=P["[object String]"]=P["[object Symbol]"]=P["[object Uint8Array]"]=P["[object Uint8ClampedArray]"]=P["[object Uint16Array]"]=P["[object Uint32Array]"]=!0,P["[object Error]"]=P["[object Function]"]=P["[object WeakMap]"]=!1,e.exports=function e(t,r,w,M,A,D){var L,T=1&r,I=2&r,R=4&r;if(w&&(L=A?w(t,M,A,D):w(t)),void 0!==L)return L;if(!O(t))return t;var C=y(t);if(C){if(L=b(t),!T)return u(t,L)}else{var U=d(t),S="[object Function]"==U||"[object GeneratorFunction]"==U;if(g(t))return s(t,T);if("[object Object]"==U||"[object Arguments]"==U||S&&!A){if(L=I||S?{}:v(t),!T)return I?f(t,i(L,t)):l(t,a(L,t))}else{if(!P[U])return A?t:{};L=h(t,U,T)}}D||(D=new n);var k=D.get(t);if(k)return k;D.set(t,L),j(t)?t.forEach((function(n){L.add(e(n,r,w,n,t,D))})):m(t)&&t.forEach((function(n,o){L.set(o,e(n,r,w,o,t,D))}));var B=C?void 0:(R?I?p:_:I?E:x)(t);return o(B||t,(function(n,o){B&&(n=t[o=n]),c(L,o,e(n,r,w,o,t,D))})),L}},function(e,t,r){var n=r(32),o=function(){try{var e=n(Object,"defineProperty");return e({},"",{}),e}catch(e){}}();e.exports=o},function(e,t,r){var n=r(32)(r(22),"Set");e.exports=n},,,,,function(e,t){e.exports=function(){this.__data__=[],this.size=0}},function(e,t,r){var n=r(45),o=Array.prototype.splice;e.exports=function(e){var t=this.__data__,r=n(t,e);return!(r<0)&&(r==t.length-1?t.pop():o.call(t,r,1),--this.size,!0)}},function(e,t,r){var n=r(45);e.exports=function(e){var t=this.__data__,r=n(t,e);return r<0?void 0:t[r][1]}},function(e,t,r){var n=r(45);e.exports=function(e){return n(this.__data__,e)>-1}},function(e,t,r){var n=r(45);e.exports=function(e,t){var r=this.__data__,o=n(r,e);return o<0?(++this.size,r.push([e,t])):r[o][1]=t,this}},function(e,t,r){var n=r(44);e.exports=function(){this.__data__=new n,this.size=0}},function(e,t){e.exports=function(e){var t=this.__data__,r=t.delete(e);return this.size=t.size,r}},function(e,t){e.exports=function(e){return this.__data__.get(e)}},function(e,t){e.exports=function(e){return this.__data__.has(e)}},function(e,t,r){var n=r(44),o=r(59),c=r(70);e.exports=function(e,t){var r=this.__data__;if(r instanceof n){var a=r.__data__;if(!o||a.length<199)return a.push([e,t]),this.size=++r.size,this;r=this.__data__=new c(a)}return r.set(e,t),this.size=r.size,this}},function(e,t,r){var n=r(78),o=r(128),c=r(33),a=r(80),i=/^\[object .+?Constructor\]$/,s=Function.prototype,u=Object.prototype,l=s.toString,f=u.hasOwnProperty,_=RegExp("^"+l.call(f).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=function(e){return!(!c(e)||o(e))&&(n(e)?_:i).test(a(e))}},function(e,t,r){var n=r(41),o=Object.prototype,c=o.hasOwnProperty,a=o.toString,i=n?n.toStringTag:void 0;e.exports=function(e){var t=c.call(e,i),r=e[i];try{e[i]=void 0;var n=!0}catch(e){}var o=a.call(e);return n&&(t?e[i]=r:delete e[i]),o}},function(e,t){var r=Object.prototype.toString;e.exports=function(e){return r.call(e)}},function(e,t,r){var n,o=r(129),c=(n=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+n:"";e.exports=function(e){return!!c&&c in e}},function(e,t,r){var n=r(22)["__core-js_shared__"];e.exports=n},function(e,t){e.exports=function(e,t){return null==e?void 0:e[t]}},function(e,t,r){var n=r(132),o=r(44),c=r(59);e.exports=function(){this.size=0,this.__data__={hash:new n,map:new(c||o),string:new n}}},function(e,t,r){var n=r(133),o=r(134),c=r(135),a=r(136),i=r(137);function s(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}s.prototype.clear=n,s.prototype.delete=o,s.prototype.get=c,s.prototype.has=a,s.prototype.set=i,e.exports=s},function(e,t,r){var n=r(46);e.exports=function(){this.__data__=n?n(null):{},this.size=0}},function(e,t){e.exports=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}},function(e,t,r){var n=r(46),o=Object.prototype.hasOwnProperty;e.exports=function(e){var t=this.__data__;if(n){var r=t[e];return"__lodash_hash_undefined__"===r?void 0:r}return o.call(t,e)?t[e]:void 0}},function(e,t,r){var n=r(46),o=Object.prototype.hasOwnProperty;e.exports=function(e){var t=this.__data__;return n?void 0!==t[e]:o.call(t,e)}},function(e,t,r){var n=r(46);e.exports=function(e,t){var r=this.__data__;return this.size+=this.has(e)?0:1,r[e]=n&&void 0===t?"__lodash_hash_undefined__":t,this}},function(e,t,r){var n=r(47);e.exports=function(e){var t=n(this,e).delete(e);return this.size-=t?1:0,t}},function(e,t){e.exports=function(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}},function(e,t,r){var n=r(47);e.exports=function(e){return n(this,e).get(e)}},function(e,t,r){var n=r(47);e.exports=function(e){return n(this,e).has(e)}},function(e,t,r){var n=r(47);e.exports=function(e,t){var r=n(this,e),o=r.size;return r.set(e,t),this.size+=r.size==o?0:1,this}},function(e,t){e.exports=function(e,t){for(var r=-1,n=null==e?0:e.length;++r<n&&!1!==t(e[r],r,e););return e}},function(e,t,r){var n=r(48),o=r(43);e.exports=function(e,t){return e&&n(t,o(t),e)}},function(e,t){e.exports=function(e,t){for(var r=-1,n=Array(e);++r<e;)n[r]=t(r);return n}},function(e,t,r){var n=r(36),o=r(26);e.exports=function(e){return o(e)&&"[object Arguments]"==n(e)}},function(e,t){e.exports=function(){return!1}},function(e,t,r){var n=r(36),o=r(72),c=r(26),a={};a["[object Float32Array]"]=a["[object Float64Array]"]=a["[object Int8Array]"]=a["[object Int16Array]"]=a["[object Int32Array]"]=a["[object Uint8Array]"]=a["[object Uint8ClampedArray]"]=a["[object Uint16Array]"]=a["[object Uint32Array]"]=!0,a["[object Arguments]"]=a["[object Array]"]=a["[object ArrayBuffer]"]=a["[object Boolean]"]=a["[object DataView]"]=a["[object Date]"]=a["[object Error]"]=a["[object Function]"]=a["[object Map]"]=a["[object Number]"]=a["[object Object]"]=a["[object RegExp]"]=a["[object Set]"]=a["[object String]"]=a["[object WeakMap]"]=!1,e.exports=function(e){return c(e)&&o(e.length)&&!!a[n(e)]}},function(e,t,r){var n=r(86)(Object.keys,Object);e.exports=n},function(e,t,r){var n=r(48),o=r(63);e.exports=function(e,t){return e&&n(t,o(t),e)}},function(e,t,r){var n=r(33),o=r(51),c=r(152),a=Object.prototype.hasOwnProperty;e.exports=function(e){if(!n(e))return c(e);var t=o(e),r=[];for(var i in e)("constructor"!=i||!t&&a.call(e,i))&&r.push(i);return r}},function(e,t){e.exports=function(e){var t=[];if(null!=e)for(var r in Object(e))t.push(r);return t}},function(e,t,r){(function(e){var n=r(22),o=t&&!t.nodeType&&t,c=o&&"object"==typeof e&&e&&!e.nodeType&&e,a=c&&c.exports===o?n.Buffer:void 0,i=a?a.allocUnsafe:void 0;e.exports=function(e,t){if(t)return e.slice();var r=e.length,n=i?i(r):new e.constructor(r);return e.copy(n),n}}).call(this,r(60)(e))},function(e,t){e.exports=function(e,t){var r=-1,n=e.length;for(t||(t=Array(n));++r<n;)t[r]=e[r];return t}},function(e,t,r){var n=r(48),o=r(64);e.exports=function(e,t){return n(e,o(e),t)}},function(e,t){e.exports=function(e,t){for(var r=-1,n=null==e?0:e.length,o=0,c=[];++r<n;){var a=e[r];t(a,r,e)&&(c[o++]=a)}return c}},function(e,t,r){var n=r(48),o=r(88);e.exports=function(e,t){return n(e,o(e),t)}},function(e,t,r){var n=r(92),o=r(88),c=r(63);e.exports=function(e){return n(e,c,o)}},function(e,t,r){var n=r(32)(r(22),"DataView");e.exports=n},function(e,t,r){var n=r(32)(r(22),"Promise");e.exports=n},function(e,t,r){var n=r(32)(r(22),"WeakMap");e.exports=n},function(e,t){var r=Object.prototype.hasOwnProperty;e.exports=function(e){var t=e.length,n=new e.constructor(t);return t&&"string"==typeof e[0]&&r.call(e,"index")&&(n.index=e.index,n.input=e.input),n}},function(e,t,r){var n=r(65),o=r(164),c=r(165),a=r(166),i=r(167);e.exports=function(e,t,r){var s=e.constructor;switch(t){case"[object ArrayBuffer]":return n(e);case"[object Boolean]":case"[object Date]":return new s(+e);case"[object DataView]":return o(e,r);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return i(e,r);case"[object Map]":return new s;case"[object Number]":case"[object String]":return new s(e);case"[object RegExp]":return c(e);case"[object Set]":return new s;case"[object Symbol]":return a(e)}}},function(e,t,r){var n=r(65);e.exports=function(e,t){var r=t?n(e.buffer):e.buffer;return new e.constructor(r,e.byteOffset,e.byteLength)}},function(e,t){var r=/\w*$/;e.exports=function(e){var t=new e.constructor(e.source,r.exec(e));return t.lastIndex=e.lastIndex,t}},function(e,t,r){var n=r(41),o=n?n.prototype:void 0,c=o?o.valueOf:void 0;e.exports=function(e){return c?Object(c.call(e)):{}}},function(e,t,r){var n=r(65);e.exports=function(e,t){var r=t?n(e.buffer):e.buffer;return new e.constructor(r,e.byteOffset,e.length)}},function(e,t,r){var n=r(169),o=r(90),c=r(51);e.exports=function(e){return"function"!=typeof e.constructor||c(e)?{}:n(o(e))}},function(e,t,r){var n=r(33),o=Object.create,c=function(){function e(){}return function(t){if(!n(t))return{};if(o)return o(t);e.prototype=t;var r=new e;return e.prototype=void 0,r}}();e.exports=c},function(e,t,r){var n=r(171),o=r(50),c=r(62),a=c&&c.isMap,i=a?o(a):n;e.exports=i},function(e,t,r){var n=r(39),o=r(26);e.exports=function(e){return o(e)&&"[object Map]"==n(e)}},function(e,t,r){var n=r(173),o=r(50),c=r(62),a=c&&c.isSet,i=a?o(a):n;e.exports=i},function(e,t,r){var n=r(39),o=r(26);e.exports=function(e){return o(e)&&"[object Set]"==n(e)}},function(e,t,r){var n=r(69),o=r(94),c=r(178),a=r(180),i=r(39),s=r(18),u=r(49),l=r(61),f="[object Object]",_=Object.prototype.hasOwnProperty;e.exports=function(e,t,r,p,d,b){var h=s(e),v=s(t),y=h?"[object Array]":i(e),g=v?"[object Array]":i(t),m=(y="[object Arguments]"==y?f:y)==f,O=(g="[object Arguments]"==g?f:g)==f,j=y==g;if(j&&u(e)){if(!u(t))return!1;h=!0,m=!1}if(j&&!m)return b||(b=new n),h||l(e)?o(e,t,r,p,d,b):c(e,t,y,r,p,d,b);if(!(1&r)){var x=m&&_.call(e,"__wrapped__"),E=O&&_.call(t,"__wrapped__");if(x||E){var P=x?e.value():e,w=E?t.value():t;return b||(b=new n),d(P,w,r,p,b)}}return!!j&&(b||(b=new n),a(e,t,r,p,d,b))}},function(e,t){e.exports=function(e){return this.__data__.set(e,"__lodash_hash_undefined__"),this}},function(e,t){e.exports=function(e){return this.__data__.has(e)}},function(e,t){e.exports=function(e,t){for(var r=-1,n=null==e?0:e.length;++r<n;)if(t(e[r],r,e))return!0;return!1}},function(e,t,r){var n=r(41),o=r(93),c=r(58),a=r(94),i=r(179),s=r(103),u=n?n.prototype:void 0,l=u?u.valueOf:void 0;e.exports=function(e,t,r,n,u,f,_){switch(r){case"[object DataView]":if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case"[object ArrayBuffer]":return!(e.byteLength!=t.byteLength||!f(new o(e),new o(t)));case"[object Boolean]":case"[object Date]":case"[object Number]":return c(+e,+t);case"[object Error]":return e.name==t.name&&e.message==t.message;case"[object RegExp]":case"[object String]":return e==t+"";case"[object Map]":var p=i;case"[object Set]":var d=1&n;if(p||(p=s),e.size!=t.size&&!d)return!1;var b=_.get(e);if(b)return b==t;n|=2,_.set(e,t);var h=a(p(e),p(t),n,u,f,_);return _.delete(e),h;case"[object Symbol]":if(l)return l.call(e)==l.call(t)}return!1}},function(e,t){e.exports=function(e){var t=-1,r=Array(e.size);return e.forEach((function(e,n){r[++t]=[n,e]})),r}},function(e,t,r){var n=r(91),o=Object.prototype.hasOwnProperty;e.exports=function(e,t,r,c,a,i){var s=1&r,u=n(e),l=u.length;if(l!=n(t).length&&!s)return!1;for(var f=l;f--;){var _=u[f];if(!(s?_ in t:o.call(t,_)))return!1}var p=i.get(e),d=i.get(t);if(p&&d)return p==t&&d==e;var b=!0;i.set(e,t),i.set(t,e);for(var h=s;++f<l;){var v=e[_=u[f]],y=t[_];if(c)var g=s?c(y,v,_,t,e,i):c(v,y,_,e,t,i);if(!(void 0===g?v===y||a(v,y,r,c,i):g)){b=!1;break}h||(h="constructor"==_)}if(b&&!h){var m=e.constructor,O=t.constructor;m==O||!("constructor"in e)||!("constructor"in t)||"function"==typeof m&&m instanceof m&&"function"==typeof O&&O instanceof O||(b=!1)}return i.delete(e),i.delete(t),b}},,,,,function(e,t,r){"use strict";async function n(e){return new Promise((t,r)=>chrome.browserAction.setIcon(e,t))}async function o(e){return new Promise((t,r)=>chrome.browserAction.setBadgeText(e,t))}async function c(e){return new Promise((t,r)=>chrome.browserAction.setBadgeBackgroundColor(e,t))}async function a({icon:e,text:t,color:r}){await Promise.all([n({path:e}),o({text:t}),c({color:r})])}r.d(t,"a",(function(){return a}))},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var lodash_isEqual__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(52),lodash_isEqual__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(lodash_isEqual__WEBPACK_IMPORTED_MODULE_0__),lodash_isUndefined__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(29),lodash_isUndefined__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(lodash_isUndefined__WEBPACK_IMPORTED_MODULE_1__),lodash_cloneDeep__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(24),lodash_cloneDeep__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(lodash_cloneDeep__WEBPACK_IMPORTED_MODULE_2__),_storage__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(19),_context_menu__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(99),_browser_action__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(185);const MAX_PROFILES_IN_CLOUD=50,CHROME_VERSION=getChromeVersion();let chromeLocal={isPaused:!0},selectedActiveProfile,activeProfiles=[];function passFilters_(e,t,r){if(!r)return!0;let n=void 0,o=!1,c=!1,a=!1;for(let i of r)if(i.enabled)switch(i.type){case"urls":o=!0,void 0===n&&(n=!1);try{new RegExp(i.urlRegex).test(e)&&(n=!0)}catch{n=!1}break;case"excludeUrls":o=!0,void 0===n&&(n=!0);try{new RegExp(i.urlRegex).test(e)&&(n=!1)}catch{n=!0}break;case"types":a=!0,i.resourceType.indexOf(t)>=0&&(c=!0)}return(!o||n)&&(!a||c)}function filterEnabled_(e){let t=[];if(e)for(let r of e)r.enabled&&r.name&&t.push({name:r.name,value:r.value});return t}function loadActiveProfiles(){if(activeProfiles=[],selectedActiveProfile=void 0,chromeLocal.profiles){const e=chromeLocal.profiles;for(const[t,r]of e.entries()){if(t!==chromeLocal.selectedProfile&&!r.alwaysOn)continue;const e=lodash_cloneDeep__WEBPACK_IMPORTED_MODULE_2___default()(r);e.headers=filterEnabled_(e.headers),e.respHeaders=filterEnabled_(e.respHeaders),e.urlReplacements=filterEnabled_(e.urlReplacements),t===chromeLocal.selectedProfile&&(selectedActiveProfile=r),activeProfiles.push(e)}}}function evaluateValue(value,url,oldValue){if(value&&value.startsWith("function"))try{const arg=JSON.stringify({url:url,oldValue:oldValue});return(eval(`(${value})(${arg})`)||"").toString()}catch(e){}return value}function replaceUrls(e,t){if(e)for(const r of e){const e=evaluateValue(r.value,t,t);t.includes(e)||(t=t.replace(r.name,e))}return t}function modifyHeader(e,t,r,n){if(!r.length)return;const o={};for(let e=0;e<n.length;e++){o[n[e].name.toLowerCase()]=e}for(const c of r){const r=c.name.toLowerCase(),a=o[r],i=evaluateValue(c.value,e,void 0!==a?n[a].value:void 0);void 0!==a?t.appendMode&&"false"!==t.appendMode?"comma"===t.appendMode?(n[a].value&&(n[a].value+=","),n[a].value+=i):n[a].value+=i:n[a].value=i:(n.push({name:c.name,value:i}),o[r]=n.length-1)}}function modifyRequestHandler_(e){if(chromeLocal.isPaused)return{};let t=e.url;if(!chromeLocal.lockedTabId||chromeLocal.lockedTabId===e.tabId)for(const r of activeProfiles)passFilters_(t,e.type,r.filters)&&(t=replaceUrls(r.urlReplacements,t));return t!==e.url?{redirectUrl:t}:{}}function modifyRequestHeaderHandler_(e){if(chromeLocal.isPaused)return{};if(!chromeLocal.lockedTabId||chromeLocal.lockedTabId===e.tabId)for(const t of activeProfiles)passFilters_(e.url,e.type,t.filters)&&(modifyHeader(e.url,t,t.headers,e.requestHeaders),t.sendEmptyHeader||(e.requestHeaders=e.requestHeaders.filter(e=>!!e.value)));return{requestHeaders:e.requestHeaders}}function modifyResponseHeaderHandler_(e){if(chromeLocal.isPaused)return{};let t=lodash_cloneDeep__WEBPACK_IMPORTED_MODULE_2___default()(e.responseHeaders);if(!chromeLocal.lockedTabId||chromeLocal.lockedTabId===e.tabId)for(const r of activeProfiles)passFilters_(e.url,e.type,r.filters)&&(modifyHeader(e.url,r,r.respHeaders,t),r.sendEmptyHeader||(t=t.filter(e=>!!e.value)));return lodash_isEqual__WEBPACK_IMPORTED_MODULE_0___default()(t,e.responseHeaders)?void 0:{responseHeaders:t}}function getChromeVersion(){let e=navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/);return null==e||5!==e.length?{}:(e=e.map(e=>parseInt(e,10)),{major:e[1],minor:e[2],build:e[3],patch:e[4]})}function setupHeaderModListener(){chrome.webRequest.onBeforeRequest.removeListener(modifyRequestHandler_),chrome.webRequest.onBeforeSendHeaders.removeListener(modifyRequestHeaderHandler_),chrome.webRequest.onHeadersReceived.removeListener(modifyResponseHeaderHandler_);let e=!1,t=!1,r=!1;for(const n of activeProfiles)n.headers.length>0&&(e=!0),n.respHeaders.length>0&&(t=!0),n.urlReplacements.length>0&&(r=!0);if(e){let e=!1;CHROME_VERSION.major>=72&&(e=!0),chrome.webRequest.onBeforeSendHeaders.addListener(modifyRequestHeaderHandler_,{urls:["<all_urls>"]},e?["requestHeaders","blocking","extraHeaders"]:["requestHeaders","blocking"])}if(t){let e=!1;CHROME_VERSION.major>=72&&(e=!0),chrome.webRequest.onHeadersReceived.addListener(modifyResponseHeaderHandler_,{urls:["<all_urls>"]},e?["responseHeaders","blocking","extraHeaders"]:["responseHeaders","blocking"])}r&&chrome.webRequest.onBeforeRequest.addListener(modifyRequestHandler_,{urls:["<all_urls>"]},["blocking"])}async function onTabUpdated(e){await Object(_storage__WEBPACK_IMPORTED_MODULE_3__.g)({activeTabId:e.id}),await resetBadge(),await resetContextMenu()}async function saveStorageToCloud(){const e=await Object(_storage__WEBPACK_IMPORTED_MODULE_3__.c)(),t=e?Object.keys(e):[];if(t.sort(),0===t.length||e[t[t.length-1]]!==chromeLocal.profiles){const e={};e[Date.now()]=chromeLocal.profiles,await Promise.all([Object(_storage__WEBPACK_IMPORTED_MODULE_3__.h)(e),Object(_storage__WEBPACK_IMPORTED_MODULE_3__.g)({savedToCloud:!0})])}t.length>=MAX_PROFILES_IN_CLOUD&&await Object(_storage__WEBPACK_IMPORTED_MODULE_3__.f)(t.slice(0,t.length-MAX_PROFILES_IN_CLOUD))}async function resetContextMenu(){chromeLocal.isPaused?await Object(_context_menu__WEBPACK_IMPORTED_MODULE_4__.c)("pause",{title:"Unpause ModHeader",contexts:["browser_action"],onclick:async()=>{await Object(_storage__WEBPACK_IMPORTED_MODULE_3__.e)("isPaused")}}):await Object(_context_menu__WEBPACK_IMPORTED_MODULE_4__.c)("pause",{title:"Pause ModHeader",contexts:["browser_action"],onclick:async()=>{await Object(_storage__WEBPACK_IMPORTED_MODULE_3__.g)({isPaused:!0})}}),chromeLocal.lockedTabId?await Object(_context_menu__WEBPACK_IMPORTED_MODULE_4__.c)("lock",{title:"Unlock to all tabs",contexts:["browser_action"],onclick:async()=>{await Object(_storage__WEBPACK_IMPORTED_MODULE_3__.e)("lockedTabId")}}):await Object(_context_menu__WEBPACK_IMPORTED_MODULE_4__.c)("lock",{title:"Lock to this tab",contexts:["browser_action"],onclick:async()=>{await Object(_storage__WEBPACK_IMPORTED_MODULE_3__.g)({lockedTabId:chromeLocal.activeTabId})}})}async function resetBadge(){if(chromeLocal.isPaused)await Object(_browser_action__WEBPACK_IMPORTED_MODULE_5__.a)({icon:"images/icon_bw.png",text:"❚❚",color:"#666"});else{let e=0;for(const t of activeProfiles)e+=t.headers.length+t.respHeaders.length+t.urlReplacements.length;0===e?await Object(_browser_action__WEBPACK_IMPORTED_MODULE_5__.a)({icon:"images/icon_bw.png",text:"",color:"#ffffff"}):chromeLocal.lockedTabId&&chromeLocal.lockedTabId!==chromeLocal.activeTabId?await Object(_browser_action__WEBPACK_IMPORTED_MODULE_5__.a)({icon:"images/icon_bw.png",text:"🔒",color:"#ff8e8e"}):await Object(_browser_action__WEBPACK_IMPORTED_MODULE_5__.a)({icon:"images/icon.png",text:e.toString(),color:selectedActiveProfile.backgroundColor})}}async function initialize(){await Object(_context_menu__WEBPACK_IMPORTED_MODULE_4__.a)(),await Object(_context_menu__WEBPACK_IMPORTED_MODULE_4__.b)({id:"pause",title:"Pause",contexts:["browser_action"]}),await Object(_context_menu__WEBPACK_IMPORTED_MODULE_4__.b)({id:"lock",title:"Lock",contexts:["browser_action"]}),chromeLocal=await Object(_storage__WEBPACK_IMPORTED_MODULE_3__.d)(),loadActiveProfiles(),setupHeaderModListener(),await resetBadge(),await resetContextMenu(),chrome.storage.onChanged.addListener(async(e,t)=>{if("local"!==t)return;const r=!lodash_isUndefined__WEBPACK_IMPORTED_MODULE_1___default()(e.profiles)&&!lodash_isEqual__WEBPACK_IMPORTED_MODULE_0___default()(chromeLocal.profiles,e.profiles.newValue),n=!lodash_isUndefined__WEBPACK_IMPORTED_MODULE_1___default()(e.selectedProfile)&&!lodash_isEqual__WEBPACK_IMPORTED_MODULE_0___default()(chromeLocal.selectedProfile,e.selectedProfile.newValue);for(const[t,r]of Object.entries(e))chromeLocal[t]=r.newValue;(r||n)&&(loadActiveProfiles(),saveStorageToCloud(),setupHeaderModListener()),await resetBadge(),await resetContextMenu()})}chrome.tabs.onActivated.addListener(e=>{chrome.tabs.get(e.tabId,onTabUpdated)}),chrome.windows.onFocusChanged.addListener(e=>{e!==chrome.windows.WINDOW_ID_NONE&&chrome.windows.get(e,{populate:!0},async e=>{for(const t of e.tabs)if(t.active){await onTabUpdated(t);break}})}),initialize(),chrome.runtime.onMessageExternal.addListener((async function(e,t,r){if(t.origin.startsWith("https://bewisse.com")||t.origin.startsWith("https://modheader.com"))switch(e.type){case"EXISTS":r({success:!0});break;case"IMPORT":chromeLocal.profiles.push(JSON.parse(e.profile)),await Object(_storage__WEBPACK_IMPORTED_MODULE_3__.g)({profiles:chromeLocal.profiles}),r({success:!0});break;case"SWITCH_TO_LATEST":await Object(_storage__WEBPACK_IMPORTED_MODULE_3__.g)({selectedProfile:chromeLocal.profiles.length-1}),r({success:!0})}else r({error:"Unsupported origin"})})),window.saveToStorage=function(e){return Object(_storage__WEBPACK_IMPORTED_MODULE_3__.g)(e)}}]);