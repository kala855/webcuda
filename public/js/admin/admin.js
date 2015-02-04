function modifyActivation(checkBox, id) {
  console.log('aaaa');
  console.log(document.URL);
  var url = document.URL + (checkBox.checked ? '/activate' : '/deactivate');
  console.log(url);
  jQuery.post(url, {id:id}, function(d, textStatus, jqXHR) {
    alert(JSON.stringify(d.data));
    location.reload();
  }).fail(function(d, textStatus, jqXHR) {
    if (d.responseJSON)
      alert(JSON.stringify(d.responseJSON.error));
    else
      alert('Error');
  });
}

function deleteUser(user) {
  var id = user.value;
  var r = confirm("¿Está seguro?");
  if (r == true) {
    var url = document.URL + '/del/' + id;
    jQuery.post(url,function(d, textStatus, jqXHR){
      alert(JSON.stringify(d.data));
      location.reload();
    }).fail(function(d, textStatus, jqXHR) {
      if (d.responseJSON)
        alert(JSON.stringify(d.responseJSON.error));
      else
        alert('Error');
    });
  }
}
