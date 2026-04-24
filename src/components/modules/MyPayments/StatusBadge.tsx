import { IPayment } from "@/services/payment.services";

const StatusBadge = ({ status }: { status: IPayment["status"] }) => {
	const map = {
		COMPLETED: "bg-green-50 text-green-600 border-green-200",
		PENDING: "bg-yellow-50 text-yellow-600 border-yellow-200",
		FAILED: "bg-red-50 text-red-500 border-red-200",
		REFUNDED: "bg-gray-50 text-gray-500 border-gray-200",
	};

	return <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${map[status]}`}>{status}</span>;
};

export default StatusBadge;
