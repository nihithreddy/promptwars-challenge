import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Global API Fetch Mock
global.fetch = vi.fn();

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders landing state with header and scanner', () => {
    render(<App />);
    expect(screen.getByText(/Med-Pass/i)).toBeDefined();
    expect(screen.getByText(/HUD/i)).toBeDefined();
    expect(screen.getByText(/U-BRIDGE ACTIVE/i)).toBeDefined();
  });

  it('handles successful API capture and displays HUD', async () => {
    const mockResponse = {
      medicalRecord: { allergies: [], medications: [], conditions: [] },
      transcription: "Mock text",
      alert: { status: 'SAFE', message: 'All clear' }
    };
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<App />);
    const textarea = screen.getByPlaceholderText(/Preparing to administer/i);
    fireEvent.change(textarea, { target: { value: 'Safe action' } });
    
    const submitBtn = screen.getByText(/EXECUTE CROSS-REFERENCE/i);
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Neural Processing/i)).toBeDefined();
    
    await waitFor(() => expect(screen.getByText(/ALERT: SAFE/i)).toBeDefined());
    expect(screen.getByText(/\$ Mock text/i)).toBeDefined();
  });

  it('displays error message on failed API call', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    render(<App />);
    const textarea = screen.getByPlaceholderText(/Preparing to administer/i);
    fireEvent.change(textarea, { target: { value: 'Fail this' } });
    
    fireEvent.click(screen.getByText(/EXECUTE CROSS-REFERENCE/i));

    await waitFor(() => {
      expect(screen.getByText(/CRITICAL ERROR: Failed to process emergency context/i)).toBeDefined();
    });
  });
});
