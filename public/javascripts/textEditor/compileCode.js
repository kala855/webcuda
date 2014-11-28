function compilarCodigo(){
  var flags = '2';
  jQuery.post( document.URL+"/compileCode", {source: flags},function (d, textStatus, jqXHR) {
   alert(d);
  });
}
