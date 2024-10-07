"use client";
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import NavBar from '../components/navbar';
import axios from 'axios';
import Notiflix from 'notiflix';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import {CloudUpload} from '@mui/icons-material';
import Pusher from 'pusher-js';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

export default function GroupChat() {
    const [profile, setProfile] = useState([]);
    const [group, setGroup] = useState([]);
    const [selectGroup, setSelectGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [id,setId] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [notJoinGroup, setNotJoinGroup] = useState([]);
    
    const submitJoinGroup = async (data) =>{
        
        const token = getCookieValue('jwt');
        try{

            const joinGroupRequest = await axios.post('http://localhost:8080/api/chat/join',
                {
                    id : data._id
                },
                {
                    headers: {
                        authtoken: token
                    }
                }
            ).then(response => {
                Notiflix.Notify.success(response.data.message)
                setTimeout(() => {
                    window.location.reload()
                }, 1500);
            }).catch(error => {
                console.log(error)
            })

        }catch(error){

        }
    }

    const getCookieValue = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const handleChatAndMember = async (group) => {

        const token = getCookieValue('jwt');

        const memberRequest = axios.post('http://localhost:8080/api/chat/member',
            {
                id : group.group_id._id
            },
            {
                headers: {
                    authtoken: token
                }
            }
        )

        const chatRequest = axios.get(`http://localhost:8080/api/chat/message/${group.group_id._id}`,
            {
                headers:{
                    authtoken: token
                }
            }
        )

        Promise.all([memberRequest,chatRequest])
            .then(([memberResponse,chatResponse]) => {
                setMembers(memberResponse.data.message);
                setMessages(chatResponse.data.message);
            }).catch(error => {
                console.log(error)
            })

    }

    const handleGroup = (group) => {
        setSelectGroup(group)
    }

    useEffect(() => {
        if(selectGroup){
            handleChatAndMember(selectGroup);
            setId(selectGroup.group_id._id); 
        }
    },[selectGroup])

    // dialog
    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [openJoin, setOpenJoin] = useState(false);

    const handleOpenJoin = () => {
        setOpenJoin(true);
    }

    const handleCloseJoin = () => {
        setOpenJoin(false)
    }

    const handleSendMessage = async () => {
        if (message.trim() === "") {
            return; 
        }

        const token = getCookieValue('jwt');

        const requestSendMessage = await axios.post('http://localhost:8080/api/chat/send',
            {
                id : id,
                body: message
            },
            {
                headers:{
                    authtoken: token
                }
            }
        ).then(response => {
            setMessage('')
        })

    };

    const handleProfileAndGroup = async () => {

        const token = getCookieValue('jwt');
    
        const profileRequest = axios.get('http://localhost:8080/api/auth/user/profile', {
            headers: {
                authtoken: token
            }
        });

        const chatRequest = axios.get('http://localhost:8080/api/chat',
            {
                headers: {
                    authtoken: token
                }
            }
        );

        const groupRequest = axios.get('http://localhost:8080/api/group',
            {
                headers: {
                    authtoken: token
                }
            }
        )

        Promise.all([profileRequest,chatRequest,groupRequest])
            .then(([profileResponse,chatResponse,groupResponse]) => {
                setProfile(profileResponse.data.message)
                setGroup(chatResponse.data.message)
                setNotJoinGroup(groupResponse.data.message)

            })
            .catch(error => {
                console.log(error)
            })

    }

    const logout = async () => {
        const token = getCookieValue('jwt');
    
        Notiflix.Confirm.init({
            titleColor: '#ff0000', 
            okButtonBackground: '#dc2626', 
            cancelButtonBackground: '#fb7185',
            cssAnimationStyle: 'zoom',
            width: '500px',
            titleFontSize: "30px",
            messageFontSize: "16px"
        });

        Notiflix.Confirm.show(
            'Logout',
            "Do you want to logout right?",
            'Yes',
            'No',
            () => {
                try {
                    axios.post('http://localhost:8080/api/auth/logout', {}, {
                        headers: {
                            authtoken: token
                        }
                    });
            
                    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
                    Notiflix.Notify.success("logout successfully!")
                    window.location.href = '/auth/login';
                } catch (error) {
                    console.error('Error during logout:', error);
                }
            }
        )

    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file))
        }
    };
    
    const handleSubmitCreateGroup = async (e) => {

        e.preventDefault();

        const token = getCookieValue('jwt');

        const formData = new FormData();
        formData.append('name',groupName);
        formData.append('group_pic',selectedImage);

        try{

            const createGroupRequest = await axios.post('http://localhost:8080/api/group/create',
                formData,
                {
                    headers: {
                        authtoken: token
                    }
                }
            ).then(response => {
                Notiflix.Notify.success(response.data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }).catch(error => {
                Notiflix.Notify.failure(error.response.data.message);
            })

        }catch(error){
            console.log(error)
        }

    }

    const showDate = (value) => {
        const date = new Date(value);
        return date.toLocaleTimeString();
    };

    useEffect(() => {
        handleProfileAndGroup()

        if(!getCookieValue("jwt")){
            window.location.href = '/auth/login'
        }

    },[]);

    useEffect(() => {

        const pusher = new Pusher('b6831a790dc700970e1f', {
            cluster: 'ap1',
            wsHost: 'ws-ap1.pusher.com',
            wsPort: 443,
            wssPort: 443,
            forceTLS: true,
            disableStats: true,
        });

        const channel = pusher.subscribe('message');

        channel.bind(`group-${id}`, function(data) {
            setMessages((prevMessages) => [...prevMessages, data.message]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };

    },[id]);

    useEffect(() => {
        const scrollToBottom = () => {
            const chatContainer = document.getElementById('chatContainer');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        };

        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-screen bg-white text-black">
            <div>
                <NavBar 
                    firstname={profile.firstname} 
                    lastname={profile.lastname} 
                    email={profile.email} 
                    avatar={profile.picture ? profile.picture : ''} 
                    logoutSubmit={logout} 
                    openDialog={handleClickOpen}
                    openJoin={handleOpenJoin} />
            </div>
            {/* Main content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-1/5 bg-gray-100 p-4 text-xl">
                    {/* Contact List */}
                    <div className="space-y-4 overflow-y-scroll scrollbar-hide" style={{ maxHeight: '800px', overflowY: 'scroll' }}>
                        {group.map((group, index) => (
                            <div className="flex items-center space-x-2 cursor-pointer hover:bg-white hover:shadow-xl duration-200 ease-in-out p-3 rounded-xl gap-3" key={index} onClick={() => handleGroup(group)}>
                                <Avatar src={`http://localhost:8080/picture/group/${group.group_id.picture}`} className='w-10 h-10' />
                                <span>{group.group_id.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat section */}
                <div className={`flex-1 flex flex-col bg-white p-4 ${!selectGroup ? 'justify-center items-center' : ''}`}>
                    {/* Chat messages */}
                    {
                        selectGroup && <div className="flex-1 overflow-y-scroll space-y-4 scrollbar-hide" style={{ maxHeight: '750px', overflowY: 'scroll' }} id='chatContainer'>
                         {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender_id._id == profile._id ? 'justify-end ' : 'justify-start'}`}
                            >
                                <div
                                    className={`p-2 rounded-lg max-w-xs ${msg.sender_id._id == profile._id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-black'
                                        }`}
                                >
                                    <span>{msg.body}</span>
                                    <p className="text-gray-400 text-sm">{showDate(msg.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    }
                    {
                        !selectGroup &&
                        <h1 className='text-4xl font-bold text-violet-600'>Please select group</h1>
                    }

                    {/* Message input */}
                    { selectGroup && <div className="mt-4">
                        <div className="flex items-center border border-gray-700 bg-gray-800 rounded-lg">
                            {/* Input Field */}
                            <input
                                type="text"
                                placeholder="Aa"
                                className="flex-1 p-2 bg-gray-800 text-white focus:outline-none"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />

                            {/* Send Icon Button */}
                            <button className="p-2" onClick={handleSendMessage}>
                                <SendIcon className="text-blue-400" />
                            </button>
                        </div>
                    </div>}
                </div>

                {/* Right side panel (optional) */}
                {
                    selectGroup &&
                    <div className="w-1/4 bg-gray-200 p-4">
                        <div className="space-y-4">
                            <p className="font-bold text-2xl">Member</p>
                            {members.map((member, index) => (
                                <div className="flex items-center space-x-2" key={index}>
                                    <Avatar 
                                    alt={`${member.user_id ? member.user_id.firstname : 'Unknows'} ${member.user_id ? member.user_id.lastname : ""}`}
                                    src={`http://localhost:8080/avatar/${member.user_id ? member.user_id.picture : ""}`}
                                    />
                                    <span>{`${member.user_id ? member.user_id.firstname : 'Unknows'} ${member.user_id ? member.user_id.lastname : ""}`}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
            <form encType='multipart/form-data' method='POST' onSubmit={handleSubmitCreateGroup}>
            <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                const email = formJson.email;
                console.log(email);
                handleClose();
              },
            }}   
            >
                    <DialogTitle>Create group</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        You can create group chat, please enter your group name and picture group here. 
                        It will create for you automatic.
                    </DialogContentText>
                    <Avatar className='mb-3 w-28 h-28' src={previewUrl} variant="square" />
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUpload />}
                        className='mb-3'
                        >
                        Upload files
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleImageUpload}
                            multiple
                        />
                    </Button>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Group name"
                        type="text"
                        color='secondary'
                        fullWidth
                        variant="standard"
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Create</Button>
                    </DialogActions>
            </Dialog>
        </form>


        {/* join group */}
        <Dialog
            open={openJoin}
            onClose={handleCloseJoin}
            >
                    <DialogTitle>Join group</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        You can join group chat, please select interesting group here. 
                        It will join for you automatic.
                    </DialogContentText>
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mt-3 max-h-[35rem]'>
                        {
                            notJoinGroup.map((group, index) => (
                                <button 
                                    className='flex flex-col items-center w-full h-36 cursor-pointer' 
                                    onClick={() => submitJoinGroup(group)} 
                                    key={index}
                                >
                                    <Avatar className='w-16 h-16' src={`http://localhost:8080/picture/group/${group.picture}`} />
                                    <h1>{group.name}</h1>
                                </button>
                            ))
                        }
                    </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseJoin}>Cancel</Button>
                    </DialogActions>
            </Dialog>
        </div>
    );
}
