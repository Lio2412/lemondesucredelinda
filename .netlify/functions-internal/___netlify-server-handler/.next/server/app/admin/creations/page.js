(()=>{var e={};e.id=5905,e.ids=[5905],e.modules={53524:e=>{"use strict";e.exports=require("@prisma/client")},47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},39491:e=>{"use strict";e.exports=require("assert")},14300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},13685:e=>{"use strict";e.exports=require("http")},95687:e=>{"use strict";e.exports=require("https")},63477:e=>{"use strict";e.exports=require("querystring")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},41558:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>n.a,__next_app__:()=>p,originalPathname:()=>u,pages:()=>c,routeModule:()=>m,tree:()=>d}),r(43411),r(90596),r(18880),r(96560);var s=r(23191),a=r(88716),i=r(37922),n=r.n(i),o=r(95231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);r.d(t,l);let d=["",{children:["admin",{children:["creations",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,43411)),"C:\\Users\\Win\\Desktop\\nouveau-projet-linda\\app\\admin\\creations\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,90596)),"C:\\Users\\Win\\Desktop\\nouveau-projet-linda\\app\\admin\\layout.tsx"]}]},{layout:[()=>Promise.resolve().then(r.bind(r,18880)),"C:\\Users\\Win\\Desktop\\nouveau-projet-linda\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.bind(r,96560)),"C:\\Users\\Win\\Desktop\\nouveau-projet-linda\\app\\not-found.tsx"]}],c=["C:\\Users\\Win\\Desktop\\nouveau-projet-linda\\app\\admin\\creations\\page.tsx"],u="/admin/creations/page",p={require:r,loadChunk:()=>Promise.resolve()},m=new s.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/admin/creations/page",pathname:"/admin/creations",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},77944:(e,t,r)=>{Promise.resolve().then(r.bind(r,2802))},10094:(e,t,r)=>{Promise.resolve().then(r.bind(r,54253)),Promise.resolve().then(r.t.bind(r,79404,23))},2802:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>x});var s=r(10326),a=r(17577),i=r.n(a),n=r(90434),o=r(24319),l=r(89077),d=r(1572),c=r(6343),u=r(5932),p=r(76464);let m=()=>{let e=[{href:"/admin",label:"Tableau de bord",icon:o.Z},{href:"/admin/recipes",label:"Recettes",icon:l.Z},{href:"/admin/creations",label:"Cr\xe9ations",icon:d.Z},{href:"/admin/articles",label:"Articles",icon:c.Z},{href:"/admin/newsletter",label:"Newsletter",icon:u.Z},{href:"/admin/analytics",label:"Analytics",icon:p.Z}];return(0,s.jsxs)("aside",{className:"w-64 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col",children:[s.jsx("div",{className:"h-16 flex items-center justify-center border-b dark:border-gray-700",children:s.jsx(n.default,{href:"/admin",className:"text-xl font-semibold text-gray-800 dark:text-white",children:"Admin Panel"})}),s.jsx("nav",{className:"flex-grow p-4 space-y-2 flex flex-col items-center",children:e.map((e,t)=>(0,s.jsxs)(i().Fragment,{children:["Analytics"===e.label&&s.jsx("hr",{className:"w-3/4 my-2 border-gray-200 dark:border-gray-600"}),(0,s.jsxs)(n.default,{href:e.href,className:`flex flex-col items-center justify-center w-full px-3 py-3 rounded-md text-sm font-medium transition-colors ${"#"===e.href?"text-gray-400 dark:text-gray-500 cursor-not-allowed":"text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`,onClick:t=>"#"===e.href&&t.preventDefault(),"aria-disabled":"#"===e.href,tabIndex:"#"===e.href?-1:void 0,children:[s.jsx(e.icon,{className:"w-6 h-6 mb-1"})," ",s.jsx("span",{className:"text-xs text-center",children:e.label})," "]})]},e.label))}),s.jsx("div",{className:"p-4 border-t dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400",children:"Mock Admin v1.0"})]})};function x({children:e}){return(0,s.jsxs)("div",{className:"flex h-screen bg-gray-100 dark:bg-gray-900",children:[s.jsx(m,{}),s.jsx("main",{className:"flex-1 overflow-y-auto",children:s.jsx("div",{className:"p-6 md:p-8 pt-16 md:pt-20",children:e})})]})}},54253:(e,t,r)=>{"use strict";r.d(t,{default:()=>f});var s=r(10326),a=r(17577),i=r(90434),n=r(46226),o=r(35047),l=r(15940),d=r(90772),c=r(44389),u=r(47035),p=r(99440),m=r(94215),x=r(77863);function f({creations:e}){let t=(0,o.useRouter)(),{toast:r}=(0,m.pm)(),[f,h]=(0,a.useState)(null),y=async e=>{h(e);try{if(!(await fetch(`/api/creations/${e}`,{method:"DELETE"})).ok)throw Error("La suppression a \xe9chou\xe9");r({title:"Succ\xe8s",description:"La cr\xe9ation a \xe9t\xe9 supprim\xe9e."}),t.refresh()}catch(e){console.error("Erreur lors de la suppression:",e),r({title:"Erreur",description:"Impossible de supprimer la cr\xe9ation."})}finally{h(null)}};return s.jsx("div",{className:"rounded-md border",children:(0,s.jsxs)(l.iA,{children:[s.jsx(l.xD,{children:(0,s.jsxs)(l.SC,{children:[s.jsx(l.ss,{className:"w-[80px]",children:"Image"}),s.jsx(l.ss,{children:"Titre"}),s.jsx(l.ss,{className:"w-[150px]",children:"Date"}),s.jsx(l.ss,{className:"w-[120px] text-right",children:"Actions"})]})}),s.jsx(l.RM,{children:e.map(e=>(0,s.jsxs)(l.SC,{children:[s.jsx(l.pj,{children:s.jsx(n.default,{src:e.image||"/images/default-recipe.jpg",alt:e.title,width:50,height:50,className:"rounded object-cover aspect-square"})}),s.jsx(l.pj,{className:"font-medium",children:e.title}),s.jsx(l.pj,{children:(0,x.p)(e.createdAt)}),(0,s.jsxs)(l.pj,{className:"text-right space-x-2",children:[s.jsx(d.z,{variant:"outline",size:"icon",asChild:!0,children:(0,s.jsxs)(i.default,{href:`/admin/creations/${e.id}/edit`,children:[s.jsx(c.Z,{className:"h-4 w-4"}),s.jsx("span",{className:"sr-only",children:"Modifier"})]})}),(0,s.jsxs)(p.aR,{children:[s.jsx(p.vW,{asChild:!0,children:(0,s.jsxs)(d.z,{variant:"destructive",size:"icon",disabled:f===e.id,children:[s.jsx(u.Z,{className:"h-4 w-4"}),s.jsx("span",{className:"sr-only",children:"Supprimer"})]})}),(0,s.jsxs)(p._T,{children:[(0,s.jsxs)(p.fY,{children:[s.jsx(p.f$,{children:"\xcates-vous s\xfbr ?"}),(0,s.jsxs)(p.yT,{children:['Cette action est irr\xe9versible et supprimera d\xe9finitivement la cr\xe9ation "',e.title,'".']})]}),(0,s.jsxs)(p.xo,{children:[s.jsx(p.le,{disabled:f===e.id,children:"Annuler"}),s.jsx(p.OL,{onClick:()=>y(e.id),disabled:f===e.id,className:"bg-destructive text-destructive-foreground hover:bg-destructive/90",children:f===e.id?"Suppression...":"Supprimer"})]})]})]})]})]},e.id))})]})})}},99440:(e,t,r)=>{"use strict";r.d(t,{OL:()=>y,_T:()=>p,aR:()=>l,f$:()=>f,fY:()=>m,le:()=>b,vW:()=>d,xo:()=>x,yT:()=>h});var s=r(10326),a=r(17577),i=r(80440),n=r(77863),o=r(90772);let l=i.fC,d=i.xz,c=({...e})=>s.jsx(i.h_,{...e});c.displayName=i.h_.displayName;let u=a.forwardRef(({className:e,children:t,...r},a)=>s.jsx(i.aV,{className:(0,n.cn)("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...r,ref:a}));u.displayName=i.aV.displayName;let p=a.forwardRef(({className:e,...t},r)=>(0,s.jsxs)(c,{children:[s.jsx(u,{}),s.jsx(i.VY,{ref:r,className:(0,n.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full",e),...t})]}));p.displayName=i.VY.displayName;let m=({className:e,...t})=>s.jsx("div",{className:(0,n.cn)("flex flex-col space-y-2 text-center sm:text-left",e),...t});m.displayName="AlertDialogHeader";let x=({className:e,...t})=>s.jsx("div",{className:(0,n.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...t});x.displayName="AlertDialogFooter";let f=a.forwardRef(({className:e,...t},r)=>s.jsx(i.Dx,{ref:r,className:(0,n.cn)("text-lg font-semibold",e),...t}));f.displayName=i.Dx.displayName;let h=a.forwardRef(({className:e,...t},r)=>s.jsx(i.dk,{ref:r,className:(0,n.cn)("text-sm text-muted-foreground",e),...t}));h.displayName=i.dk.displayName;let y=a.forwardRef(({className:e,...t},r)=>s.jsx(i.aU,{ref:r,className:(0,n.cn)((0,o.d)(),e),...t}));y.displayName=i.aU.displayName;let b=a.forwardRef(({className:e,...t},r)=>s.jsx(i.$j,{ref:r,className:(0,n.cn)((0,o.d)({variant:"outline"}),"mt-2 sm:mt-0",e),...t}));b.displayName=i.$j.displayName},15940:(e,t,r)=>{"use strict";r.d(t,{RM:()=>l,SC:()=>d,iA:()=>n,pj:()=>u,ss:()=>c,xD:()=>o});var s=r(10326),a=r(17577),i=r(77863);let n=a.forwardRef(({className:e,...t},r)=>s.jsx("div",{className:"relative w-full overflow-auto",children:s.jsx("table",{ref:r,className:(0,i.cn)("w-full caption-bottom text-sm",e),...t})}));n.displayName="Table";let o=a.forwardRef(({className:e,...t},r)=>s.jsx("thead",{ref:r,className:(0,i.cn)("[&_tr]:border-b",e),...t}));o.displayName="TableHeader";let l=a.forwardRef(({className:e,...t},r)=>s.jsx("tbody",{ref:r,className:(0,i.cn)("[&_tr:last-child]:border-0",e),...t}));l.displayName="TableBody",a.forwardRef(({className:e,...t},r)=>s.jsx("tfoot",{ref:r,className:(0,i.cn)("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",e),...t})).displayName="TableFooter";let d=a.forwardRef(({className:e,...t},r)=>s.jsx("tr",{ref:r,className:(0,i.cn)("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",e),...t}));d.displayName="TableRow";let c=a.forwardRef(({className:e,...t},r)=>s.jsx("th",{ref:r,className:(0,i.cn)("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",e),...t}));c.displayName="TableHead";let u=a.forwardRef(({className:e,...t},r)=>s.jsx("td",{ref:r,className:(0,i.cn)("p-4 align-middle [&:has([role=checkbox])]:pr-0",e),...t}));u.displayName="TableCell",a.forwardRef(({className:e,...t},r)=>s.jsx("caption",{ref:r,className:(0,i.cn)("mt-4 text-sm text-muted-foreground",e),...t})).displayName="TableCaption"},94215:(e,t,r)=>{"use strict";r.d(t,{Am:()=>u,pm:()=>p});var s=r(17577);let a=0,i=new Map,n=e=>{if(i.has(e))return;let t=setTimeout(()=>{i.delete(e),c({type:"REMOVE_TOAST",toastId:e})},1e6);i.set(e,t)},o=(e,t)=>{switch(t.type){case"ADD_TOAST":return{...e,toasts:[t.toast,...e.toasts].slice(0,1)};case"UPDATE_TOAST":return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case"DISMISS_TOAST":{let{toastId:r}=t;return r?n(r):e.toasts.forEach(e=>{n(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,open:!1}:e)}}case"REMOVE_TOAST":if(void 0===t.toastId)return{...e,toasts:[]};return{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)}}},l=[],d={toasts:[]};function c(e){d=o(d,e),l.forEach(e=>{e(d)})}function u({...e}){let t=(a=(a+1)%Number.MAX_SAFE_INTEGER).toString(),r=()=>c({type:"DISMISS_TOAST",toastId:t});return c({type:"ADD_TOAST",toast:{...e,id:t,open:!0,onOpenChange:e=>{e||r()}}}),{id:t,dismiss:r,update:e=>c({type:"UPDATE_TOAST",toast:{...e,id:t}})}}function p(){let[e,t]=s.useState(d);return s.useEffect(()=>(l.push(t),()=>{let e=l.indexOf(t);e>-1&&l.splice(e,1)}),[e]),{...e,toast:u,dismiss:e=>c({type:"DISMISS_TOAST",toastId:e})}}},43411:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>m});var s=r(19510),a=r(57371),i=r(2946),n=r(94126),o=r(65260),l=r(68570);let d=(0,l.createProxy)(String.raw`C:\Users\Win\Desktop\nouveau-projet-linda\components\admin\CreationsTable.tsx`),{__esModule:c,$$typeof:u}=d;d.default;let p=(0,l.createProxy)(String.raw`C:\Users\Win\Desktop\nouveau-projet-linda\components\admin\CreationsTable.tsx#default`);async function m(){let e=await (0,o.CP)();return(0,s.jsxs)("div",{className:"container mx-auto py-10",children:[(0,s.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[s.jsx("h1",{className:"text-3xl font-bold",children:"Gestion des cr\xe9ations"}),s.jsx(i.z,{asChild:!0,children:(0,s.jsxs)(a.default,{href:"/admin/creations/new",children:[s.jsx(n.Z,{className:"mr-2 h-4 w-4"})," Ajouter une cr\xe9ation "]})})]}),s.jsx(p,{creations:e})]})}},90596:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>n,__esModule:()=>i,default:()=>o});var s=r(68570);let a=(0,s.createProxy)(String.raw`C:\Users\Win\Desktop\nouveau-projet-linda\app\admin\layout.tsx`),{__esModule:i,$$typeof:n}=a;a.default;let o=(0,s.createProxy)(String.raw`C:\Users\Win\Desktop\nouveau-projet-linda\app\admin\layout.tsx#default`)},2946:(e,t,r)=>{"use strict";r.d(t,{d:()=>l,z:()=>d});var s=r(19510),a=r(71159),i=r(43025),n=r(46145),o=r(50650);let l=(0,n.j)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),d=a.forwardRef(({className:e,variant:t,size:r,asChild:a=!1,...n},d)=>{let c=a?i.g7:"button";return s.jsx(c,{className:(0,o.cn)(l({variant:t,size:r,className:e})),ref:d,...n})});d.displayName="Button"},65260:(e,t,r)=>{"use strict";r.d(t,{CP:()=>a,Fm:()=>n,vM:()=>i});var s=r(72331);let a=async()=>{try{return await s._.creation.findMany({orderBy:{createdAt:"desc"}})}catch(e){throw console.error("Erreur sp\xe9cifique lors de la r\xe9cup\xe9ration des cr\xe9ations:",e),Error("Impossible de r\xe9cup\xe9rer les cr\xe9ations.")}},i=async(e=5)=>{try{return await s._.creation.findMany({orderBy:{createdAt:"desc"},take:e})}catch(t){throw console.error(`Erreur lors de la r\xe9cup\xe9ration des ${e} derni\xe8res cr\xe9ations:`,t),Error("Impossible de r\xe9cup\xe9rer les derni\xe8res cr\xe9ations.")}},n=async e=>{try{return await s._.creation.findUnique({where:{id:e}})}catch(t){throw console.error(`Erreur lors de la r\xe9cup\xe9ration de la cr\xe9ation ${e}:`,t),Error("Impossible de r\xe9cup\xe9rer la cr\xe9ation.")}}},72331:(e,t,r)=>{"use strict";r.d(t,{_:()=>a});var s=r(53524);let a=global.prisma||new s.PrismaClient({})},94126:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(27162).Z)("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]])}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[1633,7162,5291,8256,233],()=>r(41558));module.exports=s})();