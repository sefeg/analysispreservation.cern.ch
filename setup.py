# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file
# for more details.

import os

from setuptools import find_packages, setup

readme = open('README.rst').read()

DATABASE = "postgresql"
ELASTICSEARCH = "elasticsearch5"
INVENIO_VERSION = "3.0.0rc2"

tests_require = [
    'check-manifest>=0.35',
    'coverage>=4.4.1',
    'isort>=4.3',
    'mock>=2.0.0',
    'pydocstyle>=2.0.0',
    'pytest-cov>=2.5.1',
    'pytest-invenio>=1.0.2,<1.1.0',
    'pytest-mock>=1.6.0',
    'pytest-pep8>=1.0.6',
    'pytest-random-order>=0.5.4',
    'pytest>=3.3.1',
    'selenium>=3.4.3',
]

extras_require = {
    'docs': [
        'Sphinx>=1.5.1',
    ],
    'tests': tests_require,
}

extras_require['all'] = []
for reqs in extras_require.values():
    extras_require['all'].extend(reqs)

setup_requires = [
    'Babel>=2.4.0',
    'pytest-runner>=3.0.0,<5',
]

install_requires = [
    # 'Flask-BabelEx>=0.9.3',
    'Flask-Debugtoolbar>=0.10.1',
    'celery==4.1.1',  # temporary fix
    # 'invenio~={version}'.format(version=INVENIO_VERSION),
    # 'elasticsearch>=5.1.0,<6.0.0',
    # 'elasticsearch-dsl>=5.1.0,<6.0.0',
    # 'docker==3.0.0',
    # 'celery>=4.0',  # temporary fix
    # 'gunicorn>=19.6.0',
    # 'setuptools>=30.1.0',  # temporary fix
    # 'marshmallow==2.15.0',   # temporary fix
    # 'simplejson>=3.8.2',
    'python-ldap>=2.4.39',
    'PyGithub>=1.35',
    'python-gitlab>=1.0.2',
    'Flask==0.12.4',
    # 'Shelves>=0.3.8',
    # 'Flask-CORS>=2.1.0',
    # 'Flask-BabelEx>=0.9.3',
    # 'Flask-Assets>=0.12',
    'Flask-Cli>=0.4.0',
    # 'Flask-Collect==1.2.2',
    'Flask-Cache>=0.13.1',
    # 'Flask-KVSession>=0.6.2',
    # 'Flask-Login==0.3.2',
    # 'Flask-WTF>=0.14.2',
    # 'invenio-access>=1.0.0',
    # 'invenio-accounts>=1.0.0',
    'invenio-accounts-rest>=1.0.0a4',
    # # 'invenio-assets>=1.0.0',
    # 'invenio-base>=1.0.0',
    # 'invenio-celery>=1.0.0',
    # 'invenio-config>=1.0.0',
    # 'invenio-db[postgresql,versioning]>=1.0.0',
    # 'invenio-files-rest>=1.0.0a22',
    # 'invenio-indexer>=1.0.0',
    # 'invenio-jsonschemas>=1.0.0',
    'invenio-oauthclient>=1.0.0',
    # 'invenio-pidstore>=1.0.0',
    # 'invenio-records[postgresql]>=1.0.0',
    # 'invenio-records-files>=1.0.0a10',
    # 'invenio-records-rest>=1.0.0',
    # 'invenio-rest[cors]>=1.0.0',
    # 'invenio-search>=1.0.0a9',
    'urllib3[secure]==1.22',
    'SQLAlchemy-Continuum==1.3.4',
    'invenio-userprofiles>=1.0.0',
    'invenio-query-parser>=0.3.0',
    'invenio[{db},{es},base,auth,metadata]~={version}'.format(
        db=DATABASE, es=ELASTICSEARCH, version=INVENIO_VERSION),
    'uWSGI==2.0.17',
    'uwsgi-tools==1.1.1',
    'uwsgitop==0.10',
]

packages = find_packages()


# Get the version string. Cannot be done with import!
g = {}
with open(os.path.join('cap', 'version.py'), 'rt') as fp:
    exec(fp.read(), g)
    version = g['__version__']

setup(
    name='cap',
    version=version,
    description=__doc__,
    long_description=readme,
    keywords='cap cern analysis preservation',
    license='MIT',
    author='CERN',
    author_email='analysis-preservation-support@cern.ch',
    url='https://github.com/cernanalysispreservation/analysispreservation.cern.ch',
    packages=packages,
    zip_safe=False,
    include_package_data=True,
    platforms='any',
    entry_points={
        'console_scripts': [
            'cap = cap.cli:cli',
        ],
        'invenio_base.api_apps': [
            'cap_access = cap.modules.access.ext:CAPAccess',
            'cap_cache = cap.modules.cache.ext:CAPCache',
            'cap_deposit = cap.modules.deposit.ext:CAPDeposit',
            'cap_fixtures = cap.modules.fixtures.ext:CAPFixtures',
            'cap_xrootd = cap.modules.xrootd.ext:CapXRootD',
        ],
        'invenio_base.api_blueprints': [
            'cap = cap.views:blueprint',
            'cap_user = cap.modules.user.views:user_blueprint',
            'cap_oauth2server_settings = '
            ' cap.modules.oauth2server.views.settings:blueprint',
            'cap_oauth2server_server = '
            ' cap.modules.oauth2server.views.server:blueprint',
            'cap_atlas = cap.modules.experiments.views.atlas:atlas_bp',
            'cap_lhcb = cap.modules.experiments.views.lhcb:lhcb_bp',
            'cap_cms = cap.modules.experiments.views.cms:cms_bp',
            'cap_reana = cap.modules.reana.views:reana_bp',
            'invenio_oauthclient = invenio_oauthclient.views.client:blueprint',
        ],
        'invenio_celery.tasks': [
            'cap_deposit = cap.modules.deposit.loaders',
        ],
        'invenio_pidstore.minters': [
            'cap_record_minter = '
            'cap.modules.records.minters:cap_record_minter',
        ],
        'invenio_pidstore.fetchers': [
            'cap_record_fetcher = '
            'cap.modules.records.fetchers:cap_record_fetcher',
        ],
        'invenio_records.jsonresolver': [
            'cap = cap.modules.records.resolvers.cap',
            'local = cap.modules.records.resolvers.local',
        ],
        'invenio_search.mappings': [
            'deposits = cap.mappings',
            'records = cap.mappings',
        ],
        'invenio_jsonschemas.schemas': [
            'cap_schemas = cap.jsonschemas',
        ],
        'invenio_db.models': [
            'cap_reana_model = cap.modules.reana.models',
        ],
        'invenio_config.module': [
            'cap = cap.config',
        ],
        # 'invenio_i18n.translations': [
        #     'messages = cap',
        # ]
    },
    extras_require=extras_require,
    install_requires=install_requires,
    setup_requires=setup_requires,
    tests_require=tests_require,
    classifiers=[
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.5',
        'Development Status :: 3 - Alpha',
    ],
)
