import { useEffect, useState } from 'react';
import APIController from '../Controllers/APIController';

import {Spinner} from 'react-bootstrap';

export default function Dashboard() {
    const { http } = APIController();
    const [userdetail, setUserdetail] = useState('');

    useEffect(() => {
        fetchUserDetail();
    }, []);

    const fetchUserDetail = () => {
        http.post('/auth/user').then((res) => {
            setUserdetail(res.data);
        });
    }

    function renderElement() {
        if (userdetail) {
            return <div>
                <h4>Name</h4>
                <p>{userdetail.Name}</p>
                <h4>Email</h4>
                <p>{userdetail.email}</p>
                <h4>Grade</h4>
                <p>{userdetail.Grade}</p>
                <h4>Role</h4>
                <p>{userdetail.Role}</p>
            </div>
        } else {
            return (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            );
        }

    }

    return (
        <div>
            <h1 className="mb-4 mt-4">Dashboard page</h1>
            {renderElement()}
            <footer>
                <div class="footer">
                    <div class="row py-4">
                        <div class="col-lg-4 col-md-6 mb-lg-0">
                            <h6 class="text-uppercase font-weight-bold mb-4">Class rent</h6>
                            <p class="text-muted mb-4">Project made for schools</p>
                        </div>
                    </div>
                    <div class="container text-center">
                        <p class="text-muted mb-0 py-2">© All rights belong to IFF-9/7 group student Viktoras Dechtiar.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}