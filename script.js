
global.app=global;
import http from "http";
import https from "https";
import url from "url";
import path from "path";
//import fs from "fs";
//import fsPromises from "fs/promises";
import fs, {promises as fsPromises} from "fs";
import mysql from 'mysql';
//import gmTmp from 'gm';
//app.gm=gmTmp.subClass({ imageMagick: true });
import concat from 'concat-stream';
import fetch from 'node-fetch';
//import through from 'through'
//import querystring from 'querystring';
import formidable from "formidable";
import myCrypto from 'crypto';
//import NodeRSA from 'node-rsa';
//import childProcess from 'child_process';
import zlib from 'zlib';
//import redis from "redis";
import Redis from "ioredis";
//import UglifyJS from "uglify-js";
import ip from 'ip';
//import Streamify from 'streamify-string';
import serialize from 'serialize-javascript';
import mime from "mime";
import minimist from 'minimist';
var argv=minimist(process.argv.slice(2));
import './lib.js';
extend(app, {http, url, path, fsPromises, mysql, concat, fetch, formidable, myCrypto, zlib, ip, serialize, mime});
import './libMath.js';
import './libServerGeneral.js';
import './libServer.js';
//import './store.js';

app.strAppName='nsVote';

app.strInfrastructure=process.env.strInfrastructure||'local';
app.boHeroku=strInfrastructure=='heroku'; 
app.boAF=strInfrastructure=='af'; 
app.boLocal=strInfrastructure=='local'; 
app.boDO=strInfrastructure=='do'; 

app.StrValidSqlCalls=['createTable', 'dropTable', 'createFunction', 'dropFunction', 'populateSetting', 'truncate', 'createDummies']; // , 'createDummy'
 
var helpTextExit=function(){
  var arr=[];
  arr.push('USAGE script [OPTION]...');
  arr.push('  -h, --help           Display this text');
  arr.push('  -p, --port [PORT]    Port number (default: 5000)');
  arr.push('  --sql [SQL_ACTION]   Run a sql action.');
  arr.push('    SQL_ACTION='+StrValidSqlCalls.join('|'));
  console.log(arr.join('\n'));
  process.exit(0);
}

var StrUnknown=AMinusB(Object.keys(argv),['_', 'h', 'help', 'p', 'port', 'sql']);
var StrUnknown=[].concat(StrUnknown, argv._);
if(StrUnknown.length){ console.log('Unknown arguments: '+StrUnknown.join(', ')); helpTextExit(); }

// var urlRedis=process.env.REDIS_URL;
// if(  urlRedis ) {
//   app.redisClient=redis.createClient(urlRedis, {no_ready_check: true}); //
// }else { app.redisClient=redis.createClient();}

var REDIS_URL="redis://localhost:6379"
app.redis = new Redis(REDIS_URL);

app.Plugin={};

//strCookieProp="; SameSite=Lax; HttpOnly";

  // Default config variables (If you want to change them you can for example create a file config.js and overwrite them there)
extend(app, {UriDB:{}, boDbg:0, boAllowSql:1, port:5000, levelMaintenance:0, googleSiteVerification:'googleXXX.html',
  wwwCommon:'',
  intDDOSMax:100, // intDDOSMax: How many requests before DDOSBlocking occurs. 
  tDDOSBan:5, // tDDOSBan: How long in seconds til the blocking is lifted
  intDDOSIPMax:200, // intDDOSIPMax: How many requests before DDOSBlocking occurs. 
  tDDOSIPBan:10, // tDDOSIPBan: How long in seconds til the blocking is lifted
  maxUnactivity:24*60*60,
  boUseSelfSignedCert:false,
  //wsIconDefaultProt:"/Site/Icon/iconRed<size>.png",
  wsIconDefaultProt:"/Site/Icon/icon<size>.png",
  timeOutDeleteStatusInfo:3600,
  RootDomain:{},
  Site:{},
  typeApp:'ip',
  boUseLastWriteNow:false,
  boUseSnapShot:false,
  ageMaxSnapShot:24*3600,
});

port=argv.p||argv.port||5000;
if(argv.h || argv.help) {helpTextExit(); }




