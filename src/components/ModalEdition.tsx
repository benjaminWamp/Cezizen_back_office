import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Divider,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

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
    | "times";
  label: string;
  type: "text" | "number" | "email" | "password" | "file" | "banner" | "dropdown" | "textArea" | "date" | "checkbox" | "textArea";
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
  onSubmitFile?: (file: File) => void;
  onSubmitBanner?: (file: File) => void;
  interfaceActive?: string;
  FormSchema: z.ZodType<any, any>;
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
  onSubmitFile,
  onSubmitBanner,
  FormSchema,
  interfaceActive,
}) => {
  const isEdit = Boolean(initialData);

  type FormSchemaType = z.infer<typeof FormSchema>;

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { dirtyFields, errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData?.row ? initialData.row : {},
  });

  // Show/hide password state
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Reset du formulaire avec initialData
    reset(initialData?.row || {});

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
                  field.type === "dropdown"
                    ? typeof initialData?.row?.[field.name] === "object"
                      ? (initialData.row[field.name] as any).id
                      : initialData?.row?.[field.name] ?? ""
                    : field.defaultValue ?? ""
                }
                render={({ field: ctrl, fieldState: { error } }) => {
                  const rawValue = ctrl.value;
                  const displayValue = field.dataFormat && rawValue != null ? field.dataFormat(rawValue) : rawValue;
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%", mt: 2 }}>
                      {field.type !== "file" && field.type !== "banner" && field.type !== "checkbox" && (
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
                      {(field.type === "file" || field.type === "banner") && (
                        <>
                          <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
                            {field.label}
                            <VisuallyHiddenInput
                              name={ctrl.name}
                              ref={ctrl.ref}
                              onBlur={ctrl.onBlur}
                              type="file"
                              onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;
                                ctrl.onChange(file);
                                if (onSubmitBanner && onSubmitFile && event.target.files && event.target.files.length > 0) {
                                  if (field.type === "banner") {
                                    onSubmitBanner(event.target.files[0]);
                                  } else {
                                    onSubmitFile(event.target.files[0]);
                                  }
                                }
                              }}
                            />
                          </Button>
                          {/* {ctrl.value && (
                          <Box sx={{ ml: 2 }}>
                            {field.type === "banner" ? (
                              <img src={URL.createObjectURL(ctrl.value)} alt="Banner" style={{ width: "100px", height: "100px" }} />
                            ) : (
                              <span>{ctrl.value.name}</span>
                            )}
                          </Box>
                        )} */}
                        </>
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
