var NewOrderSelectedProducts = null;
var CurrentProducts = null;


$(document).ready(function() {
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

    // Example:
    // var data = {
    //     Amount: 10,
    //     Page: 1
    // }
    // api.post('/product/list', data)
    // .then(res => {
    //     $('#ProductsTable').html('');
    //     res.data.message.forEach(function(Product) {
    //         AddProductToTable(Product);
    //     });
    // }
    // )
    // .catch(error => {    
    //     console.log(error);
    //     if(error.response != null && error.response.data != null){
    //         if(error.response.data.message == undefined){
    //             ShowNotif("Server Error", 'red');
    //         };
    //         ShowNotif(error.response.data.message, 'red');
    //     }
    //     else{
    //         ShowNotif("Server Error", 'red');
    //     }
    // }
    // );

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

function AddProductInList(Product){
    $('#ProductsList').append(
        '<div class="item">' +
        '<div class="right floated content">' +
        '<div class="ui green button" onclick="AddProductToOrder(' + Product.ID + ')">Add</div>' +
        '<div class="ui red button" onclick="DeleteProductFromOrder(' + Product.ID + ')">Delete</div>' +
        '<div class="ui input">' +
        '<input type="number" name="product-' + Product.ID + '" id="product-' + Product.ID + '" value="0" min="0" max="100">' +
        '</div>' +
        '</div>' +
        '<img class="ui avatar image" src="/images/avatar2/small/lena.png">' +
        '<div class="content">' +
        Product.Title +
        '</div>' +
        '</div>'
    );
}