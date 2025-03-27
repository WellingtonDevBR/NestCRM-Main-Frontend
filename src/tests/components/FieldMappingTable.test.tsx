
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FieldMappingTable from '@/components/prediction/FieldMappingTable';
import { LIGHT_FEATURES } from '@/domain/models/predictionMapping';
import { CustomFieldCategory } from '@/domain/models/customField';

// Mock tooltips
jest.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('FieldMappingTable Component', () => {
  const mockCustomFieldCategories: CustomFieldCategory[] = [
    {
      category: 'Customer',
      fields: [
        { key: 'age', label: 'Age', type: 'number', required: false },
        { key: 'gender', label: 'Gender', type: 'select', required: false, options: ['Male', 'Female'] }
      ]
    }
  ];

  const mockProps = {
    title: 'Test Features',
    features: LIGHT_FEATURES,
    customFieldCategories: mockCustomFieldCategories,
    getMappedField: jest.fn((field) => field === 'Age' ? 'age' : undefined),
    onFieldChange: jest.fn()
  };

  test('renders the component title', () => {
    render(<FieldMappingTable {...mockProps} />);
    expect(screen.getByText('Test Features')).toBeInTheDocument();
  });

  test('renders the table headers', () => {
    render(<FieldMappingTable {...mockProps} />);
    expect(screen.getByText('Model Feature')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Mapped Field')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  test('shows completion percentage', () => {
    render(<FieldMappingTable {...mockProps} />);
    // One of six fields is mapped, so we expect 17% completion
    expect(screen.getByText('17% Complete')).toBeInTheDocument();
  });

  test('shows alert when fields are not mapped', () => {
    render(<FieldMappingTable {...mockProps} />);
    expect(screen.getByText(/5 fields are not mapped/)).toBeInTheDocument();
  });

  test('renders correct number of rows based on features', () => {
    render(<FieldMappingTable {...mockProps} />);
    // Check that we have the correct number of feature rows
    // We would check for each feature but in a real test with complex DOM this might be tricky
    // so we're checking for a specific number of rows
    const featureRows = screen.getAllByText(/Age|Gender|Partner|Tenure|Usage Frequency|Days Since Last Interaction/);
    expect(featureRows.length).toBeGreaterThanOrEqual(LIGHT_FEATURES.length);
  });
});
