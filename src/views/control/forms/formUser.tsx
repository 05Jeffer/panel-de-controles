import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';

interface FormData {
    nombre: string;
    email: string;
    telefono: string;
    pais: string; // Asegúrate de que pais esté tipado correctamente como string
    nombreNegocio: string;
    password: string;
}

const NewUserForm: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        email: '',
        telefono: '',
        pais: '', // Asegúrate de inicializar pais como string vacío
        nombreNegocio: '',
        password: '',
    });
    const { countries, createUser } = useAuth();

    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await createUser(formData);

            Swal.fire({
                icon: 'success',
                title: 'Usuario creado exitosamente',
                showConfirmButton: false,
                timer: 2000,
            });

            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                pais: '', // Asegúrate de limpiar pais después de enviar el formulario
                nombreNegocio: '',
                password: '',
            });
            setShowModal(false);
        } catch (error) {
            console.error('Error al crear el usuario:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error al crear usuario',
                text: 'Por favor, intenta nuevamente más tarde.',
            });
        }
    };

    return (
        <div>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200"
                onClick={() => setShowModal(true)}
            >
                Crear Usuario
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                            onClick={() => setShowModal(false)}
                        >
                            &times;
                        </button>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className="text-2xl font-bold text-center mb-4">Registro de Usuario</h2>
                            <div className="flex flex-col">
                                <label htmlFor="nombre" className="mb-1">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email" className="mb-1">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="telefono" className="mb-1">Teléfono:</label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="pais" className="mb-1">País:</label>
                                <select
                                    id="pais"
                                    name="pais"
                                    value={formData.pais}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value="">Selecciona un país</option>
                                    {countries && Array.isArray(countries) && countries.map((country, index) => (
                                        <option key={index} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="nombreNegocio" className="mb-1">Nombre del negocio:</label>
                                <input
                                    type="text"
                                    id="nombreNegocio"
                                    name="nombreNegocio"
                                    value={formData.nombreNegocio}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="password" className="mb-1">Contraseña:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white rounded py-2 hover:bg-green-700 transition duration-200"
                            >
                                Registrar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewUserForm;
