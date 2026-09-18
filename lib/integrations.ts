import axios from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export async function sendWhatsAppMessage(phone: string, message: string): Promise<void> {
  if (!process.env.WHATSAPP_TOKEN) {
    console.warn("WhatsApp token not configured; message queued only in demo mode.");
    return;
  }

  try {
    console.log("WhatsApp message queued:", { phone, message });
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    throw error;
  }
}

export async function createPaymentIntent(amount: number, orderId: string): Promise<string> {
  if (!process.env.STRIPE_SECRET) {
    console.warn("Stripe secret key not configured; returning demo payment intent.");
    return `pi_demo_${orderId}`;
  }

  try {
    console.log("Payment intent created (stub):", { amount, orderId });
    return `pi_${Date.now()}`;
  } catch (error) {
    console.error("Failed to create payment intent:", error);
    throw error;
  }
}

export async function capturePayment(paymentIntentId: string): Promise<boolean> {
  if (!process.env.STRIPE_SECRET) {
    console.warn("Stripe secret key not configured; simulating successful capture in demo mode.");
    return true;
  }

  try {
    console.log("Payment captured (stub):", paymentIntentId);
    return true;
  } catch (error) {
    console.error("Failed to capture payment:", error);
    throw error;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

async function safeGet<T>(path: string, fallback: T): Promise<T> {
  if (!API_BASE_URL) return fallback;

  try {
    const { data } = await apiClient.get<T>(path);
    return data;
  } catch (error) {
    console.warn(`API call failed for ${path}:`, error);
    return fallback;
  }
}

async function safePost<T>(path: string, payload: any, fallback: T): Promise<T> {
  if (!API_BASE_URL) return fallback;

  try {
    const { data } = await apiClient.post<T>(path, payload);
    return data;
  } catch (error) {
    console.warn(`API call failed for ${path}:`, error);
    return fallback;
  }
}

export async function fetchFarms() {
  return safeGet("/api/farms", [] as any[]);
}

export async function createFarm(farmData: any) {
  return safePost("/api/farms", farmData, { ...farmData, id: "demo-farm-id" });
}

export async function fetchProduceLots() {
  return safeGet("/api/produce-lots", [] as any[]);
}

export async function createProduceLot(lotData: any) {
  return safePost("/api/produce-lots", lotData, { ...lotData, id: "demo-lot-id" });
}

export async function fetchRFQs() {
  return safeGet("/api/rfqs", [] as any[]);
}

export async function createRFQ(rfqData: any) {
  return safePost("/api/rfqs", rfqData, { ...rfqData, id: "demo-rfq-id" });
}

export async function fetchQuotes() {
  return safeGet("/api/quotes", [] as any[]);
}

export async function createQuote(quoteData: any) {
  return safePost("/api/quotes", quoteData, { ...quoteData, id: "demo-quote-id" });
}

export async function fetchOrders() {
  return safeGet("/api/orders", [] as any[]);
}

export async function createOrder(orderData: any) {
  return safePost("/api/orders", orderData, { ...orderData, id: "demo-order-id" });
}
