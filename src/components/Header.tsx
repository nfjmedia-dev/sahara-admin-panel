import React, { useState } from 'react';
import { Nav, Navbar, Dropdown, Button } from 'react-bootstrap';
import OffCanvasMenu from './OffCanvasMenu'; // Assuming you already have OffCanvasMenu component

interface HeaderProps {
    username: string; // Prop to receive the username
    onLogout: () => void; // Prop to handle logout
}

const Header: React.FC<HeaderProps> = ({ username, onLogout }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Navbar bg="light" expand="lg" className="">
                <Navbar.Brand href="#home">
                    <img
                        src="./logo.png" // Replace with your logo path
                        alt="Logo"
                        width="100"
                        height="auto"
                        className="d-inline-block align-top ms-2"
                    />{' '}
                </Navbar.Brand>
                {/* The toggler will now handle showing the off-canvas */}
                {/* <Button variant="primary" onClick={handleShow} className="me-2">
                    ☰
                </Button> */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleShow} />
                
                {/* <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" />
                    <Nav>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                {username}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse> */}
            </Navbar>

            {/* Off-canvas menu component */}
            <OffCanvasMenu show={show} handleClose={handleClose} />
        </>
    );
};

export default Header;
