
def serialize_history_item(item):
    content = {
        'title': item.title,
        'date': item.date.strftime("%d/%m/%Y"),
        'description': item.description,
        'keywords': item.keywords
    }

    return content


