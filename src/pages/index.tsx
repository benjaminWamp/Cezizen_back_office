import useUsers from "../hooks/useUsers";
import { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { UserType } from "../types/user";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import ModalEdition, { FieldConfig } from "../components/ModalEdition";
import { useDebounce } from "../hooks/useDebounce";
import useRoles from "../hooks/useRoles";
import { FormSchema } from "../validation/userValidation";
import { useUser } from "@clerk/clerk-react";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstname", headerName: "Prénom", width: 130 },
  { field: "lastname", headerName: "Nom", width: 130 },
  {
    field: "email",
    headerName: "Mail",
    width: 250,
  },
  {
    field: "fullName",
    headerName: "Nom complet",
    sortable: false,
    width: 160,
    valueGetter: (_value, row) => `${row.lastname || ""} ${row.firstname || ""}`,
  },
  {
    field: "role",
    headerName: "Rôle",
    width: 160,
    valueGetter: (value: { name: string }) => `${value.name}`,
  },
];

const Index = () => {
  const { user } = useUser();
  const { fetchUsers, users, loading, error, createUser, updateUser, deleteUser, fetchUserActive } = useUsers();
  const { fetchRoles, roles } = useRoles();
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [count, setCount] = useState<number>(1);
  const [formData, setFormData] = useState<GridRowParams | null>(null);
  const [search, setSearch] = useState<string>("");
  const [usersFiltered, setCitiensFiltered] = useState<UserType[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  const createUserFormConfig: FieldConfig[] = [
    {
      name: "firstname",
      label: "Prénom",
      type: "text",
      validation: { required: "Le nom est requis" },
      showOn: "always",
    },
    {
      name: "lastname",
      label: "Prénom",
      type: "text",
      validation: { required: "Le prénom est requis" },
      showOn: "always",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      validation: {
        required: "L'email est requis",
        pattern: {
          value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
          message: "L'email n'est pas valide",
        },
      },
      showOn: "always",
    },
    {
      name: "password",
      label: "Mot de passe",
      type: "password",
      validation: { required: "Le mot de passe est requis" },
      showOn: "create",
    },
    {
      name: "roleId",
      label: "Role",
      type: "dropdown",
      validation: {},
      showOn: "always",
      options: roles.data.map((role) => ({
        label: role.name,
        value: role.id,
      })),
    },
  ];

  // Récupération du rôle utilisateur et log si USER
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.id) {
        try {
          const userActive = await fetchUserActive(user.id);
          if (userActive?.role?.name === "USER" || userActive?.role?.name === "MODERATOR") {
            window.location.href = "/401";
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur actif :", error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    fetchUsers({ page: page, perPage: perPage });
  }, [perPage, page]);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const totalCount = Math.ceil(users.total / perPage);
    setCount(totalCount);
  }, [perPage, users]);

  useEffect(() => {
    const filtered = users.data.filter((c) => `${c.firstname} ${c.lastname} ${c.email}`.toLowerCase().includes(debouncedSearch.trim().toLowerCase()));
    setCitiensFiltered(filtered);
  }, [debouncedSearch, users]);

  const handleRowDoubleClick = (rowData: any) => {
    setFormData({ ...rowData, roleId: rowData.role.id });
    setOpen(true);
  };

  const handleSubmitClick = (data: UserType) => {
    if (data.id) {
      updateUser(data.id, data);
    } else {
      createUser(data);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: number) => {
    deleteUser(id);
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
          <HeaderGrid title="Liste des utilisateurs" onAddClick={() => setOpen(true)} searchValue={search} onSearchChange={setSearch} />
          <GridComponent
            rows={usersFiltered}
            columns={columns}
            loading={loading}
            hideFooter={true}
            onRowDoubleClick={(params) => handleRowDoubleClick(params)}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, display: "flex", flexDirection: "row" }}>
              <InputLabel variant="outlined">Ligne par page</InputLabel>
              <Select
                value={perPage}
                onChange={(e: any) => {
                  setPerPage(parseInt(e.target.value));
                  setPage(1);
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                -
              </Button>
              <Typography>
                {page} sur {count}
              </Typography>
              <Button onClick={() => setPage(page + 1)} disabled={page === count}>
                +
              </Button>
            </Box>
          </Box>

          <ModalEdition
            open={open}
            FormSchema={FormSchema}
            onClose={() => handleCloseModal()}
            title={formData ? "Modifier un utilisateur" : "Créer un utilisateur"}
            fields={createUserFormConfig}
            onSubmit={(data) => handleSubmitClick(data)}
            initialData={formData || undefined}
            TransitionProps={{ onExited: () => setFormData(null) }}
            onDelete={(id) => handleDeleteClick(id)}
          />
        </Box>
      )}
    </Box>
  );
};

export default Index;
