import { APP_NAME } from '@/core/config'
import type { I18nService } from '@/core/i18n'
import { Button, Heading, Link, Section, Tailwind, Text } from '@react-email/components'

import { TemplateWrapper } from '../components'

interface IProps {
	securityUrl: string
	lockAccountUrl: string
	i18n?: I18nService
	lng?: string
	eventDescription: string
	riskScore: number
	timestamp: string
}

export function SuspiciousActivityTemplate({
	securityUrl,
	lockAccountUrl,
	i18n,
	lng = 'en',
	eventDescription,
	riskScore,
	timestamp,
}: IProps) {
	const t = i18n.t('mail.suspicious_activity', { lng })
	const tTemp = i18n.t('mail.template', { lng })

	const riskLevel = riskScore >= 80 ? 'CRITICAL' : riskScore >= 60 ? 'HIGH' : 'MEDIUM'
	const riskColor = riskLevel === 'CRITICAL' ? 'red' : riskLevel === 'HIGH' ? 'orange' : 'yellow'

	return (
		<TemplateWrapper template="suspicious_activity" lng={lng} i18n={i18n}>
			<Tailwind>
				<Section className="mb-2 px-2 font-sans font-normal tracking-wide text-[#222222]">
					<Heading as="h2" className="text-center text-red-600">
						{t('title') || '🚨 Suspicious Activity Detected'}
					</Heading>

					<Text className="text-center font-semibold">
						{t('intro', { app: APP_NAME }) ||
							`We detected suspicious activity on your ${APP_NAME} account that requires your attention.`}
					</Text>

					<Section className={`mb-4 mt-4 rounded-lg border-2 border-${riskColor}-500 bg-${riskColor}-50 p-6`}>
						<Heading className={`text-xl font-bold text-${riskColor}-700`}>
							⚠️ {t('alert.title', { level: riskLevel }) || `${riskLevel} RISK DETECTED`}
						</Heading>
						<Text className={`mt-2 text-${riskColor}-900`}>
							{eventDescription}
						</Text>
						<div className="mt-4 rounded bg-white p-3">
							<Text className="m-0 text-sm font-semibold text-gray-700">
								{t('risk_score') || 'Risk Score:'}
							</Text>
							<div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-gray-200">
								<div
									className={`h-full bg-${riskColor}-600`}
									style={{ width: `${riskScore}%` }}
								/>
							</div>
							<Text className="mt-1 text-right text-xs text-gray-600">
								{riskScore}/100
							</Text>
						</div>
					</Section>

					<Section className="mb-4 rounded-lg bg-gray-100 p-4">
						<Text className="m-0 text-sm text-gray-600">
							{t('timestamp', { time: timestamp }) || `⏰ Detected at: ${timestamp}`}
						</Text>
					</Section>

					<Section className="mb-4 rounded-lg bg-blue-50 p-4">
						<Heading className="text-lg font-semibold text-blue-700">
							{t('what_to_do.title') || 'What should you do?'}
						</Heading>
						<ol className="mt-2 list-inside list-decimal text-gray-700">
							<li>{t('what_to_do.steps')[0] || 'Review your recent security activity'}</li>
							<li>{t('what_to_do.steps')[1] || 'Change your password if you suspect unauthorized access'}</li>
							<li>{t('what_to_do.steps')[2] || 'Enable 2FA if not already enabled'}</li>
							<li>{t('what_to_do.steps')[3] || 'Lock your account if you did not perform this action'}</li>
						</ol>
					</Section>
				</Section>

				<div className="flex justify-center gap-4">
					<Button
						className="box-border w-fit rounded-lg bg-[#2B7AFF] px-6 py-3 text-center font-sans font-normal tracking-wider text-white"
						href={securityUrl}
					>
						{t('cta') || 'Review Activity'}
					</Button>

					<Button
						className="box-border w-fit rounded-lg bg-red-600 px-6 py-3 text-center font-sans font-bold tracking-wider text-white"
						href={lockAccountUrl}
					>
						{t('cta_secondary') || 'Lock My Account'}
					</Button>
				</div>

				<Section className="mt-4 px-2 text-center">
					<Text className="m-0 text-center font-sans font-normal tracking-wide text-[#222222]">
						{tTemp('copyLinkHint') || 'Security review link:'}
					</Text>
					<Link href={securityUrl} className="w-full text-center text-sm font-sans tracking-[0px]">
						{securityUrl}
					</Link>
				</Section>
			</Tailwind>
		</TemplateWrapper>
	)
}