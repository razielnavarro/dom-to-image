# Luigi's Burger Receipt Generator

A Next.js API that generates beautiful receipt images from order data. Perfect for integration with n8n workflows to send order confirmations via WhatsApp.

## Features

- 🍔 Generate professional-looking receipt images
- 📱 Optimized for mobile viewing (400px width)
- 🚚 Support for both delivery and pickup orders
- 🎨 Beautiful styling with Luigi's Burger branding
- 📊 Automatic total calculation
- 📅 Date formatting and order numbering

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to test the API

## API Usage

### Endpoint

`POST /api/generate`

### Request Body

```json
{
  "customerPhone": "+1 (555) 123-4567",
  "deliveryMethod": "delivery",
  "cart": [
    {
      "quantity": 1,
      "name": "LUIGI DE CARNE CON BACON",
      "description": "Con papas",
      "price": 6.75
    },
    {
      "quantity": 1,
      "name": "NACHOS",
      "description": "",
      "price": 7.0
    }
  ],
  "deliveryAddress": "123 Main Street, Anytown, USA 12345",
  "orderNumber": "ORD-123456",
  "orderDate": "2024-01-15T10:30:00Z"
}
```

### Response

Returns a PNG image of the generated receipt.

### Example cURL

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "customerPhone": "+1 (555) 123-4567",
    "deliveryMethod": "delivery",
    "cart": [
      {
        "quantity": 1,
        "name": "LUIGI DE CARNE CON BACON",
        "description": "Con papas",
        "price": 6.75
      }
    ],
    "deliveryAddress": "123 Main Street, Anytown, USA 12345",
    "orderNumber": "ORD-123456",
    "orderDate": "2024-01-15T10:30:00Z"
  }' \
  --output receipt.png
```

## n8n Integration

1. Add an HTTP Request node in your n8n workflow
2. Set the method to `POST`
3. Set the URL to your deployed API endpoint (e.g., `https://your-domain.com/api/generate`)
4. Set the Content-Type header to `application/json`
5. Add your order data as JSON in the request body
6. The response will be a PNG image that you can use in subsequent nodes

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The project uses `@sparticuz/chromium` which is optimized for serverless environments like Vercel, Netlify, and AWS Lambda.

## Customization

### Styling

Edit the CSS in the `generateReceiptHTML` function in `src/app/api/generate/route.ts` to customize the receipt appearance.

### Restaurant Information

Update the restaurant name, phone number, and other details in the HTML template.

### Language

The receipt is currently in Spanish. You can modify the text in the HTML template to support other languages.

## Dependencies

- Next.js 15
- Puppeteer Core (for HTML to image conversion)
- @sparticuz/chromium (optimized for serverless)
- TypeScript

## License

MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

#
