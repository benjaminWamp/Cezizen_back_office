import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { styled } from "@mui/material/styles";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, InputAdornment, MenuItem, Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { ImageType } from "../types/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export interface FieldConfig {
  name:
    | "title"
    | "description"
    | "deadLine"
    | "categoryId"
    | "firstname"
    | "email"
    | "password"
    | "roleId"
    | "lastname"
    | "bannerId"
    | "fileId"
    | "label"
    | "inspiration"
    | "expiration"
    | "apnea"
    | "times"
    | "content"
    | "userId"
    | "images";
  label: string;
  type: "text" | "number" | "email" | "password" | "file" | "banner" | "dropdown" | "textArea" | "date" | "checkbox" | "textArea" | "image";
  defaultValue?: string | number;
  validation?: Record<string, any>;
  showOn: "create" | "edit" | "always";
  options?: Array<{ value: string | number; label: string }> | null;
  isDisabled?: boolean;
  dataFormat?: (value: any) => string;
}

interface GenericModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: FieldConfig[];
  onSubmit?: (data: any) => void;
  onDelete?: (id: number) => void;
  initialData?: any;
  TransitionProps?: {
    onExited: () => void;
  };
  onSubmitImage?: (file: File) => void;
  interfaceActive?: string;
  FormSchema: z.ZodType<any, any>;
  onDeleteImage?: (isDeleteImage: boolean) => void;
}

const GenericModal: React.FC<GenericModalProps> = ({
  open,
  onClose,
  title,
  onSubmit,
  fields,
  initialData,
  onDelete,
  TransitionProps,
  onSubmitImage,
  FormSchema,
  onDeleteImage,
}) => {
  const isEdit = Boolean(initialData);

  type FormSchemaType = z.infer<typeof FormSchema>;

  const {
    handleSubmit,
    control,
    reset,
    formState: { dirtyFields },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData?.row ? initialData.row : {},
  });

  // Show/hide password state
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [selectedFile, setSelectedFile] = useState<ImageType | File | null>(null);

  useEffect(() => {
    // Reset du formulaire avec initialData
    if (open) {
      if (initialData) reset(initialData?.row || {});
    } else {
      setSelectedFile(null);
      reset({});
    }

    console.log("initialData", initialData);

    // Initialisation de l'état showPassword à false pour tous les champs password
    const initVisibility: Record<string, boolean> = {};
    fields.forEach((f) => {
      if (f.type === "password") initVisibility[f.name] = false;
    });
    setShowPassword(initVisibility);
  }, [initialData, reset, fields]);

  // Filter fields by mode
  const filteredFields = fields.filter((f) => f.showOn === "always" || (isEdit && f.showOn === "edit") || (!isEdit && f.showOn === "create"));

  const handleClickShowPassword = (name: string) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handlePatch = (data: any) => {
    const payload: Record<string, any> = initialData.row.clerkId ? { id: initialData?.id, clerkId: initialData.row.clerkId } : { id: initialData?.id };
    console.log("payload", payload);
    console.log("dirtyFields", dirtyFields);
    console.log("data", data);

    Object.keys({ ...dirtyFields }).forEach((key) => {
      payload[key] = data[key];
    });
    if (onSubmit) {
      onSubmit(payload);
    }
  };

  const handleCreate = (payload: FormSchemaType) => {
    const resource = { ...payload, id: initialData?.id };
    if (onSubmit) {
      onSubmit(resource);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionProps={TransitionProps} sx={{ "& .MuiDialog-paper": { width: "90%", maxHeight: "90vh" } }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form id="generic-form" onSubmit={handleSubmit(isEdit ? handlePatch : handleCreate)}>
          {filteredFields.map((field) => {
            const isPwd = field.type === "password";
            const type = isPwd && showPassword[field.name] ? "text" : field.type;
            return (
              <Controller
                key={field.name}
                name={field.name as unknown as string}
                control={control}
                defaultValue={
                  field.type === "image"
                    ? null
                    : field.type === "dropdown"
                    ? typeof initialData?.row?.[field.name] === "object"
                      ? (initialData.row[field.name] as any)?.id ?? ""
                      : initialData?.row?.[field.name] ?? ""
                    : field.defaultValue ?? ""
                }
                render={({ field: ctrl, fieldState: { error } }) => {
                  const rawValue = ctrl.value;
                  const displayValue = field.dataFormat && rawValue != null ? field.dataFormat(rawValue) : rawValue;
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%", mt: 2 }}>
                      {field.type !== "image" && field.type !== "checkbox" && (
                        <TextField
                          {...ctrl}
                          label={field.label}
                          value={displayValue}
                          select={field.type === "dropdown"}
                          type={type}
                          multiline={field.type === "textArea"}
                          disabled={field.isDisabled}
                          fullWidth
                          variant="outlined"
                          error={!!error}
                          helperText={error?.message}
                          InputProps={
                            isPwd
                              ? {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton aria-label="toggle password visibility" onClick={() => handleClickShowPassword(field.name)} edge="end">
                                        {showPassword[field.name] ? <VisibilityOff /> : <Visibility />}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }
                              : undefined
                          }
                        >
                          {field.options &&
                            field.options.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                        </TextField>
                      )}
                      {field.type === "image" && (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                          <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
                            {field.label}
                            <VisuallyHiddenInput
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                  setSelectedFile(file);
                                  if (onSubmitImage) {
                                    onSubmitImage(file);
                                  }
                                }
                              }}
                            />
                          </Button>

                          {selectedFile && (
                            <Box sx={{ mt: 2 }}>
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="body2">📄 {selectedFile instanceof File ? selectedFile.name : "Image preview"}</Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedFile(null);
                                    if (onDeleteImage) onDeleteImage(initialData?.row.id);
                                  }}
                                >
                                  <DeleteIcon fontSize="small" sx={{ color: "red" }} />
                                </IconButton>
                              </Box>
                              <img
                                src={
                                  selectedFile
                                    ? selectedFile instanceof File
                                      ? URL.createObjectURL(selectedFile)
                                      : `http://localhost:3000${selectedFile.path}`
                                    : ""
                                }
                                alt="Aperçu"
                                style={{ width: 150, marginTop: 8, borderRadius: 8 }}
                              />
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  );
                }}
              />
            );
          })}
        </form>
      </DialogContent>
      <DialogActions sx={{ justifyContent: initialData?.id ? "space-between" : "flex-end" }}>
        {isEdit && initialData?.id && (
          <Button color="warning" onClick={() => onDelete?.(initialData.id)}>
            Supprimer
          </Button>
        )}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button onClick={onClose} color="secondary">
            Annuler
          </Button>
          {onSubmit && (
            <Button type="submit" form="generic-form" color="primary" variant="contained">
              Valider
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default GenericModal;
