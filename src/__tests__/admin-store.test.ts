import reducer, {
    initialState,
    filterOrdersByState,
    selectOrders,
  } from '../store/admin-store';
  
  describe('adminStore reducer', () => {
    it('should update the filter state', () => {
      const nextState = reducer(initialState, filterOrdersByState(1));
      expect(nextState.orders.value.filters.state).toBe(1);
    });

  
    it('should return all orders when filter is undefined', () => {
      const mockState = {
        btAdmin: {
          ...initialState,
          orders: {
            ...initialState.orders,
            value: {
              list: [
                { state: 1, id: 'a' },
                { state: 2, id: 'b' }
              ],
              filters: { state: undefined }
            }
          }
        }
      };
      const allOrders = selectOrders(mockState as any);
      expect(allOrders).toHaveLength(2);
    });
  });
  