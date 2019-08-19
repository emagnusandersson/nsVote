
   // Created by Erik Magnus Andersson 2018
   
sin=Math.sin; cos=Math.cos; tan=Math.tan; atan=Math.atan; atan2=Math.atan2; sqrt=Math.sqrt; abs=Math.abs; max=Math.max; min=Math.min; round=Math.round;

  //
  // Note! Prefixes: e=elementwise, v=vectorwise:
  //
sqr=function(x){return x*x;}
hypot=function(xy){return sqrt(xy[0]*xy[0]+xy[1]*xy[1]);}
fix=function(x){return x|0;} // How does this work: "Bitwise OR" only makes sense on integers, so this operation casts the value to an integer.
sign=function(x) {  return (x > 0) - (x < 0);}
vCopy=function(v){ return v.concat([]);}
eSqr=function(v){ return v.map(function(x) { return x*x; }); }
eMult=function(v,w){ return v.map(function(x,i) { return x*w[i]; }); }
eMultSc=function(v,k){ return v.map(function(x) { return x*k; }); }
eAdd=function(v,w){ return v.map(function(x,i) { return x+w[i]; }); }
eAddSc=function(v,k){ return v.map(function(x) { return x+k; }); }
eSub=function(v,w){ return v.map(function(x,i) { return x-w[i]; }); }
eSubSc=function(v,k){ return v.map(function(x) { return x-k; }); }
eAssign=function(v,ind,w){ // Note! changes v
  var len=ind.length;
  for(var i=0;i<len;i++)   v[ind[i]]=w[i];
  return v;
}
eInd=function(V,ind) { // return a vector with values at indexes ind
  var n=ind.length, els=Array(n);
  ind.forEach(function(x, i) { els[i]=V[x]; });
  return els;
}
 
vEnd=function(V){return V[V.length-1];}
vSum=function(V){var s=0; V.forEach(function(x){s+=x;}); return s; }
vDot=function(V,W){var s=0; V.forEach(function(x,i){s+=x*W[i];}); return s; }
find=function(V) { // Returns indexes of nonzero elements
  var W=[];
  V.forEach(function(x,i) { if(x) W.push(i);});
  return W;
}
Mat={};
Mat.eSqr=function(M){ return M.map(function(V) { return eSqr(V); }); }
Mat.eMult=function(M,N){ return M.map(function(V,i) { return eMult(V,N[i]); }); }
Mat.eMultSc=function(M,k){ return M.map(function(V) { return eMultSc(V,k); }); }
Mat.eAdd=function(M,N){ return M.map(function(V,i) { return eAdd(V,N[i]); }); }
Mat.eAddSc=function(M,k){ return M.map(function(V) { return eAddSc(V,k); }); }
Mat.eSub=function(M,N){ return M.map(function(V,i) { return eSub(V,N[i]); }); }
Mat.eSubSc=function(M,k){ return M.map(function(V) { return eSubSc(V,k); }); }
Mat.Rot=function(a){ return [[cos(a), -sin(a)],[sin(a), cos(a)]];}
Mat.copy=function(M){ return M.map(function(V) { return vCopy(V); }); }
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
repVal=function(val,n) {    var Out=Array(n);  for(var i=0;i<n;i++) Out[i]=val;  return Out;   }
repCol=function(V,nCol) {  
  var nRow=V.length, Out=Array(nRow);
  for(var i=0;i<nRow;i++){
    Out[i]=Array(nCol);   for(var j=0;j<nCol;j++){ Out[i][j]=V[i]; }
  }
  return Out;
}
repRow=function(V,nRow) {  
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
