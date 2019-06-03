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
    var disabledBadgePreText = "--Only you can see this disabled badge-- ";

    var popularTooltipText =
      "This work is POPULAR in your collaboration. Popularity is based on the number of researchers viewing an analysis.";
    var innovativeTooltipText =
      "Your colleagues consider this work to be INNOVATIVE. The award is based on the number of researchers using the corresponding feedback mechanism in the bottom-left corner of this screen.";
    var fundamentalTooltipText =
      "This work is FUNDAMENTAL: Analyses published on CERN Analysis Preservation can be cloned. That way, existing work provides a foundation for future research. Often cloned work receives this award.";
    var educationalTooltipText =
      "Your colleagues consider this work to be EDUCATIONAL. The award is based on the number of researchers using the corresponding feedback mechanism in the bottom-left corner of this screen.";
    var reusableTooltipText =
      "REUSABLE: Indicates that this analysis can be re-executed on ReAna.";

    var disabledPopularTooltipText =
      "Promotes work that is POPULAR in your collaboration. Popularity is based on the number of researchers viewing an analysis.";
    var disabledInnovativeTooltipText =
      "INNOVATIVE: The award is based on the number of researchers using the corresponding feedback mechanism in the bottom-left corner of this screen.";
    var disabledFundamentalTooltipText =
      "FUNDAMENTAL: Analyses published on CERN Analysis Preservation can be cloned. That way, existing work provides a foundation for future research. Often cloned work receives this award.";
    var disabledEducationalTooltipText =
      "Awarded to EDUCATIONAL work. The award is based on the number of researchers using the corresponding feedback mechanism in the bottom-left corner of this screen.";
    var disabledReusableTooltipText =
      "Once this analysis can be re-executed on ReAna, you will get the REUSABLE badge.";

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
            disableButton={!this.props.popular}
            imageURL="https://i.ibb.co/b3tVxG6/popular.png"
            tooltipText={
              this.props.popular
                ? popularTooltipText
                : disabledBadgePreText + disabledPopularTooltipText
            }
          />
          <BadgeHeaderPreviewItem
            action={this.handler}
            disableButton={!this.props.innovative}
            imageURL="https://i.ibb.co/pzt1dm9/innovative.png"
            tooltipText={
              this.props.innovative
                ? innovativeTooltipText
                : disabledBadgePreText + disabledInnovativeTooltipText
            }
          />
          <BadgeHeaderPreviewItem
            action={this.handler}
            disableButton={!this.props.fundamental}
            imageURL="https://i.ibb.co/rwdhwRx/Fundamental.png"
            tooltipText={
              this.props.fundamental
                ? fundamentalTooltipText
                : disabledBadgePreText + disabledFundamentalTooltipText
            }
          />
          <BadgeHeaderPreviewItem
            action={this.handler}
            disableButton={!this.props.educational}
            imageURL="https://i.ibb.co/HYxfm1R/Training.png"
            tooltipText={
              this.props.educational
                ? educationalTooltipText
                : disabledBadgePreText + disabledEducationalTooltipText
            }
          />
          {/*https://i.ibb.co/frzfG4g/reusable-disabled.png*/}

          <BadgeHeaderPreviewItem
            action={this.handler}
            disableButton={!this.props.reusable}
            imageURL="https://i.ibb.co/ZffHgyF/Reusable.png"
            tooltipText={
              this.props.reusable
                ? reusableTooltipText
                : disabledBadgePreText + disabledReusableTooltipText
            }
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
                margin={{ horizontal: "xsmall" }}
                onClick={() => {}}
              >
                <PrintIcon size="small" margin="small" />
              </Box>
              <Box
                pad={{ horizontal: "none" }}
                margin={{ horizontal: "small" }}
                onClick={() => this.closeButtonClicked()}
              >
                <CloseIcon size="small" />
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
                <h3 style={{ "margin-bottom": "10px" }}>{this.props.title}</h3>

                <h4 style={{ "margin-bottom": "3px" }}>10.270/cap.cms.3414</h4>

                {this.props.hasAbstract && (
                  <h4 style={{ "margin-bottom": "20px" }}>
                    {this.props.abstract}
                  </h4>
                )}

                {this.props.hasKeywords && (
                  <h4 style={{ "margin-bottom": "20px" }}>
                    Keywords: {this.props.keywords}
                  </h4>
                )}

                {this.props.hasAuthors &&
                  this.props.authors.map((author, index) => {
                    <h5 style={{ "margin-bottom": "3px" }}>
                      {author.name} ({author.orcid})
                    </h5>;
                  })}
              </Box>
              <Box style={{ display: "grid" }}>
                <BadgeHeader
                  displayPopular={this.props.popular}
                  displayReusable={this.props.reusable}
                  displayInnovative={this.props.innovative}
                  displayFundamental={this.props.fundamental}
                  displayEducational={this.props.educational}
                />
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
  action: PropTypes.element,
  popular: PropTypes.bool,
  educational: PropTypes.bool,
  innovative: PropTypes.bool,
  reusable: PropTypes.bool,
  popular: PropTypes.bool,
  fundamental: PropTypes.bool,
  title: PropTypes.string,
  hasAbstract: PropTypes.bool,
  hasKeywords: PropTypes.bool,
  keywords: PropTypes.string,
  abstract: PropTypes.string,
  hasAuthors: PropTypes.bool,
  authors: PropTypes.object
};
