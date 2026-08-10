import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  describe('overdue indicator', () => {
    const pastDate = '2020-01-01';
    const futureDate = '2099-12-31';
    const todayDate = new Date().toLocaleDateString('en-CA');

    it('should show overdue class and badge for an incomplete todo past its due date', () => {
      const overdueTodo = { ...mockTodo, dueDate: pastDate, completed: 0 };
      const { container } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card--overdue')).toBeInTheDocument();
      expect(screen.getByText(/Overdue/)).toBeInTheDocument();
    });

    it('should not show overdue indicator for an incomplete todo due in the future', () => {
      const futureTodo = { ...mockTodo, dueDate: futureDate, completed: 0 };
      const { container } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card--overdue')).not.toBeInTheDocument();
      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });

    it('should not show overdue indicator for an incomplete todo due today', () => {
      const dueTodayTodo = { ...mockTodo, dueDate: todayDate, completed: 0 };
      const { container } = render(<TodoCard todo={dueTodayTodo} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card--overdue')).not.toBeInTheDocument();
    });

    it('should not show overdue indicator for a todo with no due date', () => {
      const noDateTodo = { ...mockTodo, dueDate: null, completed: 0 };
      const { container } = render(<TodoCard todo={noDateTodo} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card--overdue')).not.toBeInTheDocument();
    });

    it('should not show overdue indicator for a completed todo with a past due date', () => {
      const completedPastTodo = { ...mockTodo, dueDate: pastDate, completed: 1 };
      const { container } = render(<TodoCard todo={completedPastTodo} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card--overdue')).not.toBeInTheDocument();
      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });

    it('should remove the overdue indicator on re-render after the todo becomes completed', () => {
      const overdueTodo = { ...mockTodo, dueDate: pastDate, completed: 0 };
      const { container, rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card--overdue')).toBeInTheDocument();

      const completedTodo = { ...overdueTodo, completed: 1 };
      rerender(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card--overdue')).not.toBeInTheDocument();
    });

    it('should remove the overdue indicator on re-render after the due date changes to the future', () => {
      const overdueTodo = { ...mockTodo, dueDate: pastDate, completed: 0 };
      const { container, rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card--overdue')).toBeInTheDocument();

      const updatedTodo = { ...overdueTodo, dueDate: futureDate };
      rerender(<TodoCard todo={updatedTodo} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card--overdue')).not.toBeInTheDocument();
    });

    it('should add the overdue indicator on re-render after an on-time due date changes to the past', () => {
      const futureTodo = { ...mockTodo, dueDate: futureDate, completed: 0 };
      const { container, rerender } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card--overdue')).not.toBeInTheDocument();

      const updatedTodo = { ...futureTodo, dueDate: pastDate };
      rerender(<TodoCard todo={updatedTodo} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card--overdue')).toBeInTheDocument();
    });

    it('should remove the overdue indicator on re-render after the due date is cleared', () => {
      const overdueTodo = { ...mockTodo, dueDate: pastDate, completed: 0 };
      const { container, rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card--overdue')).toBeInTheDocument();

      const clearedTodo = { ...overdueTodo, dueDate: null };
      rerender(<TodoCard todo={clearedTodo} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card--overdue')).not.toBeInTheDocument();
    });
  });
});
