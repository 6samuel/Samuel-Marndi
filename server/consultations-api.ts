import { Request, Response } from "express";
import { storage } from "./storage";
import { isAdmin, isAuthenticated } from "./auth";
import { sendConsultationConfirmation, sendConsultationReminder } from "./email-service";

// Get all consultations (admin only)
export const getAllConsultations = async (req: Request, res: Response) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    const consultations = await storage.getConsultations();
    res.json(consultations);
  } catch (error) {
    console.error("Error fetching consultations:", error);
    res.status(500).json({ message: "Failed to fetch consultations" });
  }
};

// Get consultation by ID (admin or owner)
export const getConsultationById = async (req: Request, res: Response) => {
  try {
    const consultationId = parseInt(req.params.id);
    
    if (isNaN(consultationId)) {
      return res.status(400).json({ message: "Invalid consultation ID" });
    }

    const consultation = await storage.getConsultationById(consultationId);
    
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    // Check if user is admin or the consultation owner
    if (!isAdmin(req) && 
        (!req.isAuthenticated() || req.user.email !== consultation.email)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.json(consultation);
  } catch (error) {
    console.error("Error fetching consultation:", error);
    res.status(500).json({ message: "Failed to fetch consultation" });
  }
};

// Create new consultation
export const createConsultation = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      date,
      timeSlot,
      topic,
      additionalInfo,
      paymentStatus = "unpaid"
    } = req.body;

    // Basic validation
    if (!name || !email || !phone || !date || !timeSlot || !topic) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create the consultation
    const consultation = await storage.createConsultation({
      name,
      email,
      phone,
      date,
      timeSlot,
      topic,
      additionalInfo,
      status: "pending",
      paymentStatus,
      paymentAmount: 1000, // Default amount
      paymentMethod: null,
      paymentId: null,
      meetingLink: null,
      notes: null
    });

    res.status(201).json({ 
      message: "Consultation booking request received", 
      id: consultation.id,
      consultation
    });
  } catch (error) {
    console.error("Error creating consultation:", error);
    res.status(500).json({ message: "Failed to create consultation" });
  }
};

// Update consultation status (admin only)
export const updateConsultationStatus = async (req: Request, res: Response) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    const consultationId = parseInt(req.params.id);
    
    if (isNaN(consultationId)) {
      return res.status(400).json({ message: "Invalid consultation ID" });
    }

    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'completed', 'cancelled', 'no-show'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedConsultation = await storage.updateConsultationStatus(consultationId, status);
    
    if (!updatedConsultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    // If status changed to confirmed, send a confirmation email
    if (status === 'confirmed') {
      try {
        await sendConsultationConfirmation(updatedConsultation);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Continue with the response even if email fails
      }
    }

    res.json({
      message: "Consultation status updated successfully",
      consultation: updatedConsultation
    });
  } catch (error) {
    console.error("Error updating consultation status:", error);
    res.status(500).json({ message: "Failed to update consultation status" });
  }
};

// Update consultation payment status (admin only)
export const updateConsultationPaymentStatus = async (req: Request, res: Response) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    const consultationId = parseInt(req.params.id);
    
    if (isNaN(consultationId)) {
      return res.status(400).json({ message: "Invalid consultation ID" });
    }

    const { paymentStatus, paymentMethod, paymentId } = req.body;
    
    if (!paymentStatus || !['paid', 'unpaid', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status value" });
    }

    const updatedConsultation = await storage.updateConsultationPaymentStatus(
      consultationId, 
      paymentStatus,
      paymentMethod || null,
      paymentId || null
    );
    
    if (!updatedConsultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json({
      message: "Consultation payment status updated successfully",
      consultation: updatedConsultation
    });
  } catch (error) {
    console.error("Error updating consultation payment status:", error);
    res.status(500).json({ message: "Failed to update consultation payment status" });
  }
};

// Update consultation details (admin only)
export const updateConsultation = async (req: Request, res: Response) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    const consultationId = parseInt(req.params.id);
    
    if (isNaN(consultationId)) {
      return res.status(400).json({ message: "Invalid consultation ID" });
    }

    const { meetingLink, notes } = req.body;

    const updatedConsultation = await storage.updateConsultation(consultationId, {
      meetingLink: meetingLink !== undefined ? meetingLink : undefined,
      notes: notes !== undefined ? notes : undefined
    });
    
    if (!updatedConsultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json({
      message: "Consultation updated successfully",
      consultation: updatedConsultation
    });
  } catch (error) {
    console.error("Error updating consultation:", error);
    res.status(500).json({ message: "Failed to update consultation" });
  }
};

// Delete consultation (admin only)
export const deleteConsultation = async (req: Request, res: Response) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    const consultationId = parseInt(req.params.id);
    
    if (isNaN(consultationId)) {
      return res.status(400).json({ message: "Invalid consultation ID" });
    }

    const success = await storage.deleteConsultation(consultationId);
    
    if (!success) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json({
      message: "Consultation deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting consultation:", error);
    res.status(500).json({ message: "Failed to delete consultation" });
  }
};

// Process payment for consultation
export const processConsultationPayment = async (req: Request, res: Response) => {
  try {
    const consultationId = parseInt(req.params.id);
    
    if (isNaN(consultationId)) {
      return res.status(400).json({ message: "Invalid consultation ID" });
    }

    const { paymentMethod } = req.body;
    
    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    const consultation = await storage.getConsultationById(consultationId);
    
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    // Handle different payment methods
    let paymentData: any = null;

    switch (paymentMethod) {
      case 'stripe':
        // Handled in the payment routes
        paymentData = { clientSecret: 'Mock_Secret_Key' };
        break;
      case 'paypal':
        // Handled in the payment routes
        paymentData = { id: 'Mock_PayPal_ID' };
        break;
      case 'razorpay':
        // Handled in the payment routes
        paymentData = { id: 'Mock_Razorpay_ID' };
        break;
      case 'upi':
        paymentData = {
          upiInfo: {
            upiId: 'samuelmarndi@upi',
            qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSU'
          },
          referenceId: `CONS-${consultationId}-${Date.now()}`
        };
        break;
      default:
        return res.status(400).json({ message: "Invalid payment method" });
    }

    res.json({
      message: "Payment initiated",
      consultationId,
      paymentMethod,
      paymentData
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Failed to process payment" });
  }
};

// Send reminder email (admin only)
export const sendReminder = async (req: Request, res: Response) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    const consultationId = parseInt(req.params.id);
    
    if (isNaN(consultationId)) {
      return res.status(400).json({ message: "Invalid consultation ID" });
    }

    const consultation = await storage.getConsultationById(consultationId);
    
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    await sendConsultationReminder(consultation);

    res.json({
      message: "Reminder sent successfully"
    });
  } catch (error) {
    console.error("Error sending reminder:", error);
    res.status(500).json({ message: "Failed to send reminder" });
  }
};