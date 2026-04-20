"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IMovie } from "@/types/movie.types";
import { IGenre } from "@/types/genre.types";
import { IPlatform } from "@/types/platform.types";
import { ICastMember } from "@/types/castMember.types";
import { createMovieAction, updateMovieAction } from "@/app/(dashboard)/admin/dashboard/movies/_action";

interface MovieFormModalProps {
	mode: "create" | "edit";
	movie?: IMovie | null;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
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

const MovieFormModal = ({ mode, movie, open, onOpenChange, genres, platforms, castMembers }: MovieFormModalProps) => {
	const [internalOpen, setInternalOpen] = useState(false);
	const isControlled = open !== undefined;
	const isOpen = isControlled ? open : internalOpen;
	const setOpen = isControlled ? onOpenChange! : setInternalOpen;

	const [posterPreview, setPosterPreview] = useState<string | null>(null);
	const [posterFile, setPosterFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [title, setTitle] = useState("");
	const [synopsis, setSynopsis] = useState("");
	const [releaseYear, setReleaseYear] = useState("");
	const [director, setDirector] = useState("");
	const [trailerUrl, setTrailerUrl] = useState("");
	const [streamingUrl, setStreamingUrl] = useState("");
	const [rentPrice, setRentPrice] = useState("");
	const [buyPrice, setBuyPrice] = useState("");
	const [rentDuration, setRentDuration] = useState("");
	const [isFeatured, setIsFeatured] = useState(false);
	const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);
	const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([]);
	const [selectedCastIds, setSelectedCastIds] = useState<string[]>([]);

	const queryClient = useQueryClient();
	const router = useRouter();

	// Edit mode — populate form whenever movie changes or modal opens
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
		}
	}, [mode, movie, open]); // movie object change হলেই re-populate

	// Create mode — reset when modal opens
	useEffect(() => {
		if (mode === "create" && isOpen) {
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
	}, [mode, isOpen]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setPosterFile(file);
		setPosterPreview(URL.createObjectURL(file));
	};

	const toggleItem = (id: string, selected: string[], setSelected: (ids: string[]) => void) => {
		setSelected(selected.includes(id) ? selected.filter((i) => i !== id) : [...selected, id]);
	};

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (formData: FormData) =>
			mode === "edit" && movie ? updateMovieAction(movie.id, formData) : createMovieAction(formData),
		onError: (error: unknown) => {
			toast.error(error instanceof Error ? error.message : "Something went wrong.");
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) {
			toast.error("Title is required.");
			return;
		}
		if (!synopsis.trim()) {
			toast.error("Synopsis is required.");
			return;
		}
		if (!releaseYear) {
			toast.error("Release year is required.");
			return;
		}
		if (!director.trim()) {
			toast.error("Director is required.");
			return;
		}

		const formData = new FormData();
		formData.append("title", title.trim());
		formData.append("synopsis", synopsis.trim());
		formData.append("releaseYear", releaseYear);
		formData.append("director", director.trim());
		if (trailerUrl.trim()) formData.append("trailerUrl", trailerUrl.trim());
		if (streamingUrl.trim()) formData.append("streamingUrl", streamingUrl.trim());
		if (rentPrice) formData.append("rentPrice", rentPrice);
		if (buyPrice) formData.append("buyPrice", buyPrice);
		if (rentDuration) formData.append("rentDuration", rentDuration);
		formData.append("isFeatured", isFeatured ? "1" : "0");
		selectedGenreIds.forEach((id) => formData.append("genreIds", id));
		selectedPlatformIds.forEach((id) => formData.append("platformIds", id));
		selectedCastIds.forEach((id) => formData.append("castMemberIds", id));
		if (posterFile) formData.append("file", posterFile);

		try {
			const result = await mutateAsync(formData);
			if (!result.success) {
				toast.error(result.message || "Failed to save movie.");
				return;
			}
			toast.success(result.message || `Movie ${mode === "create" ? "created" : "updated"} successfully.`);
			setOpen(false);
			void queryClient.invalidateQueries({ queryKey: ["movies"] });
			void queryClient.refetchQueries({ queryKey: ["movies"], type: "active" });
			router.refresh();
		} catch {
			/* onError handles it */
		}
	};

	const content = (
		// sm:max-w-[90vw] দিয়ে shadcn এর default override করো
		<DialogContent
			className="w-[95vw] max-w-[1080px]"
			onInteractOutside={(e) => e.preventDefault()}
			onEscapeKeyDown={(e) => e.preventDefault()}
		>
			<DialogHeader>
				<DialogTitle>{mode === "create" ? "Add Movie" : "Edit Movie"}</DialogTitle>
				<DialogDescription>
					{mode === "create" ? "Add a new movie to the media library." : "Update the movie details."}
				</DialogDescription>
			</DialogHeader>

			<ScrollArea className="max-h-[90vh] pr-4">
				<form onSubmit={handleSubmit} method="POST" action="#" noValidate className="space-y-5 pb-2">
					<div className="space-y-4">
						<div className="space-y-1.5">
							<Label>Poster Image</Label>
							<div
								onClick={() => fileInputRef.current?.click()}
								className="flex aspect-[2/3] w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors overflow-hidden relative"
							>
								{posterPreview ? (
									<>
										<img src={posterPreview} alt="poster" className="h-full w-full object-cover" />
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												setPosterPreview(null);
												setPosterFile(null);
											}}
											className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black"
										>
											<X className="h-3 w-3" />
										</button>
									</>
								) : (
									<div className="flex flex-col items-center gap-2 text-muted-foreground">
										<Upload className="h-8 w-8" />
										<span className="text-xs text-center">Click to upload poster</span>
									</div>
								)}
							</div>
							<input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
						</div>
						<div className="space-y-4">
							<div className="space-y-1.5">
								<Label>
									Title <span className="text-destructive">*</span>
								</Label>
								<Input
									placeholder="e.g. Inception"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									disabled={isPending}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<Label>
										Director <span className="text-destructive">*</span>
									</Label>
									<Input
										placeholder="e.g. Christopher Nolan"
										value={director}
										onChange={(e) => setDirector(e.target.value)}
										disabled={isPending}
									/>
								</div>
								<div className="space-y-1.5">
									<Label>
										Release Year <span className="text-destructive">*</span>
									</Label>
									<Input
										type="number"
										placeholder="e.g. 2010"
										value={releaseYear}
										onChange={(e) => setReleaseYear(e.target.value)}
										disabled={isPending}
									/>
								</div>
							</div>
							<div className="space-y-1.5">
								<Label>
									Synopsis <span className="text-destructive">*</span>
								</Label>
								<Textarea
									placeholder="Brief description..."
									value={synopsis}
									onChange={(e) => setSynopsis(e.target.value)}
									disabled={isPending}
									rows={4}
								/>
							</div>
							<div className="space-y-1.5">
								<Label>
									Trailer URL <span className="text-muted-foreground text-xs">(optional)</span>
								</Label>
								<Input
									placeholder="https://youtube.com/..."
									value={trailerUrl}
									onChange={(e) => setTrailerUrl(e.target.value)}
									disabled={isPending}
								/>
							</div>
							<div className="space-y-1.5">
								<Label>
									Streaming URL <span className="text-muted-foreground text-xs">(optional)</span>
								</Label>
								<Input
									placeholder="https://..."
									value={streamingUrl}
									onChange={(e) => setStreamingUrl(e.target.value)}
									disabled={isPending}
								/>
							</div>
							<div className="grid grid-cols-3 gap-3">
								<div className="space-y-1.5">
									<Label>Rent Price</Label>
									<Input
										type="number"
										placeholder="0"
										value={rentPrice}
										onChange={(e) => setRentPrice(e.target.value)}
										disabled={isPending}
									/>
								</div>
								<div className="space-y-1.5">
									<Label>Buy Price</Label>
									<Input
										type="number"
										placeholder="0"
										value={buyPrice}
										onChange={(e) => setBuyPrice(e.target.value)}
										disabled={isPending}
									/>
								</div>
								<div className="space-y-1.5">
									<Label>Rent Duration</Label>
									<Select value={rentDuration} onValueChange={setRentDuration} disabled={isPending}>
										<SelectTrigger>
											<SelectValue placeholder="Select..." />
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
							<div className="flex items-center gap-2">
								<Checkbox
									id="featured"
									checked={isFeatured}
									onCheckedChange={(v) => setIsFeatured(Boolean(v))}
									disabled={isPending}
								/>
								<Label htmlFor="featured" className="cursor-pointer">
									Featured movie
								</Label>
							</div>
						</div>
					</div>

					{/* Genres, Platforms, Cast — full width */}
					<div className="space-y-1.5">
						<Label>Genres</Label>
						<div className="flex flex-wrap gap-2">
							{genres.map((g) => (
								<button
									key={g.id}
									type="button"
									onClick={() => toggleItem(g.id, selectedGenreIds, setSelectedGenreIds)}
									className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
										selectedGenreIds.includes(g.id)
											? "border-primary bg-primary text-primary-foreground"
											: "border-border bg-background hover:bg-muted"
									}`}
								>
									{g.name}
								</button>
							))}
						</div>
					</div>

					<div className="space-y-1.5">
						<Label>Platforms</Label>
						<div className="flex flex-wrap gap-2">
							{platforms.map((p) => (
								<button
									key={p.id}
									type="button"
									onClick={() => toggleItem(p.id, selectedPlatformIds, setSelectedPlatformIds)}
									className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
										selectedPlatformIds.includes(p.id)
											? "border-primary bg-primary text-primary-foreground"
											: "border-border bg-background hover:bg-muted"
									}`}
								>
									{p.name}
								</button>
							))}
						</div>
					</div>

					<div className="space-y-1.5">
						<Label>Cast Members</Label>
						<div className="flex flex-wrap gap-2">
							{castMembers.map((c) => (
								<button
									key={c.id}
									type="button"
									onClick={() => toggleItem(c.id, selectedCastIds, setSelectedCastIds)}
									className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
										selectedCastIds.includes(c.id)
											? "border-primary bg-primary text-primary-foreground"
											: "border-border bg-background hover:bg-muted"
									}`}
								>
									{c.name}
								</button>
							))}
						</div>
					</div>

					<div className="flex items-center justify-end gap-3 border-t pt-4">
						<DialogClose asChild>
							<Button type="button" variant="outline" disabled={isPending}>
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving..." : mode === "create" ? "Create" : "Save Changes"}
						</Button>
					</div>
				</form>
			</ScrollArea>
		</DialogContent>
	);

	if (mode === "create") {
		return (
			<Dialog open={internalOpen} onOpenChange={setInternalOpen}>
				<DialogTrigger asChild>
					<Button className="gap-2">
						<Plus className="h-4 w-4" />
						Add Movie
					</Button>
				</DialogTrigger>
				{content}
			</Dialog>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{content}
		</Dialog>
	);
};

export default MovieFormModal;
