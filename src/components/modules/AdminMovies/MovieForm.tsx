"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IMovie } from "@/types/movie.types";
import { IGenre } from "@/types/genre.types";
import { IPlatform } from "@/types/platform.types";
import { ICastMember } from "@/types/castMember.types";
import { createMovieAction, updateMovieAction } from "@/app/(dashboard)/admin/dashboard/movies/_action";
import { movieFormSchema } from "@/zod/movie.validation";
import Image from "next/image";
import { uploadImageToCloudinary } from "@/lib/uploadImageToCloudinary";

type MovieFormSchema = z.infer<typeof movieFormSchema>;

interface MovieFormProps {
	mode: "create" | "edit";
	movie?: IMovie | null;
	genres: IGenre[];
	platforms: IPlatform[];
	castMembers: ICastMember[];
}

const RENTAL_DURATIONS = [
	{ value: "DAYS_1", label: "1 Day" },
	{ value: "DAYS_2", label: "2 Days" },
	{ value: "DAYS_3", label: "3 Days" },
	{ value: "DAYS_5", label: "5 Days" },
	{ value: "DAYS_7", label: "7 Days" },
	{ value: "DAYS_14", label: "14 Days" },
	{ value: "DAYS_15", label: "15 Days" },
];

const MovieForm = ({ mode, movie, genres, platforms, castMembers }: MovieFormProps) => {
	const [posterPreview, setPosterPreview] = useState<string | null>(null);
	const [posterFile, setPosterFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [title, setTitle] = useState(movie?.title ?? "");
	const [synopsis, setSynopsis] = useState(movie?.synopsis ?? "");
	const [releaseYear, setReleaseYear] = useState(movie ? String(movie.releaseYear) : "");
	const [director, setDirector] = useState(movie?.director ?? "");
	const [trailerUrl, setTrailerUrl] = useState(movie?.trailerUrl ?? "");
	const [streamingUrl, setStreamingUrl] = useState(movie?.streamingUrl ?? "");
	const [rentPrice, setRentPrice] = useState(movie ? String(movie.rentPrice ?? 0) : "");
	const [buyPrice, setBuyPrice] = useState(movie ? String(movie.buyPrice ?? 0) : "");
	const [rentDuration, setRentDuration] = useState(movie?.rentDuration ?? "");
	const [isFeatured, setIsFeatured] = useState(movie?.isFeatured ?? false);
	const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);
	const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([]);
	const [selectedCastIds, setSelectedCastIds] = useState<string[]>([]);
	const [errors, setErrors] = useState<Partial<Record<keyof MovieFormSchema, string>>>({});

	const queryClient = useQueryClient();
	const router = useRouter();

	useEffect(() => {
		if (mode === "edit" && movie) {
			setTitle(movie.title);
			setSynopsis(movie.synopsis);
			setReleaseYear(String(movie.releaseYear));
			setDirector(movie.director);
			setTrailerUrl(movie.trailerUrl ?? "");
			setStreamingUrl(movie.streamingUrl ?? "");
			setRentPrice(String(movie.rentPrice ?? 0));
			setBuyPrice(String(movie.buyPrice ?? 0));
			setRentDuration((movie.rentDuration as string) ?? "");
			setIsFeatured(movie.isFeatured);
			setPosterPreview(movie.posterImage ?? null);
			setPosterFile(null);
			setSelectedGenreIds(movie.genres?.map((g) => g.genre.id) ?? []);
			setSelectedPlatformIds(movie.platforms?.map((p) => p.platform.id) ?? []);
			setSelectedCastIds(movie.movieCasts?.map((c) => c.castMember.id) ?? []);
			return;
		}

		if (mode === "create") {
			setTitle("");
			setSynopsis("");
			setReleaseYear("");
			setDirector("");
			setTrailerUrl("");
			setStreamingUrl("");
			setRentPrice("");
			setBuyPrice("");
			setRentDuration("");
			setIsFeatured(false);
			setPosterPreview(null);
			setPosterFile(null);
			setSelectedGenreIds([]);
			setSelectedPlatformIds([]);
			setSelectedCastIds([]);
		}
	}, [mode, movie]);

	const resetForm = () => {
		setTitle("");
		setSynopsis("");
		setReleaseYear("");
		setDirector("");
		setTrailerUrl("");
		setStreamingUrl("");
		setRentPrice("");
		setBuyPrice("");
		setRentDuration("");
		setIsFeatured(false);
		setPosterPreview(null);
		setPosterFile(null);
		setSelectedGenreIds([]);
		setSelectedPlatformIds([]);
		setSelectedCastIds([]);
		setErrors({});
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setPosterFile(file);
		setPosterPreview(URL.createObjectURL(file));
	};

	const toggleItem = (id: string, selected: string[], setSelected: (ids: string[]) => void) => {
		setSelected(selected.includes(id) ? selected.filter((i) => i !== id) : [...selected, id]);
	};

	const { isPending } = useMutation({
		mutationFn: async (payload: any) =>
			mode === "edit" && movie ? updateMovieAction(movie.id, payload) : createMovieAction(payload),
		onError: (error: unknown) => {
			toast.error(error instanceof Error ? error.message : "Something went wrong.");
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		const validationData = {
			title,
			synopsis,
			releaseYear: releaseYear ? String(releaseYear) : "",
			director,
			trailerUrl: trailerUrl.trim(),
			streamingUrl: streamingUrl.trim(),
			rentDuration: rentDuration || "",
			rentPrice: rentPrice ? String(rentPrice) : "",
			buyPrice: buyPrice ? String(buyPrice) : "",
		};

		const validationResult = movieFormSchema.safeParse(validationData);
		if (!validationResult.success) {
			const fieldErrors: any = {};
			validationResult.error.issues.forEach((issue) => {
				fieldErrors[issue.path[0]] = issue.message;
			});
			setErrors(fieldErrors);
			toast.error("Please fix the errors in the form.");
			return;
		}

		try {
			let posterImage = movie?.posterImage ?? undefined;

			if (posterFile) {
				posterImage = await uploadImageToCloudinary(posterFile);
			}

			const payload = {
				title: title.trim(),
				synopsis: synopsis.trim(),
				releaseYear: Number(releaseYear),
				director: director.trim(),
				trailerUrl: trailerUrl.trim() || undefined,
				streamingUrl: streamingUrl.trim() || undefined,
				rentPrice: rentPrice ? Number(rentPrice) : 0,
				buyPrice: buyPrice ? Number(buyPrice) : 0,
				rentDuration: rentDuration || undefined,
				isFeatured,
				...(posterImage ? { posterImage } : {}), // ⭐ IMPORTANT
				genreIds: selectedGenreIds,
				platformIds: selectedPlatformIds,
				castMemberIds: selectedCastIds,
			};

			const result =
				mode === "edit" && movie ? await updateMovieAction(movie.id, payload) : await createMovieAction(payload);

			if (!result.success) {
				toast.error(result.message);
				return;
			}

			toast.success(result.message);
			await queryClient.invalidateQueries({ queryKey: ["movies"] });

			if (mode === "create") resetForm();
		} catch {
			toast.error("Failed to save movie");
		}
	};

	return (
		<div className="rounded-lg border border-border bg-background">
			<div className="border-b bg-muted/50 px-6 py-5">
				<h1 className="text-2xl font-bold">{mode === "create" ? "Add New Movie" : "Edit Movie"}</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					{mode === "create" ? "Add a new movie to the media library." : "Update the movie details and information."}
				</p>
			</div>

			<div className="p-6">
				<form onSubmit={handleSubmit} noValidate className="space-y-6">
					<div className="space-y-1.5">
						<Label>Poster Image</Label>
						<div
							onClick={() => fileInputRef.current?.click()}
							className="flex aspect-2/3 w-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors overflow-hidden relative"
						>
							{posterPreview ? (
								<>
									<Image src={posterPreview} alt="poster" fill className="h-full w-full object-cover" />
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											setPosterPreview(null);
											setPosterFile(null);
										}}
										className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black"
									>
										×
									</button>
								</>
							) : (
								<div className="flex flex-col items-center gap-2 text-muted-foreground">
									<span className="text-2xl">+</span>
									<span className="text-xs text-center">Click to upload poster</span>
								</div>
							)}
						</div>
						<input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
					</div>

					<div className="grid gap-6 lg:grid-cols-2">
						<div className="space-y-1.5">
							<Label>
								Title <span className="text-destructive">*</span>
							</Label>
							<Input
								placeholder="e.g. Inception"
								value={title}
								onChange={(e) => {
									setTitle(e.target.value);
									if (errors.title) setErrors({ ...errors, title: undefined });
								}}
								disabled={isPending}
								className={errors.title ? "border-destructive" : ""}
							/>
							{errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
						</div>
						<div className="space-y-1.5">
							<Label>
								Director <span className="text-destructive">*</span>
							</Label>
							<Input
								placeholder="e.g. Christopher Nolan"
								value={director}
								onChange={(e) => {
									setDirector(e.target.value);
									if (errors.director) setErrors({ ...errors, director: undefined });
								}}
								disabled={isPending}
								className={errors.director ? "border-destructive" : ""}
							/>
							{errors.director && <p className="text-xs text-destructive">{errors.director}</p>}
						</div>
					</div>

					<div className="grid gap-6 lg:grid-cols-2">
						<div className="space-y-1.5">
							<Label>
								Release Year <span className="text-destructive">*</span>
							</Label>
							<Input
								type="number"
								placeholder="e.g. 2010"
								value={releaseYear}
								onChange={(e) => {
									setReleaseYear(e.target.value);
									if (errors.releaseYear) setErrors({ ...errors, releaseYear: undefined });
								}}
								disabled={isPending}
								className={errors.releaseYear ? "border-destructive" : ""}
							/>
							{errors.releaseYear && <p className="text-xs text-destructive">{errors.releaseYear}</p>}
						</div>
						<div className="space-y-1.5">
							<Label>Rent Duration</Label>
							<Select
								value={rentDuration || movie?.rentDuration || ""}
								onValueChange={setRentDuration}
								disabled={isPending}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a rental duration" />
								</SelectTrigger>
								<SelectContent>
									{RENTAL_DURATIONS.map((d) => (
										<SelectItem key={d.value} value={d.value}>
											{d.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label>
							Synopsis <span className="text-destructive">*</span>
						</Label>
						<Textarea
							placeholder="Brief description..."
							value={synopsis}
							onChange={(e) => {
								setSynopsis(e.target.value);
								if (errors.synopsis) setErrors({ ...errors, synopsis: undefined });
							}}
							disabled={isPending}
							rows={4}
							className={errors.synopsis ? "border-destructive" : ""}
						/>
						{errors.synopsis && <p className="text-xs text-destructive">{errors.synopsis}</p>}
					</div>

					<div className="grid gap-6 lg:grid-cols-2">
						<div className="space-y-1.5">
							<Label>
								Trailer URL <span className="text-muted-foreground text-xs">(optional)</span>
							</Label>
							<Input
								placeholder="https://youtube.com/..."
								value={trailerUrl}
								onChange={(e) => {
									setTrailerUrl(e.target.value);
									if (errors.trailerUrl) setErrors({ ...errors, trailerUrl: undefined });
								}}
								disabled={isPending}
								className={errors.trailerUrl ? "border-destructive" : ""}
							/>
							{errors.trailerUrl && <p className="text-xs text-destructive">{errors.trailerUrl}</p>}
						</div>
						<div className="space-y-1.5">
							<Label>
								Streaming URL <span className="text-muted-foreground text-xs">(optional)</span>
							</Label>
							<Input
								placeholder="https://..."
								value={streamingUrl}
								onChange={(e) => {
									setStreamingUrl(e.target.value);
									if (errors.streamingUrl) setErrors({ ...errors, streamingUrl: undefined });
								}}
								disabled={isPending}
								className={errors.streamingUrl ? "border-destructive" : ""}
							/>
							{errors.streamingUrl && <p className="text-xs text-destructive">{errors.streamingUrl}</p>}
						</div>
					</div>

					<div className="grid gap-6 lg:grid-cols-3">
						<div className="space-y-1.5">
							<Label>Rent Price</Label>
							<Input
								type="number"
								placeholder="Add 65+ BDT for rental price"
								value={rentPrice}
								onChange={(e) => {
									setRentPrice(e.target.value);
									if (errors?.rentPrice) setErrors({ ...errors, rentPrice: undefined });
								}}
								disabled={isPending}
								className={errors.rentPrice ? "border-destructive" : ""}
							/>
							{errors.rentPrice && <p className="text-xs text-destructive">{errors.rentPrice}</p>}
						</div>
						<div className="space-y-1.5">
							<Label>Buy Price</Label>
							<Input
								type="number"
								placeholder="Add 65+ BDT for Buy Price"
								value={buyPrice}
								onChange={(e) => {
									setBuyPrice(e.target.value);
									if (errors.buyPrice) setErrors({ ...errors, buyPrice: undefined });
								}}
								disabled={isPending}
								className={errors.buyPrice ? "border-destructive" : ""}
							/>
							{errors.buyPrice && <p className="text-xs text-destructive">{errors.buyPrice}</p>}
						</div>
						<div className="space-y-1.5">
							<Label>Featured</Label>
							<div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-4 py-2.5">
								<Checkbox
									id="featured"
									checked={isFeatured}
									onCheckedChange={(v) => setIsFeatured(v === true)}
									disabled={isPending}
								/>
								<Label htmlFor="featured" className="cursor-pointer font-normal">
									Mark as featured movie
								</Label>
							</div>
						</div>
					</div>

					<div className="space-y-6 border-t pt-6">
						<div className="space-y-3">
							<Label className="text-base font-semibold">Genres</Label>
							<div className="flex flex-wrap gap-2">
								{genres.map((g) => (
									<button
										key={g.id}
										type="button"
										onClick={() => toggleItem(g.id, selectedGenreIds, setSelectedGenreIds)}
										className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
											selectedGenreIds.includes(g.id)
												? "border-primary bg-primary text-primary-foreground"
												: "border-border bg-muted hover:border-primary/50"
										}`}
									>
										{g.name}
									</button>
								))}
							</div>
						</div>

						<div className="space-y-3">
							<Label className="text-base font-semibold">Platforms</Label>
							<div className="flex flex-wrap gap-2">
								{platforms.map((p) => (
									<button
										key={p.id}
										type="button"
										onClick={() => toggleItem(p.id, selectedPlatformIds, setSelectedPlatformIds)}
										className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
											selectedPlatformIds.includes(p.id)
												? "border-primary bg-primary text-primary-foreground"
												: "border-border bg-muted hover:border-primary/50"
										}`}
									>
										{p.name}
									</button>
								))}
							</div>
						</div>

						<div className="space-y-3">
							<Label className="text-base font-semibold">Cast Members</Label>
							<div className="flex flex-wrap gap-2">
								{castMembers.map((c) => (
									<button
										key={c.id}
										type="button"
										onClick={() => toggleItem(c.id, selectedCastIds, setSelectedCastIds)}
										className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
											selectedCastIds.includes(c.id)
												? "border-primary bg-primary text-primary-foreground"
												: "border-border bg-muted hover:border-primary/50"
										}`}
									>
										{c.name}
									</button>
								))}
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-3 border-t bg-muted/30 -mx-6 -mb-6 px-6 py-4 sm:flex-row sm:justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.push("/admin/dashboard/movies")}
							disabled={isPending}
							className="sm:min-w-30"
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending} className="sm:min-w-35">
							{isPending ? "Saving..." : mode === "create" ? "Create Movie" : "Save Changes"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default MovieForm;
