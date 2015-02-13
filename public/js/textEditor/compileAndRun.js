function compileAndRun(){
  code = editor.getValue();
  $('#compile').attr('disabled','disabled');
  jQuery.post( document.URL+"/compileAndRun",{source : code} ,function (d, textStatus, jqXHR) {
    document.getElementById("textAreaCompileError").value = d;
    $('#compile').removeAttr('disabled');
  });

}
