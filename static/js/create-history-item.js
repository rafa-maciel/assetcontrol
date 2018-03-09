$("#btn-create-new-item").click(createNewHistoryItem);

function createNewHistoryItem() {
    var content = getContentFromFormItem();

    $.ajax({
        method: "POST",
        url: "/devices/item/create/",
        data: content,
        dataType: "json",
        success: function(data) {
            addItemToHistoryItemsList(data);
        }
    });

    cleanFormItem();
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

function cleanFormItem() {
    $("#newItem").trigger("reset");
}
