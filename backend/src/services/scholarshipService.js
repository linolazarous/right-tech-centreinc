import Scholarship from '../models/Scholarship.js';
import Student from '../models/Student.js';
import logger from '../utils/logger.js';

class ScholarshipService {
  static async allocateScholarship(studentId, criteria) {
    try {
      if (!studentId || !criteria) {
        throw new Error('Student ID and criteria are required');
      }

      const student = await Student.findById(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      const meetsCriteria = this.checkScholarshipCriteria(student, criteria);
      if (!meetsCriteria) {
        logger.info(`Student ${studentId} doesn't meet scholarship criteria`);
        return { awarded: false };
      }

      const scholarship = new Scholarship({
        studentId,
        amount: criteria.amount,
        term: criteria.term,
        awardedAt: new Date()
      });

      await scholarship.save();
      
      // Update student record
      student.scholarships.push(scholarship._id);
      await student.save();

      logger.info(`Scholarship awarded to student ${studentId}`);
      return { awarded: true, scholarship };
    } catch (error) {
      logger.error(`Scholarship allocation failed: ${error.message}`);
      throw new Error('Failed to allocate scholarship');
    }
  }

  static checkScholarshipCriteria(student, criteria) {
    // Implement actual criteria checking logic
    return (
      student.gpa >= (criteria.minGPA || 3.0) &&
      student.financialNeed >= (criteria.minFinancialNeed || 0.7)
    );
  }
}

export default ScholarshipService;
