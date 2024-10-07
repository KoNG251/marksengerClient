import { Avatar } from '@mui/material';
import Link from 'next/link';
import {CreateNewFolderRounded, Chat, Home, Logout, Person, GroupAddRounded} from '@mui/icons-material';

const NavBar = ({firstname, lastname, email, avatar, logoutSubmit, openDialog,openJoin}) => (
    <div className="w-full bg-gray-900 text-white py-4 px-10 flex justify-between items-center">
        {/* Left section - Navigation links */}
        <div className="flex items-center space-x-12">
            <h2 className="font-bold text-3xl">Marksenger</h2>
            <nav className="flex space-x-10 text-lg">
                <Link href="/home">
                    <Home className="text-5 me-1" />
                    <span>Home</span>
                </Link>
                <Link href="/messages">
                    <Chat className="text-5 me-1" />
                    <span>Messages</span>
                </Link>
                <Link href="/profile">
                    <Person className="text-5 me-1" />
                    <span>Profile</span>
                </Link>
                <button type='button' onClick={openDialog}>
                    <CreateNewFolderRounded className="text-5 me-1" />
                    <span>Create group</span>
                </button>
                <button type='button' onClick={openJoin}>
                    <GroupAddRounded className="text-5 me-1" />
                    <span>Join group</span>
                </button>
            </nav>
        </div>

        {/* Right section - User info and Logout */}
        <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
                <Avatar alt="Tankoon Jaroensuk" src={`http://localhost:8080/avatar/${avatar}`} />
                <div>
                    <p className="font-bold">{`${firstname+" "+lastname}`}</p>
                    <p className="text-sm text-gray-400">{email}</p>
                </div>
            </div>
            <button type='button' className='text-red-500' onClick={logoutSubmit}>
                <Logout className="text-5 me-1" />
                <span>Logout</span>
            </button>
        </div>
    </div>
);

export default NavBar;
