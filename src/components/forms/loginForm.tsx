import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();
 


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    
    if (!email || !password) {
      return;
    }
  
    try {
      await login(email, password);
      Swal.fire({
        title: '¡Inicio de sesión exitoso!',
        text: 'Serás redirigido al panel de control.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
      navigate('/panelcontrol', { replace: true });
    } catch {
      Swal.fire({
        title: 'Error al iniciar sesion',
        text: 'Usuario o contraseña incorrectos.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };

  return (
    
    <div className="flex flex-col justify-center items-center  bg-white rounded-lg shadow-lg p-8 md:p-20">
    <h1 className="text-4xl font-bold text-center text-gray-600 mb-8 md:mb-12">Iniciar Sesion</h1>
    <p className="text-gray-500 dark:text-gray-400 text-center md:text-left">Ingresa tus credenciales para acceder a tu cuenta.</p>
    <br />
    <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4 md:space-y-6">
      <div className="relative flex items-center border rounded-lg overflow-hidden md:w-full">
        <div className="px-4 py-3 bg-gray-100">
          <FaUser className="text-gray-500" />
        </div>
        <input
          type="email"
          id="email"
          className="w-full px-4 py-3 text-gray-900 focus:outline-none placeholder:text-gray-500"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="relative flex items-center border rounded-lg overflow-hidden md:w-full">
        <div className="px-4 py-3 bg-gray-100">
          <FaLock className="text-gray-500" />
        </div>
        <input
          type="password"
          id="password"
          className="w-full px-4 py-3 text-gray-900 focus:outline-none placeholder:text-gray-500"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200"
      >
        Iniciar Sesion
      </button>
    </form>
  </div>
);
};

export default LoginForm;