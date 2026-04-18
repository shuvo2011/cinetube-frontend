import { Loader2 } from "lucide-react";

const GlobalLoading = () => {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="relative">
					<span className="text-2xl font-medium tracking-wide">
						<span className="text-foreground">Cine</span>
						<span className="text-destructive">Tube</span>
					</span>
				</div>
				<Loader2 className="text-destructive h-8 w-8 animate-spin" />
			</div>
		</div>
	);
};

export default GlobalLoading;
