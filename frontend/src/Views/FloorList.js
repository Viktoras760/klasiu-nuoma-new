import React, {useEffect, useState} from "react";
import APIController from '../Controllers/APIController';
import { Navigate, useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {Spinner, Button, Alert, Row, Modal, Col} from 'react-bootstrap';

const FloorDetail = ({ floor, onDelete }) => {
  const { http, user } = APIController();
  const [isLoadingDelete, setLoadingDelete] = useState(false);
  const [isLoadingApprove, setLoadingApprove] = useState(false);
  const [school, setSchool] = useState("");
  const navigate = useNavigate();
  let { id1 } = useParams();
  

  useEffect(() => {
    fetchSchool();
  }, []);

  const fetchSchool= () => {

    http.get(`/schools/${id1}`).then((res) => {
      setSchool(res.data);
    });
    
  };

  const deleteFloor = () => {
      setLoadingDelete(true);
  }

  const Classes = () => {
    navigate(`/schools/${id1}/floors/${floor.id_Floor}/classrooms/`);
  }

  function submitDelete() {
      http.delete(`/schools/${id1}/floors/${floor.id_Floor}`).then((res) => {
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
                  <Modal.Title>Delete floor</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete floor Nr.{floor.Floor_number} from {school.Name}?</Modal.Body>
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

                      <p>Floor number: {floor.Floor_number}</p> 
                      <p>Floor class amount: {floor.Classroom_amount}</p>
                      <Button variant="primary" className="w-100 mb-2" disabled={isLoadingApprove} onClick={!isLoadingDelete ? Classes : null}>
                          {isLoadingApprove ? <><Spinner animation="border" size="sm" /> Fetching details…</> : 'Floor classes'}
                      </Button>
                      {user != null && (user.Role == "School Administrator" || user.Role == "System Administrator") ?(
                      <Button variant="danger" className="w-100" disabled={isLoadingDelete} onClick={!isLoadingDelete ? deleteFloor : null}>
                          {isLoadingDelete ? <><Spinner animation="border" size="sm" /> Deleting…</> : 'Delete'}
                      </Button>
                      ) : null}
                  </div>
              </div>
          </Col>
      </>
  );
}

function FloorList() {

  let { id1 } = useParams();
  const navigate = useNavigate();
  const { http, user } = APIController();
  const [Floors, setFloors] = useState('');
  const [successMessage, setSuccessMessage] = useState(sessionStorage.getItem('post-success'));

  useEffect(() => {
      fetchFloors();
  }, []);

  const fetchFloors= () => {

    http.get(`/schools/${id1}/floors`).then((res) => {
      setFloors(res.data);
    });
    
  };
  const editFloor= async(e, id) => {
      navigate(`/schools/${id1}/floors/${id}`);
  };

  const addFloor = () => {
    navigate(`/schools/${id1}/floor`);
  };

  const DeleteFloor= async(e, id) => {

      http.delete(`/schools/${id1}/floors/${id}`, {
          
      }).then((res) => {
          console.log(res.data);
          window.location.reload();
      }).catch((res) => {
          //alert(res.data);
          alert("Failed to remove floor");
          navigate(`/schools/${id1}/floors`);
      })  
      navigate(`/schools/${id1}/floors`);
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
        <h1 className="mb-4 mt-4">Floors</h1>
        <SuccessAlert message={successMessage} />
        {user != null && (user.Role == "School Administrator" || user.Role == "System Administrator") ?(
                <div className="flex items-center">
                    <Button variant="success" className="w-100" onClick={addFloor}>Add new floor
                    </Button>
                    
                </div>
                ) : null}
        <Row className="justify-content-center mt-3">
            {Floors ? Floors.map((floor, index) => {
                return (<FloorDetail floor={floor} onDelete={fetchFloors} key={index} />);
                }) : <div className="text-center">
                <Spinner animation="border" />
            </div>}
        </Row>
    </div>
  )
    
}

export default FloorList;