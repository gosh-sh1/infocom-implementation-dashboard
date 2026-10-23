import './App.css'

function App() {
  const team = [
    { name: 'Георгий', role: 'Team Lead' },
    { name: 'Роман', role: 'Backend / QA / DevOps' },
    { name: 'Павел', role: 'Frontend' },
  ]

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>infocom-implementation-dashboard</h1>
      <h2>Панель управления внедрением ИС</h2>

      <h3>Команда проекта:</h3>
      <ul>
        {team.map((member, index) => (
          <li key={index}>
            <b>{member.name}</b> — {member.role}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App