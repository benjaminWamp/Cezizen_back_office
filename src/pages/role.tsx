import useRoles from "../hooks/useRoles";
import { useEffect } from "react";
import { Box } from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useState } from "react";
import { RoleType } from "../types/role";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import ModalEdition, { FieldConfig } from "../components/ModalEdition";
import { useDebounce } from "../hooks/useDebounce";
import useCitizens from "../hooks/useCitizens";
import { useUser } from "@clerk/clerk-react";


const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Nom", width: 130 },
];

const Role = () => {
  const { citizens, fetchCitizenActive } = useCitizens();
  const { user } = useUser();

  const { fetchRoles, roles, loading, error, createRole, updateRole, deleteRole } = useRoles();
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<GridRowParams | null>(null);
  const [search, setSearch] = useState<string>("");
  const [rolesFiltered, setRolesFiltered] = useState<RoleType[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  // const createRoleFormConfig: FieldConfig[] = [
  //   {
  //     name: "name",
  //     label: "Nom",
  //     type: "text",
  //     validation: { required: "Le nom est requis" },
  //     showOn: "always",
  //   },
  // ];

    // Récupération du rôle utilisateur et log si USER
    useEffect(() => {
      const fetchUserRole = async () => {
        if (user?.id) {
          try {
            const citizen = await fetchCitizenActive(user.id);
            if (citizen?.role?.name === "USER" || citizen?.role?.name === "MODERATOR") {
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
    fetchRoles();
  }, []);

  useEffect(() => {
    const filtered = roles.data.filter((c) => `${c.name}`.toLowerCase().includes(debouncedSearch.trim().toLowerCase()));
    setRolesFiltered(filtered);
  }, [debouncedSearch, roles]);

  // const handleRowDoubleClick = (rowData: any) => {
  //   setFormData(rowData);
  //   setOpen(true);
  // };

  // const handleSubmitClick = (data: RoleType) => {
  //   console.log("data", data);
  //   if (data.id) {
  //     updateRole(data.id, data);
  //   } else {
  //     createRole(data);
  //   }
  //   handleCloseModal();
  // };

  // const handleDeleteClick = (id: string) => {
  //   deleteRole(id);
  //   handleCloseModal();
  // };

  const handleCloseModal = () => {
    setFormData(null);
    setOpen(false);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
      {error && <ErrorComponent errorMessage={error?.message} />}
      {!loading && !error && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <HeaderGrid title="Liste des rôles" searchValue={search} onSearchChange={setSearch} />
          <GridComponent
            rows={rolesFiltered}
            columns={columns}
            loading={loading}
            hideFooter={true}
            // onRowDoubleClick={(params) => {
            //   handleRowDoubleClick(params);
            // }}
          />

          {/* <ModalEdition
            open={open}
            onClose={() => handleCloseModal()}
            title={formData ? "Modifier un rôle" : "Créer un rôle"}
            fields={createRoleFormConfig}
            onSubmit={(data) => handleSubmitClick(data)}
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
          /> */}
        </Box>
      )}
    </Box>
  );
};
export default Role;
