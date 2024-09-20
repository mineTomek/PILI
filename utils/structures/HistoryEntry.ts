type HistoryEntry<T> = {
  id: string;
  modified_object_id: string;
  author_id: string;
  author_session_name?: string;
  timestamp: number;
  state: T;
  tags: string[];
};
