import React from 'react';
import Todo from './Todo'; // Adjust path if needed

const PublicTodo: React.FC = () => {
  return (
    <Todo
      storageKey="publicTodos"
      showAssignmentFields={true} // Private todos don't have these fields
    />
  );
};

export default PublicTodo;
