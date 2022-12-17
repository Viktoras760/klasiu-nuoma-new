import React, {useEffect, useState} from "react";
import APIController from '../Controllers/APIController';
import { Navigate, useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {Spinner, Button, Row, Col, Alert, Modal} from 'react-bootstrap';

function UserList() {

    const navigate = useNavigate();
    const { http } = APIController();
    const [Users, setUsers] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers= () => {

        console.log("fetching");
        http.get('/users/').then((res) => {
            console.log(res);
            setUsers(res.data);
            console.log(res.data)
        });
        

    };
    const editUser= async(e, id) => {
        navigate(`/user/${id}`);
    };

    const DeleteUser= async(e, id) => {


        http.delete(`/users/${id}`, {
            
        }).then((res) => {
            console.log(res.data);
            window.location.reload();
        }).catch((res) => {
            //alert(res.data);
            alert("Failed to remove user");
            navigate(`/users/`);
        })  
        navigate(`/users/`);
    };

    return (
        <div>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h4>Users</h4>
                  </div>
                  <div className="card-body">
                    </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Surname</th>
                        <th scope="col">Email</th>
                        <th scope="col">Grade</th>
                        <th scope="col">Role</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(Users).map(([key, val]) => (
                        <tr key={val.id_User}>
                          <th scope="row">{val.Name}</th>
                          <th scope="row">{val.Surname}</th>
                          <th scope="row">{val.email}</th>
                          <th scope="row">{val.Grade}</th>
                          <th scope="row">{val.Role}</th>
                          <td>
                            <button
                              className="btn btn-success"
                              onClick={(e) => editUser(e, val.id_User)}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-warning"
                              onClick={(e) => DeleteUser(e, val.id_User)}
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

export default UserList;