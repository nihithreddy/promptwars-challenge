import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Scanner } from './Scanner';

describe('Scanner', () => {
  const mockOnCapture = vi.fn();

  it('renders input area correctly', () => {
    render(<Scanner onCapture={mockOnCapture} isProcessing={false} />);
    expect(screen.getByPlaceholderText(/Preparing to administer/i)).toBeDefined();
    expect(screen.getByText(/INITIALIZE SECURE UPLOAD/i)).toBeDefined();
  });

  it('updates textarea value and enables button', () => {
    render(<Scanner onCapture={mockOnCapture} isProcessing={false} />);
    const textarea = screen.getByPlaceholderText(/Preparing to administer/i);
    fireEvent.change(textarea, { target: { value: 'Administering Adrenaline' } });
    
    const submitBtn = screen.getByText(/EXECUTE CROSS-REFERENCE/i);
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);
    expect(mockOnCapture).toHaveBeenCalledWith([], 'Administering Adrenaline');
  });

  it('handles multiple file uploads', () => {
    render(<Scanner onCapture={mockOnCapture} isProcessing={false} />);
    const input = screen.getByLabelText(/Medical Records Feed/i) as HTMLInputElement;
    
    const file1 = new File(['foo'], 'foo.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file1] } });
    
    expect(screen.getByText('foo.txt')).toBeDefined();
    
    const submitBtn = screen.getByText(/EXECUTE CROSS-REFERENCE/i);
    fireEvent.click(submitBtn);
    expect(mockOnCapture).toHaveBeenCalledWith([file1], '');
  });

  it('disables interactions when isProcessing is true', () => {
    render(<Scanner onCapture={mockOnCapture} isProcessing={true} />);
    expect(screen.getByText(/ENGAGING NEURAL LINK/i)).toBeDefined();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
