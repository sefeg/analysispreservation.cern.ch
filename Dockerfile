# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

FROM gitlab-registry.cern.ch/invenio/base:python2-xrootd

RUN xrootd -v

RUN yum install -y \
    epel-release \
    openldap-devel \
    gpgme-devel \
    libassuan-devel \
    btrfs-progs-devel \
    device-mapper-devel \
    ostree-devel \
    go-md2man

ENV GO_VERSION=1.9.1 \
    GOROOT=/goroot \
    GOPATH=/gopath

ENV PATH $PATH:$GOROOT/bin:$GOPATH/bin

RUN yum install -y -q curl build-essential ca-certificates git mercurial bzr


RUN mkdir /goroot && curl https://storage.googleapis.com/golang/go${GO_VERSION}.linux-amd64.tar.gz | tar xvzf - -C /goroot --strip-components=1 && \
    mkdir /gopath

# Clean after ourselves:
RUN yum clean -y all

RUN git clone https://github.com/projectatomic/skopeo $GOPATH/src/github.com/projectatomic/skopeo

RUN cd $GOPATH/src/github.com/projectatomic/skopeo && make binary-local && make docs && make install

# Install Invenio
ENV WORKING_DIR=/opt/cap
ENV INVENIO_INSTANCE_PATH=${WORKING_DIR}/var/instance

# Debug off by default
ARG DEBUG=False
ENV DEBUG=${DEBUG}

# copy everything inside /src
RUN mkdir -p ${WORKING_DIR}/src
COPY ./ ${WORKING_DIR}/src
WORKDIR ${WORKING_DIR}/src

ADD setup.py setup.py
ADD cap/version.py cap/version.py

RUN python -m site
RUN python -m site --user-site

# Install/create static files
RUN mkdir -p ${INVENIO_INSTANCE_PATH}

RUN pip install --upgrade setuptools wheel pip uwsgi uwsgitop uwsgi-tools

# RUN if [ "$DEBUG" = "True" ]; then pip install -r requirements-devel.txt; fi;
RUN pip install -r requirements-local-forks.txt
RUN pip install -r requirements.txt
RUN pip install -e .[all]

# copy uwsgi config files
COPY ./docker/uwsgi/ ${INVENIO_INSTANCE_PATH}

ARG APP_GITHUB_OAUTH_ACCESS_TOKEN
ENV APP_GITHUB_OAUTH_ACCESS_TOKEN=${APP_GITHUB_OAUTH_ACCESS_TOKEN}
ARG APP_GITLAB_OAUTH_ACCESS_TOKEN
ENV APP_GITLAB_OAUTH_ACCESS_TOKEN=${APP_GITLAB_OAUTH_ACCESS_TOKEN}

# Set folder permissions
RUN chgrp -R 0 ${WORKING_DIR} && \
    chmod -R g=u ${WORKING_DIR}

RUN useradd invenio --uid 1000 --gid 0 && \
    chown -R invenio:root ${WORKING_DIR}
USER 1000
