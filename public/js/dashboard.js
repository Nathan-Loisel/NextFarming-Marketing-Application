
const api = axios.create({baseURL: 'http://localhost'})

$(document)
.ready(function() {
  //get location url parameter
  var url = new URL(window.location.href);
  var location = url.searchParams.get("location");
  var validLocations = ['orders', 'agents', 'products', 'administration'];
  if(validLocations.indexOf(location) == -1){
    window.history.replaceState({}, '', '/dashboard?location=orders');
  }

  if(location == 'orders'){
    LoadContent('orders');
  }
  else if(location == 'agents'){
    LoadContent('agents');
  }

  $('#OrdersButton').click(function(){
    window.history.replaceState({}, '', '/dashboard?location=orders');
    LoadContent('orders');
  }
  );
  $('#AgentsButton').click(function(){
    window.history.replaceState({}, '', '/dashboard?location=agents');
    LoadContent('agents');
  }
  );
  $('#ProductsButton').click(function(){
    window.history.replaceState({}, '', '/dashboard?location=products');
    LoadContent('products');
  }
  );
  $('#AdministrationButton').click(function(){
    window.history.replaceState({}, '', '/dashboard?location=administration');
    LoadContent('administration');
  }
  );

  $('#LogoutButton').click(function(){
    $('#LogoutButton').addClass('loading');
    Logout();
  });
  ;
})
;

function Logout(){
  api.post('/agent/logout')
  .then(res => {
        $('#LogoutButton').removeClass('loading');
        ShowNotif("Logout Successful", 'green');
  })
  .catch(error => {
        $('#LogoutButton').removeClass('loading');
        if(error.response.data != null){
            ShowNotif(error.response.data.message, 'red');
        }
        else{
          ShowNotif("Server Error", 'red');
        }
  })
  .then(() => {
    window.location.href = '/';
  }
  );
}

function LoadContent(location){
  if(location == 'orders'){
    $('#content').load('/content/dashboard/orders');
  }
  else if(location == 'agents'){
    $('#content').load('/content/dashboard/agents');
  }
  else if(location == 'products'){
    $('#content').load('/content/dashboard/products');
  }
  else if(location == 'administration'){
    $('#content').load('/content/dashboard/administration');
  }
}

function ShowNotif(message, color){
  $('body')
    .toast({
      message: message,
      class: color,
      showProgress: 'bottom'
    })
  ;
}