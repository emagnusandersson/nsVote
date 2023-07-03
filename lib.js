"use strict"

//var app;  if(typeof window!=='undefined') app=window; else if(typeof global!=='undefined') app=global; else app=self;  // if browser else if server else serviceworker

globalThis.app=globalThis;

Promise.prototype.toNBP=function(){   return this.then(a=>{return [null,a];}).catch(e=>{return [e];});   }  // toNodeBackPromise



//
// String
//

app.ucfirst=function(string){  return string.charAt(0).toUpperCase() + string.slice(1);  }
app.lcfirst=function(string){  return string.charAt(0).toLowerCase() + string.slice(1);  }
app.isAlpha=function(star){  var regEx = /^[a-zA-Z0-9]+$/;  return str.match(regEx); } 
if(!String.format){
  String.format = function(format){
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number){ 
      return typeof args[number]!='undefined' ? args[number]:match;
    });
  };
}


//pad2=function(n){ return ('0'+n).slice(-2);}
app.pad2=function(n){return (n<10?'0':'')+n;}
app.calcLabel=function(Label,strName){ var strLabel=ucfirst(strName); if(strName in Label) strLabel=Label[strName]; return strLabel;}



//
// Array
//

app.arr_max=function(arr){return Math.max.apply(null, arr);}
app.arr_min=function(arr){return Math.min.apply(null, arr);}

app.arrArrange=function(arrV,arrI){
  var arrNew=[]; if(typeof arrV=='string') arrNew='';
  //for(var i=0;i<arrI.length;i++){    arrNew.push(arrV[arrI[i]]);    }
  for(var i=0;i<arrI.length;i++){    arrNew[i]=arrV[arrI[i]];    }
  return arrNew;
}

//intersectionAB=function(A,B){return A.filter(function(ai){return B.indexOf(ai)!=-1;});}  // Loop through A; remove ai that is not in B
//removeBFrA=function(A,B){return A.filter(function(ai){return B.indexOf(ai)==-1;});}  // Loop through A; remove ai that is in B
app.intersectionAB=function(A,B){var Rem=[]; for(var i=A.length-1;i>=0;i--){var a=A[i]; if(B.indexOf(a)==-1) A.splice(i,1); else Rem.push(a);} return Rem.reverse();}  // Changes A, returns the remainder
app.AMinusB=function(A,B){var ANew=[]; for(var i=0;i<A.length;i++){var a=A[i]; if(B.indexOf(a)==-1) ANew.push(a);} return ANew;}  // Does not change A, returns ANew
app.removeBFrA=function(A,B){var Rem=[]; for(var i=A.length-1;i>=0;i--){var a=A[i]; if(B.indexOf(a)==-1) Rem.push(a); else A.splice(i,1);} return Rem.reverse();}  // Changes A, returns the remainder
app.myIntersect=function(A,B){var arrY=[],arrN=[]; for(var i=0; i<A.length; i++){var a=A[i]; if(B.indexOf(a)==-1) arrN.push(a); else arrY.push(a);} return [arrY,arrN];}  
app.intersectBool=function(A,B){for(var i=0; i<A.length; i++){if(B.indexOf(A[i])!=-1) return true;} return false;}  
app.isAWithinB=function(A,B){ for(var i=0; i<A.length; i++){if(B.indexOf(A[i])==-1) return false;} return true;}  


app.mySplice1=function(arr,iItem){ var item=arr[iItem]; for(var i=iItem, len=arr.length-1; i<len; i++)  arr[i]=arr[i+1];  arr.length = len; return item; }  // GC-friendly splice
app.myCopy=function(arr,brr){  if(typeof arr=="undefined") arr=[]; for(var i=0, len=brr.length; i<len; i++)  arr[i]=brr[i];  arr.length = len; return arr; }  // GC-friendly copy
//myCopy=function(arr,brr){  if(typeof arr=="undefined") arr=[]; arr.length=0; arr.push.apply(arr,brr);  }  // GC-friendly copy
app.myCompare=function(arr,brr){  var la=arr.length,lb=brr.length; if(la!=lb) return false; for(var i=0; i<la; i++)  if(arr[i]!=brr[i]) return false;  return true;}  // compare
  

