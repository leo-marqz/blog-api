
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Generate a random username (e.g. user-abc123)
 */

export const generateUsername = (): string => {
    const usernamePrefix = 'user-';
    const randomString = Math.random().toString(36).substring(2);
    const username = usernamePrefix + randomString;
    return username;
}
