
const api = axios.create({baseURL: 'http://localhost'})

$(document)
.ready(function() {
  var url = new URL(window.location.href);
  var location = url.searchParams.get("location");
  var validLocations = ['orders', 'agents', 'products', 'administration'];
  if(validLocations.indexOf(location) == -1){
    window.history.replaceState({}, '', '/dashboard?location=orders');
  }

  LoadContent(location);

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


  //get request to /agent/get to get the agent's information
  api.get('/agent/profile')
  .then(res => {
    res.data.message.Role = "Admin";

    //div TopBarProfile
    // <i class="user icon"></i>
    // <div class="content">firstname lastname
    //   <div class="sub header">
    //     role
    //   </div>
    // </div>

    $('#TopBarProfile').html(`
      <div class="content"><h4>${res.data.message.FirstName} ${res.data.message.LastName}</h4>
      </div>
    `);


    //$('#HeaderName').text(res.data.message.FirstName + ' ' + res.data.message.LastName);
    //$('#HeaderRole').text(res.data.message.Role);
  }
  )
  .catch(error => {
    if(error.response.data != null){
      ShowNotif(error.response.data.message, 'red');
    }
    else{
      ShowNotif("Server Error", 'red');
    }
  }
  );
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
    SetActiveTab('OrdersButton');
  }
  else if(location == 'agents'){
    $('#content').load('/content/dashboard/agents');
    SetActiveTab('AgentsButton');
  }
  else if(location == 'products'){
    $('#content').load('/content/dashboard/products');
    SetActiveTab('ProductsButton');
  }
  else if(location == 'administration'){
    $('#content').load('/content/dashboard/administration');
    SetActiveTab('AdministrationButton');
  }
  else{
    $('#content').load('/content/dashboard/orders');
    SetActiveTab('OrdersButton');
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

function SetActiveTab(tab){
  $('#OrdersButton').removeClass('active');
  $('#AgentsButton').removeClass('active');
  $('#ProductsButton').removeClass('active');
  $('#AdministrationButton').removeClass('active');
  $('#' + tab).addClass('active');
}