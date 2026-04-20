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
import { ICastMember } from "@/types/castMember.types";
import { deleteCastMemberAction } from "@/app/(dashboard)/admin/dashboard/cast-members/_action";

interface DeleteCastMemberDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	castMember: ICastMember | null;
}

const DeleteCastMemberDialog = ({ open, onOpenChange, castMember }: DeleteCastMemberDialogProps) => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: deleteCastMemberAction,
	});

	const handleConfirmDelete = async () => {
		if (!castMember) {
			toast.error("Cast member not found.");
			return;
		}
		const result = await mutateAsync(castMember.id);
		if (!result.success) {
			toast.error(result.message || "Failed to delete cast member.");
			return;
		}
		toast.success(result.message || "Cast member deleted successfully.");
		onOpenChange(false);
		void queryClient.invalidateQueries({ queryKey: ["cast-members"] });
		void queryClient.refetchQueries({ queryKey: ["cast-members"], type: "active" });
		router.refresh();
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Cast Member</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete{" "}
						<span className="font-semibold">{castMember?.name ?? "this cast member"}</span>? This action cannot be
						undone.
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

export default DeleteCastMemberDialog;
