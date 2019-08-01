import arrow
import json
from flask import Flask, request, jsonify
from google.cloud import firestore

from helpers import (
    clean_name,
    to_display_name,
    _get_ref_id,
    create_item_ref,
    get_item_snapshot
)

app = Flask(__name__)

db = firestore.Client()

inv_ref = db.collection(u'daily_inventories')
item_ref = db.collection(u'item_ref')
order_ref = db.collection(u'orders')

# ++++++++++++++++ ITEM REF +++++++++++++++++++++++++++++++++++++++++++++++

@app.route('/item_ref', methods=['POST'])
def new_item_ref():
    req = request.json
    item_name = req.get('item_name')
    is_special = bool(req.get('special'))

    # Check if item name exists
    if not item_name:
        # if the json doesn't contain an 'item_name' return none
        return None

    item_ref_id = create_item_ref(item_ref, item_name, is_special)

    return "Item Ref Added"

@app.route('/item_ref')
def get_item_ref():
    doc_list = dict()
    docs = item_ref.stream()

    for doc in docs:
        doc_list[doc.id] = doc.to_dict()

    return jsonify(doc_list)

@app.route('/item_ref/<item_name>')
def get_item(item_name):
    doc_id = _get_ref_id(
        collection=item_ref,
        key='item_name',
        value=item_name,
    )

    if not doc_id:
        return jsonify(None)

    doc_ref = item_ref.document(doc_id)
    doc_dict = doc_ref.get().to_dict()

    return jsonify(doc_dict)

@app.route('/item_ref/<item_name>', methods =['PUT'])
def update_item_ref(item_name):
    req = request.json
    keys = req.keys()

    doc_id = _get_ref_id(
        collection=item_ref,
        key='item_name',
        value=item_name,
    )

    doc_ref = item_ref.document(doc_id)

    for key in keys:
        doc_ref.update({
            key: req.get(key)
        })

    return jsonify(doc_ref.get().to_dict())

@app.route('/item_ref/<item_name>', methods =['DELETE'])
def delete_item_ref(item_name):
    doc_id = _get_ref_id(
        collection=item_ref,
        key='item_name',
        value=item_name,
    )

    if not doc_id:
        return jsonify(None)

    item_ref.document(doc_id).delete()

    return jsonify(None), 201

# +++++++++++++++++++++++ Inventory Day ++++++++++++++++++++++++++++++++++

'''
@app.route('/create_day', methods=['POST'])
def new_inventory_day():
    req = request.json
    date = req.get('date')

    #doc_ref = create_inventory_day(inv_ref, date)
    # check for inventory day, if exist return doc_ref, else create new

    doc_ref = inv_ref.document(date)

    return date, 201
'''

@app.route('/add_item', methods=['POST'])
def add_item():
    req = request.json
    date = req.get('date')
    item_name = req.get('item_name')
    item_quantity = req.get('item_quantity')
    inventory_day = inv_ref.document(date)

    new_item = get_item_snapshot(
        item_name=item_name,
        item_ref_collection=item_ref,
        inventory_day = inventory_day,
        error_message = "Create Item Reference"
    )

    new_item.set({
        'item_quantity': item_quantity,
    })

    return "Item Added", 201

@app.route('/<date>', methods=['PUT'])
def update_item(date):
    req = request.json
    item_name = req.get('item_name')
    item_quantity = req.get('item_quantity')
    inventory_day = inv_ref.document(date)

    document_reference = get_item_snapshot(
        item_name=item_name,
        item_ref_collection=item_ref,
        inventory_day = inventory_day,
        error_message = "Item does not exist"
    )

    document_reference.update({
        'item_quantity': item_quantity,
    })

    return "Item Updated", 201

@app.route('/<date>')
def get_all_items(date):
    inventory_day = inv_ref.document(date)
    coll = inventory_day.collection('items')
    doc_ref = coll.stream()
    output_dict = {}

    # combines item ref with the inventory quantity
    for item in doc_ref:
        item_dict = item.to_dict()
        item_id = item.id
        doc_snapshot = item_ref.document(item_id).get()

        item_name = doc_snapshot.get('item_name')
        display_name = doc_snapshot.get('display_name')

        item_dict['item_name'] = item_name
        item_dict['display_name'] = display_name
        output_dict[item_id] = item_dict

    return json.dumps(output_dict, indent=2), 201

@app.route('/<date>/<item_name>')
def get_single_item(date, item_name):
    '''
    Get JSON of single item
    '''

    output_dict = {}

    inventory_day = inv_ref.document(date)
    document_reference = get_item_snapshot(
        item_name=item_name,
        item_ref_collection=item_ref,
        inventory_day = inventory_day,
        error_message = "Item does not exist"
    )

    item_id = document_reference.id
    doc_snapshot = item_ref.document(item_id).get()
    item_name = doc_snapshot.get('item_name')
    display_name = doc_snapshot.get('display_name')

    item_dict = document_reference.get().to_dict()
    item_dict['item_name'] = item_name
    item_dict['display_name'] = display_name
    output_dict[item_id] = item_dict

    return json.dumps(output_dict, indent=2)

@app.route('/<date>/<item_name>', methods=['DELETE'])
def delete_item(date, item_name):
    inventory_day = inv_ref.document(date)

    document_reference = get_item_snapshot(
        item_name=item_name,
        item_ref_collection=item_ref,
        inventory_day = inventory_day,
        error_message = "Item does not exist"
    )

    document_reference.delete()

    return "Item Deleted", 201

@app.route('/<date>', methods=['DELETE'])
def delete_inventory_day(date):

    #First, delete all documents in subcollection items
    items_documents = inv_ref.document(date).collection('items').get()

    for document in items_documents:
        item_doc_reference = document.reference
        print("Deleting {}".format(item_doc_reference))
        item_doc_reference.delete()

    # Second, delete all documents in date
    inv_ref.document(date).delete()

    return "Inventory Day Deleted", 201

#Discuss error handling
@app.route('/')
def index():
    return "Index"
