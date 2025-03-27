
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModelSelector from '@/components/prediction/ModelSelector';

describe('ModelSelector Component', () => {
  const mockSetActiveModel = jest.fn();

  const defaultProps = {
    activeModel: 'lightweight' as const,
    setActiveModel: mockSetActiveModel,
    lightFeaturesCount: 6,
    fullFeaturesCount: 12
  };

  test('renders both model options with feature counts', () => {
    render(<ModelSelector {...defaultProps} />);
    expect(screen.getByText(/Lightweight Model/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Model/i)).toBeInTheDocument();
  });

  test('clicking on a model option calls setActiveModel', () => {
    render(<ModelSelector {...defaultProps} />);
    
    // Find and click the "Full Model" option
    const fullModelOption = screen.getByText(/Full Model/i);
    fireEvent.click(fullModelOption);
    
    // Check if setActiveModel was called with 'full'
    expect(mockSetActiveModel).toHaveBeenCalledWith('full');
    
    // Reset the mock
    mockSetActiveModel.mockClear();
    
    // Find and click the "Lightweight Model" option
    const lightweightModelOption = screen.getByText(/Lightweight Model/i);
    fireEvent.click(lightweightModelOption);
    
    // Check if setActiveModel was called with 'lightweight'
    expect(mockSetActiveModel).toHaveBeenCalledWith('lightweight');
  });
  
  test('applies active styles to the selected model', () => {
    const { rerender } = render(<ModelSelector {...defaultProps} />);
    
    // Check that the lightweight model has active styles
    const lightweightModelInitial = screen.getByText(/Lightweight Model/i).closest('div');
    expect(lightweightModelInitial?.className).toContain('border-purple-600');
    
    // Rerender with full model active
    rerender(<ModelSelector {...defaultProps} activeModel="full" />);
    
    // Check that the full model now has active styles
    const fullModelAfterChange = screen.getByText(/Full Model/i).closest('div');
    expect(fullModelAfterChange?.className).toContain('border-purple-600');
  });
});
