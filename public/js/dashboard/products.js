var CurrentProductID = null;
var CurrentOptionID = null;
var CurrentOptions = null;

$(document).ready(function() {
    RefreshProductsTable();
    //set content of ProductsTable to 'hello world'
    $('#ProductsTable').html('hello world');

    $('#AddProductButton').click(function() {
        $('#AddProductModal').modal('show');
    }
    );

    $('#AddProductConfirmButton').click(function() {

        var Title = $('#AddProductTitleField').val();
        if(Title == "") { Title = undefined };
        var ShortDescription = $('#AddProductShortDescriptionField').val();
        if(ShortDescription == "") { ShortDescription = undefined };
        var LongDescription = $('#AddProductLongDescriptionField').val();
        if(LongDescription == "") { LongDescription = undefined };
        var Price = $('#AddProductPriceField').val();
        if(Price == "") { Price = undefined };

        var Product = {
            Title : Title,
            ShortDescription : ShortDescription,
            LongDescription : LongDescription,
            Price : Price
        };
        AddProduct(Product);
    }
    );

    $('#DeleteProductConfirmButton').click(function() {
        DeleteProduct(CurrentProductID);
    }
    );

    $('#EditProductButton').click(function() {
        $('#EditProductModal').modal('show');
        $('#EditProductTitleField').val($('#ManageProductTitleField').val());
        $('#EditProductShortDescriptionField').val($('#ManageProductShortDescriptionField').val());
        $('#EditProductLongDescriptionField').val($('#ManageProductLongDescriptionField').val());
        $('#EditProductPriceField').val($('#ManageProductPriceField').val());
    }
    );

    $('#EditProductConfirmButton').click(function() {
        var Title = $('#EditProductTitleField').val();
        if(Title == "") { Title = undefined };
        var ShortDescription = $('#EditProductShortDescriptionField').val();
        if(ShortDescription == "") { ShortDescription = undefined };
        var LongDescription = $('#EditProductLongDescriptionField').val();
        if(LongDescription == "") { LongDescription = undefined };
        var Price = $('#EditProductPriceField').val();
        if(Price == "") { Price = undefined };

        var Product = {
            Title : Title,
            ShortDescription : ShortDescription,
            LongDescription : LongDescription,
            Price : Price
        };
        EditProduct(CurrentProductID, Product);
    }
    );

    $('#DeleteProductButton').click(function() {
        OpenDeleteProductModal(CurrentProductID);
    });

    $('#AddOptionButton').click(function() {
        $('#AddOptionModal').modal('show');
    }
    );
    
    $('#AddOptionConfirmButton').click(function() {
        //check if title and price are set
        if($('#AddOptionTitleField').val() == "" || $('#AddOptionPriceField').val() == ""){
            ShowNotif("Please fill in all fields", 'red');
            return;
        }
        var Option = {
            Title : $('#AddOptionTitleField').val(),
            Description : $('#AddOptionDescriptionField').val(),
            Price : $('#AddOptionPriceField').val()
        };
        AddOption(CurrentProductID, Option);
    }
    );

    $('#EditOptionConfirmButton').click(function() {
        var OptionTitle = $('#EditOptionTitleField').val();
        if(OptionTitle == "") { OptionTitle = undefined };
        var OptionDescription = $('#EditOptionDescriptionField').val();
        if(OptionDescription == "") { OptionDescription = undefined };
        var OptionPrice = $('#EditOptionPriceField').val();
        if(OptionPrice == "") { OptionPrice = undefined };
        var Option = {
            Title : OptionTitle,
            Description : OptionDescription,
            Price : OptionPrice
        };
        EditOption(CurrentOptionID, Option);
    }
    );

    $('#DeleteOptionConfirmButton').click(function() {
        DeleteOption(CurrentProductID, CurrentOptionID);
    }
    );
}
);

function AddProduct(Product) {

    $('#AddProductConfirmButton').addClass('loading');
    api.post('/product/create', Product)
    .then(res => {
        RefreshProductsTable();
        ShowNotif("Product successfully created", 'green');
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
        $('#AddProductModal').modal('hide');
        $('#AddProductConfirmButton').removeClass('loading');
    }
    );
}

