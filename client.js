

"use strict"
window.onload=function(){


var addStuffMy=function(){  
  addStuffGeneral();
  if(boAppOI) addStuffOI(); 
  if(boAppFB) addStuffFB();
  if(boAppGoogle) addStuffGoogle();  
  if(boAppIP) addStuffIP(); 
}

var rewriteLang=function(){  }

var rewriteObj=function(){
  extendStuffGen();
  if(boAppOI) extendStuffOI(); 
  if(boAppFB) extendStuffFB();
  if(boAppGoogle) extendStuffGoogle(); 
  if(boAppIP) extendStuffIP();  
}

var addStuffGeneral=function(){
  app.extendStuffGen=function(){
      //
      // Add formatting functions
      //
    var makeTimeF=function(strN,dir){return function(iMTab){ 
      var data=MTab[iMTab][strN];  if(boUseTimeDiff[strN]) {var t=dir*(data-curTime); data=t<0?'-':getSuitableTimeUnitStr(t);}
      else data=UTC2Readable(data); return data; 
    }  }
    
    var tmpSetCreated=makeTimeF('created',-1);
    var tmpSetLastActivity=makeTimeF('lastActivity',-1);
    var tmpIP=function(iMTab,c){  return enumIP[Number( MTab[iMTab].IP )]; }

    var calcImageUrl=function(iMTab){var rT=MTab[iMTab],tmp=''; if(rT.IP=='1') tmp='https://graph.facebook.com/'+rT.idIP+'/picture';else tmp=uDummy; return tmp;}
    var tmpSetImage=function(iMTab,c){ c.children[0].prop({src:calcImageUrl(iMTab)});  }  

    var tmpCrImage=function(c){ c.append(createElement('img').prop({alt:"voter"}));  }
    
    
    var choiseSetF=function(iMTab){
      //var arrChoise=MTab[iMTab].choise, len=arrChoise.length;
      //var arrChoiseName=[]; for(var j=0;j<len;j++){ arrChoiseName[j]=arrOption[arrChoise[j]];}
      //var tmpN;   if(len>maxVotesDispInCol)    tmpN=langHtml.XVotes.replace(/<span><\/span>/,len);     else tmpN=arrChoiseName.join(', ');
      var tmpN=arrOption[MTab[iMTab].choise];
      return tmpN;
    }
    
      // voterInfoDiv
    voterInfoDiv.created={setF:tmpSetCreated};
    voterInfoDiv.lastActivity={setF:tmpSetLastActivity};
    voterInfoDiv.IP={setF:tmpIP};

    voterInfoDiv.image={setF:tmpSetImage,crF:tmpCrImage}

    voterInfoDiv.choise={setF:choiseSetF};

      // voterListDiv
    voterListDiv.created={sortF:tmpSetCreated, setF:tmpSetCreated}; 
    voterListDiv.lastActivity={sortF:tmpSetLastActivity, setF:tmpSetLastActivity};
    voterListDiv.IP={sortF:tmpIP, setF:tmpIP};
    
    voterListDiv.image={
      sortF:function(iMTab){return MTab[iMTab].IP+MTab[iMTab].idIP;},
      setF:tmpSetImage,
      crF:tmpCrImage
    };
    voterListDiv.choise={setF:choiseSetF,sortF:choiseSetF};

    voterListDiv.arrLabel=extend({},langHtml.label);
    voterListDiv.arrLabel.lastActivity=langHtml.lastActivityShort;
    voterListDiv.arrLabel.created=langHtml.createdShort;

  }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////


var addStuffOI=function(){
  app.extendStuffOI=function(){
    voterInfoDiv.StrProp=['idIP', 'nameIP', 'nickIP', 'choise', 'lastActivity', 'created'];
    voterInfoDiv.StrGroup=['Voter'];
    voterInfoDiv.StrGroupFirst=['idIP'];

    voterListDiv.StrProp=['idIP', 'nameIP', 'nickIP', 'choise', 'lastActivity', 'created'];
  }  
}

var addStuffFB=function(){
  app.extendStuffFB=function(){
    voterInfoDiv.StrProp=['image','nameIP','nickIP','homeTown','state','locale','timezone','choise','lastActivity','created'];
    voterInfoDiv.StrGroup=['Voter'];
    voterInfoDiv.StrGroupFirst=['image'];

    voterListDiv.StrProp=['image','nameIP','nickIP','homeTown','state','locale','timezone','choise','lastActivity','created'];
  }  
}

var addStuffGoogle=function(){
  app.extendStuffGoogle=function(){
    voterInfoDiv.StrProp=['idIP', 'nameIP', 'nickIP', 'choise', 'lastActivity', 'created'];
    voterInfoDiv.StrGroup=['Voter'];
    voterInfoDiv.StrGroupFirst=['idIP'];

    voterListDiv.StrProp=['idIP', 'nameIP', 'nickIP', 'choise', 'lastActivity', 'created'];
  }  
}

var addStuffIP=function(){
  app.extendStuffIP=function(){
    voterInfoDiv.StrProp=['idIP', 'choise', 'lastActivity', 'created'];
    voterInfoDiv.StrGroup=['Voter'];
    voterInfoDiv.StrGroupFirst=['image'];
    
    voterListDiv.StrProp=['idIP','choise','lastActivity','created'];
  }  
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





var createColJIndexNamesObj=function(arrName){
  var o={};
  for(var i=0;i<arrName.length;i++){ 
    var tmp="j"+arrName[i][0].toUpperCase()+arrName[i].substr(1);       o[tmp]=i;
  }
  return o;
}


var createChildInd=function(arrI){
  var arrO=[]; for(var i=0;i<arrI.length;i++){  var itmp=arrI[i];  arrO[itmp]=i;  }  return arrO;
}





  //
  // History stuff
  //

app.histGoTo=function(view){}
app.historyBack=function(){  history.back();}
app.doHistPush=function(obj){
    // Set "scroll" of stateNew  (If the scrollable div is already visible)
  var view=obj.view;
  var scrollT=window.scrollTop();
  if(typeof view.setScroll=='function') view.setScroll(scrollT); else history.StateMy[history.state.ind].scroll=scrollT;  //view.intScroll=scrollT;

  if((boChrome || boOpera) && !boTouch)  history.boFirstScroll=true;

  var indNew=history.state.ind+1;
  stateTrans={hash:history.state.hash, ind:indNew};  // Should be called stateLast perhaps
  history.pushState(stateTrans, strHistTitle, uCanonical);
  history.StateMy=history.StateMy.slice(0, indNew);
  history.StateMy[indNew]=obj;
}
app.doHistReplace=function(obj, indDiff=0){
  history.StateMy[history.state.ind+indDiff]=obj;
}
app.changeHist=function(obj){
  history.StateMy[history.state.ind]=obj;
}
app.getHistStatName=function(){
  return history.StateMy[history.state.ind].view.toString();
}
history.distToGoal=function(viewGoal){
  var ind=history.state.ind;
  var indGoal;
  for(var i=ind; i>=0; i--){
    var obj=history.StateMy[i];
    var view; if(typeof obj=='object') view=obj.view; else continue;
    if(view===viewGoal) {indGoal=i; break;}
  }
  var dist; if(typeof indGoal!='undefined') dist=indGoal-ind;
  return dist;
}
history.fastBack=function(viewGoal, boRefreshHash){
  var dist=history.distToGoal(viewGoal);
  if(dist) {
    if(typeof boRefreshHash!='undefined') history.boResetHashCurrent=boRefreshHash;
    history.go(dist);
  }
}



//
// spanMessageTextCreate
//

var divMessageTextCreate=function(){
  var spanInner=createElement('span');
  var imgBusyLoc=imgBusy.cloneNode().css({zoom:'65%','margin-left':'0.4em'}).hide();
  var el=createElement('div').myAppend(spanInner, imgBusyLoc);
  el.resetMess=function(time){
    clearTimeout(messTimer);
    if(time) { messTimer=setTimeout(resetMess, time*1000); return; }
    spanInner.myText(' ');
    imgBusyLoc.hide();
  }
  el.setMess=function(str='',time,boRot){
    spanInner.myText(str);
    clearTimeout(messTimer);
    if(time)     messTimer=setTimeout(resetMess, time*1000);
    imgBusyLoc.toggle(Boolean(boRot));
  };
  el.setHtml=function(str='',time,boRot){
    spanInner.myHtml(str);
    clearTimeout(messTimer);
    if(time)     messTimer=setTimeout(resetMess, time*1000);
    imgBusyLoc.toggle(Boolean(boRot));
  };
  var messTimer;
  el.addClass('message');
  return el;
}


//
// Login stuff
//

var loginInfoToggleStuff=function(){
  divLoginInfo.setStat();
  divEntryBar.visible(); // This only needed the first time really
  butAdmin.toggle(userInfoFrDB.admin);
  var boIn=Boolean(userInfoFrDB.voter);
  divEntryBar.toggle(!boIn);
  if(boIn) {var tmp=userInfoFrDB.voter.choise; summaryDiv.setCheckBoxes(tmp); } 
  summaryDiv.deleteButton.toggle(boIn);
}

var loginReturnVoter=function(){
  //if(!userInfoFrDB.voter){ voterIntroDiv.openFunc(); }  
  setTimeout(function(){history.back();},100);
}

var loginReturn2=null;
app.loginReturn=function(userInfoFrIPT,userInfoFrDBT,fun,strMess,CSRFCodeT){
  CSRFCode=CSRFCodeT;
  
  userInfoFrIP=userInfoFrIPT; userInfoFrDB=userInfoFrDBT;
  
  loginInfoToggleStuff();
  //if(loginPop.parentNode) loginPop.closeFunc();
  if(loginReturn2) {loginReturn2(); loginReturn2=null;}

  //divLoginInfo.setStat(); 
}

var loginPopExtend=function(el){
  el.toString=function(){return 'loginPop';}
  var popupWin=function(IP,openid) {
    //e.preventDefault();
    pendingMess.show(); cancelMess.hide();
    
    //var strFile='loginStart.php';
    var arrQ=['IP='+IP, 'fileReturn='+encodeURIComponent(uLogin),'fun='+strType+'Fun', 'siteName='+siteName];
    if(IP==='openid') arrQ.push('openid_identifier='+encodeURIComponent(openid));
    var uPop=uLogin+'?'+arrQ.join('&');
    el.win=window.open(uPop);//, '_blank', 'width=580,height=400'

    clearInterval(timerClosePoll);
    timerClosePoll = setInterval(function() { if(el.win.closed){ clearInterval(timerClosePoll); pendingMess.hide(); cancelMess.show(); }  }, 500);  
    return 0;
  }

  el.openFunc=function(strTypeT){
    strType=strTypeT;
    pendingMess.hide(); cancelMess.hide(); 
    //if(strType=='customer') pOI.hide(); else pOI.show();
    doHistPush({view:loginPop});
    el.setVis();
  }
  el.setVis=function(){ el.show(); return true; }
  el.closeFunc=function(){   clearInterval(timerClosePoll); historyBack();    }
  el.setHead=function(headT){ spanHead.myHtml(headT); return el;}

  var timerClosePoll;
  
  //el=popUpExtend(el);  
  //el.css({'max-width':'21em', padding: '1em 0.8em 1em 0.8em'});  
  //el.blanket.css({'z-index':50});   el.css({'z-index':107});

  var strType;
  
  var headHelp=imgHelp.cloneNode(1).css({'margin-left':'1em'}),  bubHead=createElement('div').myHtml(langHtml.loginPop.DeleteInfo);     popupHover(headHelp,bubHead);
  var spanHead=createElement('span').css({'font-weight':'bold'});  
  var head=createElement('p').css({'font-weight':'bold'}).myAppend(spanHead,headHelp);  
  
  var fbIm=createElement('img').on('click', function(){popupWin('fb','');}).prop({src:uFBFacebook, alt:"fb"}).css({position:'relative',top:'0.4em'});
  var strTex=site.boOpenVote?'fbCommentOpen':'fbComment';
  var fbHelp=imgHelp.cloneNode(1).css({'margin-left':'1em'}),  bub=createElement('div').myHtml(langHtml.loginPop.fbComment);     popupHover(fbHelp,bub);
  var pFB=createElement('p').myAppend(fbIm,fbHelp);
  
  var strButtonSize='2em';
  var googleIm=createElement('img').prop({src:uGoogle, alt:"google"}).on('click', function(){popupWin('google','');}).css({position:'relative',top:'0.4em',width:strButtonSize,heigth:strButtonSize,'margin-left':'1em'}); 
  var pGoogle=createElement('p').myAppend(googleIm);


    // formOpenID
  var formOpenID=document.querySelector('#OpenID').detach();
  var inpOpenID=formOpenID.querySelector("input[name='OpenID']").prop({type:'text',size:19,width:'12em'});
  inpOpenID.css({background: 'url('+uOpenId+') no-repeat scroll 0 50% #fff', 'padding-left':'1.1em'});
  inpOpenID.on('keypress', function(e){ if(e.which==13) popupWin('openid',inpOpenID.value); } );
  
  var buttGo=formOpenID.querySelector("button[name='submit']").on('click',function(){popupWin('openid',inpOpenID.value);});
  buttGo.css({position:'relative',bottom:'0.2em','font-size':'0.8em','margin-left':'0.4em'});
  [...formOpenID.querySelectorAll('input[type=text],[type=email],[type=number],[type=password]')].forEach( ele=>ele.css({display:'block'}).on('keypress',(e)=>{if(e.which==13) loginWEmail(e);} ) );
  
  var createAccount=createElement('a').prop({href:'https://openid.net/get-an-openid/'}).myHtml(langHtml.loginPop.openIDProviders).css({'font-size':'75%', display:'block'});
  var img=imgHelp.cloneNode(1), createAccountHelp=createElement('div').myAppend(langHtml.loginPop.createAccountHelp);  popupHover(img,createAccountHelp); 
  formOpenID.myAppend(createAccount);

  
  var cancel=createElement('button').on('click', historyBack).myText(langHtml.Cancel);
  
  var divs=[];
  if(site.typeApp=='oi') divs.push(formOpenID);
  if(site.typeApp=='fb') divs.push(pFB);
  if(site.typeApp=='google') divs.push(pGoogle);
  divs.push(cancel);
 
  divs.forEach(ele=>ele.css({'margin-top':'1.5em', 'margin-right':'1.5em'}));
  
  
  var pendingMess=createElement('span').hide().myAppend(langHtml.loginPop.pendingMess,' ',imgBusy.cloneNode());
  var cancelMess=createElement('span').hide().myAppend(langHtml.loginPop.cancelMess);


  var blanket=createElement('div').addClass("blanket");
  var centerDiv=createElement('div').myAppend(head, ...divs, pendingMess, cancelMess);
  centerDiv.addClass("Center").css({padding: '1em 0.8em 1em 0.8em'}); //'width':'21em', height:'12em', 
  el.addClass("Center-Container").myAppend(centerDiv,blanket); //

  return el;
}

var divEntryBarExtend=function(el){
  //var cssBut={width:'initial','font-weight':'bold', padding:'0.2em', height:"auto", 'min-height':'1.8rem'};
  var butLogin=createElement('button').myAppend(langHtml.Login).on('click', function(){loginReturn2=loginReturnVoter; loginPop.setHead(langHtml.Login).openFunc('voter'); });
  el.css({ display:"flex", "justify-content":"center", 'align-items':'center'}); //, 'border-top':'solid 1px', "justify-content":"space-evenly"
  el.myAppend(butLogin);
  return el;
}
var divLoginInfoExtend=function(el){
  el.setStat=function(){
    var boShow=0,arrKind=[];
    for(var key in userInfoFrDB){   if(userInfoFrDB[key]) { boShow=1; arrKind.push(langHtml.divLoginInfo[key]); }   }
    if(boAppIP) boShow=0;
    if(boShow){
      spanName.myText(userInfoFrIP.nameIP);
      spanKind.myText('('+arrKind.join(', ')+')');
      el.show();
    }else {
      el.hide(); 
    } 
  }
  var spanName=createElement('span'), spanKind=createElement('span').css({'margin-left':'.4em', 'margin-right':'0.4em'});
  //var logoutButt=createElement('a').prop({href:''}).myText(langHtml.divLoginInfo.logoutButt).css({'float':'right'});
  var logoutButt=createElement('button').myText(langHtml.divLoginInfo.logoutButt).css({'margin-left':'auto'}); //.css({'float':'right','font-size':'90%'});
  logoutButt.on('click', function(){ 
    userInfoFrIP={}; 
    var vec=[['logout',{}, function(data){
      summaryDiv.setAllOff(); //summaryDiv.setVis();
      history.fastBack(summaryDiv,true);
    }]];
    majax(vec);
    return false;
  });

  el.myAppend(spanName, spanKind, logoutButt).css({display:'flex', 'justify-content':'space-between', 'align-items':'center', 'font-size':'12px'});
  el.hide();
  return el;
}



//
// voterListDivExtend
//


var voterListHeadExtend=function(el){
  var buttonBack=createElement('button').on('click', historyBack).myAppend(langHtml.Back).css({'margin-right':'1em','margin-left':'0.6em'});
  el.buttShowSelect=createElement('button').myAppend(langHtml.ShowMoreData).on('click', function(){ 
    columnSelectorDiv.setUp(colsShowInd, jColOneMark);
    columnSelectorDiv.setVis();
    doHistPush({view:columnSelectorDiv});
  });

  //el.filterButton=filterButton.cloneNode().on('click', function(){  filterButtonClick();  });
  el.filterInfoWrap=createElement('span');
  var filterButton=createElement('button').myAppend(langHtml.Filter,': (',el.filterInfoWrap,')').css({'float':'right','clear':'both'}).on('click', function(){  filterButtonClick();  });
  var topDivA=createElement('div').myAppend(buttonBack,filterButton).css({'margin-top':'1em',overflow:'hidden','text-align':'left'}); el.topDivA=topDivA;
  var topDivB=createElement('div').myAppend(el.buttShowSelect).css({'margin-top':'1em','text-align':'left'});
  
  el.append(topDivA);
  return el;
}

var voterListTHeadExtend=function(el){
  el.myCreate=function(){
    for(var i=0;i<voterListDiv.StrProp.length;i++){
      var strName=voterListDiv.StrProp[i];
      var h=createElement('th').myAppend(voterListDiv.arrLabel[strName]).attr('name',strName); 
      elR.append(h);
    };
  }
  var elR=createElement('tr'); el.append(elR);
  return el;
}


var voterListDivExtend=function(el){
  el.toString=function(){return 'voterListDiv';}
  el.setMTab=function(MOrg){ //, tabChoise
    if(typeof MOrg =='undefined') nMTab=0;
    else{
      nMTab=MOrg.length;
      for(var i=0;i<nMTab;i++){
        if(typeof MTab[i] =='undefined') MTab[i]={};
        for(var j=0;j<KeySel.length;j++){  var name=KeySel[j]; MTab[i][name]=MOrg[i][j];    } 
        //MTab[i].choise=tabChoise[i];
      }
    }
    //MTab=tabNStrCol2ArrObj(MOrg);
  }
  el.load=function(){ 
    setMess('... fetching data ... ',5,true);
    var vec=[['setUp',{}],['setUpCond',{Filt:filterDiv.divCont.gatherFiltData()},voterListDiv.setUpCondRet],['getList',{offset,rowCount:maxVoterDisp},el.getListRet]];   majax(vec);
  }
  el.setUpCondRet=function(data){ 
    var tmp=data.curTime;   if(typeof tmp!="undefined")  curTime=tmp;
  }
  el.getListRet=function(data){ 
    //var tmp=data.nTot;   if(typeof tmp!="undefined")  nTot=tmp;
    var nCur, nFiltTot, nTot, tab; //, tabChoise;
    //var tmp=data.nCur;   if(typeof tmp!="undefined")  nCur=tmp;
    //var tmp=data.n;   if(typeof tmp!="undefined") { filterInfoSpan.setN(tmp); var nFiltTot=tmp[0];}
    //var tmp=data.n;   if(typeof tmp!="undefined") {  var nFiltTot=tmp[0];}
    var tmp=data.NVoter;   if(typeof tmp!="undefined") {  nFiltTot=tmp[0]; nTot=tmp[1];  filterInfoSpan.setN(tmp); } 
    
    var tmp=data.tab;  if(typeof tmp =='undefined') {tmp=[]; } tab=tmp; nCur=tab.length;
    //var tmp=data.tabChoise;  if(typeof tmp =='undefined') {tmp=[]; } tabChoise=tmp;
    el.setMTab(tab); //,tabChoise
    //tabToTBody();  
    el.setCell();
    el.setRowDisp();
    
    
    if(nFiltTot>offset+MTab.length) butNext.prop({disabled:false}); else butNext.prop({disabled:1});
    if(offset>0) butPrev.prop({disabled:false}); else butPrev.prop({disabled:1});
    spanInfo.myText('Row: '+(offset+1)+'-'+(nCur+offset)+', tot: '+nFiltTot);
  }
  el.setRowDisp=function(){
    var arrT=[...tBody.querySelectorAll('tr')], arrShow=arrT.slice(0, nMTab), arrHide=arrT.slice(nMTab);
    arrShow.forEach(function(ele){ele.show();});
    arrHide.forEach(function(ele){ele.hide();});
  }
  el.setCell=function(){
    var tr=[...tBody.querySelectorAll('tr')];
    for(var i=0;i<nMTab;i++){ 
      var elR=tr[i]; //elR.iMTab=i;
      [...elR.querySelectorAll('td')].forEach(function(ele,j){
        var strName=ele.attr('name'), tmpObj=(strName in el)?el[strName]:emptyObj;
        var tmp=''; if('sortF' in tmpObj) tmp=tmpObj.sortF(i,ele);  else tmp=MTab[i][strName];     ele.valSort=tmp;
        var tmp=''; if('setF' in tmpObj) tmp=tmpObj.setF(i,ele);  else tmp=MTab[i][strName]; 
        if(typeof tmp!='undefined') ele.myHtml(tmp);    
      });
    }
  }
  el.createTBody=function(){
    for(var i=0;i<maxVoterDisp;i++) {
      var row=createElement('tr');
      if(!boTouch) row.on('mouseover',function(){this.css({background:'#faa'});}).on('mouseout',function(){this.css({background:''});});
      for(var j=0;j<el.StrProp.length;j++){ 
        var strName=el.StrProp[j], tmpObj=(strName in el)?el[strName]:emptyObj;
        var td=createElement('td').css({'max-width':'200px','max-height':'40px',overflow:'hidden'}).attr('name',strName);
        if('crF' in tmpObj) tmpObj.crF(td);  
        row.append(td);  //,'word-break':'break-all'
      }
      row.iMTab=i;
      tBody.append(row);
    }
    //var tmp='td';
    //tBody.on('click',tmp,function(){
      //var iMTab=this.parentNode.iMTab;//, idIP=MTab[iMTab].idIP;
      //voterInfoDiv.setContainers(iMTab);
      //voterInfoDiv.setVis(); 
      //doHistPush({view:voterInfoDiv});
    //});
    
    tBody.on('click',function(e){
      var ele=e.target, elC=ele;
      while(1){ if(elC.nodeName=='TD') break;  elC=elC.parentNode;  }   // Set elC to closest td above
      var iMTab=elC.parentNode.iMTab;
      voterInfoDiv.setContainers(iMTab);
      voterInfoDiv.setVis();
      doHistPush({view:voterInfoDiv});
    });
  }
  el.getRow=function(iMTab){
    //var tmp=tBody.children('tr:lt('+nMTab+')');
    var tmp=[...tBody.querySelectorAll('tr')];
    tmp=tmp.filter(function(ele){return ele.iMTab == iMTab;});
    return tmp[0];
  }
  el.getMTabRow=function(idIP){
    for(var i=0;i<nMTab;i++){
      if(MTab[i].idIP==idIP) return MTab[i];
    }
    return [];
  }

  el.StrProp=el.StrGroup=el.StrGroupFirst=[];
  el.arrLabel=[];
  var indSortedLast=-1, strSortedLast=-1;
  app.MTab=[];
  app.nMTab=0;
  var offset=0; //el.rowCount=maxVoterDisp;
  
  var table=createElement('table').css({display:'inline-table',background:'#fff'});
  var tBody=createElement('tbody');  
 
  table.append(tBody); 
  table.show();

  
  var butPrev=createElement('button').myAppend('Prev page').on('click', function(){ offset-=maxVoterDisp; offset=offset>=0?offset:0; el.load();});
  var butNext=createElement('button').myAppend('Next page').on('click', function(){ offset+=maxVoterDisp; el.load();});
  var spanInfo=createElement('span');
  var spanPrevNext=createElement('span').myAppend(butPrev,butNext).css({display:'inline-block'});
  var divInfo=createElement('div').myAppend(spanInfo,spanPrevNext);
  el.append(table,divInfo);

  el.table=table, el.tBody=tBody;

  return el;
}





var arrValMerge=function(arr,val){  var indOf=arr.indexOf(val); if(indOf==-1) arr.push(val); }
//arrValRemove=function(arr,val){  var indOf=arr.indexOf(val); if(indOf!=-1) arr.splice(indOf,1); }
var arrValRemove=function(arr,val){  var indOf=arr.indexOf(val); if(indOf!=-1) mySplice1(arr,indOf); }



/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * filterExtend
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/

      // filt (client-side): 'B/BF'-features: [vOffNames,vOnNames, boWhite],     'S'-features: [iOn,iOff]
      // filt (server-side): 'B/BF'-features: [vSpec, boWhite],     'S'-features: [iOn,iOff]
      // hist (client-side): 'B'-features: [vPosName,vPosVal],       'S'/'BF'-features: [vPosInd,vPosVal]
      // histPHP (server-side): histPHP[buttonNumber]=['name',value], (converts to:) hist[0]=names,  hist[1]=values
var FilterDiv=function(Prop, Label, StrOrderFilt, changeFunc, StrGroupFirst=[], StrGroup=[]){   //  Note!! StrOrderFilt should not be changed by any client side plugins (as it is also used on the server)
  var el=createElement('div');
  el.toString=function(){return 'FilterDiv';}

  var objArg={Prop, Label, StrOrderFilt, changeFunc, StrGroupFirst, StrGroup, helpBub, objSetting:objFilterSetting};
  el.divCont=filterDivICreator(objArg, changeFunc).addClass('contDiv').css({'max-width':menuMaxWidth+'px',margin:'0em auto','text-align':'left'});
  
  var buttonBack=createElement('button').myText(langHtml.Back).addClass('fixWidth').on('click', historyBack).css({'margin-left':'0.8em','margin-right':'1em'});
 
  el.filterInfoWrap=createElement('span');
  var filterInfoWrap2=createElement('span').myAppend(' (',el.filterInfoWrap,')').css({'float':'right',margin:'0.2em 0 0 0.2em'});  //,'clear':'both'
  
  var buttClear=createElement('button').myAppend(langHtml.ResetFilter).on('click', function(){el.divCont.Filt.filtAll(); loadTabStart();}).css({'float':'right'});  //,'clear':'both'
  
  var menuA=createElement('div').myAppend(buttonBack,filterInfoWrap2,buttClear).css({padding:'0','margin-top':'1em',overflow:'hidden'});
  //el.prepend(menuA);

  el.addClass('unselectable');    el.prop({unselectable:"on"}); //class: needed by firefox, prop: needed by opera, firefox and ie

  el.append(menuA, el.divCont);
  //el.divCont=el;
  return el;
}
var filterInfoSpanExtend=function(el){
  el.setN=function(arr){
    el.empty(); el.append(arr[0],'/',arr[1]);
  }
  return el;
}

var menuMaxWidth=500;



//
// summaryDivExtend
//

var summaryDivExtend=function(el){
  el.toString=function(){return 'summaryDiv';}
  
  var upLoad=function(ind){
    var vec=[['UUpdate',{choise:ind}], ['specSetup',{Role:'voter'}]];   majax(vec);
  }
  var setSingle=function(){  this.prop({'checked':true});   }
  
  var checkboxClick=function(){
    var ind=this.ind;
    if(!this.checked) ind=null;
    checkBoxes.forEach(function(ele,i) {
      if(ele.checked) { ele.checked=false;}
    });
    
    if(boAppIP) {  upLoad(ind); }
    else if(userInfoFrIP.IP) {upLoad(ind); }
    else {
      var el=this;
      loginReturn2=function(){
        loginReturnVoter();
        if(userInfoFrIP){setSingle.call(el);upLoad(ind);}
      }; 
      loginPop.setHead(langHtml.loginHeadMess).openFunc('voter');  return false; //table.find(':checkbox').prop({'checked':false});
    }
  }
  el.setAllOn=function(){ checkBoxes.forEach(function(ele,i) { ele.prop({'checked':true}); }); }
  el.setAllOff=function(){ checkBoxes.forEach(function(ele,i) { ele.prop({'checked':false}); }); }

  
  el.setCheckBoxes=function(arrChoise){
    if(!(arrChoise instanceof Array)) arrChoise=[arrChoise];
    checkBoxes.forEach(function(ele,i) {
      var boOn=arrChoise.indexOf(i)!=-1;
      ele.prop({checked:boOn});
    });
  }
  el.setHist=function(){   
    var iFeat=StrOrderFiltFlip.choise, histT=filterDiv.divCont.Hist[iFeat]; 
    var maxV=arr_max(histT[1].concat(1)), fac=1;  if(maxV>objFilterSetting.maxStaple) fac=objFilterSetting.maxStaple/maxV; 
    tdNVote.forEach(function(ele,i){
      var td=tdNVote[i];
      var nVotes=0, iTmp=histT[0].indexOf(i); if(iTmp!=-1) nVotes=histT[1][iTmp];
      var width=Math.ceil(nVotes*fac);
      td.myText(nVotes);  tdBars[i].css({width:width+'px'}); //arrChoiseButtons[i].setStat(boOn);
    });
  }

  var thClick=function(){
    //var boAsc=this.children[0].src==uDecreasing;
    var boAsc=this.children[0].srcset==srcsetDecreasing;
    //var boAsc=(thSorted===this)?!boAsc:this.boAscDefault;
    //thSorted=this;
    //var iChild=this.myIndex()
    arrImgSort.forEach(ele=>ele.prop({srcset:srcsetUnsorted}) );
    //var tmp=boAsc?uIncreasing:uDecreasing;  this.children[0].prop({src:tmp});
    var tmp=boAsc?srcsetIncreasing:srcsetDecreasing;  this.children[0].prop({srcset:tmp});

    var arrT=tBody.querySelectorAll('tr'), arrToSort=[...arrT];
    var iCol=this.iCol; // One of the headercells spans two columns, so iChild!=iCol
    var comparator=function(aRow, bRow){
      var aCell=aRow.children[iCol], bCell=bRow.children[iCol]; 
      var a,b; if('sortValF' in aCell) { a=aCell.sortValF(); b=bCell.sortValF(); } else {a=aCell.textContent; b=bCell.textContent;}
      var dire=boAsc?1:-1;
      if(a==b) {return 0;} else return a>b?dire:-dire;    
    }
    var arrToSortN=msort.call(arrToSort,comparator);
    tBody.prepend.apply(tBody,arrToSortN);
  }
  
  var colStaple='#f70';

  var arrImgSort=[createElement('img'), createElement('img'), createElement('img')]; arrImgSort.forEach(ele=>ele.prop({srcset:srcsetUnsorted, alt:"sort"}).css({margin:'0 0.3em', width:"8px"}));
  
  var thName=createElement('th').myAppend(langHtml.Option,arrImgSort[0]).on('click', thClick).prop({iCol:0});
  var thNVote=createElement('th').myAppend(langHtml.Votes,arrImgSort[1]).on('click', thClick).prop({colSpan:2, iCol:1});
  var thUserVote=createElement('th').myAppend(langHtml.YourVote, arrImgSort[2]).on('click', thClick).prop({iCol:3}).css({'text-align':'center','padding-left':'1em'});

  var heads=[thName, thNVote, thUserVote]; heads.forEach(ele=>ele.css({cursor:'pointer'}));
  var tHead=createElement('thead').myAppend(createElement('tr').myAppend(...heads));
  var tBody=createElement('tbody');
  var table=createElement('table').myAppend(tHead,tBody).css({'margin-top':'1em'});
  
  
  var sortValFName=function(){return this.myText().toLowerCase();}
  var sortValFCB=function(){return this.children[0].checked;}
  
  for(var i=0;i<nOption;i++){
    var bar=createElement('span').css({background:colStaple,height:'1em',display:'inline-block',position:'relative',bottom:'-1px'});
    var cbT=createElement('input').prop({type:'checkbox', ind:i}).attr({id:'cb'+i}); 
    
    var label=createElement('label').attr({for:'cb'+i}).myAppend(arrOption[i]);
    var tdOptionName=createElement('td').myAppend(label).prop({sortValF:sortValFName});
    var tdNVotes=createElement('td');
    var tdCB=createElement('td').myAppend(cbT).prop({sortValF:sortValFCB});
    
    var tr=createElement('tr').myAppend(tdOptionName, tdNVotes, createElement('td').myAppend(bar), tdCB); tr.ind=i;
    tBody.append(tr);
  }
  var trs=[...tBody.querySelectorAll('tr')];
  trs.forEach(ele=>ele.querySelector('td:nth-child(4)').css({'text-align':'center'}));
  
  var tdName=tBody.querySelectorAll('td:nth-child(1)');
  var tdNVote=tBody.querySelectorAll('td:nth-child(2)');
  var tdBars=tBody.querySelectorAll('td:nth-child(3) > span');
  
  var checkBoxes =[...tBody.querySelectorAll('input[type="checkbox"]')]; checkBoxes.forEach(ele=>ele.css({height:'1.4em',width:'1.4em','margin':'.5em 1.5em'}).on('click', checkboxClick)); 
  
  var tableButtonLoc=tableButton.cloneNode(true).css({'margin-right':'2px'}).on('click', function(){voterListButtonClick();});
  if(site.boOpenVote==0) tableButtonLoc.hide();
  el.filterInfoWrap=createElement('span');
  var filterButton=createElement('button').myAppend(langHtml.Filter,': (',el.filterInfoWrap,')').css({}).on('click', function(){  filterButtonClick();  }); //     'float':'right','clear':'both'

  var topDivA=createElement('div').myAppend(butAdmin, tableButtonLoc, filterButton).css({'margin-top':'1em',overflow:'hidden', display:'flex',
  'justify-content':'space-between', width: '100%', flex:'0 0 auto'});

  el.deleteButton=createElement('button').myAppend(langHtml.DeleteMyVote).on('click', function(){var vec=[['UDelete',{},el.setAllOff]];   majax(vec);});

  el.append(topDivA,table,el.deleteButton);
  return el;
}





var adminDivExtend=function(el){ 
  el.toString=function(){return 'adminDiv';}
  
  var buttonBack=createElement('button').on('click', historyBack).myAppend(langHtml.Back).css({'margin-right':'1em'});
  //var buttonSave=createElement('button').on('click', saveFunc).myAppend(langHtml.Save);
  var topDiv=createElement('div').myAppend(buttonBack).css({padding:'0 0.3em','margin-top':'1em',overflow:'hidden'});

  el.append(topDiv);
 
  return el;
}



//
// voterInfoDivExtend
//

var updateTableThumb=function(el,iRow){
  var canvas=el,  ctx = canvas.getContext("2d");
  //var heightRow=2; if(nMTab<4) heightRow=5; if(nMTab<4) heightRow=10;
  var heightRow=2; if(nMTab*2<15) heightRow=Math.round(15/nMTab); if(nMTab==1) heightRow=10;
  var widthBox=25;
  canvas.width=widthBox;   canvas.height=nMTab*heightRow;
  for(var i=0;i<nMTab;i++){
    ctx.beginPath(); //so start going clockwise from upper left corner
    ctx.moveTo(0, i*heightRow);
    ctx.lineTo(widthBox,i*heightRow);
    ctx.lineTo(widthBox, (i+1)*heightRow);
    ctx.lineTo(0, (i+1)*heightRow);
    ctx.closePath();
    var col='white'; if(i%2) col='lightgrey';
    if(i==iRow) col='red';
    ctx.fillStyle=col;  ctx.fill();    
  }
  return el;
}
var voterInfoDivExtend=function(el){  
  el.toString=function(){return 'voterInfoDiv';}
  el.setContainers=function(iMTab){
    arrowDiv.toggle(nMTab>1);
    var rMTab=MTab[iMTab];
    el.tr=voterListDiv.getRow(iMTab);
    var iRow=el.tr.myIndex();
    containers.forEach(function(ele,j){
      var strName=ele.attr('name'), tmpObj=(strName in el)?el[strName]:emptyObj;
      var tmp=''; if('setF' in tmpObj) tmp=tmpObj.setF(iMTab,ele);  else tmp=MTab[iMTab][strName]; 
      if(typeof tmp!='undefined') ele.myHtml(tmp);    
    });    
    tableThumb=updateTableThumb(tableThumb,iRow);
    el.boLoaded=1;  
  }
  el.createContainers=function(){
    for(var i=0;i<el.StrProp.length;i++){ 
      var strName=el.StrProp[i], tmpObj=(strName in el)?el[strName]:emptyObj; 
      var imgH=''; if(strName in helpBub && Number(Prop[strName].b[bFlip.help])) { imgH=imgHelp.cloneNode(1);   popupHover(imgH,helpBub[strName]); }
      
      var strDisp,strMargRight,strWW; if(Number(Prop[strName].b[bFlip.block])) {strDisp='block'; strMargRight='0em',strWW='';} else {strDisp='inline'; strMargRight='.2em'; strWW='nowrap';}
      
      var strLabel=''; if(Number(Prop[strName].b[bFlip.label])) strLabel=langHtml.label[strName]+': ';

      var divC=createElement('span').attr({name:strName}).css({'font-weight':'bold',margin:'0 0.2em 0 0em'});      
      if('crF' in tmpObj) tmp=tmpObj.crF(divC); 
      var divLCH=createElement('div').myAppend(strLabel,divC,imgH).css({display:strDisp,'margin-right':strMargRight,'white-space':strWW}).attr({name:strName});
      el.divCont.append(divLCH,' ');
    }
  
    containers=[...el.divCont.querySelectorAll('div>span')];
  
    for(var i=0;i<el.StrGroup.length;i++){
      var h=createElement('span').myAppend(langHtml[el.StrGroup[i]],':').css({'font-size':'120%','font-weight':'bold', display:'block'});
      var elTmp=el.divCont.querySelector('div[name='+el.StrGroupFirst[i]+']'); elTmp.myBefore(createElement('hr')).myBefore(h); 
    }
  }

  el.StrProp=el.StrGroup=el.StrGroupFirst=[];
  el.divCont=createElement('div');
  var containers;
  
  el.boLoaded=0;
  var idIP;

  var buttonBack=createElement('button').myText(langHtml.Back).addClass('fixWidth').on('click', historyBack).css({'margin-left':'0.8em','margin-right':'1em'}); 
  
  var tableThumb=createElement('canvas').css({'margin-right':'1.5em',border:'1px solid grey','vertical-align':'top'}).on('click', function(){voterListButtonClick();});


  var tmpf=function(iDiff){
    var iTmp=el.tr.iMTab+iDiff;
    if(iDiff==1) {
      if(iTmp==nMTab) iTmp=0;
    } else {
      if(iTmp==-1) iTmp=nMTab-1;
    }
    el.setContainers(iTmp);
  }
  var buttonPrev=createElement('button').myText('▲').on('click', function(){tmpf(-1);}).css({display:'block','margin':'0em'});  
  var buttonNext=createElement('button').myText('▼').on('click', function(){tmpf(1);}).css({display:'block','margin':'1.5em 0em 0em'}); 
  var arrowSpan=createElement('span').css({display:'inline-block'}).myAppend(buttonPrev,buttonNext);
  var arrowDiv=createElement('div').css({display:'inline-block','float':'right','margin':'0em 1.5em 0em 0em'}).myAppend(tableThumb,arrowSpan);
  el.menuDiv=createElement('div').myAppend(buttonBack,arrowDiv).css({'margin-top':'1em','padding':'0'}); //,overflow:'hidden'
  el.append(el.menuDiv,el.divCont);
  
  return el;
}


/*******************************************************************************************************************
 * LoadTab-callbacks
 *******************************************************************************************************************/

      // filts (JS-side): 'B/BF'-features: [vOffNames,vOnNames, boWhite],     'S'-features: [iOn,iOff]
      // filts (PHP-side): 'B/BF'-features: [vSpec, boWhite],     'S'-features: [iOn,iOff]
      // hists (JS-side): 'B'-features: [vPosName,vPosVal],       'S'/'BF'-features: [vPosInd,vPosVal]
      // hists (PHP-side): HistPHP[iFeat][buttonNumber]=['name',value], (converts to:) hists[iFeat][0]=names,  hists[iFeat][1]=values


var loadTabNHist=function(){
  var vec=[['setUp',{}], ['setUpCond',{Filt:filterDiv.divCont.gatherFiltData()},voterListDiv.setUpCondRet], ['getList',{offset:0,rowCount:maxVoterDisp},voterListDiv.getListRet], ['getHist',{},getHistRet]];   majax(vec);
    
  setMess('... fetching data ... ',0,true);
}
var loadTabStart=loadTabNHist;


var majax=function(vecIn){  // Each argument of vecIn is an array: [serverSideFunc, serverSideFuncArg, returnFunc]
  var xhr = new XMLHttpRequest();
  xhr.open('POST', uBE, true);
  xhr.setRequestHeader('X-Requested-With','XMLHttpRequest'); 
  var arrRet=[]; vecIn.forEach(function(el,i){var f=null; if(el.length==3) f=el.pop(); arrRet[i]=f;}); // Put return functions in a separate array
  vecIn.push(['CSRFCode',CSRFCode]);
  if(vecIn.length==2 && vecIn[0][1] instanceof FormData){
    var formData=vecIn[0][1]; vecIn[0][1]=0; // First element in vecIn contains the formData object. Rearrange it as "root object" and add the remainder to a property 'vec'
    formData.append('vec', JSON.stringify(vecIn));
    var dataOut=formData;
    xhr.setRequestHeader('x-type','single');
  } else { var dataOut=JSON.stringify(vecIn); }
  
  xhr.onload=function () {
    var dataFetched=this.response;
    var data; try{ data=JSON.parse(this.response); }catch(e){ setMess(e);  return; }
    
    var dataArr=data.dataArr||[];  // Each argument of dataArr is an array, either [argument] or [altFuncArg,altFunc]
    delete data.dataArr;
    beRet(data);
    for(var i=0;i<dataArr.length;i++){
      var r=dataArr[i];
      if(r.length==1) {var f=arrRet[i]; if(f) f(r[0]);} else { window[r[1]].call(window,r[0]);   }
    }
  }
  xhr.onerror=function(e){ var tmp='statusText : '+xhr.statusText;  setMess(tmp); console.log(tmp);   throw 'bla';}
  
  xhr.send(dataOut); 
  busyLarge.show();
}



var beRet=function(data,textStatus,jqXHR){
  if(typeof jqXHR!='undefined') var tmp=jqXHR.responseText;
  for(var key in data){
    window[key].call(this,data[key]); 
  }
  busyLarge.hide();
}

app.GRet=function(data){
  tmp=data.curTime;   if(typeof tmp!="undefined") curTime=tmp;
  //tmp=data.strMessageText;   if(typeof tmp!="undefined") setMess(tmp);
  tmp=data.strMessageText;   if(typeof tmp!="undefined") {setMess(tmp); if(/error/i.test(tmp)) navigator.vibrate(100);}
  tmp=data.CSRFCode;   if(typeof tmp!="undefined") CSRFCode=tmp;
  tmp=data.userInfoFrIP; if(typeof tmp!="undefined") {userInfoFrIP=tmp;}
  tmp=data.userInfoFrDBUpd; if(typeof tmp!="undefined") {
    for(var key in tmp){ userInfoFrDB[key]=tmp[key]; }  
    loginInfoToggleStuff();
  }
}

var getHistRet=function(data){   
  var tmp,HistPHP;
  tmp=data.Hist;   if(typeof tmp=="undefined") tmp=[];     HistPHP=tmp;
  //tmp=data.n;   if(typeof tmp!="undefined") { filterInfoSpan.setN(tmp); }
  //var tmp=data.n;   if(typeof tmp!="undefined") { filterInfoSpan.setN(tmp); }

  
  var vt; if(typeof vt=='undefined') vt=[]; else vt.length=0;
  var t0,t1=new Date().getTime();vt.push();

  filterDiv.divCont.interpretHistPHP(HistPHP);

  filterDiv.divCont.update(); 
  summaryDiv.setHist();
}

 



/********************************************************************************************************************
 ********************************************************************************************************************/


var emptyObj={};
app.elHtml=document.documentElement;  app.elBody=document.body
elBody.css({margin:'0px', padding:0});

app.boTouch = Boolean('ontouchstart' in document.documentElement);  //boTouch=1;



var ua=navigator.userAgent, uaLC = ua.toLowerCase(); //alert(ua);
app.boAndroid = uaLC.indexOf("android") > -1;
app.boFF = uaLC.indexOf("firefox") > -1; 

app.boChrome= /chrome/.test(uaLC);
app.boIOS= /iphone|ipad|ipod/.test(uaLC);
app.boEpiphany=/epiphany/.test(uaLC);    if(boEpiphany && !boAndroid) boTouch=false;  // Ugly workaround
app.boEdge= /\bedg\b/.test(uaLC);

app.boOpera=RegExp('OPR\\/').test(ua);

if(boOpera) boChrome=false; //alert(ua);

app.boSmallAndroid=0;

if(boTouch){
  if(boIOS) {  
    var tmp={height:"100%", "overflow-y":"scroll", "-webkit-overflow-scrolling":"touch"};
    elBody.css(tmp);  elHtml.css(tmp);
  }  
}  

var boHistPushOK='pushState' in history;
if(!boHistPushOK) { alert('This browser does not support history'); return;}
var boStateInHistory='state' in history;
if(!boStateInHistory) { alert('This browser does not support history.state'); return;}


if(!(typeof sessionStorage=='object' && sessionStorage.getItem)) {alert("This browser doesn't support sessionStorage"); return;}

//var imgUriTmp=makeMarker(0);  boImgCreationOK=1;  if(imgUriTmp.length<10) boImgCreationOK=0;
//boImgCreationOK=0;

assignSiteSpecific();

var oVersion=getItem('version'); app.boNewVersion=version!==oVersion;        setItem('version',version);

//var tmp=createColJIndexNamesObj(cols); extend(mainCol,tmp); extend(window,tmp);

var colsShowInd=['image','name','locale','timezone','homeTown'];


var userInfoFrDB=extend({}, specialistDefault);
var userInfoFrIP={};

var {Prop, StrOrderFilt, strFirstSort, boAscFirstSort}=site;
var KeyProp=Object.keys(Prop), nProp=KeyProp.length;   
var KeySel=filterPropKeyByB(Prop,bFlip.DBSel);


var StrOrderFiltFlip=array_flip(StrOrderFilt);
var arrOption=site.Option, nOption=arrOption.length;
var boAppIP=site.typeApp=='ip';
var boAppGoogle=site.typeApp=='google';
var boAppFB=site.typeApp=='fb';
var boAppOI=site.typeApp=='oi';


var {boTLS,siteName}=site;
var strScheme='http'+(boTLS?'s':''),    strSchemeLong=strScheme+'://',    uSite=strSchemeLong+site.wwwSite,     uCommon=strSchemeLong+wwwCommon,    uBE=uSite+"/"+leafBE;

var uLogin=uSite+"/"+leafLogin;
var uCanonical=uSite;

var CSRFCode='';

var curTime=0;

//langHtml.MaxXVotes=langHtml.MaxXVotes.replace(/<span><\/span>/,maxVotes);  if(maxVotes==1) langHtml.MaxXVotes=langHtml.OnlyOneVote;


//uCanonical=location.origin;
var uCanonical=uSite;
 
var uImageFolder=uCommon+'/'+flImageFolder+'/';

var uImCloseW=uImageFolder+'triangleRightW.png';
var uImOpenW=uImageFolder+'triangleDownW.png';
var uImCloseB=uImageFolder+'triangleRight.png';
var uImOpenB=uImageFolder+'triangleDown.png';

var uHelpFile=uImageFolder+'help.png';
var uVipp0=uImageFolder+'vipp0.png';
var uVipp1=uImageFolder+'vipp1.png';
var uFB=uImageFolder+'fb.png';
var uFBFacebook=uImageFolder+'fbFacebook.png';
var uGoogle=uImageFolder+'google.jpg';
var uGoogleButton=uImageFolder+'googleButton.gif';
var uIncreasing=uImageFolder+'increasing.png';
var srcsetIncreasing=uIncreasing+" 1x, "+uIncreasing+" 2x ";
var uDecreasing=uImageFolder+'decreasing.png';
var srcsetDecreasing=uDecreasing+" 1x, "+uDecreasing+" 2x ";
var uUnsorted=uImageFolder+'unsorted.png';
var srcsetUnsorted=uUnsorted+" 1x, "+uUnsorted+" 2x ";
var uOpenId=uImageFolder+'openid-inputicon.gif';
var uOI22=uImageFolder+'oi22.png';
var uBusy=uImageFolder+'busy.gif';
var uBusyLarge=uImageFolder+'busyLarge.gif';
var uDelete=uImageFolder+'delete.png';
var uDelete1=uImageFolder+'delete1.png';
var uList16=uImageFolder+'list16.png';
var srcsetList=uList16+" 1x, "+uList16+" 2x";
var uFilter=uImageFolder+'filter.png';
var uDummy=uImageFolder+'dummy.gif';


//var maxWidth='800px';
var maxWidth='var(--maxWidth)';

var colMenuOn='#aaa', colMenuOff='#ddd'; 
var colMenuBOn='#616161', colMenuBOff='#aaa';    





//var messageText=messExtend(createElement('span'));  window.setMess=messageText.setMess;  window.resetMess=messageText.resetMess;  elBody.append(messageText);

var imgBusy=createElement('img').prop({src:uBusy, alt:"busy"});
//var spanMessageText=spanMessageTextCreate();  window.setMess=spanMessageText.setMess;  window.resetMess=spanMessageText.resetMess;  window.appendMess=spanMessageText.appendMess;  elBody.append(spanMessageText)

var divMessageText=divMessageTextCreate();  copySome(window, divMessageText, ['setMess', 'resetMess', 'appendMess']);
var divMessageTextWInner=createElement('div').myAppend(divMessageText).css({margin:'0em auto', width:'100%', 'max-width':maxWidth, 'text-align':'center', position:'relative'});
var divMessageTextW=createElement('div').myAppend(divMessageTextWInner).css({width:'100%', position:'fixed', bottom:'0px', left:'0px', 'z-index':'10'});
elBody.append(divMessageTextW);

var busyLarge=createElement('img').prop({src:uBusyLarge, alt:"busy"}).css({position:'fixed',top:'50%',left:'50%','margin-top':'-42px','margin-left':'-42px','z-index':'1000',border:'black solid 1px'}).hide();
elBody.append(busyLarge);



addStuffMy();

var tmp=getItem('boFirstVisit'),  boFirstVisit=tmp===null;      setItem('boFirstVisit',0);


var boFirstAJAX=true;

app.imgHelp=createElement('img').prop({src:uHelpFile, alt:"help"}).css({'vertical-align':'-0.4em'});
app.hovHelpMy=createElement('span').myText('❓').addClass('btn-round', 'helpButtonGradient').css({color:'transparent', 'text-shadow':'0 0 0 #5780a8'});
app.imgHelp=hovHelpMy;


app.helpBub={}; for(var i=0;i<nProp;i++){
  var strName=KeyProp[i], text='';
  if(strName in langHtml.helpBub)  text=langHtml.helpBub[strName];   
  if(text!='') { helpBub[strName]=createElement('div').myHtml(text); }
}

var boUseTimeDiff={created:1,lastActivity:1};

elBody.css({padding:'0 0 0 0'});
elBody.css({margin:'0 0 0 0'});


  //
  // History
  //
  
var strHistTitle='nsVote';

var histList=[];
var stateLoaded=history.state;
var tmpi=stateLoaded?stateLoaded.ind:0,    stateLoadedNew={hash:randomHash(), ind:tmpi};
history.replaceState(stateLoadedNew, '', uCanonical);
var stateTrans=stateLoadedNew;
history.StateMy=[];

window.on('popstate', function(event) {
  var dir=history.state.ind-stateTrans.ind;
  //if(Math.abs(dir)>1) {debugger; alert('dir=',dir); }
  var boSameHash=history.state.hash==stateTrans.hash;
  if(boSameHash){
    var tmpObj=history.state;
    if('boResetHashCurrent' in history && history.boResetHashCurrent) {
      tmpObj.hash=randomHash();
      history.replaceState(tmpObj, '', uCanonical);
      history.boResetHashCurrent=false;
    }

    var stateMy=history.StateMy[history.state.ind];
    if(typeof stateMy!='object' ) {
      var tmpStr=window.location.href +" Error: typeof stateMy: "+(typeof stateMy)+', history.state.ind:'+history.state.ind+', history.StateMy.length:'+history.StateMy.length+', Object.keys(history.StateMy):'+Object.keys(history.StateMy);
      if(!boEpiphany) alert(tmpStr); else  console.log(tmpStr);
      debugger;
      return;
    }
    var view=stateMy.view;
    view.setVis();
    if(typeof view.getScroll=='function') {
      var scrollT=view.getScroll();
      setTimeout(function(){window.scrollTop(scrollT);}, 1);
    } else {
      //var scrollT=stateMy.scroll;  setTimeout(function(){  window.scrollTop(scrollT);}, 1);
    }
    
    if('funOverRule' in history && history.funOverRule) {history.funOverRule(); history.funOverRule=null;}
    else{
      if('fun' in stateMy && stateMy.fun) {var fun=stateMy.fun(stateMy); }
    }

    stateTrans=extend({}, tmpObj);
  }else{
    stateTrans=history.state; extend(stateTrans, {hash:randomHash()}); history.replaceState(stateTrans, '', uCanonical);
    history.go(sign(dir));
  }
});
if(boFF){
  window.on('beforeunload', function(){   });
}






window.objFilterSetting={colButtAllOn:'#9f9', colButtOn:'#0f0', colButtOff:'#ddd', colFiltOn:'#bfb', colFiltOff:'#ddd', colFontOn:'#000', colFontOff:'#777', colActive:'#65c1ff', colStapleOn:'#f70', colStapleOff:'#bbb', maxStaple:20};


var uInfo='https://emagnusandersson.com/nsVote'; 
var uSrc='https://github.com/emagnusandersson/nsVote';
var aLink=createElement('a').prop({href:uInfo}).myAppend('more info').css({'font-size':'100%','font-weight':'bold',margin:'0.1em 0em 1.5em',display:'inline-block'});   
  
var loginPop=loginPopExtend(createElement('div'));

var adminDiv=adminDivExtend(createElement('div')); 


var filts=[];//hists=[];


  // filterDivs
var filterInfoSpan=filterInfoSpanExtend(createElement('span'));
//filterInfoWrap=createElement('span').myAppend(filterInfoSpan);
//var tmpImg=createElement('img').prop({src:uFilter}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
//filterButton=createElement('button').myAppend(tmpImg,' (',filterInfoWrap,')').addClass('flexWidth').css({'float':'right','clear':'both'});//.css({background:colMenuOff});
var filterDiv=new FilterDiv(Prop, extend({},langHtml.label), StrOrderFilt, loadTabStart);
filterDiv.css({'background-color':'#eee','padding-bottom':'0.6em'});


//rowButtCom=rowButtComExtend({});

  // voterListDivs  
var columnSelectorDiv=createElement('div');//columnSelectorDivExtend(createElement('div'));
var columnSorterDiv=createElement('div');//columnSorterDivExtend(createElement('div'));
var voterInfoDiv=voterInfoDivExtend(createElement('div'));

//var iframeLike=createElement('iframe');

var tmpImg=createElement('img').prop({srcset:srcsetList, alt:"list"}).css({height:'0.9em','vertical-align':'middle'});
var tableButton=createElement('button').myAppend(tmpImg).css({'margin-right':'1em'}).prop({'aria-label':"List of voters"});

var butAdmin=createElement('button').myText('≡').css({'margin-left':'0.6em','margin-right':'1em'}).on('click',function(){ 
  adminDiv.setVis(); doHistPush({view:adminDiv});
}).hide();


var voterListHead=voterListHeadExtend(createElement('div')).css({padding:'0 0.3em','text-align':'left'});
var voterListTHead=voterListTHeadExtend(createElement('thead')).css({'text-align':'center'});  
var voterListDiv=voterListDivExtend(createElement('div'));  voterListDiv.css({margin:'0em 0 0.9em 0'});  voterListDiv.table.css({border:'black 1px solid'}); //,display:'table'
voterListDiv.table.prepend(voterListTHead);

var summaryDiv=elBody.querySelector('#summaryDiv');
summaryDiv.querySelector('noscript').detach();

var divEntryBar=summaryDiv.querySelector('#divEntryBar');
divEntryBarExtend(divEntryBar); divEntryBar.css({flex:'0 0 auto', padding:'0em'}); //, , visibility:'hidden'
var divLoginInfo=divLoginInfoExtend(createElement('div')).addClass('mainDivR').css({flex:'0 0 auto', 'min-height':'2rem'}).hide();  //, 'line-height':'1.6em'
divEntryBar.after(divLoginInfo);

summaryDivExtend(summaryDiv);
summaryDiv.filterInfoWrap.myAppend(filterInfoSpan);


rewriteObj();

filterDiv.divCont.createDivs();  //filterDiv.divCont.filtsClearSetup(); filterDiv.divCont.filtsDefault();  filterDiv.divCont.histsClearSetup();
voterListDiv.createTBody();   voterListDiv.setRowDisp();  voterListDiv.css({margin:'0em 0 0.9em 0'});
voterListTHead.myCreate();
voterInfoDiv.createContainers();





var MainDiv=[summaryDiv, voterListHead, voterListDiv, filterDiv, adminDiv, voterInfoDiv, columnSelectorDiv, columnSorterDiv, loginPop]; //, divEntryBar, divLoginInfo, H1, 


var tmpCss={'border-top':'1px solid white', 'margin-left':'auto', 'margin-right':'auto','text-align':'left',background:'#fff'};   
MainDiv.forEach(ele=>ele.css(tmpCss));
AMinusB(MainDiv, [voterListDiv]).forEach(ele=>ele.css({'max-width':maxWidth}));

voterListDiv.css({'text-align':'center', 'min-width':'800px',display:'inline-block','text-align':'left'});
voterListDiv.querySelector('table').css({'margin-top':'1em'});

//H1.css({background:'#ff0',border:'solid 1px',color:'black','font-size':'1.6em','font-weight':'bold','text-align':'center', padding:'0.4em 0em 0.4em 0em'}); 

AMinusB(MainDiv, [summaryDiv]).forEach(ele=>ele.hide());

elBody.append(...MainDiv);  

history.StateMy[history.state.ind]={view:summaryDiv};


var voterListButtonClick=function(){ 
 voterListDiv.setVis();  doHistPush({view:voterListDiv}); 
}
var filterButtonClick=function(){ 
 filterDiv.setVis(); doHistPush({view:filterDiv});
}
tableButton.on('click',voterListButtonClick);


summaryDiv.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  summaryDiv.filterInfoWrap.append(filterInfoSpan);
  return true;
}
voterListDiv.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show(); voterListHead.show();
  voterListHead.filterInfoWrap.append(filterInfoSpan);
  return true;
}
filterDiv.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  filterDiv.filterInfoWrap.append(filterInfoSpan);
  return true;
}
voterInfoDiv.setVis=function(){
  if(voterInfoDiv.boLoaded==0) return false;
  MainDiv.forEach(ele=>ele.hide()); this.show();
  return true;
}
adminDiv.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  return true;
}
columnSelectorDiv.setVis=function(){
  if(columnSelectorDiv.boLoaded==0) return false;
  MainDiv.forEach(ele=>ele.hide()); this.show();
  return true;
}
columnSorterDiv.setVis=function(){
  if(columnSorterDiv.boLoaded==0) return false;
  MainDiv.forEach(ele=>ele.hide()); this.show();
  return true;
}



var vec=[['specSetup',{}],['setUp',{}],['setUpCond',{Filt:filterDiv.divCont.gatherFiltData()},voterListDiv.setUpCondRet],['getList',{offset:0,rowCount:maxVoterDisp},voterListDiv.getListRet],['getHist',null,getHistRet]];   majax(vec);
setMess('... fetching data... ',0,true);


}



