import { useState } from 'react';
import APIController from '../Controllers/APIController';
import {Spinner, Button, Row, Col, Card, Form, Alert} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddClassroom() {
    const { http } = APIController();
    const navigate = useNavigate();
    let { id1, id2, id3 } = useParams();

    const [lessons_name, setLessons_name] = useState();
    const [lessons_starting_time, setLessons_starting_time] = useState();
    const [lessons_ending_time, setLessons_ending_time] = useState();
    const [lower_grade_limit, setLower_grade_limit] = useState();
    const [upper_grade_limit, setUpper_grade_limit] = useState();

    const [isLoading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState();


    const addLesson = () => {
        setLoading(true);
        http.post(`/schools/${id1}/floors/${id2}/classrooms/${id3}/lessons`, { Lessons_name: lessons_name, Lessons_starting_time: lessons_starting_time, Lessons_ending_time: lessons_ending_time, Lower_grade_limit: lower_grade_limit, Upper_grade_limit: upper_grade_limit }).then((res) => {
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
                    <h1 className="text-center mb-3">Add new lesson</h1>
                    <ErrorAlert message={errorMessage} />
                    <Form.Group className="mb-3" controlId="formBasicLessonName">
                        <Form.Label>Lesson name</Form.Label>
                        <Form.Control type="text" placeholder="Enter lessons name"  onChange={e => setLessons_name(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicLessonStartingTime">
                        <Form.Label>Lesson starting time</Form.Label>
                        <Form.Control type="datetime-local" placeholder="Enter lesson starting time"  onChange={e => setLessons_starting_time(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicLessonEndingTime">
                        <Form.Label>Lesson ending time</Form.Label>
                        <Form.Control type="datetime-local" placeholder="Enter lesson ending time"  onChange={e => setLessons_ending_time(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicLessonLowerGradeLimit">
                        <Form.Label>Lesson lower grade limit</Form.Label>
                        <Form.Control type="number" placeholder="Enter lesson lower grade limit"  onChange={e => setLower_grade_limit(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicLessonUpperGradeLimit">
                        <Form.Label>Lesson upper grade limit</Form.Label>
                        <Form.Control type="number" placeholder="Enter lesson upper grade limit"  onChange={e => setUpper_grade_limit(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isLoading} onClick={!isLoading ? addLesson : null}>
                        {isLoading ? <><Spinner animation="border" size="sm" /> Loading…</> : 'Add'}
                    </Button>
                </Card>
            </Col>
        </Row>
    )

}