"use strict";(()=>{var e={};e.id=9573,e.ids=[9573],e.modules={53524:e=>{e.exports=require("@prisma/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},52744:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>m,patchFetch:()=>x,requestAsyncStorage:()=>c,routeModule:()=>p,serverHooks:()=>g,staticGenerationAsyncStorage:()=>d});var a={};r.r(a),r.d(a,{POST:()=>l});var s=r(49303),i=r(88716),n=r(60670),o=r(87070),u=r(72331);async function l(e){try{let t=await e.json();if(!t.title||!t.slug||!t.excerpt||!t.content||!t.publishedAt)return o.NextResponse.json({error:"Les champs titre, slug, extrait, contenu et date de publication sont requis."},{status:400});if(t.imageUrl&&"string"!=typeof t.imageUrl)return o.NextResponse.json({error:"L'URL de l'image doit \xeatre une cha\xeene de caract\xe8res."},{status:400});if(isNaN(Date.parse(t.publishedAt)))return o.NextResponse.json({error:"Format de date de publication invalide."},{status:400});let r=Array.isArray(t.tags)?t.tags:[],a=await u._.article.create({data:{title:t.title,slug:t.slug,excerpt:t.excerpt,content:t.content,tags:r,publishedAt:new Date(t.publishedAt),image:t.imageUrl||null}});return o.NextResponse.json(a)}catch(e){return console.error("Erreur lors de la cr\xe9ation de l'article:",e),o.NextResponse.json({error:"Erreur serveur lors de la cr\xe9ation."},{status:500})}}let p=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/articles/route",pathname:"/api/articles",filename:"route",bundlePath:"app/api/articles/route"},resolvedPagePath:"C:\\Users\\Win\\Desktop\\nouveau-projet-linda\\app\\api\\articles\\route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:c,staticGenerationAsyncStorage:d,serverHooks:g}=p,m="/api/articles/route";function x(){return(0,n.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:d})}},72331:(e,t,r)=>{r.d(t,{_:()=>s});var a=r(53524);let s=global.prisma||new a.PrismaClient({})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[1633,5972],()=>r(52744));module.exports=a})();