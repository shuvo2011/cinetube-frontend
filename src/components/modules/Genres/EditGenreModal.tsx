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
import { IGenre } from "@/types/genre.types";
import { updateGenreAction } from "@/app/(dashboard)/admin/dashboard/genres/_action";
import { updateGenreZodSchema } from "@/zod/genre.validation";

interface EditGenreModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	genre: IGenre | null;
}

const EditGenreModal = ({ open, onOpenChange, genre }: EditGenreModalProps) => {
	const [name, setName] = useState("");
	const [nameError, setNameError] = useState("");
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: ({ id, name }: { id: string; name: string }) => updateGenreAction(id, name),
	});

	useEffect(() => {
		if (open && genre) setName(genre.name);
	}, [open, genre]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!genre) return;
		setNameError("");

		const parsed = updateGenreZodSchema.safeParse({ name: name.trim() });
		if (!parsed.success) {
			const errorMessage = parsed.error.format().name?._errors?.[0] || "Name is required.";
			setNameError(errorMessage);
			toast.error(errorMessage);
			return;
		}
		const result = await mutateAsync({ id: genre.id, name: parsed.data.name });
		if (!result.success) {
			toast.error(result.message || "Failed to update genre.");
			return;
		}
		toast.success(result.message || "Genre updated successfully.");
		onOpenChange(false);
		void queryClient.invalidateQueries({ queryKey: ["genres"] });
		void queryClient.refetchQueries({ queryKey: ["genres"], type: "active" });
		router.refresh();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>Edit Genre</DialogTitle>
					<DialogDescription>Update the genre name.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} method="POST" action="#" noValidate className="space-y-4">
					<div className="space-y-1.5">
						<Label>Name</Label>
						<Input
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								setNameError("");
							}}
							disabled={isPending}
						/>
						{nameError ? <p className="text-sm text-red-600">{nameError}</p> : null}
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

export default EditGenreModal;
