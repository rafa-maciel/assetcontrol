$(function() {
    // modal item should call custom settings
    $("#modal-item").modal({
        complete: function() {
            cleanFormItem(); // on close clean form
        }
    });

    // on submit form history item should check if is an update or a create
    // and take an action
     $("#form-item #btn-submit-form").click(function() {
         var pk = $("#form-item input[name='pk']").val();
         if (pk === null || pk === "") {
             createHistoryItem();
         } else {
             console.log("Updating history item " + pk);
             updateHistoryItem();

         }
     });
});

function cleanFormItem() {
     $("#form-item").trigger("reset");
     // jquery reset doesn't work with hidden values
     $("#form-item input[name='pk']").val("");
 }

 function showModalItemEditMode(item) {
     var form = $("#modal-item #form-item");
     $(form).find("input[name='pk']").val(item["pk"]);
     $(form).find("input[name='title']").val(item["title"]);
     $(form).find("textarea[name='description']").val(item["description"]);
     $(form).find("input[name='keywords']").val(item["keywords"]);

     $("#modal-item").modal("open");
 }

function createHistoryItem() {
    var itemData = getFormHistoryItemData();
    var url = "/devices/item/create/";

    $.ajax({
        method: "POST",
        url: url,
        data: itemData,
        dataType: "json",
        success: function(data) {
            console.log(data);
            addHistoryItemList(data);
            $("#modal-item").modal("close"); // close the modal
        }
    });
}

function updateHistoryItem() {
    var itemData = getFormHistoryItemData();
    var url = "/devices/item/update/";

    $.ajax({
        method: "POST",
        url: url,
        data: itemData,
        dataType: "json",
        success: function(data) {
            console.log(data);
            updateHistoryItemList(data);
            $("#modal-item").modal("close"); // close the modal
        }
    });

}

function getFormHistoryItemData() {
    var content = $("#form-item").serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    return content;
}
