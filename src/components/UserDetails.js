import { faEdit, faTrashAlt, faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FadeComponent from './FadeComponent';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BASE_URL } from '../services/helper';

const TaskDetails = () => {
  const [task, setTask] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const getTask = async () => {
    try {
      const res = await fetch(`${BASE_URL}/get-task/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await res.json();
      setTask(json);
    } catch (error) {
      console.error('Fetch error: ', error);
    }
  };

  useEffect(() => {
    getTask();
  }, [id]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const res = await fetch(`${BASE_URL}/delete-task/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          alert('Task deleted successfully!');
          navigate('/tasks'); // Redirect to tasks list after deletion
        } else {
          const errorData = await res.json();
          alert('Error: ' + errorData.message);
        }
      } catch (error) {
        console.error('Fetch error: ', error);
        alert('An unexpected error occurred.');
      }
    }
  };

  return (
    <>
      <div className='container my-4'>
        <FadeComponent duration={1000} delay={500} direction={'right'}>
          <h1 className='text-capitalize'>Task Details</h1>
        </FadeComponent>
      </div>
      <div className='container'>
        <div className='col-md-6 detail-main'>
          <div className='col-md-12 detail-inner'>
            <div className='text-end'>
              <FadeComponent duration={1000} delay={250} direction={'down'}>
                <OverlayTrigger
                  placement='top'
                  overlay={<Tooltip id={`tooltip-edit-${task._id}`}>Edit Task</Tooltip>}
                >
                  <Link to={`/edit/${task._id}`} className='btn btn-primary mx-2'>
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                </OverlayTrigger>
                <OverlayTrigger
                  placement='top'
                  overlay={<Tooltip id={`tooltip-delete-${task._id}`}>Delete Task</Tooltip>}
                >
                  <button onClick={() => handleDelete(task._id)} className='btn btn-danger mx-2'>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </OverlayTrigger>
              </FadeComponent>
            </div>
            <div>
              <FadeComponent duration={1000} delay={300} direction={'right'}>
                <div className='fs-5 d-flex'>
                  <p className='fw-bold'>Task Name:</p>
                  <p className='px-2 text-capitalize'>{task.taskname}</p>
                </div>
                <div className='fs-5 d-flex'>
                  <p className='fw-bold'>Start Date:</p>
                  <p className='px-2'>{new Date(task.startDate).toLocaleDateString()}</p>
                </div>
                <div className='fs-5 d-flex'>
                  <p className='fw-bold'>End Date:</p>
                  <p className='px-2'>{new Date(task.endDate).toLocaleDateString()}</p>
                </div>
                <div className='fs-5 d-flex'>
                  <p className='fw-bold'>Time to Complete:</p>
                  <p className='px-2'>{task.timeToComplete}</p>
                </div>
                <div className='fs-5 d-flex'>
                  <p className='fw-bold'>Task Status:</p>
                  <p className='px-2'>{task.task_status}</p>
                </div>
                <div className='d-flex'>
                  <p className='fw-bold'>Description:</p>
                  <p className='px-2'>{task.taskDesc}</p>
                </div>
              </FadeComponent>
            </div>
            <div className='text-end'>
              <FadeComponent duration={1000} delay={250} direction={'up'}>
                <OverlayTrigger
                  placement='top'
                  overlay={<Tooltip id='tooltip-back-tasks'>Back to Home</Tooltip>}
                >
                  <Link to='/'>
                    <FontAwesomeIcon className='fa-edit-detail mx-2' icon={faReply} />
                  </Link>
                </OverlayTrigger>
              </FadeComponent>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetails;
