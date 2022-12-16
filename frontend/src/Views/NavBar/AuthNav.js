import { Routes, Route } from 'react-router-dom';
import Home from '../Home';
import Dashboard from '../Dashboard';
import LessonList from '../UserLessons';
import SchoolList from '../Schools';
import EditSchool from '../School';
import AddSchool from '../AddSchool';
import APIController from '../../Controllers/APIController';
import {Navbar, Nav, Container} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { useEffect, useState } from "react";

function Auth() {
    const { token, logout } = APIController();
    const { http } = APIController();
    const [userdetail, setUserdetail] = useState("");
    const logoutUser = () => {
        if (token !== undefined) {
            logout();
        }
    }

    useEffect(() => {
        fetchUserDetail();
    }, []);

    const fetchUserDetail = () => {
    http.post("/auth/user").then((res) => {
        setUserdetail(res.data);
    });
    };
    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>React-Bootstrap</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <LinkContainer to="/">
                                <Nav.Link>Home</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/dashboard">
                                <Nav.Link>Dashboard</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/lessons">
                                <Nav.Link>Lessons</Nav.Link>
                            </LinkContainer>
                            {userdetail.Role == "System Administrator" ? <>
                            <LinkContainer to="/schools">
                                <Nav.Link>Schools</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/users">
                                <Nav.Link>Users</Nav.Link>
                            </LinkContainer></> : ""}
                            <Nav.Link onClick={logoutUser}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/lessons" element={<LessonList />} />
                    <Route path="/schools" element={<SchoolList />} />
                    <Route path="/schools/:id" element={<EditSchool />} />
                    <Route path="/school" element={<AddSchool />} />
                </Routes>
            </Container>
        </>
    );
}

export default Auth;