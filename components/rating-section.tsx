"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import LoadingSpinner from "./loading-spinner"

interface Rating {
  id: number
  userName: string
  rating: number
  comment: string
  createdAt: string
}

interface RatingSectionProps {
  perfumeId: number
  canRate: boolean
}

export default function RatingSection({ perfumeId, canRate }: RatingSectionProps) {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [userRating, setUserRating] = useState<Rating | null>(null)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const { user, token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchRatings()
    if (user && token) {
      fetchUserRating()
    }
  }, [perfumeId, user, token])

  const fetchRatings = async () => {
    try {
      // Don't send auth headers for public endpoints
      const response = await apiClient.get(`/api/ratings/perfume/${perfumeId}`, {
        headers: {}
      })
      setRatings(response.data)
    } catch (error) {
      console.error("Failed to fetch ratings:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRating = async () => {
    try {
      const response = await apiClient.get(`/api/ratings/perfume/${perfumeId}/my-rating`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUserRating(response.data)
      setNewRating(response.data.rating)
      setNewComment(response.data.comment || "")
    } catch (error) {
      // User hasn't rated this perfume yet
    }
  }

  const handleSubmitRating = async () => {
    if (!user || !token) {
      toast({
        title: "Authentication required",
        description: "Please login to rate this perfume",
        variant: "destructive",
      })
      return
    }

    if (newRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const endpoint = userRating ? `/api/ratings/perfume/${perfumeId}` : `/api/ratings/perfume/${perfumeId}`

      const method = userRating ? "put" : "post"

      await apiClient[method](
        endpoint,
        {
          rating: newRating,
          comment: newComment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      toast({
        title: "Rating submitted",
        description: "Thank you for your review!",
      })

      fetchRatings()
      fetchUserRating()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Add/Edit Rating */}
      {user && canRate && (
        <Card>
          <CardHeader>
            <CardTitle>{userRating ? "Update Your Review" : "Write a Review"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setNewRating(star)} className="p-1">
                    <Star
                      className={`h-6 w-6 ${star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Comment (optional)</p>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this perfume..."
                rows={3}
              />
            </div>

            <Button onClick={handleSubmitRating} disabled={submitting}>
              {submitting ? "Submitting..." : userRating ? "Update Review" : "Submit Review"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>

        {ratings.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this perfume!</p>
        ) : (
          ratings.map((rating) => (
            <Card key={rating.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{rating.userName}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rating.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{new Date(rating.createdAt).toLocaleDateString()}</p>
                </div>
                {rating.comment && <p className="text-muted-foreground">{rating.comment}</p>}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
