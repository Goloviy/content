import { assign, createMachine } from 'xstate'

export const modalMachine = createMachine(
  {
    id: 'modalMachine',
    initial: 'closed',
    context: {
      isOpenModal: false,
      currentPage: 1,
      totalPages: 1,
    },
    states: {
      closed: {
        on: {
          TOGGLE: {
            target: 'open',
            actions: ['toggleModalState'],
          },
          SET_MODAL_OPEN: {
            actions: ['setModalOpen'],
          },
          SET_TOTAL_PAGES: {
            actions: ['setTotalPages'],
          },
          SET_CURRENT_PAGE: {
            actions: ['setCurrentPage'],
          },
        },
      },
      open: {
        on: {
          TOGGLE: {
            target: 'closed',
            actions: ['toggleModalState'],
          },
          SET_MODAL_OPEN: {
            actions: ['setModalOpen'],
          },
          NEXT_PAGE: {
            actions: ['nextPage'],
          },
          PREV_PAGE: {
            actions: ['prevPage'],
          },
          SET_TOTAL_PAGES: {
            actions: ['setTotalPages'],
          },
        },
      },
    },
  },
  {
    actions: {
      toggleModalState: assign({
        isOpenModal: state => !state.context.isOpenModal,
      }),
      setModalOpen: assign({
        isOpenModal: ({ event: { value } }) => value,
      }),
      nextPage: assign({
        currentPage: ({ context }) => (context.currentPage === context.totalPages ? 1 : context.currentPage + 1),
      }),
      prevPage: assign({
        currentPage: ({ context }) => (context.currentPage === 1 ? context.totalPages : context.currentPage - 1),
      }),
      setTotalPages: assign({
        totalPages: ({ event: { value } }) => value,
      }),
      setCurrentPage: assign({
        currentPage: ({ event: { value } }) => value,
      }),
    },
  },
)
