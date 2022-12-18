import { useState } from "react"
import APIController from '../Controllers/APIController';

import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';

export default function Register() {
    const { http } = APIController();
    const [name, setName] = useState();
    const [surname, setSurname] = useState();
    const [personal_code, setPersonalCode] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const [isLoading, setLoading] = useState(false);


    const submitForm = () => {
        setLoading(true);
        http.post('/auth/users', { email: email, password: password, Name: name, Surname: surname, Personal_code: personal_code}).then((res) => {
            alert(res.data.success);
            setName('');
            setSurname('');
            setPersonalCode('');
            setEmail('');
            setPassword('');
        }).catch((error) => {
            if(error.response.data.error != null) {
                alert(error.response.data.error);
            } else if (error.response.data.errors != null) {
                var errors = error.response.data.errors;
                var all_errors = [];
                Object.keys(errors).map((err) => (
                    all_errors.push(errors[err][0])
                ))
                alert(all_errors.join("\n"));
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <Row className="justify-content-center pt-5">
            <Col sm={6}>
                <Card className="p-4">
                    <h1 className="text-center mb-3">Register</h1>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" onChange={e => setName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicSurname">
                        <Form.Label>Surname</Form.Label>
                        <Form.Control type="text" placeholder="Enter surname" onChange={e => setSurname(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPersonalcode">
                        <Form.Label>Personal code</Form.Label>
                        <Form.Control type="number" placeholder="Enter personal code" onChange={e => setPersonalCode(e.target.value)} />
                    </Form.Group>   

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isLoading} onClick={!isLoading ? submitForm : null}>{isLoading ? <><Spinner animation="border" size="sm" /> Loading…</> : 'Register'}</Button>
                </Card>
            </Col>
        </Row>
    )
}