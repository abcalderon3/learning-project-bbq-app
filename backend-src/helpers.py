from google.cloud import firestore
import arrow
from uuid import uuid4
from initializers import initial_items

# returns a lowercase object, no beginning or trailing whitespaces
# all spaces replaced with dashes
# used for matching
def clean_name(name):
    lowercase_name = name.strip().lower()

    # replaces whitespaces with dashes
    clean_name = "-".join(lowercase_name.split(" "))

    return clean_name

def to_display_name(name):
    split_name = name.split("-")

    name_list = map(lambda x: x.capitalize(), split_name)
    display_name = ' '.join(name_list)
    return display_name

def _now():
    time_zone = 'US/Eastern'
    local_time = arrow.utcnow().to(time_zone)
    formatted_time = local_time.format('YYYY-MM-DD HH:mm:ss')
    return formatted_time

def _get_ref_id(collection, key, value):
    item_ref = collection

    query = item_ref.where(key, '==', value)
    query_stream = query.stream()

    query_results = list()

    item_ref_id = None

    # takes the last one; does not validate if there is more than one item
    for doc_snapshot in query_stream:
        item_ref_id = doc_snapshot.id

    return item_ref_id

def _query_exists(collection, search_term, value):
    query = collection.where(search_term, '==', value)
    query_stream = query.stream()
    query_results = list()
    query_exists = False

    for doc_snapshot in query_stream:
        query_item_name = doc_snapshot.get(search_term)
        query_results.append(query_item_name)

    if len(query_results) > 0:
        query_exists = True

    return query_exists

def create_inventory_day(inv_collection, item_ref_collection, date):
    timestamp = _now()
    new_doc = inv_collection.document(date)
    new_doc.set({u'timestamp': timestamp})

    # define 'items' collection
    inv_items_collection = new_doc.collection('items')

    initial_item_list = initial_items()

    for item in initial_item_list:
        # Create item_ref
        item_id = create_item_ref(
            collection=item_ref_collection,
            item_name=item.get('item_name'),
            special=item.get('special')
        )

        print(item_id)

        # insert item_id into inventory_items_collection
        item_doc_ref = inv_items_collection.document(item_id)

        # set item quantity
        item_doc_ref.set({
            'start_item_quantity': item.get('start_item_quantity'),
            'item_quantity_change': item.get('item_quantity_change'),
        })

    return new_doc

def create_item_ref(collection, item_name, special=False):
    # Remove whitespace and capital letters
    cleaned_item_name = clean_name(item_name)
    item_id = cleaned_item_name + '-' + uuid4().hex
    display_name = to_display_name(cleaned_item_name)

    # Check if item ref already exists, if so, then
    query_exists = _query_exists(
        collection=collection,
        search_term='item_name',
        value=cleaned_item_name
    )

    if query_exists:
        return _get_ref_id(collection, 'item_name', cleaned_item_name)

    payload = {
        'item_name': cleaned_item_name,
        'display_name': display_name,
        'special': special
    }

    document_reference = collection.document(item_id)
    document_reference.set(payload)

    return document_reference.id

def get_item_snapshot(item_name, item_ref_collection, inventory_day, error_message):
    cleaned_item_name = clean_name(item_name)
    item_ref_id = _get_ref_id(
        collection=item_ref_collection,
        key='item_name',
        value=cleaned_item_name,
    )

    if not item_ref_id:
        return error_message, 501

    document_reference = inventory_day.collection('items').document(item_ref_id)

    return document_reference

def create_new_order_helper(order_date, party_size, items, ref):
    order_id = 'order-' + uuid4().hex
    order_doc = ref.document(order_id)
    
    order_counter_doc_ref = ref.document('order_counter_by_day')
    try:
        current_order_counter = order_counter_doc_ref.get([f'`{order_date}`']).get(f'`{order_date}`')
    except KeyError:
        current_order_counter = 0
        order_counter_doc_ref.update({order_date: current_order_counter})

    order_number = current_order_counter + 1

    order_doc.set({
        'date': order_date,
        'party_size': party_size,
        'timestamp': firestore.SERVER_TIMESTAMP,
        'order_number': order_number,
    })

    item_collection = order_doc.collection('items')

    for item in items:
        item_id = item.get('item_id')
        item_quantity_order = item.get('item_quantity_order')

        item_doc = item_collection.document(item_id)

        item_doc.set({
            'item_quantity_order': item_quantity_order
        })

    if not order_doc.id:
        return {'error': 'could not create new order'}

    order_counter_doc_ref.update({ order_date: firestore.Increment(1) })

    return {'order_id': order_doc.id}
