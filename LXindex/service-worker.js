"use strict";var precacheConfig=[["/index.html","02570ab66cb33a7e713e36fc74e34cb8"],["/static/media/iconfont.eot","7e008a771d5079e5051b632adcff1243"],["/static/media/iconfont.ttf","d828102abc66b0a0a7cd5eb3f9b4e2b4"],["/static/one/LXcss/main.4d8f0344.css","3914440ddfaf0cff27547175f3f37763"],["/static/one/LXjs/0.58e6b0cf.chunk.js","72c0cfaf40d80ebcb48116f89daef7d0"],["/static/one/LXjs/1.67c95a69.chunk.js","82068361d52f31ea9c1d692a8a4fab57"],["/static/one/LXjs/10.9828844f.chunk.js","28217786b7bf518b8888501a110dd425"],["/static/one/LXjs/11.fa1060c0.chunk.js","a71a152051707d3fde475d768aec1452"],["/static/one/LXjs/12.edd8fbcd.chunk.js","388e37ab05a78613fec830bfa32aebad"],["/static/one/LXjs/13.5e5c7dd0.chunk.js","9997d2ad818e0bb84bb8ee128fb0a9af"],["/static/one/LXjs/14.b4149dc4.chunk.js","61311bbda937dcfdb14e5360ee96bb99"],["/static/one/LXjs/2.bc8829f2.chunk.js","42dd6e1aabc18898e427bb2376577c5e"],["/static/one/LXjs/3.0a7560ce.chunk.js","fd1df63322f72c392a6b5553479ab480"],["/static/one/LXjs/4.c98e7ebb.chunk.js","aa861af912f7cd416911e6b9bce70cae"],["/static/one/LXjs/5.58b7c4c0.chunk.js","ef74c55e0ca9ef95c4605d15b9e644ab"],["/static/one/LXjs/6.e050d216.chunk.js","b0dcdd83d992790ff9cc5766a59ba9bc"],["/static/one/LXjs/7.316f0667.chunk.js","eef56a458dc424cc4dfc700943d1999d"],["/static/one/LXjs/8.1119b1d1.chunk.js","73f1b8d88340ab9dde5df94b4237a485"],["/static/one/LXjs/9.30f58577.chunk.js","8edb9788ad948f14633893dc289c087c"],["/static/one/LXjs/main.b4ecce74.js","95d83e383300e832009137e3e4a14520"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,n,a){var c=new URL(e);return a&&c.pathname.match(a)||(c.search+=(c.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),c.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return n.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],a=new URL(t,self.location),c=createCacheKey(a,hashParamName,n,/\.\w{8}\./);return[a.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(a){return setOfCachedUrls(a).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return a.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!n.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,n=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),a="index.html";(e=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,a),e=urlsToCacheKeys.has(n));var c="/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(n=new URL(c,self.location).toString(),e=urlsToCacheKeys.has(n)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});