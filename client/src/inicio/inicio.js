import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa los estilos CSS de react-calendar
import './inicio.css'; // Importa los estilos CSS personalizados

const WelcomeView = () => {
  // Estado para almacenar la información del perfil del vendedor
  const [perfil, setPerfil] = useState({
    nombre: ''
  });

  // Función para manejar cambios en la configuración del perfil
  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setPerfil({ ...perfil, [name]: value });
  };

  // Estado para almacenar la fecha seleccionada en el calendario
  const [date, setDate] = useState(new Date());

  // Función para manejar cambios en la fecha seleccionada
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div>
      {/* Bienvenido */}
      <div className="welcome-container">
        <h2>Bienvenido{perfil.nombre}</h2> {/* Muestra el nombre del usuario */}
      </div>
      
      {/* Panel de Control */}
      <div className="panel-container">
        <h2>Panel de Control</h2>
        <div className="content">
          <p>Ventas realizadas: 100</p>
          <p>Objetivos alcanzados: 90%</p>
          <p>Clientes atendidos: 50</p>
          {/* Puedes agregar más métricas según las necesidades */}
        </div>
      </div>
      
      {/* Programación de Citas */}
      <div className="schedule-container">
        <h2>Programación de Citas</h2>
        <p>Organiza y gestiona tus citas de manera eficiente.</p>
        <button>Programar Cita</button>
      </div>
      
      {/* Calendario */}
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={date}
          className="react-calendar"
        />
      </div>
    </div>
  );
};

export default WelcomeView;