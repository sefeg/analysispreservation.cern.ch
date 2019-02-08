import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Header from "grommet/components/Header";
import Image from "grommet/components/Image";
import Button from "grommet/components/Button";

import BadgeVoteItem from "./BadgeVoteItem";

class BadgeVoteContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box
        direction="column"
        align="center"
        colorIndex="grey-4"
        style={{
          width: "336px",
          display: "grid",
          "text-align": "center",
          "border-top-style": "solid",
          "border-top": "darkGray"
        }}
      >
        <span
          style={{
            "margin-bottom": "5px",
            "font-size": "1.2em",
            color: "#666",
            "padding-top": "5px"
          }}
        >
          <span style={{ "font-weight": "bold" }}>This work stands out? </span>
          Please tell us how. It is..
        </span>

        <Box
          direction="row"
          style={{ display: "unset", "margin-bottom": "10px" }}
        >
          <BadgeVoteItem
            imageURL="https://i.ibb.co/7nybRk8/training-symbol.png"
            badgeTitle="Educational"
          />
          <BadgeVoteItem
            imageURL="https://i.ibb.co/W6KMp2b/innovative-shadow.png"
            badgeTitle="Innovative"
          />
        </Box>
      </Box>
    );
  }
}

export default BadgeVoteContainer;

BadgeVoteContainer.propTypes = {
  imageURL: PropTypes.string,
  tooltipText: PropTypes.string,
  badgeTitle: PropTypes.string,
  selected: PropTypes.bool
};
