export const IEmailProvider = Symbol('IEmailProvider')

export interface IEmailProvider {
	sendMail(email: string, subject: string, html: string): Promise<unknown>
}
