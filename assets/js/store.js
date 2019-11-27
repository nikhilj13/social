import { createStore, combineReducers } from "redux";
import deepFreeze from "deep-freeze-strict";


/**
 * store = {
 *    session: {...},
 *    forms: {...},
 *    posts: {...},
 * }
 */

function login(
  st0 = { email: "", password: "", errors: null },
  action
) {
  switch (action.type) {
    case "CHANGE_LOGIN":
      return Object.assign({}, st0, action.data);
    default:
      return st0;
  }
}

function search(st0 ={text:""}, action) {
  switch (action.type) {
    case "CHANGE_SEARCH":
      return Object.assign({}, st0, action.data);
    default:
      return st0;
  }
}


function new_user(
  st0 = {
    name: "",
    email: "",
    dob: "",
    username: "",
    password: "",
    FB_ID: "",
    profile_picture: "",
  },
  action
) {
  switch (action.type) {
    case "CHANGE_NEW_USER":
      return Object.assign({}, st0, action.data);
    default:
      return st0;
  }
}

function user_profile(st0 = {id: null, behavior: "", description: "", interests: "",
qualities: [], request_setting_allow: "", user_id: null, errors: ""}, action) {
  switch (action.type) {
    case "CHANGE_USER_PROFILE":
    console.log(action.data);
      return Object.assign({}, st0, action.data);
    default: return st0;
  }
}

function messages(st0 = [], action) {
  switch(action.type) {
    case "NEW_MESSAGE":
      return [...st0, action.data];
    case "ADD_MESSAGE":
      return action.data
    default:
      return st0;
  }
}


function forms(st0, action) {
  let reducer = combineReducers({
    login,
    new_user,
    user_profile,
    search
  });
  return reducer(st0, action);
}

let session0
if (localStorage.getItem("session")) {
  session0 = JSON.parse(localStorage.getItem("session"));
} else {
  session0 = {
    token: null,
    user_name: null,
    user_id: null,
    email: null,
    profile_picture: null,
  }
}
function session(st0 = session0, action) {
  switch (action.type) {
    case "LOG_IN": {
      let st1 = {...st0, ...action.data}
      localStorage.setItem("session", JSON.stringify(st1));
      return st1
    }
    case "LOG_OUT":{
<<<<<<< Updated upstream
      localStorage.removeItem("session")
      session0 = {
=======
      localStorage.removeItem("session");
      let st1 = {
>>>>>>> Stashed changes
        token: null,
        user_name: null,
        user_id: null,
        email: null,
        profile_picture: null,
      }
<<<<<<< Updated upstream
      return session0
=======
      return st1
>>>>>>> Stashed changes
    }
    default:
      return st0;
  }
}

function users(st0 = new Map(), action) {
  switch (action.type) {
    case "NEW_USER":
      let st1 = new Map(st0);
      st1.set(action.data.id, action.data);
      return st1;
    default:
      return st0;
  }
}

function searchresults(st0 = new Map(), action) {
  switch(action.type) {
    case "GOT_SEARCH_RESULTS": {
      let st1 = new Map()
      console.log(action.data);
      action.data.forEach((el) => st1.set(el.id, el))
      return st1
    }
    case "CLEAR_RESULTS":
      return new Map()
    default:
      return st0
  }
}

function recommendedUsers(st0 = new Map(), action) {
  switch(action.type) {
    case "GOT_RECOMMENDED_USERS": {
      let st1 = new Map(st0)
      action.data.forEach((el) => st1.set(el.id, el))
      return st1
    }
    default:
      return st0
  }
}



function ig_posts(st0 = new Map(), action) {
  switch(action.type) {
    case "GOT_POSTS": {
      let st1 = new Map(st0)
      action.data.forEach((el) => st1.set(el.id, el))
      return st1
    }
    default:
      return st0
  }
}

function user_profiles(st0 = new Map(), action) {
  switch (action.type) {
    case "NEW_USER_PROFILE":
      let st1 = new Map(st0);
      st1.set(action.data.id, action.data);
      return st1;
    default:
      return st0;
  }
}

function notifications(st0 = [], action) {
  switch(action.type) {
    case "NEW_NOTIF":
      return [...st0, action.data];
    case "ADD_NOTIF":
      return action.data
    case "REMOVE_NOTIF":
      return action.data
    default:
      return st0;
  }
}

function channels(st0 = [], action) {
  switch(action.type) {
    case "NEW_CHANNEL": {
      return [...st0, action.data];
    }
    default:
      return st0
  }
}

function chat_list(st0 = [], action) {
  switch(action.type) {
    case "CHAT_LIST": {
      return [...st0, action.data]
    }
    default:
      return st0
  }
}

function root_reducer(st0, action) {
  console.log("root reducer", st0, action);
  let reducer = combineReducers({
    forms,
    users,
    session,
    user_profiles,
    ig_posts,
    recommendedUsers,
    searchresults,
    messages,
    notifications,
    channels,
    chat_list,
  });
  return deepFreeze(reducer(st0, action));
}

const reducerWrapper = (state, action) => {
  if(action.type === "RESET_APP")
    state = undefined

  return root_reducer(state, action)
}

let store = createStore(reducerWrapper, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;
