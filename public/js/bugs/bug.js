function resolve(id) {
  var url = document.URL + '/../solve';
  console.log(url);
  jQuery.post(url, {id:id}, function(d, textStatus, jqXHR){
    alert(JSON.stringify(d.data));
    location.reload();
  }).fail(function(d, textStatus, jqXHR){
    if (d.responseJSON)
      alert(JSON.stringify(d.responseJSON.error));
    else
      alert('Error');
  });
}

