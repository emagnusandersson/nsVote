"use strict"

/******************************************************************************
 * ReqBE
 ******************************************************************************/
//app.ReqBE=function(req, res){
  //this.req=req; this.res=res; this.site=req.site; this.pool=DB[this.site.db].pool; this.Str=[]; 
  //this.Out={GRet:{userInfoFrDBUpd:{}}, dataArr:[]}; this.GRet=this.Out.GRet; 
//}

app.ReqBE=function(objReqRes){
  Object.assign(this, objReqRes);
  this.site=this.req.site
  //this.Str=[];  this.Out={GRet:{userInfoFrDBUpd:{}}, dataArr:[]};  this.GRet=this.Out.GRet; 
  this.Str=[];  this.dataArr=[];  this.GRet={userInfoFrDBUpd:{}}; 
}

ReqBE.prototype.mes=function(str){ this.Str.push(str); }
ReqBE.prototype.mesO=function(str){
  if(str) this.Str.push(str);
  this.GRet.strMessageText=this.Str.join(', ');
  this.GRet.userInfoFrIP=this.req.sessionCache.userInfoFrIP;
  var objOut=copySome({}, this, ["dataArr", "GRet"]);
  this.res.end(serialize(objOut));
}
ReqBE.prototype.mesEO=function(errIn, statusCode=500){
  var GRet=this.GRet;
  var boString=typeof errIn=='string';
  var err=errIn; 
  if(boString) { this.Str.push('E: '+errIn); err=new MyError(errIn); } 
  else{  var tmp=err.syscal||''; this.Str.push(`E: ${tmp} ${err.code}`);  }
  console.log(err.stack);
  GRet.strMessageText=this.Str.join(', ');
  GRet.userInfoFrIP=this.req.sessionCache.userInfoFrIP; 

  //this.res.writeHead(500, {"Content-Type": MimeType.txt}); 
  var objOut=copySome({}, this, ["dataArr", "GRet"]);
  this.res.end(serialize(objOut));
}

