import React, { useState, useEffect, useMemo, useCallback } from 'react';

function App() {
  const [tech, setTech] = useState([
    'ReactJS',
    'React Native'
  ])
  const [newTech, setNewTech] = useState('');

  useEffect(()=>{
    const localTech = localStorage.getItem('tech');

    if(localTech){
      setTech(JSON.parse(localTech));
    }
  }, []);

  useEffect(()=> {
    localStorage.setItem('tech', JSON.stringify(tech));
  }, [tech]);

  const techSize = useMemo(()=> tech.length, [tech])

  const handleAdd = useCallback(() => {
    setTech([...tech, newTech])
    setNewTech('')
  }, [tech, newTech]);

  return (
    <>
      <ul>
        {tech.map(t => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <strong>Você tem  {techSize} tecnologias</strong>
      <input type="text" value={newTech} onChange={e => setNewTech(e.target.value)}/>
      <button type='button' onClick={handleAdd}>Adicionar</button>
    </>
  );
}

export default App;
