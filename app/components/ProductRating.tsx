'use client';

import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';

interface Rating {
  _id: string;
  productId: string;
  rating: number;
  review?: string;
  userName: string;
  createdAt: string;
}

interface ProductRatingProps {
  productId: string;
}

export default function ProductRating({ productId }: ProductRatingProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRatings();
  }, [productId]);

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/ratings`);
      if (response.ok) {
        const data = await response.json();
        setRatings(data);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products/${productId}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: userRating, review, userName }),
      });

      if (response.ok) {
        await fetchRatings();
        setUserRating(0);
        setReview('');
        setUserName('');
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = ratings.length
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 'No ratings yet';

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
      
      <div className="mb-6">
        <p className="text-lg font-medium">Average Rating: {averageRating}</p>
        <p className="text-sm text-gray-500">{ratings.length} reviews</p>
      </div>

      <form onSubmit={handleSubmitRating} className="mb-8">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg mb-4"
          required
        />

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setUserRating(star)}
              className={`text-2xl ${
                star <= userRating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              <FiStar className={star <= userRating ? 'fill-current' : ''} />
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review (optional)"
          className="w-full p-3 border rounded-lg mb-4"
          rows={3}
        />

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={!userRating || isSubmitting}
          className="bg-black text-white px-6 py-2 rounded-full disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      <div className="space-y-4">
        {ratings.map((rating) => (
          <div key={rating._id} className="border-b pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`${
                      i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{rating.userName}</span>
            </div>
            {rating.review && (
              <p className="text-gray-600">{rating.review}</p>
            )}
            <p className="text-sm text-gray-400 mt-1">
              {new Date(rating.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 