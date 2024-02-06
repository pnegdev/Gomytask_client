export const getStatusColor = (status) => {
    switch (status) {
        case 'A faire':
            return 'primary';
        case 'En cours':
            return 'warning';
        case 'Terminé':
            return 'success';
        default:
            return 'primary';
    }
};

export const getPriorityColor = (priority) => {
    switch (priority) {
        case 'Faible':
            return 'info';
        case 'Moyenne':
            return 'secondary';
        case 'Haute':
            return 'danger';
        default:
            return 'secondary';
    }
};

export const formatDateFr = (dateString) => {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export const calculateProgress = (project) => {
    if (!project || !project.tasks || !project.tasksValidation) {
        return 0;
    }
    const totalTasks = project.tasks.length;
    const completedTasks = Object.values(project.tasksValidation).filter(Boolean).length;
    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
};