app.addIndexColumn=function(M){    var Mt=Array();     for(var i=0;i<M.length;i++){  var tmp=[(i+1).toString()];   Mt[i]=tmp.concat(M[i]);  }       return Mt;      }
app.arrCopy=function(A){return [].concat(A);}

app.arrarrCopy=function(B){var A=[]; for(var i=0;i<B.length;i++){ A[i]=[].concat(B[i]);} return A; }

app.array_removeInd=function(a,i){a.splice(i,1);}

app.array_splice=function(arr,st,len,arrIns){
  [].splice.apply(arr, [st,len].concat(arrIns));
}
app.array_merge=function(){  return Array.prototype.concat.apply([],arguments);  } // Does not modify origin
//array_mergeM=function(a,b){  a.push.apply(a,b); return a; } // Modifies origin (first argument)
app.array_mergeM=function(){var t=[], a=arguments[0], b=t.slice.call(arguments, 1), c=t.concat.apply([],b); t.push.apply(a,c); return a; } // Modifies origin (first argument)

app.array_flip=function(A){ var B={}; for(var i=0;i<A.length;i++){B[A[i]]=i;} return B;}
app.array_fill=function(n, val){ return Array.apply(null, new Array(n)).map(String.prototype.valueOf,val); }

app.is_array=function(a){return a instanceof Array;}
app.in_array=function(needle,haystack){ return haystack.indexOf(needle)!=-1;}
app.array_filter=function(A,f){f=f||function(a){return a;}; return A.filter(f);}


app.range=function(min,max,step){ var n=(max-min)/step; return Array.apply(null, Array(n)).map(function(trash, i){return min+i*step;}); }

app.eliminateDuplicates=function(arr){
  var i, len=arr.length, out=[], obj={};
  for (i=0;i<len;i++){ obj[arr[i]]=0; }
  for (i in obj){ out.push(i); }
  return out;
}
app.arrValMerge=function(arr,val){  var indOf=arr.indexOf(val); if(indOf==-1) arr.push(val); }
//arrValRemove=function(arr,val){  var indOf=arr.indexOf(val); if(indOf!=-1) arr.splice(indOf,1); }
app.arrValRemove=function(arr,val){  var indOf=arr.indexOf(val); if(indOf!=-1) mySplice1(arr,indOf); }

app.stepN=function(start,n,step){ if(typeof step=='undefined') step=1;  var arr=Array(n),ii=start; for(var i=0;i<n;i++){ arr[i]=ii;ii+=step;} return arr; }





//
// Str (Array of Strings)
//

app.StrComp=function(A,B){var lA=A.length; if(lA!==B.length) return false; for(var i=0;i<lA;i++){ if(A[i]!==B[i]) return false;} return true;}
app.Str_insertM=function(arr,strRefVal,arrIns,boBefore){
  var i=arr.indexOf(strRefVal); if(i==-1) throw 'bla';  if(typeof boBefore=='undefined' || boBefore==0) i++; 
  if(!(arrIns instanceof Array)) arrIns=[arrIns];
  array_splice(arr, i, 0, arrIns);
}
app.Str_moveM=function(arr,strRefVal,arrMove,boBefore){
  if(!(arrMove instanceof Array)) arrMove=[arrMove];
  removeBFrA(arr,arrMove);
  Str_insertM(arr,strRefVal,arrMove,boBefore);
  //return arrRem;
}




//
// Object
//

app.extend=Object.assign;
app.object_values=function(obj){
  var arr=[];      for(var name in obj) arr.push(obj[name]);
  return arr;
}

app.copy=function(o, isdeep){
    if (o===undefined || o===null || ['string', 'number', 'boolean'].indexOf(typeof o)!==-1)
        return o;
    var n= o instanceof Array? [] :{};
    for (var k in o)
        if (o.hasOwnProperty(k))
            n[k]= isdeep? copy(o[k], isdeep) : o[k];
    return n;
}
app.copySome=function(a,b,Str){for(var i=0;i<Str.length;i++) { var name=Str[i]; a[name]=b[name]; } return a; }

/////////////////////////////////////////////////////////////////////


//extractLoc=function(obj,strObjName){   // Ex: eval(extractLoc(objMy,'objMy'));
  //var Str=[];  for(var key in obj) Str.push(`${key}=${strObjName}.${key}`);
  //var str=''; if(Str.length) str='var '+Str.join(', ')+';';  return str;