ReqBE.prototype.go=async function(){
  var {req, res}=this, {site}=req;

  var boSecFetch='sec-fetch-site' in req.headers
  if(boSecFetch){
    var strT=req.headers['sec-fetch-site'];
    if(strT!='same-origin') { this.mesEO(Error(`sec-fetch-site header is not 'same-origin' (${strT})`));  return;}
    
    var strT=req.headers['sec-fetch-dest'];
    if(strT!='empty') { this.mesEO(Error(`sec-fetch-dest header is not 'empty' (${strT})`));  return;}
  
    var strT=req.headers['sec-fetch-user'];
    if(strT && strT=='?1') { this.mesEO(Error(`sec-fetch-user header equals '?1'`));  return;}
    
    var strT=req.headers['sec-fetch-mode'], boT=strT=='no-cors' || strT=='cors';
    if(!boT) { this.mesEO(Error(`sec-fetch-mode header is neither 'no-cors' or 'cors' (${strT})`));  return;}
  }

  if('x-requested-with' in req.headers){
    var str=req.headers['x-requested-with'];   if(str!=="XMLHttpRequest") { this.mesEO(Error("x-requested-with: "+str));  return; }
  } else {  this.mesEO(Error("x-requested-with not set"));  return;  }

  var keyR=req.sessionID+'_Main';
  var [err,val]=await getRedis(keyR,1);  if(err){ this.mesEO(err);  return; }   req.sessionCache=val;
  if(!req.sessionCache || typeof req.sessionCache!='object') { 
    //resetSessionMain.call(this);
    req.sessionCache={userInfoFrDB:extend({},specialistDefault),   userInfoFrIP:{}};
    var [err]=await setRedis(keyR, req.sessionCache, maxUnactivity); if(err){ this.mesEO(err);  return; }
  }
  
  if(site.typeApp=='ip'){
    req.sessionCache.userInfoFrIP={'IP':'openid','idIP':req.ipClient,'nameIP':'','nickIP':''};
  } 
  
  var [err]=await expireRedis(keyR, maxUnactivity); if(err){ this.mesEO(err);  return; }
 
 
  var jsonInput;
  if(req.method=='POST'){ 
    if('x-type' in req.headers ){ //&& req.headers['x-type']=='single'
      var form = new formidable.IncomingForm();
      form.multiples = true;  

      var [err, fields, files]=await new Promise(resolve=>{  form.parse(req, (...arg)=>resolve(arg));  });     if(err){ this.mesEO(err); return; } 
      
      this.File=files['fileToUpload[]'];
      if('kind' in fields) this.kind=fields.kind; else this.kind='s';
      if(!(this.File instanceof Array)) this.File=[this.File];
      jsonInput=fields.vec;
      
    }else{
      var [err,buf]=await new Promise(resolve=>{  var myConcat=concat(bT=>resolve([null,bT]));    req.pipe(myConcat);  });   if(err){ this.mesEO(err); return; }
      jsonInput=buf.toString();
    }
  }
  else{
    var tmp='send me a POST'; this.mesO(tmp);   return;
  }

  //res.setHeader("Content-type", MimeType.json);

  try{ var beArr=JSON.parse(jsonInput); }catch(e){ this.mesEO(e);  return; }
  
  //if(!req.boCookieStrictOK) {this.mesEO(new Error('Strict cookie not set'));  return;   }

    // Check that sessionIDStrict cookie exists and is valid.
  if(!('sessionIDStrict' in req.cookies)) {this.mesEO('no sessionIDStrict cookie'); return}
  var sessionIDStrict=req.cookies.sessionIDStrict;
  var [err, val]=await redis.myGetNExpire(sessionIDStrict+'_Strict', maxUnactivity).toNBP();
  if(!val) {this.mesEO('sessionIDStrict cookie not valid'); return}

    // Remove 'CSRFCode' and 'caller' form beArr
  var CSRFIn, caller='index';
  for(var i=beArr.length-1;i>=0;i--){ 
    var row=beArr[i];
    if(row[0]=='CSRFCode') {CSRFIn=row[1]; array_removeInd(beArr,i);}
    else if(row[0]=='caller') {caller=row[1]; array_removeInd(beArr,i);}
  }

  var len=beArr.length;
  var StrInFunc=Array(len); for(var i=0;i<len;i++){StrInFunc[i]=beArr[i][0];}
  var arrCSRF, arrNoCSRF, allowed, boCheckCSRF, boSetNewCSRF;
  if(caller=='index'){
      // Arrays of functions
    //arrCSRF=['VUpdate','VShow','VHide','VDelete']; 
    arrCSRF=['setChoise','UInsert','UUpdate','UDelete'];  // Functions that changes something must check and refresh CSRF-code
    arrNoCSRF=['specSetup','setUpCond','setUp', 'getList','getHist','logout'];
    allowed=arrCSRF.concat(arrNoCSRF);


      // Assign boCheckCSRF and boSetNewCSRF
    boCheckCSRF=0; boSetNewCSRF=0;   for(var i=0; i<beArr.length; i++){ var row=beArr[i]; if(in_array(row[0],arrCSRF)) {  boCheckCSRF=1; boSetNewCSRF=1;}  }    
    if(StrComp(StrInFunc,['specSetup'])){ boCheckCSRF=0; boSetNewCSRF=1; }
    if(StrComp(StrInFunc,['specSetup']) || StrComp(StrInFunc,['specSetup', 'setUp', 'setUpCond', 'getList', 'getHist']))
        { boCheckCSRF=0; boSetNewCSRF=1; }

  }

    // Check/set CSRF-code
  var keyR=req.sessionID+'_CSRFCode'+ucfirst(caller), CSRFCode;
  if(boCheckCSRF){
    // if(!CSRFIn){ this.mesO('CSRFCode not set (try reload page)'); return;}
    // var [err,CSRFStore]=await getRedis(keyR); if(err) {this.mesEO(err);  return; }
    // if(CSRFIn!==CSRFStore){ this.mesO('CSRFCode err (try reload page)'); return;}
  }
  if(boSetNewCSRF){
    var CSRFCode=randomHash();
    var [err]=await setRedis(keyR, CSRFCode, maxUnactivity); if(err){ this.mesEO(err);  return; }
    this.GRet.CSRFCode=CSRFCode;
  }

  var Func=[];
  for(var k=0; k<beArr.length; k++){
    var strFun=beArr[k][0];
    if(in_array(strFun,allowed)) {
      var inObj=beArr[k][1],     tmpf; if(strFun in this) tmpf=this[strFun]; else tmpf=global[strFun];
      if(typeof inObj=='undefined' || typeof inObj=='object') {} else {this.mesO('inObj should be of type object or undefined'); return;}
      var fT=[tmpf,inObj];   Func.push(fT);
    }
  }

  for(var k=0; k<Func.length; k++){
    var [func,inObj]=Func[k],   [err, result]=await func.call(this, inObj);
    if(res.finished) return;
    else if(err){
      if(typeof err=='object' && err.name=='ErrorClient') this.mesO(err); else this.mesEO(err);     return;
    }
    else this.dataArr.push(result);
  }
  this.mesO();
}


