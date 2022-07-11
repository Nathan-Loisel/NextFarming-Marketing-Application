
var NewOrderSelectedProducts = [];
var NewOrderCurrentProducts = [];
var NewOrderSelectedOptions = [];
var NewOrderCurrentProductID = null;
var CurrentOrder = null;
var ActualOrdersTab = null;
var CurrentOrderID = null;

// NewOrderSelectedProducts = [
//     {
//         ID: 1,
//         Product: {Product}
//         Amount: 1,
//         SelectedOptions: [1, 2]
//     },
//]

$(document).ready(function() {
    $('.tabular.menu .item').tab();
    $('.tabular.menu .item').on('click', function() {
        var tabName = $(this).data('tab');
        if(tabName == 'completed'){
            LoadOrders(1);
            ActualOrdersTab = 1;
        }
        if(tabName == 'pending'){
            LoadOrders(0);
            ActualOrdersTab = 0;
        }
        if(tabName == 'archived'){
            LoadOrders(2);
            ActualOrdersTab = 2;
        }

    }
    );

    $('.ui.dropdown').dropdown();
    
    $('.popupButton').popup();

    $('.ui.modal').modal({
        allowMultiple: true
    });

    $('#EditOrderModal').modal({
        closable: false
    });

    $('#NewOrderButton').click(function() {
        NewOrderLoadProducts();
        CurrentOrderID = null;
        $('#EditOrderModal').modal('show');
    }
    );

    $('#EditOrderConfirmButton').click(function() {
        EditOrder();
    }
    );

    $('#NewOrderAddOptionsConfirmButton').click(function() {
        var Product = NewOrderCurrentProducts.find(function(Product) { return Product.ID == NewOrderCurrentProductID; });
        Product.SelectedOptions = NewOrderSelectedOptions;
        NewOrderRefreshProductsTable();
    }
    );

    $('#ChangeOrderStatusConfirmButton').click(function() {
        ChangeOrderStatus();
    }
    );

}
);

