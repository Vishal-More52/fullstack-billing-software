import axios from "axios";

export const createStripePaymentIntent = async (data) =>{
    return await axios.post(`http://localhost:8080/api/v1.0/payments/create-order`,data, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
}

export const createCheckoutSession = async (data) => {
    return await axios.post(`http://localhost:8080/api/v1.0/payments/create-checkout`, data, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
}

export const verifyPayment = async (paymentData)=>{
    return await axios.post('http://localhost:8080/api/v1.0/payments/verify',paymentData,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
    )
}

export const getPaymentIntentFromSession = async (sessionId) => {
    return await axios.post('http://localhost:8080/api/v1.0/payments/session-payment-intent', 
        { sessionId },
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
    )
}