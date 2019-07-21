from google.cloud import firestore

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

def _get_item_ref_id(collection, key, value):
    item_ref = collection

    query = item_ref.where(key, '==', value)
    query_stream = query.stream()

    query_results = list()

    item_ref_id = None

    # takes the last one; does not validate if there is more than one item
    for doc_snapshot in query_stream:
        item_ref_id = doc_snapshot.id

    return item_ref_id
