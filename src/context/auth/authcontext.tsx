// Define una interfaz para los datos actualizados
interface UpdatedAuthData {
  nombre?: string;
  email?: string;
  telefono?: string;
  pais?: string;
}

import { createContext, useState, useEffect, ReactNode, FC } from 'react';
import Cookies from 'js-cookie';
import {
  login as loginService,
  logout as logoutService,
  getUser as getUserService,
  getUserCero as getUserCeroService,
  UserByID,
  deleteUser as deleteUserService,
  getAuth as getAuthService,
  editAuth as editAuthService,
  changePassword as changePasswordService,
  toggleUserStatus as toggleUserStatusService
} from '../../api/auth/authapi';

// Interfaces para los tipos de datos usados en el contexto
interface Auth {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  pais: string;
  token: string;
}

interface User {
  id: number;
  nombre: string;
  propietario: string;
  estado: boolean;
}

interface UserCero extends User {}

// Definición del tipo de contexto
export interface AuthContextType {
  user: User[] | null;
  setUser: React.Dispatch<React.SetStateAction<User[] | null>>;
  userCero: UserCero[] | null;
  setUserCero: React.Dispatch<React.SetStateAction<UserCero[] | null>>;
  auth: Auth | null;
  authID: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserByID: (userID: number) => Promise<void>;
  deleteUserById: (userID: number) => Promise<void>;
  editAuthByID: (updatedData: UpdatedAuthData) => Promise<void>;
  toggleUserStatusById: (userID: number) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
}

// Creación del contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Proveedor de contexto
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [user, setUser] = useState<User[] | null>(null);
  const [userCero, setUserCero] = useState<UserCero[] | null>(null);
  const [authID, setAuthID] = useState<number | null>(null);

  /**
   * Función para iniciar sesión
   * @param email - El email del usuario
   * @param password - La contraseña del usuario
   */
  const login = async (email: string, password: string) => {
    try {
      const data = await loginService(email, password);
      Cookies.set('authToken', data.token, { expires: 7 });
      console.log('Token saved:', Cookies.get('authToken'));

      // Guardar el authID en el estado
      setAuthID(data.usuario_id);

      // Obtener datos del usuario después del login
      const userData = await getUserService(data.token);
      console.log('User data fetched after login:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  /**
   * Función para cerrar sesión
   */
  const logout = async () => {
    const token = Cookies.get('authToken');
    if (token) {
      await logoutService(token);
      Cookies.remove('authToken');
      setUser(null);
      setAuth(null);
      setAuthID(null);
    }
  };

  /**
   * Función para obtener datos de autenticación
   * @param authID - El ID del usuario autenticado
   */
  const fetchAuth = async (authID: number) => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        const authData = await getAuthService(token, authID);
        console.log('Auth fetched:', authData);
        setAuth(authData);
      } catch (error) {
        console.error('Error fetching auth:', error);
        Cookies.remove('authToken');
      }
    }
  };

  // Efecto para obtener los datos de autenticación cuando cambia authID
  useEffect(() => {
    if (authID !== null) {
      fetchAuth(authID);
    }
  }, [authID]);

  // Efecto para obtener los datos de autenticación y usuarios al cargar el componente
  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      const storedAuthID = Cookies.get('authID');
      if (storedAuthID) {
        setAuthID(Number(storedAuthID));
        fetchAuth(Number(storedAuthID));
        fetchUser();
      }
    }
  }, []);

  // Efecto para almacenar authID en cookies o eliminarlo cuando cambia
  useEffect(() => {
    if (authID !== null) {
      Cookies.set('authID', authID.toString());
      fetchAuth(authID);
    } else {
      Cookies.remove('authID');
    }
  }, [authID]);

  /**
   * Función para editar datos de autenticación
   * @param updatedData - Los datos actualizados del usuario
   */
  const editAuthByID = async (updatedData: UpdatedAuthData) => {
    const token = Cookies.get('authToken');
    if (token && authID !== null) {
      try {
        const updatedAuth = await editAuthService(token, authID, updatedData);
        console.log('Auth updated:', updatedAuth);
        setAuth(updatedAuth); // Actualizar el estado con los datos modificados
      } catch (error) {
        console.error('Error updating auth:', error);
      }
    }
  };

  /**
   * Función para cambiar la contraseña del usuario
   * @param currentPassword - La contraseña actual
   * @param newPassword - La nueva contraseña
   * @param confirmPassword - La verificación de la nueva contraseña
   */
  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    const token = Cookies.get('authToken');
    if (token && authID !== null) {
      try {
        const response = await changePasswordService(token, authID, currentPassword, newPassword, confirmPassword);
        console.log('Password changed successfully');
        return response;
      } catch (error) {
        console.error('Error changing password:', error);
      }
    }
  };

  // Funciones para los usuarios que están en la aplicación

  /**
   * Función para obtener usuario por ID
   * @param userID - El ID del usuario
   */
  const fetchUserByID = async (userID: number) => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        const user = await UserByID(token, userID);
        console.log('User fetched by ID:', user);
      } catch (error) {
        console.error('Error fetching user by ID:', error);
      }
    }
  };

  /**
   * Función para eliminar usuario por ID
   * @param userID - El ID del usuario a eliminar
   */
  const deleteUserById = async (userID: number) => {
    const token = Cookies.get('authToken');
    if (!token) {
      console.error('No token found');
      return Promise.reject('No token found');
    }

    try {
      await deleteUserService(token, userID);
      setUser((prevUser) => prevUser?.filter((user) => user.id !== userID) || null);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  /**
   * Función para obtener usuarios registrados en la aplicación
   */
  const fetchUser = async () => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        const user = await getUserService(token);
        console.log('User fetched:', user);
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        Cookies.remove('authToken');
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /**
   * Función para obtener usuarios suspendidos
   */
  const fetchUserCero = async () => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        const userCero = await getUserCeroService(token);
        console.log('User fetched:', userCero);
        setUserCero(userCero);
      } catch (error) {
        console.error('Error fetching user:', error);
        Cookies.remove('authToken');
      }
    }
  };

  useEffect(() => {
    fetchUserCero();
  }, []);

  /**
   * Función para alternar el estado del usuario (activar/desactivar)
   * @param userID - El ID del usuario
   */
  const toggleUserStatusById = async (userID: number) => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        await toggleUserStatusService(token, userID);
        // Actualizar el estado del usuario localmente
        setUserCero(prevUser =>
          prevUser?.map(userCero =>
            userCero.id === userID ? { ...userCero, estado: !userCero.estado } : userCero
          ) || null
        );
        setUser(prevUser =>
          prevUser?.map(user =>
            user.id === userID ? { ...user, estado: !user.estado } : user
          ) || null
        );
      } catch (error) {
        console.error('Error toggling user status:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userCero,
        setUserCero,
        auth,
        authID,
        login,
        logout,
        fetchUserByID,
        deleteUserById,
        editAuthByID,
        toggleUserStatusById,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};