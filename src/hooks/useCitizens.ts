// src/hooks/useCitizens.ts
import { useState } from 'react';
import { CitizenType, CitizenAddType, CitizensType } from '../types/citizen';

interface UseCitizensReturn {
  citizens: CitizensType;
  loading: boolean;
  error: Error | null;
  fetchCitizens: ({ page, perPage }: { page?: number, perPage?: number }) => Promise<void>;
  createCitizen: (newCitizen: Omit<CitizenType, 'id'>) => Promise<void>;
  updateCitizen: (id: string, updatedFields: Partial<CitizenType>) => Promise<void>;
  deleteCitizen: (id: string) => Promise<void>;
  fetchCitizenActive: (userId: string) => Promise<CitizenType | null>;
}

const useCitizens = (): UseCitizensReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [citizens, setCitizens] = useState<CitizensType>({
    data: [],
    message: '',
    total: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCitizens = async ({ page, perPage }: { page?: number, perPage?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${page && perPage ? baseUrl + "/citizen" + `?page=${page}&perPage=${perPage}` : baseUrl + "/citizen"}`);
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: CitizensType = await res.json();
      setCitizens(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createCitizen = async (newCitizen: Omit<CitizenType, 'id'>) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/citizen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCitizen)
      });
      if (!res.ok) throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdCitizen: CitizenAddType = await res.json();
      setCitizens((prev) => ({
        data: [...prev.data, createdCitizen.data],
        message: createdCitizen.message,
        total: prev.total + 1
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Mettre à jour un citoyen
  const updateCitizen = async (id: string, updatedFields: Partial<CitizenType>) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/citizen/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (!res.ok) throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedCitizen: CitizenAddType = await res.json();
      setCitizens((prev) => ({
        data: prev.data.map((citizen) => (citizen.id === id ? updatedCitizen.data : citizen)),
        message: updatedCitizen.message,
        total: prev.total
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Supprimer un citoyen
  const deleteCitizen = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/citizen/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedCitizen: Omit<CitizenAddType, 'data'> = await res.json();
      setCitizens((prev) => ({
        data: prev.data.filter((citizen) => citizen.id !== id),
        message: messageDeletedCitizen.message,
        total: prev.total - 1
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Récupérer le citoyen actif via son userId Clerk
  const fetchCitizenActive = async (userId: string): Promise<CitizenType | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/citizen/clerk/${userId}`);
      if (!res.ok) throw new Error(`Erreur lors du chargement de l'utilisateur actif : ${res.status}`);
      const data: CitizenAddType = await res.json();
      return data.data;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    citizens,
    loading,
    error,
    fetchCitizens,
    createCitizen,
    updateCitizen,
    deleteCitizen,
    fetchCitizenActive
  };
};

export default useCitizens;
