import { APP_NAME, CLIENT_URL, type I18nService, PATHS } from "@/core";

import {
  Button,
  Heading,
  Link,
  Section,
  Tailwind,
  Text
} from "@react-email/components";
import { TemplateWrapper } from "./components";
import { ISessionMetadata } from "@/shared/types";

export interface IProps {
  url: string;
  i18n?: I18nService;
  lng?: string;
  metadata: ISessionMetadata
}

export function ResetPasswordTemplate({ url, i18n, lng='en', metadata }: IProps) {
    
    const t = i18n.t('mail.reset_password', { lng })
    const request_info = i18n.t('mail.reset_password.request_info', { lng })
    const tTemp = i18n.t('mail.template', { lng })

    return (
        <TemplateWrapper template='reset_password' lng={lng} i18n={i18n} >
            <Tailwind>
                <Section className="font-sans tracking-wide font-normal text-[#222222] mb-2 px-2">
                    <Heading as="h2" className="text-center">{t('title') || "Verify your email address"}</Heading>

                    <Text className="text-center">{t('intro', {app: APP_NAME}) || `We received a request to reset the password for your ${APP_NAME} account. If it was you, click the button below to choose a new password.`}</Text>
                </Section>

                <Button
                    className="box-border w-fit rounded-lg m-auto bg-[#2B7AFF] px-6 py-3 text-center font-normal font-sans traking-wider text-white"
                    href={url}
                >
                    {t('cta') || "Create new password"}
                </Button>
                
                <Section className="text-center px-2 mt-4">
                    <Text className="text-center font-sans tracking-wide font-normal text-[#222222] m-0">{tTemp('copyLinkHint') || "Or paste this link into your browser:"}</Text>
                    <Link href={url} className="font-sans tracking-[0px] text-center text-sm w-full" >{url}</Link>
                </Section>

                <Section className='bg-gray-100 rounded-lg p-6 mb-6'>
                    <Heading 
                        className='text-xl font-semibold text-[#18B9AE]'
                    >
                        {request_info('title') || "Request details:"}
                    </Heading>
                    <ul className="list-disc list-inside text-black mt-2">
                        <li>{request_info('location', {country: metadata.location.country, city: metadata.location.city}) || `🌍 Location: ${metadata.location.country}, ${metadata.location.city}`}</li>
                        <li>{request_info('os', {os: metadata.device.os}) || `📱 Operating system: ${metadata.device.os}`}</li>
                        <li>{request_info('os', {browser: metadata.device.browser}) || `🌐 Browser: ${metadata.device.browser}`}</li>
                        <li>{request_info('os', {ip: metadata.ip}) || `💻 IP address:: ${metadata.ip}`}</li>
                    </ul>
                    <Text className='text-gray-600 mt-2'>
                       {request_info('note')}
                    </Text>
                </Section>
            </Tailwind>
        </TemplateWrapper>
    );
}