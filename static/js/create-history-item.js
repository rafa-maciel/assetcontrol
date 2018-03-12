$("#btn-create-new-item").click(createNewHistoryItem);
$("#see-more").click(seeMoreItems);

function createNewHistoryItem() {
    var content = getContentFromFormItem();

    $.ajax({
        method: "POST",
        url: "/devices/item/create/",
        data: content,
        dataType: "json",
        success: function(data) {
            console.log(data);
            addItemToFirstHistoryItemsList(data);
            cleanFormItem();
            updateItemsTotalLabel();
            updateItemsMaxLabel();
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
                console.log(item);
                addItemToHistoryItemsList(item);

            });
            updateItemsMaxLabel();
        }
    });

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

function addItemToFirstHistoryItemsList(item) {
    var listItem = createNewItemTag(item);
    $("#history-items").prepend(listItem);
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
            linkDefault.clone().attr("href", "#").addClass("edit")
        )
    );

    divFooter.find(".delete i").text("delete");
    divFooter.find(".edit i").text("mode_edit");

    return $("<li>").addClass("collection-item").append(divHeader).append(divContent).append(divFooter);
}
