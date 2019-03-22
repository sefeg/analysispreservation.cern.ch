import React from "react";

import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import Heading from "grommet/components/Heading";
import Header from "../partials/Header";
import GrommetFooter from "../footer/Footer";
import Image from "grommet/components/Image";

class AboutPage extends React.Component {
  render() {
    return [
      <Header />,
      <Box flex={true}>
        <Box align="center">
          <Box align="center" size="xxlarge">
            <Box margin={{ vertical: "medium" }}>
              <Heading tag="h2">Introducing a new badge</Heading>
              <Image
                style={{ width: 110, "align-self": "center" }}
                src={"https://i.ibb.co/FHdyDHk/thorough-notification.png"}
              />
              <Paragraph>
                We are soon introducing a new badge that acknowledges
                completness of preserved analyses. The badge is a result of
                community feedback calling for means to acknowledge work that is
                throughly documented on CERN Analysis Preservation.
              </Paragraph>
              <Paragraph>
                In order to earn the badge, more than 90% of the analysis
                template fields must be filled. Template sections that may have
                multiple items come with a button that enables you to confirm
                that all required items have been provided.
              </Paragraph>

              <Heading tag="h4">How does this affect me?</Heading>
              <Paragraph>
                Two of your analyses are close to fullfil the requirements for
                the new badge. Providing more information, you will be among the
                first to fulfill this achievement.
                <ul>
                  <li>
                    <a href="https://cap-client.readthedocs.io/en/latest/?badge=latest#">
                      Search for 3-lepton flavor in BSM models
                    </a>
                  </li>
                  <li>
                    <a href="https://cap-client.readthedocs.io/en/latest/?badge=latest#">
                      Some other awesome physics title that I do not know much
                      about
                    </a>
                  </li>
                </ul>
              </Paragraph>
            </Box>
          </Box>
        </Box>
      </Box>,
      <GrommetFooter />
    ];
  }
}

AboutPage.propTypes = {};

export default AboutPage;
