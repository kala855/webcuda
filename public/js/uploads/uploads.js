function downloads(file) {
  var url = document.URL;// + '/downloads';
  jQuery.post(url, {file : file}, function(d, textStatus, jqXHR){
    alert('x');
    console.log(jqXHR);
    //location.reload();
  }).fail(function(d, textStatus, jqXHR){
    if (d.responseJSON)
      alert(JSON.stringify(d.responseJSON.error));
    else
      alert('Error');
    location.reload();
  });
}
