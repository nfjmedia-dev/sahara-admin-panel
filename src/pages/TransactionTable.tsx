// src/components/TransactionTable.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { apiService } from '../services/api';
import 'react-toastify/dist/ReactToastify.css';
import './TransactionTable.css';

interface Transaction {
    transaction_id: number;
    site_id: string | null;
    transaction_amount: number | null;
    transaction_date: string;
    transaction_status: string;
    created_at: string;
    updated_at: string;
    order_id: string;
    authorizationcode: string;
    creditcardnumber: string;
    amount: string;
    currency: string;
    orderhash: string;
    merchantid: string;
    buyername: string;
    buyeremail: string;
    refundid: string;
    step: string;
    cardtype: string;
    expdate: string;
}

const TransactionTable: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [transactionIdToDelete, setTransactionIdToDelete] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<Transaction>>({});

    useEffect(() => {
        const fetchTransactions = async () => {
            const data = await apiService.get('transactions'); // Adjust API endpoint as needed
            console.log("data*******",data)
            setTransactions(data);
        };
        fetchTransactions();
    }, []);

    const handleViewTransaction = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setShowViewModal(true);
    };

    const handleCloseViewModal = () => setShowViewModal(false);

    const handleShowDeleteModal = (transactionId: number) => {
        setTransactionIdToDelete(transactionId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const handleShowEditModal = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setFormData({ 
            amount: transaction.amount, 
            transaction_status: transaction.transaction_status 
        });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setFormData({});
    };

    const handleDeleteTransaction = async () => {
        if (transactionIdToDelete) {
            try {
                await apiService.delete(`transactions/${transactionIdToDelete}`); // Adjust endpoint as needed
                setTransactions(transactions.filter(t => t.transaction_id !== transactionIdToDelete));
                toast.success('Transaction deleted successfully!');
            } catch (error) {
                toast.error('Failed to delete transaction.');
            }
            handleCloseDeleteModal();
        }
    };

    const handleUpdateTransaction = async () => {
        if (selectedTransaction) {
            try {
                const updatedTransaction = await apiService.update(`transactions/${selectedTransaction.transaction_id}`, { ...selectedTransaction, ...formData });
                setTransactions(transactions.map(t => (t.transaction_id === updatedTransaction.transaction_id ? updatedTransaction : t)));
                toast.success('Transaction updated successfully!');
            } catch (error) {
                toast.error('Failed to update transaction.');
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
            <h1>Transactions</h1>
            <Table striped bordered hover className="transaction-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Order ID</th>
                        <th>Buyer Name</th>
                        <th>Buyer Email</th>
                        <th>Transaction Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction.transaction_id}>
                            <td>{transaction.transaction_id}</td>
                            <td>{transaction.order_id}</td>
                            <td>{transaction.buyername}</td>
                            <td>{transaction.buyeremail}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.transaction_status}</td>
                            <td>
                                <Button variant="info" onClick={() => handleViewTransaction(transaction)}>View</Button>
                                <Button variant="warning" className="ms-2" onClick={() => handleShowEditModal(transaction)}>Edit</Button>
                                <Button variant="danger" className="ms-2" onClick={() => handleShowDeleteModal(transaction.transaction_id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* View Transaction Modal */}
            {selectedTransaction && (
                <Modal show={showViewModal} onHide={handleCloseViewModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>View Transaction</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>ID:</strong> {selectedTransaction.transaction_id}</p>
                        <p><strong>Order ID:</strong> {selectedTransaction.order_id}</p>
                        <p><strong>Transaction Amount:</strong> {selectedTransaction.amount}</p>
                        <p><strong>Buyer Name:</strong> {selectedTransaction.buyername}</p>
                        <p><strong>Buyer Email:</strong> {selectedTransaction.buyeremail}</p>
                        <p><strong>Status:</strong> {selectedTransaction.transaction_status}</p>
                        <p><strong>Transaction Date:</strong> {new Date(selectedTransaction.transaction_date).toLocaleString()}</p>
                        <p><strong>Created At:</strong> {new Date(selectedTransaction.created_at).toLocaleString()}</p>
                        <p><strong>Updated At:</strong> {new Date(selectedTransaction.updated_at).toLocaleString()}</p>
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
                <Modal.Body>Are you sure you want to delete this transaction?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteTransaction}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Transaction Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTransactionAmount">
                            <Form.Label>Transaction Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="transaction_amount"
                                value={formData.amount || ''}
                                onChange={handleChange}
                                placeholder="Enter transaction amount"
                            />
                        </Form.Group>
                        <Form.Group controlId="formTransactionStatus">
                            <Form.Label>Transaction Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="transaction_status"
                                value={formData.transaction_status || ''}
                                onChange={handleChange}
                            >
                                <option value="">Select status</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                                <option value="Failed">Failed</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>Cancel</Button>
                    <Button variant="primary" onClick={handleUpdateTransaction}>Save</Button>
                </Modal.Footer>
            </Modal>

            {/* Toast Container for Notifications */}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default TransactionTable;