var strConfig;
if(boHeroku){ 
  if(!process.env.jsConfig) { console.error('jsConfig-environment-variable is not set'); process.exit(-1);} //process.exit(1);
  strConfig=process.env.jsConfig||'';
}
else{
  var [err, buf]=await fsPromises.readFile('./config.js').toNBP();    if(err) {console.error(err); process.exit(-1);}
  strConfig=buf.toString();
} 
var strMd5Config=md5(strConfig);
eval(strConfig);
var keyR=`str${ucfirst(strAppName)}Md5Config`;
var [err,tmp]=await getRedis(keyR); if(err) {console.error(err); process.exit(-1);}
var boNewConfig=strMd5Config!==tmp; 
if(boNewConfig) { var [err,tmp]=await setRedis(keyR,strMd5Config);   if(err) {console.error(err); process.exit(-1);}      }



if('levelMaintenance' in process.env) levelMaintenance=process.env.levelMaintenance;


app.SiteName=Object.keys(Site);

await import('./filterServer.js'); 
await import('./variablesCommon.js');
await import('./libReqBE.js');
await import('./libReq.js'); 

app.DB={};
DBExtend(DB);

SiteExtend();

  // Do db-query if --sql XXXX was set in the argument
if(typeof argv.sql!='undefined'){
  if(typeof argv.sql!='string') {console.log('sql argument is not a string'); process.exit(-1); }
  var tTmp=new Date().getTime();
  var setupSql=new SetupSql();
  setupSql.myMySql=new MyMySql(DB.default.pool);
  var [err]=await setupSql.doQuery(argv.sql);
  setupSql.myMySql.fin();
  if(err) {  console.error(err);  process.exit(-1);}
  console.log(`Time elapsed: ${(new Date().getTime()-tTmp)/1000} s`); 
  process.exit(0);
}

app.tIndexMod=new Date(); tIndexMod.setMilliseconds(0);

//ETagUri={}; ´

var regexpLib=RegExp('^/(stylesheets|lib|Site|lang)/');
var regexpLooseJS=RegExp('^/(lib|libClient|client|clientProt|filter|siteSpecific)\\.js');
//regexpSepqrateQS=RegExp('^([^\\?]*)\\??');


app.CacheUri=new CacheUriT();
var StrFilePreCache=['filter.js', 'lib.js', 'libClient.js', 'client.js', 'stylesheets/style.css', 'lang/en.js'];
for(var i=0;i<StrFilePreCache.length;i++) {
  var [err]=await readFileToCache(StrFilePreCache[i]); if(err) {  console.error(err);  process.exit(-1);}
}
//createSiteSpecificClientJSAll();
var [err]=await createSiteSpecificClientJSAll(); if(err) {console.error(err); process.exit(-1);}


  // Write manifest to Cache
var [err]=await createManifestNStoreToCacheMult(SiteName); if(err) {console.error(err); process.exit(-1);} 

if(boDbg){
  fs.watch('.', makeWatchCB('.', ['client.js', 'libClient.js', 'filter.js']) );
  fs.watch('stylesheets', makeWatchCB('stylesheets', ['style.css']) );
}

// var StrCookiePropProt=["HttpOnly", "Path=/", "Max-Age="+3600*24*30];
// if(!boLocal || boUseSelfSignedCert) StrCookiePropProt.push("Secure");
// app.strCookiePropNormal=";"+StrCookiePropProt.concat("SameSite=None").join(';');
// app.strCookiePropLax=";"+StrCookiePropProt.concat("SameSite=Lax").join(';');
// app.strCookiePropStrict=";"+StrCookiePropProt.concat("SameSite=Strict").join(';'); 

// var luaDDosCounterFun=`local c=redis.call('INCR',KEYS[1]); redis.call('EXPIRE',KEYS[1], ARGV[1]); return c`
// redis.defineCommand("myDDosCounterFun", { numberOfKeys: 1, lua: luaDDosCounterFun });

// var luaGetNExpire=`local c=redis.call('GET',KEYS[1]); redis.call('EXPIRE',KEYS[1], ARGV[1]); return c`;
// //var luaGetNExpire=`local c=redis.call('GET',KEYS[1]); if(c) then redis.call('EXPIRE',KEYS[1], ARGV[1]); end; return c`;
// redis.defineCommand("myGetNExpire", { numberOfKeys: 1, lua: luaGetNExpire });



var tLoginTimeout=300;

