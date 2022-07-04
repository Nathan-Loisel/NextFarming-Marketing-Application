
$(document).ready(function() {
    // NewOrderModal: closable false
    $('#NewOrderModal').modal({
        closable: false
    });

    $('.tabular.menu .item').tab();
    $('.ui.dropdown').dropdown();

    $('#NewOrderButton').click(function() {
        $('#NewOrderModal').modal('show');
    }
    );
}
);