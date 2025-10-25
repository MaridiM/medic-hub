import type { HelmetOptions } from 'helmet'

const isDev = process.env.NODE_ENV !== 'production'

/**
 * Helmet.js configuration for enhancing application security through HTTP headers.
 * This configuration sets up a strict Content Security Policy (CSP) and other
 * security-related headers.
 *
 * @see https://helmetjs.github.io/
 */
export const helmetConfig: HelmetOptions = {
	/**
	 * Content Security Policy (CSP)
	 * Helps prevent cross-site scripting (XSS) and other injection attacks.
	 * This policy is strict by default and should be customized for your application's needs.
	 */
	contentSecurityPolicy: {
		useDefaults: true,
		directives: {
			/** Default source for all content types */
			defaultSrc: ["'self'"],

			/** Defines valid sources for scripts */
			scriptSrc: ["'self'", "'unsafe-inline'", ...(isDev ? ['https://cdn.jsdelivr.net'] : [])], // 'unsafe-inline' is often needed for GraphQL Playground, remove for production if possible

			/** Defines valid sources for styles */
			styleSrc: [
				"'self'",
				"'unsafe-inline'",
				'https://fonts.googleapis.com',
				...(isDev ? ['https://cdn.jsdelivr.net'] : []),
			],

			/** Defines valid sources for images */
			imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com', ...(isDev ? ['https://cdn.jsdelivr.net'] : [])], // Allow self, data URIs, and Cloudinary

			/** Defines valid sources for fonts */
			fontSrc: ["'self'", 'https://fonts.gstatic.com'],

			/** Defines valid sources for frames */
			frameSrc: ["'self'"], // Disallow framing by default

			/** Defines valid sources for workers and nested browsing contexts */
			childSrc: ["'self'"],

			/** Defines valid sources for connections (e.g., WebSockets, fetch) */
			connectSrc: ["'self'", 'http://localhost:*'],

			/** Defines valid sources for object, embed, and applet elements */
			objectSrc: ["'none'"], // Disallow plugins like Flash

			/** Instructs user agents to report CSP violations */
			// reportUri: ['/csp-violation-report-endpoint'], // Uncomment and set up a reporting endpoint if needed
		},
	},

	/**
	 * HTTP Strict Transport Security (HSTS)
	 * Enforces secure (HTTPS) connections to the server.
	 * Make sure your site is fully served over HTTPS before enabling.
	 */
	strictTransportSecurity: {
		maxAge: 31536000, // 1 year in seconds
		includeSubDomains: true,
		preload: true,
	},

	/**
	 * X-Content-Type-Options
	 * Prevents browsers from MIME-sniffing a response away from the declared content-type.
	 */
	xContentTypeOptions: true,

	/**
	 * X-Frame-Options
	 * Provides clickjacking protection. 'DENY' prevents the page from being displayed in a frame.
	 */
	xFrameOptions: {
		action: 'deny',
	},

	/**
	 * Cross-Origin-Embedder-Policy
	 * Prevents a document from loading any cross-origin resources that don't explicitly grant permission.
	 */
	crossOriginEmbedderPolicy: false, // Set to false to avoid issues with some CDNs/scripts unless specifically needed

	/**
	 * Cross-Origin-Opener-Policy
	 * Prevents other domains from opening your page in a new window and gaining access to it.
	 */
	crossOriginOpenerPolicy: {
		policy: 'same-origin', // Recommended default
	},

	/**
	 * Cross-Origin-Resource-Policy
	 * Controls which cross-origin requests are allowed to your resources.
	 */
	crossOriginResourcePolicy: {
		policy: 'same-origin', // Good default
	},

	/**
	 * Referrer-Policy
	 * Controls how much referrer information (sent via the Referer header) should be included with requests.
	 * 'strict-origin-when-cross-origin' is a good default for privacy.
	 */
	referrerPolicy: {
		policy: 'strict-origin-when-cross-origin',
	},

	/**
	 * Permissions-Policy
	 * Allows you to control which features and APIs can be used in the browser.
	 */
	// ❌ Удаляем проблемную опцию
	// permissionsPolicy: {
	// 	features: {
	// 		geolocation: ["'none'"],
	// 		microphone: ["'none'"],
	// 		camera: ["'none'"],
	// 		payment: ["'none'"],
	// 	},
	// },
}
