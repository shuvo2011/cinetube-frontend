"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
	DialogTrigger,
} from "@/components/ui/dialog";
import { createGenreAction } from "@/app/(dashboard)/admin/dashboard/genres/_action";
import { createGenreZodSchema } from "@/zod/genre.validation";

const CreateGenreModal = () => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [nameError, setNameError] = useState("");
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: createGenreAction,
		onError: (error: unknown) => {
			const message = error instanceof Error ? error.message : "Something went wrong.";
			toast.error(message);
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setNameError("");

		const parsed = createGenreZodSchema.safeParse({ name: name.trim() });
		if (!parsed.success) {
			const errorMessage = parsed.error.format().name?._errors?.[0] || "Name is required.";
			setNameError(errorMessage);
			toast.error(errorMessage);
			return;
		}

		try {
			const result = await mutateAsync(parsed.data.name);
			if (!result.success) {
				toast.error(result.message || "Failed to create genre.");
				return;
			}
			toast.success(result.message || "Genre created successfully.");
			setOpen(false);
			setName("");
			void queryClient.invalidateQueries({ queryKey: ["genres"] });
			void queryClient.refetchQueries({ queryKey: ["genres"], type: "active" });
			router.refresh();
		} catch {
			// onError handles it
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Add Genre
				</Button>
			</DialogTrigger>
			<DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>Add Genre</DialogTitle>
					<DialogDescription>Add a new genre to the media library.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} method="POST" action="#" noValidate className="space-y-4">
					<div className="space-y-1.5">
						<Label>Name</Label>
						<Input
							placeholder="e.g. Action"
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
							{isPending ? "Creating..." : "Create"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateGenreModal;