//}
////extract=function(obj){  for(var key in obj){  window[key]=obj[key];  }  }
//extract=function(obj,par){
  //if(typeof par=='undefined') par=app; for(var key in obj){
    //par[key]=obj[key];
  //}
//}
//extractLocSome=function(strObjName,arrSome){  // Ex: eval(extractLocSome('objMy',['a','b']));
  //if(typeof arrSome=='string') arrSome=[arrSome];
  //var len=arrSome.length, Str=Array(len);  for(var i=0;i<len;i++) { var key=arrSome[i]; Str[i]=`${key}=${strObjName}.${key}`; }
  //return 'var '+Str.join(', ')+';';
//}


//
// Dates and time
//

Date.prototype.toUnix=function(){return Math.round(this.valueOf()/1000);}
Date.prototype.toISOStringMy=function(){return this.toISOString().substr(0,19);}
app.swedDate=function(tmp){ if(tmp){tmp=UTC2JS(tmp);  tmp=`${tmp.getFullYear()}-${pad2(tmp.getMonth()+1)}-${pad2(tmp.getDate())}`;}  return tmp;}
app.UTC2JS=function(utcTime){ var tmp=new Date(Number(utcTime)*1000);  return tmp;  }
app.UTC2Readable=function(utcTime){ var tmp=new Date(Number(utcTime)*1000);   return tmp.toLocaleString();  }
app.unixNow=function(){return (new Date()).toUnix();}

app.getSuitableTimeUnit=function(t){ // t in seconds
  var tAbs=Math.abs(t), tSign=t>=0?+1:-1;
  if(tAbs<=90) return [tSign*tAbs,'s'];
  tAbs/=60; // t in minutes
  if(tAbs<=90) return [tSign*tAbs,'m']; 
  tAbs/=60; // t in hours
  if(tAbs<=36) return [tSign*tAbs,'h'];
  tAbs/=24; // t in days
  if(tAbs<=2*365) return [tSign*tAbs,'d'];
  tAbs/=365; // t in years
  return [tSign*tAbs,'y'];
}
app.getSuitableTimeUnitStr=function(tdiff,objLang=langHtml.timeUnit,boLong=0,boArr=0){
  var [ttmp,u]=getSuitableTimeUnit(tdiff), n=Math.round(ttmp);
  var strU=objLang[u][boLong][Number(n!=1)];
  if(boArr){  return [n,strU];  } else{  return n+' '+strU;   }
}
Date.prototype.floorDay=function(){ this.setHours(0); this.setMinutes(0); this.setSeconds(0); this.setMilliseconds(0); return this;}



//
// Random
//

app.randomInt=function(min, max){    return min + Math.floor(Math.random() * (max - min + 1));  } // Random integer in the intervall [min, max] (That is including both min and max)
app.randomHash=function(){ return Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);}

app.gauss=function(){   // returns random number with normal distribution N(0,1)  (mean=0,  std dev=1)
  var x=Math.random(), y=Math.random();

  // two independent variables with normal distribution N(0,1)
  var u=Math.sqrt(-2*Math.log(x))*Math.cos(2*Math.PI*y);
  var v=Math.sqrt(-2*Math.log(x))*Math.sin(2*Math.PI*y);

  // i will return only one, couse only one needed
  return u;
}

app.gauss_ms=function(m,s){  // returns random number with normal distribution: N(m,s)  (mean=m,  std dev=s)
  if(typeof m=='undefined') m=0; if(typeof s=='undefined') s=1;
  return gauss()*s+m;
}
app.genRandomString=function(len) {
  //var characters = 'abcdefghijklmnopqrstuvwxyz';
  var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var str ='';    
  for(var p=0; p<len; p++) {
    str+=characters[randomInt(0, characters.length-1)];
  }
  return str;
}

//
// Math
//


app.isNumber=function(n){ return !isNaN(parseFloat(n)) && isFinite(n);}
app.sign=function(val){if(val<0) return -1; else if(val>0) return 1; else return 0;}











if (typeof(Number.prototype.toRad) === "undefined") {  Number.prototype.toRad = function() {  return this * Math.PI / 180; }   }

