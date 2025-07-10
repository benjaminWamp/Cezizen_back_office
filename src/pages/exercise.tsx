import useExercises from "../hooks/useExercise";
import { useEffect } from "react";
import { Box } from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useState } from "react";
import { ExerciseType } from "../types/exercise";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import ModalEdition, { FieldConfig } from "../components/ModalEdition";
import { useDebounce } from "../hooks/useDebounce";
import { FormSchema } from "../validation/exerciseValidation";
import useUsers from "../hooks/useUsers";
import { useUser } from "@clerk/clerk-react";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "label", headerName: "Titre", width: 130 },
  { field: "description", headerName: "Description", width: 130 },
  {
    field: "inspiration",
    headerName: "Temps d'inspiration",
    width: 130,
  },
  {
    field: "expiration",
    headerName: "Temps d'expiration",
    width: 130,
  },
  {
    field: "apnea",
    headerName: "Temps d'apnée",
    width: 130,
  },
  {
    field: "times",
    headerName: "Temps",
    width: 130,
  },
];

const Index = () => {
  const { fetchUserActive } = useUsers();
  const { user } = useUser();
  const { fetchExercises, exercises, loading, error, createExercise, updateExercise, deleteExercise, fetchExercise } = useExercises();
  const [search, setSearch] = useState<string>("");
  const [exercisesFiltered, setExercisesFiltered] = useState<ExerciseType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<GridRowParams | null>(null);

  const ressourceFormConfig: FieldConfig[] = [
    { name: "label", label: "Titre", type: "text", showOn: "always" },
    { name: "description", label: "Description", type: "textArea", showOn: "always" },
    { name: "inspiration", label: "Temps d'inspiration", type: "text", showOn: "always" },
    { name: "expiration", label: "Temps d'expiration", type: "text", showOn: "always" },
    { name: "apnea", label: "Temps d'apnée", type: "text", showOn: "always" },
    { name: "times", label: "Temps", type: "text", showOn: "always" },
  ];

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.id) {
        try {
          const userActive = await fetchUserActive(user.id);
          if (userActive?.role?.name === "USER") {
            window.location.href = "/401";
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du citoyen actif :", error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    const filtered = exercises.data.filter((c) => `${c.label} ${c.description}`.toLowerCase().includes(debouncedSearch.trim().toLowerCase()));

    setExercisesFiltered(filtered);
  }, [debouncedSearch, exercises]);

  const handleRowDoubleClick = async (rowData: any) => {
    await fetchExercise(rowData.id).then((exercise) => {
      setFormData({
        ...rowData,
        row: {
          ...exercise,
        },
      });
    });
    setOpen(true);
  };

  const handleSubmitClick = (data: ExerciseType) => {
    if (data.id) {
      const { ...rest } = data;
      updateExercise(data.id, {
        ...rest,
      });
    } else {
      createExercise({
        ...data,
      });
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: number) => {
    deleteExercise(id);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
      {error && <ErrorComponent errorMessage={error?.message} />}
      {!loading && !error && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <HeaderGrid title="Liste des exercices" onAddClick={() => setOpen(true)} searchValue={search} onSearchChange={setSearch} />
          <GridComponent
            rows={exercisesFiltered}
            columns={columns}
            loading={loading}
            hideFooter={true}
            onRowDoubleClick={(params) => {
              handleRowDoubleClick(params);
            }}
          />

          <ModalEdition
            open={open}
            FormSchema={FormSchema}
            onClose={() => handleCloseModal()}
            title={formData ? "Modifier un exercices" : "Créer un exercices"}
            fields={ressourceFormConfig}
            onSubmit={(data) => handleSubmitClick(data)}
            initialData={formData}
            TransitionProps={{ onExited: () => setFormData(null) }}
            onDelete={(id) => {
              handleDeleteClick(id);
            }}
            interfaceActive="exercise"
          />
        </Box>
      )}
    </Box>
  );
};
export default Index;