const objCookiePropProt={"HttpOnly":1, Path:"/", "Max-Age":3600*24*30, "SameSite":"Lax"};
if(!boLocal || boUseSelfSignedCert) objCookiePropProt["Secure"]=1;
var oTmp=extend({},objCookiePropProt); 
oTmp["SameSite"]="None"; app.strCookiePropNormal=";"+arrayifyCookiePropObj(oTmp).join(';');
oTmp["SameSite"]="Lax"; app.strCookiePropLax=";"+arrayifyCookiePropObj(oTmp).join(';');
oTmp["SameSite"]="Strict"; app.strCookiePropStrict=";"+arrayifyCookiePropObj(oTmp).join(';');

var oTmp=extend({},objCookiePropProt); 
oTmp["Max-Age"]=tLoginTimeout; var str1=";"+arrayifyCookiePropObj(oTmp).join(';');
oTmp["Max-Age"]=0; var str0=";"+arrayifyCookiePropObj(oTmp).join(';');
app.StrSessionIDLoginProp=[str0,str1];



var luaDDosCounterFun=`local c=redis.call('INCR',KEYS[1]); redis.call('EXPIRE',KEYS[1], ARGV[1]); return c`
redis.defineCommand("myDDosCounterFun", { numberOfKeys: 1, lua: luaDDosCounterFun });

var luaGetNExpire=`local c=redis.call('GET',KEYS[1]); redis.call('EXPIRE',KEYS[1], ARGV[1]); return c`;
//var luaGetNExpire=`local c=redis.call('GET',KEYS[1]); if(c) then redis.call('EXPIRE',KEYS[1], ARGV[1]); end; return c`;
redis.defineCommand("myGetNExpire", { numberOfKeys: 1, lua: luaGetNExpire });


