import { Request, Response } from 'express';
import {
  Client,
  Environment,
  LogLevel,
  OAuthAuthorizationController,
  OrdersController,
} from "@paypal/paypal-server-sdk";

// Will be initialized when the client credentials are available
let client: Client | null = null;
let ordersController: OrdersController | null = null;
let oAuthAuthorizationController: OAuthAuthorizationController | null = null;

// Initialize PayPal with the client credentials
export const initPayPal = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (clientId && clientSecret) {
    client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
      },
      timeout: 0,
      environment: process.env.NODE_ENV === 'production' 
        ? Environment.Production 
        : Environment.Sandbox,
      logging: {
        logLevel: LogLevel.Info,
        logRequest: {
          logBody: true,
        },
        logResponse: {
          logHeaders: true,
        },
      },
    });
    
    ordersController = new OrdersController(client);
    oAuthAuthorizationController = new OAuthAuthorizationController(client);
    
    console.log('PayPal payment gateway initialized');
    return true;
  } else {
    console.warn('PayPal payment gateway not initialized: Missing client credentials');
    return false;
  }
};

// Generate a client token for the frontend
export const getClientToken = async () => {
  if (!client || !oAuthAuthorizationController) {
    throw new Error('PayPal not initialized');
  }

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const { result } = await oAuthAuthorizationController.requestToken(
    {
      authorization: `Basic ${auth}`,
    },
    { intent: "sdk_init", response_type: "client_token" },
  );

  return result.accessToken;
};

// Create a PayPal order
export const createOrder = async (req: Request, res: Response) => {
  if (!client || !ordersController) {
    return res.status(503).json({ 
      error: 'PayPal payment gateway not available',
      configured: false
    });
  }

  try {
    const { amount, currency = 'INR', intent = 'CAPTURE' } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: "Invalid amount. Amount must be a positive number.",
      });
    }

    const collect = {
      body: {
        intent: intent,
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toString(),
            },
          },
        ],
      },
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } = await ordersController.createOrder(collect);
    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error: any) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: error.message });
  }
};

// Capture a PayPal order
export const captureOrder = async (req: Request, res: Response) => {
  if (!client || !ordersController) {
    return res.status(503).json({ error: 'PayPal payment gateway not available' });
  }

  try {
    const { orderID } = req.params;
    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } = await ordersController.captureOrder(collect);
    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error: any) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ error: error.message });
  }
};

// Provide client setup data
export const setupClient = async (req: Request, res: Response) => {
  if (!client) {
    return res.status(503).json({ 
      error: 'PayPal payment gateway not available',
      configured: false 
    });
  }

  try {
    const clientToken = await getClientToken();
    res.json({
      clientToken,
      configured: true
    });
  } catch (error: any) {
    console.error('Error setting up PayPal client:', error);
    res.status(500).json({ error: error.message });
  }
};

// Check if PayPal is configured
export const getPayPalStatus = () => {
  return {
    available: !!client,
    clientId: process.env.PAYPAL_CLIENT_ID || null
  };
};