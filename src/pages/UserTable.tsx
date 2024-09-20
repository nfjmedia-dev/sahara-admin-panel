// src/components/UserTable.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify'; // Import Toast components
import { apiService } from '../services/api';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications
import './UserTable.css';

interface User {
    id: number;
    site_name: string;
    site_url: string | null;
    created_at: string;
    updated_at: string;
    site_id: string | null;
    live_payment_methods_url: string | null;
    test_payment_methods_url: string | null;
    app_status: string;
    account_owner_uuid: string;
    installer_account_uuid: string;
    api_endpoint: string;
    app_plan_uuid: string;
}

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({});

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await apiService.get('app/getapps');
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    const handleCloseViewModal = () => setShowViewModal(false);

    const handleShowDeleteModal = (id: number) => {
        setUserIdToDelete(id);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const handleShowEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({ 
            site_name: user.site_name, 
            site_url: user.site_url,
            app_status: user.app_status 
        });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setFormData({});
    };

    const handleDeleteUser = async () => {
        if (userIdToDelete) {
            try {
                await apiService.delete(`app/deleteapp/${userIdToDelete}`);
                setUsers(users.filter(u => u.id !== userIdToDelete));
                toast.success('User deleted successfully!'); // Display success toast
            } catch (error) {
                toast.error('Failed to delete user.'); // Display error toast
            }
            handleCloseDeleteModal();
        }
    };

    const handleUpdateUser = async () => {
        if (selectedUser) {
            try {
                const updatedUser = await apiService.update(`app/update/app`, { ...selectedUser, ...formData });
                setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));
                toast.success('User updated successfully!'); // Display success toast
            } catch (error) {
                toast.error('Failed to update user.'); // Display error toast
            }
            handleCloseEditModal();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="table-container">
            <Table striped bordered hover className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Site Name</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.site_name}</td>
                            <td>{new Date(user.created_at).toLocaleString()}</td>
                            <td>{user.app_status}</td>
                            <td>
                                <Button variant="info" onClick={() => handleViewUser(user)}>View</Button>
                                <Button variant="warning" className="ms-2" onClick={() => handleShowEditModal(user)}>Edit</Button>
                                <Button variant="danger" className="ms-2" onClick={() => handleShowDeleteModal(user.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* View User Modal */}
            {selectedUser && (
                <Modal show={showViewModal} onHide={handleCloseViewModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>View User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>ID:</strong> {selectedUser.id}</p>
                        <p><strong>Site Name:</strong> {selectedUser.site_name}</p>
                        <p><strong>Site URL:</strong> {selectedUser.site_url || 'N/A'}</p>
                        <p><strong>Created At:</strong> {new Date(selectedUser.created_at).toLocaleString()}</p>
                        <p><strong>Updated At:</strong> {new Date(selectedUser.updated_at).toLocaleString()}</p>
                        <p><strong>App Status:</strong> {selectedUser.app_status}</p>
                        <p><strong>Account Owner UUID:</strong> {selectedUser.account_owner_uuid}</p>
                        <p><strong>Installer Account UUID:</strong> {selectedUser.installer_account_uuid}</p>
                        <p><strong>API Endpoint:</strong> {selectedUser.api_endpoint}</p>
                        <p><strong>App Plan UUID:</strong> {selectedUser.app_plan_uuid}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseViewModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteUser}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit User Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formSiteName">
                            <Form.Label>Site Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="site_name"
                                value={formData.site_name || ''}
                                onChange={handleChange}
                                placeholder="Enter site name"
                            />
                        </Form.Group>
                        <Form.Group controlId="formSiteURL">
                            <Form.Label>Site URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="site_url"
                                value={formData.site_url || ''}
                                onChange={handleChange}
                                placeholder="Enter site URL"
                            />
                        </Form.Group>
                        <Form.Group controlId="formAppStatus">
                            <Form.Label>App Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="app_status"
                                value={formData.app_status || ''}
                                onChange={handleChange}
                            >
                                <option value="">Select status</option>
                                <option value="installed">Install</option>
                                <option value="uninstalled">Uninstall</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>Cancel</Button>
                    <Button variant="primary" onClick={handleUpdateUser}>Save</Button>
                </Modal.Footer>
            </Modal>

            {/* Toast Container for Notifications */}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default UserTable;
