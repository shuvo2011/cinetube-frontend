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
import { ITag } from "@/types/tag.types";
import { updateTagAction } from "@/app/(dashboard)/admin/dashboard/tags/_action";

interface EditTagModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	tag: ITag | null;
}

const EditTagModal = ({ open, onOpenChange, tag }: EditTagModalProps) => {
	const [name, setName] = useState("");
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: ({ id, name }: { id: string; name: string }) => updateTagAction(id, name),
		onError: (error: unknown) => {
			toast.error(error instanceof Error ? error.message : "Something went wrong.");
		},
	});

	useEffect(() => {
		if (open && tag) setName(tag.name);
	}, [open, tag]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!tag) return;
		if (!name.trim()) {
			toast.error("Name is required.");
			return;
		}
		try {
			const result = await mutateAsync({ id: tag.id, name: name.trim() });
			if (!result.success) {
				toast.error(result.message || "Failed to update tag.");
				return;
			}
			toast.success(result.message || "Tag updated successfully.");
			onOpenChange(false);
			void queryClient.invalidateQueries({ queryKey: ["tags"] });
			void queryClient.refetchQueries({ queryKey: ["tags"], type: "active" });
			router.refresh();
		} catch {}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>Edit Tag</DialogTitle>
					<DialogDescription>Update the tag name.</DialogDescription>
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

export default EditTagModal;
