function ejecutarCodigo(){
  var flags = '2';
  jQuery.post( document.URL+"/runCode", {source: flags},function (d, textStatus, jqXHR) {
    alert(d);
  });
}
