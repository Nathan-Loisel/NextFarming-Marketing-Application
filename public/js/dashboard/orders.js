var NewOrderSelectedProducts = null;
var CurrentProducts = null;

// NewOrderSelectedProducts = {
//    "product id": {
//        "product": {}
//        "amount": 0,
//        "options id": []
//    }

$(document).ready(function() {
    $('.ui.modal').modal({
        allowMultiple: true
    });

    $('.popupButton').popup();

    $('#NewOrderModal').modal({
        closable: false
    });

    $('.tabular.menu .item').tab();
    $('.ui.dropdown').dropdown();

    $('#NewOrderButton').click(function() {
        LoadProducts();
        $('#NewOrderModal').modal('show');
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
        CurrentProducts = res.data.message;
        $('#ProductsList').html('');
        res.data.message.forEach(function(Product) {
            AddProductInList(Product);
        }
        );
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

function AddProductInList(Product){
    $('#ProductsList').append(
        `<div class="item">
            <div class="right floated content">
                <button class="ui icon compact blue button popupButton" data-content="Add options" onclick="OpenNewOrderOptionsModal('${Product.ID}')">
                    <i class="box icon"></i>
                </button>
                <button class="ui icon compact green button popupButton"  data-content="Add product" onclick="AddProductToNewOrder('${Product.ID}')">
                    <i class="plus icon"></i>
                </button>
                <button class="ui icon compact button popupButton" data-content="Reset product">
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

function AddProductToNewOrder(ProductID){
    if(NewOrderSelectedProducts == null){
        NewOrderSelectedProducts = {};
    }

    if(NewOrderSelectedProducts[ProductID] != undefined){
        SelectedOptions = CurrentProducts.find(function(Product) { return Product.ID == ProductID; }).SelectedOptions;

        
    }
}

function OpenNewOrderOptionsModal(ProductID){
    $('#NewOrderOptionsModal').modal('show');
}