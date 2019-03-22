import React from "react";
import PropTypes from "prop-types";

import _omit from "lodash/omit";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Sidebar from "grommet/components/Sidebar";

import { getPublishedItem } from "../../actions/published";
import FilesPublished from "./components/FilesPublished";

import JSONSchemaPreviewer from "../drafts/form/JSONSchemaPreviewer";
import SectionHeader from "../drafts/components/SectionHeader";
import { EditAnchor } from "../drafts/components/DraftActionsButtons";
import AnnounceIcon from "grommet/components/icons/base/Announce";

import RunsIndex from "../published/RunsIndex";
import { Route } from "react-router-dom";

const transformSchema = schema => {
  const schemaFieldsToRemove = [
    "_access",
    "_deposit",
    "_cap_status",
    "_buckets",
    "_files",
    "$ana_type",
    "$schema",
    "general_title",
    "_achievements",
    "_experiment",
    "control_number"
  ];

  schema.properties = _omit(schema.properties, schemaFieldsToRemove);
  schema = {
    type: schema.type,
    properties: schema.properties,
    dependencies: schema.dependencies
  };
  return schema;
};

class PublishedPreview extends React.Component {
  _discoverSchema = item => {
    let type;
    return item.$ana_type
      ? item.$ana_type
      : ((type = item.$schema.split("/")),
        type[type.length - 1].replace("-v0.0.1.json", ""));
  };

  render() {
    let item = this.props.item ? this.props.item.metadata : null;
    let _schema = this.props.schema ? transformSchema(this.props.schema) : null;
    let files = item ? item._files : null;
    let draft_id = item ? item._deposit.id : null;

    return (
      <Box flex={true}>
        <Box direction="row" flex={true} wrap={false}>
          <Sidebar full={false} size="medium" colorIndex="light-2">
            <SectionHeader label="Files | Data | Source Code" />
            <Box flex={true}>
              <FilesPublished files={files} />
            </Box>
          </Sidebar>
          {_schema && this.props.uiSchema ? (
            <Box flex={true}>
              <SectionHeader
                label="Published"
                status={<AnnounceIcon size="xsmall" />}
                uppercase={true}
                action={<EditAnchor draft_id={draft_id} />}
              />
              <Box flex={true} direction="row" justify="between">
                <Box flex={false} pad="medium">
                  <JSONSchemaPreviewer
                    formData={item || {}}
                    schema={_schema}
                    uiSchema={this.props.uiSchema || {}}
                    onChange={() => {}}
                  >
                    <span />
                  </JSONSchemaPreviewer>
                </Box>
                <Route
                  exact
                  path={`/published/:id/runs/`}
                  component={RunsIndex}
                />
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    );
  }
}

PublishedPreview.propTypes = {
  match: PropTypes.object,
  draft_id: PropTypes.string,
  schemas: PropTypes.object,
  schemaId: PropTypes.string,
  formData: PropTypes.object,
  schemasLoading: PropTypes.bool,
  getPublishedItem: PropTypes.func,
  item: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

function mapStateToProps(state) {
  return {
    item: state.published.getIn(["current_item", "data"]),
    schema: state.published.getIn(["current_item", "schema"]),
    uiSchema: state.published.getIn(["current_item", "uiSchema"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPublishedItem: id => dispatch(getPublishedItem(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishedPreview);
