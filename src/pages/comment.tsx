import useComments from "../hooks/useComment";
import { useEffect } from "react";
import { Box } from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useState } from "react";
import { CommentType } from "../types/comment";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import ModalEdition, { FieldConfig } from "../components/ModalEdition";
import { useDebounce } from "../hooks/useDebounce";
import useCitizens from "../hooks/useCitizens";
import { useUser } from "@clerk/clerk-react";


const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "title", headerName: "Titre", width: 150 },
  { field: "description", headerName: "Description", width: 750 },
  { field: "fullName", headerName: "Citoyen", width: 130, valueGetter: (value, row) => `${row.citizen.surname || ""} ${row.citizen.name || ""}` },
];

const Comment = () => {
  const { user } = useUser();
  const { fetchCitizenActive } = useCitizens();


  const { fetchComments, comments, loading, error, deleteComment } = useComments();
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<GridRowParams | null>(null);
  const [search, setSearch] = useState<string>("");
  const [commentsFiltered, setCommentsFiltered] = useState<CommentType[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  const createCommentFormConfig: FieldConfig[] = [
    {
      name: "title",
      label: "Titre",
      type: "text",
      showOn: "always",
      isDisabled: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textArea",
      showOn: "always",
      isDisabled: true,
    },
    {
      name: "citizen",
      label: "Citoyen",
      type: "text",
      showOn: "always",
      isDisabled: true,
      dataFormat: (value: any) => `${value.surname || ""} ${value.name || ""}`,
    },
  ];

      // Récupération du rôle utilisateur et log si USER
      useEffect(() => {
        const fetchUserRole = async () => {
          if (user?.id) {
            try {
              const citizen = await fetchCitizenActive(user.id);
              if (citizen?.role?.name === "USER") {
                console.log("Rôle détecté : USER");
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
    fetchComments();
  }, []);

  useEffect(() => {
    const filtered = comments.data.filter((c) => `${c.title} ${c.description} `.toLowerCase().includes(debouncedSearch.trim().toLowerCase()));
    setCommentsFiltered(filtered);
  }, [debouncedSearch, comments]);

  const handleRowDoubleClick = (rowData: any) => {
    setFormData(rowData);
    setOpen(true);
  };

  // const handleSubmitClick = (data: CommentType) => {
  //   console.log("data", data);
  //   if (data.id) {
  //     updateComment(data.id, data);
  //   } else {
  //     createComment(data);
  //   }
  //   handleCloseModal();
  // };

  const handleDeleteClick = (id: string) => {
    deleteComment(id);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setFormData(null);
    setOpen(false);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
      {error && <ErrorComponent errorMessage={error?.message} />}
      {!loading && !error && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <HeaderGrid title="Liste des commentaires" searchValue={search} onSearchChange={setSearch} />
          <GridComponent
            rows={commentsFiltered}
            columns={columns}
            loading={loading}
            hideFooter={true}
            onRowDoubleClick={(params) => {
              handleRowDoubleClick(params);
            }}
          />

          <ModalEdition
            open={open}
            onClose={() => handleCloseModal()}
            title={"Modérer le commentaire"}
            fields={createCommentFormConfig}
            initialData={formData ? formData : undefined}
            // TransitionProps={{
            //   onExited: () => {
            //     console.log("onExited");
            //     setFormData(null);
            //   },
            // }}
            onDelete={(id) => {
              handleDeleteClick(id);
            }}
          />
        </Box>
      )}
    </Box>
  );
};
export default Comment;
