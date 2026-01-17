import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendMessage,
  markMessagesAsRead,
  createOrGetChat,
} from "@/domain/chat/chat.actions";
import { TMessage } from "@/domain/chat/chat.schema";

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<TMessage, Error, { chatId: string; content: string }>({
    mutationFn: async ({ chatId, content }) => {
      return await sendMessage(chatId, content);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chat", variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

export function useMarkMessagesAsRead() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { chatId: string; userId: string }>({
    mutationFn: async ({ chatId, userId }) => {
      return await markMessagesAsRead(chatId, userId);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chat", variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      // Might also want to invalidate unread counts if that query exists
      queryClient.invalidateQueries({ queryKey: ["unread"] });
    },
  });
}

export function useCreateOrGetChat() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, { otherUserId: string }>({
    mutationFn: async ({ otherUserId }) => {
      return await createOrGetChat(otherUserId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}
