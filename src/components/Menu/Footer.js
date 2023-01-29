import React from "react";
import FooterInfo from "./FooterInfo";
import FooterLinks from "./FooterLinks";
import SubscribeForm from "./SubscribeForm";
import { connect } from "react-redux";
import { IS_PROD, IS_CANARY, BUILD_VERSION } from "../../config/config";
import CommunitySocials from "./CommunitySocials";
/**
 * Footer section has place for links,
 */
class Footer extends React.Component {
  getMoreInfo() {
    const { community } = this.props;
    var moreInfo = community && community.more_info;
    try {
      if (moreInfo) moreInfo = JSON.parse(moreInfo);
    } catch (error) {
      console.log("Error getting more info");
    } finally {
      return moreInfo || { wants_socials: false };
    }
  }
  render() {
    const moreInfo = this.getMoreInfo();

    let BUILD_VERSION_TEXT = "MassEnergize Community Portal v" + BUILD_VERSION;
    if (IS_PROD) {      //prod main
      
    } else if (IS_CANARY) {
      //prod main
      BUILD_VERSION_TEXT = BUILD_VERSION_TEXT + " (Canary)";
    } else {
      // dev sandbox
      BUILD_VERSION_TEXT = BUILD_VERSION_TEXT + " (Development)";
    }

    return (
      <div className="d-flex flex-column">
        <footer className="main-footer m-footer-color">
          {/* <!--Widgets Section--> */}
          <div className="widgets-section">
            {/* <div className="container"> */}
            <div className="temp-f-container">
              {/* <!--Big Column--> */}
              <div className="big-column">
                <div className="row clearfix temp-mob-footer-fix">
                  {/* <!--Footer Column--> */}
                  <FooterInfo
                    info={this.props.footerInfo ? this.props.footerInfo : {}}
                  />
                  {/* <!--Footer Column--> */}
                  <FooterLinks
                    title="Quick Links"
                    links={this.props.footerLinks}
                  />
                  {/* <!--Footer Column--> */}
                  <div className="col-12 col-md-4 footer-column-mod">
                    {moreInfo.wants_socials === "true" ? (
                      <CommunitySocials
                        community={this.props.community}
                        moreInfo={moreInfo}
                      />
                    ) : (
                      <SubscribeForm />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
        <section className="footer-bottom m-footer-color">
          {/* <div className="container"> */}
          <div className="temp-f-donate-area">
            <div className="pull-left copy-text">
              <p className="cool-font" style={{ color: "#999" }}>
                <a
                  target="_blank"
                  href="https://massenergize.org"
                  rel="noopener noreferrer"
                >
                  Copyright © 2022
                </a>{" "}
                All Rights Reserved. Powered by{" "}
                <a
                  target="_blank"
                  href="https://massenergize.org"
                  rel="noopener noreferrer"
                >
                  MassEnergize
                </a>
              </p>
            </div>
             
            <div className="pull-right get-text temp-dn-fix" >
              <p className="cool-font" style={{ color: "#999" }}>
              {BUILD_VERSION_TEXT}
              </p>
            </div>
             
          </div>
        </section>
      </div>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    community: store.page.community,
    donatePageData: store.page.donatePage,
    links: store.links,
  };
};
export default connect(mapStoreToProps)(Footer);