ReqBE.prototype.specSetup=async function(inObj){
  var {req}=this, {site}=req, Ou={};
  var Role=null; if(typeof inObj=='object' && 'Role' in inObj) Role=inObj.Role;
  if(site.typeApp=='ip'){
    req.sessionCache.userInfoFrIP={'IP':'openid','idIP':req.ipClient,'nameIP':'','nickIP':''};
  }
  var [err, boOK]=await checkIfUserInfoFrIP.call(this); if(err) return [err];
  if(!boOK) { return [null, [Ou]];} 
  var {IP,idIP}=req.sessionCache.userInfoFrIP;
  var [err, result]=await runIdIP.call(this, IP, idIP);
  extend(this.GRet.userInfoFrDBUpd,result);    extend(req.sessionCache.userInfoFrDB, result);


  var [err]=await setRedis(req.sessionID+'_Main', req.sessionCache, maxUnactivity); if(err) return [err];
  if(!checkIfAnySpecialist.call(this)){ // If the user once clicked login, but never saved anything then logout
    //clearSession.call(this);
    req.sessionCache={userInfoFrDB:extend({},specialistDefault),   userInfoFrIP:{}};
    var [err]=await setRedis(req.sessionID+'_Main', req.sessionCache, maxUnactivity); if(err) return [err];
    this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
  } 
  return [null, [Ou]];
}

ReqBE.prototype.logout=async function(inObj){
  var {req}=this;
  req.sessionCache={userInfoFrDB:extend({},specialistDefault),   userInfoFrIP:{}};
  var [err]=await setRedis(req.sessionID+'_Main', req.sessionCache, maxUnactivity); if(err) return [err];
  this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
  this.mes('Logged out'); return [null, [0]];
}

ReqBE.prototype.logout=async function (inObj){
  var {req}=this;
  //, {keyR_Main}=req;
  //req.sessionCache={userInfoFrDB:extend({},specialistDefault),   userInfoFrIP:{}};
  //var [err]=await setRedis(keyR_Main, req.sessionCache, maxUnactivity); if(err) return [err];
  req.sessionCache={}
  var [err,tmp]=await delRedis([req.sessionID+'_Main']); if(err) return [err]
  this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
  this.mes('Logged out'); return [null, [0]];
}

ReqBE.prototype.setUpCond=async function(inObj){
  var site=this.req.site, Prop=site.Prop;
  var Ou={};
  if(typeof inObj.Filt!='object') return [new ErrorClient('typeof inObj.Filt!="object"')]; 
  this.Filt=inObj.Filt;
  
  var arg={Prop, Filt:inObj.Filt};
  var tmp=setUpCond(arg);
  copySome(this,tmp,['Where']);
  return [null, [Ou]];
}

