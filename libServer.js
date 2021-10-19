
"use strict"

// At lat=0 (y=128), a world coordinate unit will be p2m meters
// At lat=arccos(0.5), (lat=+-60 or y=128+-53.66), a world coordinate unit will be p2m/2 meters
// At lat=arccos(0.25), (lat=+-75.52 or y=128+-84.08), a world coordinate unit will be p2m/4 meters
app.roundXY=function(resM,x,y){
  var resT=resM;
  if(Math.abs(y-128)>53.66) resT=Math.round(resT/2);
  if(Math.abs(y-128)>84.08) resT=Math.round(resT/2);
  if(resT<1)resT=1;
  var resP=resT*m2p;
  var xA=Math.round(x/resP)*resP,  yA=Math.round(y/resP)*resP;  return [xA,yA];
}


app.runIdIP=async function(IP, idIP, StrRole=['voter','admin']){ //check  idIP against the user-table and return diverse data

  var siteName=this.req.siteName, site=this.site; 
  var TableName=site.TableName, {userTab, adminTab}=TableName;
  var Prop=site.Prop;
  IP=this.myMySql.pool.escape(IP);  idIP=this.myMySql.pool.escape(idIP);
  var Sql=[],Fin=[];

  
  //var StrRole, callback, StrRoleAll=['voter','admin'];
  //if(arguments.length==4){StrRole=arguments[2]; callback=arguments[3];}
  //else if(arguments.length==3) {StrRole=StrRoleAll; callback=arguments[2];}
  //StrRole=StrRole||StrRoleAll;   if(typeof StrRole=='string') StrRole=[StrRole];


  //var StrRole, StrRoleAll=['voter','admin'];
  //if(arguments.length==5){StrRole=arguments[2]; }
  //else if(arguments.length==4) {StrRole=StrRoleAll; }
  //StrRole=StrRole||StrRoleAll;
  if(typeof StrRole=='string') StrRole=[StrRole];


  var makeRoleAFunc=function(role){ return function(results){ 
    var c=results.length;  
    userInfoFrDBUpd[role]=c==1?results[0]:0; if(c>1){ console.log("count>1 ("+c+")"); } 
  }}
  var userInfoFrDBUpd={};

  if(StrRole.indexOf('voter')!=-1){
        // Create an array from KeyProp/colsDBMask
    var  arrCol=[]; //, arrName=[];
    for(var i=0;i<site.nProp;i++) {
      var name=site.KeyProp[i], b=Prop[name].b;
      if(Number(b[bFlip.DBSelOne]))  {   
        //arrName.push(name);
        var tmp;
        //if(name in SelOneF){tmp=SelOneF[name](name)+" AS "+name;}
        if('selOneF' in Prop[name]){tmp=Prop[name].selOneF(name)+" AS `"+name+"`";}
        else tmp="`"+name+"`";
        arrCol.push(tmp);
      }
    }
    var tmp=arrCol.join(', ');
    Sql.push("SELECT "+tmp+" FROM "+userTab+" u WHERE IP="+IP+" AND idIP="+idIP+";");
    //Sql.push("SELECT choise FROM ("+userTab+" u JOIN "+choiseTab+" c ON u.idUser=c.idUser) WHERE IP="+IP+" AND idIP="+idIP+";");
    Fin.push(makeRoleAFunc('voter'));
    //Fin.push(function(results){  if(typeof userInfoFrDBUpd.voter=='object') userInfoFrDBUpd.voter.choise=results[0].choise;  });
    //Fin.push(function(results){
      //if(typeof userInfoFrDBUpd.voter!='object') return;
      //userInfoFrDBUpd.voter.choise=Array(results.length);
      //for(var i=0;i<results.length;i++) userInfoFrDBUpd.voter.choise[i]=results[i].choise;
    //});
  }
  
  if(StrRole.indexOf('admin')!=-1){
    Sql.push("SELECT * FROM "+adminTab+" a JOIN "+userTab+" u ON a.idUser=u.idUser WHERE IP="+IP+" AND idIP="+idIP+";");
    Fin.push(makeRoleAFunc('admin'));
  }

  var sql=Sql.join('\n'), Val=[];
  
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err]; 
  if(Sql.length<2) results=[results];
  for(var i=0;i<results.length;i++){ Fin[i](results[i]);}
  return [null, userInfoFrDBUpd];
}


