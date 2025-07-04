import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

interface OrderItem {
  quantity: number;
  name: string;
  description: string;
  price: number;
}

interface OrderData {
  customerPhone: string;
  deliveryMethod: "delivery" | "pickup";
  cart: OrderItem[];
  deliveryAddress?: string;
  pickupLocation?: string;
  orderNumber?: string;
  orderDate?: string;
  totalAmount?: number;
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function calculateTotal(cart: OrderItem[]): number {
  return cart.reduce(
    (total: number, item: OrderItem) => total + item.price * item.quantity,
    0
  );
}

function formatDate(dateString?: string): string {
  if (!dateString) {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function generateReceiptHTML(order: OrderData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Confirmación de Pedido</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
          }
          #order-confirmation {
            width: 400px;
            min-height: 600px;
            background-color: #ffffff;
            font-family: Arial, sans-serif;
            padding: 20px;
            box-sizing: border-box;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            margin: 0 auto;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #ff6b35;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #ff6b35;
            margin: 0 0 5px 0;
            font-size: 28px;
            font-weight: bold;
          }
          .header p {
            color: #666;
            margin: 0;
            font-size: 14px;
          }
          .order-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
          }
          .order-info div {
            margin-bottom: 10px;
          }
          .order-info strong {
            color: #333;
          }
          .order-info span {
            margin-left: 10px;
            color: #666;
          }
          .delivery-info {
            background-color: #e8f5e8;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            border: 1px solid #28a745;
          }
          .pickup-info {
            background-color: #e8f4fd;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            border: 1px solid #007bff;
          }
          .delivery-info strong, .pickup-info strong {
            color: #28a745;
          }
          .pickup-info strong {
            color: #007bff;
          }
          .delivery-info p, .pickup-info p {
            margin: 5px 0 0 0;
            color: #333;
          }
          .order-items h3 {
            color: #333;
            border-bottom: 2px solid #ff6b35;
            padding-bottom: 8px;
            margin-bottom: 15px;
          }
          .order-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .item-details {
            flex: 1;
          }
          .item-name {
            font-weight: bold;
            color: #333;
            font-size: 16px;
          }
          .item-description {
            color: #666;
            font-size: 14px;
            font-style: italic;
            margin-top: 2px;
          }
          .item-price {
            font-weight: bold;
            color: #ff6b35;
            font-size: 16px;
          }
          .total {
            border-top: 3px solid #ff6b35;
            padding-top: 15px;
            text-align: right;
          }
          .total div {
            font-size: 20px;
            font-weight: bold;
            color: #333;
          }
          .total span {
            color: #ff6b35;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
          }
          .footer p {
            margin: 0 0 5px 0;
          }
          .method-delivery {
            color: #28a745;
            text-transform: capitalize;
            font-weight: bold;
          }
          .method-pickup {
            color: #007bff;
            text-transform: capitalize;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div id="order-confirmation">
          <div class="header">
            <h1>🍔 LUIGI'S BURGER</h1>
            <p>Confirmación de Pedido</p>
          </div>
          
          <div class="order-info">
            <div>
              <strong>Pedido #:</strong> 
              <span>${
                order.orderNumber || `ORD-${Date.now().toString().slice(-6)}`
              }</span>
            </div>
            <div>
              <strong>Fecha:</strong> 
              <span>${formatDate(order.orderDate)}</span>
            </div>
            <div>
              <strong>Teléfono:</strong> 
              <span>${order.customerPhone}</span>
            </div>
            <div>
              <strong>Método de entrega:</strong> 
              <span class="method-${order.deliveryMethod}">${
    order.deliveryMethod
  }</span>
            </div>
          </div>
          
          ${
            order.deliveryMethod === "delivery" && order.deliveryAddress
              ? `
          <div class="delivery-info">
            <strong>📍 Dirección de entrega:</strong>
            <p>${order.deliveryAddress}</p>
          </div>
        `
              : ""
          }
          
          ${
            order.deliveryMethod === "pickup" && order.pickupLocation
              ? `
          <div class="pickup-info">
            <strong>🏪 Pickup Location:</strong>
            <p>${order.pickupLocation}</p>
          </div>
        `
              : ""
          }
          
          <div class="order-items">
            <h3>📋 Artículos</h3>
            ${order.cart
              .map(
                (item) => `
              <div class="order-item">
                <div class="item-details">
                  <div class="item-name">${item.quantity}x ${item.name}</div>
                  ${
                    item.description
                      ? `<div class="item-description">${item.description}</div>`
                      : ""
                  }
                </div>
                <div class="item-price">${formatPrice(
                  item.price * item.quantity
                )}</div>
              </div>
            `
              )
              .join("")}
          </div>
          
          <div class="total">
            <div>Total: <span>${formatPrice(
              order.totalAmount || calculateTotal(order.cart)
            )}</span></div>
          </div>
          
          <div class="footer">
            <p>Gracias por elegir Luigi's Burger! 🍔</p>
            <p>Para preguntas, llama al (555) 123-4567</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export const POST = async (req: NextRequest) => {
  try {
    const orderData: OrderData = await req.json();

    // Generate the receipt HTML
    const htmlContent = generateReceiptHTML(orderData);

    let browser;
    try {
      // Try with @sparticuz/chromium first
      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } catch (error) {
      console.log(
        "Failed to launch with @sparticuz/chromium, trying with system Chrome..."
      );
      // Fallback to system Chrome
      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });
    }

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Wait a bit for any dynamic content to render
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const imageBuffer = await page.screenshot({
      type: "png",
      fullPage: true,
    });
    await browser.close();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate receipt image" }),
      { status: 500 }
    );
  }
};
