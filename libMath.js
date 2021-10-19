
   // Created by Erik Magnus Andersson 2018
   
//sin=Math.sin; cos=Math.cos; tan=Math.tan; atan=Math.atan; atan2=Math.atan2; sqrt=Math.sqrt; abs=Math.abs; max=Math.max; min=Math.min; round=Math.round;
copySome(app,Math,["sin", "cos", "tan", "atan", "atan2", "sqrt", "abs", "max", "min", "round"]);

  //
  // Note! Prefixes: e=elementwise, v=vectorwise:
  //
app.sqr=x=>x*x;
app.hypot=xy=>sqrt(xy[0]*xy[0]+xy[1]*xy[1]);
app.fix=x=>x|0; // How does this work: "Bitwise OR" only makes sense on integers, so this operation casts the value to an integer.
app.sign=x=>(x>0)-(x<0);
app.vCopy=v=>v.concat([]);
app.eSqr=v=>v.map(x=>x*x);
app.eMult=(v,w)=>v.map((x,i)=>x*w[i]);
app.eMultSc=(v,k)=>v.map(x=>x*k);
app.eAdd=(v,w)=>v.map((x,i)=>x+w[i]);
app.eAddSc=(v,k)=>v.map(x=>x+k);
app.eSub=(v,w)=>v.map((x,i)=>x-w[i]);
app.eSubSc=(v,k)=>v.map(x=>x-k);
app.eAssign=function(v,ind,w){ // Note! changes v
  var len=ind.length;
  for(var i=0;i<len;i++)   v[ind[i]]=w[i];
  return v;
}
app.eInd=function(V,ind) { // return a vector with values at indexes ind
  var n=ind.length, els=Array(n);
  ind.forEach(function(x, i) { els[i]=V[x]; });
  return els;
}

