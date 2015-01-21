function guardarCodigo(){
  code = editor.getValue();
  var name = $('#cname').text();
  if(name == " Unsaved "){
    bootbox.prompt("Ingrese el nombre del archivo", function(result) {
      if(result !== null){
        name = result;
        if(name.length > 0){
          jQuery.post( document.URL+"/saveCode", {source: code, fileName : name},function (d, textStatus, jqXHR) {
            document.getElementById("textAreaCompileError").value = d.msg;
            if(!d.err){
              $('#compilar').removeAttr('disabled');
              $('#cname').text(name);
            }
          });
        }else{
          bootbox.alert("Debe ingresar un nombre");
        }

      }
    });
  }
  //name = $("input:text").val();
}
