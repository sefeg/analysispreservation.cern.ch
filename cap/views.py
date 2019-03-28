# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file
# for more details.

"""Blueprint used for loading templates.

The sole purpose of this blueprint is to ensure that Invenio can find the
templates and static files located in the folders of the same names next to
this file.
"""

from __future__ import absolute_import, print_function

from os.path import join

from flask import Blueprint, jsonify

from sqlalchemy.exc import OperationalError

from invenio_search import current_search
from invenio_files_rest.models import Location

from cap.modules.access.utils import login_required
from cap.modules.deposit.search import CAPDepositSearch
from cap.modules.records.search import CAPRecordSearch


blueprint = Blueprint(
    'cap',
    __name__,
)


@blueprint.route('/ping', methods=['GET'])
def ping():
    """Load balancer ping view."""
    return 'Pong'


@blueprint.route('/ping/db', methods=['GET'])
def ping_db():
    """Load balancer ping view."""
    try:
        default_location = Location.get_default()
        return 'OK'
    except OperationalError:
        return 'ERROR'


@blueprint.route('/ping/search', methods=['GET'])
def ping_es():
    """Load balancer ping view."""
    try:
        current_search.cluster_version
        return "OK"
    except ConnectionError:
        return "ERROR"


@blueprint.route('/ping/files', methods=['GET'])
def ping_files():
    """Load balancer ping view."""
    try:
        default_location = Location.get_default().uri
        test_file_path = join(default_location, 'test.txt')
        f = open(test_file_path, 'r')
        return "OK"
    except (OperationalError, IOError) as e:
        return "ERROR"


@blueprint.route('/dashboard')
@login_required
def dashboard():
    """Dashboard view."""
    def serialize_records(records): return [{
        'metadata': x['_source'],
        'id': x['_source']['control_number']
    } for x in records]

    def serialize_deposits(deposits): return [{
        'metadata': x['_source'],
        'id': x['_source']['_deposit']['id']
    } for x in deposits]

    rs = CAPRecordSearch().sort_by_latest()
    ds = CAPDepositSearch().sort_by_latest()

    published_by_collab = rs.execute().hits.hits
    user_published = rs.get_user_records().execute().hits.hits
    user_published_count = rs.get_user_records().count()
    user_drafts = ds.get_user_deposits().execute().hits.hits
    user_drafts_count = ds.get_user_deposits().count()
    shared_with_user = ds.get_shared_with_user().execute().hits.hits

    user_drafts_achievements = ds.get_popular_deposits().execute().hits.hits
    user_drafts_educational = ds.get_educational_deposits().execute().hits.hits
    user_drafts_innovative = ds.get_innovative_deposits().execute().hits.hits
    user_drafts_reusable = ds.get_reusable_deposits().execute().hits.hits
    user_drafts_fundamental = ds.get_fundamental_deposits().execute().hits.hits

    return jsonify({
        'published_by_collab': serialize_records(published_by_collab[:4]),
        'user_published': serialize_records(user_published[:4]),
        'user_drafts': serialize_deposits(user_drafts[:4]),
        'shared_with_user': serialize_deposits(shared_with_user[:4]),
        'user_drafts_count': user_drafts_count,
        'user_published_count': user_published_count,
        'user_count': user_drafts_count + user_published_count,
        'user_drafts_achievements': serialize_deposits(user_drafts_achievements[:4]),
        'user_drafts_educational': serialize_deposits(user_drafts_educational[:4]),
        'user_drafts_innovative': serialize_deposits(user_drafts_innovative[:4]),
        'user_drafts_reusable': serialize_deposits(user_drafts_reusable[:4]),
        'user_drafts_fundamental': serialize_deposits(user_drafts_fundamental[:4])

    })
