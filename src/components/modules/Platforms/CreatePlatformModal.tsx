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
import { createPlatformAction } from "@/app/(dashboard)/admin/dashboard/platforms/_action";

const CreatePlatformModal = () => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [logo, setLogo] = useState("");
	const [website, setWebsite] = useState("");
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: createPlatformAction,
		onError: (error: unknown) => {
			const message = error instanceof Error ? error.message : "Something went wrong.";
			toast.error(message);
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Name is required.");
			return;
		}
		try {
			const result = await mutateAsync({
				name: name.trim(),
				logo: logo.trim() || undefined,
				website: website.trim() || undefined,
			});
			if (!result.success) {
				toast.error(result.message || "Failed to create platform.");
				return;
			}
			toast.success(result.message || "Platform created successfully.");
			setOpen(false);
			setName("");
			setLogo("");
			setWebsite("");
			void queryClient.invalidateQueries({ queryKey: ["platforms"] });
			void queryClient.refetchQueries({ queryKey: ["platforms"], type: "active" });
			router.refresh();
		} catch {}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Add Platform
				</Button>
			</DialogTrigger>
			<DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>Add Platform</DialogTitle>
					<DialogDescription>Add a new streaming platform to the library.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} method="POST" action="#" noValidate className="space-y-4">
					<div className="space-y-1.5">
						<Label>
							Name <span className="text-destructive">*</span>
						</Label>
						<Input
							placeholder="e.g. Netflix"
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={isPending}
						/>
					</div>
					<div className="space-y-1.5">
						<Label>
							Logo URL <span className="text-muted-foreground text-xs">(optional)</span>
						</Label>
						<Input
							placeholder="https://..."
							value={logo}
							onChange={(e) => setLogo(e.target.value)}
							disabled={isPending}
						/>
					</div>
					<div className="space-y-1.5">
						<Label>
							Website <span className="text-muted-foreground text-xs">(optional)</span>
						</Label>
						<Input
							placeholder="https://netflix.com"
							value={website}
							onChange={(e) => setWebsite(e.target.value)}
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

export default CreatePlatformModal;
