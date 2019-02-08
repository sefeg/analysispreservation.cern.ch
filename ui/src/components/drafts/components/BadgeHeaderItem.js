import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Header from "grommet/components/Header";
import Image from "grommet/components/Image";

export default function BadgeHeaderItem(props) {
  return (
    <Box
      direction="row"
      flex={false}
      wrap={false}
      pad={{ horizontal: "small" }}
    >
      <Image
        style={{ width: 85, height: 110, "object-fit": "contain" }}
        src={props.imageURL}
        margin="medium"
        data-tip={props.tooltipText}
      />
    </Box>
  );
}

BadgeHeaderItem.propTypes = {
  imageURL: PropTypes.string,
  tooltipText: PropTypes.string
};
