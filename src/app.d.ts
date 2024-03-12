// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession(): any;
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
