var NewOrderSelectedProducts = [];
var NewOrderCurrentProducts = [];
var NewOrderSelectedOptions = [];
var NewOrderCurrentProductID = null;

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
    $('.ui.dropdown').dropdown();
    $('.popupButton').popup();

    $('.ui.modal').modal({
        allowMultiple: true
    });

    $('#NewOrderModal').modal({
        closable: false
    });

    $('#NewOrderButton').click(function() {
        LoadProducts();
        $('#NewOrderModal').modal('show');
    }
    );

    $('#NewOrderAddOptionsConfirmButton').click(function() {
        var Product = NewOrderCurrentProducts.find(function(Product) { return Product.ID == NewOrderCurrentProductID; });
        Product.SelectedOptions = NewOrderSelectedOptions;
        RefreshProductsTable();
    }
    );

}
);

function LoadProducts(Search, Page){
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
        RefreshProductsTable();
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

function RefreshProductsTable(){
    $('#ProductsList').html('');
    NewOrderCurrentProducts.forEach(function(Product) {
        AddProductInList(Product);
    }
    );
    $('#SelectedProductsList').html('');
    NewOrderSelectedProducts.forEach(function(Product) {
        AddProductInSelectedList(Product);
    }
    );
}


function AddProductInList(Product){
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

function AddProductInSelectedList(Product){

    var OptionsCountHTML = '';
    if(Product.SelectedOptions != undefined && Product.SelectedOptions.length > 0){
        OptionsCountHTML = '<div class="ui label">' + Product.Product.SelectedOptions.length + '</div>';
    }

    $('#SelectedProductsList').append(
        `<div class="item">
            <div class="right floated content">
                <div class="ui left labeled button" tabindex="0">
                    ${OptionsCountHTML}
                    <button class="ui icon compact blue button popupButton" data-content="Add options" onclick="NewOrderOptionsModalButton('${Product.Product.ID}')">
                        <i class="box icon"></i>
                    </button>
                </div>
                <button class="ui icon compact red button popupButton" data-content="Remove product" onclick="NewOrderRemoveProductButton('${Product.Product.ID}')">
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

function NewOrderAddProductButton(ProductID){
    if(NewOrderSelectedProducts == null){
        NewOrderSelectedProducts = [];
    }

    var Product = NewOrderCurrentProducts.find(function(Product) { return Product.ID == ProductID; });
    
    var ProductExists = NewOrderSelectedProducts.find(function(Product) { return Product.ID == ProductID; });
    if(ProductExists == undefined){
        var NewProduct = {
            ID: Product.ID,
            Product: Product,
            Amount: 1,
            SelectedOptions: NewOrderCurrentProducts.find(function(Product) { return Product.ID == ProductID; }).SelectedOptions
        }
        NewOrderSelectedProducts.push(NewProduct);
    }
    else{
        FirstOptions = ProductExists.SelectedOptions;
        if(FirstOptions == null || FirstOptions == undefined){
            FirstOptions = [];
        }
        SecondOptions = Product.SelectedOptions;
        if(SecondOptions == null || SecondOptions == undefined){
            SecondOptions = [];
        }
        if(FirstOptions.sort().join(',') == SecondOptions.sort().join(',')){
            ProductExists.Amount++;
        }
        else{
            var NewProduct = {
                ID: Product.ID,
                Product: Product,
                Amount: 1,
                SelectedOptions: NewOrderCurrentProducts.find(function(Product) { return Product.ID == ProductID; }).SelectedOptions
            }
            NewOrderSelectedProducts.push(NewProduct);
        }
    }
    RefreshProductsTable();
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
    RefreshProductsTable();
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