app.distCalc=function(lng1,lat1,lng2,lat2){
  var R = 6371; // km
  //var dLat = (lat2-lat1).toRad();
  //var dLng = (lng2-lng1).toRad();
  var lng1 = Number(lng1).toRad(),  lat1 = Number(lat1).toRad();
  var lng2 = Number(lng2).toRad(),  lat2 = Number(lat2).toRad();
  var dLat = lat2-lat1,   dLng = lng2-lng1;

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}
app.bound=function(value, opt_min, opt_max){
  if (opt_min != null) value = Math.max(value, opt_min);
  if (opt_max != null) value = Math.min(value, opt_max);
  return value;
}

app.degreesToRadians=function(deg) {  return deg*(Math.PI/180);  }
app.radiansToDegrees=function(rad) {  return rad/(Math.PI/180);  }



//
// Data Formatting
//

app.arrObj2TabNStrCol=function(arrObj){ //  Ex: [{abc:0,def:1},{abc:2,def:3}] => {tab:[[0,1],[2,3]],StrCol:['abc','def']}
    // Note! empty arrObj returns {tab:[]}
  var Ou={tab:[]}, lenI=arrObj.length, StrCol=[]; if(!lenI) return Ou;
  StrCol=Object.keys(arrObj[0]);  var lenJ=StrCol.length;
  for(var i=0;i<lenI;i++) {
    var row=arrObj[i], rowN=Array(lenJ);
    for(var j=0;j<lenJ;j++){ var key=StrCol[j]; rowN[j]=row[key]; }
    Ou.tab.push(rowN);
  }
  Ou.StrCol=StrCol;
  return Ou;
}
app.tabNStrCol2ArrObj=function(tabNStrCol){  //Ex: {tab:[[0,1],[2,3]],StrCol:['abc','def']}    =>    [{abc:0,def:1},{abc:2,def:3}] 
    // Note! An "empty" input should look like this:  {tab:[]}
  var tab=tabNStrCol.tab, StrCol=tabNStrCol.StrCol, arrObj=Array(tab.length);
  for(var i=0;i<tab.length;i++){
    var row={};
    for(var j=0;j<StrCol.length;j++){  var key=StrCol[j]; row[key]=tab[i][j];  }
    arrObj[i]=row;
  }
  return arrObj;
}

app.deserialize=function(serializedJavascript){
  return eval(`(${serializedJavascript })`);
}

app.parseQS=function(str){
  var params = {},      regex = /([^&=]+)=([^&]*)/g, m;
  while (m = regex.exec(str)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  return params;
}
app.parseQS2=function(qs){
  var objQS={}, objTmp=new URLSearchParams(qs);
  for(const [name, value] of objTmp) {  objQS[name]=value;  }
  return objQS;
}

app.filterPropKeyByB=function(Prop, iBit){ // Check all Prop[strKey].b[iBit] for each strKey. Create an array with all strKey where Prop[strKey].b[iBit] is true.
  var KeyAll=Object.keys(Prop)
  var KeyOut=[];  for(var i=0;i<KeyAll.length;i++) { var key=KeyAll[i], b=Prop[key].b;   if(Number(b[iBit])) KeyOut.push(key);  }
  return KeyOut;
}


app.b64UrlDecode=function(b64UrlString, boUint8Array=false){  // boUint8Array==true => output is in Uint8Array
  const padding='='.repeat((4-b64UrlString.length%4) % 4);
  const base64=(b64UrlString+padding).replace(/\-/g, '+').replace(/_/g, '/');

  //const rawData=window.atob(base64);
  const rawData=Buffer.from(base64, 'base64').toString();
  if(!boUint8Array) return rawData;
  const outputArray=new Uint8Array(rawData.length);

  for(let i=0; i<rawData.length; ++i){ outputArray[i]=rawData.charCodeAt(i); }
  return outputArray;
}


//
// Escaping data
//

app.myJSEscape=function(str){return str.replace(/&/g,"&amp;").replace(/</g,"&lt;");}
  // myAttrEscape
  // Only one of " or ' must be escaped depending on how it is wrapped when on the client.
app.myAttrEscape=function(str){return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\//g,"&#47;");} // This will keep any single quataions.
app.myLinkEscape=function(str){ str=myAttrEscape(str); if(str.startsWith('javascript:')) str='javascript&#58;'+str.substr(11); return str; }


