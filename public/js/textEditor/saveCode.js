function guardarCodigo(){
  code = editor.getValue();
  var name = $('#cname').text() ;
  if(name == "Unsaved"){
    name = prompt("Ingrese el nombre del archivo");
  }
  //name = $("input:text").val();
  if(name.length > 0){
    console.log(document.URL + "/saveCode");
    jQuery.post( document.URL+"/saveCode", {source: code, fileName : name},function (d, textStatus, jqXHR) {
      document.getElementById("textAreaCompileError").value = d.msg;
      if(!d.err){
        $('#compilar').removeAttr('disabled');
        $('#cname').text(name);
      }
    });
  }else{
    alert("Debe seleccionar un nombre");
  }
}
