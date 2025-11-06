import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { Form, Button, Card, Row, Col, Modal } from 'react-bootstrap';
import config from '../../config/config';
import './TDSForm.css';

const TDSForm = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        financialYear: '',
        your_email: ''
    });

    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [responseId, setResponseId] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.username) newErrors.username = 'Username is required';
        if (!form.password) newErrors.password = 'Password is required';
        if (!form.financialYear) newErrors.financialYear = 'Financial Year is required';
        if (!form.your_email) newErrors.your_email = 'Your Email ID is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            // Prepare form data
            const formData = new FormData();
            formData.append('username', form.username);
            formData.append('password', form.password);
            formData.append('financialYear', form.financialYear);
            formData.append('your_email', form.your_email);

            try {
                const response = await fetch(`${config.baseURL.main}${config.api.tds.execute}/`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Form submitted:', result);
                    setResponseId(result.automationReqIdTDS);
                    setShowModal(true);
                } else {
                    console.error('Failed to submit form:', response.statusText);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <>
            <Navbar showLogoutButton={true} showGstAndTdsButton={true}/>
            <br />
            <div className="container mt-5">
                <Card className="form-container">
                    <Card.Header>Download 26AS TDS File</Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="formUsername">
                                        <Form.Label className="form-label">Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            value={form.username}
                                            onChange={handleChange}
                                            isInvalid={!!errors.username}
                                            className="form-control"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.username}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formPassword">
                                        <Form.Label className="form-label">Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            isInvalid={!!errors.password}
                                            className="form-control"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>

                                    <Form.Group controlId="formFinancialYear">
                                        <Form.Label className="form-label">Financial Year</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="financialYear"
                                            value={form.financialYear}
                                            onChange={handleChange}
                                            isInvalid={!!errors.financialYear}
                                            className="form-control"
                                        >
                                            <option value="">Choose...</option>
                                            <option value="2020-21">2020-21</option>
                                            <option value="2021-22">2021-22</option>
                                            <option value="2022-23">2022-23</option>
                                            <option value="2023-24">2023-24</option>
                                            <option value="2024-25">2024-25</option>
                                            <option value="2025-26">2025-26</option>

                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.financialYear}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="formYourEmail">
                                        <Form.Label className="form-label">Your Email</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="your_email"
                                            value={form.your_email}
                                            onChange={handleChange}
                                            isInvalid={!!errors.your_email}
                                            className="form-control"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.your_email}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                </Col>
                            </Row>
                            <Button variant="primary" type="submit" className="mt-3 btn btn-primary btn-sm">
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Your TDS 26AS file will be downloaded with request ID : {responseId}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TDSForm;
