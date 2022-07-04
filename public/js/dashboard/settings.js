$(document).ready(function() {
    LoadProfile();

    $('#ChangePasswordButton').click(function() {
        $('#ChangePasswordModal').modal('show');
    }
    );

    $('#ChangePasswordConfirmButton').click(function() {
        var OldPassword = $('#ChangePasswordOldPasswordField').val();
        var NewPassword = $('#ChangePasswordNewPasswordField').val();
        var ConfirmPassword = $('#ChangePasswordConfirmPasswordField').val();
        if(NewPassword != ConfirmPassword) {
            ShowNotif("Passwords do not match", 'red');
            return;
        }
        ChangePassword(OldPassword, NewPassword);
    }
    );

    $('#AdministrationButton').click(function() {
        window.history.replaceState({}, '', '/dashboard?location=administration');
        LoadContent('administration');
    }
    );
}
);

var Roles = ['Guest', 'Operator', 'Administrator'];

function LoadProfile(){
    api.get('/agent/profile')
    .then(res => {
        $('#NameField').val(res.data.message.FirstName + ' ' + res.data.message.LastName);
        $('#UsernameField').val(res.data.message.Username);
        $('#RoleField').val(Roles[res.data.message.Role]);
        $('#CreatedField').val(FormatDate(res.data.message.Created));

        $('#NameTitle').html(res.data.message.FirstName + ' ' + res.data.message.LastName);
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
}

function FormatDate(timestamp){
    var date = new Date(+timestamp);
    //to format 00/00/00 00:00
    //if day or month only one digit add 0 before
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if(day < 10) day = '0' + day;
    if(month < 10) month = '0' + month;
    if(hours < 10) hours = '0' + hours;
    if(minutes < 10) minutes = '0' + minutes;
    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
}

function ChangePassword(OldPassword, NewPassword){
    api.post('/agent/changepassword', {
        OldPassword: OldPassword,
        NewPassword: NewPassword
    }
    )
    .then(res => {
        ShowNotif("Password Changed", 'green');
        $('#ChangePasswordModal').modal('hide');
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
}