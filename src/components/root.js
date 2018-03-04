// FIXME: eslint triggering react element rendering as UNUSED
// var error

import React from 'react';
import FormUser from '../containers/form-user';
import PageWelcome from './page-welcome';
// eslint-disable-next-line no-unused-vars
import Navbar from './navbar';
// eslint-disable-next-line no-unused-vars
import { Route, Switch, Redirect } from 'react-router-dom';
import $ from 'jQuery';
// eslint-disable-next-line no-unused-vars
import Loader from 'react-loader';
// eslint-disable-next-line no-unused-vars
import UserProfile from './user-profile';
// eslint-disable-next-line no-unused-vars
import Users from './users';
import { connect } from 'react-redux';
import actionsLoader from '../actions/loader';
import actionsUsers from '../actions/users';
import { withRouter } from 'react-router-dom';
import PageTemplates from './pages/templates';
// eslint-disable-next-line no-unused-vars
import ErrorBoundary from './error-boundary';
// eslint-disable-next-line no-unused-vars
import PageTemplateNew from './pages/template-new';
// eslint-disable-next-line no-unused-vars
import PageTemplateShow from './pages/template-show';

function SwitchLoggedIn() {
  return (
    <Switch>
      <Route exact path="/" component={PageWelcome} />
      <Route
        exact
        path="/users"
        render={() => {
          return <Users location={location} />;
        }}
      />
      <Route
        exact
        path="/profile"
        render={() => {
          return <UserProfile location={location} />;
        }}
      />
      <Route exact path="/templates" component={PageTemplates} />
      <Route
        exact
        path="/templates/new"
        render={() => {
          return <PageTemplateNew location={location} />;
        }}
      />
      <Route
        exact
        path="/templates/:id"
        render={() => {
          return <PageTemplateShow location={location} />;
        }}
      />
    </Switch>
  );
}

function SwitchLoggedOut() {
  return (
    <Switch>
      <Route exact path="/" component={PageWelcome} />
      <Route exact path="/register" component={FormUser} />
      <Route exact path="/login" component={FormUser} />
    </Switch>
  );
}

export class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { startLoading, endLoading, history, location } = this.props;
    endLoading();
    $(document)
      .bind('ajaxSend', () => {
        startLoading();
      })
      .bind('ajaxComplete', () => {
        endLoading();
      });

    // When app is refreshed, we need to check whether user is already authenticated
    this.props.checkAuthenticationRequest();

    window.reactRouterHistory = history;
    window.reactLocation = location;
  }

  render() {
    const { location, loggedIn } = this.props;
    const Routes = loggedIn ? <SwitchLoggedIn /> : <SwitchLoggedOut />;

    return (
      <div className="container">
        <Navbar location={location} />
        <Loader loaded={this.props.loaded}>
          <ErrorBoundary>
            <div className="row justify-content-center">{Routes}</div>
          </ErrorBoundary>
        </Loader>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return Object.assign(state.loader, state.root, state.storeUsers);
};

const mapDispatchToProps = dispatch => {
  return {
    startLoading: () => {
      dispatch(actionsLoader.startLoading());
    },
    endLoading: () => {
      dispatch(actionsLoader.endLoading());
    },
    fetchUsersRequest: () => {
      dispatch(actionsUsers.fetchUsersRequest());
    },
    checkAuthenticationRequest: () => {
      dispatch(actionsUsers.checkAuthenticationRequest());
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Root));
