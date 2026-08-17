import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// WhatsApp Integration Stub
export async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<void> {
  if (!process.env.WHATSAPP_TOKEN) {
    console.warn("WhatsApp token not configured");
    return;
  }

  try {
    // TODO: Integrate with WhatsApp Business API or Twilio
    // Example with Twilio:
    // const twilio = require('twilio')(accountSid, authToken);
    // await twilio.messages.create({
    //   body: message,
    //   from: '+1234567890',
    //   to: phone,
    // });

    console.log("WhatsApp message queued:", { phone, message });
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    throw error;
  }
}

// Stripe Integration Stub
export async function createPaymentIntent(
  amount: number,
  orderId: string
): Promise<string> {
  if (!process.env.STRIPE_SECRET) {
    throw new Error("Stripe secret key not configured");
  }

  try {
    // TODO: Initialize Stripe with server-side secret
    // const stripe = require("stripe")(process.env.STRIPE_SECRET);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: amount * 100, // Amount in cents
    //   currency: 'usd',
    //   metadata: { orderId },
    // });
    // return paymentIntent.client_secret;

    console.log("Payment intent created (stub):", { amount, orderId });
    return "pi_stub_" + Math.random().toString(36);
  } catch (error) {
    console.error("Failed to create payment intent:", error);
    throw error;
  }
}

export async function capturePayment(
  paymentIntentId: string
): Promise<boolean> {
  if (!process.env.STRIPE_SECRET) {
    throw new Error("Stripe secret key not configured");
  }

  try {
    // TODO: Confirm payment with Stripe
    // const stripe = require("stripe")(process.env.STRIPE_SECRET);
    // const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    // return paymentIntent.status === 'succeeded';

    console.log("Payment captured (stub):", paymentIntentId);
    return true;
  } catch (error) {
    console.error("Failed to capture payment:", error);
    throw error;
  }
}

// Generic API client
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchFarms() {
  const { data } = await apiClient.get("/api/farms");
  return data;
}

export async function createFarm(farmData: any) {
  const { data } = await apiClient.post("/api/farms", farmData);
  return data;
}

export async function fetchProduceLots() {
  const { data } = await apiClient.get("/api/produce-lots");
  return data;
}

export async function createProduceLot(lotData: any) {
  const { data } = await apiClient.post("/api/produce-lots", lotData);
  return data;
}

export async function fetchRFQs() {
  const { data } = await apiClient.get("/api/rfqs");
  return data;
}

export async function createRFQ(rfqData: any) {
  const { data } = await apiClient.post("/api/rfqs", rfqData);
  return data;
}

export async function fetchQuotes() {
  const { data } = await apiClient.get("/api/quotes");
  return data;
}

export async function createQuote(quoteData: any) {
  const { data } = await apiClient.post("/api/quotes", quoteData);
  return data;
}

export async function fetchOrders() {
  const { data } = await apiClient.get("/api/orders");
  return data;
}

export async function createOrder(orderData: any) {
  const { data } = await apiClient.post("/api/orders", orderData);
  return data;
}
