import React, { useState ,useEffect} from 'react'
import { MdDeleteOutline } from "react-icons/md"
import { FaEdit } from "react-icons/fa"
import "../App.css";

function Table({ data, setData }) {
    const userPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1)
    const [isChecked, setIsChecked] = useState(false)
    const [selectedUser, setSelectedUser] = useState([])
    const [editedUser, setEditedUser] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const displayUsers=data.slice((currentPage - 1) * userPerPage, currentPage * userPerPage)
    const totalPages = Math.ceil(data.length / userPerPage)
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredData,setFilteredData]=useState([])
    const goToPage = (page) => {
        setCurrentPage(page);
    }
    const renderButton = () => {
        const buttons = []
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button key={i} onClick={() => goToPage(i)} className={currentPage === i ? "currentPage" : ""}>{i}</button>
            )
        }
        return buttons
    }
    const handleCheckboxChange = (userId) => {
        setSelectedUser((prevSelected) => {
            if (prevSelected.includes(userId)) {
                return prevSelected.filter((id) => id !== userId);
            } else {
                return [...prevSelected, userId];
            }
        });
    }
    const handleSelectAllCheckbox = () => {
        const selectCheckboxes = displayUsers.map((user) => user.id);
        if (selectedUser.length === selectCheckboxes.length) {
            setSelectedUser([]);
            setIsChecked(false);
        } else {
            setSelectedUser(selectCheckboxes);
            setIsChecked(true);
        }
    }

    const handleEditClick = (user) => {
        setEditedUser({ ...user });
        setIsEditing(true);
    }

    const handleUpdateClick = () => {
        setData((prevData) => prevData.map((user) => (user.id === editedUser.id ? editedUser : user)));
        setEditedUser(null)
        setIsEditing(false)
    }

    const handleDeleteClick = (userId) => {
        const updatedUsersData = data.filter((user) => user.id !== userId);
        setData(updatedUsersData)
        setSelectedUser([])
        setIsChecked(false)
    }
    const handleDeleteSelected = () => {
        const updatedUsersData = data.filter((user) => !selectedUser.includes(user.id));
        setData(updatedUsersData);
        setSelectedUser([])
        setIsChecked(false)
    }
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            const filteredData = displayUsers.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.role.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filteredData)
           // console.log(filteredData,searchQuery)
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchQuery, data])
    return (
        <div>
        <input type="text" className='searchBox' placeholder='Search here by name ,email ,role'value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}/>
            <table>
                <thead>
                    <tr>
                        <th><input type="checkbox"  checked={isChecked} onChange={handleSelectAllCheckbox}/></th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((user) => (
                        <tr key={user.id}>
                            <td><input type="checkbox" checked={selectedUser.includes(user.id)} onChange={() => handleCheckboxChange(user.id)} /></td>
                            <td>{isEditing && editedUser?.id === user.id ? <input type="text" value={editedUser.name} onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} /> : user.name}</td>
                            <td>{isEditing && editedUser?.id === user.id ? <input type="text" value={editedUser.email} onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })} /> : user.email}</td>
                            <td>{isEditing && editedUser?.id === user.id ? <input type="text" value={editedUser.role} onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })} /> : user.role}</td>
                            <td className='actions'>
                                {isEditing && editedUser?.id === user.id ? (
                                    <button onClick={handleUpdateClick} className='updatebtn'>Update</button>
                                ) : (
                                    <>
                                        <FaEdit onClick={() => handleEditClick(user)} />
                                        <MdDeleteOutline onClick={() => handleDeleteClick(user.id)} />
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='buttons'>
            <div className='deletebtn'><button onClick={handleDeleteSelected}>Delete Selected</button></div>
                <div className='paginationbtn'>
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>{"<<"}</button>
                    <button onClick={() => setCurrentPage((previousPage) => previousPage - 1)} disabled={currentPage === 1}>{"<"}</button>
                    {renderButton()}
                    <button onClick={() => setCurrentPage((previousPage) => previousPage + 1)} disabled={totalPages}>{">"}</button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>{">>"}</button>
                </div>
            </div>
        </div>
    );
}

export default Table;


