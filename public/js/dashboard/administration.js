var CurrentParameters = null;

$(document).ready(function() {
    LoadParameters();

    $('#EditSMTPButton').click(function() {
        $('#EditSMTPModal').modal('show');
        if(CurrentParameters.smtp.server == undefined || CurrentParameters.smtp.server == null){
            $('#EditSMTPServerField').val('');
        }
        else{
            $('#EditSMTPServerField').val(CurrentParameters.smtp.server);
        }

        if(CurrentParameters.smtp.port == undefined || CurrentParameters.smtp.port == null){
            $('#EditSMTPPortField').val('');
        }
        else{
            $('#EditSMTPPortField').val(CurrentParameters.smtp.port);
        }

        if(CurrentParameters.smtp.username == undefined || CurrentParameters.smtp.username == null){
            $('#EditSMTPUsernameField').val('');
        }
        else{
            $('#EditSMTPUsernameField').val(CurrentParameters.smtp.username);
        }

        if(CurrentParameters.smtp.password == undefined || CurrentParameters.smtp.password == null){
            $('#EditSMTPPasswordField').val('');
            $('#EditSMTPPasswordField').attr('type', 'text');
        }
        else{
            $('#EditSMTPPasswordField').val(CurrentParameters.smtp.password);
        }
    }
    );

    $('#EditSMTPConfirmButton').click(function() {
        SMTPSettings = {
            Server: $('#EditSMTPServerField').val(),
            Port: $('#EditSMTPPortField').val(),
            Username: $('#EditSMTPUsernameField').val(),
            Password: $('#EditSMTPPasswordField').val()
        }
        EditSMTP(SMTPSettings);
    }
    );

    $('#TestSMTPButton').click(function() {
        $('#TestSMTPModal').modal('show');
    }
    );

    $('#TestSMTPConfirmButton').click(function() {
        Destination = $('#TestSMTPDestinationField').val();
        TestSMTPSettings(Destination);
    }
    );
}
);


function LoadParameters(){
    api.get('/config')
    .then(res => {
        CurrentParameters = res.data.message;
        console.log(CurrentParameters);
        if(CurrentParameters.smtp.server == undefined || CurrentParameters.smtp.server == null){
            $('#SMTPServerField').val('Not defined');
        }
        else{
            $('#SMTPServerField').val(CurrentParameters.smtp.server);
        }

        if(CurrentParameters.smtp.port == undefined || CurrentParameters.smtp.port == null){
            $('#SMTPPortField').val('Not defined');
        }
        else{
            $('#SMTPPortField').val(CurrentParameters.smtp.port);
        }

        if(CurrentParameters.smtp.username == undefined || CurrentParameters.smtp.username == null){
            $('#SMTPUsernameField').val('Not defined');
        }
        else{
            $('#SMTPUsernameField').val(CurrentParameters.smtp.username);
        }

        if(CurrentParameters.smtp.password == undefined || CurrentParameters.smtp.password == null){
            $('#SMTPPasswordField').val('Not defined');
            $('#SMTPPasswordField').attr('type', 'text');
        }
        else{
            $('#SMTPPasswordField').val(CurrentParameters.smtp.password);
        }

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

function EditSMTP(SMTPSettings){
    api.post('/config/smtp', SMTPSettings)
    .then(res => {
        ShowNotif('SMTP settings successfully updated', 'green');
        $('#EditSMTPModal').modal('hide');
        LoadParameters();
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

function TestSMTPSettings(Destination){
    api.post('/config/smtp/test', {Destination: Destination})
    .then(res => {
        ShowNotif('SMTP settings successfully tested', 'green');
        $('#TestSMTPModal').modal('hide');
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
