import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Header from "grommet/components/Header";

import BadgeHeaderItem from "./BadgeHeaderItem";

export default function BadgeHeader(props) {
  return (
    <Box
      direction="row"
      style={{ "align-self": "center" }}
      pad={{ horizontal: "small", vertical: "small" }}
    >
      <BadgeHeaderItem
        imageURL="https://i.ibb.co/F8xDnSX/popular-with-title.png"
        tooltipText="This badge indicates that ..."
      />
      <BadgeHeaderItem
        imageURL="https://i.ibb.co/0m5nT4C/innovative-with-title.png"
        tooltipText="This badge indicates that ..."
      />
      <BadgeHeaderItem
        imageURL="https://i.ibb.co/Q9nxyV9/fundamental-with-title.png"
        tooltipText="This badge indicates that ..."
      />
      <BadgeHeaderItem
        imageURL="https://i.ibb.co/dP34SZM/educational-with-title.png"
        tooltipText="This badge indicates that ..."
      />
      {/*<BadgeHeaderItem
        imageURL="https://i.ibb.co/xY1cdm6/reusable-with-title.png"
        tooltipText="This badge indicates that ..."
      />*/}
    </Box>
  );
}

BadgeHeader.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.element,
  status: PropTypes.element,
  action: PropTypes.element
};
