import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar } from '@mui/material';
import Link from 'next/link';

const SideBar = ({profile, logoutButton}) => (
    <div className="sticky top-0 text-black py-10 w-1/6 flex flex-col justify-between h-screen">
                <div>
                    <h2 className="font-bold text-center text-3xl">Chat</h2>
                    <nav className="mt-10 space-y-4 text-xl m-5">
                        <a href="#" className="w-full flex items-center space-x-5 px-4 py-2 hover:bg-white hover:shadow-xl duration-300 ease-in-out rounded-lg">
                            <HomeIcon />
                            <span>Home</span>
                        </a>
                        <a href="/groupchat" className="w-full flex items-center space-x-5 px-4 py-2 hover:bg-white hover:shadow-xl duration-300 ease-in-out rounded-lg">
                            <ChatIcon />
                            <span>Messages</span>
                        </a>
                        <a href="/profile" className="w-full flex items-center space-x-5 px-4 py-2 hover:bg-white hover:shadow-xl duration-300 ease-in-out rounded-lg">
                            <PersonIcon />
                            <span>Profile</span>
                        </a>
                    </nav>
                </div>
                <div className="m-5">
                    <div className="m-5 flex items-center space-x-3">
                        <Avatar alt={`${profile.firstname} ${profile.lastname}`} src={`http://localhost:8080/avatar/${profile.picture}`} />
                        <div>
                            <p className="font-bold">{ profile.email }</p>
                            <p>{`${profile.firstname} ${profile.lastname}`}</p>
                        </div>
                    </div>
                    <button onClick={logoutButton} className="w-full flex text-red-500 items-center space-x-2 text-xl hover:bg-white hover:shadow-xl px-4 py-2 duration-300 ease-in-out rounded-lg">
                        <LogoutIcon />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
);

export default SideBar;