app.checkIfUserInfoFrIP=async function(){
  var boExist=false;
  if('userInfoFrIP' in this.sessionCache && typeof this.sessionCache.userInfoFrIP=='object'){
    //var StrMustHave=['IP', 'idIP', 'nameIP', 'nickIP', 'image', 'homeTown', 'state']; boExist=true; 
    var StrMustHave=['IP', 'idIP', 'nameIP', 'nickIP', 'homeTown', 'state', 'locale', 'timezone', 'gender'];
    //var StrMustHave=['IP', 'idIP', 'nameIP', 'nickIP', 'homeTown', 'state']; // , 'locale', 'timezone'
    boExist=true; 
    for(var i=0;i<StrMustHave.length;i++){
      if(!(StrMustHave[i] in this.sessionCache.userInfoFrIP)) {boExist=false; break;}
    }
  }
  if(!boExist) {
    //resetSessionMain.call(this); 
    this.sessionCache={userInfoFrDB:extend({},specialistDefault),   userInfoFrIP:{}};
    var [err]=await setRedis(this.req.sessionID+'_Cache', this.sessionCache, maxUnactivity); if(err) return [err];
  }
  return [null,boExist];
  
}
//clearSession=function(){
  ////resetSessionMain.call(this);
  //this.sessionCache={userInfoFrDB:extend({},specialistDefault),   userInfoFrIP:{}};
  //var [err]=await setRedis(req.sessionID+'_Cache', this.sessionCache, maxUnactivity); if(err) return [err];
  //this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
//}
app.checkIfAnySpecialist=function(){
  var tmpEx=this.sessionCache.userInfoFrDB
  return Boolean(tmpEx.voter || tmpEx.admin);
}



app.createSiteSpecificClientJSAll=async function() {
  for(var i=0;i<SiteName.length;i++){
    var siteName=SiteName[i];
    var buf=createSiteSpecificClientJS(siteName);
    var keyCache=siteName+'/'+leafSiteSpecific;
    var [err]=await CacheUri.set(keyCache, buf, 'js', true, true); if(err) return [err];

    var buf=createManifest(siteName);
    var keyCache=siteName+'/'+leafManifest;
    var [err]=await CacheUri.set(keyCache, buf, 'json', true, true); if(err) return [err];
  }
  return [null];
}

var createSiteSpecificClientJS=function(siteName) {
  var site=Site[siteName], wwwSite=site.wwwSite;

  //var StrSkip=['KeyProp', 'nProp', 'KeyPropFlip', 'StrOrderDB', 'TableName', 'ViewName', 'arrAllowed',  'boGotNewVoters', 'timerNUserLast', 'nVis', 'nUser', 'db', 'googleAnalyticsTrackingID','serv'];
  //var siteSkip={}; for(var i=0;i<StrSkip.length;i++){ var name=StrSkip[i]; siteSkip[name]=site[name]; delete site[name];}
  
  
  var StrSkip=['KeyProp', 'nProp', 'KeyPropFlip', 'StrOrderDB', 'TableName', 'ViewName', 'arrAllowed',  'boGotNewVoters', 'timerNUserLast', 'nVis', 'nUser', 'db', 'googleAnalyticsTrackingID','serv'];
  var Key=Object.keys(site), siteSimplified={};
  for(var i=0;i<Key.length;i++){ var name=Key[i]; if(StrSkip.indexOf(name)==-1) siteSimplified[name]=site[name]; }

  var Str=[];
  Str.push("globalThis.assignSiteSpecific=function(){");

  var StrVar=['boDbg', 'version', 'intMax', 'leafLogin', 'leafBE', 'leafUploadFront', 'flImageFolder', 'maxGroupsInFeat', 'specialistDefault', 'wwwCommon', 'siteName', 'enumIP', 'bFlip', 'maxVotesDispInCol', 'maxVoterDisp' ]
  var objOut=copySome({},app,StrVar);
  //copySome(objOut,site,['wwwSite']);
  objOut.site=siteSimplified;

  Str.push(`var tmp=`+JSON.stringify(objOut)+`;\n Object.assign(window, tmp);`);

  Str.push("}");


  //for(var i=0;i<StrSkip.length;i++){ var name=StrSkip[i]; site[name]=siteSkip[name]; }

  var str=Str.join('\n');
  return str;
}


app.createManifest=function(siteName){
  var site=Site[siteName], {wwwSite, icons}=site;
  var uSite="https://"+wwwSite;
  let objOut={theme_color:"#ff0", background_color:"#fff", display:"minimal-ui", prefer_related_applications:false, short_name:siteName, name:siteName, start_url: uSite, icons }

  //let str=serialize(objOut);
  let str=JSON.stringify(objOut);
  return str;
}

app.createManifestNStoreToCache=async function(siteName){
  var strT=createManifest(siteName);
  var buf=Buffer.from(strT, 'utf8');
  var [err]=await CacheUri.set(siteName+'/'+leafManifest, buf, 'json', true, false);   if(err) return [err];
  return [null];
}
app.createManifestNStoreToCacheMult=async function(SiteName){
  for(var i=0;i<SiteName.length;i++){
    var [err]=await createManifestNStoreToCache(SiteName[i]);   if(err) return [err];
  }
  return [null];
}



