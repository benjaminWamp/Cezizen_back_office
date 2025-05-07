// src/hooks/useComments.ts
import { useState } from 'react';
import { CommentAddType, CommentsType } from '../types/comment';

interface UseCommentsReturn {
  comments: CommentsType;
  loading: boolean;
  error: Error | null;
  fetchComments: () => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
}

const useComments = (): UseCommentsReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [comments, setComments] = useState<CommentsType>({
    data: [],
  message: '',
});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer la liste des citoyens
  const fetchComments = async () => {    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/comment`);      
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: CommentsType = await res.json();
      setComments(data);
    } catch (err: any) {      
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un citoyen
  const deleteComment = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/comment/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedComment : Omit<CommentAddType, 'data'> = await res.json();
      setComments((prev) => ({data: prev.data.filter((comment) => comment.id !== id), message: messageDeletedComment.message}));
    } catch (err: any) {
      setError(err);
    }
  };

  return {
    comments,
    loading,
    error,
    fetchComments,
    deleteComment
  };
};

export default useComments;
