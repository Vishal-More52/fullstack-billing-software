import React, { useContext, useState, useMemo } from 'react'
import './CartSummery.css'
import { AppContext } from '../../context/AppContext'
import ReceiptPopup from '../ReceiptPopup/ReceiptPopup'
import { createOrder, deleteOrder } from '../../Service/OrderService'
import toast from "react-hot-toast"
import { createStripePaymentIntent, createCheckoutSession, verifyPayment, getPaymentIntentFromSession } from '../../Service/PaymentService'
import { AppConstants } from '../../util/constents'
import { loadStripe } from '@stripe/stripe-js'
const CartSummery = ({ customerName, mobileNumber, setCustomerName, setMobileNumber, clearCart }) => {

    // all states
    const { cartItems } = useContext(AppContext)
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const tax = totalAmount * 0.01;
    const grandTotal = totalAmount + tax;
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null)
    const [showPopup, setShowPopup] = useState(false)

    // Initialize Stripe once using useMemo to prevent multiple instances
    const stripePromise = useMemo(() => loadStripe(AppConstants.STRIPE_PUBLISHABLE_KEY), []);

    // clear the cart
    const clearAll = () => {
        setCustomerName("")
        setMobileNumber("")
        clearCart()
    }

    // place order funtion
    const placeOrder = () => {
        setShowPopup(true);
        clearAll();
    }

    // print receipt funtion
    const handlePrintReceipt = () => {
        window.print();
    }

    const deleteOrderOnfailure = async (orderId) => {
        try {
            await deleteOrder(orderId);
        } catch (error) {
            console.error(error);
            toast.error("something went wrong")
        }
    }

    const completePayment = async (paymentMode) => {
        if (!customerName || !mobileNumber) {
            toast.error("Please enter customer details")
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty")
            return;
        }

        const orderData = {
            customerName,
            phoneNumber: mobileNumber,
            cartItems,
            subtotal: totalAmount,
            tax,
            grandTotal,
            paymentMethod: paymentMode.toUpperCase()
        }
        setIsProcessing(true);


        try {
            const response = await createOrder(orderData);
            const savedData = response.data
            if (response.status === 201 && paymentMode === "cash") {
                toast.success("Cash received");
                setOrderDetails(savedData)
            } else if (response.status === 201 && paymentMode === "upi") {
                try {

                    const checkoutResponse = await createCheckoutSession({
                        amount: grandTotal,
                        currency: "INR",
                        orderId: savedData.orderId
                    });

                    // Store order data for verification after redirect
                    sessionStorage.setItem('pendingPayment', JSON.stringify({
                        orderId: savedData.orderId,
                        savedData
                    }));

                    // Redirect to Stripe Checkout
                    if (checkoutResponse.data && checkoutResponse.data.url) {
                        window.location.href = checkoutResponse.data.url;

                    } else {
                        throw new Error("Failed to create checkout session");
                    }
                } catch (error) {
                    console.error("Checkout session error:", error);
                    const errorMessage = error.response?.data?.message || error.message || "Failed to initiate payment";
                    toast.error(errorMessage);
                    await deleteOrderOnfailure(savedData.orderId);
                    sessionStorage.removeItem('pendingPayment');
                    setIsProcessing(false);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Payment processing failed")

        } finally {
            setIsProcessing(false);
        }
    }

    // Verify payment after Stripe Checkout redirect
    React.useEffect(() => {
        const verifyPaymentAfterRedirect = async () => {
            // Check URL parameters for Checkout Session redirect
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get('session_id');
            const orderIdFromUrl = urlParams.get('order_id');
            const canceled = urlParams.get('canceled');

            // Get pending payment from session storage
            const pendingPayment = sessionStorage.getItem('pendingPayment');

            // Handle cancellation
            if (canceled === 'true') {
                toast.error("Payment was cancelled");
                sessionStorage.removeItem('pendingPayment');
                window.history.replaceState({}, document.title, window.location.pathname);
                return;
            }

            // If we have a session_id, retrieve the checkout session to get payment intent
            if (sessionId && pendingPayment) {
                try {
                    setIsProcessing(true);
                    const parsed = JSON.parse(pendingPayment);
                    const orderId = parsed.orderId || orderIdFromUrl;
                    const savedData = parsed.savedData;

                    // Retrieve payment intent ID from checkout session via backend
                    const sessionResponse = await getPaymentIntentFromSession(sessionId);

                    if (sessionResponse.data && sessionResponse.data.paymentIntentId) {
                        const paymentIntentId = sessionResponse.data.paymentIntentId;

                        // Verify the payment
                        const paymentData = {
                            paymentIntentId,
                            orderId
                        };

                        const paymentResponse = await verifyPayment(paymentData);
                        if (paymentResponse.status === 200) {
                            toast.success("Payment successful");
                            setOrderDetails({
                                ...savedData,
                                paymentDetails: paymentResponse.data.paymentDetails || {
                                    stripePaymentIntentId: paymentIntentId,
                                    status: 'COMPLETED'
                                }
                            });
                        } else {
                            toast.error("Payment verification failed");
                        }
                    } else {
                        toast.error("Payment session not found");
                    }
                } catch (error) {
                    console.error("Payment verification error:", error);
                    const errorMessage = error.response?.data?.message || error.message || "Payment verification failed";
                    toast.error(errorMessage);
                } finally {
                    sessionStorage.removeItem('pendingPayment');
                    setIsProcessing(false);
                    // Clean URL parameters
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }
        };
        verifyPaymentAfterRedirect();
    }, []);

    return (
        <div className='mt-2'>
            <div className="cart-summary-details">

                <div className="d-flex justify-content-between mb-2">
                    <span className="text-white">Item :</span>
                    <span className="text-white">₹{totalAmount.toFixed(2)}</span>

                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Tax (1%) :</span>
                    <span className="text-light">₹{tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                    <span className="text-light">Total :</span>
                    <span className="text-light">₹{grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="d-flex gap-3">
                <button className="btn btn-success flex-grow-1"
                    onClick={() => completePayment("cash")} disabled={isProcessing}
                >
                    {isProcessing ? "Processing" : "Cash"}
                </button>
                <button className="btn btn-primary flex-grow-1"
                    onClick={() => completePayment("upi")} disabled={isProcessing}
                >
                    {isProcessing ? "Processing" : "UPI"}
                </button>

            </div>
            <div className="d-flex gap-3 mt-3">
                <button className="btn btn-warning flex-grow-1"
                    onClick={placeOrder} disabled={isProcessing || !orderDetails}
                >
                    Place Order
                </button>
            </div>
            {
                showPopup && orderDetails && (
                    <ReceiptPopup
                        orderDetails={{
                            ...orderDetails,
                            stripePaymentId: orderDetails.paymentDetails?.stripePaymentIntentId
                        }}
                        onClose={()=> setShowPopup(false)}
                        onPrint={handlePrintReceipt}
                    />
                )
            }
        </div>
    )
}

export default CartSummery