function NewOrderLoadProducts(Search, Page){
    if(Page == undefined) {
        Page = 1;
    }

    var data = {
        Amount: 10,
        Page: Page
    }

    api.post('/product/list', data)
    .then(res => {
        NewOrderCurrentProducts = res.data.message;
        NewOrderRefreshProductsTable();
    }
    )
    .catch(error => {
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
    );

}

function NewOrderRefreshProductsTable(){
    $('#ProductsList').html('');
    NewOrderCurrentProducts.forEach(function(Product) {
        NewOrderAddProductInList(Product);
    }
    );
    $('#SelectedProductsList').html('');
    NewOrderSelectedProducts.forEach(function(Product) {
        NewOrderAddProductInSelectedList(Product);
    }
    );
}


function NewOrderAddProductInList(Product){
    var OptionsCountHTML = '';
    if(Product.SelectedOptions != undefined && Product.SelectedOptions.length > 0){
        OptionsCountHTML = '<div class="ui label">' + Product.SelectedOptions.length + '</div>';
    }


    $('#ProductsList').append(
        `<div class="item">
            <div class="right floated content">
                <div class="ui left labeled button" tabindex="0">
                    ${OptionsCountHTML}
                    <button class="ui icon compact blue button popupButton" data-content="Add options" onclick="NewOrderOptionsModalButton('${Product.ID}')">
                        <i class="box icon"></i>
                    </button>
                </div>
                <button class="ui icon compact green button popupButton"  data-content="Add product" onclick="NewOrderAddProductButton('${Product.ID}')">
                    <i class="plus icon"></i>
                </button>
                <button class="ui icon compact button popupButton" data-content="Reset product" onclick="NewOrderResetProductButton('${Product.ID}')">
                    <i class="redo icon"></i>
                </button>
            </div>
            <img class="ui avatar image" src="/">
            <div class="content">
                <span style="margin-right: 10px;" class="popupButton" data-content="${Product.ShortDescription}d">${Product.Title}</span>
                <div class="ui label">
                    ${Product.Price}€
                </div>
            </div>
        </div>`
    );
    $('.popupButton').popup();
}

function NewOrderAddProductInSelectedList(Product){

    var OptionsCountHTML = '';
    if(Product.SelectedOptions != undefined && Product.SelectedOptions.length > 0){
        OptionsCountHTML = '<div class="ui label">' + Product.SelectedOptions.length + '</div>';
    }

    var OptionsDescription = 'No options selected';
    if(Product.SelectedOptions != undefined && Product.SelectedOptions.length > 0){
        OptionsDescription = '';
        // Option title + new line
        Product.SelectedOptions.forEach(function(OptionID) {
            var Option = Product.Product.Options.find(function(Option) { return Option.ID == OptionID; });
            OptionsDescription += Option.Title + ', ';
        }
        );
        OptionsDescription = OptionsDescription.slice(0, -2);
    }

    var OptionsList = '';
    if(Product.SelectedOptions != undefined && Product.SelectedOptions.length > 0){
        Product.SelectedOptions.forEach(function(OptionID) {
            OptionsList += OptionID + ',';
        }
        );
        OptionsList = OptionsList.slice(0, -1);
    }

    $('#SelectedProductsList').append(
        `<div class="item">
            <div class="right floated content">
                <div class="ui left labeled button" tabindex="0">
                    ${OptionsCountHTML}
                    <button class="ui icon compact blue button popupButton" data-content="${OptionsDescription}" onclick="NewOrderSelectedProductCheckOptionsButton('${Product.Product.ID}', '${OptionsList}')">
                        <i class="box icon"></i>
                    </button>
                </div>
                <button class="ui icon compact red button popupButton" data-content="Remove product" onclick="NewOrderRemoveProductButton('${Product.Product.ID}', '${OptionsList}')">
                    <i class="minus icon"></i>
                </button>
            </div>
            <img class="ui avatar image" src="/">
            <div class="content">
                <span style="margin-right: 10px;" class="popupButton" data-content="${Product.Product.ShortDescription}d">${Product.Product.Title}</span>
                <div class="ui label">
                    ${Product.Product.Price}€
                </div>
            </div>
        </div>`
    );
    $('.popupButton').popup();

}

function NewOrderSelectedProductCheckOptionsButton(ProductID, Options){
    $('#NewOrderSelectedProductCheckOptionsModal').modal('show');

    if(Options != undefined && Options != ''){
        Options = Options.split(',');
        $('#NewOrderSelectedProductCheckOptionsList').html('');
    }
    else{
        Options = [];
    }

    var Product = NewOrderSelectedProducts.find(function(Product) { return Product.Product.ID == ProductID; });

    var Options = Product.Product.Options.filter(function(Option) {
        return Options.includes(Option.ID);
    }
    );


    Options.forEach(function(Option) {
        $('#NewOrderSelectedProductCheckOptionsList').append(
            `<div class="item">
                <img class="ui avatar image" src="/images/avatar2/small/lena.png">
                <div class="content">
                    <span style="margin-right: 10px;" class="popupButton" data-content="${Option.Description}">${Option.Title}</span>
                    <div class="ui label">
                        ${Option.Price}€
                    </div>
                </div>
            </div>`
        );
    }
    );
}

function NewOrderAddProductButton(ProductID){
    if(NewOrderSelectedProducts == null){
        NewOrderSelectedProducts = [];
    }

    var Product = NewOrderCurrentProducts.find(function(Product) { return Product.ID == ProductID; });
    
    if(Product.SelectedOptions == undefined || Product.SelectedOptions.length == null){
        Product.SelectedOptions = [];
    }

    var AlreadyPresent = false;
    NewOrderSelectedProducts.forEach(function(SelectedProduct) {
        if(SelectedProduct.Product.ID == Product.ID){
            if(SelectedProduct.SelectedOptions != undefined && SelectedProduct.SelectedOptions.sort().join(',') == Product.SelectedOptions.sort().join(',')){
                AlreadyPresent = true;
                SelectedProduct.Amount++;
            }
        }
    }
    );

    if(!AlreadyPresent){
        NewOrderSelectedProducts.push({
            ID: Product.ID,
            Product: Product,
            Amount: 1,
            SelectedOptions: Product.SelectedOptions
        });
    }

    NewOrderCurrentProducts.find(function(Product) { return Product.ID == ProductID; }).SelectedOptions = [];
    NewOrderRefreshProductsTable();

}

function NewOrderOptionsModalButton(ProductID){
    $('#NewOrderAddOptionsModal').modal('show');
    NewOrderCurrentProductID = ProductID;
    NewOrderSelectedOptions = NewOrderCurrentProducts.find(function(Product) { return Product.ID == ProductID; }).SelectedOptions;

    var Product = NewOrderCurrentProducts.find(function(Product) { return Product.ID == ProductID; });
    var Options = Product.Options;
    $('#NewOrderAddOptionsList').html('');
    if(Options == null){
        $('#NewOrderAddOptionsList').html(`<div class="item">No options available</div>`);
        Options = [];
    }

    Options.forEach(function(Option) {
        var checked = '';
        if(NewOrderSelectedOptions != undefined && NewOrderSelectedOptions.indexOf(Option.ID) != -1){
            checked = "checked";
        }



        $('#NewOrderAddOptionsList').append(
            `<div class="item">
                <div class="right floated content">
                    <div class="ui checkbox">
                        <input ${checked} type="checkbox" name="${Option.ID}" tabindex="0" class="hidden">
                        <label></label>
                    </div>
                </div>
                <img class="ui avatar image" src="/images/avatar2/small/lena.png">
                <div class="content">
                    <span style="margin-right: 10px;" class="popupButton" data-content="${Option.Description}">${Option.Title}</span>
                    <div class="ui label">
                        ${Option.Price}€
                    </div>
                </div>
            </div>`
        );
        $('.popupButton').popup();

        $('.ui.checkbox').checkbox();
        SelectedOptions = [];
        $('.ui.checkbox').checkbox({
            onChecked: function() {
                var OptionID = $(this).attr('name');
                NewOrderSelectOption(OptionID);
            }, 
            onUnchecked: function() {
                var OptionID = $(this).attr('name');
                NewOrderUnselectOption(OptionID);
            }
        });

        
    }
    );
}

function NewOrderResetProductButton(ProductID){
    var Product = NewOrderCurrentProducts.find(function(Product) { return Product.ID == ProductID; });
    Product.SelectedOptions = [];
    NewOrderRefreshProductsTable();
}

function NewOrderSelectOption(OptionID){
    if(NewOrderSelectedOptions == null){
        NewOrderSelectedOptions = [];
    }

    if(NewOrderSelectedOptions.indexOf(OptionID) == -1){
        NewOrderSelectedOptions.push(OptionID);
    }
}

function NewOrderUnselectOption(OptionID){
    if(NewOrderSelectedOptions == null){
        NewOrderSelectedOptions = [];
    }

    if(NewOrderSelectedOptions.indexOf(OptionID) != -1){
        NewOrderSelectedOptions.splice(NewOrderSelectedOptions.indexOf(OptionID), 1);
    }
}

function NewOrderRemoveProductButton(ProductID, Options){
    if(Options == undefined){
        Options = '';
    }

        

    Options = Options.split(',');
    NewOrderSelectedProducts.forEach(function(SelectedProduct) {
        if(SelectedProduct.Product.ID == ProductID){
            if(Options == undefined && SelectedProduct.SelectedOptions == undefined){
                NewOrderSelectedProducts.splice(NewOrderSelectedProducts.indexOf(SelectedProduct), 1);
            }
            else if(Options != undefined && SelectedProduct.SelectedOptions != undefined && SelectedProduct.SelectedOptions.sort().join(',') == Options.sort().join(',')){
                NewOrderSelectedProducts.splice(NewOrderSelectedProducts.indexOf(SelectedProduct), 1);
            }
        }
    }
    );
    NewOrderRefreshProductsTable();
}

function EditOrder(){
    var OrderID = CurrentOrderID;

    var Client = {
        FirstName: $('#EditOrderFirstNameField').val(),
        LastName: $('#EditOrderLastNameField').val(),
        Email: $('#EditOrderEmailField').val(),
        Phone: $('#EditOrderPhoneField').val(),
        Address: $('#EditOrderAddressField').val(),
        PostCode: $('#EditOrderPostCodeField').val(),
        City: $('#EditOrderCityField').val(),
        Country: $('#EditOrderCountryField').val()
    }
    if(Client.FirstName == undefined || Client.LastName == undefined || Client.Email == undefined){
        $('#NewOrderClientError').html('Please fill in all client required fields');
        return;
    }

    

    SelectedProducts = NewOrderSelectedProducts;
    var TotalPrice = 0;
    SelectedProducts.forEach(function(SelectedProduct) {
        var Product = SelectedProduct.Product;
        var Options = SelectedProduct.SelectedOptions;
        var Amount = SelectedProduct.Amount;
        var Price = Product.Price;
        if(Options != undefined){
            Options.forEach(function(Option) {
                Price += Option.Price;
            }
            );
        }
        TotalPrice += Price * Amount;
    }
    );

    var Data = {
        Client: Client,
        Products: SelectedProducts,
        Price: TotalPrice
    }


    if(OrderID == null){
        console.log("ok");
        axios.post('/order/create', Data)
        .then(function (response) {
            ShowNotif("Order created", "green");
            $('#NewOrderModal').modal('hide');
            LoadOrders(ActualOrdersTab);
        }
        )
        .catch(function (error) {
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
        );
    }
    else{
        Data.OrderID = OrderID;
        axios.post('/order/update', Data)
        .then(function (response) {
            ShowNotif("Order updated", "green");
            $('#NewOrderModal').modal('hide');
            LoadOrders(ActualOrdersTab);
        }
        )
        .catch(function (error) {
            HandleError(error);
        }
        );
    }


}

function LoadOrders(Status){
    // PENDING: 0,
    // CONFIRMED: 1,
    // ARCHIVED: 2,
    // CANCELED: 3

    if(Status == undefined){
        ShowNotif("Status not defined", 'red');
    }

    axios.post('/order/list', {Status: Status})
    .then(function (response) {
        Orders = response.data.message;

        $('.OrdersTable').html('');
        if(Status == 0){
            RefreshPendingOrdersTable(Orders);
        }
        else if(Status == 1){
            RefreshConfirmedOrdersTable(Orders);
        }
        else if(Status == 2){
            RefreshArchivedOrdersTable(Orders);
        }
    }
    )
    .catch(function (error) {
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
    );
}

LoadOrders(1);

function RefreshPendingOrdersTable(Orders){
    if(Orders == undefined){
        $('#PendingOrdersTable').html('<div class="ui center aligned header">No pending orders</div>');
        return;
    }
    Orders.forEach(function(Order) {
        $('#PendingOrdersTable').append(
            `<tr>
                <td>${Order.Client.FirstName} ${Order.Client.LastName}</td>
                <td>${Order.Client.Email}</td>
                <td>${Order.Price}€</td>
                <td>Pending</td>
                <td>
                    <button style="padding: 7px; font-size: 14px;" class="ui blue button" onclick="ShowOrderDetailsModal('${Order.ID}')">
                        Details
                    </button>
                    <button style="padding: 7px; font-size: 14px;" class="ui orange button" onclick="ShowOrderChangeStatusModal('${Order.ID}')">
                        Change status
                    </button>
                </td>
            </tr>`
        );
    }
    );
}

function RefreshConfirmedOrdersTable(Orders){
    if(Orders == undefined){
        $('#ConfirmedOrdersTable').html('<div class="ui center aligned header">No confirmed orders</div>');
        return;
    }
    Orders.forEach(function(Order) {
        $('#ConfirmedOrdersTable').append(
            `<tr>
                <td>${Order.Client.FirstName} ${Order.Client.LastName}</td>
                <td>${Order.Client.Email}</td>
                <td>${Order.Price}€</td>
                <td>Pending</td>
                <td>
                    <button style="padding: 7px; font-size: 14px;" class="ui blue button" onclick="ShowOrderDetailsModal('${Order.ID}')">
                        Details
                    </button>
                    <button style="padding: 7px; font-size: 14px;" class="ui blue button" onclick="ShowOrderEditModal('${Order.ID}')">
                        Edit
                    </button>
                    <button style="padding: 7px; font-size: 14px;" class="ui orange button" onclick="ShowOrderChangeStatusModal('${Order.ID}')">
                        Change status
                    </button>
                </td>
            </tr>`
        );
    }
    );
}

function RefreshArchivedOrdersTable(Orders){
    if(Orders == undefined){
        $('#ArchivedOrdersTable').html('<div class="ui center aligned header">No archived orders</div>');
        return;
    }
    Orders.forEach(function(Order) {
        $('#ArchivedOrdersTable').append(
            `<tr>
                <td>${Order.Client.FirstName} ${Order.Client.LastName}</td>
                <td>${Order.Client.Email}</td>
                <td>${Order.Price}€</td>
                <td>Pending</td>
                <td>
                    <button style="padding: 7px; font-size: 14px;" class="ui blue button" onclick="ShowOrderDetailsModal('${Order.ID}')">
                        Details
                    </button>
                    <button style="padding: 7px; font-size: 14px;" class="ui orange button" onclick="ShowOrderChangeStatusModal('${Order.ID}')">
                        Change status
                    </button>
                </td>
            </tr>`
        );
    }
    );
}

function ShowOrderEditModal(OrderID){
    $('#EditOrderModal').modal('show');
    CurrentOrderID = OrderID;

    axios.post('/order/get', {OrderID: OrderID})
    .then(function (response) {
        CurrentOrder = response.data.message;
        $('#EditOrderFirstNameField').val(CurrentOrder.Client.FirstName);
        $('#EditOrderLastNameField').val(CurrentOrder.Client.LastName);
        $('#EditOrderEmailField').val(CurrentOrder.Client.Email);
        $('#EditOrderPhoneField').val(CurrentOrder.Client.Phone);
        $('#EditOrderAddressField').val(CurrentOrder.Client.Address);
        $('#EditOrderPostCodeField').val(CurrentOrder.Client.PostCode);
        $('#EditOrderCityField').val(CurrentOrder.Client.City);
        $('#EditOrderCountryField').val(CurrentOrder.Client.Country);
    }
    )
    .catch(function (error) {
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
    );
}

function ShowOrderChangeStatusModal(OrderID){
    CurrentOrderID = OrderID;
    $('#ChangeOrderStatusModal').modal('show');
}

function ShowOrderDetailsModal(OrderID){
    $('#OrderDetailsModal').modal('show');
    CurrentOrderID = OrderID;
}

function ChangeOrderStatus(){
    var OrderID = CurrentOrderID;
    var Status = $('#EditOrderStatusDropdown').dropdown('get value');

    if(Status == "" || Status == undefined || Status == null || (Status != 0 && Status != 1 && Status != 2 && Status != 3)){
        ShowNotif("Please select a status", 'red');
        return;
    }

    axios.post('/order/changestatus', {OrderID: OrderID, Status: Status})
    .then(function (response) {
        ShowNotif("Order status successfully changed", 'green');
        $('#ChangeOrderStatusModal').modal('hide');
        LoadOrders(ActualOrdersTab);
    }
    )
    .catch(function (error) {
        HandleError(error);
    }
    );
}
