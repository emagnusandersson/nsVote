



//name='prog';                         if(!isset(name)){   if((tmp=getenv(name))!==false) name=tmp; else name='meet';   }


app.two31=Math.pow(2,31);  app.intMax=two31-1;  app.intMin=-two31;
app.sPerDay=24*3600;  app.sPerMonth=sPerDay*30;


var fsWebRootFolder=process.cwd();
var flLibFolder='lib';
var flFoundOnTheInternetFolder=flLibFolder+"/foundOnTheInternet";

app.flImageFolder=flLibFolder+"/image";  

  // Files: 
extend(app,{
leafBE:'be.json',
leafLogin:"login.html",  
leafLoginBack:"loginBack.html",  
leafUploadFront:"upload.html", 
leafSiteSpecific:'siteSpecific.js',
leafPayNotify:"payNotify.js",
leafManifest:'manifest.json',
leafDataDelete:'dataDelete',
leafDataDeleteStatus:'dataDeleteStatus',
leafDeAuthorize:'deAuthorize',
})



extend(app,{
boAppIP:typeApp=='ip', // Some handy variables
boAppFB:typeApp=='fb',
boAppOI:typeApp=='oi',
boAppGoogle:typeApp=='google',

maxUnactivity:3600*24,
specialistDefault:{voter:0,admin:0},

maxGroupsInFeat:20,
preDefault:"u.",
version:'002',
auto_increment_increment:1,

maxVoterDisp:10,
maxVotesDispInCol:2,
enumIP:['openid', 'fb', 'google'],

enumGender:['male','female'],

arrOptionDefault:['yes','no'],

})





   // DB- tables
var StrTableKey=["setting","admin","user","userSnapShot"]; //,"choise","choiseSnapShot"
var StrViewsKey=[]; 
app.TableNameProt={};for(var i=0;i<StrTableKey.length;i++) TableNameProt[StrTableKey[i]]='';
app.ViewNameProt={};for(var i=0;i<StrViewsKey.length;i++) ViewNameProt[StrViewsKey[i]]='';






app.selEnumF=name=>name+"-1";
app.selTimeF=name=>"UNIX_TIMESTAMP("+name+")";
app.updEnumBoundF=function(name,v){ v=bound( v, 0, this[name].Enum.length-1)+1;   return ['?', v];  };
app.updTimeF=(name,v)=>['FROM_UNIXTIME(?)', v];



       //     0       1         2        3       4       5       6       7         8             9   
app.bName=['IPData','input','DBSelOne','DBSel','block','label','help','userTab','notNull', 'userTabIndex'];    // 'block' and 'label' concerns voterInfoDiv,
app.bFlip=array_flip(bName);





/***********************************************************************************
 * CreatorPlugin
 ***********************************************************************************/

