"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Camera } from "lucide-react";
import { getMyProfile, updateMyProfile, changeEmailAndLogout } from "@/services/user.services";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfileZodSchema as profileSchema } from "@/zod/profile.validation";

const UserProfileForm = () => {
	const qc = useQueryClient();

	const { data: profileRes, isLoading } = useQuery({ queryKey: ["me"], queryFn: getMyProfile });
	const profile = profileRes?.data ?? null;

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [preview, setPreview] = useState<string | null>(null);
	const [imageJustSaved, setImageJustSaved] = useState(false);
	const prevObjectUrl = useRef<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [isChangeEmailDisabled, setIsChangeEmailDisabled] = useState(false);
	const [isEmailChangePending, setIsEmailChangePending] = useState(false);

	useEffect(() => {
		if (profile) {
			setName(profile.name ?? "");
			setEmail(profile.email ?? "");
			setPreview(profile.image ?? null);
		}
	}, [profile]);

	useEffect(() => {
		return () => {
			if (prevObjectUrl.current) {
				URL.revokeObjectURL(prevObjectUrl.current);
				prevObjectUrl.current = null;
			}
		};
	}, []);

	// Separate mutation just for image auto-upload
	const imageMutation = useMutation({
		mutationFn: (fd: FormData) => updateMyProfile(fd),
		onSuccess: (res) => {
			const newUrl = res?.data?.image ?? null;
			if (prevObjectUrl.current) {
				URL.revokeObjectURL(prevObjectUrl.current);
				prevObjectUrl.current = null;
			}
			setPreview(newUrl);
			setImageJustSaved(true);
			setTimeout(() => setImageJustSaved(false), 2500);
			qc.invalidateQueries({ queryKey: ["me"] });
			qc.invalidateQueries({ queryKey: ["user-stats"] });
		},
		onError: () => {
			setPreview(profile?.image ?? null);
			toast.error("Failed to upload image");
		},
	});

	const saveMutation = useMutation({
		mutationFn: (fd: FormData) => updateMyProfile(fd),
		onSuccess: () => {
			toast.success("Profile updated");
			qc.invalidateQueries({ queryKey: ["me"] });
			qc.invalidateQueries({ queryKey: ["user-stats"] });
		},
		onError: () => {
			toast.error("Failed to update profile");
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0] ?? null;
		if (!f) return;

		// Show local preview immediately
		const url = URL.createObjectURL(f);
		if (prevObjectUrl.current) URL.revokeObjectURL(prevObjectUrl.current);
		prevObjectUrl.current = url;
		setPreview(url);
		setImageJustSaved(false);

		// Auto-upload
		const fd = new FormData();
		fd.append("file", f);
		imageMutation.mutate(fd);
	};

	const handleRemoveImage = () => {
		if (imageMutation.isPending) return;
		if (prevObjectUrl.current) {
			URL.revokeObjectURL(prevObjectUrl.current);
			prevObjectUrl.current = null;
		}
		setPreview(null);
		setImageJustSaved(false);
		if (fileInputRef.current) fileInputRef.current.value = "";

		const fd = new FormData();
		fd.append("image", "");
		imageMutation.mutate(fd);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const parsed = profileSchema.safeParse({ name: name?.trim(), email: email?.trim() });
		if (!parsed.success) return toast.error(parsed.error.issues[0].message);

		const fd = new FormData();
		if (name) fd.append("name", name.trim());

		try {
			await saveMutation.mutateAsync(fd);
		} catch (err) {
			console.error(err);
		}
	};

	const handleChangeEmail = async () => {
		if (isChangeEmailDisabled) {
			return toast.error("Changing email is currently disabled on this account.");
		}
		const newEmail = email?.trim();
		const parsed = profileSchema.pick({ email: true }).safeParse({ email: newEmail });
		if (!parsed.success) return toast.error(parsed.error.issues[0].message);

		if (profile?.email && newEmail === profile.email) {
			return toast.error("This is already your current email address.");
		}

		try {
			setIsEmailChangePending(true);
			await changeEmailAndLogout(newEmail);
		} catch (err: any) {
			const msg = err?.message ?? "Failed to change email";
			toast.error(msg);
			if (/change email is disabled/i.test(msg)) setIsChangeEmailDisabled(true);
		} finally {
			setIsEmailChangePending(false);
		}
	};

	if (isLoading) return <div>Loading...</div>;

	const isImageUploading = imageMutation.isPending;

	return (
		<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div className="md:col-span-1">
				<div className="bg-bg border border-line rounded-xl p-4 flex flex-col items-center gap-3">
					{/* Avatar with upload overlay */}
					<div className="relative w-28 h-28">
						{preview ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={preview} alt="avatar" className="w-28 h-28 rounded-full object-cover" />
						) : (
							<div className="w-28 h-28 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
								{profile?.name
									? profile.name
											.split(" ")
											.map((n: string) => n[0])
											.slice(0, 2)
											.join("")
									: "U"}
							</div>
						)}

						{/* Uploading spinner overlay */}
						{isImageUploading && (
							<div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
								<Loader2 className="w-7 h-7 text-white animate-spin" />
							</div>
						)}

						{/* Saved checkmark overlay */}
						{imageJustSaved && !isImageUploading && (
							<div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
								<CheckCircle2 className="w-7 h-7 text-green-400" />
							</div>
						)}

						{/* Click-to-change overlay (idle state) */}
						{!isImageUploading && !imageJustSaved && (
							<label className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors cursor-pointer group">
								<Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
								<input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
							</label>
						)}
					</div>

					<p className="text-[11px] text-text-muted text-center">
						{isImageUploading ? "Uploading..." : imageJustSaved ? "Image saved!" : "Click photo to change"}
					</p>
				</div>
			</div>

			<div className="md:col-span-2 space-y-4">
				<div className="bg-bg border border-line rounded-xl p-4 grid grid-cols-1 gap-3">
					<label className="text-[12px] text-text-muted">Full name</label>
					<Input value={name} onChange={(e) => setName(e.target.value)} />

					<label className="text-[12px] text-text-muted">Email</label>
					<div className="flex gap-2">
						<Input value={email} onChange={(e) => setEmail(e.target.value)} />
						<Button type="button" variant="outline" onClick={handleChangeEmail} disabled={isEmailChangePending}>
							{isEmailChangePending ? "Sending..." : "Change Email"}
						</Button>
					</div>

					<div className="pt-3">
						<Button type="submit" disabled={saveMutation.isPending}>
							{saveMutation.isPending ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
};

export default UserProfileForm;
