// src/hooks/useUsers.ts
import { useState } from 'react';
import { UserType, UserAddType, UsersType } from '../types/user';

interface UseUsersReturn {
  users: UsersType;
  userActive: UserType | null;
  loading: boolean;
  error: Error | null;
  fetchUsers: ({ page, perPage }: { page?: number, perPage?: number }) => Promise<void>;
  createUser: (newUser: Omit<UserType, 'id'>) => Promise<void>;
  updateUser: (id: number, updatedFields: Partial<UserType>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  fetchUserActive: (userId: string) => Promise<UserType | null>;
  authorizeUser: () => Promise<UserType | null>;
}

const useUsers = (): UseUsersReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [users, setUsers] = useState<UsersType>({
    data: [],
    message: '',
    total: 0
  });
  const [userActive, setUserActive] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async ({ page, perPage }: { page?: number, perPage?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${page && perPage ? baseUrl + "/user" + `?page=${page}&perPage=${perPage}` : baseUrl + "/user"}`);
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: UsersType = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (newUser: Omit<UserType, 'id'>) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (!res.ok) throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdUser: UserAddType = await res.json();
      setUsers((prev) => ({
        data: [...prev.data, createdUser.data],
        message: createdUser.message,
        total: prev.total + 1
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Mettre à jour un citoyen
  const updateUser = async (id: number, updatedFields: Partial<UserType>) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/user/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (!res.ok) throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedUser: UserAddType = await res.json();
      setUsers((prev) => ({
        data: prev.data.map((user) => (user.id === id ? updatedUser.data : user)),
        message: updatedUser.message,
        total: prev.total
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Supprimer un citoyen
  const deleteUser = async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/user/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedUser: Omit<UserAddType, 'data'> = await res.json();
      setUsers((prev) => ({
        data: prev.data.filter((user) => user.id !== id),
        message: messageDeletedUser.message,
        total: prev.total - 1
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Récupérer le citoyen actif via son userId Clerk
  const fetchUserActive = async (userId: string): Promise<UserType | null> => {
    setLoading(true);
    setError(null);
    try {
      if (!localStorage.getItem) throw new Error('Token non trouvé');
      const res = await fetch(`${baseUrl}/user/clerk/${userId}`,{
        headers:
        {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }}
      );
      if (!res.ok) throw new Error(`Erreur lors du chargement de l'utilisateur actif : ${res.status}`);
      const data: UserAddType = await res.json();
      if (!data.data) {
        setUserActive(null);
        return null;
      } else {
        setUserActive(data.data);
        return data.data;
      }
    } catch (err: any) {
      setError(err);
      setUserActive(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const authorizeUser = async (): Promise<UserType | null> => {
    setError(null);
    setLoading(true);
    if (!localStorage.getItem('token')) {
      setUserActive(null);
      setLoading(false);
      return null;
    }
    try {
      const res = await fetch(`${baseUrl}/user/auth`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error(`Erreur lors de l'autorisation : ${res.status}`);
      const user: UserAddType = await res.json();
      if (user.data) {
        setUserActive(user.data);
        return user.data;
      } else {
        setUserActive(null);
        return null;
      }
    } catch (err: any) {
      setError(err);
      return null;
    }
    finally {
      setLoading(false);
    }
  }

  return {
    users,
    userActive,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    fetchUserActive,
    authorizeUser
  };
};

export default useUsers;
