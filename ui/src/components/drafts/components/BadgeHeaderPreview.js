import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Header from "grommet/components/Header";
import Button from "grommet/components/Button";

import BadgeHeaderPreviewItem from "./BadgeHeaderPreviewItem";
import BadgeHeader from "./BadgeHeader";

import CloseIcon from "grommet/components/icons/base/Close";
import PrintIcon from "grommet/components/icons/base/Print";

class BadgeHeaderPreview extends React.Component {
  constructor(props) {
    super(props);

    this.handler = this.handler.bind(this);

    this.state = {
      displayExtendedView: false
    };
  }

  handler() {
    this.setState({
      displayExtendedView: true
    });
  }

  closeButtonClicked() {
    this.setState({
      displayExtendedView: false
    });
  }

  render() {
    return (
      <Box direction="column">
        <Box
          direction="row"
          wrap={true}
          style={{ display: "unset", "text-align": "right" }}
          pad={{ horizontal: "small" }}
        >
          <BadgeHeaderPreviewItem
            action={this.handler}
            imageURL="https://i.ibb.co/b3tVxG6/popular.png"
            tooltipText="This work is POPULAR in your collaboration. Popularity is based on the number of researchers viewing an analysis."
          />
          <BadgeHeaderPreviewItem
            action={this.handler}
            imageURL="https://i.ibb.co/pzt1dm9/innovative.png"
            tooltipText="Your colleagues consider this work to be INNOVATIVE. The award is based on the number of researchers using the corresponding feedback mechanism in the bottom-left corner of this screen."
          />
          {/*<BadgeHeaderPreviewItem
            action={this.handler}
            imageURL="https://i.ibb.co/ZffHgyF/Reusable.png"
            tooltipText="This work is particularly REUSABLE: Every analysis that's re-execution on ReAna can directly be initiated on CERN Analysis Preservation receives this award."
          />*/}
          <BadgeHeaderPreviewItem
            action={this.handler}
            imageURL="https://i.ibb.co/rwdhwRx/Fundamental.png"
            tooltipText="This work is FUNDAMENTAL: Analyses published on CERN Analysis Preservation can be cloned. That way, existing work provides a foundation for future research. Often cloned work receives this award."
          />
          <BadgeHeaderPreviewItem
            action={this.handler}
            imageURL="https://i.ibb.co/HYxfm1R/Training.png"
            tooltipText="Your colleagues consider this work to be EDUCATIONAL. The award is based on the number of researchers using the corresponding feedback mechanism in the bottom-left corner of this screen."
          />
        </Box>

        {this.state.displayExtendedView && (
          <Box direction="column">
            <Box
              direction="row"
              margin={{ horizontal: "medium", vertical: "small" }}
              style={{ "align-self": "center" }}
            >
              <Box
                pad={{ horizontal: "none" }}
                margin={{ horizontal: "small" }}
                onClick={() => this.closeButtonClicked()}
              >
                <CloseIcon size="small" />
              </Box>
              <Box
                pad={{ horizontal: "none" }}
                margin={{ horizontal: "xsmall" }}
                onClick={() => this.closeButtonClicked()}
              >
                <PrintIcon size="small" margin="small" />
              </Box>
            </Box>

            <Box
              direction="row"
              margin={{ horizontal: "medium", bottom: "medium" }}
              style={{
                "border-style": "solid",
                "border-width": "2px",
                "border-radius": "10px"
              }}
            >
              <Box
                direction="column"
                style={{ padding: "10px", "min-width": "50%" }}
              >
                <h3 style={{ "margin-bottom": "10px" }}>
                  Title of this work. Probably a bit longer.
                </h3>

                <h4 style={{ "margin-bottom": "3px" }}>More suitable ID</h4>
                <h4 style={{ "margin-bottom": "20px" }}>
                  Keywords: key1; key2; key3.
                </h4>

                <h5 style={{ "margin-bottom": "3px" }}>
                  Author Name1, Affiliation
                </h5>
                <h5 style={{ "margin-bottom": "3px" }}>
                  Author Name2, Affiliation
                </h5>
                <h5 style={{ "margin-bottom": "3px" }}>
                  Author Name3, Affiliation
                </h5>
              </Box>
              <Box style={{ display: "grid" }}>
                <BadgeHeader />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    );
  }
}

export default BadgeHeaderPreview;

BadgeHeaderPreview.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.element,
  status: PropTypes.element,
  action: PropTypes.element
};
