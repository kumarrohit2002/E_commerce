import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import { Helmet } from "react-helmet";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Helmet>
        <meta charSet="utf-8" />
        <title>E Commerce</title>
        <link rel="canonical" href="http://mysite.com/example" />
        <meta name="keywords" content="
                                      Dresses online,Buy dresses
                                      Women's dresses,Designer dresses,
                                      Affordable dresses,Cocktail dresses,
                                      Evening dresses,Summer dresses,
                                      Formal dresses,Casual dresses,
                                      Maxi dresses,Mini dresses,
                                      Wrap dresses,Wedding guest cloth,
                                      Party dresses,Prom dresses,
                                      Special occasion cloth,Floral dresses,
                                      Lace dresses,Satin dresses,
                                      Long sleeve dresses,Plus size dresses,
                                      Dresses panjab,Boutiques dresses,
                                      Where to buy affordable cocktail dresses online,Best summer dresses for women over 50,
                                      Formal dresses for wedding guests in [Season]," />

        <meta name="description" content="The Dresser: Your Online Destination for Men's, Women's, and Kids' Fashion.
                                          Discover the latest trends and timeless styles at The Dresser. We offer a wide selection of clothing, footwear, 
                                          and accessories for the whole family. From everyday essentials to statement pieces, find everything you need to 
                                          elevate your wardrobe. Shop our extensive collection of men's shirts, women's dresses, kids' wear, shoes, and more. 
                                          At The Dresser, we believe in quality, style, and making fashion accessible to everyone. Browse our categories and 
                                          find your perfect fit today!" 
                                                                      />
      </Helmet>

      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
