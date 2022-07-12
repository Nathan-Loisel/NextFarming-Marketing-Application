
const api = axios.create({baseURL: 'http://129.151.229.222'})

$(document)
.ready(function() {
  var url = new URL(window.location.href);
  var location = url.searchParams.get("location");
  var validLocations = ['orders', 'agents', 'products', 'administration', 'settings'];
  if(validLocations.indexOf(location) == -1){
    window.history.replaceState({}, '', '/dashboard?location=orders');
  }

  LoadContent(location);

  $('#UserDropdown').dropdown({
    on: 'hover',
    action: 'nothing'
  });

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

  $('#LogoutButton').click(function(){
    $('#LogoutButton').addClass('loading');
    Logout();
  });

  $('#DropdownSettingsButton').click(function(){
    window.history.replaceState({}, '', '/dashboard?location=settings');
    LoadContent('settings');
  });

  $('#DropdownLogoutButton').click(function(){
    $('#DropdownLogoutButton').addClass('loading');
    Logout();
  });


  //get request to /agent/get to get the agent's information
  api.get('/agent/profile')
  .then(res => {
    //div TopBarProfile
    // <i class="user icon"></i>
    // <div class="content">firstname lastname
    //   <div class="sub header">
    //     role
    //   </div>
    // </div>

    $('#TopBarName').html(`
      <h4>${res.data.message.FirstName} ${res.data.message.LastName}</h4>
    `);


    Role = "Guest";
    if(res.data.message.Role == 0) Role = "Guest"; 
    if(res.data.message.Role == 1) Role = "Operator";
    if(res.data.message.Role == 2) Role = "Administrator";
    $('#DropdownName').html(`
      <h4>${res.data.message.Username}</h4> ${Role}
    `);
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
        $('#DropdownLogoutButton').removeClass('loading');
        ShowNotif("Logout Successful", 'green');
  })
  .catch(error => {
        $('#LogoutButton').removeClass('loading');
        $('#DropdownLogoutButton').removeClass('loading');
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
    SetActiveTab(null);
  }
  else if(location == 'settings'){
    $('#content').load('/content/dashboard/settings');
    SetActiveTab(null);
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
  if(tab != null){
     $('#' + tab).addClass('active');
  }
}

function HandleError(error){
  if(error.response != null && error.response.data != null){
      if(error.response.data.message == undefined){
          ShowNotif("Server Error", 'red');
      };
      ShowNotif(error.response.data.message, 'red');
  }
  else{
      ShowNotif("Server Error", 'red');
  }
}