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
import { ITag } from "@/types/tag.types";
import { deleteTagAction } from "@/app/(dashboard)/admin/dashboard/tags/_action";

interface DeleteTagDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	tag: ITag | null;
}

const DeleteTagDialog = ({ open, onOpenChange, tag }: DeleteTagDialogProps) => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: deleteTagAction,
	});

	const handleConfirmDelete = async () => {
		if (!tag) {
			toast.error("Tag not found.");
			return;
		}
		const result = await mutateAsync(tag.id);
		if (!result.success) {
			toast.error(result.message || "Failed to delete tag.");
			return;
		}
		toast.success(result.message || "Tag deleted successfully.");
		onOpenChange(false);
		void queryClient.invalidateQueries({ queryKey: ["tags"] });
		void queryClient.refetchQueries({ queryKey: ["tags"], type: "active" });
		router.refresh();
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Tag</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete <span className="font-semibold">{tag?.name ?? "this tag"}</span>? This
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

export default DeleteTagDialog;
