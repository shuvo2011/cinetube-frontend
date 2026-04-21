import { Suspense } from "react";
import PlatformsTable from "@/components/modules/Platforms/PlatformsTable";

export default async function PlatformsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
	const resolvedParams = await searchParams;
	const initialQueryString = new URLSearchParams(resolvedParams).toString();

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-2xl font-semibold tracking-tight">Platforms</h2>
				<p className="text-muted-foreground mt-1 text-sm">Manage streaming platforms in the media library.</p>
			</div>
			<Suspense>
				<PlatformsTable initialQueryString={initialQueryString} />
			</Suspense>
		</div>
	);
}
