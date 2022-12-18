import React, {useEffect, useState} from "react";
import APIController from '../Controllers/APIController';
import { Navigate, useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {Spinner, Button, Alert, Row, Modal, Col} from 'react-bootstrap';

const ClassroomDetail = ({ classroom, onDelete }) => {
  const { http, user } = APIController();
  const [isLoadingDelete, setLoadingDelete] = useState(false);
  const [isLoadingApprove, setLoadingApprove] = useState(false);
  const [school, setSchool] = useState("");
  const navigate = useNavigate();
  let { id1, id2 } = useParams();
  

  useEffect(() => {
    fetchSchool();
  }, []);

  const fetchSchool= () => {

    http.get(`/schools/${id1}`).then((res) => {
      setSchool(res.data);
    });
    
  };

  const deleteClassroom = () => {
      setLoadingDelete(true);
  }

  const Lessons = () => {
    navigate(`/schools/${id1}/floors/${id2}/classrooms/${classroom.id_Classroom}/lessons`);
  }

  const editClassroom= async() => {
    navigate(`/schools/${id1}/floors/${id2}/classroom_edit/${classroom.id_Classroom}`);
};


  function submitDelete() {
      http.delete(`/schools/${id1}/floors/${id2}/classrooms/${classroom.id_Classroom}`).then((res) => {
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

  const pStyle = {
    fontFamily: 'Playfair Display'
  };

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
                  <Modal.Title>Delete classroom</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete classroom Nr.{classroom.Number}?</Modal.Body>
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
          <Col sm={10}>
              <div className="card mb-3">
                  <div className="card-body">

                      <p style={{color:'#1B3D6C', margin: 20, fontSize: 20, fontFamily: 'Playfair Display'}}>Classroom number: {classroom.Number}</p> 
                      <p style={{color:'#1B3D6C', margin: 20, fontSize: 20, fontFamily: 'Playfair Display'}}>Classroom pupil capacity: {classroom.Pupil_capacity}</p>
                      <Button variant="primary" className="w-100 mb-2" disabled={isLoadingApprove} onClick={!isLoadingDelete ? Lessons : null}>
                          {isLoadingApprove ? <><Spinner animation="border" size="sm" /> Fetching details…</> : 'Classroom lessons'}
                      </Button>

                      {user != null && (user.Role == "School Administrator" || user.Role == "System Administrator" ) ?(
                      <Button variant="success" className="w-100 mb-2"  onClick={!isLoadingDelete ? editClassroom : null}>
                          {isLoadingDelete ? <><Spinner animation="border" size="sm" /> Fetching details…</> : 'Edit'}
                      </Button>
                      ) : null}
                      
                      {user != null && (user.Role == "School Administrator" || user.Role == "System Administrator" ) ?(
                      <Button variant="danger" className="w-100 mb-2" disabled={isLoadingDelete} onClick={!isLoadingDelete ? deleteClassroom : null}>
                          {isLoadingDelete ? <><Spinner animation="border" size="sm" /> Deleting…</> : 'Delete'}
                      </Button>
                      ) : null}
                  </div>
              </div>
          </Col>
      </>
  );
}

function ClassroomList() {

  let { id1, id2 } = useParams();
  const navigate = useNavigate();
  const { http, user } = APIController();
  const [Floors, setFloors] = useState('');
  const [Classrooms, setClassrooms] = useState('');
  const [successMessage, setSuccessMessage] = useState(sessionStorage.getItem('post-success'));

  useEffect(() => {
      fetchClassrooms();
  }, []);

  const fetchClassrooms= () => {

    http.get(`/schools/${id1}/floors/${id2}/classrooms`).then((res) => {
      setClassrooms(res.data);
    });
    
  };

  const addClassroom = () => {
    navigate(`/schools/${id1}/floors/${id2}/classroom/`);
  };

  const DeleteClassroom= async(e, id) => {

      http.delete(`/schools/${id1}/floors/${id2}/classroom/${id}`, {
          
      }).then((res) => {
          console.log(res.data);
          window.location.reload();
      }).catch((res) => {
          //alert(res.data);
          alert("Failed to remove classroom");
          navigate(`/schools/${id1}/floors/${id2}/classrooms`);
      })  
      navigate(`/schools/${id1}/floors/${id2}/classrooms`);
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
        <h1 className="mb-4 mt-4">Classrooms</h1>
        <SuccessAlert message={successMessage} />
        {user != null && (user.Role == "School Administrator" || user.Role == "System Administrator") ?(
                <div className="flex items-center">
                    <Button variant="success" className="w-100" onClick={addClassroom}>Add new classroom
                    </Button>
                    
                </div>
                ) : null}
        <Row className="justify-content-center mt-3">
            {Classrooms ? Classrooms.map((classroom, index) => {
                return (<ClassroomDetail classroom={classroom} onDelete={fetchClassrooms} key={index} />);
                }) : <div className="text-center">
                <Spinner animation="border" />
            </div>}
        </Row>
    </div>
  )
    
}

export default ClassroomList;