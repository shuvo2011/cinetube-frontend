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
import { IGenre } from "@/types/genre.types";
import { deleteGenreAction } from "@/app/(dashboard)/admin/dashboard/genres/_action";

interface DeleteGenreDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	genre: IGenre | null;
}

const DeleteGenreDialog = ({ open, onOpenChange, genre }: DeleteGenreDialogProps) => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: deleteGenreAction,
	});

	const handleConfirmDelete = async () => {
		if (!genre) {
			toast.error("Genre not found.");
			return;
		}
		const result = await mutateAsync(genre.id);
		if (!result.success) {
			toast.error(result.message || "Failed to delete genre.");
			return;
		}
		toast.success(result.message || "Genre deleted successfully.");
		onOpenChange(false);
		void queryClient.invalidateQueries({ queryKey: ["genres"] });
		void queryClient.refetchQueries({ queryKey: ["genres"], type: "active" });
		router.refresh();
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Genre</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete <span className="font-semibold">{genre?.name ?? "this genre"}</span>? This
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

export default DeleteGenreDialog;
