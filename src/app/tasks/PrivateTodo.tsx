// src/components/PrivateTodo.tsx
import React from 'react';
import Todo from './Todo'; // Adjust path if needed
import { STORAGE_KEYS } from '../../utils/constants';

const PrivateTodo: React.FC = () => {
  return (
    <Todo
      storageKey={STORAGE_KEYS.privateTodos}
      showAssignmentFields={false} // Private todos don't have these fields
    />
  );
};

export default PrivateTodo;