function RefreshProductsTable() {
    var data = {
        Amount: 10,
        Page: 1
    }
    api.post('/product/list', data)
    .then(res => {
        $('#ProductsTable').html('');
        res.data.message.forEach(function(Product) {
            AddProductToTable(Product);
        });
    }
    )
    .catch(error => {    
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

function AddProductToTable(Product) {
    $('#ProductsTable').append(
        '<tr>' +
        '<td>' + Product.Title + '</td>' +
        '<td>' + Product.ShortDescription + '</td>' +
        '<td>' + Product.ImageURL + '</td>' +
        '<td>' + Product.Price + '</td>' +
        '<td class="collapsing" style="padding: 5px;">' +
        '<button style="padding: 7px; font-size: 14px;" class="ui mini green button" onclick="OpenManageProductSidebar(\'' + Product.ID + '\')" >Manage</button>' +
        '<button style="padding: 7px; font-size: 14px;" class="ui mini red button" onclick="OpenDeleteProductModal(\'' + Product.ID + '\')">Delete</button>' +
        '</td>' +
        '</tr>'
    );
}

function OpenManageProductSidebar(ID) {
    CurrentProductID = ID;
    $('#ManageProductSidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
    LoadProduct(ID);
}

function LoadProduct(ID){
    api.post('/product/get', {ProductID: ID})
    .then(res => {
        $('#ManageProductTitleField').val(res.data.message.Title);
        $('#ManageProductShortDescriptionField').val(res.data.message.ShortDescription);
        $('#ManageProductLongDescriptionField').val(res.data.message.LongDescription);
        $('#ManageProductPriceField').val(res.data.message.Price);
        $('#ManageProductCreatedField').val(res.data.message.Created);
        $('#ProductTitle').html(res.data.message.Title);

        CurrentOptions = res.data.message.Options;
        RefreshOptionsTable(CurrentOptions);
    }
    )
    .catch(error => {
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

function RefreshOptionsTable(Options) {
    $('#OptionsTable').html('');
    if(Options != null) {    
        Options.forEach(function(Option) {
            AddOptionToTable(Option);
        }
        );
    }
}

function AddOptionToTable(Option) {
    $('#OptionsTable').append(
        '<tr>' +
        '<td>' + Option.Title + '</td>' +
        '<td>' + Option.Description + '</td>' +
        '<td>' + Option.Price + '</td>' +
        '<td class="collapsing" style="padding: 5px;">' +
        '<button style="padding: 7px; font-size: 14px;" class="ui mini green button" onclick="OpenEditOptionModal(\'' + Option.ID + '\')">Edit</button>' +
        '<button style="padding: 7px; font-size: 14px;" class="ui mini red button" onclick="OpenDeleteOptionModal(\'' + Option.ID + '\')">Delete</button>' +
        '</td>' +
        '</tr>'
    );
}

function OpenDeleteProductModal(ID) {
    CurrentProductID = ID;
    $('#DeleteProductModal').modal('show');
}

function DeleteProduct(ID) {
    $('#DeleteProductConfirmButton').addClass('loading');
    api.post('/product/delete', {ProductID: ID})
    .then(res => {
        RefreshProductsTable();
        ShowNotif("Product successfully deleted", 'green');
    }
    )
    .catch(error => {
        if(error.response.data != null){
            if(error.response.data.message == undefined){
                ShowNotif("Server Error", 'red');
            }
            ShowNotif(error.response.data.message, 'red');
        }
        else{
            ShowNotif("Server Error", 'red');
        }
    }
    ).then(() => {
        $('#DeleteProductModal').modal('hide');
        $('#DeleteProductConfirmButton').removeClass('loading');
    }
    );
}

function ResetManageProductSidebar() {
    
    $('#ProductTitle').html(
        '<div class="ui placeholder" style="margin-left: 20px;"'
        + '<div class="line"></div>'
        + '<div class="line"></div>'
        + '</div>'
    );
    $('#ManageProductTitleField').val('Loading');
    $('#ManageProductDescriptionField').val('Loading');
    $('#ManageProductCreatedField').val('Loading');
}

function EditProduct(ProductID, Product){
    $('#EditProductConfirmButton').addClass('loading');
    api.post('/product/update', {
        ProductID: ProductID, 
        Title: Product.Title,
        ShortDescription: Product.ShortDescription,
        LongDescription: Product.LongDescription,
        Price: Product.Price 
    })
    .then(res => {
        RefreshProductsTable();
        LoadProduct(ProductID);
        ShowNotif("Product successfully updated", 'green');
    }
    )
    .catch(error => {
        if(error.response.data != null){
            if(error.response.data.message == undefined){
                ShowNotif("Server Error", 'red');
            }
            ShowNotif(error.response.data.message, 'red');
        }
        else{
            ShowNotif("Server Error", 'red');
        }
    }
    ).then(() => {
        $('#EditProductModal').modal('hide');
        $('#EditProductConfirmButton').removeClass('loading');
    }
    );
}

function AddOption(ProductID, Option){
    $('#AddOptionConfirmButton').addClass('loading');
    api.post('/product/options/add', {
        ProductID: ProductID, 
        Title: Option.Title,
        Description: Option.Description,
        Price: Option.Price
    })
    .then(res => {
        LoadProduct(ProductID);
        ShowNotif("Option successfully added", 'green');
    }
    )
    .catch(error => {
        if(error.response.data != null){
            if(error.response.data.message == undefined){
                ShowNotif("Server Error", 'red');
            }
            ShowNotif(error.response.data.message, 'red');
        }
        else{
            ShowNotif("Server Error", 'red');
        }
    }
    ).then(() => {
        $('#AddOptionModal').modal('hide');
        $('#AddOptionConfirmButton').removeClass('loading');
    }
    );
}

function OpenEditOptionModal(OptionID) {
    CurrentOptionID = OptionID;
    Option = CurrentOptions.find(function(Option) {
        return Option.ID == OptionID;
    }
    );
    $('#EditOptionTitleField').val(Option.Title);
    $('#EditOptionDescriptionField').val(Option.Description);
    $('#EditOptionPriceField').val(Option.Price);
    

    $('#EditOptionModal').modal('show');
}

function OpenDeleteOptionModal(ID) {
    CurrentOptionID = ID;
    $('#DeleteOptionModal').modal('show');
}

function EditOption(OptionID, Option){
    $('#EditOptionConfirmButton').addClass('loading');
    api.post('/product/options/update', {
        ProductID: CurrentProductID,
        OptionID: OptionID, 
        Title: Option.Title,
        Description: Option.Description,
        Price: Option.Price 
    })
    .then(res => {
        LoadProduct(ProductID);
        ShowNotif("Option successfully updated", 'green');
    }
    )
    .catch(error => {
        if(error.response.data != null){
            if(error.response.data.message == undefined){
                ShowNotif("Server Error", 'red');
            }
            ShowNotif(error.response.data.message, 'red');
        }
        else{
            ShowNotif("Server Error", 'red');
        }
    }
    ).then(() => {
        $('#EditOptionModal').modal('hide');
        $('#EditOptionConfirmButton').removeClass('loading');
    }
    );
}

function DeleteOption(ProductID, OptionID) {
    $('#DeleteOptionConfirmButton').addClass('loading');
    api.post('/product/options/delete', {ProductID: ProductID, OptionID: OptionID})
    .then(res => {
        LoadProduct(ProductID);
        ShowNotif("Option successfully deleted", 'green');
    }
    )
    .catch(error => {
        if(error.response.data != null){
            if(error.response.data.message == undefined){
                ShowNotif("Server Error", 'red');
            }
            ShowNotif(error.response.data.message, 'red');
        }
        else{
            ShowNotif("Server Error", 'red');
        }
    }
    ).then(() => {
        $('#DeleteOptionModal').modal('hide');
        $('#DeleteOptionConfirmButton').removeClass('loading');
    }
    );
}