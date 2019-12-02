import React from 'react'
import { get } from '../ajax'
import store from '../store'
import placeholder from '../../static/placeholder.svg'
import { Link } from 'react-router-dom';
import { createNotification, get_user_data } from "../ajax";
import socket from '../socket';
import Chat from "./chat";
export default class FriendsComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
           friends: store.getState().friends,
           current_chat: null,
           current_name: ""
        }

        if(this.state.friends.length == 0) {
            get('/user/friends/' + store.getState().session.user_id).then(resp => {
                store.dispatch({
                    type: 'GOT_FRIENDS',
                    data: resp.data
                })
                this.setState({friends: resp.data})
            }) 
        }
    }

    joinChat(sender_id, receiver_id) {
        let channel = "users:";
        if(sender_id > receiver_id) {
            channel = channel + receiver_id + sender_id;
        }else {
            channel = channel + sender_id + receiver_id;
        }
        console.log(channel);
        this.setState({current_chat: channel, current_name: ""}) //change this
        let chatChannel = socket.channel(channel);
        chatChannel.join().receive("ok", (resp) => {
                store.dispatch({
                    type: "NEW_CHANNEL",
                    data: channel
                })
            console.log(resp)})
        this.setState({chatChannel: chatChannel, openChat: true});
        get_user_data(sender_id)
    }
startChat(receiver_id) {
    //send chat notification to the receiver
    console.log(receiver_id)
    let channel = "users:";
        if(sender_id > receiver_id) {
            channel = channel + receiver_id + sender_id;
        }else {
            channel = channel + sender_id + receiver_id;
        }
    if(!store.getState().channels.includes(channel)) {
        const text = store.getState().session.user_name + " sent you a message";
        createNotification(store.getState().session.user_id, receiver_id, "CHAT", text, null)
    }
    console.log("start chat");
    const sender_id = store.getState().session.user_id;
    this.joinChat(sender_id, receiver_id)
}


    renderFriends() {
        console.log(this.state.friends)
        console.log("sender id", store.getState().session.user_id)
        const { friends } = this.state;
        if (friends.length >= 0) {
            return (
                <p style={{ color: "gray", textAlign: 'center', marginTop: '20%' }}> <i> No Friends Available </i> </p>
            );
        }
        let list = this.state.friends.map(friend => {
            let dp = friend.profile_picture
            dp = dp ? dp : placeholder
            if(this.props.action == "start chat") {
                return(
                        <div className="friend" key={friend.id} onClick={() => {
                            this.startChat(friend.id, friend.name)
                        }}>
                            <img src={dp} alt="dp" className="friend-img"/>
                            <span className="">{friend.name}</span>
                            <hr/>
                        </div>
                    )
            }else {
                return(
                        <div className="friend" key={friend.id}>
                            <img src={dp} alt="dp" className="friend-img"/>
                            <Link to={"/user-profile/" + friend.id} className="friend-name">{friend.name}</Link>
                            <hr/>
                        </div>
                    )
            }
        }) 
        return list
    }

    render() {
        let chats = [];
        let channel = store.getState().channels
        for(let i = 0; i < channel.length; i++) {
        chats.push(<div className="col-sm">
            <Chat channel={socket.channel(channel[i], {})}></Chat></div>)
}
        if(this.state.friends) {
            return (
                <div className="chat-container" id="friend-list">
                    {this.renderFriends()}
                    {/* <button onClick={() => this.startChat(2)}>start chat</button> */}
                    {/* <button onClick={() => this.startChat(3)}>start chat</button> */}
                    {chats}
                </div>
            )
        } else return null
    }
}