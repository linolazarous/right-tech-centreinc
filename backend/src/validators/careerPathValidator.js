import validator from 'validator';

/**
 * Validate career path data
 * @param {Object} careerPathData - Career path data to validate
 * @returns {Object} Validation result
 */
export const validateCareerPath = (careerPathData) => {
  const { title, description, category, requiredSkills, targetRoles, difficulty, estimatedDuration } = careerPathData;

  // Title validation
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { valid: false, message: 'Career path title is required' };
  }

  if (title.trim().length < 5) {
    return { valid: false, message: 'Title must be at least 5 characters long' };
  }

  if (title.trim().length > 100) {
    return { valid: false, message: 'Title cannot exceed 100 characters' };
  }

  // Description validation
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return { valid: false, message: 'Career path description is required' };
  }

  if (description.trim().length < 50) {
    return { valid: false, message: 'Description must be at least 50 characters long' };
  }

  if (description.trim().length > 2000) {
    return { valid: false, message: 'Description cannot exceed 2000 characters' };
  }

  // Category validation
  const validCategories = [
    'technology', 'business', 'healthcare', 'education', 'creative', 
    'engineering', 'finance', 'marketing', 'design', 'data-science'
  ];
  
  if (!category || !validCategories.includes(category)) {
    return { valid: false, message: 'Valid category is required' };
  }

  // Required skills validation
  if (!requiredSkills || !Array.isArray(requiredSkills)) {
    return { valid: false, message: 'Required skills must be an array' };
  }

  if (requiredSkills.length === 0) {
    return { valid: false, message: 'At least one required skill is needed' };
  }

  if (requiredSkills.length > 20) {
    return { valid: false, message: 'Cannot have more than 20 required skills' };
  }

  for (const skill of requiredSkills) {
    if (typeof skill !== 'string' || skill.trim().length === 0) {
      return { valid: false, message: 'All skills must be non-empty strings' };
    }
    if (skill.length > 50) {
      return { valid: false, message: 'Skill name cannot exceed 50 characters' };
    }
  }

  // Target roles validation
  if (!targetRoles || !Array.isArray(targetRoles)) {
    return { valid: false, message: 'Target roles must be an array' };
  }

  if (targetRoles.length === 0) {
    return { valid: false, message: 'At least one target role is required' };
  }

  if (targetRoles.length > 10) {
    return { valid: false, message: 'Cannot have more than 10 target roles' };
  }

  for (const role of targetRoles) {
    if (typeof role !== 'string' || role.trim().length === 0) {
      return { valid: false, message: 'All target roles must be non-empty strings' };
    }
    if (role.length > 50) {
      return { valid: false, message: 'Role name cannot exceed 50 characters' };
    }
  }

  // Difficulty validation
  const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
  if (!difficulty || !validDifficulties.includes(difficulty)) {
    return { valid: false, message: 'Valid difficulty level is required' };
  }

  // Estimated duration validation
  if (estimatedDuration === undefined || estimatedDuration === null) {
    return { valid: false, message: 'Estimated duration is required' };
  }

  if (typeof estimatedDuration !== 'number' || estimatedDuration <= 0) {
    return { valid: false, message: 'Estimated duration must be a positive number' };
  }

  if (estimatedDuration > 365) {
    return { valid: false, message: 'Estimated duration cannot exceed 365 days' };
  }

  return { valid: true, message: 'Career path data is valid' };
};

/**
 * Validate career path step data
 * @param {Object} stepData - Career path step data to validate
 * @returns {Object} Validation result
 */
export const validateCareerPathStep = (stepData) => {
  const { title, description, order, resources, estimatedDuration, stepType } = stepData;

  // Title validation
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { valid: false, message: 'Step title is required' };
  }

  if (title.trim().length > 100) {
    return { valid: false, message: 'Step title cannot exceed 100 characters' };
  }

  // Description validation
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return { valid: false, message: 'Step description is required' };
  }

  if (description.trim().length > 500) {
    return { valid: false, message: 'Step description cannot exceed 500 characters' };
  }

  // Order validation
  if (order === undefined || order === null) {
    return { valid: false, message: 'Step order is required' };
  }

  if (typeof order !== 'number' || order < 1) {
    return { valid: false, message: 'Step order must be a positive number' };
  }

  // Resources validation
  if (resources && Array.isArray(resources)) {
    for (const resource of resources) {
      if (typeof resource !== 'object' || resource === null) {
        return { valid: false, message: 'Resources must be objects' };
      }

      if (!resource.title || typeof resource.title !== 'string') {
        return { valid: false, message: 'Resource title is required' };
      }

      if (resource.url && !validator.isURL(resource.url)) {
        return { valid: false, message: 'Resource URL must be valid' };
      }

      if (resource.type && !['video', 'article', 'course', 'book', 'document'].includes(resource.type)) {
        return { valid: false, message: 'Invalid resource type' };
      }
    }
  }

  // Estimated duration validation
  if (estimatedDuration !== undefined && estimatedDuration !== null) {
    if (typeof estimatedDuration !== 'number' || estimatedDuration <= 0) {
      return { valid: false, message: 'Estimated duration must be a positive number' };
    }

    if (estimatedDuration > 30) {
      return { valid: false, message: 'Step duration cannot exceed 30 days' };
    }
  }

  // Step type validation
  const validStepTypes = ['learning', 'practice', 'project', 'assessment'];
  if (stepType && !validStepTypes.includes(stepType)) {
    return { valid: false, message: 'Invalid step type' };
  }

  return { valid: true, message: 'Career path step data is valid' };
};

/**
 * Validate career path ID
 * @param {string} careerPathId - Career path ID to validate
 * @returns {Object} Validation result
 */
export const validateCareerPathId = (careerPathId) => {
  if (!careerPathId || typeof careerPathId !== 'string' || careerPathId.trim().length === 0) {
    return { valid: false, message: 'Career path ID is required' };
  }

  if (!validator.isMongoId(careerPathId)) {
    return { valid: false, message: 'Invalid career path ID format' };
  }

  return { valid: true, message: 'Career path ID is valid' };
};

/**
 * Validate career path progress data
 * @param {Object} progressData - Progress data to validate
 * @returns {Object} Validation result
 */
export const validateCareerPathProgress = (progressData) => {
  const { currentStep, completedSteps, progressPercentage } = progressData;

  // Current step validation
  if (currentStep !== undefined && currentStep !== null) {
    if (typeof currentStep !== 'number' || currentStep < 0) {
      return { valid: false, message: 'Current step must be a non-negative number' };
    }
  }

  // Completed steps validation
  if (completedSteps && Array.isArray(completedSteps)) {
    for (const step of completedSteps) {
      if (typeof step !== 'number' || step < 1) {
        return { valid: false, message: 'Completed steps must be positive numbers' };
      }
    }
  }

  // Progress percentage validation
  if (progressPercentage !== undefined && progressPercentage !== null) {
    if (typeof progressPercentage !== 'number' || progressPercentage < 0 || progressPercentage > 100) {
      return { valid: false, message: 'Progress percentage must be between 0 and 100' };
    }
  }

  return { valid: true, message: 'Career path progress data is valid' };
};

export default {
  validateCareerPath,
  validateCareerPathStep,
  validateCareerPathId,
  validateCareerPathProgress
};