ReqBE.prototype.setUp=async function(inObj){  // Set up some properties etc.  (curTime).
  var {req}=this, {site}=req;
  var TableName=site.TableName;
  var {userTab, userSnapShotTab}=site.TableName;
  
  var Ou={},  Sql=[];
  Sql.push("SELECT UNIX_TIMESTAMP(now()) AS now;");

  var sql=Sql.join('\n'), Val=[];
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  this.GRet.curTime=results[0].now; 
  
  var tNowRewrite=null;  // null => mysql uses built in "now()"
  if(boUseSnapShot){
    var tNow=unixNow(); 
    var keyR=strAppName+'TSnapShot', [err,tSnapShot]=await getRedis(keyR, 1)||0; if(err) return [err];
    var boCopy=tNow>tSnapShot+ageMaxSnapShot;    // If too much time has elapsed then "copy".
    if(boCopy){
      console.log('Making snapshot...');
      var sql=`CALL copyTable('${userSnapShotTab}','${userTab}');`, Val=[ageMaxSnapShot];
      var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
      var tSnapShot=unixNow();
      var [err]=await setRedis(keyR, tSnapShot); if(err) return [err];
      console.log('Made snapshot');
    }
    tNowRewrite=tSnapShot;
  }
  else if(boUseLastWriteNow){   
    var keyR=strAppName+'TLastWrite', [err, tLastWrite]=await getRedis(keyR, 1)||0; if(err) return [err];
    if(!tLastWrite) {
      tLastWrite=unixNow();
      var [err]=await setRedis(keyR, tLastWrite); if(err) return [err];
    }
    tNowRewrite=tLastWrite;
  }
  //site.tNow=tNow;
  site.Prop.created.tNow=tNowRewrite;
  site.Prop.lastActivity.tNow=tNowRewrite;
    
  return [null, [Ou]];
}  


ReqBE.prototype.getList=async function(inObj){
  var {req}=this, {site}=req;
  var TableName=site.TableName;
  //var strSel=this.strSel;
  var Ou={};
  this.NVoter=[0,0];

  var {userTab}=site.TableName;
  if(boUseSnapShot){  userTab=TableName.userSnapShotTab; }

  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);
  var Val=[];
  var strCond=array_filter(this.Where).join(' AND '); if(strCond.length) strCond=' WHERE '+strCond;
  var sql=`SELECT SQL_CALC_FOUND_ROWS ${site.strSel} FROM ${userTab} u ${strCond} GROUP BY u.idUser ORDER BY lastActivity DESC LIMIT ${offset},${rowCount};`, Val=[];
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];

  //Ou.tab=arrObj2TabNStrCol(results);
  Ou.tab=[];
  for(var i=0;i<results.length;i++) {
    var row=results[i], len=site.KeySel.length;
    var rowN=Array(len); //for(var j=0;j<len;j++) { rowN[j]=row[j];}
    for(var j=0;j<len;j++){ var key=site.KeySel[j]; rowN[j]=row[key]; }
    //rowN[jMyVote]=[];
    Ou.tab.push(rowN);
  }  

  var sql="SELECT FOUND_ROWS() AS n;", Val=[]; // nFound
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var nFound=results[0].n;   this.Str.push("Found: "+nFound);

  var sql=`SELECT count(*) AS nTot FROM ${userTab};`, Val=[];
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  Ou.NVoter=[nFound, results[0].nTot];

  return [null, [Ou]];
}


ReqBE.prototype.getHist=async function(inObj){
  var {req}=this, {site}=req;
  var TableName=site.TableName;

  var Ou={};
  var {userTab}=TableName;
  if(boUseSnapShot){  userTab=TableName.userSnapShotTab; }

  //var strTableRef=`${userTab} u JOIN ${choiseTab} c ON u.idUser=c.idUser `; 
  var strTableRef=userTab+" u "; 
  
  var arg={strTableRef, WhereExtra:[]};  
  copySome(arg, site, ['Prop']);
  copySome(arg, this, ['myMySql', 'Filt', 'Where']);
  arg.strDBPrefix=req.siteName;
  var histCalc=new HistCalc(arg);
  var [err, Hist]=await histCalc.getHist(arg); if(err) return [err];
  Ou.Hist=Hist;
  return [null, [Ou]];
}


