
$(document).ready(function() {
    $('#ManageButton').click(function() {   
        $('#ManageProductSidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');  
    });
}
);