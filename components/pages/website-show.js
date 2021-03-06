import React from 'react';
import { connect } from 'react-redux';
import actionsWebsites from '../../actions/websites';
// eslint-disable-next-line no-unused-vars
import FormWebsite from '../form-website';
import Website from '../../backbone/models/website';
import _ from 'underscore';
import appConfig from '../../app-config';

// eslint-disable-next-line no-unused-vars
function Event({ event }) {
  return <div>{event}</div>;
}

export class PageWebsiteShow extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const { fetchWebsiteRequest, fetchWebsiteEventsRequest } = this.props;
    let { website } = this.props;
    const { location } = appConfig.reactRouterHistory;
    const websiteId = location.pathname.split('/')[2];

    return fetchWebsiteRequest(websiteId).then(() => {
      if (!website.get('events')) {
        return fetchWebsiteEventsRequest(website);
      }
    });
  }

  render() {
    const {
      website,
      loader: { loaded }
    } = this.props;
    const events = website.get('events');
    const error = website.get('error');
    let domList;

    if (error) {
      domList = error;
    } else if (loaded && _.isEmpty(events)) {
      domList = <h3 className="mt-5">No events found.</h3>;
    } else {
      domList = (
        <div className="row justify-content-center mt-3">
          <ul className="col-sm-10 col-md-9 col-lg-8 col-xl-7 mx-5">
            {events &&
              events.map((event, idx) => {
                return (
                  <li className="event-item" key={idx}>
                    <Event event={event} />
                  </li>
                );
              })}
          </ul>
        </div>
      );
    }

    return (
      <div className="page-website">
        <section>
          <h1>{website.get('name')}</h1>
          <FormWebsite website={website} isNew={!website.id} />
        </section>
        <hr />
        <section className="text-center">
          <h1>Events</h1>
          <span>Information is gathered each time this page is loaded.</span>
          {domList}
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { websites } = state.storeWebsites;
  const websiteId = appConfig.reactRouterHistory.location.pathname.split('/')[2];
  const website = websites.get(websiteId) || new Website();
  return Object.assign({}, { website, loader: state.loader });
};

const mapDispatchToProps = dispatch => {
  return {
    fetchWebsiteRequest: id => {
      return dispatch(actionsWebsites.fetchWebsiteRequest(id));
    },
    fetchWebsiteEventsRequest: id => {
      dispatch(actionsWebsites.fetchWebsiteEventsRequest(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageWebsiteShow);
