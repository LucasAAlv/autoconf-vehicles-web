const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE_BYTES = 2048 * 1024; // matches the API's 2MB-per-file limit

/** Mirrors StoreVehicleImageRequest's validation, checked client-side before upload. */
export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Formato não suportado (use JPEG, PNG, GIF ou WEBP)";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "Arquivo maior que 2MB";
  }
  return null;
}
