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
import { createCastMemberAction } from "@/app/(dashboard)/admin/dashboard/cast-members/_action";

const CreateCastMemberModal = () => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: createCastMemberAction,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Name is required.");
			return;
		}
		const result = await mutateAsync(name.trim());
		if (!result.success) {
			toast.error(result.message || "Failed to create cast member.");
			return;
		}
		toast.success(result.message || "Cast member created successfully.");
		setOpen(false);
		setName("");
		void queryClient.invalidateQueries({ queryKey: ["cast-members"] });
		void queryClient.refetchQueries({ queryKey: ["cast-members"], type: "active" });
		router.refresh();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Add Cast Member
				</Button>
			</DialogTrigger>
			<DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>Add Cast Member</DialogTitle>
					<DialogDescription>Enter the name of the cast member to add.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} method="POST" action="#" noValidate className="space-y-4">
					<div className="space-y-1.5">
						<Label>Name</Label>
						<Input
							placeholder="e.g. Leonardo DiCaprio"
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={isPending}
						/>
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

export default CreateCastMemberModal;
