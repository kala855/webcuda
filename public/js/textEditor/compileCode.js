function compilarCodigo(){
  var flags = '2';
  var name = $('#cname').text();
  console.log(name);
  jQuery.post( document.URL+"/compileCode", {source: flags, cname : name},function (d, textStatus, jqXHR) {
   //alert(d.stderror);
    document.getElementById("textAreaCompileError").value = d;
    //if(d.stderror.length == 0){
      //$('#ejecutar').removeAttr('disabled');
      //document.getElementById("textAreaCompileError").value = "Compilado exitosamente";
    //}
   //document.getElementById("textArea")

  });
}