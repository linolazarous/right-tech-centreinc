import validator from 'validator';

/**
 * Validate subscription plan data
 * @param {Object} subscriptionData - Subscription data to validate
 * @returns {Object} Validation result
 */
export const validateSubscriptionPlan = (subscriptionData) => {
  const { name, price, billingCycle, features, description, isActive } = subscriptionData;

  // Required fields validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, message: 'Subscription plan name is required' };
  }

  if (name.trim().length > 50) {
    return { valid: false, message: 'Subscription plan name cannot exceed 50 characters' };
  }

  if (price === undefined || price === null) {
    return { valid: false, message: 'Price is required' };
  }

  if (typeof price !== 'number' || price < 0) {
    return { valid: false, message: 'Price must be a non-negative number' };
  }

  if (price > 10000) {
    return { valid: false, message: 'Price cannot exceed 10000' };
  }

  // Billing cycle validation
  const validBillingCycles = ['monthly', 'quarterly', 'yearly', 'lifetime'];
  if (!billingCycle || !validBillingCycles.includes(billingCycle)) {
    return { valid: false, message: 'Valid billing cycle is required (monthly, quarterly, yearly, lifetime)' };
  }

  // Features validation
  if (!features || !Array.isArray(features)) {
    return { valid: false, message: 'Features must be an array' };
  }

  if (features.length === 0) {
    return { valid: false, message: 'At least one feature is required' };
  }

  for (const feature of features) {
    if (typeof feature !== 'string' || feature.trim().length === 0) {
      return { valid: false, message: 'All features must be non-empty strings' };
    }
    if (feature.length > 100) {
      return { valid: false, message: 'Feature description cannot exceed 100 characters' };
    }
  }

  // Description validation
  if (description && typeof description === 'string') {
    if (description.length > 500) {
      return { valid: false, message: 'Description cannot exceed 500 characters' };
    }
  }

  // Active status validation
  if (isActive !== undefined && typeof isActive !== 'boolean') {
    return { valid: false, message: 'isActive must be a boolean value' };
  }

  return { valid: true, message: 'Subscription plan data is valid' };
};

/**
 * Validate subscription creation data
 * @param {Object} subscriptionData - Subscription data to validate
 * @returns {Object} Validation result
 */
export const validateSubscriptionCreation = (subscriptionData) => {
  const { userId, planId, paymentMethod, startDate, endDate } = subscriptionData;

  // User ID validation
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    return { valid: false, message: 'Valid user ID is required' };
  }

  if (!validator.isMongoId(userId)) {
    return { valid: false, message: 'Invalid user ID format' };
  }

  // Plan ID validation
  if (!planId || typeof planId !== 'string' || planId.trim().length === 0) {
    return { valid: false, message: 'Valid plan ID is required' };
  }

  if (!validator.isMongoId(planId)) {
    return { valid: false, message: 'Invalid plan ID format' };
  }

  // Payment method validation
  if (!paymentMethod || typeof paymentMethod !== 'string' || paymentMethod.trim().length === 0) {
    return { valid: false, message: 'Payment method is required' };
  }

  const validPaymentMethods = ['credit_card', 'paypal', 'stripe', 'bank_transfer'];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return { valid: false, message: 'Invalid payment method' };
  }

  // Date validation
  if (startDate) {
    if (!validator.isISO8601(startDate)) {
      return { valid: false, message: 'Start date must be a valid ISO 8601 date' };
    }

    const start = new Date(startDate);
    if (start > new Date()) {
      return { valid: false, message: 'Start date cannot be in the future' };
    }
  }

  if (endDate) {
    if (!validator.isISO8601(endDate)) {
      return { valid: false, message: 'End date must be a valid ISO 8601 date' };
    }

    const end = new Date(endDate);
    if (end <= new Date()) {
      return { valid: false, message: 'End date must be in the future' };
    }
  }

  // Cross-date validation
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      return { valid: false, message: 'End date must be after start date' };
    }
  }

  return { valid: true, message: 'Subscription data is valid' };
};

/**
 * Validate subscription update data
 * @param {Object} updateData - Update data to validate
 * @returns {Object} Validation result
 */
export const validateSubscriptionUpdate = (updateData) => {
  const { status, endDate, isActive } = updateData;

  // Status validation
  if (status) {
    const validStatuses = ['active', 'canceled', 'expired', 'pending', 'suspended'];
    if (!validStatuses.includes(status)) {
      return { valid: false, message: 'Invalid subscription status' };
    }
  }

  // End date validation
  if (endDate) {
    if (!validator.isISO8601(endDate)) {
      return { valid: false, message: 'End date must be a valid ISO 8601 date' };
    }

    const end = new Date(endDate);
    if (end <= new Date()) {
      return { valid: false, message: 'End date must be in the future' };
    }
  }

  // Active status validation
  if (isActive !== undefined && typeof isActive !== 'boolean') {
    return { valid: false, message: 'isActive must be a boolean value' };
  }

  // Ensure at least one field is being updated
  const hasUpdates = Object.keys(updateData).length > 0;
  if (!hasUpdates) {
    return { valid: false, message: 'No update data provided' };
  }

  return { valid: true, message: 'Subscription update data is valid' };
};

/**
 * Validate subscription ID
 * @param {string} subscriptionId - Subscription ID to validate
 * @returns {Object} Validation result
 */
export const validateSubscriptionId = (subscriptionId) => {
  if (!subscriptionId || typeof subscriptionId !== 'string' || subscriptionId.trim().length === 0) {
    return { valid: false, message: 'Subscription ID is required' };
  }

  if (!validator.isMongoId(subscriptionId)) {
    return { valid: false, message: 'Invalid subscription ID format' };
  }

  return { valid: true, message: 'Subscription ID is valid' };
};

export default {
  validateSubscriptionPlan,
  validateSubscriptionCreation,
  validateSubscriptionUpdate,
  validateSubscriptionId
};
