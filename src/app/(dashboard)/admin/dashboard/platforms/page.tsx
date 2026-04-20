import { Suspense } from "react";
import PlatformsTable from "@/components/modules/Platforms/PlatformsTable";

export default function PlatformsPage({ searchParams }: { searchParams: Record<string, string> }) {
	const initialQueryString = new URLSearchParams(searchParams).toString();

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
