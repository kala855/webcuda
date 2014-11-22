function guardarCodigo(){
  code = editor.getValue();
  jQuery.post( document.URL+"/saveCode", {source: code},function (d, textStatus, jqXHR) {
    alert(d);
  });
}