ReqBE.prototype.UUpdate=async function(inObj){ // writing needSession
  var {req}=this, {site}=req, Prop=site.Prop, {userTab}=site.TableName;
  var Ou={};
  var [err, boOK]=await checkIfUserInfoFrIP.call(this); if(err) return [err];
  if(!boOK) { return [new ErrorClient('No session')]; }

  //var tmp=req.sessionCache.userInfoFrIP, IP=tmp.IP, idIP=tmp.idIP, nameIP=tmp.nameIP, nickIP=tmp.nickIP;
  //var arrPersonal=[tmp.nameIP, tmp.nickIP, tmp.homeTown, tmp.state, tmp.gender, tmp.locale, tmp.timezone];
  //var userInfoFrIP=tmp;
  var userInfoFrIP=req.sessionCache.userInfoFrIP;
  var {IP, idIP, nameIP, nickIP, homeTown, state, gender, locale, timezone}=userInfoFrIP;
  var arrPersonal=[nameIP, nickIP, homeTown, state, gender, locale, timezone];


  var objVar=extend({},inObj);
  
  for(var name in objVar){
    var value=objVar[name];
    if(typeof value=='string') objVar[name]=myJSEscape(value);
  }
 

  var boChoiseSet=0; if('choise' in objVar)  boChoiseSet=1;


    // If "choise" is empty
  if(boChoiseSet && objVar.choise===null){
    var Sql=[];
    Sql.push(`DELETE FROM ${userTab} WHERE IP=? AND idIP=?;`);
    var Val=[IP, idIP];
    var sql=Sql.join('\n');
    var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
    var n=results.affectedRows, pluralS=n==1?'':'s';
    this.mes(`${n} user${pluralS} deleted`);
    return [null,[Ou]];
  }

  for(var name in objVar){    if(site.arrAllowed.indexOf(name)==-1) return [new ErrorClient ('Forbidden input')];    }

  //var arrK=[], arrVal=[];
  //var arrUpdQM=[], arrInsQM=[]; 
  //var StrTmp=Object.keys(objVar).concat(site.arrIPData);
  //for(var i=0;i<StrTmp.length;i++){
    //var name=StrTmp[i], value;
    //if(site.arrIPData.indexOf(name)!=-1) {value=userInfoFrIP[name];}
    //else if(site.arrAllowed.indexOf(name)!=-1) {
      //value=objVar[name];
    //}
    //else return [new ErrorClient ('Forbidden input')];
    //arrK.push(name);
    //if(typeof value!='number') {value=this.myMySql.pool.escape(value);  value=value.slice(1, -1); }
    //var QMark='?';
    //if('voterUpdF' in Prop[name]) { var tmp=Prop[name].voterUpdF.call(Prop,name,value);  QMark=tmp[0]; value=tmp[1]; }

    //arrVal.push(value);
    //arrUpdQM.push(`\`${name}\`=${QMark}`);
    //arrInsQM.push(QMark);
  //}

  //var strCol=arrK.join(', '); if(strCol.length) strCol=', '+strCol;
  //var strInsQ=arrInsQM.join(', '); if(strInsQ.length) strInsQ=', '+strInsQ;
  //var strUpdQ=arrUpdQM.join(', '); if(strUpdQ.length) strUpdQ=', '+strUpdQ;

  //var strAuthCol="IP,idIP", strAuthInsQ="?,?";

  //var sql=`INSERT INTO ${userTab} (${strAuthCol} ${strCol}, lastActivity, created) VALUES (${strAuthInsQ} ${strInsQ}, now(), now())
    //ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser)  ${strUpdQ}, lastActivity=now()`;  
  //var Val=[].concat([IP, idIP], arrVal, arrVal);
  

  var arrUpdQM=[], arrVal=[];
  var StrKey=Object.keys(objVar).concat(site.arrIPData);
  for(var i=0;i<StrKey.length;i++){
    var name=StrKey[i], value;
    if(site.arrIPData.indexOf(name)!=-1) {value=userInfoFrIP[name];}
    else{ value=objVar[name];}
    var QMark='?';
    if('voterUpdF' in Prop[name]) { var [QMark, value]=Prop[name].voterUpdF.call(Prop,name,value); }

    arrUpdQM.push(`\`${name}\`=${QMark}`);  arrVal.push(value);
  }

  var strUpdQ=arrUpdQM.join(', '); if(strUpdQ.length) strUpdQ=', '+strUpdQ;

  var sql=`INSERT INTO ${userTab} SET IP=?, idIP=?${strUpdQ}, lastActivity=now(), created=now()
    ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser)${strUpdQ}, lastActivity=now()`;  
  var Val=[].concat([IP, idIP], arrVal, arrVal);
  
  
  
  
  //console.log(sql); 
  var boUInsert;
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var c=results.affectedRows; boUInsert=c==1; 
  console.log('affectedRows: '+results.affectedRows);

  var [err]=await setRedis(strAppName+'TLastWrite', unixNow()); if(err) return [err];

    // How to detect whether there was an insert or update: Check affected rows (the result depends on whether auto_increment was set):    
    //                    insert   |   update
    // no auto_increment    1      |      2    (like "replace":  1 deleted + 1 inserted)
    //    auto_increment    1      |      0


  this.mes('Data updated'); return [null,[Ou]];
}


