
var EditOrderSelectedProducts = [];
var EditOrderCurrentProducts = [];
var EditOrderSelectedOptions = [];
var EditOrderCurrentProductID = null;
var CurrentOrder = null;
var ActualOrdersTab = 1;
var CurrentOrderID = null;

// EditOrderSelectedProducts = [
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
        if(tabName == 'confirmed'){
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
        closable: false,
        onApprove: function() {
            return false;
        }
    });

    $('#NewOrderButton').click(function() {
        CurrentOrderID = null;
        ResetEditOrderModal();
        EditOrderLoadProducts();
        $('#EditOrderModal').modal('show');
    }
    );

    $('#EditOrderConfirmButton').click(function() {
        if($('#EditOrderFirstNameField').val() == '' || $('#EditOrderLastNameField').val() == '' || $('#EditOrderEmailField').val() == '' || EditOrderSelectedProducts.length == 0){
            ShowNotif('Please fill all fields', 'red');
            return;
        }

        EditOrder();
    }
    );

    $('#EditOrderAddOptionsConfirmButton').click(function() {
        var Product = EditOrderCurrentProducts.find(function(Product) { return Product.ID == EditOrderCurrentProductID; });
        Product.SelectedOptions = EditOrderSelectedOptions;
        EditOrderRefreshProductsTable();
    }
    );

    $('#ChangeOrderStatusConfirmButton').click(function() {
        ChangeOrderStatus();
    }
    );

}
);

