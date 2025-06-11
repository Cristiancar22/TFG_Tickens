import { render } from '@testing-library/react-native';
import { useBudgets } from '@/store/useBudgets';
import { BudgetList } from '@/components/home';

jest.mock('@/store/useBudgets');
const mockedUseBudgets = useBudgets as jest.Mock;

const withBudgets = (budgets: any[]) =>
    mockedUseBudgets.mockImplementation((selector) => selector({ budgets }));

describe('BudgetList', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('muestra mensaje "No hay presupuestos" cuando la lista está vacía', () => {
        withBudgets([]);

        const { getByLabelText } = render(<BudgetList />);

        expect(getByLabelText('budget-list-title')).toBeTruthy();
        expect(getByLabelText('no-budgets')).toBeTruthy();
    });

    it('renderiza los presupuestos cuando existen', () => {
        const fakeBudgets = [
            { id: '1', name: 'Comida', spentAmount: 20, limitAmount: 100 },
            { id: '2', name: 'Ocio', spentAmount: 30, limitAmount: 150 },
        ];

        withBudgets(fakeBudgets);

        const { getByLabelText, queryByLabelText } = render(<BudgetList />);

        expect(getByLabelText('budget-list-container')).toBeTruthy();
        expect(queryByLabelText('no-budgets')).toBeNull();

        expect(getByLabelText('budget-item-1')).toBeTruthy();
        expect(getByLabelText('budget-item-2')).toBeTruthy();
    });
});
