/** Public URL of an uploaded image stored in MongoDB (see app/api/media/[id]/route.ts). */
export const mediaUrl = (id: string) => `/api/media/${id}`;
