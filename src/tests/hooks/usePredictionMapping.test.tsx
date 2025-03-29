
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePredictionMapping } from '@/hooks/usePredictionMapping';
import React from 'react';
import '@testing-library/jest-dom';

// Mock the repository implementation
jest.mock('@/infrastructure/repositories/predictionMappingRepositoryImpl', () => {
  return {
    PredictionMappingRepositoryImpl: jest.fn().mockImplementation(() => ({
      fetchMappings: jest.fn().mockResolvedValue({ 
        mappings: [
          { modelField: 'Age', tenantField: 'customer_age', category: 'Customer' },
          { modelField: 'Gender', tenantField: 'customer_gender', category: 'Customer' }
        ] 
      }),
      saveMappings: jest.fn().mockImplementation(data => Promise.resolve(data))
    }))
  };
});

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('usePredictionMapping', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  test('should return the expected properties', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePredictionMapping(), { wrapper });
    
    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.mappingData).toEqual({ mappings: [] });
    expect(result.current.LIGHT_FEATURES).toBeDefined();
    expect(result.current.FULL_FEATURES).toBeDefined();
    
    // Wait for the query to resolve
    await waitForNextUpdate();
    
    // After data is loaded
    expect(result.current.isLoading).toBe(false);
    expect(result.current.mappingData.mappings).toHaveLength(2);
    expect(result.current.getMapping).toBeInstanceOf(Function);
    expect(result.current.updateMapping).toBeInstanceOf(Function);
    expect(result.current.saveMappings).toBeInstanceOf(Function);
    // New properties
    expect(result.current.getMappingCategory).toBeInstanceOf(Function);
    expect(result.current.mappingModel).toBeDefined();
  });

  test('getMapping returns the correct field mapping', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePredictionMapping(), { wrapper });
    
    await waitForNextUpdate();
    
    expect(result.current.getMapping('Age')).toBe('customer_age');
    expect(result.current.getMapping('NonExistent')).toBeUndefined();
  });

  test('getMappingCategory returns the correct category', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePredictionMapping(), { wrapper });
    
    await waitForNextUpdate();
    
    expect(result.current.getMappingCategory('Age')).toBe('Customer');
    expect(result.current.getMappingCategory('NonExistent')).toBeUndefined();
  });

  test('updateMapping correctly updates mappings', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePredictionMapping(), { wrapper });
    
    await waitForNextUpdate();
    
    // Add the category parameter that was missing, causing the error
    const updatedMapping = result.current.updateMapping('Age', 'new_age_field', 'customer');
    
    expect(updatedMapping.mappings.find(m => m.modelField === 'Age')?.tenantField).toBe('new_age_field');
    expect(updatedMapping.mappings.find(m => m.modelField === 'Age')?.category).toBe('customer');
    
    // Original state should be unchanged
    expect(result.current.mappingData.mappings.find(m => m.modelField === 'Age')?.tenantField).toBe('customer_age');
  });

  test('mappingModel correctly detects the model type', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePredictionMapping(), { wrapper });
    
    await waitForNextUpdate();
    
    // For the mock data (2 fields), should detect lightweight model
    expect(result.current.mappingModel).toBe('lightweight');
  });
});
