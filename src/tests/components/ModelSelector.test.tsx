
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModelSelector from '@/components/prediction/ModelSelector';

describe('ModelSelector Component', () => {
  const mockProps = {
    activeModel: 'lightweight' as 'lightweight' | 'full',
    setActiveModel: jest.fn(),
    lightFeaturesCount: 6,
    fullFeaturesCount: 12
  };

  test('renders both model options', () => {
    render(<ModelSelector {...mockProps} />);
    expect(screen.getByText(`Lightweight Model (${mockProps.lightFeaturesCount} fields)`)).toBeInTheDocument();
    expect(screen.getByText(`Full Model (${mockProps.fullFeaturesCount} fields)`)).toBeInTheDocument();
  });

  test('applies correct styling to active model button', () => {
    const { rerender } = render(<ModelSelector {...mockProps} />);
    
    // Lightweight should be active initially
    const lightweightButton = screen.getByText(`Lightweight Model (${mockProps.lightFeaturesCount} fields)`);
    expect(lightweightButton.className).toContain('bg-purple-600');
    
    // Full model should not be active
    const fullModelButton = screen.getByText(`Full Model (${mockProps.fullFeaturesCount} fields)`);
    expect(fullModelButton.className).not.toContain('bg-purple-600');
    
    // Now rerender with full model active
    rerender(<ModelSelector {...mockProps} activeModel="full" />);
    
    // Now full model should be active
    expect(screen.getByText(`Full Model (${mockProps.fullFeaturesCount} fields)`).className).toContain('bg-purple-600');
    expect(screen.getByText(`Lightweight Model (${mockProps.lightFeaturesCount} fields)`).className).not.toContain('bg-purple-600');
  });

  test('calls setActiveModel when clicking buttons', () => {
    render(<ModelSelector {...mockProps} />);
    
    // Click on the full model button
    fireEvent.click(screen.getByText(`Full Model (${mockProps.fullFeaturesCount} fields)`));
    expect(mockProps.setActiveModel).toHaveBeenCalledWith('full');
    
    // Reset mock
    mockProps.setActiveModel.mockReset();
    
    // Click on lightweight model button
    fireEvent.click(screen.getByText(`Lightweight Model (${mockProps.lightFeaturesCount} fields)`));
    expect(mockProps.setActiveModel).toHaveBeenCalledWith('lightweight');
  });
});
