import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AnnotatedMeter from "grommet-addons/components/AnnotatedMeter";
import MoreIcon from "grommet/components/icons/base/More";
import ReactTooltip from "react-tooltip";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Header from "grommet/components/Header";
import Tiles from "grommet/components/Tiles";
import Tile from "grommet/components/Tile";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";

import Notification from "../notifications/Notification";
import Image from "grommet/components/Image";

import { withRouter } from "react-router-dom";
import { fetchDashboard } from "../../actions/dashboard";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";

function AchievementTile(props) {
  return (
    <Tile pad="medium" basis="1/4">
      <Box pad="small">
        <Image
          style={{ width: 55 }}
          src={props.image_src}
          margin="large"
          data-tip={props.emptyMessage}
        />
      </Box>

      <Box>
        <Heading
          tag="h5"
          uppercase={true}
          align="center"
          justify="center"
          data-tip={props.emptyMessage}
        >
          {props.header}
        </Heading>

        <ReactTooltip />
        <List>
          {props.items.map((item, index) => {
            let metadata = item.metadata;
            let id = item.id;
            var text = "";
            var achievement_count = metadata._achievements.popularity;

            {
              props.header == "Educational"
                ? (achievement_count = metadata._achievements.educational)
                : props.header == "Reusable"
                  ? (achievement_count = metadata._achievements.reusable)
                  : props.header == "Innovative"
                    ? (achievement_count = metadata._achievements.innovative)
                    : props.header == "Fundamental"
                      ? (achievement_count = metadata._achievements.fundamental)
                      : "Neithe";
            }

            return (
              <ListItem
                textAlign="center"
                justify="center"
                key={`${item.id}-${index}`}
              >
                <Anchor
                  path={`${props.urlDetailed}/${id}`}
                  style={{
                    "padding-right": "10px",
                    textDecoration: "none",
                    color: "black"
                  }}
                >
                  {metadata.general_title || id}
                </Anchor>

                {props.singleAchievement == "true" ? (
                  <Image style={{ width: 25 }} src={props.image_src} />
                ) : (
                  Array.from(Array(achievement_count)).map(() => (
                    <Image style={{ width: 25 }} src={props.image_src} />
                  ))
                )}
              </ListItem>
            );
          })}
        </List>
        <Box align="center" margin={{ horizontal: "medium" }}>
          <Anchor
            path={props.urlMore || "/search"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <MoreIcon />
          </Anchor>
        </Box>
      </Box>
    </Tile>
  );
}

function DashboardList(props) {
  return (
    <Box>
      <Heading
        tag="h5"
        uppercase={true}
        align="center"
        justify="center"
        data-tip={props.emptyMessage}
      >
        {props.header}
      </Heading>
      <ReactTooltip />
      <List>
        {props.items.length > 0 ? (
          props.items.map((item, index) => {
            let metadata = item.metadata;
            let id = item.id;

            return (
              <ListItem
                textAlign="center"
                justify="center"
                key={`${item.id}-${index}`}
              >
                <Anchor
                  path={`${props.urlDetailed}/${id}`}
                  style={{
                    textDecoration: "none",
                    color: "black"
                  }}
                >
                  {metadata.general_title || id}
                </Anchor>
              </ListItem>
            );
          })
        ) : (
          <Box textAlign="center">
            <ListPlaceholder
              unfilteredTotal={0}
              pad="large"
              emptyMessage={props.emptyMessage || "No analysis."}
            />
          </Box>
        )}
      </List>
      {props.items.length > 0 ? (
        <Box align="center" margin={{ horizontal: "medium" }}>
          <Anchor
            path={props.urlMore || "/search"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <MoreIcon />
          </Anchor>
        </Box>
      ) : null}
    </Box>
  );
}

var notification_counter = 0;
var show_first_notification_popularity = false;
var show_second_notification_completeness = false;

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.fetchDashboard();

    notification_counter = notification_counter + 1;

    show_first_notification_popularity = false;
    show_second_notification_completeness = false;

    if (notification_counter == 2) {
      show_first_notification_popularity = true;
    } else if (notification_counter == 3) {
      show_second_notification_completeness = true;
    }
  }

  componentWillUnmount() {}

  render() {
    return (
      <Box full={true} colorIndex="light-2">
        <Header
          size="small"
          colorIndex="neutral-1-a"
          pad="none"
          wrap={true}
          justify="center"
        />

        <Tiles full={true}>
          <AchievementTile
            image_src="https://i.ibb.co/b3tVxG6/popular.png"
            items={this.props.results.user_drafts_popular}
            singleAchievement="false"
            header="Popular"
            urlDetailed="/drafts"
            urlMore={`/drafts?q=created_by:${
              this.props.currentUserId
            }&achievements=Popular`}
            emptyMessage="Popular analyses in your collaboration. Popularity is based on the number of researchers viewing an analysis."
          />
          <AchievementTile
            image_src="https://i.ibb.co/HYxfm1R/Training.png"
            items={this.props.results.user_drafts_educational}
            singleAchievement="false"
            header="Educational"
            urlDetailed="/drafts"
            urlMore={`/drafts?q=created_by:${
              this.props.currentUserId
            }&achievements=Educational`}
            emptyMessage="Lists work that is particularly EDUCATIONAL. The award is directly based on the feedback by the members of your collaboration."
          />
          <AchievementTile
            image_src="https://i.ibb.co/rwdhwRx/Fundamental.png"
            items={this.props.results.user_drafts_fundamental}
            singleAchievement="true"
            header="Fundamental"
            urlDetailed="/drafts"
            urlMore={`/drafts?q=created_by:${
              this.props.currentUserId
            }&achievements=Fundamental`}
            emptyMessage="Lists work that is FUNDAMENTAL: Analyses published on CERN Analysis Preservation can be cloned. That way, existing work provides a foundation for future research. Often cloned work receives this award."
          />

          <AchievementTile
            image_src="https://i.ibb.co/pzt1dm9/innovative.png"
            items={this.props.results.user_drafts_innovative}
            singleAchievement="false"
            header="Innovative"
            urlDetailed="/drafts"
            urlMore={`/drafts?q=created_by:${
              this.props.currentUserId
            }&achievements=Innovative`}
            emptyMessage="Lists work that is INNOVATIVE. The award is directly based on the feedback by the members of your collaboration."
          />

          <AchievementTile
            image_src="https://i.ibb.co/ZffHgyF/Reusable.png"
            items={this.props.results.user_drafts_reusable}
            singleAchievement="false"
            header="Reusable"
            urlDetailed="/drafts"
            urlMore={`/drafts?q=created_by:${
              this.props.currentUserId
            }&achievements=Reusable`}
            emptyMessage="Lists work that is REUSABLE: Every analysis that's re-execution on ReAna can directly be initiated on CERN Analysis Preservation receives this award."
          />

          <Tile pad="large" basis="1/4">
            <DashboardList
              items={this.props.results.published_by_collab}
              header="published in collaboration"
              urlDetailed="/published"
              urlMore="/search?q="
              emptyMessage="All analyses published on CAP by members of your collaboration."
            />
          </Tile>
          <Tile pad="large" basis="1/4">
            <DashboardList
              items={this.props.results.shared_with_user}
              header="shared with you"
              urlDetailed="/drafts"
              urlMore={`/drafts?q=-created_by:${
                this.props.currentUserId
              }&status=draft`}
              emptyMessage="Draft analyses that your collaborators have given you read/write access to."
            />
          </Tile>
          <Tile pad="large" basis="1/4">
            <DashboardList
              items={this.props.results.published_by_collab}
              header="latest from your group"
              urlDetailed="/published"
              urlMore="/search?q="
              emptyMessage="All analyses published on CAP by members of your working group."
            />
          </Tile>
          <Tile pad="large" basis="1/4">
            <DashboardList
              items={this.props.results.user_drafts}
              header="your drafts"
              urlDetailed="/drafts"
              urlMore={`/drafts?q=created_by:${
                this.props.currentUserId
              }&status=draft`}
              emptyMessage="Your draft analyses. By default, only you can access them, but it is possible to give read/write access to other collaborators."
            />
          </Tile>
          <Tile pad="medium" basis="1/4">
            <AnnotatedMeter
              legend={true}
              type="circle"
              defaultMessage="Your"
              max={this.props.results.user_count}
              series={[
                {
                  label: "Your Drafts",
                  value: this.props.results.user_drafts_count,
                  colorIndex: "graph-1"
                },
                {
                  label: "Published",
                  value: this.props.results.user_published_count,
                  colorIndex: "graph-2"
                }
              ]}
            />
          </Tile>
          <Tile pad="large" basis="1/4">
            <DashboardList
              items={this.props.results.user_published}
              header="published by you"
              urlDetailed="/published"
              urlMore={`/search?q=created_by:${
                this.props.currentUserId
              }&status=published`}
              emptyMessage="Your published analyses. Once published on CAP, all members of your collaboration will have read access."
            />
          </Tile>
        </Tiles>

        {show_first_notification_popularity ? (
          <Notification
            messageTitle="Congratulations!"
            message="Your analysis 'Search for 3-lepton flavor in BSM models' has been awarded the Popularity badge."
            displayActionButton={true}
            imageURL="https://i.ibb.co/b3tVxG6/popular.png"
            actionPath="/drafts/c4e4ebb6d0554d608bfc850b19473e65"
            actionLabel="Show"
            showSuccess={true}
          />
        ) : null}

        {show_second_notification_completeness ? (
          <Notification
            messageTitle="Qualify for new badge"
            message="A new badge will soon be introduced to acknowledge analyses that are thoroughly documented. Two of your analyses are close to qualify."
            displayActionButton={true}
            imageURL="https://i.ibb.co/FHdyDHk/thorough-notification.png"
            actionPath="/newbadge"
            actionLabel="More"
            showSuccess={false}
          />
        ) : null}
      </Box>
    );
  }
}

Dashboard.propTypes = {
  fetchDashboard: PropTypes.func,
  currentUser: PropTypes.object,
  results: PropTypes.object,
  history: PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentUserId: state.auth.getIn(["currentUser", "userId"]),
    results: state.dashboard.getIn(["results"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchDashboard: () => dispatch(fetchDashboard())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
