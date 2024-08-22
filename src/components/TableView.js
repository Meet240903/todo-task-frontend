import React, { useEffect, useState } from 'react';
import { Table, OverlayTrigger, Tooltip, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEdit, faEye, faPlus, faTasks, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import FadeComponent from './FadeComponent';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { BASE_URL } from '../services/helper';

const TableView = () => {
    const [tasksData, settasksData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;

    const tableHeader = [
        { title: "Sr.No.", value: 1 },
        { title: "Task Name", value: 2 },
        { title: "Start Date", value: 3 },
        { title: "End Date", value: 4 },
        { title: "Time to Complete", value: 5 },
        { title: "Task Status", value: 6 },
        { title: "Action", value: 7 },
    ];

    const getTasks = async () => {
        try {
            const res = await fetch(`${BASE_URL}/get-tasks`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const json = await res.json();
            settasksData(json);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTasks();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                const res = await fetch(`${BASE_URL}/delete-task/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (res.ok) {
                    alert('Task deleted successfully!');
                    // Refresh the page after deletion
                    window.location.reload();
                } else {
                    const errorData = await res.json();
                    alert("Error: " + errorData.message);
                }
            } catch (error) {
                console.error("Fetch error: ", error);
                alert("An unexpected error occurred.");
            }
        }
    };

    const handleDeleteAllTasks = async () => {
        if (window.confirm("Are you sure you want to delete all tasks?")) {
            try {
                const res = await fetch(`${BASE_URL}/delete-all-tasks`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (res.ok) {
                    alert('Tasks deleted successfully!');
                    // Refresh the page after deletion
                    window.location.reload();
                } else {
                    const errorData = await res.json();
                    alert("Error: " + errorData.message);
                }
            } catch (error) {
                console.error("Fetch error: ", error);
                alert("An unexpected error occurred.");
            }
        }
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = tasksData.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(tasksData.length / recordsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Function to format the date
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    return (
        <div className='container my-4'>
            <div className='my-4'>
                <FadeComponent duration={1000} delay={500} direction={'down'}>
                    <h4 className='text-center text-secondary'><FontAwesomeIcon icon={faTasks} /> ALL TASKS</h4>
                </FadeComponent>
            </div>
            {
                tasksData.length > 0 && (
                    <div className='text-end'>
                        <FadeComponent duration={1000} delay={500} direction={'left'}>
                            <button className='btn btn-danger' onClick={handleDeleteAllTasks}>Delete All Tasks</button>
                        </FadeComponent>
                    </div>
                )
            }
            <div className='my-2'>
                <FadeComponent duration={1000} delay={500} direction={'right'}>
                    <Table className='data-table' responsive="sm">
                        <thead>
                            <tr>
                                {
                                    tableHeader?.map((data) => (
                                        <th key={data?.value}>{data?.title}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentRecords?.map((data, index) => (
                                    <tr key={data?._id}>
                                        <td>{indexOfFirstRecord + index + 1}</td>
                                        <td>{data?.taskname}</td>
                                        <td>{formatDate(data?.startDate)}</td>
                                        <td>{formatDate(data?.endDate)}</td>
                                        <td>{data?.timeToComplete}</td>
                                        <td>
                                            {
                                                 data?.task_status !== 'completed' && <p className='text-danger fw-bold'>{data?.task_status}</p>
                                            }
                                            {
                                               data?.task_status === 'completed' && <FontAwesomeIcon icon={faCheckCircle} style={{color:'green'}} />
                                            }
                                        </td>
                                        <td>
                                            <div className='d-flex justify-content-between'>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id={`tooltip-view-${data._id}`}>View Task</Tooltip>}
                                                >
                                                    <Link to={`/user-details/${data?._id}`} className='btn btn-success mx-2'>
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </Link>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id={`tooltip-edit-${data._id}`}>Edit Task</Tooltip>}
                                                >
                                                    <Link to={`/edit/${data?._id}`} className='btn btn-primary mx-2'>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Link>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id={`tooltip-delete-${data._id}`}>Delete Task</Tooltip>}
                                                >
                                                    <button onClick={() => handleDelete(data?._id)} className='btn btn-danger mx-2'>
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>
                                                </OverlayTrigger>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                            {
                                tasksData.length <= 0 && (
                                    <tr>
                                        <td colSpan={7} className='text-center'>No rows found</td>
                                    </tr>
                                )
                            }
                            <tr>
                                <td colSpan={7} style={{ backgroundColor: 'aliceblue' }}>
                                    <Link to='/register' className='add-data-link'>
                                        <FontAwesomeIcon icon={faPlus} /> Add New Task
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <div className='d-flex justify-content-center'>
                        <Pagination>
                            <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </div>
                </FadeComponent>
            </div>
        </div>
    );
};

export default TableView;
