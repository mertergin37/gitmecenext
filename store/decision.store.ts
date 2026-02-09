import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types/decision';
import { QUESTIONS } from '@/features/decision-flow/config/questions';

interface DecisionState {
    answers: UserProfile;
    currentQuestionIndex: number;

    // Actions
    setAnswer: (questionId: string, value: number) => void;
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

            setAnswer: (questionId, value) =>
                set((state) => ({
                    answers: { ...state.answers, [questionId]: value }
                })),

            nextQuestion: () =>
                set((state) => ({
                    currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, QUESTIONS.length)
                })),

            prevQuestion: () =>
                set((state) => ({
                    currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
                })),

            reset: () => set({ answers: {}, currentQuestionIndex: 0 }),

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
