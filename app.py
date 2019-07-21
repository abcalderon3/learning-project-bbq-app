import arrow
import json
from flask import Flask, request, jsonify
from google.cloud import firestore
from uuid import uuid4

from helpers import (
    clean_name,
    to_display_name,
    _get_item_ref_id,
)

app = Flask(__name__)

db = firestore.Client()

inv_ref = db.collection(u'daily_inventories')
item_ref = db.collection(u'item_ref')
order_ref = db.collection(u'orders')

# ++++++++++++++++ ITEM REF +++++++++++++++++++++++++++++++++++++++++++++++

@app.route('/item_ref', methods=['POST'])
def create_item_ref():

    req = request.json
    item_name = req.get('item_name')

    # Check if item name exists
    if not item_name:
        # if the json doesn't contain an 'item_name' return none
        return None

    # Remove whitespace and capital letters
    clean_item = clean_name(item_name)
    item_id = clean_item + '-' + uuid4().hex

    query = item_ref.where('item_name', '==', clean_item)
    query_stream = query.stream()

    query_results = list()

    for doc_snapshot in query_stream:
        query_item_name = doc_snapshot.get('item_name')
        query_results.append(query_item_name)

    if not query_results:
        # if item_name doesn't exist, create reference in db, return req with payload
        payload = {
            'item_id': item_id,
            'item_name': clean_item,
            'display_name': to_display_name(clean_item)
        }

        doc_ref = item_ref.document()
        doc_ref.set(payload)

        item_out = doc_ref.get().to_dict()

    elif len(query_results) == 1:
        # If item exists, lookup entry, return req with id
        item_out = query_results[0]
    else:
        raise ValueError('item_id count should be 0 or 1, but it is {}'.format(
            len(query_results)
        ))

    return jsonify(item_out)

@app.route('/item_ref')
def get_item_ref():
    doc_list = dict()
    docs = item_ref.stream()

    for doc in docs:
        doc_list[doc.id] = doc.to_dict()

    return jsonify(doc_list)

@app.route('/item_ref/<item_name>')
def get_item(item_name):
    doc_id = _get_item_ref_id(
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

    doc_id = _get_item_ref_id(
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
    doc_id = _get_item_ref_id(
        collection=item_ref,
        key='item_name',
        value=item_name,
    )

    if not doc_id:
        return jsonify(None)

    item_ref.document(doc_id).delete()

    return jsonify(None), 201

# +++++++++++++++++++++++ Inventory Day ++++++++++++++++++++++++++++++++++
# Add items to inventory day / Associate item_ref to inventory day by item_id
# Update inventory day
# Delete inventory day

@app.route('/create_day', methods=['POST'])
def create_inventory_day():
    req = request.json
    date = req.get('date')

    # YYYY-MM-DD validation
    # returns true if pass otherwise raise error?
    # use try except?

    doc_ref = inv_ref.document(date)
    items = doc_ref.collection('items')

    return date, 201

@app.route('/add_item', methods=['POST'])
def add_item():
    req = request.json
    date = req.get('date')
    item_name = req.get('item_name')
    item_quantity = req.get('item_quantity')

    clean_item = clean_name(item_name)
    doc_id = _get_item_ref_id(
        collection=item_ref,
        key='item_name',
        value=clean_item,
    )

    if not doc_id:
        pass
        # create item if doc_id doesn't exist

    return "Item Added", 201

# Discuss how to route and pass data
@app.route('/')
def index():
    return "Index"
