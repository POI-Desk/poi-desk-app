import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const lightTheme: CustomThemeConfig = {
	name: 'light-theme',
	properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "255 255 255",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "0 0 0",
		"--on-success": "255 255 255",
		"--on-warning": "255 255 255",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #1A4775
		"--color-primary-50": "221 227 234", // #dde3ea
		"--color-primary-100": "209 218 227", // #d1dae3
		"--color-primary-200": "198 209 221", // #c6d1dd
		"--color-primary-300": "163 181 200", // #a3b5c8
		"--color-primary-400": "95 126 158", // #5f7e9e
		"--color-primary-500": "26 71 117", // #1A4775
		"--color-primary-600": "23 64 105", // #174069
		"--color-primary-700": "20 53 88", // #143558
		"--color-primary-800": "16 43 70", // #102b46
		"--color-primary-900": "13 35 57", // #0d2339
		// secondary | #A8ADB3
		"--color-secondary-50": "242 243 244", // #f2f3f4
		"--color-secondary-100": "238 239 240", // #eeeff0
		"--color-secondary-200": "233 235 236", // #e9ebec
		"--color-secondary-300": "220 222 225", // #dcdee1
		"--color-secondary-400": "194 198 202", // #c2c6ca
		"--color-secondary-500": "168 173 179", // #A8ADB3
		"--color-secondary-600": "151 156 161", // #979ca1
		"--color-secondary-700": "126 130 134", // #7e8286
		"--color-secondary-800": "101 104 107", // #65686b
		"--color-secondary-900": "82 85 88", // #525558
		// tertiary | #D4D6D9
		"--color-tertiary-50": "249 249 249", // #f9f9f9
		"--color-tertiary-100": "246 247 247", // #f6f7f7
		"--color-tertiary-200": "244 245 246", // #f4f5f6
		"--color-tertiary-300": "238 239 240", // #eeeff0
		"--color-tertiary-400": "225 226 228", // #e1e2e4
		"--color-tertiary-500": "212 214 217", // #D4D6D9
		"--color-tertiary-600": "191 193 195", // #bfc1c3
		"--color-tertiary-700": "159 161 163", // #9fa1a3
		"--color-tertiary-800": "127 128 130", // #7f8082
		"--color-tertiary-900": "104 105 106", // #68696a
		// success | #8CAE68
		"--color-success-50": "238 243 232", // #eef3e8
		"--color-success-100": "232 239 225", // #e8efe1
		"--color-success-200": "226 235 217", // #e2ebd9
		"--color-success-300": "209 223 195", // #d1dfc3
		"--color-success-400": "175 198 149", // #afc695
		"--color-success-500": "140 174 104", // #8CAE68
		"--color-success-600": "126 157 94", // #7e9d5e
		"--color-success-700": "105 131 78", // #69834e
		"--color-success-800": "84 104 62", // #54683e
		"--color-success-900": "69 85 51", // #455533
		// warning | #EB5E28
		"--color-warning-50": "252 231 223", // #fce7df
		"--color-warning-100": "251 223 212", // #fbdfd4
		"--color-warning-200": "250 215 201", // #fad7c9
		"--color-warning-300": "247 191 169", // #f7bfa9
		"--color-warning-400": "241 142 105", // #f18e69
		"--color-warning-500": "235 94 40", // #EB5E28
		"--color-warning-600": "212 85 36", // #d45524
		"--color-warning-700": "176 71 30", // #b0471e
		"--color-warning-800": "141 56 24", // #8d3818
		"--color-warning-900": "115 46 20", // #732e14
		// error | #DF3B57
		"--color-error-50": "250 226 230", // #fae2e6
		"--color-error-100": "249 216 221", // #f9d8dd
		"--color-error-200": "247 206 213", // #f7ced5
		"--color-error-300": "242 177 188", // #f2b1bc
		"--color-error-400": "233 118 137", // #e97689
		"--color-error-500": "223 59 87", // #DF3B57
		"--color-error-600": "201 53 78", // #c9354e
		"--color-error-700": "167 44 65", // #a72c41
		"--color-error-800": "134 35 52", // #862334
		"--color-error-900": "109 29 43", // #6d1d2b
		// surface | #49216B
		"--color-surface-50": "228 222 233", // #e4dee9
		"--color-surface-100": "219 211 225", // #dbd3e1
		"--color-surface-200": "210 200 218", // #d2c8da
		"--color-surface-300": "182 166 196", // #b6a6c4
		"--color-surface-400": "128 100 151", // #806497
		"--color-surface-500": "73 33 107", // #49216B
		"--color-surface-600": "66 30 96", // #421e60
		"--color-surface-700": "55 25 80", // #371950
		"--color-surface-800": "44 20 64", // #2c1440
		"--color-surface-900": "36 16 52", // #241034

	}
};
