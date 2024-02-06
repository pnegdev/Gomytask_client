import React, { useEffect, useState } from 'react';
import { Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatDateFr, getPriorityColor } from '../../JS/Utils/Utils';

const DashTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('https://gmt-9b50b8a26041.herokuapp.com/projects/tasks', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                // Tri des tâches par date limite
                const sortedTasks = response.data.sort((a, b) => new Date(a.projectDeadline) - new Date(b.projectDeadline));

                setTasks(sortedTasks);
            } catch (error) {
                console.error('Erreur lors de la récupération des tâches :', error);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div className='mt-5'>
            <h4>Tâches à faire</h4>
            <Table responsive className="custom-table">
                <thead>
                    <tr>
                        <th>Tâches</th>
                        <th>Projets</th>
                        <th>Date limite</th>
                        <th>Priorité</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.slice(0, 10).map((task) => (
                        <tr key={task._id}>
                            <td>{task.taskName}</td>
                            <td>{task.projectName}</td>
                            <td>{formatDateFr(task.projectDeadline)}</td>
                            <td>
                                <Badge pill bg={getPriorityColor(task.projectPriority)}>
                                    {task.projectPriority}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="text-end">
                <Link to="/tasks" className='grey'>Voir toutes les tâches...</Link>
            </div>
        </div>
    );
};

export default DashTasks;
