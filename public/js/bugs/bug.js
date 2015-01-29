function resolve(id) {

  var url = base_url + '/bugs/solve';
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

function retrieveAll() {
  //TODO
  alert("Esta función aún no está soportada ):");
}
