function modifyActivation(checkBox, id) {
  var url = document.URL + '/../admin' + (checkBox.checked ? '/activate' : '/deactivate');
  jQuery.get(url, {id : id}, function(d, textStatus, jqXHR) {
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
    jQuery.ajax({
      url     : document.URL + '/../admin/del/' + id ,
      type    : 'DELETE',
      success : function(result) {
        alert(result.data);
        location.reload();
      },
      fail : function (result) {
        alert(result.resposeText.error);
      }
    });
  }
}
