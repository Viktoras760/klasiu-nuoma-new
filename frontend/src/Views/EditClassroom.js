import { useEffect, useState } from 'react';
import APIController from '../Controllers/APIController';
import {Spinner, Button, Row, Col, Card, Form, Alert} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditClassroom() {
    const { http } = APIController();
    const navigate = useNavigate();

    const { id1, id2, id3 } = useParams();

    const [number, setNumber] = useState();
    const [pupil_capacity, setPupil_capacity] = useState();
    const [musical_equipment, setMusical_equipment] = useState();
    const [chemistry_equipment, setChemistry_equipment] = useState();
    const [computers, setComputers] = useState();

    const [isLoading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState();

    useEffect(() => {
        fetchClassroomDetails();
    }, []);

    const fetchClassroomDetails = () => {
        http.get(`schools/${id1}/floors/${id2}/classrooms/${id3}`).then((res) => {
            setNumber(res.data.Number);
            setPupil_capacity(res.data.Pupil_capacity);
            setMusical_equipment(res.data.Musical_equipment);
            setChemistry_equipment(res.data.Chemistry_equipment);
            setComputers(res.data.Computers);
            
        }).catch(() => {
            navigate(-1);
        });
    }


    const updateClassroom = () => {
        setLoading(true);
        http.put(`schools/${id1}/floors/${id2}/classrooms/${id3}`, { Number: number, Pupil_capacity: pupil_capacity, Musical_equipment: musical_equipment, Chemistry_equipment: chemistry_equipment, Computers: computers}).then((res) => {
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

    if (number || pupil_capacity ) {
        return (
            <Row className="justify-content-center pt-5">
                <Col>
                    <Card className="p-4">
                        <h1 className="text-center mb-3">Edit classroom</h1>
                        <ErrorAlert message={errorMessage} />
                        <Form.Group className="mb-3" controlId="formBasicNumber">
                            <Form.Label>Number</Form.Label>
                            <Form.Control type="number" placeholder="Enter number" value={number} onChange={e => setNumber(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPupil_capacity">
                            <Form.Label>Pupil capacity</Form.Label>
                            <Form.Control type="number" placeholder="Enter pupil capacity" value={pupil_capacity} onChange={e => setPupil_capacity(e.target.value)} />
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
                        <Button variant="primary" type="submit" disabled={isLoading} onClick={!isLoading ? updateClassroom : null}>
                            {isLoading ? <><Spinner animation="border" size="sm" /> Loading…</> : 'Edit'}
                        </Button>
                    </Card>
                </Col>
            </Row>
        )
    } else {
        return (
            <Row className="justify-content-center pt-5">
                <Spinner animation="border" />
            </Row>
        )
    }
}