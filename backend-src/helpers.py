from google.cloud import firestore
import arrow
from uuid import uuid4

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

def create_item_ref(collection, item_name, special=False):
    # Remove whitespace and capital letters
    cleaned_item_name = clean_name(item_name)
    item_id = cleaned_item_name + '-' + uuid4().hex
    display_name = to_display_name(cleaned_item_name)

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
    item_ref_id = document_reference.set(payload)

    return item_ref_id

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