Plugin.general=function(){
  var Prop=this.Prop;
  
  var arrTCreatedLabel=[0, 1, 2, 4, 6, 9, 12, 18, 24, 36, 48], arrTCreatedMin=[].concat(eMultSc(arrTCreatedLabel,sPerMonth)); arrTCreatedLabel.splice(-1,1, '≥48');
  var arrTLastActivityLabel=[0, 1, 2, 4, 8, 15, 30, 60, 180, 365], arrTLastActivity=[].concat(eMultSc(arrTLastActivityLabel,3600)); arrTLastActivityLabel.splice(-1,1, '≥365');
  
  //                         0123456789
  var tmp={
  idUser:                {b:'0011000110',type:'int(4)',other:'auto_increment'},
  IP:                    {b:'0011011110',type:"ENUM"},  // IP and idIP are _not_ IPData because they are keys and are allways required. (In for example "INSERT ... ON DUPLICATE KEY UPDATE")
  idIP:                  {b:'0011011110',type:'VARCHAR(128)'},
  lastActivity:          {b:'0011111101',type:'TIMESTAMP',default:'0'},
  created:               {b:'0011111101',type:'TIMESTAMP',default:'0'},
  choise:                {b:'0111110111',type:'int(4)'}
  };//                       0123456789
  extend(Prop,tmp);
  this.StrOrderDB=Object.keys(tmp);
  //StrOrderDB=['index', 'idUser', 'IP', 'idIP', 'boShow', 'created', 'posTime', 'histActive', 'tLastWriteOfTA', 'timeAccumulated', 'hideTimer', 'terminationDate', 'displayName', 'tel', 'link', 'homeTown', 'currency', 'lastPriceChange', 'x', 'y', 'nMonthsStartOffer', 'nPayment', 'imTag', 'imTagTeam', 'idTeam', 'idTeamWanted', 'boImgOwn', 'linkTeam', 'nReport', 'coordinatePrecisionM', 'dist', 'image']

  Prop.choise.feat={kind:'BF',boUseInd:1,bucket:this.Option||arrOptionDefault};
  Prop.created.feat={kind:'S11',min:arrTCreatedMin, bucketLabel:arrTCreatedLabel};
  Prop.lastActivity.feat={kind:'S11',min:arrTLastActivity, bucketLabel:arrTLastActivityLabel};

  //Prop.choise.pre='c.';

  Prop.IP.Enum=['openid', 'fb','google'];
  Prop.choise.Enum=this.Option||arrOptionDefault;
  
  Prop.choise.condBValueF=function(name, val){  return val;}; 
  Prop.choise.binKeyF=name=>"choise";
  Prop.choise.binValueF=name=>"SUM(choise IS NOT NULL)";

  //var tmpf=function(name, val){ return "UNIX_TIMESTAMP("+name+")<=UNIX_TIMESTAMP(now())-"+val; };
  var tmpf=function(name,val){ var t=this.tNow; t=t!==null?t:"UNIX_TIMESTAMP(now())";   return "UNIX_TIMESTAMP("+name+")<="+t+"-"+val;  };
  Prop.created.cond0F=tmpf;
  Prop.lastActivity.cond0F=tmpf;
   
  //var tmpf=function(name, val){ return "UNIX_TIMESTAMP("+name+")>UNIX_TIMESTAMP(now())-"+val; };
  var tmpf=function(name,val){ var t=this.tNow; t=t!==null?t:"UNIX_TIMESTAMP(now())";   return "UNIX_TIMESTAMP("+name+")>"+t+"-"+val;  };
  Prop.created.cond1F=tmpf;
  Prop.lastActivity.cond1F=tmpf;

  Prop.created.selOneF=selTimeF;  //function(){ return "UNIX_TIMESTAMP(u.created)";};  
  Prop.lastActivity.selOneF=selTimeF;
  Prop.idUser.selOneF=function(){ return "(@idUser:=u.idUser)";};  
  Prop.IP.selOneF=selEnumF;

  Prop.created.selF=selTimeF;  //function(){ return "UNIX_TIMESTAMP(u.created)";};
  Prop.lastActivity.selF=selTimeF;
  Prop.IP.selF=selEnumF;

  //var tmpf=name=>"UNIX_TIMESTAMP(now())-UNIX_TIMESTAMP(u."+name+")";
  var tmpf=function(name){ var t=this.tNow; t=t!==null?t:"UNIX_TIMESTAMP(now())";   return t+"-UNIX_TIMESTAMP(u."+name+")";  };
  Prop.created.histCondF=tmpf;
  Prop.lastActivity.histCondF=tmpf;
  
  Prop.IP.voterUpdF=updEnumBoundF;
  Prop.created.voterUpdF=updTimeF;  
  Prop.lastActivity.voterUpdF=updTimeF;


  //this.StrOrderFilt=array_mergeM(['homeTown','idTeam','currency','posTime'],this.StrPropRep);
  this.StrOrderFilt=['choise','lastActivity','created'];
}



 
Plugin.appIP=function(){
  var Prop=this.Prop;
  
  var tmp={
    nameIP:         {b:'1011000110',type:'VARCHAR(1)'},
    nickIP:         {b:'1011000110',type:'VARCHAR(1)'}
  };//                  0123456789

  extend(Prop,tmp);
  this.StrOrderDB.push('nameIP','nickIP');

}
Plugin.appOI=function(){
  var Prop=this.Prop;
  
  var tmp={
    nameIP:         {b:'1011000110',type:'VARCHAR(64)'},
    nickIP:         {b:'1011000110',type:'VARCHAR(64)'}
  };//                  0123456789

  extend(Prop,tmp);
  this.StrOrderDB.push('nameIP','nickIP');

}


