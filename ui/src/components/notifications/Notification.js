import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Box from "grommet/components/Box";
import Image from "grommet/components/Image";
import Heading from "grommet/components/Heading";
import Anchor from "grommet/components/Anchor";

const styles = {
  show_green: {
    opacity: "0.93",
    backgroundColor: "rgb(82,159,79)",
    transition: "opacity 2s ease-in",
    position: "absolute",
    "border-radius": "3px",
    right: "60px",
    top: "40px",
    "box-shadow": "0px 0px 4px 4px #3cc"
  },

  show_blue: {
    opacity: "0.93",
    backgroundColor: "rgb(49,131,188)",
    transition: "opacity 2s ease-in",
    position: "absolute",
    "border-radius": "3px",
    right: "60px",
    top: "40px",
    "box-shadow": "0px 0px 4px 4px #3cc"
  },

  hide: {
    opacity: "0",
    backgroundColor: "rgb(82,159,79)",
    transition: "opacity 1s ease-in",
    position: "absolute",
    "border-radius": "3px",
    right: "60px",
    top: "40px",
    "box-shadow": "0px 0px 4px 4px #3cc"
  }
};

class Notification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }

  componentDidMount() {
    setTimeout(
      function() {
        this.setState({ show: true });
      }.bind(this),
      2000
    );
  }

  render() {
    var style_visibility = styles.hide;

    if (this.state.show == true) {
      if (this.props.showSuccess) {
        style_visibility = styles.show_green;
      } else {
        style_visibility = styles.show_blue;
      }
    }

    return (
      <Box style={style_visibility} direction={"row"} pad={"small"}>
        <Box justify={"center"}>
          <Image style={{ width: 70 }} src={this.props.imageURL} />
        </Box>

        <Box
          pad={{ horizontal: "small" }}
          direction={"column"}
          style={{ color: "white", "max-width": "220px" }}
        >
          <h4 style={{ margin: "0px" }}>{this.props.messageTitle}</h4>
          <Box>{this.props.message}</Box>
        </Box>

        <Box direction={"column"}>
          <Box
            style={{
              "box-sizing": "border-box",
              height: "50%",
              display: "inline-block"
            }}
          >
            <Box>
              <Anchor
                style={{ color: "white", "font-size": "12pt" }}
                onClick={() => {
                  this.setState({ show: false });
                }}
                label="Close"
              />
            </Box>
          </Box>
          {this.props.displayActionButton ? (
            <Box
              style={{
                "box-sizing": "border-box",
                height: "50%",
                display: "inline-block"
              }}
            >
              <Anchor
                style={{ color: "white", "font-size": "12pt" }}
                path={this.props.actionPath}
                label={this.props.actionLabel}
              />
            </Box>
          ) : null}
        </Box>
      </Box>
    );
  }
}

Notification.propTypes = {
  messageTitle: PropTypes.string,
  message: PropTypes.string,
  imageURL: PropTypes.string,
  displayAction: PropTypes.bool,
  actionPath: PropTypes.string,
  actionLabel: PropTypes.string,
  showSuccess: PropTypes.bool
};

export default Notification;
