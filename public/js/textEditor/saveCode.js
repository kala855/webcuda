function guardarCodigo(){
  code = editor.getValue();
  var name = $('#cname').text() ;
  if(name == "Unsaved"){
    name = prompt("Ingrese el nombre del archivo");
  }
  //name = $("input:text").val();
  console.log(name);
  if(name.length > 0){
    jQuery.post( document.URL+"/saveCode", {source: code, fileName : name},function (d, textStatus, jqXHR) {
      console.log(d);
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