Plugin.appFB=function(){
  var Prop=this.Prop;
  
  var tmp={
  nameIP:              {b:'1011000110',type:'VARCHAR(64)'},
  nickIP:              {b:'1011000110',type:'VARCHAR(64)'},
  homeTown:            {b:'1011010111',type:'VARCHAR(20)'},
  state:               {b:'1011010111',type:'VARCHAR(20)'},
  locale:              {b:'1011010111',type:'VARCHAR(5)'},
  timezone:            {b:'1011010110',type:'VARCHAR(16)',default:'0000'}, // FLOAT  DECIMAL(3,1) 
  gender:              {b:'1011010110',type:'ENUM'},
  image:               {b:'0000000000'}
  };//                     0123456789
  var tmpEnum=['male', 'female'];
  tmp.gender.Enum=tmpEnum;
  tmp.gender.feat={kind:'BF',bucket:tmpEnum};
  extend(Prop,tmp);
  
  Prop.homeTown.feat={kind:'B'};
  Prop.state.feat={kind:'B'};
  Prop.locale.feat={kind:'B'};
  Prop.timezone.feat={kind:'B'};
  Prop.gender.feat={kind:'BF',bucket:enumGender};
    
  array_mergeM(this.StrOrderDB,Object.keys(tmp));
  array_mergeM(this.StrOrderFilt,['homeTown','state','locale','timezone','gender']);
}



Plugin.appGoogle=function(){
  var Prop=this.Prop;
  
  var tmp={
    nameIP:         {b:'1011000110',type:'VARCHAR(64)'},
    nickIP:         {b:'1011000110',type:'VARCHAR(64)'}
  }//                   0123456789
  extend(Prop,tmp);
  array_mergeM(this.StrOrderDB,Object.keys(tmp));
}



var featCalcValExtend=function(Prop){
  for(var name in Prop){
    var prop=Prop[name];
    if(!('feat' in prop)) continue;
    var feat=prop.feat, boBucket='bucket' in feat, boMin='min' in feat;
    if(boBucket||boMin){  // set n (=length) (if applicable)
      var len=boBucket?feat.bucket.length:feat.min.length;
      Prop[name].feat.n=len;  Prop[name].feat.last=len-1;
    }
  
    if(feat.kind[0]=='S'){
      if(!('max' in feat)){
            // Create feat.max;  maxClosed
        feat.max=[]; var maxClosed=[];
        var jlast=feat.last;    
        for(var j=0;j<jlast;j++){ 
          var tmp=feat.min[j+1]; feat.max[j]=tmp; maxClosed[j]=tmp-1;
        }
        feat.max[jlast]=intMax; maxClosed[jlast]=intMax;
      }

      if(!('bucketLabel' in feat)){ // (labels in histogram)
        feat.bucketLabel=[].concat(feat.min);
        feat.bucketLabel[feat.last]='≥'+feat.bucketLabel[feat.last];
      }

      Prop[name].feat=feat;
    }
  }
}



/***************************************************************************
 * SiteExtend
 ***************************************************************************/

var siteCalcValExtend=function(site,siteName){ // Adding stuff that can be calculated from the other properties
  var Prop=site.Prop;
  site.KeyProp=Object.keys(Prop);   site.nProp=site.KeyProp.length;   site.KeyPropFlip=array_flip(site.KeyProp);
  site.KeySel=filterPropKeyByB(Prop,bFlip.DBSel);


  featCalcValExtend(Prop); 
  
  site.TableName={};   for(var name in TableNameProt){  site.TableName[name+"Tab"]=siteName+'_'+name; }
  site.ViewName={}; for(var name in ViewNameProt){  site.ViewName[name+"View"]=siteName+'_'+name; }

  var arrAllowed=[];for(var name in Prop ){ var arr=Prop[name]; if(Number(arr.b[bFlip.input])) arrAllowed.push(name);} site.arrAllowed=arrAllowed;
  var arrIPData=[];for(var name in Prop ){ var arr=Prop[name]; if(Number(arr.b[bFlip.IPData])) arrIPData.push(name);} site.arrIPData=arrIPData;
  extend(site, {boGotNewVoters:0, timerNUserLast:0, nVis:0, nUser:0}); 
  //site.db=siteName in DB?siteName:'default';
  //var db=siteName in DB?DB[siteName]:DB.default;  site.pool=db.pool;
  
  var KeySel=site.KeySel;
  var arrCol=[];
  for(var j=0;j<KeySel.length;j++) {
    var key=KeySel[j], b=Prop[key].b, pre=Prop[key].pre||preDefault;
    var tmp; if('selF' in Prop[key]) { tmp=Prop[key].selF(pre+key);  }   else tmp=pre+"`"+key+"`";
    arrCol.push(tmp+" AS "+"`"+key+"`");
  }
  site.strSel=arrCol.join(', ');
  

}



