(()=>{var e={};e.id=9404,e.ids=[9404],e.modules={53524:e=>{"use strict";e.exports=require("@prisma/client")},47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},39491:e=>{"use strict";e.exports=require("assert")},14300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},13685:e=>{"use strict";e.exports=require("http")},95687:e=>{"use strict";e.exports=require("https")},63477:e=>{"use strict";e.exports=require("querystring")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},52830:e=>{e.exports={style:{fontFamily:"'__Playfair_Display_de499b', '__Playfair_Display_Fallback_de499b'",fontStyle:"normal"},className:"__className_de499b"}},58340:e=>{e.exports={style:{fontFamily:"'__Playfair_Display_de499b', '__Playfair_Display_Fallback_de499b'",fontStyle:"normal"},className:"__className_de499b"}},85942:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>n.a,__next_app__:()=>x,originalPathname:()=>u,pages:()=>c,routeModule:()=>p,tree:()=>d}),r(43973),r(18880),r(96560);var a=r(23191),s=r(88716),i=r(37922),n=r.n(i),l=r(95231),o={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>l[e]);r.d(t,o);let d=["",{children:["blog",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,43973)),"C:\\Users\\Win\\Desktop\\nouveau-projet-linda\\app\\blog\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,18880)),"C:\\Users\\Win\\Desktop\\nouveau-projet-linda\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.bind(r,96560)),"C:\\Users\\Win\\Desktop\\nouveau-projet-linda\\app\\not-found.tsx"]}],c=["C:\\Users\\Win\\Desktop\\nouveau-projet-linda\\app\\blog\\page.tsx"],u="/blog/page",x={require:r,loadChunk:()=>Promise.resolve()},p=new a.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/blog/page",pathname:"/blog",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},90674:(e,t,r)=>{Promise.resolve().then(r.bind(r,31837)),Promise.resolve().then(r.bind(r,20523))},31837:(e,t,r)=>{"use strict";r.d(t,{default:()=>g});var a=r(10326),s=r(52830),i=r.n(s),n=r(17577),l=r(90434),o=r(46226),d=r(77863),c=r(54432),u=r(90772),x=r(567),p=r(88307);function g({articles:e}){let[t,r]=(0,n.useState)(""),[s,g]=(0,n.useState)(1),[m,h]=(0,n.useState)(""),b=(0,n.useMemo)(()=>{let t=new Set;return e.forEach(e=>{e.tags?.forEach(e=>t.add(e))}),Array.from(t).sort()},[e]),y=(0,n.useMemo)(()=>{let r=e.filter(e=>{let r=""===m||e.tags&&e.tags.includes(m),a=""===t||e.title.toLowerCase().includes(t.toLowerCase())||e.content&&e.content.toLowerCase().includes(t.toLowerCase());return r&&a}),a=Math.ceil(r.length/6),i=(s-1)*6;return{data:r.slice(i,i+6),meta:{currentPage:s,totalPages:a,totalItems:r.length}}},[t,m,s,e]),f=e=>{h(e),g(1)},v=(e,t=150)=>{if(!e)return"";if(e.length<=t)return e;let r=e.lastIndexOf(" ",t);return e.substring(0,r>0?r:t)+"..."};return(0,a.jsxs)(a.Fragment,{children:[a.jsx("div",{className:"flex justify-center mb-10",children:(0,a.jsxs)("form",{onSubmit:e=>{e.preventDefault(),g(1)},className:"relative w-full max-w-lg",children:[a.jsx(c.I,{type:"text",placeholder:"Rechercher des articles...",value:t,onChange:e=>r(e.target.value),className:"w-full rounded-full border-gray-300 dark:border-gray-600 pr-12 py-2 dark:bg-gray-800 dark:text-white focus:border-pink-500 dark:focus:border-pink-400 focus:ring-pink-500/20"}),(0,a.jsxs)(u.z,{type:"submit",size:"icon",variant:"ghost",className:"absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-gray-500 hover:text-pink-600 dark:hover:text-pink-400",children:[a.jsx(p.Z,{className:"w-4 h-4"}),a.jsx("span",{className:"sr-only",children:"Rechercher"})]})]})}),(0,a.jsxs)("div",{className:"flex justify-center flex-wrap gap-2 mb-12",children:[a.jsx(u.z,{variant:"outline",onClick:()=>f(""),className:`rounded-full transition-colors ${""===m?"bg-pink-600 text-white hover:bg-pink-700 border-pink-600":"dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"}`,children:"Tous"}),b.map(e=>a.jsx(u.z,{variant:"outline",onClick:()=>f(e),className:`rounded-full transition-colors ${m===e?"bg-pink-600 text-white hover:bg-pink-700 border-pink-600":"dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"}`,children:e},e))]}),0===y.data.length?(0,a.jsxs)("div",{className:"text-center py-10",children:[a.jsx("p",{className:"text-lg text-gray-500 dark:text-gray-400",children:"Aucun article trouv\xe9."}),(t||m)&&a.jsx(u.z,{variant:"outline",onClick:()=>{r(""),f("")},className:"mt-4 rounded-full dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700",children:"R\xe9initialiser les filtres"})]}):(0,a.jsxs)(a.Fragment,{children:[a.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",children:y.data.map(e=>a.jsx(l.default,{href:`/blog/${e.slug}`,className:"group block",children:(0,a.jsxs)("div",{className:"bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col border dark:border-gray-700",children:["string"==typeof e.image&&e.image.length>0&&a.jsx("div",{className:"relative w-full aspect-video overflow-hidden",children:a.jsx(o.default,{src:e.image,alt:e.title??"Image article",fill:!0,sizes:"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",className:"object-cover transition-transform duration-500 group-hover:scale-105"})}),(0,a.jsxs)("div",{className:"p-5 flex flex-col flex-grow",children:[a.jsx("div",{className:"mb-2 flex flex-wrap gap-1",children:e.tags?.map(e=>a.jsx(x.C,{variant:"secondary",className:"bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 font-medium",children:e},e))}),a.jsx("h3",{className:`text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300 ${i().className}`,children:e.title}),a.jsx("p",{className:"text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow",children:v(e.content)}),a.jsx("div",{className:"flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700",children:a.jsx("span",{children:(0,d.p)(e.createdAt)})})]})]})},e.id))}),y.meta.totalPages>1&&a.jsx("div",{className:"flex justify-center mt-12",children:(0,a.jsxs)("div",{className:"flex items-center space-x-2",children:[a.jsx(u.z,{variant:"outline",onClick:()=>g(s-1),disabled:1===s,className:"rounded-md dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50",children:"Pr\xe9c\xe9dent"}),[...Array(y.meta.totalPages)].map((e,t)=>a.jsx(u.z,{variant:t+1===s?"default":"outline",onClick:()=>g(t+1),className:`rounded-md w-9 h-9 p-0 ${t+1===s?"bg-pink-600 hover:bg-pink-700 text-white border-pink-600":"dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"}`,children:t+1},t+1)),a.jsx(u.z,{variant:"outline",onClick:()=>g(s+1),disabled:s===y.meta.totalPages,className:"rounded-md dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50",children:"Suivant"})]})})]})]})}},20523:(e,t,r)=>{"use strict";r.d(t,{default:()=>l});var a=r(10326),s=r(58340),i=r.n(s);r(17577);var n=r(83579);let l=({title:e,className:t})=>a.jsx(n.E.h1,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.6,ease:"easeOut"},className:`text-4xl md:text-5xl mb-6 text-gray-900 dark:text-white ${i().className} ${t||""}`,children:e})},567:(e,t,r)=>{"use strict";r.d(t,{C:()=>l});var a=r(10326);r(17577);var s=r(79360),i=r(77863);let n=(0,s.j)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function l({className:e,variant:t,...r}){return a.jsx("div",{className:(0,i.cn)(n({variant:t}),e),...r})}},43973:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>u});var a=r(19510);r(71159);var s=r(72331),i=r(9654),n=r(68570);let l=(0,n.createProxy)(String.raw`C:\Users\Win\Desktop\nouveau-projet-linda\components\blog\BlogGrid.tsx`),{__esModule:o,$$typeof:d}=l;l.default;let c=(0,n.createProxy)(String.raw`C:\Users\Win\Desktop\nouveau-projet-linda\components\blog\BlogGrid.tsx#default`);async function u(){let e=await s._.article.findMany({orderBy:{createdAt:"desc"},select:{id:!0,title:!0,createdAt:!0,tags:!0,content:!0,slug:!0,image:!0}});return(0,a.jsxs)("div",{className:"bg-white dark:bg-gray-900 min-h-screen pt-24 md:pt-32",children:[" ",(0,a.jsxs)("section",{className:"mb-12 text-center",children:[" ",(0,a.jsxs)("div",{className:"container mx-auto px-4",children:[" ",(0,a.jsxs)("div",{className:"max-w-3xl mx-auto",children:[" ",a.jsx(i.ZP,{title:"Blog"}),a.jsx("div",{className:"w-20 h-px bg-pink-600 dark:bg-pink-500 mx-auto mb-6"}),a.jsx("p",{className:"text-gray-600 dark:text-gray-400 mb-8",children:"D\xe9couvrez l'art de la p\xe2tisserie fran\xe7aise \xe0 travers des articles, conseils et actualit\xe9s."})]})]})]}),a.jsx("div",{className:"container mx-auto py-12 px-4",children:a.jsx(c,{articles:e})})]})}},9654:(e,t,r)=>{"use strict";r.d(t,{ZP:()=>l});var a=r(68570);let s=(0,a.createProxy)(String.raw`C:\Users\Win\Desktop\nouveau-projet-linda\components\layout\AnimatedPageTitle.tsx`),{__esModule:i,$$typeof:n}=s;s.default;let l=(0,a.createProxy)(String.raw`C:\Users\Win\Desktop\nouveau-projet-linda\components\layout\AnimatedPageTitle.tsx#default`)},72331:(e,t,r)=>{"use strict";r.d(t,{_:()=>s});var a=r(53524);let s=global.prisma||new a.PrismaClient({})}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[1633,7162,5291,233],()=>r(85942));module.exports=a})();