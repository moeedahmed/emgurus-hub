export interface Message {
    role: 'user' | 'assistant';
    content: string;
    contextLabel?: string; // e.g., "Roadmap", "Step 1", etc.
}
