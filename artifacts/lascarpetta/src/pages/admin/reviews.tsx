import { useState } from "react";
import { useGetAdminMe, useListReviews, useApproveReview, getListReviewsQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import AdminLayout from "./layout";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Star, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-3 h-3 ${rating >= s ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const { data: me } = useGetAdminMe();
  const [, setLocation] = useLocation();
  const [showPending, setShowPending] = useState(true);
  const { toast } = useToast();
  const qc = useQueryClient();
  const approveReview = useApproveReview();

  useEffect(() => {
    if (me !== undefined && !me?.authenticated) setLocation("/admin/login");
  }, [me]);

  const params = showPending ? { approved: false } : {};
  const { data: reviews, isLoading } = useListReviews(params as any);

  const handleApprove = async (id: number, approved: boolean) => {
    try {
      await approveReview.mutateAsync({ id, data: { approved } });
      qc.invalidateQueries({ queryKey: getListReviewsQueryKey(params as any) });
      toast({ title: approved ? "Review approved" : "Review rejected" });
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl">Reviews</h1>
          <div className="flex gap-2">
            <Button
              variant={showPending ? "default" : "outline"}
              size="sm"
              className="rounded-none"
              onClick={() => setShowPending(true)}
            >
              Pending
            </Button>
            <Button
              variant={!showPending ? "default" : "outline"}
              size="sm"
              className="rounded-none"
              onClick={() => setShowPending(false)}
            >
              All Approved
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-4">
            {reviews?.map((r) => (
              <div key={r.id} className="bg-card border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">{r.authorName}</span>
                      <Stars rating={r.rating} />
                      {r.source && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{r.source}</span>}
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm italic">"{r.text}"</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {!r.approved && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-none border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => handleApprove(r.id, true)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-none border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => handleApprove(r.id, false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {reviews?.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">
                {showPending ? "No pending reviews" : "No approved reviews"}
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
