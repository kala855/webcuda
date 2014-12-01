function compilarCodigo(){
  var flags = '2';
  jQuery.post( document.URL+"/compileCode", {source: flags},function (d, textStatus, jqXHR) {
   //alert(d.stderror);

   document.getElementById("textAreaCompileError").value = d.stderror;
   //document.getElementById("textArea")

  });
}
