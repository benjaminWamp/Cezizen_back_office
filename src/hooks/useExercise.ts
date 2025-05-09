// src/hooks/useExercises.ts
import { useState } from 'react';
import { ExerciseAddType, ExercisesType, ExerciseType } from '../types/exercise';

interface UseExercisesReturn {
  exercises: ExercisesType;
  exercise: ExerciseType | null;
  loading: boolean;
  error: Error | null;
  fetchExercises: () => Promise<void>;
  fetchExercise: (id: number) => Promise<ExerciseType>;
  createExercise: (newExercise: Omit<ExerciseType, 'id'>) => Promise<ExerciseType>;
  updateExercise: (id: number, updatedFields: Partial<ExerciseType>) => Promise<ExerciseType>;
  deleteExercise: (id: number) => Promise<void>;
}

const useExercises = (): UseExercisesReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [exercises, setExercises] = useState<ExercisesType>({
    data: [],
  message: '',
total: 0});
    const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchExercises = async () => {    
    setLoading(true);
    setError(null);
    try {      
      const res = await fetch(`${baseUrl}/exercise`);
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      console.log("🚧 -> :32 -> fetchExercises -> res 🚧", res);
      const data: ExercisesType = await res.json();
      setExercises(data);
    } catch (err: any) {      
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExercise = async (id: number): Promise<ExerciseType> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/exercise/${id}`);
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: ExerciseAddType = await res.json();
      setExercise(data.data);
      return data.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau citoyen
  const createExercise = async (newExercise: Omit<ExerciseType, 'id'>): Promise<ExerciseType> => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/exercise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExercise)
      });
      if (!res.ok) throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdExercise: ExerciseAddType = await res.json();
      setExercises((prev) => ({data: [...prev.data, createdExercise.data], message: createdExercise.message , total: prev.total + 1}));
      return createdExercise.data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Mettre à jour un citoyen
  const updateExercise = async (id: number, updatedFields: Partial<ExerciseType>): Promise<ExerciseType> => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/exercise/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (!res.ok) throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedExercise: ExerciseAddType = await res.json();
      setExercises((prev) => ({data: prev.data.map((exercise) => (exercise.id === id ? updatedExercise.data : exercise)), message: updatedExercise.message, total: prev.total}));
      return updatedExercise.data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Supprimer un citoyen
  const deleteExercise = async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/exercise/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedExercise : Omit<ExerciseAddType, 'data'> = await res.json();
      setExercises((prev) => ({data: prev.data.filter((exercise) => exercise.id !== id), message: messageDeletedExercise.message, total: prev.total - 1}));
    } catch (err: any) {
      setError(err);
    }
  };

  return {
    exercises,
    exercise,
    loading,
    error,
    fetchExercises,
    fetchExercise,
    createExercise,
    updateExercise,
    deleteExercise
  };
};

export default useExercises;
