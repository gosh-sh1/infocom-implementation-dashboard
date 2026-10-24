import './App.css';
import { useState } from 'react';

const mockProjects = [
  { id: 1, name: 'Внедрение CRM для отдела продаж', status: 'Active' },
  { id: 2, name: 'Модернизация 1С Бухгалтерия', status: 'Active' },
  { id: 3, name: 'Разработка портала для сотрудников', status: 'Blocked' },
];

const team = [
  { name: 'Георгий', role: 'Team Lead' },
  { name: 'Роман', role: 'Backend / QA / DevOps' },
  { name: 'Павел', role: 'Frontend' },
];

const API_URL = 'http://localhost:8000/api/tasks';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects] = useState(mockProjects);
  const [tasks, setTasks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [taskTitle, setTaskTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [deadline, setDeadline] = useState('');
  const [taskStatus, setTaskStatus] = useState('To Do');
  const [projectId, setProjectId] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'В сроке':
      case 'Active':
      case 'Done':
        return '#4CAF50';
      case 'Есть риски':
      case 'At Risk':
      case 'In Progress':
        return '#FFC107';
      case 'Блокер':
      case 'Blocked':
      case 'Blocker':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Active': return 'В сроке';
      case 'Blocked':
      case 'Blocker': return 'Блокер';
      case 'At Risk': return 'Есть риски';
      case 'To Do': return 'Новая';
      case 'In Progress': return 'В работе';
      case 'Done': return 'Выполнена';
      default: return status;
    }
  };

  const resetForm = () => {
    setTaskTitle('');
    setAssignee('');
    setDeadline('');
    setTaskStatus('To Do');
    setProjectId('');
  };

  const closeModal = () => {
    if (isSubmitting) return;
    resetForm();
    setIsModalOpen(false);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!taskTitle.trim() || !projectId || !assignee) {
      alert('Заполните название задачи, выберите проект и исполнителя.');
      return;
    }

    const newTask = {
      title: taskTitle.trim(),
      project_id: Number(projectId),
      status: taskStatus,
      deadline: deadline || null,
      assignee: assignee,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      const responseText = await response.text();
      let result = {};

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          throw new Error('Сервер вернул некорректный ответ. Проверьте работу бэкенда.');
        }
      }

      if (!response.ok) {
        const detail = result.detail;
        const message = typeof detail === 'string'
          ? detail
          : detail
            ? JSON.stringify(detail)
            : `Ошибка сервера: ${response.status}`;
        throw new Error(message);
      }

      const createdTask = {
        id: result.task_id ?? result.id ?? Date.now(),
        title: taskTitle.trim(),
        assignee,
        status: taskStatus,
        projectId: Number(projectId),
        deadline,
      };

      setTasks((prev) => [...prev, createdTask]);
      resetForm();
      setIsModalOpen(false);

      if (taskStatus === 'Blocker') {
        alert('Задача-блокер создана. Если это предусмотрено бэкендом, статус проекта будет обновлён.');
      } else {
        alert('Задача успешно создана!');
      }
    } catch (error) {
      console.error('Ошибка создания задачи:', error);
      if (error instanceof TypeError) {
        alert('Не удалось подключиться к серверу. Проверьте, запущен ли бэкенд на localhost:8000 и настроен ли CORS.');
      } else {
        alert(`Не удалось создать задачу: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        wordBreak: 'break-word', // <-- Это исправляет наложение длинных слов
      }}
    >
      {/* Исправлен заголовок: уменьшен размер и добавлен перенос */}
      <h1 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '10px' }}>
        infocom-implementation-dashboard
      </h1>
      <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'normal', marginTop: 0 }}>
        Панель управления внедрением ИС
      </h2>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h3 style={{ marginBottom: '10px' }}>Команда проекта:</h3>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {team.map((member) => (
            <li key={member.name}>
              <b>{member.name}</b> — {member.role}
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '20px',
          marginTop: '40px',
          borderBottom: '1px solid #444',
          paddingBottom: '15px'
        }}
      >
        <h2 style={{ margin: 0, fontSize: '22px' }}>
          Дашборд проектов внедрения
        </h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '10px 20px',
            background: '#1976D2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          + Создать задачу
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              borderLeft: `8px solid ${getStatusColor(project.status)}`,
            }}
          >
            <h3 style={{ margin: 0, fontSize: '18px' }}>{project.name}</h3>
            <span style={{ color: getStatusColor(project.status), fontWeight: 'bold' }}>
              {getStatusLabel(project.status)}
            </span>
          </div>
        ))}
      </div>

      {tasks.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Созданные задачи:</h3>
          <ul style={{ paddingLeft: '20px' }}>
            {tasks.map((task) => (
              <li key={task.id} style={{ marginBottom: '15px' }}>
                <b>{task.title}</b>
                {' — исполнитель: '} {task.assignee || 'Не назначен'}
                {' — статус: '} {getStatusLabel(task.status)}
                {task.deadline && ` — дедлайн: ${task.deadline}`}
                {' — проект ID: '} {task.projectId}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isModalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '15px',
            zIndex: 1000,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              padding: '25px',
              borderRadius: '10px',
              width: '100%',
              maxWidth: '420px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxSizing: 'border-box',
              color: 'black',
            }}
          >
            <h2 id="task-modal-title" style={{ marginTop: 0 }}>
              Создание задачи
            </h2>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="text"
                placeholder="Название задачи"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                maxLength={200}
                disabled={isSubmitting}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />

              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                disabled={isSubmitting}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Выберите проект</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>

              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                required
                disabled={isSubmitting}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Выберите исполнителя</option>
                <option value="Шальнев Георгий">Шальнев Георгий</option>
                <option value="Стрелков Роман">Стрелков Роман</option>
                <option value="Захаров Павел">Захаров Павел</option>
              </select>

              <label>
                Дедлайн:
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  disabled={isSubmitting}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: '5px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </label>

              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                disabled={isSubmitting}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="To Do">Новая (To Do)</option>
                <option value="In Progress">В работе (In Progress)</option>
                <option value="Done">Выполнена (Done)</option>
                <option value="Blocker">Блокер (Blocker)</option>
              </select>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    background: isSubmitting ? '#999' : '#4CAF50',
                    color: 'white',
                    padding: '10px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isSubmitting ? 'wait' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'Создание...' : 'Создать'}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    background: '#f44336',
                    color: 'white',
                    padding: '10px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;