app.vEnd=V=>V[V.length-1];
app.vSum=function(V){var s=0; V.forEach(function(x){s+=x;}); return s; }
app.vDot=function(V,W){var s=0; V.forEach(function(x,i){s+=x*W[i];}); return s; }
app.find=function(V) { // Returns indexes of nonzero elements
  var W=[];
  V.forEach(function(x,i) { if(x) W.push(i);});
  return W;
}
app.Mat={};
Mat.eSqr=M=>M.map(V=>eSqr(V));
Mat.eMult=(M,N)=>M.map((V,i)=>eMult(V,N[i]));
Mat.eMultSc=(M,k)=>M.map(V=>eMultSc(V,k));
Mat.eAdd=(M,N)=>M.map((V,i)=>eAdd(V,N[i]));
Mat.eAddSc=(M,k)=>M.map(V=>eAddSc(V,k));
Mat.eSub=(M,N)=>M.map((V,i)=>eSub(V,N[i]));
Mat.eSubSc=(M,k)=>M.map(V=>eSubSc(V,k));
Mat.Rot=a=>[[cos(a), -sin(a)],[sin(a), cos(a)]];
Mat.copy=M=>M.map(V=>vCopy(V));
Mat.getColInd=function(M,ind) { // return a Matrix with columns at indexes ind
  var m=M.length,n=ind.length, O=Array(m);
  for(var i=0;i<m;i++){ O[i]=Array(n); for(var j=0;j<n;j++){ O[i][j]=M[i][ind[j]]; } }
  return O;
}
Mat.getCol=function(M,j){ 
  var len=M.length,O=Array(j);
  for(var i=0;i<len;i++){  O[i]=M[i][j]; }
  return O;
}
Mat.setCol=function(M,j,V){ //obs changes M
  var len=M.length;   for(var i=0;i<len;i++){  M[i][j]=V[i]; }
}
Mat.createN1=function(V){   var len=V.length, O=Array(len);   for(var i=0;i<len;i++){  O[i]=[V[i]]; }  return O;  }
app.repVal=function(val,n) {    var Out=Array(n);  for(var i=0;i<n;i++) Out[i]=val;  return Out;   }
app.repCol=function(V,nCol) {  
  var nRow=V.length, Out=Array(nRow);
  for(var i=0;i<nRow;i++){
    Out[i]=Array(nCol);   for(var j=0;j<nCol;j++){ Out[i][j]=V[i]; }
  }
  return Out;
}
app.repRow=function(V,nRow) {  
  var nCol=V.length, Out=Array(nRow);
  for(var i=0;i<nRow;i++){
    Out[i]=Array(nCol);  for(var j=0;j<nCol;j++){ Out[i][j]=V[j]; }
  }
  return Out;
}
Mat.eye=function(n) {  
  var Out=Array(n);
  for(var i=0;i<n;i++){
    Out[i]=Array(n);  for(var j=0;j<n;j++){ var t=0; if(i==j) t=1; Out[i][j]=t; }
  }
  return Out;
}
Mat.createDiag=function(v) {  
  var n=v.length, Out=Array(n);
  for(var i=0;i<n;i++){
    Out[i]=Array(n);  for(var j=0;j<n;j++){ var t=0; if(i==j) t=v[i]; Out[i][j]=t; }
  }
  return Out;
}
Mat.getDiag=function(M) {  
  var n=M.length, Out=Array(n);
  for(var i=0;i<n;i++){ Out[i]=M[i][i]; }
  return Out;
}
Mat.mult=function(M,N) {
  var mM=M.length, mN=N.length, nM=M[0].length, nN=N[0].length, Out=Array(mM);
  for(var i=0;i<mM;i++){
    Out[i]=Array(nN);
    for(var j=0;j<nN;j++){
      Out[i][j]=0;  for(var k=0;k<nM;k++) Out[i][j]+=M[i][k]*N[k][j];
    }
  }
  return Out;
}
Mat.multV=function(M,V) {
  var mM=M.length, mV=V.length, nM=M[0].length,  Out=Array(mM);
  for(var i=0;i<mM;i++){
    Out[i]=0;  for(var k=0;k<nM;k++) Out[i]+=M[i][k]*V[k];
  }
  return Out;
}
Mat.eMultCol=function(M,V) { //same as Mat.eMult(M,repCol(V,M[0].length))
  var mM=M.length, mV=V.length, nM=M[0].length,  Out=Array(mM);
  for(var i=0;i<mM;i++){
    Out[i]=Array(nM);  for(var j=0;j<nM;j++) Out[i][j]=M[i][j]*V[i];
  }
  return Out;
}
Mat.eAddCol=function(M,V) { //same as Mat.eAdd(M,repCol(V,M[0].length))
  var mM=M.length, mV=V.length, nM=M[0].length,  Out=Array(mM);
  for(var i=0;i<mM;i++){
    Out[i]=Array(nM);  for(var j=0;j<nM;j++) Out[i][j]=M[i][j]+V[i];
  }
  return Out;
}
Mat.appendCol=function(M,V) { var nv=V.length;   for(var i=0;i<nv;i++){    M[i].push(V[i]); } return M; } //obs changes M
Mat.prependCol=function(M,V) { var nv=V.length;  for(var i=0;i<nv;i++){ M[i].unshift(V[i]); } return M; } //obs changes M
Mat.appendNCol=function(M,N) {  //obs changes M
  var m=M.length;
  for(var i=0;i<m;i++){    M[i].push.apply(M[i],N[i]);  }
  return M;
}
Mat.removeNCol=function(M,ind) {  //obs changes M
  var m=M.length, nInd=ind.length;
  for(var i=0;i<m;i++){
    for(var j=nInd-1;j>=0;j--){    M[i].splice(ind[j], 1);  }
  }
  return M;
}


Mat.flipCol=function(M) { // Returns a matrix with columns in opposite order
  var rows=M.length, cols=M[0].length;
  var Out = Array(rows);
  for(var i=0;i<rows;i++) { 
    Out[i] = Array(cols);
    for(var j=0;j<cols;j++) { 
      Out[i][j]=M[i][cols-j-1];
    }
  } 
  return Out;
}
Mat.transpose=function(M) { 
  var rows=M.length, cols=M[0].length;
  var Out = Array(cols);
  for(var j=0;j<cols;j++) { 
    Out[j] = Array(rows); for(var i=0;i<rows;i++) { Out[j][i]=M[i][j]; }
  } 
  return Out;
}
Mat.toVByCol=function(M){ // Going through the matrix columnwise, placing all elements in a single vector
  var m=M.length, n=M[0].length, O=Array(m*n);
  for(var j=0; j<n; j++){
    for(var i=0; i<nVal; i++){O[j*n+i]=M[i][j];}
  }
  return O;
}
Mat.toVByRow=function(M){ // Going through the matrix rowwise, placing all elements in a single vector
  var m=M.length, n=M[0].length, O=Array(m*n);
  O=[].concat.apply([],M);
  return O;
}
