import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardScreen from './DashboardScreen';

describe('DashboardScreen', () => {
  it('renders without crashing', () => {
    const mockData = {
      total: "420.00",
      biggest: "transport",
      healthScore: 60,
      explanation: "Test explanation",
      breakdown: { transport: "100.00", energy: "100.00", food: "100.00", waste: "120.00" },
      actions: [
        { id: "1", title: "Action 1", desc: "Desc 1", category: "Transport", difficulty: "EASY", savings: "10.00" }
      ]
    };
    const { container } = render(<DashboardScreen data={mockData} goHome={() => {}} recalculate={() => {}} />);
    expect(container).toBeInTheDocument();
  });
});
