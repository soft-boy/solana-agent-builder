export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface Conversation {
    id: number;
    title: string;
    date: string;
}  