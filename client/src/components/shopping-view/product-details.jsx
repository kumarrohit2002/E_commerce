import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { Helmet } from "react-helmet";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({ title: "Review added successfully!" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

      return (
        <Dialog open={open} className='mt-20' onOpenChange={handleDialogClose}>
          <Helmet>
            <meta charSet="utf-8" />
            <title>{productDetails?.title}</title>
            <meta name="keywords" content={`best ${productDetails?.title}, ${productDetails?.title} in good price`} />
            <meta name="description" content={`${productDetails?.description}`} />
          </Helmet>
          <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[65vw]">
            <div className="flex flex-col md:flex-row gap-4 md:gap-5 p-2 sm:p-4 md:p-6">
              {/* Image Section */}
              <div className="relative overflow-hidden rounded-lg w-full md:w-1/2">
                <img
                  src={productDetails?.image}
                  alt={productDetails?.title}
                  className="w-full h-auto max-h-[400px] md:max-h-[500px] object-cover rounded-lg"
                />
              </div>
      
              {/* Details Section */}
              <div className="w-full md:w-1/2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">{productDetails?.title}</h1>
                <p className="text-muted-foreground text-lg sm:text-xl mb-4 mt-2">
                  {productDetails?.description}
                </p>
      
                {/* Price Section */}
                <div className="flex items-center justify-between">
                  <p className={`text-xl sm:text-2xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through" : ""}`}>
                    ${productDetails?.price}
                  </p>
                  {productDetails?.salePrice > 0 && (
                    <p className="text-xl sm:text-2xl font-bold text-red-600">${productDetails?.salePrice}</p>
                  )}
                </div>
      
                {/* Rating Section */}
                <div className="flex items-center gap-2 mt-2">
                  <StarRatingComponent rating={averageReview} />
                  <span className="text-muted-foreground text-sm">({averageReview.toFixed(2)})</span>
                </div>
      
                {/* Add to Cart Button */}
                <div className="mt-4">
                  {productDetails?.totalStock === 0 ? (
                    <Button className="w-full opacity-60 cursor-not-allowed">Out of Stock</Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
      
                <Separator className="my-4" />
      
                {/* Reviews Section */}
                <div className="max-h-[250px] overflow-auto">
                  <h2 className="text-lg sm:text-xl font-bold mb-4">Reviews</h2>
                  <div className="grid gap-4">
                    {reviews && reviews.length > 0 ? (
                      reviews.map((reviewItem, index) => (
                        <div key={index} className="flex gap-4">
                          <Avatar className="w-10 h-10 border">
                            <AvatarFallback>{reviewItem?.userName[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold">{reviewItem?.userName}</h3>
                            <StarRatingComponent rating={reviewItem?.reviewValue} />
                            <p className="text-muted-foreground">{reviewItem.reviewMessage}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No Reviews</p>
                    )}
                  </div>
      
                  {/* Add Review Section */}
                  <div className="mt-6">
                    <Label>Write a review</Label>
                    <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
                    <Input
                      name="reviewMsg"
                      value={reviewMsg}
                      onChange={(event) => setReviewMsg(event.target.value)}
                      placeholder="Write a review..."
                    />
                    <Button className="mt-2" onClick={handleAddReview} disabled={reviewMsg.trim() === ""}>
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
}

export default ProductDetailsDialog;
