function modifyActivation(checkBox, id) {
  var url = document.URL + (checkBox.checked ? '/activate' : '/deactivate');
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
  var r = confirm("are you sure?");
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
