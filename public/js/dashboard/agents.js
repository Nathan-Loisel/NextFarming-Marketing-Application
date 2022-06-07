Agents = [];
DeletingAgent = null;
EditingAgent = null;


const Roles = ['GUEST', 'OPERATOR', 'ADMIN'];
$(document)
.ready(function() {
    RefreshAgentsTable();



    //AddAgentPermissionsDropdown is a dropdown.
    //Set preselected to GUEST
    $('#CreationPermissions').dropdown('set selected', 'GUEST');

    $('#AddAgentConfirm').click(function(e){
        Role = 0;
        console.log($('#CreationPermissions').dropdown('get value'));
        if($('#CreationPermissions').dropdown('get value') == 'GUEST') Role = 0;
        if($('#CreationPermissions').dropdown('get value') == 'OPERATOR') Role = 1;
        if($('#CreationPermissions').dropdown('get value') == 'ADMIN') Role = 2;
        var Agent = {
            FirstName: $('#CreationFirstName').val(),
            LastName: $('#CreationLastName').val(),
            Username: $('#CreationUsername').val(),
            Password: $('#CreationPassword').val(),
            Role: Role
        }
        CreateAgent(Agent);
    }
    );

    $('#DeleteAgentConfirm').click(function(e){
        DeleteAgent(DeletingAgent);
    }
    );

    $('#AddAgentButton').click(function(){
        $('#AddAgentModal').modal('show');
    }
    );
}
);



function RefreshAgentsTable(){
    var data = {
        amount: 10,
        page: 1
    }
    api.get('/agent/list', data)
    .then(res => {
        Agents = res.data.data;
        $('#AgentsTable').empty();
        Agents.forEach(function(agent){
            AddInAgentsTable(agent)
        });
    })
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


function AddInAgentsTable(Agent){
    $('#AgentsTable').append(
        '<tr>' +
        '<td>' + Agent.FirstName + '</td>' +
        '<td>' + Agent.LastName + '</td>' +
        '<td>' + Agent.Username + '</td>' +
        '<td>' + Agent.Username + '</td>' +
        '<td>' + Roles[Agent.Role] + '</td>' +
        '<td>' +
        '<button class="ui green button" onclick="EditAgentModal(\'' + Agent.Username + '\')" >Edit</button>' +
        '<button class="ui red button" onclick="DeleteAgentModal(\'' + Agent.Username + '\')">Delete</button>' +
        '</td>' +
        '</tr>'
    );
}


function CreateAgent(Agent){
    console.log(Agent);
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

function EditAgentModal(Username){
    EditingAgent = Username;
    $('#EditAgentModal').modal('show');
}

function DeleteAgentModal(Username){
    DeletingAgent = Username;
    $('#DeleteAgentField').text(Username);
    $('#DeleteAgentConfirmModal').modal('show');
}

function EditAgent(Username){
    
}

function DeleteAgent(Username){
    $('#DeleteAgentButton').addClass('loading');
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
            ShowNotif(error.response.data.message, 'red');
        }
        else{
            ShowNotif("Server Error", 'red');
        }
    }
    ).then(() => {
        $('#DeleteAgentConfirmModal').modal('hide');
        $('#DeleteAgentButton').removeClass('loading');
        RefreshAgentsTable();
    }
    );
}