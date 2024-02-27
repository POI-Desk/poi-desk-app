// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession(): User;
		}
		interface PageData {
			sussy: string;
		}
		interface Session {
			sessionToken: string;
		}
		// interface Platform {}
	}
}

export {};
