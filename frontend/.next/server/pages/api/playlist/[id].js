"use strict";(()=>{var e={};e.id=967,e.ids=[967],e.modules={9344:e=>{e.exports=require("jsonwebtoken")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},3359:(e,t,r)=>{r.r(t),r.d(t,{config:()=>d,default:()=>u,routeModule:()=>c});var n={};r.r(n),r.d(n,{default:()=>o});var a=r(1802),s=r(7153),i=r(6249),l=r(9782);function o(e,t){"GET"===e.method&&l._.getOne(e,t)}let u=(0,i.l)(n,"default"),d=(0,i.l)(n,"config"),c=new a.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/playlist/[id]",pathname:"/api/playlist/[id]",bundlePath:"",filename:""},userland:n})},9782:(e,t,r)=>{r.d(t,{_:()=>s});var n=r(8438),a=r(9983);let s={create:async(e,t)=>{try{let r=await (0,a.I)(e,t);if(!r)return;let{title:s,description:i}=e.body;if(!s)return t.status(400).json({err:"No title provided"});let l=await n._.playlist.create({data:{title:s,description:i,userId:r.id}});t.json(l)}catch(e){return console.log(e.message),t.status(500).json({err:"Radās kļūme"})}},edit:async(e,t)=>{try{let r=await (0,a.I)(e,t);if(!r)return;let{id:s}=e.query,{title:i,description:l}=e.body;if(!i)return t.status(400).json({err:"No title provided"});let o=await n._.playlist.update({where:{id:Number(s)},data:{title:i,description:l,userId:r.id}});t.json(o)}catch(e){return console.log(e.message),t.status(500).json({err:"Radās kļūme"})}},deleteOne:async(e,t)=>{try{if(!await (0,a.I)(e,t))return;let{id:r}=e.query;await n._.songInPlaylist.deleteMany({where:{playlistId:Number(r)}}),await n._.playlist.delete({where:{id:Number(r)}}),t.json({msg:"Deleted"})}catch(e){return console.log(e.message),t.status(500).json({err:"Radās kļūme"})}},getOne:async(e,t)=>{try{if(!await (0,a.I)(e,t))return;let{id:r}=e.query,s=await n._.playlist.findFirst({where:{id:Number(r)},include:{songs:{select:{song:!0}}}});t.json(s)}catch(e){return console.log(e.message),t.status(500).json({err:"Radās kļūme"})}}}},8438:(e,t,r)=>{r.d(t,{_:()=>n});let n=new(require("@prisma/client")).PrismaClient},9983:(e,t,r)=>{r.d(t,{I:()=>i});var n=r(9344),a=r.n(n),s=r(8438);let i=async(e,t)=>{try{let{refresh_token:r}=e.cookies;if(!r)return t.status(400).json({err:"Unauthorized"}),null;let n=a().verify(r,String(process.env.REFRESH_TOKEN_SECRET));if(!n)return t.status(400).json({err:"Unauthorized"}),null;let i=await s._.user.findFirst({where:{id:Number(n)}});if(!i)return t.status(400).json({err:"Unauthorized"}),null;return i}catch(e){console.log(e)}}},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var r=t(t.s=3359);module.exports=r})();