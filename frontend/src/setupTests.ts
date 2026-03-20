import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock URL.createObjectURL since jsdom doesn't implement it
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = vi.fn();
}
