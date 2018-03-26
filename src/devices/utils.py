
def serialize_history_item(item):
    date_string = None
    if item.date:
        date_string = item.date.strftime("%d/%m/%Y")

    content = {
        'pk': item.pk,
        'title': item.title,
        'date': date_string,
        'description': item.description,
        'keywords': item.keywords
    }

    return content


