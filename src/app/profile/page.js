"use client";
import { useEffect,useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { Roboto, Kanit } from 'next/font/google';
import { IconButton } from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AddIcon from '@mui/icons-material/Add';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import axios from 'axios';
import Notiflix from 'notiflix';

// Change font Thai
const myFontThai = Kanit({
    weight: "400",
    subsets: ["latin", 'thai'],
    variable: "--my-font-family",
    display: 'swap',
});

const myFontEng = Roboto({
    weight: "400",
    subsets: ["latin"],
    variable: "--my-font-family",
    display: 'swap',
});

// Custom styled Dialog component
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const Profile = () => {
    const [firstname, setFirstname] = useState([]);
    const [lastname, setLastname] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(); 
    const [previewUrl, setPreviewUrl] = useState(null);
    const [oldPassword, setOldPassword] = useState();
    const [newPassword , setNewPassword] = useState();
    const [confirmPassword, setConfirmPassowrd] = useState();

    function getCookieValue(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(event.target.files[0]);
            setPreviewUrl(URL.createObjectURL(file))
            
            setTimeout(() => {
                document.getElementById('avatarFormButton').click();
            }, 100);

        }
    };

    const avatarSubmit = async (e) => {
        
        e.preventDefault();
        const token = getCookieValue('jwt');

        const formData = new FormData();
        formData.append('avatar', selectedImage);

        try{

            const changeAvatarRequest = await axios.put('http://localhost:8080/api/auth/changeavatar',
                formData,
                {
                    headers: {
                        authtoken: token
                    }
                }
            ).then(response => {
                Notiflix.Notify.success(response.data.message)
                setTimeout(() => {
                    window.location.reload()
                },1500)
            }).catch(error => {
                Notiflix.Notify.failure(error.response.data.message)
            })

        }catch(error){
            console.log(error)
        }

    }

    const handleProfile = async () => {

        const token = getCookieValue('jwt');

        try{

            const profileRequest = await axios.get('http://localhost:8080/api/auth/user/profile', {
                headers: {
                    authtoken: token
                }
            });
    
            setFirstname(profileRequest.data.message?.firstname || '');
            setLastname(profileRequest.data.message?.lastname || "");
            const picture = profileRequest.data.message?.picture || ""
            setPreviewUrl(`http://localhost:8080/avatar/${picture}`);

        }catch(error){
            console.log(error);
        }

    } 

    const handleSubmitProfile = async (e) => {

        e.preventDefault();

        const token = getCookieValue('jwt');
        
        try{
            
            const requestChangeProfile = axios.put('http://localhost:8080/api/auth/update',
                {
                    firstname,
                    lastname
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
                },1500)
            }).catch(error => {
                Notiflix.Notify.failure(error.response.data.message)
            })

        }catch(error){
            console.log(error)
        }

    }

    const handleSubmitPassword = async () => {

        const token = getCookieValue('jwt');

        setTimeout(() => {
            try{

                const requestChangePassword = axios.put('http://localhost:8080/api/auth/change-password',
                    {
                        old_password : oldPassword,
                        new_password : newPassword,
                        confirm_password : confirmPassword
                    },
                    {
                        headers:{
                            authtoken: token
                        }
                    }
                ).then(response => {
                    Notiflix.Notify.success(response.data.message);
                    setOpen(false);
                }).catch(error => {
                    Notiflix.Notify.failure(error.response.data.message);
                });
    
            }catch(error){
                console.log(error);
            }
        },100)

    }

    const handleRequestDeleteAccount = async => {

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
            'Delete account?',
            "Do you want to delete account right?",
            'Yes',
            'No',
            () => {
                try{

                    const requestDeleteAccount = axios.delete('http://localhost:8080/api/auth/user-delete',
                        {
                            headers: {
                                authtoken: token
                            }
                        }
                    ).then(response => {
                        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        Notiflix.Notify.success(response.data.message)
                        setTimeout(() => {
                            window.location.href = '/auth/login';
                        }, 2000);
                    }).catch(error => {
                        Notiflix.Notify.failure(error.response.data.message)
                    }) 

                }catch(error){

                }
            }
        )

    }

    useEffect(() => {
        handleProfile()
    },[]);

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-[52rem] h-[42rem] rounded-md bg-white shadow-2xl">
                <div className="flex justify-center">
                    <Card className="mt-24 ml-24 mr-24 w-[18rem] ">
                    <form 
                        id="avatarForm" 
                        onSubmit={avatarSubmit} 
                        encType="multipart/form-data"
                        className="relative w-full h-[12rem] bg-slate-100"
                    >
                        <Avatar
                            className="object-top w-full h-full"
                            src={previewUrl || '/path-to-default-image.jpg'} // Default image in case previewUrl is empty
                            alt={`profile ${firstname} ${lastname}`}
                            fill
                            style={{ objectFit: "cover" }}
                            variant='square'
                        />
                        <IconButton
                            className="absolute top-2 right-2 text-indigo-400 duration-300 ease-in-out hover:text-indigo-700"
                            aria-label="add"
                            component="label"
                        >
                            <AddCircleRoundedIcon fontSize="large" />
                            {/* Hidden file input */}
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </IconButton>
                        <button id='avatarFormButton' type='submit' className='hidden'>asdasd</button>
                    </form>

                        <CardContent className='mb-2 mt-2'>
                            <TextField
                                 className='mt-2 w-full'
                                 color="secondary"
                                 id="standard-basic"
                                 label="First name"
                                 value={firstname}
                                 variant="standard"
                                 placeholder="first name"
                                 InputProps={{
                                     style: {
                                         fontSize: 16,
                                     }
                                 }}
                                 onChange={(e) => setFirstname(e.target.value)}
                            />
                            {/* <div className="flex justify-center items-center mt-2"> */}
                            <TextField
                                className='mt-2 w-full'
                                color="secondary"
                                id="standard-basic"
                                label="First name"
                                value={lastname}
                                variant="standard"
                                placeholder="last name"
                                InputProps={{
                                    style: {
                                        fontSize: 16,
                                    }
                                }}
                                onChange={(e) => setLastname(e.target.value)}
                            />
                            {/* </div> */}
                        </CardContent>
                        <CardActions className="flex justify-center items-center mb-2">
                            <Button endIcon={<CheckRoundedIcon />} onClick={handleSubmitProfile} className="bg-indigo-400 duration-300 ease-in-out hover:bg-indigo-600 text-white">
                                Submit
                            </Button>
                        </CardActions>
                    </Card>
                </div>
                <div>
                    <div className="mt-20 flex flex-row-reverse justify-around">
                        <div className="flex gap-4">
                            <Button variant="outlined" endIcon={<AddIcon />} onClick={handleClickOpen}>
                                Change Password
                            </Button>

                            <BootstrapDialog
                                onClose={handleClose}
                                aria-labelledby="customized-dialog-title"
                                open={open}
                            >
                                <BootstrapDialogTitle
                                    id="customized-dialog-title"
                                    onClose={handleClose}
                                >
                                    Change Password
                                </BootstrapDialogTitle>
                                <DialogContent className='w-[26rem] h-[16rem] flex flex-col gap-y-5' dividers>
                                    <div className="flex flex-col justify-center">
                                        <TextField
                                            type='password'
                                            color="secondary"
                                            id="standard-basic"
                                            label="Old password"
                                            variant="standard"
                                            onChange={(e) => {setOldPassword(e.target.value)}}
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <TextField
                                            type='password'
                                            color="secondary"
                                            id="standard-basic"
                                            label="New Password"
                                            variant="standard"
                                            onChange={(e) => {setNewPassword(e.target.value)}}
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <TextField
                                            type='password'
                                            color="secondary"
                                            id="standard-basic"
                                            label="Confirm New Password"
                                            variant="standard"
                                            onChange={(e) => {setConfirmPassowrd(e.target.value)}}
                                        />
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button className='bg-indigo-400 duration-300 ease-in-out hover:bg-indigo-600 text-white' autoFocus onClick={handleSubmitPassword}>
                                        Save changes
                                    </Button>
                                </DialogActions>
                            </BootstrapDialog>
                        </div>
                        <Button className="mr-2" color="error" variant="outlined" endIcon={<ClearRoundedIcon />} onClick={handleRequestDeleteAccount}>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