ReqBE.prototype.UDelete=async function(inObj){ // writing needSession
  var {req}=this, {site}=req, Prop=site.Prop, {userTab}=site.TableName;
  var Ou={};
  var [err, boOK]=await checkIfUserInfoFrIP.call(this); if(err) return [err];
  if(!boOK) { return [new ErrorClient('No session')]; }

  //var tmp=req.sessionCache.userInfoFrIP, IP=tmp.IP, idIP=tmp.idIP, nameIP=tmp.nameIP;
  var {IP, idIP, nameIP}=req.sessionCache.userInfoFrIP;

  var idUser=req.sessionCache.userInfoFrDB.voter.idUser; 

  var Sql=[];
  Sql.push(`DELETE FROM ${userTab} WHERE idUser=?;`);
  var Val=[idUser,idUser];
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];

  this.mes('deleted');
  
  var [err]=await setRedis(strAppName+'TLastWrite', unixNow()); if(err) return [err]; 

  //resetSessionMain.call(this);
  req.sessionCache={userInfoFrDB:extend({},specialistDefault),   userInfoFrIP:{}};
  var [err]=await setRedis(req.sessionID+'_Main', req.sessionCache, maxUnactivity); if(err) return [err];
  this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
  return [null, [Ou]];
}

ReqBE.prototype.getSetting=async function(inObj){ 
  var {req}=this, {site}=req;
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var Str=['boShowTeam'];
  if(!isAWithinB(inObj,Str)) {return [new ErrorClient('Illegal invariable')];}
  for(var i=0;i<inObj.length;i++){ var name=inObj[i]; Ou[name]=app[name]; }
  return [null, [Ou]];
}
ReqBE.prototype.setSetting=async function(inObj){ 
  var {req}=this, {site}=req; 
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var StrApp=[],  StrServ=[];
  if(req.sessionCache.userInfoFrDB.admin) StrApp=['boShowTeam'];  
  var Str=StrApp.concat(StrServ);
  var Key=Object.keys(inObj);
  if(!isAWithinB(Key, Str)) { return [new ErrorClient('Illegal invariable')];}
  for(var i=0;i<Key.length;i++){ var name=Key[i], tmp=Ou[name]=inObj[name]; if(StrApp.indexOf(name)!=-1) app[name]=tmp; else serv[name]=tmp; }
  return [null, [Ou]];
}








