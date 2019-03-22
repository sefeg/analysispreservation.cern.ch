import React, { Component } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import JSONDropzone from "./components/JSONDropzone";
import JSONEditorLayer from "./components/JSONEditorLayer";

import CodeIcon from "grommet/components/icons/base/Code";

import _isEmpty from "lodash/isEmpty";

class JSONEditorWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { editorOpen: false };
  }

  setJSON = data => {
    this.props.onChange(data);
  };

  toggleLayer = () => {
    this.setState({ editorOpen: !this.state.editorOpen });
  };

  render() {
    return (
      <Box pad={{ horizontal: "medium" }} margin={{ bottom: "small" }}>
        {_isEmpty(this.props.formData) ||
        JSON.stringify(this.props.formData) === JSON.stringify({}) ? (
          <JSONDropzone
            setJSON={this.setJSON}
            actionButtonOnClick={this.toggleLayer}
          />
        ) : (
          <Box flex={true} size={{ vertical: "small" }}>
            <Box colorIndex="light-2">
              <Box
                colorIndex="grey-3"
                pad="small"
                align="end"
                direction="row"
                justify="end"
                align="center"
              >
                <CodeIcon size="xsmall" onClick={this.toggleLayer} />
              </Box>
              <div
                style={{
                  position: "relative",
                  height: "auto",
                  maxHeight: "200px",
                  overflow: "scroll",
                  textOverflow: "hidden"
                }}
              >
                <pre> {JSON.stringify(this.props.formData, null, 4)} </pre>
              </div>
            </Box>
          </Box>
        )}

        {this.state.editorOpen ? (
          <JSONEditorLayer
            onClose={this.toggleLayer}
            setJSON={this.setJSON}
            value={this.props.formData}
          />
        ) : null}
      </Box>
    );
  }
}

JSONEditorWidget.propTypes = {
  options: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  onBlur: PropTypes.func
};

export default JSONEditorWidget;