var StrPlugInAll=Object.keys(Plugin);

var objStrPlugIn={
  oi:['general','appOI'],
  fb:['general','appFB'],
  google:['general','appGoogle'],
  ip:['general']
}


var IntSizeIcon=[16, 114, 192, 200, 512, 1024];
app.IntSizeIconFlip=array_flip(IntSizeIcon);
app.SiteExtend=function(){
  for(var i=0;i<SiteName.length;i++){
    var siteName=SiteName[i], StrPlugIn=[];
    var tmp={siteName, Prop:{}};
    var site=extend(Site[siteName],tmp);
    var StrPlugIn=objStrPlugIn[site.typeApp];

    console.log(siteName+': '+StrPlugIn.join(', '));
    for(var j=0;j<StrPlugIn.length;j++){
      var nameT=StrPlugIn[j];  Plugin[nameT].call(site);

    }
    siteCalcValExtend(site,siteName);
    site.StrPlugIn=StrPlugIn;

    if('regSite' in site) {
      site.regexp=RegExp(site.regSite);
      site.testWWW=function(wwwReq){
        var Match=this.regexp.exec(wwwReq);
        if(Match)  return Match[0];  else return false;
      };
    } else {
      site.testWWW=function(wwwReq){
        if(wwwReq.indexOf(this.wwwSite)==0) return this.wwwSite; else return false;
      };
    }

    site.SrcIcon=Array(IntSizeIcon.length);
    site.icons=Array(IntSizeIcon.length);
    var strType='png', wsIconProt=site.wsIconProt || wsIconDefaultProt;
  
    IntSizeIcon.forEach((size, ind)=>{
      site.SrcIcon[ind]=wsIconProt.replace("<size>", size);
      site.icons[ind]={ src:site.SrcIcon[ind], type: mime.getType(strType), sizes: size+"x"+size, purpose: "any maskable" };
    });


  }

  //Site.getSite=function(wwwReq){
    //for(var i=0;i<SiteName.length;i++){
      //var siteName=SiteName[i];   var tmp; if(tmp=Site[siteName].testWWW(wwwReq)) {return {siteName, wwwSite:tmp};  }
    //}
    //return false;
  //}
  Site.getSite=function(wwwReq){
    for(var i=0;i<SiteName.length;i++){
      var siteName=SiteName[i];   var tmp; if(tmp=Site[siteName].testWWW(wwwReq)) {return {siteName, wwwSite:tmp};  }
    }
    return {siteName:null};
  }
}


for(var i=0;i<SiteName.length;i++){
  var siteName=SiteName[i], site=Site[siteName];
  var strRootDomain=site.strRootDomain, rootDomain=RootDomain[strRootDomain];
  if(!rootDomain.wwwLoginBack) rootDomain.wwwLoginBack=site.wwwSite+"/"+leafLoginBack;
}

var nDBConnectionLimit=10, nDBQueueLimit=100, nDBRetry=14;


app.DBExtend=function(DB){
  var StrDB=Object.keys(UriDB);
  for(var i=0;i<StrDB.length;i++){
    var name=StrDB[i], uriDB=UriDB[name];
    var uriObj=url.parse(uriDB);

    var StrMatch=RegExp('^(.*):(.*)$').exec(uriObj.auth);
    var nameDB=uriObj.pathname.substr(1);
    DB[name]={nameDB};
    var pool  = mysql.createPool({
      connectionLimit : nDBConnectionLimit,
      host            : uriObj.host,
      user            : StrMatch[1],
      password        : StrMatch[2],
      database        : nameDB,
      multipleStatements: true,
      waitForConnections:true,
      queueLimit:nDBQueueLimit,
      flags:'-FOUND_ROWS'
    });
    pool.on('error',function(e){debugger});
    DB[name].pool=pool;
  }
}





