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
import json
import os
import re
from urllib import unquote

import requests
from flask import Blueprint, current_app, jsonify, request

from ..permissions import lhcb_permission

lhcb_bp = Blueprint(
    'cap_lhcb',
    __name__,
    url_prefix='/lhcb',
)


@lhcb_bp.route('/analysis', methods=['GET'])
@lhcb_permission.require(403)
def lhcb_get_analysis():
    """Retrieve lhcb analysis."""
    query = unquote(request.args.get('query', ''))
    location = current_app.config.get('LHCB_DB_FILES_LOCATION', '')

    with codecs.open(os.path.join(location, 'ana_titles.json'),
                     'r', encoding='utf8', errors='ignore') as fp:
        titles = json.load(fp)

    results = [x for x in titles if query.lower() in x.lower()]

    return jsonify(results[:10])


@lhcb_bp.route('/analysis/details', methods=['GET'])
@lhcb_permission.require(403)
def lhcb_get_analysis_data():
    """Retrieve lhcb analysis data."""
    title = unquote(request.args.get('title', ''))
    location = current_app.config.get('LHCB_DB_FILES_LOCATION', '')

    with codecs.open(os.path.join(location, 'ana_details.json'),
                     'r', encoding='utf8', errors='ignore') as fp:
        ana = json.load(fp)
        res = ana.get(title, {})

    return jsonify(res)


@lhcb_bp.route('/analysis/collisiondata/', methods=['GET'])
@lhcb_permission.require(403)
def lhcb_get_collision_data():
    """Retrieve lhcb analysis collision data."""
    stripping_line = request.args.get('stripping_line', '')
    params = parse_stripping_line(unquote(stripping_line))
    url = current_app.config.get('LHCB_GETCOLLISIONDATA_URL', '')
    res = {}

    if params:
        processing_pass = '{0}-{1}'.format(params.get('reco', ''),
                                           params.get('stripping', ''))
        year = '20{}'.format(params.get('year', ''))
        rec_soft, rec_version = get_soft_info(url + params.get('reco', ''))
        strip_soft, strip_version = get_soft_info(url + processing_pass)

        res = {
            'year': year,
            'processing_pass': processing_pass,
            'reconstruction': {
                'software': rec_soft,
                'version': rec_version,
            },
            'stripping': {
                'software': strip_soft,
                'version': strip_version,
            }
        }

    return jsonify(res)


@lhcb_bp.route('/analysis/platforms', methods=['GET'])
@lhcb_permission.require(403)
def lhcb_get_platforms():
    """Retrieve lhcb analysis platforms."""
    app = request.args.get('application', '').replace(' ', '-')
    url = current_app.config.get('LHCB_GETPLATFORM_URL', '') + app

    try:
        platforms = requests.get(url).json()
    except ValueError:
        platforms = []

    res = {
        'platforms': platforms,
    }

    return jsonify(res)


def get_soft_info(url):
    """Retrieve lhcb analysis soft info."""
    soft = version = ''

    response = requests.get(url).json()

    if response:
        soft, version = response[0].split(' ')

    return soft, version


def parse_stripping_line(stripping_line):
    """Parse stripping line."""
    regex = r'Collision(?P<year>\d{2})' + \
        r'.*(?P<reco>Reco[^/]*)' + \
        r'.*(?P<stripping>Stripping[^/]*)'

    res = re.search(regex, stripping_line)

    return res.groupdict() if res else None
