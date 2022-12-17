import React, {useEffect, useState} from "react";
import APIController from '../Controllers/APIController';
import { Navigate, useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {Spinner, Button, Alert, Row, Modal, Col} from 'react-bootstrap';

const LessonDetail = ({ lesson, onDelete }) => {
  const { http, user } = APIController();
  const [isLoadingDelete, setLoadingDelete] = useState(false);
  const [isLoadingApprove, setLoadingApprove] = useState(false);
  const navigate = useNavigate();
  let { id1, id2, id3 } = useParams();

  const deleteLesson = () => {
      setLoadingDelete(true);
  }

  const editLesson= async() => {
    navigate(`/schools/${id1}/floors/${id2}/classrooms/${id3}/edit_lesson/${lesson.id_Lesson}`);
};

const Register= async() => {
    http.post(`/schools/${id1}/floors/${id2}/classrooms/${id3}/lessons/${lesson.id_Lesson}`).then((res) => {
        alert(res.data.success);
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
    });
}



  function submitDelete() {
      http.delete(`/schools/${id1}/floors/${id2}/classrooms/${id3}/lessons/${lesson.id_Lesson}`).then((res) => {
          alert(res.data.success);
          onDelete();
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
          setLoadingDelete(false); 
      });
  }

  function DeleteApproval({message}) {
      const [show, setShow] = useState(message);

      const handleSubmit = () => {
          setShow(false);
          submitDelete();
      }
    
      const handleClose = () => {
          setShow(false);
          setLoadingDelete(false);
      }
    
      return (
          <>
              <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                  <Modal.Title>Delete lesson</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete lesson {lesson.Lessons_name}?</Modal.Body>
              <Modal.Footer>
                  <Button variant="danger" onClick={handleSubmit}>
                      Delete
                  </Button>
                  <Button variant="secondary" onClick={handleClose}>
                      Cancel
                  </Button>
              </Modal.Footer>
              </Modal>
          </>
      );
  }

  return (
      <>
      <DeleteApproval message={isLoadingDelete} />
          <Col sm={6}>
              <div className="card mb-3">
                  <div className="card-body">
                      <p>Lessons name: {lesson.Lessons_name}</p> 
                      <p>Lessons starting time: {lesson.Lessons_starting_time}</p>
                      <p>Lessons ending time: {lesson.Lessons_ending_time}</p>
                      <p>Lessons lower grade limit: {lesson.Lower_grade_limit}</p>
                      <p>Lessons upper grade limit: {lesson.Upper_grade_limit}</p>
                      <Button variant="primary" className="w-100 mb-2" disabled={isLoadingApprove} onClick={!isLoadingDelete ? Register : null}>
                          {isLoadingApprove ? <><Spinner animation="border" size="sm" /> Registering…</> : 'Register to lesson'}
                      </Button>

                      {user != null && (user.Role == "School Administrator" || user.Role == "System Administrator" || (user.Role == "Teacher" && user.id_User == lesson.creator_id)) ?(
                      <Button variant="success" className="w-100 mb-2"  onClick={!isLoadingDelete ? editLesson : null}>
                          {isLoadingDelete ? <><Spinner animation="border" size="sm" /> Fetching details…</> : 'Edit'}
                      </Button>
                      ) : null}
                      
                      {user != null && (user.Role == "School Administrator" || user.Role == "System Administrator" || (user.Role == "Teacher" && user.id_User == lesson.creator_id)) ?(
                      <Button variant="danger" className="w-100 mb-2" disabled={isLoadingDelete} onClick={!isLoadingDelete ? deleteLesson : null}>
                          {isLoadingDelete ? <><Spinner animation="border" size="sm" /> Deleting…</> : 'Delete'}
                      </Button>
                      ) : null}
                  </div>
              </div>
          </Col>
      </>
  );
}

function LessonList() {

  let { id1, id2, id3 } = useParams();
  const navigate = useNavigate();
  const { http, user } = APIController();
  const [Lessons, setLessons] = useState('');
  const [successMessage, setSuccessMessage] = useState(sessionStorage.getItem('post-success'));

  useEffect(() => {
      fetchLessons();
  }, []);

  const fetchLessons= () => {

    http.get(`/schools/${id1}/floors/${id2}/classrooms/${id3}/lessons`).then((res) => {
      setLessons(res.data);
      console.log(res.data);
    });
    
  };

  const addLesson = () => {
    navigate(`/schools/${id1}/floors/${id2}/classrooms/${id3}/lesson`);
  };

  const DeleteLesson= async(e, id) => {

      http.delete(`/schools/${id1}/floors/${id2}/classroom/${id3}/lessons/${id}`, {
          
      }).then((res) => {
          console.log(res.data);
          window.location.reload();
      }).catch((res) => {
          //alert(res.data);
          alert("Failed to remove lesson");
          navigate(`/schools/${id1}/floors/${id2}/classrooms/${id3}/lessons`);
      })  
      navigate(`/schools/${id1}/floors/${id2}/classrooms/${id3}/lessons`);
  };

  function SuccessAlert({message}) {
    const [show, setShow] = useState(message ? true : false);

    if (show) {
        //sessionStorage.removeItem('post-success');
        return (
            <Alert variant="success" onClose={() => {setShow(false); setSuccessMessage(); }} dismissible className="mt-3">
                <Alert.Heading>Success</Alert.Heading>
                <p>
                    {message}
                </p>
            </Alert>
        );
    }
    return (<></>);
}

  return (
    <div>
        <h1 className="mb-4 mt-4">Lessons</h1>
        <SuccessAlert message={successMessage} />
        {user != null && (user.Role == "School Administrator" || user.Role == "System Administrator" || user.Role == "Teacher") ?(
                <div class="flex items-center">
                    <Button variant="success" className="w-100" onClick={addLesson}>Add new lesson
                    </Button>
                    
                </div>
                ) : null}
        <Row className="justify-content-center mt-3">
            {Lessons ? Lessons.map((lesson, index) => {
                return (<LessonDetail lesson={lesson} onDelete={fetchLessons} key={index} />);
                }) : <div className="text-center">
                <Spinner animation="border" />
            </div>}
        </Row>
    </div>
  )
    
}

export default LessonList;