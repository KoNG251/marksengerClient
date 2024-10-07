"use client";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Radio, RadioGroup, FormControlLabel, FormLabel, Button } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Notiflix from 'notiflix';

const AdminManage = () => {

    const [post, setPost] = useState([]);
    const [selectValidate, setSelectValidate] = useState(0);

    function getCookieValue(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const handleNotValidatePost = async () => {
        const token = getCookieValue('jwtAdmin');
        try {
            const response = await axios.get('http://localhost:8080/api/admin/post', {
                headers: { authtoken: token }
            });
            setPost(response.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmitValidate = async (e, id) => {
        e.preventDefault();
        const token = getCookieValue('jwtAdmin');

        try {
            const response = await axios.post('http://localhost:8080/api/admin/validate', {
                id,
                status: parseInt(selectValidate, 10)
            }, {
                headers: { authtoken: token }
            });
            Notiflix.Notify.success(response.data.message);
            handleNotValidatePost();
        } catch (error) {
            Notiflix.Notify.failure(error.response?.data?.message || "An error occurred");
        }
    };

    const logout = async () => {
        const token = getCookieValue('jwtAdmin');
    
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
                    axios.post('http://localhost:8080/api/admin/logout', {}, {
                        headers: {
                            authtoken: token
                        }
                    });
            
                    document.cookie = 'jwtAdmin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
                    Notiflix.Notify.success("logout successfully!")
                    window.location.href = '/auth/login';
                } catch (error) {
                    console.error('Error during logout:', error);
                }
            }
        )

    };

    useEffect(() => {
        handleNotValidatePost();

        if(!getCookieValue("jwtAdmin")){
            window.location.href = '/auth/login'
        }

    }, []);

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <div className="w-full max-w-7xl h-[80vh] bg-white shadow-2xl rounded-xl flex flex-col gap-4 overflow-y-scroll scrollbar-hide p-5">
                {post.map((postItem) => (
                    <Accordion className="w-full rounded-xl" key={postItem._id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${postItem._id}-content`}
                            id={`panel${postItem._id}-header`}
                        >
                            <Typography>{`${postItem.user?.firstname || "Unknown"} ${postItem.user?.lastname || ''}`}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                เนื้อหา<br></br>
                                {postItem.body}
                            </Typography>
                            {postItem.picture && <img src={`http://localhost:8080/picture/post/${postItem.picture}`} alt="Post" className="max-w-full h-56 mt-2" />}
                            {/* radio */}
                            <form method="POST" onSubmit={(e) => handleSubmitValidate(e, postItem._id)}>
                                <FormLabel className="font-semibold my-3">Validate Post</FormLabel>
                                <RadioGroup
                                    value={selectValidate}
                                    onChange={(e) => setSelectValidate(e.target.value)}
                                >
                                    <FormControlLabel className="text-indigo-500 font-semibold" value="1" control={<Radio />} label="Verify" />
                                    <FormControlLabel className="text-rose-500 font-semibold" value="2" control={<Radio />} label="Not approved" />
                                </RadioGroup>
                                <button className="px-5 py-2 bg-green-400 hover:bg-green-500 duration-300 ease-in-out rounded-xl" type="submit">SUBMIT</button>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
            <div className="mt-3">
                <Button variant="contained" color="error" onClick={logout}>Logout</Button>
            </div>
        </div>
    );
};

export default AdminManage;