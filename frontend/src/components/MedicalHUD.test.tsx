import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MedicalHUD } from './MedicalHUD';
import type { GeminiResponse } from '../types';

const mockData: GeminiResponse = {
  medicalRecord: {
    allergies: [{ name: 'Peanuts', verified: true }],
    medications: [{ name: 'Insulin', verified: false }],
    conditions: [{ name: 'Asthma', verified: true }]
  },
  transcription: "Test transcript",
  alert: {
    status: 'CRITICAL',
    message: 'CRITICAL ALERT MESSAGE'
  }
};

describe('MedicalHUD', () => {
  it('renders nothing when data is null', () => {
    const { container } = render(<MedicalHUD data={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders critical alert with matching styles', () => {
    render(<MedicalHUD data={mockData} />);
    expect(screen.getByText(/ALERT: CRITICAL/i)).toBeDefined();
    expect(screen.getByText(/CRITICAL ALERT MESSAGE/i)).toBeDefined();
  });

  it('renders allergies, medications, and conditions', () => {
    render(<MedicalHUD data={mockData} />);
    expect(screen.getByText('Peanuts')).toBeDefined();
    expect(screen.getByText('Insulin')).toBeDefined();
    expect(screen.getByText('Asthma')).toBeDefined();
    expect(screen.getAllByText('VERIFIED').length).toBeGreaterThan(0);
    expect(screen.getAllByText('INFERRED').length).toBeGreaterThan(0);
  });

  it('renders warning and safe states', () => {
    const warningData: GeminiResponse = {
      ...mockData,
      alert: { status: 'WARNING', message: 'Warning message' }
    };
    const { rerender } = render(<MedicalHUD data={warningData} />);
    expect(screen.getByText(/ALERT: WARNING/i)).toBeDefined();

    const safeData: GeminiResponse = {
      ...mockData,
      alert: { status: 'SAFE', message: 'Safe message' }
    };
    rerender(<MedicalHUD data={safeData} />);
    expect(screen.getByText(/ALERT: SAFE/i)).toBeDefined();
  });
});
