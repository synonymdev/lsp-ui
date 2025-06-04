import reducer, {
    initialState,
    navigate,
    setCurrency,
    setOrderId,
    setShowMenu,
    selectCurrentPage,
    selectCurrency,
    selectCurrentOrderId,
    selectShowMenu
  } from '../store/public-store';
  
  describe('publicStore reducer', () => {
    it('should handle navigation updates', () => {
      const state = reducer(initialState, navigate({ page: 'payment', orderId: 'abc123' }));
      expect(state.navigation.page).toBe('payment');
      expect(state.navigation.orderId).toBe('abc123');
    });
  
    it('should set currency', () => {
      const state = reducer(initialState, setCurrency('EUR'));
      expect(state.settings.currency).toBe('EUR');
    });
  
    it('should set order ID', () => {
      const state = reducer(initialState, setOrderId('xyz789'));
      expect(state.navigation.orderId).toBe('xyz789');
    });
  
    it('should toggle menu visibility', () => {
      const state = reducer(initialState, setShowMenu(true));
      expect(state.navigation.showMenu).toBe(true);
    });
  });
  
  describe('publicStore selectors', () => {
    const mockState = {
      bt: {
        ...initialState,
        navigation: {
          ...initialState.navigation,
          page: 'confirm',
          orderId: 'order42',
          showMenu: true
        },
        settings: {
          currency: 'JPY'
        }
      }
    };
  
    it('should select the current page', () => {
      expect(selectCurrentPage(mockState as any)).toBe('confirm');
    });
  
    it('should select the currency', () => {
      expect(selectCurrency(mockState as any)).toBe('JPY');
    });
  
    it('should select the order ID', () => {
      expect(selectCurrentOrderId(mockState as any)).toBe('order42');
    });
  
    it('should select showMenu as true', () => {
      expect(selectShowMenu(mockState as any)).toBe(true);
    });
  });
  