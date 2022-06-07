

Agents = [];
DeletingAgent = null;
EditingAgent = null;

$(document)
.ready(function() {
    RefreshAgentsTable();

    $('.ui.dropdown')
    .dropdown();

    $('#AddAgentConfirm').click(function(e){
        var Agent = {
            FirstName: $('#CreationFirstName').val(),
            LastName: $('#CreationLastName').val(),
            Username: $('#CreationUsername').val(),
            Password: $('#CreationPassword').val(),
            Permissions: {
                View: $('#CreationView').is(':checked'),
                Order: $('#CreationOrder').is(':checked'),
                Admin: $('#CreationAdmin').is(':checked')
            }
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
    ViewNode = '<input type="checkbox" name="viewOrder"';
    if(Agent.Permissions.View) ViewNode += ' checked="checked"';
    ViewNode += '>';

    OrderNode = '<input type="checkbox" name="orderOrder"';
    if(Agent.Permissions.Order) OrderNode += ' checked="checked"';
    OrderNode += '>';

    AdminNode = '<input type="checkbox" name="adminOrder"';
    if(Agent.Permissions.Admin) AdminNode += ' checked="checked"';
    AdminNode += '>';

    $('#AgentsTable').append(
        '<tr>' +
        '<td>' + Agent.FirstName + '</td>' +
        '<td>' + Agent.LastName + '</td>' +
        '<td>' + Agent.Username + '</td>' +
        '<td>' + Agent.Username + '</td>' +
        '<td class="ui center aligned" style="width: 120px;">' +
        '<div class="ui read-only checkbox">' +
        ViewNode +
        '<label></label>' +
        '</div>' +
        '<div class="ui read-only checkbox">' +
        OrderNode +
        '<label></label>' +
        '</div>' +
        '<div class="ui read-only checkbox">' +
        AdminNode +
        '<label></label>' +
        '</div>' +
        '</td>' +
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