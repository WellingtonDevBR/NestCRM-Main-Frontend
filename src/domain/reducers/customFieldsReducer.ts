
import { CustomField } from "@/domain/models/customField";

// Action types
export type CustomFieldsAction =
  | { type: 'SET_FIELDS'; payload: CustomField[] }
  | { type: 'ADD_FIELD' }
  | { type: 'REMOVE_FIELD'; payload: number }
  | { type: 'UPDATE_FIELD'; payload: { index: number; updates: Partial<CustomField> } };

// Reducer function
export const customFieldsReducer = (state: CustomField[], action: CustomFieldsAction): CustomField[] => {
  switch (action.type) {
    case 'SET_FIELDS':
      console.log('Setting fields:', action.payload);
      return action.payload;
      
    case 'ADD_FIELD':
      return [...state, { key: "", label: "", type: "text", required: false }];
      
    case 'REMOVE_FIELD':
      return state.filter((_, i) => i !== action.payload);
      
    case 'UPDATE_FIELD': {
      console.log('Updating field:', action.payload.index, action.payload.updates);
      return state.map((field, i) => 
        i === action.payload.index ? { ...field, ...action.payload.updates } : field
      );
    }
      
    default:
      return state;
  }
};
