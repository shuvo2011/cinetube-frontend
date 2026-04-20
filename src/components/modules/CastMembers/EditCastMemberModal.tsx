"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ICastMember } from "@/types/castMember.types";
import { updateCastMemberAction } from "@/app/(dashboard)/admin/dashboard/cast-members/_action";

interface EditCastMemberModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	castMember: ICastMember | null;
}

const EditCastMemberModal = ({ open, onOpenChange, castMember }: EditCastMemberModalProps) => {
	const [name, setName] = useState("");
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: ({ id, name }: { id: string; name: string }) => updateCastMemberAction(id, name),
	});

	useEffect(() => {
		if (castMember) setName(castMember.name);
	}, [castMember]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!castMember) return;
		if (!name.trim()) {
			toast.error("Name is required.");
			return;
		}
		const result = await mutateAsync({ id: castMember.id, name: name.trim() });
		if (!result.success) {
			toast.error(result.message || "Failed to update cast member.");
			return;
		}
		toast.success(result.message || "Cast member updated successfully.");
		onOpenChange(false);
		void queryClient.invalidateQueries({ queryKey: ["cast-members"] });
		void queryClient.refetchQueries({ queryKey: ["cast-members"], type: "active" });
		router.refresh();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>Edit Cast Member</DialogTitle>
					<DialogDescription>Update the name of the cast member.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} method="POST" action="#" noValidate className="space-y-4">
					<div className="space-y-1.5">
						<Label>Name</Label>
						<Input value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} />
					</div>
					<div className="flex items-center justify-end gap-3 border-t pt-4">
						<DialogClose asChild>
							<Button type="button" variant="outline" disabled={isPending}>
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default EditCastMemberModal;
