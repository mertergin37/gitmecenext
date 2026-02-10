import { supabase } from '@/lib/supabase';
import { DecisionResult } from '@/types/decision';
import { Destination } from '@/types/destination';

export const HistoryService = {
    async saveDecision(userId: string, destination: Destination, result: DecisionResult) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('decisions')
            .insert({
                user_id: userId,
                destination_id: destination.id,
                destination_name: destination.name,
                verdict: result.verdict,
                score: result.matchScore,
                breakdown: result.breakdown,
                penalties: result.penalties,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving decision:', error);
            throw error;
        }
        return data;
    },

    async getUserHistory(userId: string) {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('decisions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching history:', error);
            throw error;
        }
        return data;
    },

    async toggleFavorite(decisionId: string, isFavorite: boolean) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('decisions')
            .update({ is_favorite: isFavorite })
            .eq('id', decisionId)
            .select()
            .single();

        if (error) {
            console.error('Error toggling favorite:', error);
            throw error;
        }
        return data;
    },

    async updateTodoList(decisionId: string, todoList: any[]) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('decisions')
            .update({ todo_list: todoList })
            .eq('id', decisionId)
            .select()
            .single();

        if (error) {
            console.error('Error updating todo list:', error);
            throw error;
        }
        return data;
    }
};
