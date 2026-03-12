import { apiSlice } from "@/services/api/api-entry";

export interface UploadMediaResponse {
	url: string;
	key: string;
	originalName: string;
	mimetype: string;
}

export const mediaApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		uploadMedia: builder.mutation<UploadMediaResponse[], FormData>({
			query: (body) => ({
				url: "/media/upload-multiple",
				method: "POST",
				body,
			}),
			transformResponse: (response: { data: UploadMediaResponse[] }) =>
				response?.data ?? response,
		}),
	}),
});

export const { useUploadMediaMutation } = mediaApi;
