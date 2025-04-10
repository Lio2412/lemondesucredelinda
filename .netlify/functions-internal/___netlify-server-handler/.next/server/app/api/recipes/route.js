"use strict";(()=>{var e={};e.id=7224,e.ids=[7224],e.modules={53524:e=>{e.exports=require("@prisma/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},85477:e=>{e.exports=require("punycode")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},59796:e=>{e.exports=require("zlib")},40335:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>v,patchFetch:()=>I,requestAsyncStorage:()=>y,routeModule:()=>b,serverHooks:()=>f,staticGenerationAsyncStorage:()=>E});var i={};t.r(i),t.d(i,{POST:()=>x});var a=t(49303),s=t(88716),n=t(60670),o=t(72331),p=t(85662),u=t(87070),l=t(79843),c=t(7410);let d="images",m=c.z.object({name:c.z.string().min(1),quantity:c.z.number().positive(),unit:c.z.string().min(1)}),g=c.z.object({description:c.z.string().min(10),duration:c.z.number().int().positive().optional()});async function x(e){try{let r,t,i,a,s,n,x,b,y,E,f,v;let I=e.headers.get("content-type");if(I?.includes("multipart/form-data")){let o=await e.formData();r=o.get("title"),t=o.get("slug"),i=o.get("description"),a=o.get("difficulty"),s=o.get("prepTime")?parseInt(o.get("prepTime"),10):void 0,n=o.get("cookTime")?parseInt(o.get("cookTime"),10):void 0,x=parseInt(o.get("basePortions"),10),b=o.get("category");let p=o.get("ingredients"),l=o.get("steps"),d=o.get("image");if(!r||!t||!x||!p||!l)return u.NextResponse.json({error:"Donn\xe9es FormData manquantes"},{status:400});try{y=c.z.array(m).min(1).parse(JSON.parse(p)),E=c.z.array(g).min(1).parse(JSON.parse(l))}catch(e){return u.NextResponse.json({error:"Donn\xe9es ingr\xe9dients/\xe9tapes invalides",details:e},{status:400})}d&&(f=d)}else{if(!I?.includes("application/json"))return u.NextResponse.json({error:"Content-Type non support\xe9"},{status:415});let o=await e.json();r=o.title,t=o.slug,i=o.description,a=o.difficulty,s=o.prepTime,n=o.cookTime,x=o.basePortions,b=o.category,y=c.z.array(m).min(1).parse(o.ingredients),E=c.z.array(g).min(1).parse(o.steps),"string"==typeof o.image&&(v=o.image)}if(f){let e=f.name.split(".").pop(),r=`${(0,l.Z)()}.${e}`,t=`recipes/${r}`,{error:i}=await p.p.storage.from(d).upload(t,f);if(i)throw console.error("Erreur d'upload Supabase:",i),Error("Impossible d'uploader l'image.");let{data:a}=p.p.storage.from(d).getPublicUrl(t);if(!a?.publicUrl)throw console.error("Erreur r\xe9cup\xe9ration URL publique Supabase:",t),Error("Impossible d'obtenir l'URL publique de l'image.");v=a.publicUrl}let q=await o._.$transaction(async e=>{let o=await e.recipe.create({data:{title:r,slug:t,description:i,difficulty:a,prepTime:s,cookTime:n,basePortions:x,category:b,image:v}});return await e.ingredient.createMany({data:y.map(e=>({...e,recipeId:o.id}))}),await e.recipeStep.createMany({data:E.map((e,r)=>({order:r+1,description:e.description,duration:e.duration,recipeId:o.id}))}),o});return console.log(`Nouvelle recette cr\xe9\xe9e: ${q.id}`),u.NextResponse.json(q,{status:201})}catch(t){console.error("Erreur lors de la cr\xe9ation de la recette:",t);let e="Erreur interne du serveur",r=500;return t instanceof c.z.ZodError?(e="Donn\xe9es invalides",r=400):t instanceof Error&&(e=t.message,"code"in t&&"P2002"===t.code&&"meta"in t&&"object"==typeof t.meta&&t.meta&&"target"in t.meta&&Array.isArray(t.meta.target)&&t.meta.target.includes("slug")&&(e="Ce slug est d\xe9j\xe0 utilis\xe9.",r=409)),u.NextResponse.json({error:e},{status:r})}}let b=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/recipes/route",pathname:"/api/recipes",filename:"route",bundlePath:"app/api/recipes/route"},resolvedPagePath:"C:\\Users\\Win\\Desktop\\nouveau-projet-linda\\app\\api\\recipes\\route.ts",nextConfigOutput:"standalone",userland:i}),{requestAsyncStorage:y,staticGenerationAsyncStorage:E,serverHooks:f}=b,v="/api/recipes/route";function I(){return(0,n.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:E})}},72331:(e,r,t)=>{t.d(r,{_:()=>a});var i=t(53524);let a=global.prisma||new i.PrismaClient({})},85662:(e,r,t)=>{t.d(r,{p:()=>o});var i=t(31518);let a="https://pbqkgspugfjyrgkrciln.supabase.co",s="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBicWtnc3B1Z2ZqeXJna3JjaWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODEwMjEsImV4cCI6MjA1OTM1NzAyMX0.iVzx8WOoyVE-RRj2KzdPZB0LNiixikgPSnAtAkE_8es";if(!a)throw Error("La variable d'environnement NEXT_PUBLIC_SUPABASE_URL est manquante.");if(!s)throw Error("La variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY est manquante.");(0,i.eI)(a,s);let n=process.env.SUPABASE_SERVICE_ROLE;n||console.warn("La variable d'environnement SUPABASE_SERVICE_ROLE est manquante. Les op\xe9rations admin Supabase pourraient \xe9chouer.");let o=(0,i.eI)(a,n||"")}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),i=r.X(0,[1633,5972,7076,7410],()=>t(40335));module.exports=i})();