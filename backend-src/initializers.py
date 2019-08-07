
# returns a list of dicts with initial items
def initial_items():
    item_list = [
        'Beef Brisket',
        'Pork Ribs',
        'Pulled Pork',
        'Turkey',
        'Sausage',
    ]

    output_list = []

    for item in item_list:
        item_dict = {
            'item_name': item,
            'start_item_quantity': 0,
            'item_quantity_change': 0, 
            'special': False,
        }

        output_list.append(item_dict)

    return output_list
