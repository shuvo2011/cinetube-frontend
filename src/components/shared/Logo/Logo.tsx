import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import Link from "next/link";

interface LogoProps {
	className?: string;
}

const Logo = ({ className }: LogoProps) => {
	return (
		<Link href="/" className="flex items-center gap-2 shrink-0">
			<span className="w-7.5 h-7.5 rounded-lg bg-brand flex items-center justify-center shadow-[0_2px_6px_rgba(239,76,92,0.28)] shrink-0">
				<Play size={16} className="text-white" />
			</span>
			<span className={cn("text-[22px] font-extrabold tracking-[-0.03em] text-ink", className)}>
				Cine<span className="text-brand">Tube</span>
			</span>
		</Link>
	);
};

export default Logo;
