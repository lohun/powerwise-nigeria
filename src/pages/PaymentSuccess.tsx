import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function PaymentSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Mark as unlocked
        localStorage.setItem("powerwise_unlocked", "true");

        // 2. Retrieve pending ID
        const pendingId = localStorage.getItem("pendingRecommendationId");

        // 3. Redirect after a brief delay
        const timeout = setTimeout(() => {
            if (pendingId) {
                navigate(`/recommendations/${pendingId}`);
            } else {
                navigate("/assessment");
            }
        }, 2000);

        return () => clearTimeout(timeout);
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h1 className="text-2xl font-bold font-display">Payment Successful!</h1>
            <p className="text-muted-foreground">Unlocking your personalized recommendation...</p>
        </div>
    );
}
