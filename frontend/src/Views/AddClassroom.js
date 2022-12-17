import { useState } from 'react';
import APIController from '../Controllers/APIController';
import {Spinner, Button, Row, Col, Card, Form, Alert} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddClassroom() {
    const { http } = APIController();
    const navigate = useNavigate();
    let { id1, id2 } = useParams();

    const [number, setNumber] = useState();
    const [pupil_capacity, setPupil_capacity] = useState();
    const [musical_equipment, setMusical_equipment] = useState();
    const [chemistry_equipment, setChemistry_equipment] = useState();
    const [computers, setComputers] = useState();

    const [isLoading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState();


    const addClassroom = () => {
        setLoading(true);
        http.post(`/schools/${id1}/floors/${id2}/classrooms`, { Number: number, Pupil_capacity: pupil_capacity, Musical_equipment: musical_equipment, Chemistry_equipment: chemistry_equipment, Computers: computers }).then((res) => {
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
                    <h1 className="text-center mb-3">Add new classroom</h1>
                    <ErrorAlert message={errorMessage} />
                    <Form.Group className="mb-3" controlId="formBasicFloorNumber">
                        <Form.Label>Classroom number</Form.Label>
                        <Form.Control type="number" placeholder="Enter classroom number"  onChange={e => setNumber(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPupilCapacity">
                        <Form.Label>Pupil capacity amount</Form.Label>
                        <Form.Control type="number" placeholder="Enter pupil capacity"  onChange={e => setPupil_capacity(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicMusicalEquipment">
                            <Form.Label>Musical equipment</Form.Label>
                            <Form.Select className="mb-3" defaultValue={musical_equipment} onChange={e => setMusical_equipment(e.target.value)}>
                                <option value={musical_equipment} >{musical_equipment}</option>
                                <option value="1" >Yes</option>
                                <option value="2" >No</option>
                            </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicChemistryEquipment">
                            <Form.Label>Chemical equipment</Form.Label>
                            <Form.Select className="mb-3" defaultValue={chemistry_equipment} onChange={e => setChemistry_equipment(e.target.value)}>
                                <option value={chemistry_equipment} >{chemistry_equipment}</option>
                                <option value="1" >Yes</option>
                                <option value="2" >No</option>
                            </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicComputers">
                            <Form.Label>Computers</Form.Label>
                            <Form.Select className="mb-3" defaultValue={computers} onChange={e => setComputers(e.target.value)}>
                                <option value={computers} >{computers}</option>
                                <option value="1" >Yes</option>
                                <option value="2" >No</option>
                            </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isLoading} onClick={!isLoading ? addClassroom : null}>
                        {isLoading ? <><Spinner animation="border" size="sm" /> Loading…</> : 'Add'}
                    </Button>
                </Card>
            </Col>
        </Row>
    )

}