
const api = axios.create({baseURL: 'http://localhost'})

$(document)
.ready(function() {
  $('.ui.form')
    .form({
      fields: {
        email: {
          identifier  : 'email',
        },
        password: {
          identifier  : 'password',
        }
      }
    })
    .submit(function(e) {
      e.preventDefault();
      $('.submit.button').addClass('loading');
      var Username = $('#username').val();
      var Password = $('#password').val();
      Login(Username, Password);
    }
  );
  ;
})
;

async function Login(Username, Password){
  PostData = {
    Username: Username,
    Password: Password
  }
  api.post('/agent/login', PostData)
  .then(res => {
        $('.submit.button').removeClass('loading');
        ShowNotif("Login Successful", 'green');
        window.location.href = '/dashboard';
  })
  .catch(error => {
        $('.submit.button').removeClass('loading');
        if(error.response.data != null){
            ShowNotif(error.response.data.message, 'red');
        }
        else{
          ShowNotif("Server Error", 'red');
        }
  })
  ;
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