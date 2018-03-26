$("#btn-create-new-item").click(createNewHistoryItem);
$("#see-more").click(seeMoreItems);
$(".btn-edit").click(historyItemBtnEdit);

function historyItemBtnEdit(event) {
    event.preventDefault();
    var url = $(this).attr("href");

    item = editItemBy(url);
}

function editItemBy(url) {
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: function(data){
            showModalItemEdit(data);
        }
    });
}

function createNewHistoryItem() {
    var content = getContentFromFormItem();
    var url = $("#newItem").attr("action");

    $.ajax({
        method: "POST",
        url: url,
        data: content,
        dataType: "json",
        success: function(data) {
            console.log(data);
            addOrReplaceHistoryItemList(data);
            cleanFormItem();
            updateItemsTotalLabel();
            updateItemsMaxLabel();
            $("#modalNewItem").modal("close");
        }
    });


}

function seeMoreItems() {
    var actualSize = countCurrentsItems();
    var totalItems = actualSize + 3;

    var content = {
        'min': actualSize,
        'max': totalItems
    }


    $.ajax({
        method: 'POST',
        url: 'see-more-items',
        data: content,
        dataType: 'json',
        success: function(data) {
            $.each(data, function(i, obj) {
                var item = data[i];
                addItemToHistoryItemsList(item);

            });
            updateItemsMaxLabel();
        }
    });

}

function showModalItemEdit(item) {
    $("#newItem input[name='pk']").val(item["pk"]);
    $("#newItem input[name='title']").val(item["title"]);
    $("#newItem textarea[name='description']").val(item["description"]);
    $("#newItem input[name='keywords']").val(item["keywords"]);

    $("#modalNewItem").modal({
        complete: function() {
            console.log("Fechou o modal");
            cleanFormItem();
        }
    });

    $("#modalNewItem").modal("open");
}

function countCurrentsItems() {
    return $("#history-items .collection-item").length;
}

function updateItemsTotalLabel() {
    var size = parseInt($("#items-size").text());
    size += 1;
    $("#items-size").text(size);
}

function updateItemsMaxLabel() {
    var size = countCurrentsItems();
    var total = $("#items-size").text();

    if (size == total) {
        $("#see-more").remove();
    }

    $("#max-items").text(size);
}

function cleanFormItem() {
    $("#newItem").trigger("reset");
    // jquery reset doesn't work with hidden values
    $("#newItem input[name='pk']").val("");
}

function getContentFromFormItem() {
    var content = $("#newItem").serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    return content;
}

function addItemToHistoryItemsList(item) {
    var listItem = createNewItemTag(item);
    $("#history-items").append(listItem);
}

function addOrReplaceHistoryItemList(item) {
    var itemPK = item["pk"];
    var listItem = createNewItemTag(item);

    if ($("#history-items li input[name='item-pk'][value='" + itemPK + "']").length) {
        var itemElement = $(".collection li input[name='item-pk'][value='" + itemPK + "']").parent();
        var indexOfItemElement = itemElement.index();
        itemElement.remove();
        $("#history-items li").eq((indexOfItemElement-1)).after(listItem);
    } else {
        $("#history-items").prepend(listItem);
    }
}

function createNewItemTag(item) {
    var divHeader = $("<div>").addClass("row").append(
        $("<div>").addClass("col s10").append(
            $("<span>").addClass("title").text(item["title"])
        )
    ).append(
        $("<div>").addClass("col s2").append(
            $("<p>").addClass("right-align").text(item["date"])
        )
    );

    var divContent = $("<div>").addClass("row").append(
        $("<div>").addClass("col s12").append(
            $("<p>").text(item["description"])
        )
    );

    var urlEdit = "/devices/item/details/";
    var linkDefault = $("<a>").addClass("secondary-content").append(
        $("<i>").addClass("material-icons")
    );

    var divFooter = $("<div>").addClass("row").append(
        $("<div>").addClass("col s10").append(
            $("<p>").text(item["keywords"])
        )
    ).append(
        $("<div>").addClass("col s2").append(
            linkDefault.clone().attr("href", "#").addClass("delete")
        ).append(
            linkDefault.clone().attr("href", urlEdit + item['pk']).addClass("edit")
        )
    );

    divFooter.find(".delete i").text("delete");

    divFooter.find(".edit i").text("mode_edit");
    divFooter.find(".edit").click(historyItemBtnEdit);

    var itemPK = $("<input>").attr("type", "hidden").attr("value", item["pk"]).addClass("item-pk");
    return $("<li>").addClass("collection-item").append(itemPK).append(divHeader).append(divContent).append(divFooter);
}
