import axios from "axios";

export interface ICloudinaryUploadResponse {
	url: string;
	publicId: string;
}

export const uploadImageToCloudinary = async (file: File): Promise<ICloudinaryUploadResponse> => {
	const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
	const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

	if (!cloudName || !uploadPreset) {
		throw new Error("Cloudinary environment variables are missing");
	}

	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", uploadPreset);

	try {
		const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return {
			url: res.data.secure_url,
			publicId: res.data.public_id,
		};
	} catch (error: any) {
		console.error("Cloudinary upload error:", error?.response?.data ?? error);
		throw new Error(error?.response?.data?.error?.message || "Failed to upload image");
	}
};
