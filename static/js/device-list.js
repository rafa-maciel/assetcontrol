$(function() {
    $("#modal-device-remove").modal({
        complete: function() {
            $("#modal-device-remove .device-name").text("");
            $("#modal-device-remove input[name='device-pk']").val("");
        }
    });

    $(".device-remove").click(function(event) {
        event.preventDefault();
        var itemList = $(this).parent().parent();
        var devicePK = itemList.find(".device-pk").text();
        var deviceName = itemList.find(".device-name").text();

        showModalDeviceRemove(devicePK, deviceName);
    });

    $("#modal-device-remove .btn-remove").click(removeDevice);
    $("#modal-device-remove .btn-cancel").click(function() {
        $("#modal-device-remove").modal("close");
    });
});

function showModalDeviceRemove(pk, name) {
    var modal = $("#modal-device-remove");
    modal.find(".device-name").text(name);
    modal.find("input[name='device-pk']").val(pk);

    $(modal).modal("open");
}

function removeDevice() {
    var url = '/devices/delete/';
    var devicePK = $("#modal-device-remove input[name='device-pk']").val();
    var content = {
        'pk': devicePK
    }

    $.ajax({
        method: 'POST',
        dataType: 'json',
        data: content,
        url: url,
        success: function(data) {
            removeDeviceFromTable(devicePK);
            $("#modal-device-remove").modal("close");
        }
    });

}

function removeDeviceFromTable(pk) {
    $("#device-items #" + pk).remove();
}
