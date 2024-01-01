import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const lightTheme: CustomThemeConfig = {
	name: 'light-theme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `system-ui`,
		'--theme-font-family-heading': `system-ui`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '9999px',
		'--theme-rounded-container': '8px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '0 0 0',
		'--on-tertiary': 'var(--color-primary-500)',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '0 0 0',
		'--on-surface': 'var(--color-tertiary-500)',
		// =~= Theme Colors  =~=
		// primary | #1A4775
		'--color-primary-50': '221 227 234', // #dde3ea
		'--color-primary-100': '209 218 227', // #d1dae3
		'--color-primary-200': '198 209 221', // #c6d1dd
		'--color-primary-300': '163 181 200', // #a3b5c8
		'--color-primary-400': '95 126 158', // #5f7e9e
		'--color-primary-500': '26 71 117', // #1A4775
		'--color-primary-600': '23 64 105', // #174069
		'--color-primary-700': '20 53 88', // #143558
		'--color-primary-800': '16 43 70', // #102b46
		'--color-primary-900': '13 35 57', // #0d2339
		// secondary | #9EBBD9
		'--color-secondary-50': '240 245 249', // #f0f5f9
		'--color-secondary-100': '236 241 247', // #ecf1f7
		'--color-secondary-200': '231 238 246', // #e7eef6
		'--color-secondary-300': '216 228 240', // #d8e4f0
		'--color-secondary-400': '187 207 228', // #bbcfe4
		'--color-secondary-500': '158 187 217', // #9EBBD9
		'--color-secondary-600': '142 168 195', // #8ea8c3
		'--color-secondary-700': '119 140 163', // #778ca3
		'--color-secondary-800': '95 112 130', // #5f7082
		'--color-secondary-900': '77 92 106', // #4d5c6a
		// tertiary | #D1F3FF
		'--color-tertiary-50': '248 253 255', // #f8fdff
		'--color-tertiary-100': '246 253 255', // #f6fdff
		'--color-tertiary-200': '244 252 255', // #f4fcff
		'--color-tertiary-300': '237 250 255', // #edfaff
		'--color-tertiary-400': '223 247 255', // #dff7ff
		'--color-tertiary-500': '209 243 255', // #D1F3FF
		'--color-tertiary-600': '188 219 230', // #bcdbe6
		'--color-tertiary-700': '157 182 191', // #9db6bf
		'--color-tertiary-800': '125 146 153', // #7d9299
		'--color-tertiary-900': '102 119 125', // #66777d
		// success | #57E833
		'--color-success-50': '230 252 224', // #e6fce0
		'--color-success-100': '221 250 214', // #ddfad6
		'--color-success-200': '213 249 204', // #d5f9cc
		'--color-success-300': '188 246 173', // #bcf6ad
		'--color-success-400': '137 239 112', // #89ef70
		'--color-success-500': '87 232 51', // #57E833
		'--color-success-600': '78 209 46', // #4ed12e
		'--color-success-700': '65 174 38', // #41ae26
		'--color-success-800': '52 139 31', // #348b1f
		'--color-success-900': '43 114 25', // #2b7219
		// warning | #E86C27
		'--color-warning-50': '252 233 223', // #fce9df
		'--color-warning-100': '250 226 212', // #fae2d4
		'--color-warning-200': '249 218 201', // #f9dac9
		'--color-warning-300': '246 196 169', // #f6c4a9
		'--color-warning-400': '239 152 104', // #ef9868
		'--color-warning-500': '232 108 39', // #E86C27
		'--color-warning-600': '209 97 35', // #d16123
		'--color-warning-700': '174 81 29', // #ae511d
		'--color-warning-800': '139 65 23', // #8b4117
		'--color-warning-900': '114 53 19', // #723513
		// error | #E8291C
		'--color-error-50': '252 223 221', // #fcdfdd
		'--color-error-100': '250 212 210', // #fad4d2
		'--color-error-200': '249 202 198', // #f9cac6
		'--color-error-300': '246 169 164', // #f6a9a4
		'--color-error-400': '239 105 96', // #ef6960
		'--color-error-500': '232 41 28', // #E8291C
		'--color-error-600': '209 37 25', // #d12519
		'--color-error-700': '174 31 21', // #ae1f15
		'--color-error-800': '139 25 17', // #8b1911
		'--color-error-900': '114 20 14', // #72140e
		// surface | #49216B
		'--color-surface-50': '228 222 233', // #e4dee9
		'--color-surface-100': '219 211 225', // #dbd3e1
		'--color-surface-200': '210 200 218', // #d2c8da
		'--color-surface-300': '182 166 196', // #b6a6c4
		'--color-surface-400': '128 100 151', // #806497
		'--color-surface-500': '73 33 107', // #49216B
		'--color-surface-600': '66 30 96', // #421e60
		'--color-surface-700': '55 25 80', // #371950
		'--color-surface-800': '44 20 64', // #2c1440
		'--color-surface-900': '36 16 52' // #241034
	}
};
