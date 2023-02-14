import React, {useEffect, useState} from "react";
import APIController from '../Controllers/APIController';
import { Navigate, useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {Spinner, Button, Row, Col, Alert, Modal} from 'react-bootstrap';

function SchoolList() {

    const navigate = useNavigate();
    const { http } = APIController();
    const [Schools, setSchools] = useState('');

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools= () => {

        console.log("fetching");
        http.get('/schools/').then((res) => {
            setSchools(res.data);
        });
        

    };
    const editSchool= async(e, id) => {
        navigate(`/schools/${id}`);
    };

    const addSchool= () => {
        navigate(`/school`);
    };

    const DeleteSchool= async(e, id) => {


        http.delete(`/schools/${id}`, {
            
        }).then((res) => {
            console.log(res.data);
            window.location.reload();
        }).catch((res) => {
            //alert(res.data);
            alert("Failed to remove school");
            navigate(`/schools/`);
        })  
        navigate(`/schools/`);
    };

    return (
        <div>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h4>Schools</h4>
                  </div>
                  <div className="card-body">
                        <button
                            className="btn btn-success"
                            onClick={() => addSchool()}
                            >
                            Add new school
                        </button>
                    </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Adress</th>
                        <th scope="col">Pupil amount</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(Schools).map(([key, val]) => (
                        <tr key={val.id_School}>
                          <th scope="row">{val.Name}</th>
                          <th scope="row">{val.Adress}</th>
                          <th scope="row">{val.Pupil_amount}</th>
                          <td>
                            <button
                              className="btn btn-success"
                              onClick={(e) => editSchool(e, val.id_School)}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-warning"
                              onClick={(e) => DeleteSchool(e, val.id_School)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
    
}

export default SchoolList;