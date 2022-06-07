Agents = [];
var CurrentUsername = null;
var CurrentAgent = null;

const Roles = ['GUEST', 'OPERATOR', 'ADMIN'];
$(document)
.ready(function() {
    RefreshAgentsTable();

    $.fn.modal.settings.allowMultiple = true;

    $('#AddAgentRoleField').dropdown('set selected', 'GUEST');
    $('#EditAgentRoleField').dropdown('set selected', 'GUEST');

    $('#AddAgentConfirmButton').click(function(e){
        Role = 0;
        console.log($('#AddAgentRoleField').dropdown('get value'));
        if($('#AddAgentRoleField').dropdown('get value') == 'GUEST') Role = 0;
        if($('#AddAgentRoleField').dropdown('get value') == 'OPERATOR') Role = 1;
        if($('#AddAgentRoleField').dropdown('get value') == 'ADMIN') Role = 2;
        var Agent = {
            FirstName: $('#AddAgentFirstNameField').val(),
            LastName: $('#AddAgentLastNameField').val(),
            Username: $('#AddAgentUsernameField').val(),
            Password: $('#AddAgentPasswordField').val(),
            Role: Role
        }
        console.log(Agent);
        AddAgent(Agent);
    }
    );

    $('#DeleteAgentConfirmButton').click(function(e){
        DeleteAgent(CurrentUsername);
    }
    );

    $('#AddAgentButton').click(function(){
        $('#AddAgentModal').modal('show');
    }
    );

    $('#ManageAgentSetPasswordButton').click(function(){
        $('#EditAgentPasswordModal').modal('show');
    }
    );

    $('#ManageAgentEditButton').click(function(){
        OpenEditAgentModal();
    }
    );

    $('#EditAgentPasswordConfirmButton').click(function(){
        if($('#EditAgentPasswordField').val() == $('#EditAgentPasswordConfirmField').val()){
            SetAgentPassword(CurrentUsername, $('#EditAgentPasswordField').val());
        }
        else{
            ShowNotif('Passwords do not match', 'red');
        }
    }
    );

    $('#EditAgentConfirmButton').click(function(){
        EditAgent();
    }
    );
}
);

function SetAgentPassword(Username, Password){
    api.post('agent/setpassword', {
        Username: Username,
        Password: Password
    }
    ).then(function(response){
        if(response.data.success){
            ShowNotif("Password successfully changed", 'green');
            $('#EditAgentPasswordModal').modal('hide');
        }
        else{
            ShowNotif(response.data.message, 'red');
        }
    }
    ).catch(function(error){
        if(error.response.data != null){
            if(error.response.data.message == undefined){
                ShowNotif("Server Error", 'red');
            };
            ShowNotif(error.response.data.message, 'red');
        }
        else{
            ShowNotif(error.message, 'red');
        }
    }
    );
}

function RefreshAgentsTable(){
    var data = {
        amount: 10,
        page: 1
    }
    api.post('/agent/list', data)
    .then(res => {
        Agents = res.data.data;
        $('#AgentsTable').empty();
        Agents.forEach(function(agent){
            AddInAgentsTable(agent)
        });
    })
    .catch(error => {
        if(error.response.data != null){
            if(error.response.data.message == undefined){
                ShowNotif("Server Error", 'red');
            };
            ShowNotif(error.response.data.message, 'red');
        }
        else{
            ShowNotif("Server Error", 'red');
        }
    }
    );
}

function AddInAgentsTable(Agent){
    $('#AgentsTable').append(
        '<tr>' +
        '<td>' + Agent.FirstName + '</td>' +
        '<td>' + Agent.LastName + '</td>' +
        '<td>' + Agent.Username + '</td>' +
        '<td>' + FormatDate(Agent.Created) + '</td>' +
        '<td>' + Roles[Agent.Role] + '</td>' +
        '<td>' +
        '<button class="ui green button" onclick="OpenManageAgentModal(\'' + Agent.Username + '\')" >Manage</button>' +
        '<button class="ui red button" onclick="OpenDeleteAgentModal(\'' + Agent.Username + '\')">Delete</button>' +
        '</td>' +
        '</tr>'
    );
}

function AddAgent(Agent){
    $('#AddAgentButton').addClass('loading');
    api.post('/agent/create', Agent)
    .then(res => {
        RefreshAgentsTable();
        $('#AddAgentModal').modal('hide');
        ShowNotif("Agent successfully created", 'green');
    }
    )
    .catch(error => {
        if(error.response.data != null){
            if(error.response.data.message == undefined){
                ShowNotif("Server Error", 'red');
            };
            ShowNotif(error.response.data.message, 'red');
        }
        else{
            ShowNotif("Server Error", 'red');
        }
    }
    ).then(() => {
        $('#AddAgentModal').modal('hide');
        $('#AddAgentButton').removeClass('loading');
    }
    );
}

