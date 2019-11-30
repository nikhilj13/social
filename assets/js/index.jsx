import React from "react";
import ReactDOM from "react-dom";

import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import { Provider } from "react-redux";
import socket from './socket'

import Login from "./components/login";
import Insta_auth from './components/insta_auth'
import Navbar from './components/navbar'
import SignUp from "./components/signup";
import store from "./store";
import MapComponent from "./components/maps";
import Profile from "./components/profile";
import EditUserProfile from "./components/edit-user-profile";
import RecommendedUsers from "./components/recommended-users";
import Home from "./components/home";
import ShowUserProfile from "./components/show-user-profile";

export default function init_page(root) {
  let tree = (
    <Provider store={store}>
      <Index />
    </Provider>
  );
  ReactDOM.render(tree, root);
}


class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      channel: store.getState().session.email ? socket.channel("user:" + store.getState().session.email) : null
    }
    this.joinChannel = this.joinChannel.bind(this)
    if(this.state.channel) {
      this.state.channel.join().receive("ok", (resp) => console.log(resp))
    }
  }

  /**
   * Component passed to the login component so that when a user is logged in
   * a new channel will be created and they will be joined to that channel. All
   * the notifications and updates now can be sent through this channel.
   */
  joinChannel(email) {
    let userChannel = socket.channel("user:"+email)
    userChannel.join().receive("ok", (resp) => console.log(resp))
    this.setState({channel: userChannel})
  }
  
  render() {
    // Check whether the user is logged into the app or not.
    return (
      <Router>
        <Navbar channel={this.state.channel} joinChannel={this.joinChannel}/>
        <Switch>
          <Route exact path="/" render={(props) => <Login {...props} channel={this.state.channel} joinChannel={this.joinChannel} />} />
          <Route exact path="/login" render={(props) => <Login {...props} channel={this.state.channel} joinChannel={this.joinChannel} />} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/insta_auth" component={Insta_auth} />
          <Route exact path="/map" component={MapComponent} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/edit_profile" component={EditUserProfile} />
          <Route exact path="/recommended-users" component={RecommendedUsers} />
          <Route exact path="/user-profile/:id" component={ShowUserProfile} />
        </Switch>
      </Router>
    )
  }
}
