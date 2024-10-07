 "use client";
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, TextField } from '@mui/material';
import { useState, useEffect } from "react";
import axios from 'axios';
import Notiflix from 'notiflix';
import Pusher from 'pusher-js';
import SideBar from '../components/sideBar';

export default function Home() {
    const [open, setOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null); 
    const [profile, setProfile] = useState([]);
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);

    function getCookieValue(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const handleOpen = (post) => {
        setSelectedPost(post);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPost(null);
        setCommentText("");
    };

    const handleAddComment = async () => {
        if (commentText.trim() === "") return;

        const token = getCookieValue('jwt');

        const createCommentRequest = axios.post('http://localhost:8080/api/comment',
            {
                id: selectedPost._id,
                body: commentText
            },
            {
                headers: {
                    authtoken: token
                }
            }
        )

        Promise.all([createCommentRequest])
        .then(([createCommentRequest]) => {
            Notiflix.Notify.success(createCommentRequest.data.message);
        })
        .catch(error => {
            console.error(error)
        })

    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file))
        }
    };

    const handlePost = async (e) => {

        e.preventDefault();

        if (postText.trim() === "" && !selectedImage) return;

        const token = getCookieValue('jwt');

        const formData = new FormData();
        formData.append('body', postText);
        if(selectedImage){
            formData.append('post_pic',selectedImage)
        }

        const createPostRequest = axios.post('http://localhost:8080/api/post/create',
            formData,
            {
                headers : {
                    authtoken: token
                }
            }
        );

        Promise.all([createPostRequest])
        .then(([createPostRequest]) => {
            Notiflix.Notify.success(createPostRequest.data.message)
            setTimeout(() => {
                window.location.reload()
            },1500)
        })
        .catch(error => {
            console.error(error)
        })
      

    };

    const handleProfileAndPost = async () => {
        const token = getCookieValue('jwt');
    
        const profileRequest = axios.get('http://localhost:8080/api/auth/user/profile', {
            headers: {
                authtoken: token
            }
        });
    
        const postRequest = axios.get('http://localhost:8080/api/post', {
            headers: {
                authtoken: token
            }
        });
    
        Promise.all([profileRequest, postRequest])
            .then(([profileResponse, postResponse]) => {
                setProfile(profileResponse.data.message);
                setPosts(postResponse.data.message); 
            })
            .catch((error) => {
                console.error(error);
            });
    };
    
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

    useEffect(() => {
        handleProfileAndPost();

        if(!getCookieValue("jwt")){
            window.location.href = '/auth/login'
        }

    }, []);

    useEffect(() => {
        const pusher = new Pusher('b6831a790dc700970e1f', {
            cluster: 'ap1',
        });

        const channel = pusher.subscribe('comment');

        const handleNewComment = (data) => {
            setPosts((prevPosts) => 
                prevPosts.map((post) => {
                    if (post._id === data.message.post_id) {
                        return {
                            ...post,
                            comments: [...post.comments, data.message],
                        };
                    }
                    return post;
                })
            );
            handleClose();
        };

        channel.bind('lastedcomment', handleNewComment);

        return () => {
            channel.unbind('lastedcomment', handleNewComment);
            pusher.unsubscribe('comment');
        };
    }, [setPosts, handleClose]);

    useEffect(() => {

        const pusher = new Pusher('b6831a790dc700970e1f', {
            cluster: 'ap1',
        });

        const channel = pusher.subscribe('post');

        channel.bind(`lastedpost`, function(data) {
            // console.log(data.message)
            setPosts((prevPosts) => [data.message, ...prevPosts]);
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe('post');
        };

    },);

    return (
        <div className="flex">
            {/* Sidebar */}
            <SideBar 
                profile={profile} 
                logoutButton= {logout}
                 />

            <div className="flex-1 flex justify-center text-black">
                <div className="w-full max-w-3xl p-10">
                    <form method='POST'  onSubmit={handlePost} encType="multipart/form-data" className="bg-white shadow-2xl p-4 rounded-md mb-4">
                        <div className="flex items-center">
                            <Avatar alt={`${profile.firstname} ${profile.lastname}`} src={`http://localhost:8080/avatar/${profile.picture}`} />
                            <TextField
                                placeholder="Type Message..."
                                variant="outlined"
                                fullWidth
                                className="mx-4"
                                color="secondary"
                                onChange={(e) => setPostText(e.target.value)}
                            />
                        </div>
                        {selectedImage && (
                            <div className="mt-2">
                                <img src={previewUrl} alt="Selected" className="max-w-full h-auto" />
                            </div>
                        )}
                        <div className="mt-3 mr-4 flex space-x-3 justify-end">
                            <Button startIcon={<ImageIcon />} component="label" className='bg-indigo-600 hover:bg-indigo-500 duration-300 ease-in-out text-white'>
                                Upload Image
                                <input hidden type="file" onChange={handleImageUpload} />
                            </Button>
                            <button variant="contained" className='bg-indigo-600 hover:bg-indigo-500 duration-300 ease-in-out text-white px-2 py-[6px] w-32 rounded' type='submit'>Post</button>
                        </div>
                    </form>

                    {posts.map((post) => (
                        <div key={post.id} className="bg-white shadow-2xl p-4 rounded-md mb-4">
                            <div className="flex">
                                {/* ย้าย Avatar ไปซ้ายบน */}
                                <Avatar alt={post.user ? post.user.firstname : "unknows"} src={`http://localhost:8080/avatar/${post.user ? post.user.picture : ''}`} className="mr-4" />

                                <div>
                                    <p className="font-bold">{`${post.user ? post.user.firstname : "unknows"} ${post.user ? post.user.lastname : ''}`}</p>
                                    <p>{post.body}</p>

                                    {/* แสดงรูปภาพถ้ามี */}
                                    {post.picture && <img src={`http://localhost:8080/picture/post/${post.picture}`} alt="Post Image" className="max-w-full h-auto mt-2" />}
                                </div>
                            </div>

                            <hr className="my-2" />

                            {/* แสดงคอมเมนต์ */}
                            <List>
                                {post.comments.map((comment) => (
                                    <ListItem key={comment.id} alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar alt={`${comment.user_id ? comment.user_id.firstname : "unknows"} ${comment.user_id ? comment.user_id.lastname : ''}`} src={`http://localhost:8080/avatar/${comment.user_id ? comment.user_id.picture : ''}`} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${comment.user_id ? comment.user_id.firstname : "unknows"} ${comment.user_id ? comment.user_id.lastname : ''}`}
                                            secondary={comment.body}
                                        />
                                    </ListItem>
                                ))}
                            </List>

                            <div className='flex justify-end'>
                                <Button variant="outlined" className="font-bold" startIcon={<ChatIcon />} onClick={() => handleOpen(post)}>
                                    แสดงความคิดเห็น
                                </Button>
                            </div>
                        </div>
                    ))}


                    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                        <DialogTitle>ความคิดเห็น</DialogTitle>
                        <DialogContent>
                            {selectedPost && (
                                <>
                                    {/* โพสต์ที่เลือก */}
                                    <div className="flex items-center mb-4">
                                        <Avatar alt={selectedPost.username} src={selectedPost.avatar} />
                                        <div className="ml-4">
                                            <p className="font-bold">{selectedPost.username}</p>
                                            <p>{selectedPost.body}</p>
                                        </div>
                                    </div>

                                    <List>
                                        {selectedPost.comments.map((comment) => (
                                            <ListItem key={comment.id} alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt={`${comment.user_id ? comment.user_id.firstname : "unknows"} ${comment.user_id ? comment.user_id.lastname : ''}`} src={`http://localhost:8080/avatar/${comment.user_id ? comment.user_id.picture : ''}`} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`${comment.user_id ? comment.user_id.firstname : "unknows"} ${comment.user_id ? comment.user_id.lastname : ''}`}
                                                    secondary={comment.body}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>

                                    <TextField
                                        placeholder="Type comment..."
                                        variant="standard"
                                        color='secondary'
                                        fullWidth
                                        multiline
                                        minRows={1}
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        className="mt-4"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '20px',
                                            },
                                        }}
                                    />
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">Close</Button>
                            <Button variant="contained" color="primary" onClick={handleAddComment}>Post Comment</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