function OpenManageAgentModal(Username){
    CurrentUsername = Username;
    $('#ManageAgentModal').modal('show');
    api.post('/agent/get', {
        Username: Username
    }
    ).then(res => {
        CurrentAgent = res.data.message;
        data = res.data.message;
        $('#ManageAgentTitleField').html('<h2>' + data.FirstName + ' ' + data.LastName + '</h2>');
        
        $('#ManageAgentFirstNameField').val(data.FirstName);
        $('#ManageAgentFirstNameField').removeAttr('disabled');

        $('#ManageAgentLastNameField').val(data.LastName);
        $('#ManageAgentLastNameField').removeAttr('disabled');

        $('#ManageAgentUsernameField').val(data.Username);
        $('#ManageAgentUsernameField').removeAttr('disabled');

        $('#ManageAgentRoleField').val(Roles[data.Role]);
        $('#ManageAgentRoleField').removeAttr('disabled');

        $('#ManageAgentCreatedField').val(FormatDate(data.Created));
        $('#ManageAgentCreatedField').removeAttr('disabled');

        $('#ManageAgentSetPasswordButton').removeClass('disabled');
    }
    ).catch(error => {
        if(error.response.data != null){
            if(error.response.data.message == undefined){
                ShowNotif("Server Error", 'red');
            };
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

function OpenDeleteAgentModal(Username){
    CurrentUsername = Username;
    $('#DeleteAgentUsernameField').text(Username);
    $('#DeleteAgentConfirmModal').modal('show');
}

function OpenEditAgentModal(){
    $('#EditAgentModal').modal('show');
    $('#EditAgentFirstNameField').val(CurrentAgent.FirstName);
    $('#EditAgentLastNameField').val(CurrentAgent.LastName);
    $('#EditAgentUsernameField').val(CurrentAgent.Username);
    $('#EditAgentRoleField').dropdown('set selected', Roles[CurrentAgent.Role]);
}


function DeleteAgent(Username){
    $('#DeleteAgentConfirmButton').addClass('loading');
    var Data = {
        Username: Username
    }
    api.post('/agent/delete', Data)
    .then(res => {
        RefreshAgentsTable();
        $('#DeleteAgentConfirmModal').modal('hide');
        ShowNotif("Agent successfully deleted", 'green');
    }
    )
    .catch(error => {
        if(error.response.data != null){
            if(error.response.data.message == undefined){
                ShowNotif("Server Error", 'red');
            };
            ShowNotif(error.response.data.message, 'red');
        }
        else{
            ShowNotif("Server Error", 'red');
        }
    }
    ).then(() => {
        $('#DeleteAgentConfirmModal').modal('hide');
        $('#DeleteAgentConfirmButton').removeClass('loading');
        RefreshAgentsTable();
    }
    );
}

function EditAgent(){
    Role = 0;
    if($('#EditAgentRoleField').dropdown('get value') == 'GUEST' ) Role = 0;
    else if($('#EditAgentRoleField').dropdown('get value') == 'OPERATOR') Role = 1;
    else if($('#EditAgentRoleField').dropdown('get value') == 'ADMIN') Role = 2;

    if($('#EditAgentUsernameField').val() == CurrentAgent.Username){
        data = {
            Username: CurrentUsername,
            Update:{
                FirstName: $('#EditAgentFirstNameField').val(),
                LastName: $('#EditAgentLastNameField').val(),
                Role: Role
            }
        }
    }
    else{
        data = {
            Username: CurrentUsername,
            Update:{
                FirstName: $('#EditAgentFirstNameField').val(),
                LastName: $('#EditAgentLastNameField').val(),
                Username: $('#EditAgentUsernameField').val(),
                Role: Role
            }
        }
    }
    $('#EditAgentConfirmButton').addClass('loading');
    api.post('/agent/update', data)
    .then(res => {
        RefreshAgentsTable();
        $('#EditAgentModal').modal('hide');
        ShowNotif("Agent successfully updated", 'green');
    }
    )
    .catch(error => {
        if(error.response.data != null){
            if(error.response.data.message == undefined){
                ShowNotif("Server Error", 'red');
            };
            ShowNotif(error.response.data.message, 'red');
        }
        else{
            ShowNotif("Server Error", 'red');
        }
    }
    ).then(() => {
        $('#EditAgentModal').modal('hide');
        $('#EditAgentConfirmButton').removeClass('loading');
    }
    );
}