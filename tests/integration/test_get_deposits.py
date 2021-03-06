# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
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
# or submit itself to any jurisdiction.

"""Integration tests for GET deposits."""

import json

from invenio_search import current_search
from pytest import mark

from conftest import add_role_to_user


######################
# api/deposits/  [GET]
######################
def test_get_deposits_when_user_not_logged_in_returns_401(app, users):
    with app.test_client() as client:
        resp = client.get('/deposits/')

        assert resp.status_code == 401


def test_get_deposits_when_superuser_returns_all_deposits(app, users,
                                                          auth_headers_for_superuser,
                                                          create_deposit):
    with app.test_client() as client:
        deposits = [
            create_deposit(users['cms_user'], 'cms-v1.0.0'),
            create_deposit(users['lhcb_user'], 'lhcb-v0.2.0')
        ]

        resp = client.get('/deposits/', headers=auth_headers_for_superuser)
        hits = resp.json['hits']['hits']

        assert resp.status_code == 200
        assert len(hits) == 2


def test_get_deposits_when_owner_returns_his_deposits(app, db, users,
                                                      auth_headers_for_user,
                                                      create_deposit
                                                      ):
    user = users['cms_user']

    with app.test_client() as client:
        user_deposits_ids = [x['_deposit']['id'] for x in [
            create_deposit(user, 'cms-analysis-v0.0.1'),
            create_deposit(user, 'cms-questionnaire-v0.0.1'),
        ]]

        create_deposit(users['lhcb_user'], 'lhcb-v0.0.1'),

        resp = client.get('/deposits/', headers=auth_headers_for_user(user))
        hits = resp.json['hits']['hits']

        assert resp.status_code == 200
        assert len(hits) == 2
        for hit in hits:
            assert hit['metadata']['_deposit']['id'] in user_deposits_ids


def test_get_deposits_doesnt_return_published_ones(app, db, users,
                                                   auth_headers_for_user,
                                                   create_deposit
                                                   ):
    user = users['cms_user']

    with app.test_client() as client:
        published = create_deposit(user, 'cms-analysis-v0.0.1', publish=True)
        deposit = create_deposit(user, 'cms-questionnaire-v0.0.1')

        create_deposit(users['lhcb_user'], 'lhcb-v0.0.1'),

        resp = client.get('/deposits/', headers=auth_headers_for_user(user))
        hits = resp.json['hits']['hits']

        assert resp.status_code == 200
        assert len(hits) == 1
        assert deposit.pid.pid_value in [hit['metadata']['_deposit']['id'] for hit in hits]


@mark.parametrize("action", [
    ("deposit-read"),
    ("deposit-admin")
])
def test_get_deposits_returns_deposits_that_user_has_read_or_admin_access_to(action, app, db, users,
                                                                             auth_headers_for_user,
                                                                             json_headers,
                                                                             create_deposit
                                                                             ):
    user, other_user = users['cms_user'], users['lhcb_user']

    with app.test_client() as client:
        deposit = create_deposit(user, 'cms-v0.0.1')

        # other user cant see the deposit
        resp = client.get('/deposits/', headers=auth_headers_for_user(other_user))
        hits = resp.json['hits']['hits']

        assert len(hits) == 0

        permissions = [{
            'email': other_user.email,
            'type': 'user',
            'op': 'add',
            'action': action
        }]

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=auth_headers_for_user(user) + json_headers,
                           data=json.dumps(permissions))


        # sometimes ES needs refresh
        current_search.flush_and_refresh('deposits')
        
        resp = client.get('/deposits/', headers=auth_headers_for_user(other_user))
        hits = resp.json['hits']['hits']

        assert len(hits) == 1


@mark.parametrize("action", [
    ("deposit-read"),
    ("deposit-admin")
])
def test_get_deposits_returns_deposits_that_users_egroups_have_read_or_admin_access_to(action, app, db, users,
                                                                                       auth_headers_for_user,
                                                                                       json_headers,
                                                                                       create_deposit
                                                                                       ):
    user, other_user = users['cms_user'], users['lhcb_user']
    add_role_to_user(users['lhcb_user'], 'some-egroup@cern.ch')

    with app.test_client() as client:
        deposit = create_deposit(user, 'cms-v0.0.1')

        # other user cant see the deposit
        resp = client.get('/deposits/', headers=auth_headers_for_user(other_user))
        hits = resp.json['hits']['hits']

        assert len(hits) == 0

        permissions = [{
            'email': 'some-egroup@cern.ch',
            'type': 'egroup',
            'op': 'add',
            'action': action
        }]

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=auth_headers_for_user(user) + json_headers,
                           data=json.dumps(permissions))

        # sometimes ES needs refresh
        current_search.flush_and_refresh('deposits')
        
        resp = client.get('/deposits/', headers=auth_headers_for_user(other_user))
        hits = resp.json['hits']['hits']

        assert len(hits) == 1


