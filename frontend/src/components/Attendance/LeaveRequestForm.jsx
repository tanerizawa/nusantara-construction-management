import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './LeaveRequestForm.css';

const LeaveRequestForm = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    leaveType: 'vacation',
    reason: '',
    attachment: null
  });
  const [errors, setErrors] = useState({});
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  // Leave type options
  const leaveTypes = [
    { value: 'vacation', label: '🏖️ Vacation', description: 'Planned time off' },
    { value: 'sick', label: '🤒 Sick Leave', description: 'Medical reasons' },
    { value: 'personal', label: '👤 Personal', description: 'Personal matters' },
    { value: 'emergency', label: '🚨 Emergency', description: 'Urgent situations' },
    { value: 'bereavement', label: '💐 Bereavement', description: 'Family loss' }
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          attachment: 'File size must be less than 5MB'
        }));
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          attachment: 'Only JPG, PNG, or PDF files are allowed'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        attachment: file
      }));

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachmentPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachmentPreview(null);
      }

      // Clear error
      if (errors.attachment) {
        setErrors(prev => ({
          ...prev,
          attachment: null
        }));
      }
    }
  };

  // Remove attachment
  const handleRemoveAttachment = () => {
    setFormData(prev => ({
      ...prev,
      attachment: null
    }));
    setAttachmentPreview(null);
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }

      // Check if start date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    if (!formData.reason || formData.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate duration in days
  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('startDate', formData.startDate);
    submitData.append('endDate', formData.endDate);
    submitData.append('leaveType', formData.leaveType);
    submitData.append('reason', formData.reason);
    if (formData.attachment) {
      submitData.append('attachment', formData.attachment);
    }

    await onSubmit(submitData);
  };

  const duration = calculateDuration();

  return (
    <form className="leave-request-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>📝 Request Leave</h3>
        <p>Fill in the details for your leave request</p>
      </div>

      {/* Date Range */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">
            Start Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className={errors.startDate ? 'error' : ''}
          />
          {errors.startDate && (
            <span className="error-message">{errors.startDate}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">
            End Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            min={formData.startDate || new Date().toISOString().split('T')[0]}
            className={errors.endDate ? 'error' : ''}
          />
          {errors.endDate && (
            <span className="error-message">{errors.endDate}</span>
          )}
        </div>
      </div>

      {/* Duration Display */}
      {duration > 0 && (
        <div className="duration-display">
          <span className="duration-icon">📅</span>
          <span className="duration-text">
            Duration: <strong>{duration}</strong> {duration === 1 ? 'day' : 'days'}
          </span>
        </div>
      )}

      {/* Leave Type */}
      <div className="form-group">
        <label htmlFor="leaveType">
          Leave Type <span className="required">*</span>
        </label>
        <div className="leave-type-options">
          {leaveTypes.map(type => (
            <label
              key={type.value}
              className={`leave-type-option ${formData.leaveType === type.value ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="leaveType"
                value={type.value}
                checked={formData.leaveType === type.value}
                onChange={handleChange}
              />
              <div className="option-content">
                <span className="option-label">{type.label}</span>
                <span className="option-description">{type.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Reason */}
      <div className="form-group">
        <label htmlFor="reason">
          Reason <span className="required">*</span>
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Please provide a detailed reason for your leave request..."
          rows="4"
          className={errors.reason ? 'error' : ''}
        />
        <div className="textarea-footer">
          <span className={`char-count ${formData.reason.length < 10 ? 'warning' : ''}`}>
            {formData.reason.length} characters (min 10)
          </span>
          {errors.reason && (
            <span className="error-message">{errors.reason}</span>
          )}
        </div>
      </div>

      {/* Attachment */}
      <div className="form-group">
        <label htmlFor="attachment">
          Supporting Document (Optional)
        </label>
        <p className="field-hint">Upload medical certificate, invitation letter, or other supporting documents</p>
        
        {!formData.attachment ? (
          <div className="file-input-wrapper">
            <input
              type="file"
              id="attachment"
              name="attachment"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg,application/pdf"
            />
            <label htmlFor="attachment" className="file-input-label">
              <span className="file-icon">📎</span>
              <span>Choose file or drag here</span>
              <span className="file-hint">JPG, PNG, or PDF (max 5MB)</span>
            </label>
          </div>
        ) : (
          <div className="attachment-preview">
            {attachmentPreview ? (
              <img src={attachmentPreview} alt="Preview" className="preview-image" />
            ) : (
              <div className="preview-pdf">
                <span className="pdf-icon">📄</span>
                <span className="pdf-name">{formData.attachment.name}</span>
              </div>
            )}
            <button
              type="button"
              className="remove-attachment-btn"
              onClick={handleRemoveAttachment}
            >
              ✗ Remove
            </button>
          </div>
        )}
        
        {errors.attachment && (
          <span className="error-message">{errors.attachment}</span>
        )}
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Submitting...
            </>
          ) : (
            <>
              <span>✓</span>
              Submit Request
            </>
          )}
        </button>
      </div>
    </form>
  );
};

LeaveRequestForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  isSubmitting: PropTypes.bool
};

export default LeaveRequestForm;
