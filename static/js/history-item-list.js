$(function() {
    updateCurrentItemsSize(); // update label how much items are been showing
    updateButtonsItemActions(); // its needed to remove edit button default action and set a new for
    activeButtonSeeMoreItems();

    $("#modal-item-remove .btn-small").click(deleteHistoryItem);
    $("#modal-item-remove").modal();
});


function activeButtonSeeMoreItems() {
    $(".btn#see-more-items").click(seeMoreHistoryItems);
    updateStatusButtonSeeMoreItems();
}

function updateStatusButtonSeeMoreItems() {
    var itemsSize = parseInt($(".items-size-label #current-items-size").text())
    var itemsTotal = parseInt($(".items-size-label #total-items").text())
    if (itemsSize >= itemsTotal) {
        $(".btn#see-more-items").addClass("disabled");
    } else {
        $(".btn#see-more-items").removeClass("disabled");
    }
}

function updateButtonsItemActions() {
    var items = $(".collection li");
    $(items).each(function() {
        updateButtonItemEditAction(this);
        updateButtonItemRemoveAction(this);
    });
}

function updateButtonItemEditAction(itemTag) {
    var button = $(itemTag).find(".btn-edit");
    $(button).click(function(event) {
        event.preventDefault();
        var url = $(this).attr("href");

        $.ajax({
            method: "GET",
            url: url,
            dataType: "json",
            success: function(data) {
                showModalItemEditMode(data);
            },
        });
    })
}

function updateButtonItemRemoveAction(itemTag) {
    var button = $(itemTag).find(".btn-delete");
    $(button).click(function(event){
        event.preventDefault();
        var pk = $(itemTag).find("input[name='item-pk']").val();
        var title = $(itemTag).find(".title").text();

        showModalItemRemove(pk, title);
    });
}

function showModalItemRemove(pk, title) {
    var modal = $("#modal-item-remove");
    $(modal).find("span.item-title").text(title);
    $(modal).find("input[name='item-pk']").val(pk);

    $("#modal-item-remove").modal("open");
}

function closeModalItemRemove() {
    var modal = $("#modal-item-remove");
    modal.modal("close");
    $(modal).find("span.item-title").text("");
    $(modal).find("input[name='item-pk']").val("");
}

function deleteHistoryItem() {
    var url = "/devices/item/delete/"
    var pk = $("#modal-item-remove input[name='item-pk']").val();

    if (pk != null && pk !== "") {
        var dataContent = {
            'pk': pk
        }

        $.ajax({
            method: "POST",
            url: url,
            data: dataContent,
            dataType: "json",
            success: function() {
                removeHistoryItemList(pk);
                decrementTotalItemsSize();
                updateCurrentItemsSize();
                closeModalItemRemove();

            }
        });
    }
}

function seeMoreHistoryItems() {
    var itemsSize = parseInt($(".items-size-label #current-items-size").text()); // how much items are showing now
    var moreItems = itemsSize + 3; // # is how much more items we want to see

    var dataContent = {
        'min': itemsSize,
        'max': moreItems
    }


    $.ajax({
        method: 'GET',
        url: 'find-history-items',
        data: dataContent,
        dataType: 'json',
        success: function(data) {
            $.each(data, function(i, obj) {
                var item = data[i];
                incrementHistoryItem(item);

            });

            updateCurrentItemsSize();
            updateStatusButtonSeeMoreItems();
        }
    });

}

function updateCurrentItemsSize() {
    var currentItems = $(".collection li").length;
    $(".items-size-label #current-items-size").text(currentItems);
}

function incrementTotalItemsSize() {
    var totalItems = $(".items-size-label #total-items").text();
    totalItems = parseInt(totalItems);
    totalItems += 1;
    $(".items-size-label #total-items").text(totalItems);
}

function decrementTotalItemsSize() {
    var totalItems = $(".items-size-label #total-items").text();
    totalItems = parseInt(totalItems);
    totalItems -= 1;
    $(".items-size-label #total-items").text(totalItems);
}

// add a existent history item to bottom
function incrementHistoryItem(item) {
    var itemTag = createItemListTag(item);
    $("#history-items").append(itemTag);
}

// Add a new history item to top
function addHistoryItemList(item) {
    var itemTag = createItemListTag(item);
    $("#history-items").prepend(itemTag);
    updateCurrentItemsSize();
    incrementTotalItemsSize()
}

function removeHistoryItemList(pk) {
    var itemTag = $("#history-items li input[name='item-pk'][value='" + pk + "']").parent();
    itemTag.remove();
}

function updateHistoryItemList(item) {
    updateItemListTag(item);
}

function updateItemListTag(item) {
    var pk = item["pk"];
    var itemTag = $("#history-items li input[name='item-pk'][value='" + pk + "']").parent();

    $(itemTag).find(".title").text(item['title']);
    $(itemTag).find(".description").text(item['description']);
    $(itemTag).find(".keywords").text(item['keywords']);
}

function createItemListTag(item) {
    var divHeader = $("<div>").addClass("row").append(
        $("<div>").addClass("col s10").append(
            $("<p>").addClass("title").text(item["title"])
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
            linkDefault.clone().attr("href", "#").addClass("btn-delete")
        ).append(
            linkDefault.clone().attr("href", urlEdit + item['pk']).addClass("btn-edit")
        )
    );

    divFooter.find(".btn-delete i").text("delete");
    divFooter.find(".btn-edit i").text("mode_edit");

    var itemPK = $("<input>").attr("type", "hidden").attr("value", item["pk"]).attr("name", "item-pk").addClass("item-pk");


    var itemList =  $("<li>").addClass("collection-item").append(itemPK).append(divHeader).append(divContent).append(divFooter);
    updateButtonItemEditAction(itemList);
    updateButtonItemRemoveAction(itemList);

    return itemList;
}
