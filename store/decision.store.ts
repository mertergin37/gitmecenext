import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types/decision';
import { QUESTIONS } from '@/features/decision-flow/config/questions';

interface DecisionState {
    answers: UserProfile;
    currentQuestionIndex: number;
    selectedDestination: string | null;
    selectedMonth: number | null;

    // Actions
    setAnswer: (questionId: string, value: number) => void;
    setDestination: (destinationId: string) => void;
    setMonth: (month: number) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    reset: () => void;

    // Computed (handled via getters or derived state where needed)
    isComplete: () => boolean;
}

export const useDecisionStore = create<DecisionState>()(
    persist(
        (set, get) => ({
            answers: {},
            currentQuestionIndex: 0,
            selectedDestination: null,
            selectedMonth: null,

            setAnswer: (questionId, value) =>
                set((state) => ({
                    answers: { ...state.answers, [questionId]: value }
                })),

            setDestination: (destinationId) =>
                set({ selectedDestination: destinationId }),

            setMonth: (month) =>
                set({ selectedMonth: month }),

            nextQuestion: () =>
                set((state) => ({
                    currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, QUESTIONS.length)
                })),

            prevQuestion: () =>
                set((state) => ({
                    currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
                })),

            reset: () => set({ answers: {}, currentQuestionIndex: 0, selectedDestination: null, selectedMonth: null }),

            isComplete: () => {
                const state = get();
                // Check if we are past the last question
                return state.currentQuestionIndex >= QUESTIONS.length;
            }
        }),
        {
            name: 'gitmece-decision-storage', // unique name
        }
    )
);
