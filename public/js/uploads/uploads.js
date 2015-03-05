console.log("hola");
function downloads(file) {
  var url = document.URL;// + '/downloads';
  console.log(url);
  jQuery.post(url, {file : file}, function(d, textStatus, jqXHR){
    alert(JSON.stringify(d.data));
    //location.reload();
  }).fail(function(d, textStatus, jqXHR){
    if (d.responseJSON)
      alert(JSON.stringify(d.responseJSON.error));
    else
      alert('Error');
  });
}
