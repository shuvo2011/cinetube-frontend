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
import { IPlatform } from "@/types/platform.types";
import { updatePlatformAction } from "@/app/(dashboard)/admin/dashboard/platforms/_action";

interface EditPlatformModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	platform: IPlatform | null;
}

const EditPlatformModal = ({ open, onOpenChange, platform }: EditPlatformModalProps) => {
	const [name, setName] = useState("");
	const [logo, setLogo] = useState("");
	const [website, setWebsite] = useState("");
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: { name: string; logo?: string; website?: string } }) =>
			updatePlatformAction(id, payload),
	});

	useEffect(() => {
		if (platform) {
			setName(platform.name);
			setLogo(platform.logo ?? "");
			setWebsite(platform.website ?? "");
		}
	}, [platform]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!platform) return;
		if (!name.trim()) {
			toast.error("Name is required.");
			return;
		}
		const result = await mutateAsync({
			id: platform.id,
			payload: {
				name: name.trim(),
				logo: logo.trim() || undefined,
				website: website.trim() || undefined,
			},
		});
		if (!result.success) {
			toast.error(result.message || "Failed to update platform.");
			return;
		}
		toast.success(result.message || "Platform updated successfully.");
		onOpenChange(false);
		void queryClient.invalidateQueries({ queryKey: ["platforms"] });
		void queryClient.refetchQueries({ queryKey: ["platforms"], type: "active" });
		router.refresh();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>Edit Platform</DialogTitle>
					<DialogDescription>Update the streaming platform details.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} method="POST" action="#" noValidate className="space-y-4">
					<div className="space-y-1.5">
						<Label>
							Name <span className="text-destructive">*</span>
						</Label>
						<Input value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} />
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
							placeholder="https://..."
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
							{isPending ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default EditPlatformModal;
