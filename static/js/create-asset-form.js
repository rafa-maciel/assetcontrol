$(".btn-create-new-item").click(createNewDeviceType);

function createNewDeviceType() {
    var content = getFormNewTypeContent();

    $.ajax({
        method: 'POST',
        url: '/devices/type/create',
        data: content,
        dataType: 'json',
        success: function(data) {
            addTypeCreated(data);
        }
    });

    cleanFormType();
}

function cleanFormType() {
    $("#type_name").val("");
}

function getFormNewTypeContent() {
    var name = $("#type_name").val();
    var content = {
        'name': name
    };

    return content;
}

function addTypeCreated(type) {
    var optionType = new Option(type["name"], type["pk"], true, true);
    $("#type").append(optionType);
    // with materializecss is always needed call
    // 'material_select' when a select has been changed
    $("#type").material_select();
    
}
