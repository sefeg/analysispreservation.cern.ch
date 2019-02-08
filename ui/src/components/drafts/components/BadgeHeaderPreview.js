import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Header from "grommet/components/Header";

import BadgeHeaderPreviewItem from "./BadgeHeaderPreviewItem";

export default function BadgeHeaderPreview(props) {
  return (
    <Box
      direction="row"
      wrap={true}
      style={{ display: "unset", "text-align": "right" }}
      pad={{ horizontal: "small" }}
    >
      <BadgeHeaderPreviewItem
        imageURL="https://i.ibb.co/b3tVxG6/popular.png"
        tooltipText="This work is POPULAR in your collaboration. Popularity is based on the number of researchers viewing an analysis."
      />
      <BadgeHeaderPreviewItem
        imageURL="https://i.ibb.co/pzt1dm9/innovative.png"
        tooltipText="Your colleagues consider this work to be INNOVATIVE. The award is based on the number of researchers using the corresponding feedback mechanism in the bottom-left corner of this screen."
      />
      <BadgeHeaderPreviewItem
        imageURL="https://i.ibb.co/ZffHgyF/Reusable.png"
        tooltipText="This work is particularly REUSABLE: Every analysis that's re-execution on ReAna can directly be initiated on CERN Analysis Preservation receives this award."
      />
      <BadgeHeaderPreviewItem
        imageURL="https://i.ibb.co/rwdhwRx/Fundamental.png"
        tooltipText="This work is FUNDAMENTAL: Analyses published on CERN Analysis Preservation can be cloned. That way, existing work provides a foundation for future research. Often cloned work receives this award."
      />
      <BadgeHeaderPreviewItem
        imageURL="https://i.ibb.co/HYxfm1R/Training.png"
        tooltipText="Your colleagues consider this work to be EDUCATIONAL. The award is based on the number of researchers using the corresponding feedback mechanism in the bottom-left corner of this screen."
      />
    </Box>
  );
}

BadgeHeaderPreview.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.element,
  status: PropTypes.element,
  action: PropTypes.element
};
