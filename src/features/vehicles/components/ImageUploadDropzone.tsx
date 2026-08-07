import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useRef, useState, type DragEvent } from "react";
import { validateImageFile } from "../imageValidation";

interface ImageUploadDropzoneProps {
  uploading: boolean;
  onUpload: (files: File[]) => void;
}

export function ImageUploadDropzone({
  uploading,
  onUpload,
}: ImageUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const errors: string[] = [];
    const valid: File[] = [];

    for (const file of files) {
      const error = validateImageFile(file);
      if (error) errors.push(`${file.name}: ${error}`);
      else valid.push(file);
    }

    setFileErrors(errors);
    if (valid.length > 0) onUpload(valid);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    handleFiles(event.dataTransfer.files);
  }

  return (
    <Stack spacing={1}>
      <Box
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        sx={{
          border: "2px dashed",
          borderColor: dragOver ? "secondary.main" : "divider",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          cursor: "pointer",
          bgcolor: dragOver ? "action.hover" : "transparent",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp"
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <CircularProgress size={24} />
        ) : (
          <Stack alignItems="center" spacing={1}>
            <CloudUploadOutlinedIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Arraste imagens aqui ou clique para selecionar (JPEG, PNG, GIF ou
              WEBP, até 2MB cada)
            </Typography>
          </Stack>
        )}
      </Box>

      {fileErrors.map((error) => (
        <Alert key={error} severity="error" variant="outlined">
          {error}
        </Alert>
      ))}
    </Stack>
  );
}