def test_get_deposits_with_basic_json_serializer_returns_serialized_deposit_properly(app,
                                                                                     users,
                                                                                     jsonschemas_host,
                                                                                     auth_headers_for_user,
                                                                                     create_deposit):
    user = users['cms_user']
    deposit = create_deposit(user, 'cms-analysis-v0.0.1', {
        '$schema': 'https://{}/schemas/deposits/records/cms-analysis-v0.0.1.json'.format(jsonschemas_host),
        'basic_info': {
            'analysis_number': 'dream_team',
            'people_info': [{}]
        }
    })
    metadata = deposit.get_record_metadata()

    with app.test_client() as client:
        resp = client.get('/deposits/',
                          headers=[('Accept', 'application/basic+json')] +
                                  auth_headers_for_user(user))

        hit = resp.json['hits']['hits'][0]

        assert resp.status_code == 200
        assert hit == {
            'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
            'metadata': {
                '$schema': deposit['$schema'],
                'basic_info': {
                    'people_info': [{}],
                    'analysis_number': 'dream_team'
                }
            },
            'pid': deposit['_deposit']['id'],
            'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        }


###########################
# api/deposits/{pid}  [GET]
###########################
def test_get_deposit_when_superuser_returns_deposit_that_he_even_has_no_access_to(app,
                                                                                  users,
                                                                                  auth_headers_for_superuser,
                                                                                  create_deposit):
    deposit = create_deposit(users['alice_user'], 'alice-analysis-v0.0.1')

    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_superuser)

        assert resp.status_code == 200


def test_get_deposit_when_owner_returns_deposit(app,
                                                users,
                                                auth_headers_for_user,
                                                create_deposit):
    user = users['alice_user']
    deposit = create_deposit(user, 'alice-analysis-v0.0.1')

    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(user))

        assert resp.status_code == 200


def test_get_deposit_when_other_member_of_collaboration_returns_403(app,
                                                                    users,
                                                                    auth_headers_for_user,
                                                                    create_deposit):
    user, other_user = users['alice_user'], users['alice_user2'] 
    deposit = create_deposit(user, 'alice-analysis-v0.0.1')

    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 403
        

@mark.parametrize("action", [
    ("deposit-read"),
    ("deposit-admin")
])
def test_get_deposit_when_user_has_read_or_admin_acces_can_see_deposit(action,
                                                                       app,
                                                                       users,
                                                                       auth_headers_for_user,
                                                                       json_headers,
                                                                       create_deposit):
    user, other_user = users['alice_user'], users['alice_user2'] 
    deposit = create_deposit(user, 'alice-analysis-v0.0.1')
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': action
    }] 

    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 403
        
        client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                    headers=auth_headers_for_user(user) + json_headers,
                    data=json.dumps(permissions))

        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 200


@mark.parametrize("action", [
    ("deposit-read"),
    ("deposit-admin")
])
def test_get_deposit_when_user_is_member_of_egroup_with_read_or_admin_acces_can_see_deposit(action,
                                                                                            app,
                                                                                            users,
                                                                                            auth_headers_for_user,
                                                                                            json_headers,
                                                                                            create_deposit):
    user, other_user = users['alice_user'], users['lhcb_user'] 
    add_role_to_user(other_user, 'some-egroup@cern.ch')
    deposit = create_deposit(user, 'alice-analysis-v0.0.1')
    permissions = [{
        'email': 'some-egroup@cern.ch',
        'type': 'egroup',
        'op': 'add',
        'action': action
    }] 

    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 403
        
        client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                    headers=auth_headers_for_user(user) + json_headers,
                    data=json.dumps(permissions))

        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 200


def test_get_deposit_with_basic_json_serializer_returns_serialized_deposit_properly(app,
                                                                                    users,
                                                                                    jsonschemas_host,
                                                                                    auth_headers_for_superuser,
                                                                                    create_deposit):
    deposit = create_deposit(users['superuser'], 'cms-analysis-v0.0.1', {
        '$schema': 'https://{}/schemas/deposits/records/cms-analysis-v0.0.1.json'.format(jsonschemas_host),
        'basic_info': {
            'analysis_number': 'dream_team',
            'people_info': [{}]
        }
    })
    metadata = deposit.get_record_metadata()      

    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=[('Accept', 'application/basic+json')] +
                                  auth_headers_for_superuser)

        assert resp.status_code == 200
        assert resp.json == {
            'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
            'metadata': {
                '$schema': deposit['$schema'],
                'basic_info': {
                    'people_info': [{}],
                    'analysis_number': 'dream_team'
                }
            },
            'pid': deposit['_deposit']['id'],
            'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        }                       


def test_get_deposit_with_permissions_json_serializer_returns_serialized_permissions_properly(app,
                                                                                              auth_headers_for_superuser,
                                                                                              deposit):
    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=[('Accept', 'application/permissions+json')] +
                                  auth_headers_for_superuser)

        assert resp.status_code == 200
        assert resp.json == {
            'permissions': {
                'deposit-admin': {'roles': [], 'users': ['superuser@cern.ch']}, 
                'deposit-read': {'roles': [], 'users': ['superuser@cern.ch']}, 
                'deposit-update': {'roles': [], 'users': ['superuser@cern.ch']}
            }
        }
