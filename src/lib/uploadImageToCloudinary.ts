import axios from "axios";

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

	try {
		const res = await axios.post(
			`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		);

		return res.data.secure_url;
	} catch (error: any) {
		throw new Error(error?.response?.data?.error?.message || "Upload failed");
	}
};
