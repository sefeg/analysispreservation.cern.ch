import React from "react";
import Box from "grommet/components/Box";
import Footer from "grommet/components/Footer";
import Paragraph from "grommet/components/Paragraph";
import Menu from "grommet/components/Menu";
import Anchor from "grommet/components/Anchor";

class GrommetFooter extends React.Component {
  render() {
    return (
      <Footer justify="center" colorIndex="neutral-1">
        <Box
          direction="row"
          align="center"
          justify="center"
          pad={{ between: "medium" }}
        >
          <Paragraph margin="none" style={{ color: "hsla(0,0%,100%,.85)" }}>
            Copyright 2018 © CERN. Created & Hosted by CERN. Powered by Invenio
            Software.
          </Paragraph>
          <Menu direction="row" size="small" dropAlign={{ right: "right" }}>
            <Anchor
              label="Contact"
              href="mailto:analysis-preservation-support@cern.ch"
              style={{ color: "hsla(0,0%,100%,.85)" }}
            />
            <Anchor
              label="About"
              path="/about"
              style={{ color: "hsla(0,0%,100%,.85)" }}
            />
            <Anchor
              label="Search Tips"
              path="/search-tips"
              style={{ color: "hsla(0,0%,100%,.85)" }}
            />
          </Menu>
        </Box>
      </Footer>
    );
  }
}

export default GrommetFooter;
