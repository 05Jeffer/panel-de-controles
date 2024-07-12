import apiClient from "../config/apiclient";

// Define una interfaz para los datos actualizados
interface UpdatedAuthData {
  nombre?: string;
  email?: string;
  telefono?: string;
  pais?: string;
}

// Funciones de administrador

/**
 * Función para iniciar sesión
 * @param email - El email del usuario
 * @param password - La contraseña del usuario
 * @returns Los datos del usuario autenticado
 */
export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/login', { email, password });
  return response.data;
};

/**
 * Función para cerrar sesión
 * @param token - El token de autenticación
 * @returns Los datos de la respuesta de logout
 */
export const logout = async (token: string) => {
  const response = await apiClient.post('/logout', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Obtener datos de autenticación
 * @param token - El token de autenticación
 * @param authID - El ID del usuario autenticado
 * @returns Los datos del usuario autenticado
 */
export const getAuth = async (token: string, authID: number) => {
  const response = await apiClient.get(`/usuario/${authID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Editar datos de autenticación
 * @param token - El token de autenticación
 * @param authID - El ID del usuario autenticado
 * @param updatedData - Los datos actualizados del usuario
 * @returns Los datos actualizados del usuario
 */
export const editAuth = async (token: string, authID: number, updatedData: UpdatedAuthData) => {
  const response = await apiClient.put(`/editar/${authID}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Cambiar la contraseña del usuario
 * @param token - El token de autenticación
 * @param userId - El ID del usuario
 * @param contraseñaActual - La contraseña actual del usuario
 * @param nuevaContraseña - La nueva contraseña del usuario
 * @param verificarContraseña - La verificación de la nueva contraseña
 * @returns La respuesta de cambio de contraseña
 */
export const changePassword = async (token: string, userId: number, contraseñaActual: string, nuevaContraseña: string, verificarContraseña: string) => {
  const response = await apiClient.put(`/usuario/${userId}/cambiarPass`, {
    contraseñaActual,
    nuevaContraseña,
    verificarContraseña,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.data;
};

// Funciones para los usuarios que están en la aplicación

/**
 * Crear un nuevo usuario
 * @param newUser - El objeto que contiene los datos del nuevo usuario
 * @returns Los datos del usuario creado
 */
export const createUser = async (newUser: { nombre: string, email: string, telefono: string, password: string }) => {
  const response = await apiClient.post('/registro', newUser);
  return response.data;
};

/**
 * Obtener usuarios registrados en la aplicación
 * @param token - El token de autenticación
 * @returns La lista de usuarios registrados
 */
export const getUser = async (token: string) => {
  const response = await apiClient.get('/pos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Obtener usuario por ID
 * @param token - El token de autenticación
 * @param userID - El ID del usuario
 * @returns Los datos del usuario
 */
export const UserByID = async (token: string, userID: number) => {
  const response = await apiClient.get(`/pos/${userID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Eliminar usuario por ID
 * @param token - El token de autenticación
 * @param userID - El ID del usuario a eliminar
 * @returns La respuesta de la eliminación del usuario
 */
export const deleteUser = async (token: string, userID: number) => {
  const response = await apiClient.delete(`/pos/${userID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Alternar el estado del usuario (activar/desactivar)
 * @param token - El token de autenticación
 * @param userID - El ID del usuario
 * @returns La respuesta de la operación
 */
export const toggleUserStatus = async (token: string, userID: number) => {
  const response = await apiClient.put(`/pos/${userID}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Obtener usuarios suspendidos
 * @param token - El token de autenticación
 * @returns La lista de usuarios suspendidos
 */
export const getUserCero = async (token: string) => {
  const response = await apiClient.get('/deleted/pos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Obtener lista de paises
 * @returns La lista de paises
 */
export const getCountryList = async () => {
  try {
    const response = await apiClient.get('/listaPaises'); // Reemplaza '/listaPaises' con tu endpoint real
    return response.data;
  } catch (error) {
    console.error('Error fetching country list:', error);
    throw error;
  }
};