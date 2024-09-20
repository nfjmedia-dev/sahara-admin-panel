// src/components/HamburgerMenu.tsx
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import OffCanvasMenu from './OffCanvasMenu';

const HamburgerMenu: React.FC = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            {/* <Button variant="primary" onClick={handleShow} className="me-2">
                ☰
            </Button>
            <OffCanvasMenu show={show} handleClose={handleClose} /> */}
        </>
    );
};

export default HamburgerMenu;
