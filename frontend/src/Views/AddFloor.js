import { useState } from 'react';
import APIController from '../Controllers/APIController';
import {Spinner, Button, Row, Col, Card, Form, Alert} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddFloor() {
    const { http } = APIController();
    const navigate = useNavigate();
    let { id1 } = useParams();

    const [floor_number, setFloor_number] = useState();
    const [classroom_amount, setClassroom_amount] = useState();
    const [sport_equipment, setSport_equipment] = useState();

    const [isLoading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState();


    const addFloor = () => {
        setLoading(true);
        http.post(`/schools/${id1}/floors`, { Floor_number: floor_number, Classroom_amount: classroom_amount, Sport_equipment: sport_equipment }).then((res) => {
            sessionStorage.setItem('post-success', res.data.success);
            navigate(-1);
        }).catch((error) => {
            if(error.response.data.error != null) {
                setErrorMessage(error.response.data.error);
            } else if (error.response.data.errors != null) {
                var errors = error.response.data.errors;
                var all_errors = [];
                Object.keys(errors).map((err) => (
                    all_errors.push(errors[err][0])
                ))
                setErrorMessage(all_errors.join("\n"));
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    function ErrorAlert({message}) {
        const [show, setShow] = useState(message ? true : false);

        if (show) {
            return (
                <Alert variant="danger" onClose={() => setShow(false)} dismissible className="mt-3">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>
                        {message}
                    </p>
                </Alert>
            );
        }
        return (<></>);
    }

    return (
        <Row className="justify-content-center pt-5">
            <Col>
                <Card className="p-4">
                    <h1 className="text-center mb-3">Add new floor</h1>
                    <ErrorAlert message={errorMessage} />
                    <Form.Group className="mb-3" controlId="formBasicFloorNumber">
                        <Form.Label>Floor number</Form.Label>
                        <Form.Control type="number" placeholder="Enter floor number"  onChange={e => setFloor_number(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicAdress">
                        <Form.Label>Classroom amount</Form.Label>
                        <Form.Control type="number" placeholder="Enter classroom amount"  onChange={e => setClassroom_amount(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicConfirmation">
                            <Form.Label>Sport equipment</Form.Label>
                            <Form.Select className="mb-3" defaultValue={sport_equipment} onChange={e => setSport_equipment(e.target.value)}>
                                <option value={sport_equipment} >{sport_equipment}</option>
                                <option value="1" >Yes</option>
                                <option value="2" >No</option>
                            </Form.Select>
                        </Form.Group>
                    <Button variant="primary" type="submit" disabled={isLoading} onClick={!isLoading ? addFloor : null}>
                        {isLoading ? <><Spinner animation="border" size="sm" /> Loading…</> : 'Add'}
                    </Button>
                </Card>
            </Col>
        </Row>
    )

}