import { connect } from 'react-redux';
import FormUser from '../components/form-user';
import actionUsers from '../actions/users';

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, state, ownProps);
};

const mapDispatchToProps = dispatch => {
  return {
    createUser: data => {
      dispatch(actionUsers.createUserRequest(data));
    },
    loginUser: data => {
      dispatch(actionUsers.loginUserRequest(data));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormUser);
