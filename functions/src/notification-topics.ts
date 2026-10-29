type TokenDocument = { tokens?: unknown } | undefined | null;
type TopicMessaging = {
  subscribeToTopic(tokens: string[], topic: string): Promise<{ successCount: number; failureCount: number }>;
  unsubscribeFromTopic(tokens: string[], topic: string): Promise<{ successCount: number; failureCount: number }>;
};

function tokenSet(document: TokenDocument): Set<string> {
  const value = document?.tokens;
  const values = Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
  return new Set(values.filter((token): token is string => typeof token === "string").map(token => token.trim()).filter(Boolean));
}

/** Firestore arrayRemove and document deletion must revoke the same topics as the HTTP API. */
export async function syncUserTokenTopics(options: { messaging: TopicMessaging; userId: string; before?: TokenDocument; after?: TokenDocument }) {
  const { messaging, userId } = options;
  if (!/^[A-Za-z0-9\-_.~%]+$/.test(userId)) throw new Error("INVALID_FCM_USER_TOPIC");
  const before = tokenSet(options.before), after = tokenSet(options.after);
  const added = [...after].filter(token => !before.has(token));
  const removed = [...before].filter(token => !after.has(token));
  const result = { addedTokens: added.length, removedTokens: removed.length, topicCalls: 0, failedSubscriptions: 0 };
  // Topic management accepts at most 1,000 registration tokens per call.
  for (const [method, tokens] of [["unsubscribeFromTopic", removed], ["subscribeToTopic", added]] as const) {
    for (let offset = 0; offset < tokens.length; offset += 1000) {
      const batch = tokens.slice(offset, offset + 1000);
      for (const topic of [`user_${userId}`, "all_users"]) {
        try {
          const response = await messaging[method](batch, topic);
          result.topicCalls++;
          result.failedSubscriptions += response.failureCount;
        } catch {
          // SDK errors can include registration tokens. Propagate a safe code
          // instead of logging the raw SDK error or reporting false success.
          throw new Error("FCM_TOPIC_SYNC_FAILED");
        }
      }
    }
  }
  return result;
}
