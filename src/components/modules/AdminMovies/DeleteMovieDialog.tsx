"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IMovie } from "@/types/movie.types";
import { deleteMovieAction } from "@/app/(dashboard)/admin/dashboard/movies/_action";

interface DeleteMovieDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	movie: IMovie | null;
}

const DeleteMovieDialog = ({ open, onOpenChange, movie }: DeleteMovieDialogProps) => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: deleteMovieAction,
	});

	const handleConfirmDelete = async () => {
		if (!movie) {
			toast.error("Movie not found.");
			return;
		}

		const result = await mutateAsync(movie.id);

		if (!result.success) {
			toast.error(result.message || "Failed to delete movie.");
			return;
		}

		toast.success(result.message || "Movie deleted successfully.");
		onOpenChange(false);
		await queryClient.invalidateQueries({ queryKey: ["movies"] });
		router.refresh();
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Movie</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete <span className="font-semibold">{movie?.title ?? "this movie"}</span>? This
						action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						disabled={isPending}
						onClick={(e) => {
							e.preventDefault();
							void handleConfirmDelete();
						}}
					>
						{isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteMovieDialog;
