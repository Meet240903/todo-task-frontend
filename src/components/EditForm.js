import { faEdit, faRefresh, faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import FadeComponent from './FadeComponent';
import { BASE_URL } from '../services/helper';

const EditForm = () => {
    const [taskname, setTaskName] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [timeToComplete, setTimeToComplete] = useState('');
    const [task_status, setTaskStatus] = useState('pending');
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch task details
    const fetchTaskDetails = async () => {
        const res = await fetch(`${BASE_URL}/get-task/${id}`);
        const data = await res.json();
        setTaskName(data.taskname || '');
        setTaskDesc(data.taskDesc || '');
        setStartDate(data.startDate ? formatDate(data.startDate) : '');
        setEndDate(data.endDate ? formatDate(data.endDate) : '');
        setTimeToComplete(data.timeToComplete || '');
        setTaskStatus(data.task_status || 'pending');
    };

    useEffect(() => {
        fetchTaskDetails();
    }, [id]);

    // Calculate total hours between start and end dates
    const calculateTotalHours = (start, end) => {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        const hoursDifference = Math.round((endTime - startTime) / (1000 * 60 * 60)); // Convert milliseconds to hours
        return hoursDifference > 0 ? hoursDifference : 0;
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    // Update timeToComplete whenever startDate or endDate changes
    useEffect(() => {
        if (startDate && endDate) {
            const totalHours = calculateTotalHours(startDate, endDate);
            setTimeToComplete(`${totalHours} hours`);
        }
    }, [startDate, endDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskData = { taskname, taskDesc, startDate, endDate, timeToComplete, task_status };
        console.log("Submitting task data:", taskData); // Log data before sending

        try {
            const res = await fetch(`${BASE_URL}/edit-task/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(taskData)
            });

            const text = await res.text();

            try {
                const data = JSON.parse(text);
                if (res.ok) {
                    navigate('/');
                    alert("Task updated successfully!");
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
        fetchTaskDetails(); // Reset to fetched data
    };

    return (
        <div className='my-4'>
            <div className='container text-capitalize'>
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
                <FadeComponent duration={1000} delay={500} direction={'down'}>
                    <div className='my-4'>
                        <h4 className='text-center text-secondary'><FontAwesomeIcon icon={faEdit} /> EDIT TASK</h4>
                    </div>
                </FadeComponent>
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
                                        value={task_status}
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

export default EditForm;
