import { useState } from 'react';
import './App.css';

const mockProjects = [
  { id: 1, name: 'Внедрение CRM для отдела продаж', status: 'В сроке' },
  { id: 2, name: 'Модернизация 1С Бухгалтерия', status: 'Есть риски' },
  { id: 3, name: 'Разработка портала для сотрудников', status: 'Блокер' },
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects] = useState(mockProjects); 
  const [taskTitle, setTaskTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [deadline, setDeadline] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'В сроке': return '#4CAF50';
      case 'Есть риски': return '#FFC107';
      case 'Блокер': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    console.log("Отправка задачи:", { taskTitle, assignee, deadline });
    alert(`Задача "${taskTitle}" создана!`);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, whiteSpace: 'nowrap', fontSize: '28px' }}>Дашборд проектов внедрения</h1>
        <button onClick={() => setIsModalOpen(true)} style={{ padding: '10px 20px', background: '#1976D2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
          + Создать задачу
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {projects.map((project) => (
          <div key={project.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `8px solid ${getStatusColor(project.status)}` }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>{project.name}</h3>
            <span style={{ color: getStatusColor(project.status), fontWeight: 'bold' }}>{project.status}</span>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '10px', width: '400px', color: 'black' }}>
            <h2 style={{ marginTop: 0 }}>Создание задачи</h2>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Название задачи" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required style={{ padding: '10px' }} />
              <select value={assignee} onChange={(e) => setAssignee(e.target.value)} required style={{ padding: '10px' }}>
                <option value="">Выберите исполнителя</option>
                <option value="user1">Шальнев Георгий</option>
                <option value="user2">Стрелков Роман</option>
                <option value="user3">Захаров Павел</option>
              </select>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ padding: '10px' }} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#4CAF50', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Создать</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: '#f44336', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;