import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Header from "grommet/components/Header";
import Image from "grommet/components/Image";
import Button from "grommet/components/Button";
import ReactTooltip from "react-tooltip";

class BadgeHeaderPreviewItem extends React.Component {
  buttonClicked() {
    this.props.action();
  }

  render() {
    return (
      <Button onClick={() => this.buttonClicked()}>
        <Image
          style={{
            height: 42,
            width: 42,
            "object-fit": "contain",
            margin: "1px"
          }}
          src={this.props.imageURL}
          data-tip={this.props.tooltipText}
        />
        <ReactTooltip />
      </Button>
    );
  }
}

export default BadgeHeaderPreviewItem;

BadgeHeaderPreviewItem.propTypes = {
  imageURL: PropTypes.string,
  tooltipText: PropTypes.string
};
