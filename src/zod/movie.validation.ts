import z from "zod";
const currentYear = new Date().getFullYear();
const rentalDurationEnum = z.enum(["DAYS_1", "DAYS_2", "DAYS_3", "DAYS_5", "DAYS_7", "DAYS_14", "DAYS_15"]);

export const movieFormSchema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
	synopsis: z.string().min(10, "Synopsis must be at least 10 characters"),
	releaseYear: z.coerce
		.number()
		.min(1888, "Release year must be 1888 or later")
		.max(currentYear + 5, `Release year must be ${currentYear + 5} or earlier`),
	director: z
		.string()
		.min(2, "Director name must be at least 2 characters")
		.max(100, "Director name must be 100 characters or less"),
	trailerUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
	streamingUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
	rentDuration: rentalDurationEnum.optional().or(z.literal("")),
	rentPrice: z.coerce.number().optional(),
	buyPrice: z.coerce.number().optional(),
});
