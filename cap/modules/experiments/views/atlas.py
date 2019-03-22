# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
#
# CERN Analysis Preservation Framework is free software; you can redistribute
# it and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that it will
# be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation Framework; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.

"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

import codecs
import os
import json

import requests
from flask import Blueprint, jsonify, request, current_app

from ..permissions import atlas_permission

atlas_bp = Blueprint(
    'cap_atlas',
    __name__,
    url_prefix='/atlas',
)


@atlas_bp.route('/yadage/workflow_submit', methods=['POST'])
@atlas_permission.require(403)
def yadage_workflow_submit():
    """Submit a yadage workflow."""
    resp = request.get_json()

    at = resp.get('at', None)
    data = resp.get('data', {})
    headers = {
        "Authorization": "Bearer " + at,
        "Content-Type": "application/json"
    }

    r = requests.post(
        'https://yadage.cern.ch/workflow_submit',
        data=json.dumps(data),
        headers=headers,
        verify=False)

    if r.status_code == 200:
        return jsonify(r.json()), 200
    else:
        return jsonify({
            "error_msg": "An error occured in the request to Yadage Engine",
            "error": r.text
        }), 409


@atlas_bp.route('/glance/<id>', methods=['GET'])
@atlas_permission.require(403)
def get_glance_by_id(id):
    """Retrieves GLANCE analysis data."""
    glance_examples_location = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        '../static/example_atlas/glance_examples.json')
    location = current_app.config.get(
        'ATLAS_GLANCE_FILES_LOCATION',
        glance_examples_location)

    with codecs.open(location, 'r', encoding='utf8', errors='ignore') as fp:
        data = json.load(fp)

        for i in data:
            if i.get("id") == id:
                return jsonify(i)

    return jsonify({})
