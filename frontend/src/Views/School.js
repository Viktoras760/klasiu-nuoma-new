import { useEffect, useState } from 'react';
import APIController from '../Controllers/APIController';
import {Spinner, Button, Row, Col, Card, Form, Alert} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditSchool() {
    const { http } = APIController();
    const navigate = useNavigate();

    const { id } = useParams();

    const [name, setName] = useState();
    const [adress, setAdress] = useState();
    const [pupil_amount, setPupil_amount] = useState();
    const [teacher_amount, setTeacher_amount] = useState();

    const [isLoading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState();

    useEffect(() => {
        fetchSchoolDetails();
    }, []);

    const fetchSchoolDetails = () => {
        http.get(`/schools/${id}`).then((res) => {
            setName(res.data.Name);
            setAdress(res.data.Adress);
            setPupil_amount(res.data.Pupil_amount);
            setTeacher_amount(res.data.Teacher_amount);
        }).catch(() => {
            navigate('/schools/');
        });
    }

    const updateSchool = () => {
        setLoading(true);
        http.put(`/schools/${id}`, { Name: name, Adress: adress, Pupil_amount: pupil_amount, Teacher_amount: teacher_amount }).then((res) => {
            sessionStorage.setItem('post-success', res.data.success);
            navigate('/schools');
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

    if (name || adress || pupil_amount || teacher_amount) {
        return (
            <Row className="justify-content-center pt-5">
                <Col>
                    <Card className="p-4">
                        <h1 className="text-center mb-3">Edit school</h1>
                        <ErrorAlert message={errorMessage} />
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicAdress">
                            <Form.Label>Adress</Form.Label>
                            <Form.Control type="text" placeholder="Enter adress" value={adress} onChange={e => setAdress(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPupilAmount">
                            <Form.Label>Pupil amount</Form.Label>
                            <Form.Control type="number" placeholder="Enter pupil amount" value={pupil_amount} onChange={e => setPupil_amount(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPupilAmount">
                            <Form.Label>Teacher amount</Form.Label>
                            <Form.Control type="number" placeholder="Enter teacher amount" value={teacher_amount} onChange={e => setTeacher_amount(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={isLoading} onClick={!isLoading ? updateSchool : null}>
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