function EditOrderLoadProducts(Search, Page){
    if(Page == undefined) {
        Page = 1;
    }

    var data = {
        Amount: 10,
        Page: Page
    }

    api.post('/product/list', data)
    .then(res => {
        EditOrderCurrentProducts = res.data.message;
        EditOrderRefreshProductsTable();
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

function EditOrderRefreshProductsTable(){
    $('#ProductsList').html('');
    EditOrderCurrentProducts.forEach(function(Product) {
        EditOrderAddProductInList(Product);
    }
    );
    $('#SelectedProductsList').html('');
    EditOrderSelectedProducts.forEach(function(Product) {
        EditOrderAddProductInSelectedList(Product);
    }
    );
}

function EditOrderAddProductInList(Product){
    var OptionsCountHTML = '';
    if(Product.SelectedOptions != undefined && Product.SelectedOptions.length > 0){
        OptionsCountHTML = '<div class="ui label">' + Product.SelectedOptions.length + '</div>';
    }


    $('#ProductsList').append(
        `<div class="item">
            <div class="right floated content">
                <div class="ui left labeled button" tabindex="0">
                    ${OptionsCountHTML}
                    <button class="ui icon compact blue button popupButton" data-content="Add options" onclick="EditOrderOptionsModalButton('${Product.ID}')">
                        <i class="box icon"></i>
                    </button>
                </div>
                <button class="ui icon compact green button popupButton"  data-content="Add product" onclick="EditOrderAddProductButton('${Product.ID}')">
                    <i class="plus icon"></i>
                </button>
                <button class="ui icon compact button popupButton" data-content="Reset product" onclick="EditOrderResetProductButton('${Product.ID}')">
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

function EditOrderAddProductInSelectedList(Product){

    var OptionsCountHTML = '';
    if(Product.SelectedOptions != undefined && Product.SelectedOptions.length > 0){
        OptionsCountHTML = '<div class="ui label">' + Product.SelectedOptions.length + '</div>';
    }

    var OptionsDescription = 'No options selected';
    if(Product.SelectedOptions != undefined && Product.SelectedOptions.length > 0){
        OptionsDescription = '';
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
                <div class="ui input">
                    <input type="number" value="${Product.Amount}" min="1" max="100">
                </div>
                <div class="ui left labeled button" tabindex="0">
                    ${OptionsCountHTML}
                    <button class="ui icon compact blue button popupButton" data-content="${OptionsDescription}" onclick="EditOrderSelectedProductCheckOptionsButton('${Product.Product.ID}', '${OptionsList}')">
                        <i class="box icon"></i>
                    </button>
                </div>
                <button class="ui icon compact red button popupButton" data-content="Remove product" onclick="EditOrderRemoveProductButton('${Product.Product.ID}', '${OptionsList}')">
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

function EditOrderSelectedProductCheckOptionsButton(ProductID, Options){
    $('#EditOrderSelectedProductCheckOptionsModal').modal('show');

    if(Options != undefined && Options != ''){
        Options = Options.split(',');
        $('#EditOrderSelectedProductCheckOptionsList').html('');
    }
    else{
        Options = [];
    }

    var Product = EditOrderSelectedProducts.find(function(Product) { return Product.Product.ID == ProductID; });

    var Options = Product.Product.Options.filter(function(Option) {
        return Options.includes(Option.ID);
    }
    );


    Options.forEach(function(Option) {
        $('#EditOrderSelectedProductCheckOptionsList').append(
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

function EditOrderAddProductButton(ProductID){
    if(EditOrderSelectedProducts == null){
        EditOrderSelectedProducts = [];
    }

    var Product = EditOrderCurrentProducts.find(function(Product) { return Product.ID == ProductID; });
    
    if(Product.SelectedOptions == undefined || Product.SelectedOptions.length == null){
        Product.SelectedOptions = [];
    }

    var AlreadyPresent = false;
    EditOrderSelectedProducts.forEach(function(SelectedProduct) {
        if(SelectedProduct.Product.ID == Product.ID){
            if(SelectedProduct.SelectedOptions != undefined && SelectedProduct.SelectedOptions.sort().join(',') == Product.SelectedOptions.sort().join(',')){
                AlreadyPresent = true;
                SelectedProduct.Amount++;
            }
        }
    }
    );

    if(!AlreadyPresent){
        EditOrderSelectedProducts.push({
            ID: Product.ID,
            Product: Product,
            Amount: 1,
            SelectedOptions: Product.SelectedOptions
        });
    }

    EditOrderCurrentProducts.find(function(Product) { return Product.ID == ProductID; }).SelectedOptions = [];
    EditOrderRefreshProductsTable();

}

function EditOrderOptionsModalButton(ProductID){
    $('#EditOrderAddOptionsModal').modal('show');
    EditOrderCurrentProductID = ProductID;
    EditOrderSelectedOptions = EditOrderCurrentProducts.find(function(Product) { return Product.ID == ProductID; }).SelectedOptions;

    var Product = EditOrderCurrentProducts.find(function(Product) { return Product.ID == ProductID; });
    var Options = Product.Options;
    $('#EditOrderAddOptionsList').html('');
    if(Options == null){
        $('#EditOrderAddOptionsList').html(`<div class="item">No options available</div>`);
        Options = [];
    }

    Options.forEach(function(Option) {
        var checked = '';
        if(EditOrderSelectedOptions != undefined && EditOrderSelectedOptions.indexOf(Option.ID) != -1){
            checked = "checked";
        }



        $('#EditOrderAddOptionsList').append(
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
                EditOrderSelectOption(OptionID);
            }, 
            onUnchecked: function() {
                var OptionID = $(this).attr('name');
                EditOrderUnselectOption(OptionID);
            }
        });

        
    }
    );
}

function EditOrderResetProductButton(ProductID){
    var Product = EditOrderCurrentProducts.find(function(Product) { return Product.ID == ProductID; });
    Product.SelectedOptions = [];
    EditOrderRefreshProductsTable();
}

function EditOrderSelectOption(OptionID){
    if(EditOrderSelectedOptions == null){
        EditOrderSelectedOptions = [];
    }

    if(EditOrderSelectedOptions.indexOf(OptionID) == -1){
        EditOrderSelectedOptions.push(OptionID);
    }
}

function EditOrderUnselectOption(OptionID){
    if(EditOrderSelectedOptions == null){
        EditOrderSelectedOptions = [];
    }

    if(EditOrderSelectedOptions.indexOf(OptionID) != -1){
        EditOrderSelectedOptions.splice(EditOrderSelectedOptions.indexOf(OptionID), 1);
    }
}

function EditOrderRemoveProductButton(ProductID, Options){
    if(Options == undefined){
        Options = '';
    }

        

    Options = Options.split(',');
    EditOrderSelectedProducts.forEach(function(SelectedProduct) {
        if(SelectedProduct.Product.ID == ProductID){
            if(Options == undefined && SelectedProduct.SelectedOptions == undefined){
                EditOrderSelectedProducts.splice(EditOrderSelectedProducts.indexOf(SelectedProduct), 1);
            }
            else if(Options != undefined && SelectedProduct.SelectedOptions != undefined && SelectedProduct.SelectedOptions.sort().join(',') == Options.sort().join(',')){
                EditOrderSelectedProducts.splice(EditOrderSelectedProducts.indexOf(SelectedProduct), 1);
            }
        }
    }
    );
    EditOrderRefreshProductsTable();
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
        $('#EditOrderClientError').html('Please fill in all client required fields');
        return;
    }

    

    SelectedProducts = EditOrderSelectedProducts;
    var TotalPrice = 0;
    SelectedProducts.forEach(function(SelectedProduct) {
        var Product = SelectedProduct.Product;
        var Options = SelectedProduct.SelectedOptions;
        var Amount = SelectedProduct.Amount;
        var Price = Product.Price;
        if(Options != undefined){
            Options.forEach(function(OptionID) {
                var Option = Product.Options.find(function(Option) { return Option.ID == OptionID; });
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
        axios.post('/order/create', Data)
        .then(function (response) {
            ShowNotif("Order created", "green");
            $('#EditOrderModal').modal('hide');
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
            $('#EditOrderModal').modal('hide');
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

        EditOrderSelectedProducts = CurrentOrder.Products;
        EditOrderRefreshProductsTable();
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

    // axios get /order/get

    axios.post('/order/get', {OrderID: OrderID})
    .then(function (response) {
        CurrentOrder = response.data.message;
        $('#OrderDetailsNameField').val(CurrentOrder.Client.FirstName + ' ' + CurrentOrder.Client.LastName);
        $('#OrderDetailsEmailField').val(CurrentOrder.Client.Email);
        $('#OrderDetailsPhoneField').val(CurrentOrder.Client.Phone);
        $('#OrderDetailsCountryField').val(CurrentOrder.Client.Country);
        if(CurrentOrder.Client.Email == ""){
            $('#OrderDetailsEmailField').val("No email provided");
        }
        if(CurrentOrder.Client.Phone == ""){
            $('#OrderDetailsPhoneField').val("No phone provided");
        }
        if(CurrentOrder.Client.Country == ""){
            $('#OrderDetailsCountryField').val("No country provided");
        }

        var Products = CurrentOrder.Products;

        $('#OrderDetailsProductsList').html('');
        Products.forEach(function(Product) {
            var Amount = Product.Amount;
            Product = Product.Product;
            var ImageContent = `<i class="camera icon"></i>`;
            if(Product.Images != undefined && Product.Images.length > 0){
                ImageContent = `<img style="max-width: 30px; max-height: 30px" src="${url}/media/${Product.Images[0]}" class="img-fluid">`;
            }
            $('#OrderDetailsProductsList').append(
                `<div class="item">
                    <div class="right floated content">
                        <div class="ui mini input">
                            <input readonly type="number" min="1" value="${Amount}" id="amount">
                        </div>
                    </div>
                    <div class="content">
                        ${ImageContent}
                        <span style="margin-right: 10px;" class="popupButton" data-content="${Product.Description}">${Product.Title}</span>
                        <div class="ui label">
                            ${Product.Price}€
                        </div>
                    </div>
                </div>`
            );
        }
        );

    }
    )
    .catch(function (error) {
        console.log(error);
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
        console.log(ActualOrdersTab);
        LoadOrders(ActualOrdersTab);
    }
    )
    .catch(function (error) {
        HandleError(error);
    }
    );
}

function ResetEditOrderModal(){
    EditOrderSelectedOptions = [];
    EditOrderSelectedProducts = [];
    EditOrderCurrentProductID = null;
    EditOrderCurrentProducts = [];

    // FirstName LastName Email Phone Address PostCode City Country

    $('#EditOrderFirstNameField').val("");
    $('#EditOrderLastNameField').val("");
    $('#EditOrderEmailField').val("");
    $('#EditOrderPhoneField').val("");
    $('#EditOrderAddressField').val("");
    $('#EditOrderPostCodeField').val("");
    $('#EditOrderCityField').val("");
    $('#EditOrderCountryField').val("");
}