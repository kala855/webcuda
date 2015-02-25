function compileAndRun(){
  code = editor.getValue();
  $('#compile').attr('disabled','disabled');
  jQuery.post( document.URL+"/../compileAndRun",{source : code} ,function (d, textStatus, jqXHR) {
    document.getElementById("textAreaCompileError").value = d;
    $('#compile').removeAttr('disabled');
  }).fail(function(d, textStatus, jqXHR) {
    console.log('--\n'+d+'\n--');
    console.log(textStatus);
    console.log('++\n'+jqXHR+'\n++');
    if (d.responseJSON)
      alert(JSON.stringify(d.responseJSON.error));
    else
      alert('Error');
  });

}
