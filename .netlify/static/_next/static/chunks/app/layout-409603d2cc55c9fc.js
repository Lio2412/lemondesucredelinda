(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3185],{76533:function(e,t,n){Promise.resolve().then(n.bind(n,446)),Promise.resolve().then(n.bind(n,48919)),Promise.resolve().then(n.bind(n,14315)),Promise.resolve().then(n.bind(n,72118)),Promise.resolve().then(n.t.bind(n,63505,23)),Promise.resolve().then(n.bind(n,27776)),Promise.resolve().then(n.t.bind(n,34332,23))},14315:function(e,t,n){"use strict";n.d(t,{default:function(){return a}});var c=n(57437),o=n(30998);function a(e){let{children:t}=e;return(0,c.jsx)(o.SessionProvider,{children:t})}n(2265)},72118:function(e,t,n){"use strict";n.d(t,{ThemeProvider:function(){return y}});var c=n(57437),o=n(2265),a=["light","dark"],r="(prefers-color-scheme: dark)",l="undefined"==typeof window,s=o.createContext(void 0),i=e=>o.useContext(s)?e.children:o.createElement(d,{...e}),m=["light","dark"],d=e=>{let{forcedTheme:t,disableTransitionOnChange:n=!1,enableSystem:c=!0,enableColorScheme:l=!0,storageKey:i="theme",themes:d=m,defaultTheme:y=c?"system":"light",attribute:b="data-theme",value:g,children:S,nonce:_}=e,[p,w]=o.useState(()=>h(i,y)),[k,C]=o.useState(()=>h(i)),E=g?Object.values(g):d,T=o.useCallback(e=>{let t=e;if(!t)return;"system"===e&&c&&(t=v());let o=g?g[t]:t,r=n?f():null,s=document.documentElement;if("class"===b?(s.classList.remove(...E),o&&s.classList.add(o)):o?s.setAttribute(b,o):s.removeAttribute(b),l){let e=a.includes(y)?y:null,n=a.includes(t)?t:e;s.style.colorScheme=n}null==r||r()},[]),x=o.useCallback(e=>{let t="function"==typeof e?e(e):e;w(t);try{localStorage.setItem(i,t)}catch(e){}},[t]),P=o.useCallback(e=>{C(v(e)),"system"===p&&c&&!t&&T("system")},[p,t]);o.useEffect(()=>{let e=window.matchMedia(r);return e.addListener(P),P(e),()=>e.removeListener(P)},[P]),o.useEffect(()=>{let e=e=>{e.key===i&&x(e.newValue||y)};return window.addEventListener("storage",e),()=>window.removeEventListener("storage",e)},[x]),o.useEffect(()=>{T(null!=t?t:p)},[t,p]);let L=o.useMemo(()=>({theme:p,setTheme:x,forcedTheme:t,resolvedTheme:"system"===p?k:p,themes:c?[...d,"system"]:d,systemTheme:c?k:void 0}),[p,x,t,k,c,d]);return o.createElement(s.Provider,{value:L},o.createElement(u,{forcedTheme:t,disableTransitionOnChange:n,enableSystem:c,enableColorScheme:l,storageKey:i,themes:d,defaultTheme:y,attribute:b,value:g,children:S,attrs:E,nonce:_}),S)},u=o.memo(e=>{let{forcedTheme:t,storageKey:n,attribute:c,enableSystem:l,enableColorScheme:s,defaultTheme:i,value:m,attrs:d,nonce:u}=e,h="system"===i,f="class"===c?"var d=document.documentElement,c=d.classList;".concat("c.remove(".concat(d.map(e=>"'".concat(e,"'")).join(","),")"),";"):"var d=document.documentElement,n='".concat(c,"',s='setAttribute';"),v=s?(a.includes(i)?i:null)?"if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'".concat(i,"'"):"if(e==='light'||e==='dark')d.style.colorScheme=e":"",y=function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=!(arguments.length>2)||void 0===arguments[2]||arguments[2],o=m?m[e]:e,r=t?e+"|| ''":"'".concat(o,"'"),l="";return s&&n&&!t&&a.includes(e)&&(l+="d.style.colorScheme = '".concat(e,"';")),"class"===c?t||o?l+="c.add(".concat(r,")"):l+="null":o&&(l+="d[s](n,".concat(r,")")),l},b=t?"!function(){".concat(f).concat(y(t),"}()"):l?"!function(){try{".concat(f,"var e=localStorage.getItem('").concat(n,"');if('system'===e||(!e&&").concat(h,")){var t='").concat(r,"',m=window.matchMedia(t);if(m.media!==t||m.matches){").concat(y("dark"),"}else{").concat(y("light"),"}}else if(e){").concat(m?"var x=".concat(JSON.stringify(m),";"):"").concat(y(m?"x[e]":"e",!0),"}").concat(h?"":"else{"+y(i,!1,!1)+"}").concat(v,"}catch(e){}}()"):"!function(){try{".concat(f,"var e=localStorage.getItem('").concat(n,"');if(e){").concat(m?"var x=".concat(JSON.stringify(m),";"):"").concat(y(m?"x[e]":"e",!0),"}else{").concat(y(i,!1,!1),";}").concat(v,"}catch(t){}}();");return o.createElement("script",{nonce:u,dangerouslySetInnerHTML:{__html:b}})}),h=(e,t)=>{let n;if(!l){try{n=localStorage.getItem(e)||void 0}catch(e){}return n||t}},f=()=>{let e=document.createElement("style");return e.appendChild(document.createTextNode("*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(e),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(e)},1)}},v=e=>(e||(e=window.matchMedia(r)),e.matches?"dark":"light");function y(e){let{children:t,...n}=e;return(0,c.jsx)(i,{...n,children:t})}},34332:function(){},63505:function(e){e.exports={style:{fontFamily:"'__Inter_d65c78', '__Inter_Fallback_d65c78'",fontStyle:"normal"},className:"__className_d65c78",variable:"__variable_d65c78"}}},function(e){e.O(0,[7822,7228,4868,231,6951,7683,9332,3654,998,2579,3650,2971,7023,1744],function(){return e(e.s=76533)}),_N_E=e.O()}]);