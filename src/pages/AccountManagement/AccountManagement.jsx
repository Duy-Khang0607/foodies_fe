import React, { useCallback, useEffect, useState } from 'react'
import { adminDeleteUser, getAllUsers } from '../../services/AuthServices'
import { toast } from 'react-toastify'
import { formatDate } from '../../utils/utils'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import Loading from '../../components/Loading/Loading'
import EditAccount from '../../components/EditAccount/EditAccount'

const AccountManagement = () => {
    const [account, setAccount] = useState([])
    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)



    const fetchAccount = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getAllUsers()
            if (response?.success) {
                setAccount(response?.data?.users)
                toast.success(response?.message)
            } else {
                toast.error(response?.message)
            }
        } catch (error) {
            toast.error('Lỗi hệ thống, vui lòng thử lại sau')
        } finally {
            setLoading(false)
        }
    }, [])

    const handleDelete = async (userId) => {
        setLoading(true)
        try {
            const response = await adminDeleteUser(userId)
            if (response?.success) {
                toast.success(response?.message)
                await fetchAccount()
            } else {
                toast.error(response?.message)
            }
        } catch (error) {
            toast.error('Lỗi hệ thống, vui lòng thử lại sau')
        }
        finally {
            setLoading(false)
        }
    }

    const handleEdit = (user) => {
        setSelectedUser(user)
        setIsEdit(true)
    }

    const handleCloseModal = () => {
        setIsEdit(false)
        setSelectedUser(null)
    }

    useEffect(() => {
        fetchAccount()
    }, [fetchAccount])


    return (
        loading ? <Loading /> : (
            <div className='min-vh-100'>
                <div className="row mt-4 d-none d-xl-block">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white">
                                <h5 className="mb-0">All Accounts</h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 w-100 h-100">
                                        <thead className="table-light text-center">
                                            <tr>
                                                <th>STT</th>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Avatar</th>
                                                <th>Active</th>
                                                <th>Email</th>
                                                <th>Created At</th>
                                                <th>Updated At</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-center'>
                                            {account?.map((user, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <span>{index + 1}</span>
                                                    </td>
                                                    <td>
                                                        <span>{user?.name}</span>
                                                    </td>
                                                    <td>
                                                        <span>{user?.email}</span>
                                                    </td>
                                                    <td>
                                                        <span>{user?.role.toUpperCase()}</span>
                                                    </td>
                                                    <td>
                                                        <PhotoProvider>
                                                            <PhotoView src={user?.avatar} className='w-auto h-100 object-fit-cover rounded-circle'>
                                                                {user?.avatar ? (
                                                                    <img src={user?.avatar} alt="avatar" className=' object-fit-cover rounded' style={{ cursor: 'pointer', width: '50px', height: '50px' }} />
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </PhotoView>
                                                        </PhotoProvider>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${user?.isActive ? 'text-bg-success' : 'text-bg-danger'}`}>{user?.isActive ? 'Active' : 'Inactive'}</span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${user?.isEmailVerified ? 'text-bg-success' : 'text-bg-danger'}`}>{user?.isEmailVerified ? 'Verified' : 'Unverified'}</span>
                                                    </td>
                                                    <td>
                                                        <span>{formatDate(user?.createdAt)}</span>
                                                    </td>
                                                    <td>
                                                        <span>{formatDate(user?.updatedAt)}</span>
                                                    </td>
                                                    <td className="">
                                                        <button className="btn btn-md btn-dark" onClick={() => handleEdit(user)}>
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>
                                                        <button className="btn btn-md btn-danger ms-2" onClick={() => handleDelete(user?._id)}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Account Modal */}
                <EditAccount
                    isOpen={isEdit}
                    onClose={handleCloseModal}
                    userData={selectedUser}
                    fetchUser={fetchAccount}
                />
            </div>
        )
    )
}

export default AccountManagement