import { faRefresh, faReply, faTasks } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import FadeComponent from './FadeComponent';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../services/helper';

const Register = () => {
    const [taskname, setTaskName] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); // Current date by default
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [timeToComplete, setTimeToComplete] = useState('');
    const [taskStatus, setTaskStatus] = useState('pending'); // Default status
    const navigate = useNavigate();

    // Function to calculate total hours between start and end dates
    const calculateTotalHours = (start, end) => {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        const hoursDifference = Math.round((endTime - startTime) / (1000 * 60 * 60)); // Convert milliseconds to hours
        return hoursDifference > 0 ? hoursDifference : 0;
    };

    // Update timeToComplete whenever startDate or endDate changes
    useEffect(() => {
        const totalHours = calculateTotalHours(startDate, endDate);
        setTimeToComplete(`${totalHours} hours`);
    }, [startDate, endDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/add-task`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ taskname, taskDesc, startDate, endDate, timeToComplete, task_status: taskStatus })
            });

            const text = await res.text();

            try {
                const data = JSON.parse(text);
                if (res.ok) {
                    navigate('/');
                    alert("Data submitted successfully!");
                } else {
                    alert("Error: " + data.message);
                }
            } catch (jsonError) {
                console.error("Failed to parse JSON:", jsonError);
                alert("Unexpected response format.");
            }
        } catch (error) {
            console.error("Fetch error: ", error);
            alert("An unexpected error occurred.");
        }
    };

    const handleRefresh = () => {
        setTaskName('');
        setTaskDesc('');
        setStartDate(new Date().toISOString().split('T')[0]); // Reset to current date
        setEndDate(new Date().toISOString().split('T')[0]); // Reset to current date
        setTimeToComplete('');
        setTaskStatus('pending'); // Reset to default status
    };

    return (
        <div className='my-4'>
            <div className='container text-capitalize'>
                <FadeComponent duration={1000} delay={500} direction={'down'}>
                    <div className='my-4'>
                        <h4 className='text-center text-secondary'><FontAwesomeIcon icon={faTasks} /> ADD TASK FORM</h4>
                    </div>
                </FadeComponent>
                <div className='text-end'>
                    <FadeComponent duration={1000} delay={250} direction={'up'}>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id='tooltip-back-home'>Back to Home</Tooltip>}
                        >
                            <Link to='/'>
                                <FontAwesomeIcon className='fa-edit-detail mx-2' icon={faReply} />
                            </Link>
                        </OverlayTrigger>
                    </FadeComponent>
                </div>
                <Form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='col-md-6 my-3'>
                            <FadeComponent duration={1000} delay={500} direction={'right'}>
                                <Form.Group className="mb-3" controlId="formTaskName">
                                    <Form.Label>Task Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={taskname}
                                        onChange={(e) => setTaskName(e.target.value)}
                                    />
                                </Form.Group>
                            </FadeComponent>
                        </div>
                        <div className='col-md-6 my-3'>
                            <FadeComponent duration={1000} delay={500} direction={'left'}>
                                <Form.Group className="mb-3" controlId="formTaskDesc">
                                    <Form.Label>Task Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={taskDesc}
                                        onChange={(e) => setTaskDesc(e.target.value)}
                                    />
                                </Form.Group>
                            </FadeComponent>
                        </div>
                        <div className='col-md-6 my-3'>
                            <FadeComponent duration={1000} delay={500} direction={'right'}>
                                <Form.Group className="mb-3" controlId="formStartDate">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </Form.Group>
                            </FadeComponent>
                        </div>
                        <div className='col-md-6 my-3'>
                            <FadeComponent duration={1000} delay={500} direction={'left'}>
                                <Form.Group className="mb-3" controlId="formEndDate">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </Form.Group>
                            </FadeComponent>
                        </div>
                        <div className='col-md-6 my-3'>
                            <FadeComponent duration={1000} delay={500} direction={'right'}>
                                <Form.Group className="mb-3" controlId="formTimeToComplete">
                                    <Form.Label>Time to Complete</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={timeToComplete}
                                        onChange={(e) => setTimeToComplete(e.target.value)}
                                        placeholder="e.g., 3 hours"
                                    />
                                </Form.Group>
                            </FadeComponent>
                        </div>
                        <div className='col-md-6 my-3'>
                            <FadeComponent duration={1000} delay={500} direction={'left'}>
                                <Form.Group className="mb-3" controlId="formTaskStatus">
                                    <Form.Label>Task Status</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={taskStatus}
                                        onChange={(e) => setTaskStatus(e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </Form.Control>
                                </Form.Group>
                            </FadeComponent>
                        </div>
                    </div>
                    <div className='text-center'>
                        <FadeComponent duration={1000} delay={500} direction={'right'}>
                            <button className='btn btn-primary col-md-2' type='submit'>Submit</button>
                        </FadeComponent>
                    </div>
                    <div className='my-3 text-end'>
                        <FadeComponent duration={1000} delay={500} direction={'left'}>
                            <button type='button' className='btn btn-success' onClick={handleRefresh}>
                                <FontAwesomeIcon icon={faRefresh} className='mx-2' />Refresh
                            </button>
                        </FadeComponent>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Register;
