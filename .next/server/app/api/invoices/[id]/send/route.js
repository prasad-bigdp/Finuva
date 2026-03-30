"use strict";(()=>{var a={};a.id=7785,a.ids=[7785],a.modules={261:a=>{a.exports=require("next/dist/shared/lib/router/utils/app-paths")},972:a=>{a.exports=import("@react-pdf/renderer")},3295:a=>{a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4573:a=>{a.exports=require("node:buffer")},10846:a=>{a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},14985:a=>{a.exports=require("dns")},19121:a=>{a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},21820:a=>{a.exports=require("os")},27668:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{handler:()=>x,patchFetch:()=>w,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(51668),v=a([u]);u=(v.then?(await v)():v)[0];let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/invoices/[id]/send/route",pathname:"/api/invoices/[id]/send",filename:"route",bundlePath:"app/api/invoices/[id]/send/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"C:\\Users\\pc\\Desktop\\NareshIt\\zoho-invoice-clone\\src\\app\\api\\invoices\\[id]\\send\\route.ts",nextConfigOutput:"",userland:u}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function w(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function x(a,b,c){var d;let e="/api/invoices/[id]/send/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!x){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||y.isDev||x||(G=D,G="/index"===G?"/":G);let H=!0===y.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await y.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||b instanceof s.NoFallbackError||await y.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}d()}catch(a){d(a)}})},27910:a=>{a.exports=require("stream")},28354:a=>{a.exports=require("util")},29021:a=>{a.exports=require("fs")},29294:a=>{a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:a=>{a.exports=require("path")},34631:a=>{a.exports=require("tls")},44870:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},51668:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{POST:()=>k});var e=c(96798),f=c(67360),g=c(82716),h=c(70673),i=c(710),j=a([i]);async function k(a,{params:b}){try{let a=await (0,f.UM)(),{id:c}=await b,d=await e.z.invoice.findFirst({where:{id:c,organizationId:a.user.organizationId},include:{customer:!0,organization:!0,items:{orderBy:{sortOrder:"asc"}}}});if(!d)return(0,h.pb)("Invoice not found",404);if(!d.customer.email)return(0,h.pb)("Customer has no email address",400);let j=`http://localhost:3000/invoices/${d.id}`,k=`http://localhost:3000/api/invoices/${d.id}/pdf`,l=await (0,i.s)(d);return await (0,g.ZM)({to:d.customer.email,subject:`Invoice ${d.invoiceNumber} from ${d.organization.name}`,html:(0,g.ud)({customerName:d.customer.displayName,invoiceNumber:d.invoiceNumber,amount:(0,h.vv)(Number(d.balanceDue)),dueDate:(0,h.Yq)(d.dueDate),orgName:d.organization.name,viewUrl:j}),attachments:[{filename:`${d.invoiceNumber}.pdf`,content:l,contentType:"application/pdf"}]}),await e.z.invoice.update({where:{id:c},data:{status:"SENT",sentAt:new Date,pdfUrl:k}}),(0,h.kU)({sent:!0})}catch(a){if("Unauthorized"===a.message)return(0,h.pb)("Unauthorized",401);return console.error("[INVOICE SEND]",a),(0,h.pb)("Failed to send email",500)}}i=(j.then?(await j)():j)[0],d()}catch(a){d(a)}})},55511:a=>{a.exports=require("crypto")},55591:a=>{a.exports=require("https")},63033:a=>{a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:a=>{a.exports=require("zlib")},79551:a=>{a.exports=require("url")},79646:a=>{a.exports=require("child_process")},81630:a=>{a.exports=require("http")},82716:(a,b,c)=>{c.d(b,{If:()=>g,ZM:()=>e,bt:()=>h,ud:()=>f});let d=c(52731).createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT??587),secure:!1,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});async function e(a){return d.sendMail({from:process.env.EMAIL_FROM??"InvoiceApp <noreply@invoiceapp.com>",...a})}function f(a){return`
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#2563eb;color:#fff;padding:20px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;">${a.orgName}</h2>
  </div>
  <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
    <p>Dear ${a.customerName},</p>
    <p>Please find your invoice <strong>${a.invoiceNumber}</strong> for <strong>${a.amount}</strong>.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr>
        <td style="padding:8px;color:#6b7280;">Invoice Number</td>
        <td style="padding:8px;font-weight:bold;">${a.invoiceNumber}</td>
      </tr>
      <tr style="background:#fff;">
        <td style="padding:8px;color:#6b7280;">Amount Due</td>
        <td style="padding:8px;font-weight:bold;color:#dc2626;">${a.amount}</td>
      </tr>
      <tr>
        <td style="padding:8px;color:#6b7280;">Due Date</td>
        <td style="padding:8px;">${a.dueDate}</td>
      </tr>
    </table>
    <div style="text-align:center;margin:24px 0;">
      <a href="${a.viewUrl}" style="background:#2563eb;color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;">
        View &amp; Pay Invoice
      </a>
    </div>
    <p style="color:#6b7280;font-size:12px;">If you have any questions, please reply to this email.</p>
    <p>Thank you,<br/>${a.orgName}</p>
  </div>
</body>
</html>`}function g(a){return`
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#16a34a;color:#fff;padding:20px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;">Payment Received — ${a.orgName}</h2>
  </div>
  <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
    <p>Dear ${a.customerName},</p>
    <p>We've received your payment of <strong>${a.amount}</strong> for invoice <strong>${a.invoiceNumber}</strong>.</p>
    <p>Thank you for your prompt payment!</p>
    <p>Best regards,<br/>${a.orgName}</p>
  </div>
</body>
</html>`}function h(a){let b=a.daysOverdue?`[OVERDUE] Invoice ${a.invoiceNumber} is ${a.daysOverdue} days past due`:`Reminder: Invoice ${a.invoiceNumber} due ${a.dueDate}`,c=a.daysOverdue?`<p style="color:#dc2626;font-weight:bold;">This invoice is ${a.daysOverdue} days overdue.</p>`:`<p>This is a friendly reminder that this invoice is due on <strong>${a.dueDate}</strong>.</p>`;return{subject:b,html:`
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#d97706;color:#fff;padding:20px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;">Payment Reminder — ${a.orgName}</h2>
  </div>
  <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
    <p>Dear ${a.customerName},</p>
    ${c}
    <p>Invoice <strong>${a.invoiceNumber}</strong> for <strong>${a.amount}</strong> remains unpaid.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${a.viewUrl}" style="background:#2563eb;color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;">
        Pay Now
      </a>
    </div>
    <p style="color:#6b7280;font-size:12px;">Please disregard this email if payment has already been made.</p>
    <p>${a.orgName}</p>
  </div>
</body>
</html>`}}},86439:a=>{a.exports=require("next/dist/shared/lib/no-fallback-error.external")},91645:a=>{a.exports=require("net")},94735:a=>{a.exports=require("events")},96330:a=>{a.exports=require("@prisma/client")}};var b=require("../../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[5873,7903,5456,1964,7394,2876,2173],()=>b(b.s=27668));module.exports=c})();