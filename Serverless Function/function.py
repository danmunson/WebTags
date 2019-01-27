from flask import json

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use the application default credentials
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': '', #add project ID to interact with FireStore
})

db = firestore.client()

def TagHandler(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/0.12/api/#flask.Flask.make_response>`.
    """
    form = request.form
    resp = None
    
    if form['reqType'] == 'newTag':
        print('newTag')
        
        db.collection(u'Testing').document(u'TestRequest'+form['linkDesc']).set(form)
        resp = json.jsonify(greeting = 'storageSuccess',
                            data = form['params'])
    
    elif form['reqType'] == 'pullTagsForUrl':
        print('pullTagsForUrl')
        
        data = []
        collection_ref = db.collection(u'Testing')
        matches = collection_ref.where(u'sourceUrl', u'==', form['sourceUrl'])
        docs = matches.get()
        for tag in docs:
        	data.append(tag.to_dict())
        resp = json.jsonify(greeting = 'tagsDelivered',
                            data = data)
    
    return resp
