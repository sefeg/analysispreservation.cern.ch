import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Header from "grommet/components/Header";
import Image from "grommet/components/Image";
import Button from "grommet/components/Button";

class BadgeVoteItem extends React.Component {
  constructor(props) {
    super(props);

    this.colorIndexString = "#F2F2F2";

    this.state = {
      selected: false
    };
  }

  buttonClicked() {
    if (this.state.selected) {
      this.colorIndexString = "#F2F2F2";
      this.setState({ selected: false });
    } else {
      this.colorIndexString = "#92D050";
      this.setState({ selected: true });

      //if(this.props.badgeTitle == "Educational"){
      //_achievements.voters_id_educational add currentUserId
      //}else if (this.props.badgeTitle == "Innovative") {

      //}
    }
  }

  render() {
    return (
      <Button
        onClick={() => this.buttonClicked()}
        style={{ "margin-left": "5px", "margin-right": "5px" }}
      >
        <Box
          direction="column"
          pad={{ horizontal: "small", vertical: "small" }}
          style={{
            "border-color": "#44546A",
            "background-color": this.colorIndexString,
            "border-width": "1px",
            "border-style": "solid"
          }}
          align="center"
        >
          <Image style={{ width: 45 }} src={this.props.imageURL} />
          <Label
            pad={{ horizontal: "xsmall" }}
            style={{
              margin: "0px",
              "font-size": "0.8em",
              color: "#666",
              "font-weight": "bold"
            }}
          >
            {this.props.badgeTitle}
          </Label>
        </Box>
      </Button>
    );
  }
}

BadgeVoteItem.propTypes = {
  imageURL: PropTypes.string,
  tooltipText: PropTypes.string,
  badgeTitle: PropTypes.string,
  selected: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    currentUserId: state.auth.getIn(["currentUser", "userId"])
  };
}

export default connect(mapStateToProps)(BadgeVoteItem);