//handler=function(req, res){
const handler=async function(req, res){
  
    // If isRedirAppropriate
  if(typeof isRedirAppropriate!='undefined'){   var uTmp=isRedirAppropriate(req); if(uTmp){res.out301(uTmp); return;}   }
  

    // Setting some headers
  //res.setHeader("X-Frame-Options", "deny");  // Deny for all (note: this header is removed for images (see reqMediaImage) (should also be removed for videos))
  res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");  // Deny for all (note: this header is removed in certain requests)
  res.setHeader("X-Content-Type-Options", "nosniff");  // Don't try to guess the mime-type (I prefer the rendering of the page to fail if the mime-type is wrong)
  if(!boLocal || boUseSelfSignedCert) res.setHeader("Strict-Transport-Security", "max-age="+3600*24*365); // All future requests must be with https (forget this after a year)
  res.setHeader("Referrer-Policy", "origin");  //  Don't write the refer unless the request comes from the origin
  
  
    // Extract qs, objQS
  var objUrl=url.parse(req.url), qs=objUrl.query||'', objQS=parseQS2(qs);



    // Extract siteName, wwwSite
  var domainName=req.headers.host; 
  var pathNameOrg=objUrl.pathname;
  var wwwReq=domainName+pathNameOrg;

  var {siteName,wwwSite}=Site.getSite(wwwReq);  
  if(!siteName){ res.out404("404 Nothing at that url\n"); return; }
  var pathName=wwwReq.substr(wwwSite.length); if(pathName.length==0) pathName='/';
  var site=Site[siteName];
  
  if(boDbg) console.log(req.method+' '+pathName);
  
  if(boHeroku && site.boTLS && req.headers['x-forwarded-proto']!='https') {
    if(pathName=='/' && qs.length==0) { res.out301('https://'+wwwSite); return; }
    else { res.writeHead(400);  res.end('You must use https'); return; }
  }
  

  
  var cookies=req.cookies=parseCookies(req);




  // var boCookieNormalOK=false, boCookieLaxOK=false, boCookieStrictOK=false;
  
  //   // Check if a valid sessionID-cookie came in
  // var boSessionCookieInInput='sessionIDNormal' in cookies, sessionID=null, keyR_Cache;
  // if(boSessionCookieInInput) {
  //   sessionID=cookies.sessionIDNormal;  keyR_Cache=sessionID+'_Cache';
  //   var [err, tmp]=await existsRedis(keyR_Cache); if(err) {console.error(err); process.exit(1);} 
  //   boCookieNormalOK=tmp;
  // } 
  
  // if(boCookieNormalOK){
  //     // Check if Lax / Strict -cookies are OK
  //   boCookieLaxOK=('sessionIDLax' in cookies) && cookies.sessionIDLax===sessionID;
  //   boCookieStrictOK=('sessionIDStrict' in cookies) && cookies.sessionIDStrict===sessionID;
  //   var keyR_DDOS=sessionID+'_DDOS';
  // }else{
  //   sessionID=randomHash();  keyR_Cache=sessionID+'_Cache';
  //   var ipClient=getIP(req), keyR_DDOS=ipClient+'_DDOS';
  // }
  
  //   // Increase DDOS counter 
  // //var [err, intCount]=await cmdRedis('EVAL',[luaDDosCounterFun, 1, keyR_DDOS, tDDOSBan]); if(err) {console.error(err); process.exit(1);}
  // var [err, intCount]=await redis.myDDosCounterFun(keyR_DDOS, tDDOSBan).toNBP(); if(err) {console.error(err); process.exit(1);}
  
  
  // res.setHeader("Set-Cookie", ["sessionIDNormal="+sessionID+strCookiePropNormal, "sessionIDLax="+sessionID+strCookiePropLax, "sessionIDStrict="+sessionID+strCookiePropStrict]);
    
  //   // If the counter is to high, then respond with 429
  // if(intCount>intDDOSMax) {
  //   var strMess=`Too Many Requests (${intCount}), wait ${tDDOSBan}s\n`;
  //   if(pathName=='/'+leafBE){ var reqBE=new ReqBE({req, res}); reqBE.mesEO(strMess,429); }
  //   else res.outCode(429,strMess);
  //   return;
  // }
  
  //   // Refresh / create  keyR_Cache
  // if(boCookieNormalOK){
  //   //var [err, value]=await cmdRedis('EVAL',[luaGetNExpire, 1, keyR_Cache, maxUnactivity]); if(err) {console.error(err); process.exit(1);}
  //   var [err, value]=await redis.myGetNExpire(keyR_Cache, maxUnactivity).toNBP(); if(err) {console.error(err); process.exit(1);}
  //   req.sessionCache=JSON.parse(value);
  // } else { 
  //   var [err]=await setRedis(keyR_Cache,{}, maxUnactivity);   if(err) {console.error(err); process.exit(1);}
  //   req.sessionCache={};
  // }
  



    //
    // sessionIDDDos cookie
    //

    // Assign boCookieDDOSCameNExist
  let boCookieDDOSCameNExist=false;
  let {sessionIDDDos=null}=cookies, keyR_DDOS;
  if(sessionIDDDos) {
    keyR_DDOS=sessionIDDDos+'_DDOS';
    let [err, tmp]=await existsRedis(keyR_DDOS); boCookieDDOSCameNExist=tmp;
  }
    // If !boCookieDDOSCameNExist then create a new sessionIDDDos (and keyR_DDOS).
  if(!boCookieDDOSCameNExist) { sessionIDDDos=randomHash();  keyR_DDOS=sessionIDDDos+'_DDOS'; }
    // Update keyR_DDOS counter
  var [err, intCount]=await redis.myDDosCounterFun(keyR_DDOS, tDDOSBan).toNBP();
    // Write to response
  res.replaceCookie("sessionIDDDos="+sessionIDDDos+strCookiePropNormal);

    // Update keyR_DDOSIP counter
  let ipClient=getIP(req), keyR_DDOSIP=ipClient+'_DDOS';
  var [err, intCountIP]=await redis.myDDosCounterFun(keyR_DDOSIP, tDDOSIPBan).toNBP();
  
    // Determine which DDOS counter to use
  let [intCountT, intDDOSMaxT, tDDOSBanT]=boCookieDDOSCameNExist?[intCount, intDDOSMax, tDDOSBan]:[intCountIP, intDDOSIPMax, tDDOSIPBan]
  
    // If the counter is to high, then respond with 429
  if(intCountT>intDDOSMaxT) {
    let strMess=`Too Many Requests (${intCountT}), wait ${tDDOSBanT}s\n`;
    if(pathName=='/'+leafBE){ let reqBE=new ReqBE({req, res}); reqBE.mesEO(strMess, 429); }
    else res.outCode(429, strMess);
    return;
  }


    //
    // sessionID cookie
    //

    // Check if a valid sessionID-cookie came in
  req.boGotSessionCookie=false;
  var boSessionCookieInInput='sessionID' in cookies, sessionID=null, keyR_Main;
  if(boSessionCookieInInput) {
    sessionID=cookies.sessionID;  keyR_Main=sessionID+'_Main';
    var [err, tmp]=await existsRedis(keyR_Main); req.boGotSessionCookie=tmp;
  } 
  
  if(!req.boGotSessionCookie){ sessionID=randomHash();  keyR_Main=sessionID+'_Main'; }
  
  res.replaceCookie("sessionID="+sessionID+strCookiePropLax);
  
      // Refresh / create  keyR_Main
  if(req.boGotSessionCookie){
    //var [err, value]=await cmdRedis('EVAL',[luaGetNExpire, 1, keyR_Main, maxUnactivity]); req.sessionCache=JSON.parse(value)
    var [err, value]=await redis.myGetNExpire(keyR_Main, maxUnactivity).toNBP(); req.sessionCache=JSON.parse(value);
  
  } else { 
    await setRedis(keyR_Main, {}, maxUnactivity); 
    req.sessionCache={};
  }



    // Set mimetype if the extention is recognized
  var regexpExt=RegExp('\.([a-zA-Z0-9]+)$');
  var Match=pathName.match(regexpExt), strExt; if(Match) strExt=Match[1];
  if(strExt in MimeType) res.setHeader('Content-type', MimeType[strExt]);


  var strScheme='http'+(site.boTLS?'s':''),   strSchemeLong=strScheme+'://';
  var uSite=strSchemeLong+wwwSite;

  extend(req, {site, sessionID, qs, objQS, boTLS:site.boTLS, strSchemeLong, wwwSite, uSite, pathName, siteName, ipClient, rootDomain:RootDomain[site.strRootDomain]}); //boCookieStrictOK
  
  var objReqRes={req, res};
  objReqRes.myMySql=new MyMySql(DB[site.db].pool);
  if(levelMaintenance){res.outCode(503, "Down for maintenance, try again in a little while."); return;}
  if(pathName=='/'){  await reqIndex.call(objReqRes);     }
  //else if(pathName=='/'+leafAssign){    var reqAssign=new ReqAssign(req, res);    reqAssign.go();    }
  else if(pathName=='/'+leafBE){        var reqBE=new ReqBE(objReqRes);  await reqBE.go();    }
  else if(regexpLib.test(pathName) || regexpLooseJS.test(pathName) || pathName=='/conversion.html' || pathName=='/'+leafManifest){
    if(pathName=='/conversion.html') res.removeHeader("Content-Security-Policy");
    await reqStatic.call(objReqRes);
  }
  else if(pathName=='/'+leafLogin){   await reqLogin.call(objReqRes);  }
  else if(pathName=='/'+leafLoginBack){    var reqLoginBack=new ReqLoginBack(objReqRes);  await reqLoginBack.go();    }
  //else if(pathName=='/monitor.html'){        var reqMonitor=new ReqMonitor(req, res);      await reqMonitor.go();     }
  else if(pathName=='/'+leafDataDelete){  await reqDataDelete.call(objReqRes);  }
  else if(pathName=='/'+leafDataDeleteStatus){  await reqDataDeleteStatus.call(objReqRes);  }
  //else if(pathName=='/'+leafDeAuthorize){  await reqDeAuthorize.call(objReqRes);  }
  else if(pathName=='/monitor.html'){     await reqMonitor.call(objReqRes);     }
  else if(pathName=='/createDumpCommand'){  var str=createDumpCommand(); res.out200(str);     }
  else if(pathName=='/debug'){    debugger  }
  else if(pathName=='/'+googleSiteVerification) res.end('google-site-verification: '+googleSiteVerification);
  else {res.out404("404 Not Found\n"); return; }
  //else {res.writeHead(301, {'Location': '/'}); res.end(); }
  objReqRes.myMySql.fin();
  

}
port=parseInt(port, 10);

if(boUseSelfSignedCert){
  const options = { key: fs.readFileSync('0SelfSignedCert/server.key'), cert: fs.readFileSync('0SelfSignedCert/server.cert') };
  https.createServer(options, handler).listen(port);   console.log("Listening to HTTPS requests at port " + port);
} else{
  http.createServer(handler).listen(port);   console.log("Listening to HTTP requests at port " + port);
}
//http.createServer(handler).listen(parseInt(port, 10));  console.log("Listening to port " + port);


