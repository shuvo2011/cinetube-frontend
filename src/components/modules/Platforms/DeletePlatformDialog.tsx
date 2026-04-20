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
import { IPlatform } from "@/types/platform.types";
import { deletePlatformAction } from "@/app/(dashboard)/admin/dashboard/platforms/_action";

interface DeletePlatformDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	platform: IPlatform | null;
}

const DeletePlatformDialog = ({ open, onOpenChange, platform }: DeletePlatformDialogProps) => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: deletePlatformAction,
	});

	const handleConfirmDelete = async () => {
		if (!platform) {
			toast.error("Platform not found.");
			return;
		}
		const result = await mutateAsync(platform.id);
		if (!result.success) {
			toast.error(result.message || "Failed to delete platform.");
			return;
		}
		toast.success(result.message || "Platform deleted successfully.");
		onOpenChange(false);
		void queryClient.invalidateQueries({ queryKey: ["platforms"] });
		void queryClient.refetchQueries({ queryKey: ["platforms"], type: "active" });
		router.refresh();
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Platform</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete <span className="font-semibold">{platform?.name ?? "this platform"}</span>?
						This action cannot be undone.
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

export default DeletePlatformDialog;
