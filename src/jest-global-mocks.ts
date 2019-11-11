
const mock: Function = () => {
  let storage: any = {};
  return {
    getItem: (key: string) => (key in storage ? storage[key] : null), // tslint:disable-line
    setItem: (key: string, value: string) => (storage[key] = value || ''),
    removeItem: (key: string) => delete storage[key],
    clear: () => (storage = {}),
  };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance'],
});

const legacyController: object = {
  editDocument: (eobDocumentId: number): Promise<boolean> => {
    return new Promise((resolve: Function) => {
      resolve(123);
    });
  },
  editInvoice: (invoiceId: number, departmentId?: number, day?: Date): Promise<boolean> => {
    return new Promise((resolve: Function) => {
      resolve(123);
    });
  },
};

Object.defineProperty(window, 'angular', {
  value: {
    element: (element: object): object => {
      return {
        controller: (): object => {
          return legacyController;
        },
      };
    },
  },
});
